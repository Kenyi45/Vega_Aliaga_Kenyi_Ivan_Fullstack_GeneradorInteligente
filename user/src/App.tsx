import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Dashboard simplificado para testing
const SimpleDashboard = () => (
  <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        📊 Dashboard - IntelliReport
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Resumen de tus informes y análisis de ventas
      </p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Archivos Totales</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>0</p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Archivos subidos</p>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Informes Generados</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>0</p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Análisis completados</p>
        </div>
      </div>
      
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Acciones Rápidas</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a 
            href="/upload" 
            style={{ 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '6px', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            📤 Subir Archivo
          </a>
          <a 
            href="/reports" 
            style={{ 
              backgroundColor: '#6b7280', 
              color: 'white', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '6px', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            📊 Ver Informes
          </a>
        </div>
      </div>
    </div>
  </div>
);

// Componente temporal para otras páginas
const TempPage = ({ name }: { name: string }) => (
  <div style={{ 
    padding: '20px', 
    fontSize: '18px', 
    color: 'green',
    backgroundColor: '#f0fdf4',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  }}>
    <h1>🚧 Página {name}</h1>
    <p>Esta página se agregará próximamente</p>
    <div style={{ marginTop: '20px' }}>
      <a href="/dashboard" style={{ color: 'green', marginRight: '20px' }}>Volver al Dashboard</a>
      <a href="/login" style={{ color: 'green' }}>Ir a Login</a>
    </div>
  </div>
);

function App() {
  return (
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
            {/* Páginas públicas */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
            {/* Dashboard simplificado protegido */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                  <SimpleDashboard />
                  </ProtectedRoute>
                }
              />
            
            {/* Páginas temporales */}
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                  <TempPage name="Upload" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                  <TempPage name="Reports" />
                  </ProtectedRoute>
                }
              />
              
              {/* Redirecciones */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
  );
}

export default App;
