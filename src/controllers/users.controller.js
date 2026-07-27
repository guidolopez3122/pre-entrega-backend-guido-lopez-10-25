import * as userService from '../services/index.js';

export const getAll = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ status: 'success', payload: users });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.uid);
    res.json({ status: 'success', payload: user });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};

export const create = async (req, res) => {
  try {
    if (!req.body.first_name || !req.body.last_name || !req.body.email) {
      return res.status(400).json({ status: 'error', message: 'Nombre, apellido y email son requeridos' });
    }
    const user = await userService.createUser(req.body);
    res.status(201).json({ status: 'success', payload: user });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.uid, req.body);
    res.json({ status: 'success', payload: user });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.uid);
    res.json({ status: 'success', message: result.message });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};
