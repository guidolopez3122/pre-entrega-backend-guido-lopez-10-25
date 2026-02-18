import User from '../models/User.js';

class UserDAO {
  async findAll() {
    return await User.find().lean();
  }

  async findById(id) {
    return await User.findById(id).lean();
  }

  async findByEmail(email) {
    return await User.findOne({ email }).lean();
  }

  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async update(id, userData) {
    return await User.findByIdAndUpdate(id, userData, { new: true }).lean();
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }

  async findByResetToken(token) {
    return await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    }).lean();
  }

  async updatePassword(id, hashedPassword) {
    return await User.findByIdAndUpdate(
      id,
      { 
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      },
      { new: true }
    ).lean();
  }

  async setResetToken(id, token, expires) {
    return await User.findByIdAndUpdate(
      id,
      {
        resetPasswordToken: token,
        resetPasswordExpires: expires
      },
      { new: true }
    ).lean();
  }
}

export default new UserDAO();
