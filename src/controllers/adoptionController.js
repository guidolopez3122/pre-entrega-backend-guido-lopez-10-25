import adoptionService from '../services/adoption.service.js';
import { body, validationResult } from 'express-validator';

export const validateAdoption = [
  body('pet').isMongoId().withMessage('ID de mascota inválido'),
];

export const getAllAdoptions = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const adoptions = await adoptionService.getAllAdoptions(filter);
    res.json({ status: 'success', payload: adoptions });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getAdoptionById = async (req, res) => {
  try {
    const adoption = await adoptionService.getAdoptionById(req.params.aid);
    res.json({ status: 'success', payload: adoption });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};

export const createAdoption = [
  ...validateAdoption,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'error', errors: errors.array() });
    }
    try {
      const adoption = await adoptionService.createAdoption({
        pet: req.body.pet,
        user: req.user.id,
        notes: req.body.notes || ''
      });
      res.status(201).json({ status: 'success', payload: adoption });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
];

export const updateAdoption = async (req, res) => {
  try {
    const adoption = await adoptionService.updateAdoption(req.params.aid, req.body);
    res.json({ status: 'success', payload: adoption });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const deleteAdoption = async (req, res) => {
  try {
    const result = await adoptionService.deleteAdoption(req.params.aid);
    res.json({ status: 'success', message: result.message });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const approveAdoption = async (req, res) => {
  try {
    const adoption = await adoptionService.approveAdoption(req.params.aid, req.user.id);
    res.json({ status: 'success', payload: adoption });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const rejectAdoption = async (req, res) => {
  try {
    const adoption = await adoptionService.rejectAdoption(
      req.params.aid, 
      req.user.id, 
      req.body.notes || ''
    );
    res.json({ status: 'success', payload: adoption });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const getUserAdoptions = async (req, res) => {
  try {
    const adoptions = await adoptionService.getUserAdoptions(req.user.id);
    res.json({ status: 'success', payload: adoptions });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
