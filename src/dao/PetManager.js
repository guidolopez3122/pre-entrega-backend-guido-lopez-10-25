import Pet from '../models/Pet.js';

export default class PetManager {
  async getAll(filter = {}) {
    return await Pet.find(filter).populate('adoptedBy', 'first_name last_name email');
  }

  async getById(id) {
    return await Pet.findById(id).populate('adoptedBy', 'first_name last_name email');
  }

  async create(data) {
    const pet = new Pet(data);
    return await pet.save();
  }

  async update(id, data) {
    return await Pet.findByIdAndUpdate(id, data, { new: true }).populate('adoptedBy', 'first_name last_name email');
  }

  async delete(id) {
    return await Pet.findByIdAndDelete(id);
  }

  async getAvailable() {
    return await Pet.find({ status: 'available' });
  }

  async search(query) {
    return await Pet.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { species: { $regex: query, $options: 'i' } },
        { breed: { $regex: query, $options: 'i' } }
      ]
    });
  }
}
