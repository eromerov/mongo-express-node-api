import express from 'express';
import { register, login, recoveryPassword, resetPassword } from '../controllers/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.post('/recoverypassword', recoveryPassword);
router.put('/resetpassword/:token', resetPassword);


export default router;