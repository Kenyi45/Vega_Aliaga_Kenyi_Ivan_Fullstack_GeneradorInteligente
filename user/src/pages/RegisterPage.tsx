import React from 'react';
import { Navigate } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import { RegisterForm } from '../components/auth/RegisterForm';
import { useAuth } from '../contexts/AuthContext';

export const RegisterPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <BarChart3 className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            IntelliReport
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Generador Inteligente de Informes Empresariales
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}; 