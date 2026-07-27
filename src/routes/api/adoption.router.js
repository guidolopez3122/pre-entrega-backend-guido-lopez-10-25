import express from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import * as adoptionController from '../../controllers/adoptions.controller.js';

const router = express.Router();

// GET /api/adoptions - List all adoptions (admin only)
router.get('/', authenticate, authorize(['admin']), adoptionController.getAll);

// GET /api/adoptions/me - Get current user's adoptions
router.get('/me', authenticate, adoptionController.getMyAdoptions);

// GET /api/adoptions/:aid - Get adoption by ID
router.get('/:aid', authenticate, adoptionController.getById);

// POST /api/adoptions - Create adoption request
router.post('/', authenticate, adoptionController.create);

// PUT /api/adoptions/:aid - Update adoption (admin only)
router.put('/:aid', authenticate, authorize(['admin']), adoptionController.update);

// DELETE /api/adoptions/:aid - Delete adoption
router.delete('/:aid', authenticate, adoptionController.remove);

// POST /api/adoptions/:aid/approve - Approve adoption (admin only)
router.post('/:aid/approve', authenticate, authorize(['admin']), adoptionController.approve);

// POST /api/adoptions/:aid/reject - Reject adoption (admin only)
router.post('/:aid/reject', authenticate, authorize(['admin']), adoptionController.reject);

export default router;
