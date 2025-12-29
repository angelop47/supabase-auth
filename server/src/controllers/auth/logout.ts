import { Request, Response } from 'express';

/**
 * Cierra la sesión del usuario limpiando las cookies de autenticación.
 */
export async function logout(req: Request, res: Response) {
    // Limpiar cookies access_token y refresh_token
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    res.json({ message: 'Logged out successfully' });
}
