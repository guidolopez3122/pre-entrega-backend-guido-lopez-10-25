import Adoption from '../models/Adoption.js';

class AdoptionsDAO {
  async getAll(filter = {}) {
    return await Adoption.find(filter)
      .populate('pet')
      .populate('user', 'first_name last_name email')
      .lean();
  }

  async getById(id) {
    return await Adoption.findById(id)
      .populate('pet')
      .populate('user', 'first_name last_name email')
      .lean();
  }

  async getByUser(userId) {
    return await Adoption.find({ user: userId })
      .populate('pet')
      .populate('user', 'first_name last_name email')
      .lean();
  }

  async getByPet(petId) {
    return await Adoption.findOne({ pet: petId })
      .populate('pet')
      .populate('user', 'first_name last_name email')
      .lean();
  }

  async create(data) {
    const adoption = await Adoption.create(data);
    return await this.getById(adoption._id);
  }

  async update(id, data) {
    return await Adoption.findByIdAndUpdate(id, data, { new: true })
      .populate('pet')
      .populate('user', 'first_name last_name email')
      .lean();
  }

  async delete(id) {
    return await Adoption.findByIdAndDelete(id);
  }

  async approve(id, reviewerId) {
    return await this.update(id, { status: 'approved', reviewedBy: reviewerId });
  }

  async reject(id, reviewerId, notes = '') {
    return await this.update(id, { status: 'rejected', reviewedBy: reviewerId, notes });
  }
}

export default AdoptionsDAO;
