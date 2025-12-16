import { Request, Response } from 'express';
import { supabase } from '../../config/supabase';
import { AppUser } from '../../models/user.model';

export async function updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { full_name, avatar_url, role } = req.body;

    const updates: Partial<AppUser> = {};

    if (full_name !== undefined) updates.full_name = full_name;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;
    if (role !== undefined) updates.role = role;

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json(data);
}
