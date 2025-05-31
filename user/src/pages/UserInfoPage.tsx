import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import type { User } from '../types';

export const UserInfoPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      
      // Llamar al endpoint de user-info del backend
      const response = await fetch('http://localhost:8000/api/auth/user-info/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else if (response.status === 401) {
        // Token expirado, intentar refrescar
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const refreshResponse = await fetch('http://localhost:8000/api/auth/token/refresh/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              refresh: refreshToken
            }),
          });

          if (refreshResponse.ok) {
            const data = await refreshResponse.json();
            localStorage.setItem('access_token', data.access);
            
            // Reintentar la solicitud original
            const retryResponse = await fetch('http://localhost:8000/api/auth/user-info/', {
              headers: {
                'Authorization': `Bearer ${data.access}`,
                'Content-Type': 'application/json',
              },
            });

            if (retryResponse.ok) {
              const userData = await retryResponse.json();
              setUser(userData);
            } else {
              throw new Error('Error al obtener información del usuario');
            }
          } else {
            // Refresh token también expiró
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
          }
        } else {
          window.location.href = '/login';
        }
      } else {
        throw new Error('Error al obtener información del usuario');
      }
    } catch (error: any) {
      setError(error.message || 'Error al cargar la información del usuario');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando información del usuario...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-xl font-semibold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={fetchUserInfo}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              🔄 Reintentar
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ℹ️ Información del Usuario</h1>
              <p className="text-gray-600">
                Visualiza la información de tu cuenta y estadísticas de uso
              </p>
            </div>
            <div className="flex space-x-4">
              <a
                href="/profile"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                ✏️ Editar Perfil
              </a>
            </div>
          </div>
        </div>

        {/* Usuario actual */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              👤 Datos del Usuario
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* ID de Usuario */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  ID de Usuario
                </h3>
                <p className="text-xl font-semibold text-gray-900">
                  #{user?.id}
                </p>
              </div>

              {/* Nombre Completo */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Nombre Completo
                </h3>
                <p className="text-lg font-medium text-gray-900">
                  {user?.first_name && user?.last_name 
                    ? `${user.first_name} ${user.last_name}`
                    : user?.first_name || user?.last_name || 'No especificado'
                  }
                </p>
              </div>

              {/* Nombre de Usuario */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Nombre de Usuario
                </h3>
                <p className="text-lg font-medium text-gray-900">
                  @{user?.username || 'No especificado'}
                </p>
              </div>

              {/* Email */}
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Email
                </h3>
                <p className="text-base font-medium text-gray-900 break-all">
                  {user?.email || 'No especificado'}
                </p>
              </div>

              {/* Empresa */}
              <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Empresa
                </h3>
                <p className="text-base font-medium text-gray-900">
                  {user?.company || 'No especificado'}
                </p>
              </div>

              {/* Cargo */}
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Cargo
                </h3>
                <p className="text-base font-medium text-gray-900">
                  {user?.position || 'No especificado'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Información de cuenta */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              📅 Información de la Cuenta
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                  📝 Fecha de Registro
                </h3>
                <p className="text-lg text-gray-900 mb-2">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'No disponible'}
                </p>
                <p className="text-sm text-gray-600">
                  Tiempo como usuario: {user?.created_at ? Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0} días
                </p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                  ✅ Estado de la Cuenta
                </h3>
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-lg font-medium text-green-700">
                    Activa
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Tu cuenta está verificada y funcionando correctamente
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            🚀 Acciones Rápidas
          </h3>
          <div className="flex flex-wrap gap-4">
            <a
              href="/upload"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md text-sm font-medium inline-flex items-center"
            >
              📤 Subir Archivo
            </a>
            <a
              href="/reports"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-sm font-medium inline-flex items-center"
            >
              📊 Ver Informes
            </a>
            <a
              href="/logout"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md text-sm font-medium inline-flex items-center"
            >
              🚪 Cerrar Sesión
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}; 