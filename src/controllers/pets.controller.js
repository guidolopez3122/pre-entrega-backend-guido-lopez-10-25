import * as petService from '../services/index.js';

export const getAll = async (req, res) => {
  try {
    const filter = {};
    if (req.query.species) filter.species = req.query.species;
    if (req.query.status) filter.status = req.query.status;
    const pets = await petService.getAllPets(filter);
    res.json({ status: 'success', payload: pets });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const pet = await petService.getPetById(req.params.pid);
    res.json({ status: 'success', payload: pet });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};

export const getAvailable = async (req, res) => {
  try {
    const pets = await petService.getAvailablePets();
    res.json({ status: 'success', payload: pets });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const search = async (req, res) => {
  try {
    const pets = await petService.searchPets(req.query);
    res.json({ status: 'success', payload: pets });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const create = async (req, res) => {
  try {
    if (!req.body.name || !req.body.species || !req.body.age === undefined) {
      return res.status(400).json({ status: 'error', message: 'Nombre, especie y edad son requeridos' });
    }
    const pet = await petService.createPet(req.body);
    res.status(201).json({ status: 'success', payload: pet });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const pet = await petService.updatePet(req.params.pid, req.body);
    res.json({ status: 'success', payload: pet });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const result = await petService.deletePet(req.params.pid);
    res.json({ status: 'success', message: result.message });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};
