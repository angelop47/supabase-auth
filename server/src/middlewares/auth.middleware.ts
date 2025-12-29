import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

/**
 * Middleware de autenticación.
 * Verifica que el token JWT (Bearer Token) en el header Authorization sea válido.
 * Si es válido, adjunta el usuario decodificado al objeto `req` para usarlo en los controladores posteriores.
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // 1. Obtener el header Authorization
  // 1. Obtener el token de las cookies o del header Authorization
  let token = req.cookies?.access_token;

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  // 4. Validar el token con Supabase Auth
  const { data, error } = await supabase.auth.getUser(token);

  // 5. Si hay error o no hay usuario, retornar 401 Unauthorized
  if (error || !data.user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // 6. Adjuntar el usuario al request y continuar
  req.user = data.user;
  next();
}
