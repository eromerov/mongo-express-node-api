import express from 'express';
import { findAll, findById, create, update } from '../controllers/contacts.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

//router.get('/', authorize(), findAll);

router.get('/', findAll);
router.get('/:id', findById);
router.post('/', authorize('admin'), create);
router.put('/:id', authorize('admin'), update);


export default router;
