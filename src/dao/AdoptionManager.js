import Adoption from '../models/Adoption.js';

export default class AdoptionManager {
  async getAll(filter = {}) {
    return await Adoption.find(filter)
      .populate('pet')
      .populate('user', 'first_name last_name email')
      .populate('reviewedBy', 'first_name last_name email');
  }

  async getById(id) {
    return await Adoption.findById(id)
      .populate('pet')
      .populate('user', 'first_name last_name email')
      .populate('reviewedBy', 'first_name last_name email');
  }

  async create(data) {
    const adoption = new Adoption(data);
    return await adoption.save();
  }

  async update(id, data) {
    return await Adoption.findByIdAndUpdate(id, data, { new: true })
      .populate('pet')
      .populate('user', 'first_name last_name email')
      .populate('reviewedBy', 'first_name last_name email');
  }

  async delete(id) {
    return await Adoption.findByIdAndDelete(id);
  }

  async getByUser(userId) {
    return await Adoption.find({ user: userId })
      .populate('pet')
      .populate('user', 'first_name last_name email');
  }

  async getByPet(petId) {
    return await Adoption.find({ pet: petId })
      .populate('pet')
      .populate('user', 'first_name last_name email');
  }

  async approve(id, reviewerId) {
    return await Adoption.findByIdAndUpdate(
      id,
      { status: 'approved', reviewedBy: reviewerId },
      { new: true }
    )
      .populate('pet')
      .populate('user', 'first_name last_name email')
      .populate('reviewedBy', 'first_name last_name email');
  }

  async reject(id, reviewerId, notes = '') {
    return await Adoption.findByIdAndUpdate(
      id,
      { status: 'rejected', reviewedBy: reviewerId, notes },
      { new: true }
    )
      .populate('pet')
      .populate('user', 'first_name last_name email')
      .populate('reviewedBy', 'first_name last_name email');
  }
}
