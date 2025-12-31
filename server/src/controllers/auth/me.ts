import { Request, Response } from 'express';
import { createAuthenticatedClient } from '../../utils/supabase-client';

/**
 * Obtiene la información del usuario autenticado actual.
 * El usuario ya está disponible en `req.user` gracias al middleware de autenticación.
 * 
 * @example
 * curl -X GET http://localhost:4000/api/auth/me \
 *   -H "Authorization: Bearer <ACCESS_TOKEN>"
 */
export async function me(req: Request, res: Response) {
    // Retornamos directamente el usuario que fue adjuntado por el authMiddleware
    // Esto evita tener que consultar la BD de nuevo si solo necesitamos info básica del token

    // Consultamos datos adicionales del perfil
    // Consultamos datos adicionales del perfil usando RLS (Cliente Autenticado)
    // Usamos el token de la cookie
    const token = req.cookies.access_token;

    if (!token) {
        // Si llegamos aqui sin token es raro por el middleware, pero por seguridad
        return res.status(401).json({ error: 'No session token' });
    }

    const supabase = createAuthenticatedClient(token);

    const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', req.user?.id)
        .single();

    res.json({
        id: req.user?.id,
        email: req.user?.email,
        role: req.user?.app_metadata?.role ?? 'user',
        full_name: profile?.full_name,
        avatar_url: profile?.avatar_url,
    });
}
