import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Button, Input, Alert } from '../ui';
import { useLogin } from '../../hooks/useAuth';
import type { LoginCredentials } from '../../types';

export const LoginForm: React.FC = () => {
  const [error, setError] = useState<string>('');
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setError('');
      await loginMutation.mutateAsync(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
        <p className="mt-2 text-sm text-gray-600">
          Accede a tu cuenta para generar informes inteligentes
        </p>
      </div>

      {error && (
        <Alert variant="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="tu@email.com"
          {...register('email', {
            required: 'El email es requerido',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email inválido',
            },
          })}
          error={errors.email?.message}
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          {...register('password', {
            required: 'La contraseña es requerida',
            minLength: {
              value: 6,
              message: 'La contraseña debe tener al menos 6 caracteres',
            },
          })}
          error={errors.password?.message}
        />

        <Button
          type="submit"
          className="w-full"
          isLoading={loginMutation.isPending}
        >
          {loginMutation.isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}; 