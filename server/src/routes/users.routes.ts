import { Router } from 'express';
import { updateUser, getUsers } from '../controllers/users';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';

const router = Router();

// Todas las rutas de usuarios requieren autenticación
router.use(authMiddleware);

// Rutas protegidas solo para admin
router.patch('/:id', requireAdmin, updateUser);
router.get('/', requireAdmin, getUsers);

export default router;
