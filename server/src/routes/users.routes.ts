import { Router } from 'express';
import { updateUser } from '../controllers/users';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';

const router = Router();

// Todas las rutas de usuarios requieren autenticación
router.use(authMiddleware);

// Rutas protegidas solo para admin
router.patch('/:id', requireAdmin, updateUser);

export default router;
