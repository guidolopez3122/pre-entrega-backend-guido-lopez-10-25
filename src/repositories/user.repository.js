import userDAO from '../dao/user.dao.js';
import { UserDTO } from '../dto/user.dto.js';

class UserRepository {
  async getAll() {
    const users = await userDAO.findAll();
    return users.map(user => new UserDTO(user));
  }

  async getById(id) {
    const user = await userDAO.findById(id);
    return user ? new UserDTO(user) : null;
  }

  async getByEmail(email) {
    const user = await userDAO.findByEmail(email);
    return user ? new UserDTO(user) : null;
  }

  async getFullUserByEmail(email) {
    return await userDAO.findByEmail(email);
  }

  async getFullUserById(id) {
    return await userDAO.findById(id);
  }

  async create(userData) {
    const user = await userDAO.create(userData);
    return new UserDTO(user);
  }

  async update(id, userData) {
    const user = await userDAO.update(id, userData);
    return user ? new UserDTO(user) : null;
  }

  async delete(id) {
    return await userDAO.delete(id);
  }

  async findByResetToken(token) {
    return await userDAO.findByResetToken(token);
  }

  async updatePassword(id, hashedPassword) {
    return await userDAO.updatePassword(id, hashedPassword);
  }

  async setResetToken(id, token, expires) {
    return await userDAO.setResetToken(id, token, expires);
  }
}

export default new UserRepository();
