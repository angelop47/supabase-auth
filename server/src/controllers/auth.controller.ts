import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

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

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  res.json({
    user: {
      id: data.user?.id,
      email: data.user?.email,
      role: data.user?.app_metadata?.role ?? 'user',
    },
    access_token: data.session?.access_token,
    refresh_token: data.session?.refresh_token,
  });
}

export function me(req: Request, res: Response) {
  res.json({
    id: req.user?.id,
    email: req.user?.email,
    role: req.user?.app_metadata?.role ?? 'user',
  });
}
