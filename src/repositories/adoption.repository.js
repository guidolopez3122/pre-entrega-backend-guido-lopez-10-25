import AdoptionManager from '../dao/AdoptionManager.js';
import { AdoptionDTO } from '../dto/adoption.dto.js';

class AdoptionRepository {
  constructor() {
    this.dao = new AdoptionManager();
  }

  async getAll(filter = {}) {
    const adoptions = await this.dao.getAll(filter);
    return adoptions.map(adoption => new AdoptionDTO(adoption));
  }

  async getById(id) {
    const adoption = await this.dao.getById(id);
    return adoption ? new AdoptionDTO(adoption) : null;
  }

  async create(data) {
    const adoption = await this.dao.create(data);
    return new AdoptionDTO(adoption);
  }

  async update(id, data) {
    const adoption = await this.dao.update(id, data);
    return adoption ? new AdoptionDTO(adoption) : null;
  }

  async delete(id) {
    return await this.dao.delete(id);
  }

  async getByUser(userId) {
    const adoptions = await this.dao.getByUser(userId);
    return adoptions.map(adoption => new AdoptionDTO(adoption));
  }

  async getByPet(petId) {
    const adoptions = await this.dao.getByPet(petId);
    return adoptions.map(adoption => new AdoptionDTO(adoption));
  }

  async approve(id, reviewerId) {
    const adoption = await this.dao.approve(id, reviewerId);
    return adoption ? new AdoptionDTO(adoption) : null;
  }

  async reject(id, reviewerId, notes = '') {
    const adoption = await this.dao.reject(id, reviewerId, notes);
    return adoption ? new AdoptionDTO(adoption) : null;
  }
}

export default new AdoptionRepository();
