import express from 'express';
import { findAll } from '../controllers/users.js';

const router = express.Router();

router.get('/', findAll);

export default router;