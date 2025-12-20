import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

/**
 * Middleware de autorización para roles de administrador.
 * Verifica si el usuario autenticado tiene el rol 'admin' consultando la base de datos pública.
 * Debe usarse SIEMPRE después de authMiddleware.
 */
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id;

        // 1. Verificar si el usuario está autenticado (debería estarlo si pasó authMiddleware)
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // 2. Consultar el rol del usuario en la tabla pública 'users'
        // Esto es necesario porque custom claims en JWT pueden estar desactualizados
        const { data: user, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', userId)
            .single();

        // 3. Manejar errores de consulta o usuario no encontrado
        if (error || !user) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // 4. Verificar estrictamente si el rol es 'admin'
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied: Admins only' });
        }

        // 5. El usuario es admin, permitir acceso
        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}
