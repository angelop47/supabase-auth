import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const { data: user, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', userId)
            .single();

        if (error || !user) {
            return res.status(403).json({ error: 'Access denied' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied: Admins only' });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}
