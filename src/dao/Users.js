import User from '../models/User.js';

class UsersDAO {
  async getAll() {
    return await User.find().lean();
  }

  async getById(id) {
    return await User.findById(id).lean();
  }

  async getByEmail(email) {
    return await User.findOne({ email }).lean();
  }

  async create(data) {
    const user = await User.create(data);
    return await this.getById(user._id);
  }

  async update(id, data) {
    return await User.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }

  async addPet(id, petId) {
    return await User.findByIdAndUpdate(
      id,
      { $push: { pets: petId } },
      { new: true }
    ).lean();
  }
}

export default UsersDAO;
