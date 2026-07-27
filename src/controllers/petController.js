import petService from '../services/pet.service.js';
import { body, validationResult } from 'express-validator';

export const validatePet = [
  body('name').isString().notEmpty().withMessage('El nombre es requerido'),
  body('species').isString().isIn(['dog', 'cat', 'bird', 'rabbit', 'hamster', 'other']).withMessage('Especie inválida'),
  body('age').isNumeric({ min: 0 }).withMessage('La edad debe ser un número positivo'),
];

export const getPets = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.species) filter.species = req.query.species;
    const pets = await petService.getAllPets(filter);
    res.json({ status: 'success', payload: pets });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getPetById = async (req, res) => {
  try {
    const pet = await petService.getPetById(req.params.pid);
    res.json({ status: 'success', payload: pet });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};

export const createPet = [
  ...validatePet,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'error', errors: errors.array() });
    }
    try {
      const pet = await petService.createPet(req.body);
      res.status(201).json({ status: 'success', payload: pet });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
];

export const updatePet = [
  ...validatePet,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'error', errors: errors.array() });
    }
    try {
      const pet = await petService.updatePet(req.params.pid, req.body);
      res.json({ status: 'success', payload: pet });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
];

export const deletePet = async (req, res) => {
  try {
    const result = await petService.deletePet(req.params.pid);
    res.json({ status: 'success', message: result.message });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const getAvailablePets = async (req, res) => {
  try {
    const pets = await petService.getAvailablePets();
    res.json({ status: 'success', payload: pets });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const searchPets = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ status: 'error', message: 'El parámetro de búsqueda q es requerido' });
    }
    const pets = await petService.searchPets(q);
    res.json({ status: 'success', payload: pets });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
