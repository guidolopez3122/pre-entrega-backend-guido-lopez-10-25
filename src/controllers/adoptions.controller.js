import * as adoptionService from '../services/index.js';

export const getAll = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const adoptions = await adoptionService.getAllAdoptions(filter);
    res.json({ status: 'success', payload: adoptions });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const adoption = await adoptionService.getAdoptionById(req.params.aid);
    res.json({ status: 'success', payload: adoption });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};

export const getMyAdoptions = async (req, res) => {
  try {
    const adoptions = await adoptionService.getUserAdoptions(req.user.id);
    res.json({ status: 'success', payload: adoptions });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const create = async (req, res) => {
  try {
    if (!req.body.pet) {
      return res.status(400).json({ status: 'error', message: 'ID de mascota requerido' });
    }
    const adoption = await adoptionService.createAdoption({
      pet: req.body.pet,
      user: req.user.id,
      notes: req.body.notes || ''
    });
    res.status(201).json({ status: 'success', payload: adoption });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const adoption = await adoptionService.updateAdoption(req.params.aid, req.body);
    res.json({ status: 'success', payload: adoption });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const result = await adoptionService.deleteAdoption(req.params.aid);
    res.json({ status: 'success', message: result.message });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const approve = async (req, res) => {
  try {
    const adoption = await adoptionService.approveAdoption(req.params.aid, req.user.id);
    res.json({ status: 'success', payload: adoption });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const reject = async (req, res) => {
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
