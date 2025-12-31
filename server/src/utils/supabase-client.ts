import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

/**
 * Crea un cliente de Supabase autenticado en nombre del usuario.
 * Utiliza la Key Anónima + Access Token del usuario.
 * Esto asegura que apliquen las políticas RLS configuradas en la base de datos.
 * 
 * @param accessToken Token JWT del usuario (access_token)
 */
export const createAuthenticatedClient = (accessToken: string) => {
    return createClient(env.supabaseUrl, env.supabaseAnonKey, {
        global: {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    });
};
