import { Router } from 'express';
import { register, login, logout, verifySession } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/verify-session', verifySession); // útil para el frontend

export default router;
