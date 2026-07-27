import express from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import * as petController from '../../controllers/pets.controller.js';

const router = express.Router();

// GET /api/pets - List all pets (public)
router.get('/', petController.getAll);

// GET /api/pets/available - List available pets for adoption
router.get('/available', petController.getAvailable);

// GET /api/pets/search - Search pets
router.get('/search', petController.search);

// GET /api/pets/:pid - Get pet by ID
router.get('/:pid', petController.getById);

// POST /api/pets - Create a new pet (admin only)
router.post('/', authenticate, authorize(['admin']), petController.create);

// PUT /api/pets/:pid - Update a pet (admin only)
router.put('/:pid', authenticate, authorize(['admin']), petController.update);

// DELETE /api/pets/:pid - Delete a pet (admin only)
router.delete('/:pid', authenticate, authorize(['admin']), petController.remove);

export default router;
