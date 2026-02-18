import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import { UserDTO } from '../../dto/user.dto.js';
import userService from '../../services/user.service.js';

const router = express.Router();


router.post('/register', async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    const user = new User({ first_name, last_name, email, age, password });
    await user.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', passport.authenticate('login', { session: false }), (req, res) => {
  const token = jwt.sign(
    { id: req.user._id, email: req.user.email },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1h' }
  );
  res.json({ token, message: 'Login exitoso' });
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logout exitoso. Elimina el token del cliente.' });
});

router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
  const userDTO = new UserDTO(req.user);
  res.json({ user: userDTO });
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const result = await userService.requestPasswordReset(email);
    res.json(result);
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const result = await userService.resetPassword(token, newPassword);
    res.json(result);
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

router.get('/validate-reset-token', async (req, res) => {
  const { token } = req.query;
  try {
    const isValid = await userService.validateResetToken(token);
    if (isValid) {
      res.json({ valid: true });
    } else {
      res.status(400).json({ valid: false, message: 'Token inválido o expirado' });
    }
  } catch (error) {
    res.status(400).json({ valid: false, message: error.message });
  }
});


export default router;
