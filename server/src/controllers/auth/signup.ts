import { Request, Response } from 'express';
import { supabase } from '../../config/supabase';

export async function signup(req: Request, res: Response) {
    const { email, password, full_name } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name,
            },
        },
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
        user: {
            id: data.user?.id,
            email: data.user?.email,
            full_name,
        },
        session: data.session,
    });
}
