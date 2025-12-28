import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { NewUserPayload } from '../../types/types';
import { authService } from '../../services/auth.service';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';

const NewUser: React.FC = () => {
    const { token } = useAuth();
    const [formData, setFormData] = useState<NewUserPayload>({
        email: '',
        password: '',
        full_name: ''
    });

    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, msg: string }>({
        type: null,
        msg: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: null, msg: '' });

        try {
            await authService.createNewUser(formData, token);

            setStatus({ type: 'success', msg: '¡Usuario creado exitosamente!' });
            setFormData({ email: '', password: '', full_name: '' });

        } catch (err) {
            const error = err as Error;
            setStatus({ type: 'error', msg: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center p-6 bg-gray-950 min-h-screen">
            <Card className="w-full max-w-lg h-fit border-gray-800 bg-gray-900/50">
                <CardHeader>
                    <CardTitle className="text-xl text-white">Registrar Nuevo Usuario</CardTitle>
                    <CardDescription className="text-gray-400">Esta acción requiere permisos de administrador.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Nombre Completo</label>
                            <Input
                                name="full_name"
                                type="text"
                                value={formData.full_name}
                                onChange={handleChange}
                                required
                                placeholder="Juan Pérez"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Email</label>
                            <Input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="juan@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Contraseña</label>
                            <Input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        {status.msg && (
                            <div className={`p-3 rounded-md text-sm ${status.type === 'error' ? 'bg-red-900/20 text-red-200 border border-red-900' : 'bg-green-900/20 text-green-200 border border-green-900'}`}>
                                {status.msg}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading || !token}
                        >
                            {loading ? 'Procesando...' : 'Crear Usuario'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default NewUser;