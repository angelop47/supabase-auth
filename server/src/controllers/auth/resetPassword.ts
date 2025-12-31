import { Request, Response } from 'express';
import { createAuthenticatedClient } from '../../utils/supabase-client';

/**
 * Restablece la contraseña del usuario autenticado.
 * Este endpoint se debe llamar DESPUÉS de que el usuario haya hecho click en el enlace del correo
 * y el frontend haya recuperado la sesión (access_token).
 * 
 * @example
 * curl -X POST http://localhost:4000/api/auth/reset-password \
 *   -H "Content-Type: application/json" \
 *   -H "Authorization: Bearer <ACCESS_TOKEN>" \
 *   -d '{
 *     "password": "newSecurePassword123"
 *   }'
 */
export async function resetPassword(req: Request, res: Response) {
    const { password } = req.body;

    // 1. Validar nueva contraseña
    if (!password) {
        return res.status(400).json({ error: 'New password is required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // 2. Actualizar el usuario en Supabase
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ error: 'No session token' });

    const supabase = createAuthenticatedClient(token);

    const { error } = await supabase.auth.updateUser({
        password: password
    });

    // 3. Manejar errores
    if (error) {
        return res.status(400).json({ error: error.message });
    }

    // 4. Retornar éxito
    res.json({ message: 'Password updated successfully' });
}
