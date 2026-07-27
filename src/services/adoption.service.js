import adoptionRepository from '../repositories/adoption.repository.js';
import petService from './pet.service.js';
import { AdoptionDTO } from '../dto/adoption.dto.js';

export class AdoptionService {
  async getAllAdoptions(filter = {}) {
    try {
      return await adoptionRepository.getAll(filter);
    } catch (error) {
      throw new Error(`Error al obtener adopciones: ${error.message}`);
    }
  }

  async getAdoptionById(id) {
    try {
      const adoption = await adoptionRepository.getById(id);
      if (!adoption) {
        throw new Error('Solicitud de adopción no encontrada');
      }
      return adoption;
    } catch (error) {
      throw new Error(`Error al obtener adopción: ${error.message}`);
    }
  }

  async createAdoption(data) {
    try {
      // Verify pet exists and is available
      const pet = await petService.getPetById(data.pet);
      if (!pet) {
        throw new Error('Mascota no encontrada');
      }
      if (pet.status !== 'available') {
        throw new Error('La mascota no está disponible para adopción');
      }

      // Check if user already has a pending adoption for this pet
      const existingAdoptions = await adoptionRepository.getByUser(data.user);
      const hasPending = existingAdoptions.some(
        a => a.pet?.id?.toString() === data.pet?.toString() && a.status === 'pending'
      );
      if (hasPending) {
        throw new Error('Ya tienes una solicitud de adopción pendiente para esta mascota');
      }

      const adoption = await adoptionRepository.create(data);
      
      // Update pet status to pending
      await petService.updatePet(data.pet, { status: 'pending' });
      
      return adoption;
    } catch (error) {
      throw new Error(`Error al crear solicitud de adopción: ${error.message}`);
    }
  }

  async updateAdoption(id, data) {
    try {
      const adoption = await adoptionRepository.update(id, data);
      if (!adoption) {
        throw new Error('Solicitud de adopción no encontrada');
      }
      return adoption;
    } catch (error) {
      throw new Error(`Error al actualizar adopción: ${error.message}`);
    }
  }

  async deleteAdoption(id) {
    try {
      const adoption = await adoptionRepository.getById(id);
      if (!adoption) {
        throw new Error('Solicitud de adopción no encontrada');
      }
      
      // If adoption was pending or approved, restore pet status to available
      if (['pending', 'approved'].includes(adoption.status) && adoption.pet?.id) {
        await petService.updatePet(adoption.pet.id, { status: 'available', adoptedBy: null, adoptedAt: null });
      }
      
      const result = await adoptionRepository.delete(id);
      return { message: 'Solicitud de adopción eliminada exitosamente' };
    } catch (error) {
      throw new Error(`Error al eliminar adopción: ${error.message}`);
    }
  }

  async approveAdoption(id, reviewerId) {
    try {
      const adoption = await adoptionRepository.getById(id);
      if (!adoption) {
        throw new Error('Solicitud de adopción no encontrada');
      }
      if (adoption.status !== 'pending') {
        throw new Error('Solo se pueden aprobar solicitudes pendientes');
      }

      const approved = await adoptionRepository.approve(id, reviewerId);
      
      // Mark pet as adopted
      if (approved.pet?.id) {
        await petService.markAsAdopted(approved.pet.id, approved.user?.id || approved.user);
      }
      
      return approved;
    } catch (error) {
      throw new Error(`Error al aprobar adopción: ${error.message}`);
    }
  }

  async rejectAdoption(id, reviewerId, notes = '') {
    try {
      const adoption = await adoptionRepository.getById(id);
      if (!adoption) {
        throw new Error('Solicitud de adopción no encontrada');
      }
      if (adoption.status !== 'pending') {
        throw new Error('Solo se pueden rechazar solicitudes pendientes');
      }

      const rejected = await adoptionRepository.reject(id, reviewerId, notes);
      
      // Restore pet status to available
      if (rejected.pet?.id) {
        await petService.updatePet(rejected.pet.id, { status: 'available', adoptedBy: null, adoptedAt: null });
      }
      
      return rejected;
    } catch (error) {
      throw new Error(`Error al rechazar adopción: ${error.message}`);
    }
  }

  async getUserAdoptions(userId) {
    try {
      return await adoptionRepository.getByUser(userId);
    } catch (error) {
      throw new Error(`Error al obtener adopciones del usuario: ${error.message}`);
    }
  }
}

export default new AdoptionService();
