import AdoptionsDAO from '../dao/Adoptions.js';
import PetsDAO from '../dao/Pets.js';
import UsersDAO from '../dao/Users.js';

// Singleton instances of DAOs
export const adoptionsDao = new AdoptionsDAO();
export const petsDao = new PetsDAO();
export const usersDao = new UsersDAO();

// ---------------------------------------------------------------------------
// Adoption business logic
// ---------------------------------------------------------------------------

export async function getAllAdoptions(filter = {}) {
  return await adoptionsDao.getAll(filter);
}

export async function getAdoptionById(id) {
  const adoption = await adoptionsDao.getById(id);
  if (!adoption) throw new Error('Adopción no encontrada');
  return adoption;
}

export async function getUserAdoptions(userId) {
  return await adoptionsDao.getByUser(userId);
}

export async function createAdoption(data) {
  // Verify pet exists and is available
  const pet = await petsDao.getById(data.pet);
  if (!pet) throw new Error('Mascota no encontrada');
  if (pet.status !== 'available') throw new Error('La mascota no está disponible para adopción');

  // Check if there's already a pending adoption for this pet
  const existing = await adoptionsDao.getByPet(data.pet);
  if (existing && existing.status === 'pending') {
    throw new Error('Ya existe una solicitud de adopción pendiente para esta mascota');
  }

  return await adoptionsDao.create(data);
}

export async function updateAdoption(id, data) {
  return await adoptionsDao.update(id, data);
}

export async function deleteAdoption(id) {
  const result = await adoptionsDao.delete(id);
  if (!result) throw new Error('Adopción no encontrada');
  return { message: 'Adopción eliminada exitosamente' };
}

export async function approveAdoption(id, reviewerId) {
  const adoption = await adoptionsDao.getById(id);
  if (!adoption) throw new Error('Adopción no encontrada');
  if (adoption.status !== 'pending') throw new Error('Solo se pueden aprobar adopciones pendientes');

  // Approve the adoption
  const approved = await adoptionsDao.approve(id, reviewerId);

  // Mark the pet as adopted
  await petsDao.adopt(adoption.pet._id || adoption.pet, adoption.user._id || adoption.user);

  return approved;
}

export async function rejectAdoption(id, reviewerId, notes = '') {
  const adoption = await adoptionsDao.getById(id);
  if (!adoption) throw new Error('Adopción no encontrada');
  if (adoption.status !== 'pending') throw new Error('Solo se pueden rechazar adopciones pendientes');

  return await adoptionsDao.reject(id, reviewerId, notes);
}

// ---------------------------------------------------------------------------
// Pet business logic
// ---------------------------------------------------------------------------

export async function getAllPets(filter = {}) {
  return await petsDao.getAll(filter);
}

export async function getPetById(id) {
  const pet = await petsDao.getById(id);
  if (!pet) throw new Error('Mascota no encontrada');
  return pet;
}

export async function createPet(data) {
  return await petsDao.create(data);
}

export async function updatePet(id, data) {
  const pet = await petsDao.update(id, data);
  if (!pet) throw new Error('Mascota no encontrada');
  return pet;
}

export async function deletePet(id) {
  const result = await petsDao.delete(id);
  if (!result) throw new Error('Mascota no encontrada');
  return { message: 'Mascota eliminada exitosamente' };
}

export async function getAvailablePets() {
  return await petsDao.getAvailable();
}

export async function searchPets(query) {
  return await petsDao.search(query);
}

// ---------------------------------------------------------------------------
// User business logic
// ---------------------------------------------------------------------------

export async function getAllUsers() {
  return await usersDao.getAll();
}

export async function getUserById(id) {
  const user = await usersDao.getById(id);
  if (!user) throw new Error('Usuario no encontrado');
  return user;
}

export async function createUser(data) {
  return await usersDao.create(data);
}

export async function updateUser(id, data) {
  const user = await usersDao.update(id, data);
  if (!user) throw new Error('Usuario no encontrado');
  return user;
}

export async function deleteUser(id) {
  const result = await usersDao.delete(id);
  if (!result) throw new Error('Usuario no encontrado');
  return { message: 'Usuario eliminado exitosamente' };
}
