import { Router } from 'express';
import { register, login, logout, verifySession, refresh } from '../controllers/authController';
import { loginLimiter, refreshLimiter } from '../middlewares/rateLimit';

const router = Router();

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.post('/refresh', refreshLimiter, refresh);
router.get('/verify-session', verifySession); // útil para el frontend

export default router;
