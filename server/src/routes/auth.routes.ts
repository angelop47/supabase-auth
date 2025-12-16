import { Router } from 'express';
import { signup, login, me } from '../controllers/auth';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authLimiter } from '../middlewares/rate-limit.middleware';

const router = Router();

router.post('/login', authLimiter, login);
router.post('/signup', authLimiter, signup);
router.get('/me', authMiddleware, me);

export default router;
