import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { clearAuthTokens } from '../services/api';

export const LogoutPage: React.FC = () => {
  const [message, setMessage] = useState('Cerrando sesión...');
  const [showLayout, setShowLayout] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Intentar hacer logout en el servidor
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          await fetch('http://localhost:8000/api/auth/logout/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify({
              refresh_token: refreshToken
            }),
          });
        }
      } catch (error) {
        console.log('Error al cerrar sesión en el servidor:', error);
        // No es crítico si falla el logout del servidor
      } finally {
        // Limpiar tokens locales
        clearAuthTokens();
        setMessage('Sesión cerrada exitosamente. Redirigiendo...');
        
        // Ocultar el layout antes de redireccionar
        setTimeout(() => {
          setShowLayout(false);
        }, 1500);
        
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      }
    };

    performLogout();
  }, [navigate]);

  // Si no debe mostrar layout, usa la versión simple
  if (!showLayout) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '90%'
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem'
          }}>
            👋
          </div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '1rem'
          }}>
            Cerrando Sesión
          </h1>
          <p style={{
            color: '#6b7280',
            marginBottom: '1.5rem'
          }}>
            {message}
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid #e5e7eb',
              borderTop: '2px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-96">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
          <div className="text-6xl mb-4">👋</div>
          <h1 className="text-xl font-semibold text-gray-900 mb-4">
            Cerrando Sesión
          </h1>
          <p className="text-gray-600 mb-6">
            {message}
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    </Layout>
  );
}; 