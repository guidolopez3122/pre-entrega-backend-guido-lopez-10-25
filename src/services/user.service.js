import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import userRepository from '../repositories/user.repository.js';
import { sendResetEmail } from '../utils/email.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const RESET_TOKEN_EXPIRY = '1h';

export class UserService {
  async requestPasswordReset(email) {
    try {
      const user = await userRepository.getFullUserByEmail(email);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      const resetToken = jwt.sign(
        { id: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: RESET_TOKEN_EXPIRY }
      );

      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
      
      await userRepository.setResetToken(user._id, resetToken, expires);
      await sendResetEmail(email, resetToken);

      return { message: 'Email de recuperación enviado' };
    } catch (error) {
      throw new Error(`Error al solicitar recuperación: ${error.message}`);
    }
  }

  async resetPassword(token, newPassword) {
    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Find user with valid reset token
      const user = await userRepository.findByResetToken(token);
      if (!user) {
        throw new Error('Token inválido o expirado');
      }

      // Check if new password is different from old password
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        throw new Error('No puedes usar la misma contraseña anterior');
      }

      // Hash new password and update
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await userRepository.updatePassword(user._id, hashedPassword);

      return { message: 'Contraseña actualizada exitosamente' };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('El enlace ha expirado. Solicita uno nuevo.');
      }
      throw new Error(`Error al restablecer contraseña: ${error.message}`);
    }
  }

  async validateResetToken(token) {
    try {
      jwt.verify(token, JWT_SECRET);
      const user = await userRepository.findByResetToken(token);
      return !!user;
    } catch (error) {
      return false;
    }
  }
}

export default new UserService();
