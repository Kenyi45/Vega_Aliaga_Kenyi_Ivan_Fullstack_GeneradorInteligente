import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Páginas que funcionan
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// UploadPage con funcionalidad real
const RealUploadPage = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [dragActive, setDragActive] = React.useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
        setMessage('');
      } else {
        setMessage('Por favor selecciona un archivo CSV válido');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setMessage('');
      } else {
        setMessage('Por favor selecciona un archivo CSV válido');
      }
    }
  };

  // Función para refrescar el token
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch('http://localhost:8000/api/auth/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: refreshToken
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        return data.access;
      } else {
        // Refresh token también expiró
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return null;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  };

  const uploadFile = async () => {
    if (!file) {
      setMessage('Por favor selecciona un archivo primero');
      return;
    }

    setUploading(true);
    setMessage('🔄 Preparando upload...');

    try {
      let token = localStorage.getItem('access_token');
      
      if (!token) {
        setMessage('❌ No estás autenticado. Redirigiendo al login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      setMessage('📤 Subiendo archivo...');

      let response = await fetch('http://localhost:8000/api/upload/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      // Si el token expiró, intentar refrescarlo
      if (response.status === 401) {
        setMessage('🔄 Token expirado, renovando autenticación...');
        const newToken = await refreshAccessToken();
        
        if (newToken) {
          // Reintentar con el nuevo token
          response = await fetch('http://localhost:8000/api/upload/', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${newToken}`,
            },
            body: formData,
          });
        } else {
          setMessage('❌ Sesión expirada. Redirigiendo al login...');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        }
      }

      if (response.ok) {
        const result = await response.json();
        console.log('Upload success:', result);
        
        setMessage(`✅ ¡Archivo procesado exitosamente! 🎉`);
        setFile(null);
        
        // Mostrar información del reporte
        if (result.report_id) {
          setMessage(prev => prev + `\n📊 Informe generado con ID: ${result.report_id}`);
          setMessage(prev => prev + `\n🔄 Redirigiendo al informe en 3 segundos...`);
          
          // Redirect to specific report after 3 seconds
          setTimeout(() => {
            window.location.href = `/reports/${result.report_id}`;
          }, 3000);
        } else {
          // Si no hay report_id, ir a la lista de informes
          setMessage(prev => prev + `\n🔄 Redirigiendo a informes en 3 segundos...`);
          setTimeout(() => {
            window.location.href = '/reports';
          }, 3000);
        }
      } else {
        const error = await response.json();
        console.error('Upload error response:', error);
        
        if (response.status === 401) {
          setMessage('❌ Error de autenticación. Redirigiendo al login...');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else if (response.status === 400) {
          setMessage(`❌ Error en el archivo: ${error.error || error.message || error.detail || 'Formato inválido'}`);
        } else if (response.status === 500) {
          setMessage(`❌ Error del servidor: ${error.error || error.message || 'Error interno del servidor'}`);
        } else {
          setMessage(`❌ Error: ${error.error || error.message || error.detail || 'Error desconocido'}`);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('❌ Error de conexión. Verifica que el backend esté funcionando en http://localhost:8000');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          📤 Subir Archivo CSV
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          Sube tu archivo de datos de ventas para generar informes inteligentes
        </p>
        
        {/* Zona de upload */}
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Subir Nuevo Archivo</h2>
          
          <div 
            style={{ 
              border: dragActive ? '2px dashed #3b82f6' : '2px dashed #d1d5db', 
              borderRadius: '8px', 
              padding: '3rem', 
              textAlign: 'center',
              backgroundColor: dragActive ? '#eff6ff' : '#f9fafb',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              {file ? '📄' : '📁'}
            </div>
            
            {file ? (
              <div>
                <p style={{ color: '#10b981', fontSize: '1.125rem', fontWeight: '600' }}>
                  {file.name}
                </p>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  Tamaño: {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                  Arrastra tu archivo CSV aquí o haz clic para seleccionar
                </p>
                <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                  Archivos soportados: .csv (máximo 10MB)
                </p>
              </div>
            )}
            
            <input 
              id="fileInput"
              type="file" 
              accept=".csv" 
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
          </div>
          
          {/* Botones */}
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            {file && !uploading && (
              <button 
                onClick={() => setFile(null)}
                style={{ 
                  backgroundColor: '#6b7280', 
                  color: 'white', 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '6px', 
                  border: 'none',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            )}
            <button 
              onClick={uploadFile}
              disabled={!file || uploading}
              style={{ 
                backgroundColor: (!file || uploading) ? '#9ca3af' : '#3b82f6', 
                color: 'white', 
                padding: '0.75rem 1.5rem', 
                borderRadius: '6px', 
                border: 'none',
                fontWeight: '500',
                cursor: (!file || uploading) ? 'not-allowed' : 'pointer'
              }}
            >
              {uploading ? '⏳ Procesando...' : '📤 Subir y Procesar'}
            </button>
          </div>
          
          {/* Mensaje */}
          {message && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              borderRadius: '6px',
              backgroundColor: message.includes('❌') ? '#fef2f2' : (message.includes('🔄') ? '#fef3c7' : '#f0fdf4'),
              color: message.includes('❌') ? '#dc2626' : (message.includes('🔄') ? '#d97706' : '#16a34a'),
              textAlign: 'center'
            }}>
              {message}
            </div>
          )}
        </div>
        
        {/* Guía */}
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>📋 Formato del Archivo</h3>
          <div style={{ color: '#6b7280', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '1rem' }}>Tu archivo CSV debe contener columnas como:</p>
            <div style={{ fontFamily: 'monospace', backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '4px', fontSize: '0.875rem' }}>
              fecha,producto,categoria,region,cantidad,precio<br/>
              2024-01-15,Laptop Pro,Electrónicos,Norte,2,1500.00<br/>
              2024-01-16,Mouse,Accesorios,Sur,5,45.99
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <a 
            href="/dashboard" 
            style={{ 
              backgroundColor: '#6b7280', 
              color: 'white', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '6px', 
              textDecoration: 'none',
              fontWeight: '500',
              marginRight: '1rem'
            }}
          >
            ← Volver al Dashboard
          </a>
          <a 
            href="/reports" 
            style={{ 
              backgroundColor: '#10b981', 
              color: 'white', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '6px', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Ver Informes →
          </a>
        </div>
      </div>
    </div>
  );
};

// Dashboard completo con gráficos reales
const FullDashboard = () => {
  const [dashboardData, setDashboardData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  // Función para refrescar el token
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch('http://localhost:8000/api/auth/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: refreshToken
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        return data.access;
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return null;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  };

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        let token = localStorage.getItem('access_token');
        
        if (!token) {
          setError('No estás autenticado. Redirigiendo al login...');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        }

        let response = await fetch('http://localhost:8000/api/dashboard/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // Si el token expiró, intentar refrescarlo
        if (response.status === 401) {
          console.log('Token expirado, intentando renovar...');
          const newToken = await refreshAccessToken();
          
          if (newToken) {
            response = await fetch('http://localhost:8000/api/dashboard/', {
              headers: {
                'Authorization': `Bearer ${newToken}`,
              },
            });
          } else {
            setError('Sesión expirada. Redirigiendo al login...');
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
            return;
          }
        }

        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else {
          const errorData = await response.json().catch(() => ({}));
          setError(`Error al cargar dashboard: ${errorData.detail || response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching dashboard:', error);
        setError('Error de conexión con el servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Datos de ejemplo para los gráficos cuando no hay datos reales
  const sampleLineData = [
    { mes: 'Ene', ventas: 4000, productos: 240 },
    { mes: 'Feb', ventas: 3000, productos: 139 },
    { mes: 'Mar', ventas: 2000, productos: 980 },
    { mes: 'Abr', ventas: 2780, productos: 390 },
    { mes: 'May', ventas: 1890, productos: 480 },
    { mes: 'Jun', ventas: 2390, productos: 380 },
  ];

  const sampleBarData = [
    { categoria: 'Electrónicos', ventas: 4000 },
    { categoria: 'Ropa', ventas: 3000 },
    { categoria: 'Hogar', ventas: 2000 },
    { categoria: 'Deportes', ventas: 2780 },
    { categoria: 'Libros', ventas: 1890 },
  ];

  const samplePieData = [
    { name: 'Norte', value: 400, color: '#0088FE' },
    { name: 'Sur', value: 300, color: '#00C49F' },
    { name: 'Este', value: 300, color: '#FFBB28' },
    { name: 'Oeste', value: 200, color: '#FF8042' },
  ];

  if (loading) {
    return (
      <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            📊 Dashboard - IntelliReport
          </h1>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
            <p>Cargando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            📊 Dashboard - IntelliReport
          </h1>
          <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '1rem', borderRadius: '6px' }}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.statistics || {
    total_files: 0,
    total_reports: 0,
    total_sales: 0,
    total_records: 0
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            📊 Dashboard - IntelliReport
          </h1>
          <p style={{ color: '#6b7280' }}>
            Resumen ejecutivo de tus análisis de datos y métricas de negocio
          </p>
        </div>

        {/* KPI Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Total de Ventas
              </h3>
              <div style={{ fontSize: '1.5rem' }}>💰</div>
            </div>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
              ${stats.total_sales ? Number(stats.total_sales).toLocaleString() : '0'}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#16a34a' }}>
              📈 Basado en {stats.total_records} registros
            </p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Archivos Procesados
              </h3>
              <div style={{ fontSize: '1.5rem' }}>📁</div>
            </div>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.5rem' }}>
              {stats.total_files}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#3b82f6' }}>
              📊 {stats.total_reports} informes generados
            </p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Registros Analizados
              </h3>
              <div style={{ fontSize: '1.5rem' }}>📋</div>
            </div>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0.5rem' }}>
              {stats.total_records?.toLocaleString() || '0'}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#10b981' }}>
              🔍 Datos procesados con IA
            </p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Promedio por Venta
              </h3>
              <div style={{ fontSize: '1.5rem' }}>📊</div>
            </div>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#f59e0b', marginBottom: '0.5rem' }}>
              ${stats.total_records > 0 ? ((stats.total_sales || 0) / stats.total_records).toFixed(2) : '0'}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#f59e0b' }}>
              💡 Valor promedio calculado
            </p>
          </div>
        </div>

        {/* Gráficos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          {/* Gráfico de Líneas */}
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
              📈 Tendencia de Ventas Mensual
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sampleLineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ventas" stroke="#3b82f6" strokeWidth={3} />
                <Line type="monotone" dataKey="productos" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Barras */}
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
              📊 Ventas por Categoría
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sampleBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="categoria" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ventas" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Pie y Resumen */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          {/* Gráfico de Pie */}
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
              🌍 Distribución Regional
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={samplePieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {samplePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Resumen Automático */}
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
              🤖 Resumen Automático con IA
            </h3>
            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                Análisis de Performance
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6' }}>
                {stats.total_files > 0 ? 
                  `Basado en ${stats.total_files} archivo(s) procesado(s), se han analizado ${stats.total_records.toLocaleString()} registros de ventas, generando un volumen total de $${Number(stats.total_sales || 0).toLocaleString()}. El promedio por transacción es de $${stats.total_records > 0 ? ((stats.total_sales || 0) / stats.total_records).toFixed(2) : '0'}.`
                  :
                  'Aún no has subido archivos para análisis. Te recomendamos comenzar subiendo un archivo CSV con datos de ventas para generar insights automáticos con IA.'
                }
              </p>
            </div>
            
            <div style={{ backgroundColor: '#fef3c7', padding: '1rem', borderRadius: '8px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#92400e' }}>
                💡 Recomendaciones
              </h4>
              <ul style={{ fontSize: '0.875rem', color: '#78350f', lineHeight: '1.6', paddingLeft: '1rem' }}>
                <li>Enfócate en las categorías con mejor rendimiento</li>
                <li>Analiza las tendencias estacionales en tus datos</li>
                <li>Considera expandir en regiones con menor participación</li>
                <li>Optimiza el inventario basado en los patrones de demanda</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>
            🚀 Acciones Rápidas
          </h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a 
              href="/upload" 
              style={{ 
                backgroundColor: '#3b82f6', 
                color: 'white', 
                padding: '0.75rem 1.5rem', 
                borderRadius: '8px', 
                textDecoration: 'none',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              📤 Subir Nuevo Archivo
            </a>
            <a 
              href="/reports" 
              style={{ 
                backgroundColor: '#10b981', 
                color: 'white', 
                padding: '0.75rem 1.5rem', 
                borderRadius: '8px', 
                textDecoration: 'none',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              📊 Ver Todos los Informes
            </a>
            <button 
              onClick={() => {
                alert('Funcionalidad de exportación PDF próximamente disponible');
              }}
              style={{ 
                backgroundColor: '#f59e0b', 
                color: 'white', 
                padding: '0.75rem 1.5rem', 
                borderRadius: '8px', 
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              📄 Exportar Dashboard PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ReportsPage simplificada para testing
const SimpleReportsPage = () => {
  const [reports, setReports] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  // Función para refrescar el token
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch('http://localhost:8000/api/auth/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: refreshToken
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        return data.access;
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return null;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  };

  React.useEffect(() => {
    const fetchReports = async () => {
      try {
        let token = localStorage.getItem('access_token');
        
        if (!token) {
          setError('No estás autenticado. Redirigiendo al login...');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        }

        let response = await fetch('http://localhost:8000/api/reports/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // Si el token expiró, intentar refrescarlo
        if (response.status === 401) {
          console.log('Token expirado, intentando renovar...');
          const newToken = await refreshAccessToken();
          
          if (newToken) {
            // Reintentar con el nuevo token
            response = await fetch('http://localhost:8000/api/reports/', {
              headers: {
                'Authorization': `Bearer ${newToken}`,
              },
            });
          } else {
            setError('Sesión expirada. Redirigiendo al login...');
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
            return;
          }
        }

        if (response.ok) {
          const data = await response.json();
          setReports(data);
        } else {
          const errorData = await response.json().catch(() => ({}));
          setError(`Error al cargar los informes: ${errorData.detail || response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
        setError('Error de conexión con el servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            📊 Mis Informes
          </h1>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
            <p>Cargando informes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          📊 Mis Informes
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          Gestiona y visualiza tus informes de análisis de ventas
        </p>
        
        {error && (
          <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '1rem', borderRadius: '6px', marginBottom: '2rem' }}>
            {error}
          </div>
        )}
        
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Informes Recientes</h2>
            <a 
              href="/upload" 
              style={{ 
                backgroundColor: '#3b82f6', 
                color: 'white', 
                padding: '0.5rem 1rem', 
                borderRadius: '6px', 
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '0.875rem'
              }}
            >
              📤 Subir Nuevo Archivo
            </a>
          </div>
          
          {reports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              <p style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>📄 No tienes informes todavía</p>
              <p style={{ marginBottom: '2rem' }}>Sube tu primer archivo CSV para generar informes automáticos</p>
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
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {reports.map((report) => (
                <div key={report.id} style={{ 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px', 
                  padding: '1.5rem',
                  backgroundColor: '#fafafa',
                  transition: 'all 0.2s'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                        {report.title || `Informe #${report.id}`}
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        Creado: {new Date(report.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={async () => {
                          try {
                            const token = localStorage.getItem('access_token');
                            const response = await fetch(`http://localhost:8000/api/reports/${report.id}/download-pdf/`, {
                              headers: {
                                'Authorization': `Bearer ${token}`,
                              },
                            });
                            
                            if (response.ok) {
                              const blob = await response.blob();
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.style.display = 'none';
                              a.href = url;
                              a.download = `informe_${report.id}.pdf`;
                              document.body.appendChild(a);
                              a.click();
                              window.URL.revokeObjectURL(url);
                            } else {
                              alert('Error al descargar el PDF');
                            }
                          } catch (error) {
                            alert('Error de conexión al descargar PDF');
                          }
                        }}
                        style={{ 
                          backgroundColor: '#dc2626', 
                          color: 'white', 
                          padding: '0.5rem 1rem', 
                          borderRadius: '6px', 
                          border: 'none',
                          fontWeight: '500',
                          fontSize: '0.875rem',
                          cursor: 'pointer'
                        }}
                      >
                        📄 PDF
                      </button>
                      <a 
                        href={`/reports/${report.id}`}
                        style={{ 
                          backgroundColor: '#10b981', 
                          color: 'white', 
                          padding: '0.5rem 1rem', 
                          borderRadius: '6px', 
                          textDecoration: 'none',
                          fontWeight: '500',
                          fontSize: '0.875rem'
                        }}
                      >
                        Ver Detalles →
                      </a>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Registros</p>
                      <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                        {report.total_records || 0}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Total Ventas</p>
                      <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#16a34a' }}>
                        ${report.total_sales ? Number(report.total_sales).toLocaleString() : '0'}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Estado</p>
                      <p style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: '500',
                        color: '#10b981'
                      }}>
                        ✅ Completado
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Tipos de Informes</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>📈 Análisis de Ventas</h4>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Tendencias y patrones de ventas</p>
            </div>
            <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>🏷️ Análisis por Producto</h4>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Performance de productos</p>
            </div>
            <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>🌍 Análisis Regional</h4>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Ventas por región geográfica</p>
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <a 
            href="/dashboard" 
            style={{ 
              backgroundColor: '#6b7280', 
              color: 'white', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '6px', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            ← Volver al Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

// ReportDetailPage simplificada para testing
const SimpleReportDetailPage = () => {
  const [report, setReport] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const reportId = window.location.pathname.split('/').pop();

  // Función para refrescar el token
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch('http://localhost:8000/api/auth/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: refreshToken
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        return data.access;
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return null;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  };

  React.useEffect(() => {
    const fetchReport = async () => {
      try {
        let token = localStorage.getItem('access_token');
        
        if (!token) {
          setError('No estás autenticado. Redirigiendo al login...');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        }

        let response = await fetch(`http://localhost:8000/api/reports/${reportId}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // Si el token expiró, intentar refrescarlo
        if (response.status === 401) {
          console.log('Token expirado, intentando renovar...');
          const newToken = await refreshAccessToken();
          
          if (newToken) {
            // Reintentar con el nuevo token
            response = await fetch(`http://localhost:8000/api/reports/${reportId}/`, {
              headers: {
                'Authorization': `Bearer ${newToken}`,
              },
            });
          } else {
            setError('Sesión expirada. Redirigiendo al login...');
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
            return;
          }
        }

        if (response.ok) {
          const data = await response.json();
          setReport(data);
        } else {
          const errorData = await response.json().catch(() => ({}));
          setError(`Error al cargar el informe: ${errorData.detail || response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching report:', error);
        setError('Error de conexión con el servidor');
      } finally {
        setLoading(false);
      }
    };

    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

  if (loading) {
    return (
      <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p>Cargando informe...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
          <p style={{ color: '#dc2626', marginBottom: '2rem' }}>{error}</p>
          <a href="/reports" style={{ backgroundColor: '#3b82f6', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '6px', textDecoration: 'none' }}>
            ← Volver a Informes
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          📊 Informe #{reportId}
        </h1>
        
        {report && (
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
              {report.title || 'Análisis de Datos'}
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '6px' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Total de Registros</h3>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>{report.total_records || 0}</p>
              </div>
              
              <div style={{ backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '6px' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Total de Ventas</h3>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>
                  ${report.total_sales ? Number(report.total_sales).toLocaleString() : '0'}
                </p>
              </div>
              
              <div style={{ backgroundColor: '#eff6ff', padding: '1rem', borderRadius: '6px' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Fecha de Análisis</h3>
                <p style={{ fontSize: '1rem', color: '#1f2937' }}>
                  {report.created_at ? new Date(report.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
            
            {report.summary && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>📋 Resumen del Análisis</h3>
                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '6px', whiteSpace: 'pre-wrap' }}>
                  {report.summary}
                </div>
              </div>
            )}
            
            {report.insights && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>💡 Insights Generados</h3>
                <div style={{ backgroundColor: '#fef3c7', padding: '1rem', borderRadius: '6px', whiteSpace: 'pre-wrap' }}>
                  {report.insights}
                </div>
              </div>
            )}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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
            ← Volver a Informes
          </a>
          <a 
            href="/dashboard" 
            style={{ 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '6px', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            🏠 Dashboard
          </a>
          <button 
            onClick={async () => {
              try {
                const token = localStorage.getItem('access_token');
                const response = await fetch(`http://localhost:8000/api/reports/${reportId}/download-pdf/`, {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                  },
                });
                
                if (response.ok) {
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.style.display = 'none';
                  a.href = url;
                  a.download = `informe_${reportId}.pdf`;
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                } else {
                  alert('Error al descargar el PDF');
                }
              } catch (error) {
                alert('Error de conexión al descargar PDF');
              }
            }}
            style={{ 
              backgroundColor: '#dc2626', 
              color: 'white', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '6px', 
              border: 'none',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            📄 Descargar PDF
          </button>
          <a 
            href="/upload" 
            style={{ 
              backgroundColor: '#10b981', 
              color: 'white', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '6px', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            📤 Subir Otro Archivo
          </a>
        </div>
      </div>
    </div>
  );
};

// Componente temporal para páginas en desarrollo
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
            {/* Páginas públicas que funcionan */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
            {/* Dashboard COMPLETO con gráficos */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                  <FullDashboard />
                  </ProtectedRoute>
                }
              />
            
            {/* UploadPage con funcionalidad REAL */}
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                  <RealUploadPage />
                  </ProtectedRoute>
                }
              />
            
            {/* ReportsPage SIMPLIFICADA para testing */}
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                  <SimpleReportsPage />
                  </ProtectedRoute>
                }
              />
            
            {/* ReportDetail SIMPLIFICADO para testing */}
              <Route
                path="/reports/:id"
                element={
                  <ProtectedRoute>
                  <SimpleReportDetailPage />
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
