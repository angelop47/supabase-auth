import { Request, Response } from 'express';
import { supabase } from '../../config/supabase';

export async function getUsers(req: Request, res: Response) {
    const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, avatar_url, role')
        .order('full_name', { ascending: true });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json(data);
}