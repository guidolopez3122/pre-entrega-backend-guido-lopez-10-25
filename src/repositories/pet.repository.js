import PetManager from '../dao/PetManager.js';
import { PetDTO } from '../dto/pet.dto.js';

class PetRepository {
  constructor() {
    this.dao = new PetManager();
  }

  async getAll(filter = {}) {
    const pets = await this.dao.getAll(filter);
    return pets.map(pet => new PetDTO(pet));
  }

  async getById(id) {
    const pet = await this.dao.getById(id);
    return pet ? new PetDTO(pet) : null;
  }

  async create(data) {
    const pet = await this.dao.create(data);
    return new PetDTO(pet);
  }

  async update(id, data) {
    const pet = await this.dao.update(id, data);
    return pet ? new PetDTO(pet) : null;
  }

  async delete(id) {
    return await this.dao.delete(id);
  }

  async getAvailable() {
    const pets = await this.dao.getAvailable();
    return pets.map(pet => new PetDTO(pet));
  }

  async search(query) {
    const pets = await this.dao.search(query);
    return pets.map(pet => new PetDTO(pet));
  }
}

export default new PetRepository();
