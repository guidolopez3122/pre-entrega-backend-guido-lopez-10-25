import petRepository from '../repositories/pet.repository.js';
import adoptionRepository from '../repositories/adoption.repository.js';

export class PetService {
  async getAllPets(filter = {}) {
    try {
      return await petRepository.getAll(filter);
    } catch (error) {
      throw new Error(`Error al obtener mascotas: ${error.message}`);
    }
  }

  async getPetById(id) {
    try {
      const pet = await petRepository.getById(id);
      if (!pet) {
        throw new Error('Mascota no encontrada');
      }
      return pet;
    } catch (error) {
      throw new Error(`Error al obtener mascota: ${error.message}`);
    }
  }

  async createPet(data) {
    try {
      const pet = await petRepository.create(data);
      return pet;
    } catch (error) {
      throw new Error(`Error al crear mascota: ${error.message}`);
    }
  }

  async updatePet(id, data) {
    try {
      const pet = await petRepository.update(id, data);
      if (!pet) {
        throw new Error('Mascota no encontrada');
      }
      return pet;
    } catch (error) {
      throw new Error(`Error al actualizar mascota: ${error.message}`);
    }
  }

  async deletePet(id) {
    try {
      // Check if pet has active adoption requests
      const adoptions = await adoptionRepository.getByPet(id);
      const activeAdoptions = adoptions.filter(a => 
        ['pending', 'approved'].includes(a.status)
      );
      if (activeAdoptions.length > 0) {
        throw new Error('No se puede eliminar una mascota con solicitudes de adopción activas');
      }
      
      const result = await petRepository.delete(id);
      if (!result) {
        throw new Error('Mascota no encontrada');
      }
      return { message: 'Mascota eliminada exitosamente' };
    } catch (error) {
      throw new Error(`Error al eliminar mascota: ${error.message}`);
    }
  }

  async getAvailablePets() {
    try {
      return await petRepository.getAvailable();
    } catch (error) {
      throw new Error(`Error al obtener mascotas disponibles: ${error.message}`);
    }
  }

  async searchPets(query) {
    try {
      return await petRepository.search(query);
    } catch (error) {
      throw new Error(`Error al buscar mascotas: ${error.message}`);
    }
  }

  async markAsAdopted(petId, userId) {
    try {
      const pet = await petRepository.update(petId, {
        status: 'adopted',
        adoptedBy: userId,
        adoptedAt: new Date()
      });
      if (!pet) {
        throw new Error('Mascota no encontrada');
      }
      return pet;
    } catch (error) {
      throw new Error(`Error al marcar mascota como adoptada: ${error.message}`);
    }
  }
}

export default new PetService();
