import { Request, Response } from 'express';

/**
 * Cierra la sesión del usuario limpiando las cookies de autenticación.
 */
export async function logout(req: Request, res: Response) {
    // Si NODE_ENV no está definido, asumimos producción (seguro) para evitar errores en despliegues.
    // Solo usamos 'lax' si explícitamente estamos en 'development'.
    const isDevelopment = process.env.NODE_ENV === 'development';
    const cookieOptions = {
        httpOnly: true,
        // En desarrollo (localhost sin https) secure: false. En cualquier otro caso (prod/undefined): true
        secure: !isDevelopment,
        // En desarrollo 'lax' (mismo dominio). En prod (cross-origin): 'none'
        sameSite: isDevelopment ? 'lax' : 'none' as 'lax' | 'none' | 'strict',
    };

    // Limpiar cookies access_token y refresh_token con las mismas opciones con las que se crearon
    res.clearCookie('access_token', cookieOptions);
    res.clearCookie('refresh_token', cookieOptions);

    res.json({ message: 'Logged out successfully' });
}
