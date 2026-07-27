import express from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import * as userController from '../../controllers/users.controller.js';

const router = express.Router();

// GET /api/users - List all users (admin only)
router.get('/', authenticate, authorize(['admin']), userController.getAll);

// GET /api/users/:uid - Get user by ID
router.get('/:uid', authenticate, userController.getById);

// POST /api/users - Create a new user (admin only)
router.post('/', authenticate, authorize(['admin']), userController.create);

// PUT /api/users/:uid - Update a user (admin only)
router.put('/:uid', authenticate, authorize(['admin']), userController.update);

// DELETE /api/users/:uid - Delete a user (admin only)
router.delete('/:uid', authenticate, authorize(['admin']), userController.remove);

export default router;
