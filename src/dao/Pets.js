import Pet from '../models/Pet.js';

class PetsDAO {
  async getAll(filter = {}) {
    return await Pet.find(filter).lean();
  }

  async getById(id) {
    return await Pet.findById(id).lean();
  }

  async create(data) {
    const pet = await Pet.create(data);
    return await this.getById(pet._id);
  }

  async update(id, data) {
    return await Pet.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return await Pet.findByIdAndDelete(id);
  }

  async getAvailable() {
    return await Pet.find({ status: 'available' }).lean();
  }

  async search(query = {}) {
    const filter = {};
    if (query.species) filter.species = query.species;
    if (query.status) filter.status = query.status;
    if (query.name) filter.name = { $regex: query.name, $options: 'i' };
    return await Pet.find(filter).lean();
  }

  async adopt(id, userId) {
    return await Pet.findByIdAndUpdate(
      id,
      { status: 'adopted', adoptedBy: userId, adoptedAt: new Date() },
      { new: true }
    ).lean();
  }
}

export default PetsDAO;
