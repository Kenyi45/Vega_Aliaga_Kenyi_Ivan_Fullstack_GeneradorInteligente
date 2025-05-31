import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Button, Input, Alert } from '../ui';
import { useRegister } from '../../hooks/useAuth';
import type { RegisterData } from '../../types';

export const RegisterForm: React.FC = () => {
  const [error, setError] = useState<string>('');
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterData) => {
    try {
      setError('');
      await registerMutation.mutateAsync(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Crear Cuenta</h2>
        <p className="mt-2 text-sm text-gray-600">
          Regístrate para comenzar a generar informes inteligentes
        </p>
      </div>

      {error && (
        <Alert variant="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Nombre"
            placeholder="Tu nombre"
            {...register('first_name', {
              required: 'El nombre es requerido',
              minLength: {
                value: 2,
                message: 'El nombre debe tener al menos 2 caracteres',
              },
            })}
            error={errors.first_name?.message}
          />

          <Input
            label="Apellido"
            placeholder="Tu apellido"
            {...register('last_name', {
              required: 'El apellido es requerido',
              minLength: {
                value: 2,
                message: 'El apellido debe tener al menos 2 caracteres',
              },
            })}
            error={errors.last_name?.message}
          />
        </div>

        <Input
          label="Nombre de usuario"
          placeholder="nombreusuario"
          {...register('username', {
            required: 'El nombre de usuario es requerido',
            minLength: {
              value: 3,
              message: 'El nombre de usuario debe tener al menos 3 caracteres',
            },
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message: 'Solo se permiten letras, números y guiones bajos',
            },
          })}
          error={errors.username?.message}
        />

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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Empresa (opcional)"
            placeholder="Tu empresa"
            {...register('company')}
          />

          <Input
            label="Cargo (opcional)"
            placeholder="Tu cargo"
            {...register('position')}
          />
        </div>

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          {...register('password', {
            required: 'La contraseña es requerida',
            minLength: {
              value: 8,
              message: 'La contraseña debe tener al menos 8 caracteres',
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
              message: 'Debe contener al menos una mayúscula, una minúscula y un número',
            },
          })}
          error={errors.password?.message}
        />

        <Input
          label="Confirmar contraseña"
          type="password"
          placeholder="••••••••"
          {...register('password_confirm', {
            required: 'Debes confirmar la contraseña',
            validate: (value) =>
              value === password || 'Las contraseñas no coinciden',
          })}
          error={errors.password_confirm?.message}
        />

        <Button
          type="submit"
          className="w-full"
          isLoading={registerMutation.isPending}
        >
          {registerMutation.isPending ? 'Creando cuenta...' : 'Crear Cuenta'}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}; 