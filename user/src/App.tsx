import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { exportDashboardToPDF, exportQuickStats } from './utils/pdfExport';
import type { DashboardData, Report } from './types/dashboard';
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
import { LogoutPage } from './pages/LogoutPage';
import { ProfilePage } from './pages/ProfilePage';
import { UserInfoPage } from './pages/UserInfoPage';

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
      const token = localStorage.getItem('access_token');
      
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
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📤 Subir Archivo CSV
        </h1>
          <p className="text-gray-600">
          Sube tu archivo de datos de ventas para generar informes inteligentes
        </p>
        </div>
        
        {/* Zona de upload */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Subir Nuevo Archivo</h2>
          
          <div 
            className={`
              border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200
              ${dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
              }
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <div className="text-6xl mb-4">
              {file ? '📄' : '📁'}
            </div>
            
            {file ? (
              <div>
                <p className="text-green-600 text-lg font-semibold mb-2">
                  {file.name}
                </p>
                <p className="text-gray-500 text-sm">
                  Tamaño: {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-4 text-lg">
                  Arrastra tu archivo CSV aquí o haz clic para seleccionar
                </p>
                <p className="text-gray-400 text-sm">
                  Archivos soportados: .csv (máximo 10MB)
                </p>
              </div>
            )}
            
            <input 
              id="fileInput"
              type="file" 
              accept=".csv" 
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
          
          {/* Botones */}
          <div className="mt-6 flex justify-center gap-4">
            {file && !uploading && (
              <button 
                onClick={() => setFile(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
            )}
            <button 
              onClick={uploadFile}
              disabled={!file || uploading}
              className={`
                px-6 py-3 rounded-lg font-medium transition-colors
                ${(!file || uploading) 
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                }
              `}
            >
              {uploading ? '⏳ Procesando...' : '📤 Subir y Procesar'}
            </button>
          </div>
          
          {/* Mensaje */}
          {message && (
            <div className={`
              mt-6 p-4 rounded-lg text-center whitespace-pre-line
              ${message.includes('❌') 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : message.includes('🔄') 
                  ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' 
                  : 'bg-green-50 text-green-700 border border-green-200'
              }
            `}>
              {message}
            </div>
          )}
        </div>
        
        {/* Guía */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">📋 Formato del Archivo</h3>
          <div className="text-gray-600 leading-relaxed">
            <p className="mb-4">Tu archivo CSV debe contener columnas como:</p>
            <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm border">
              fecha,producto,categoria,region,cantidad,sales_amount<br/>
              2024-01-15,Laptop Pro,Electrónicos,Norte,2,1500.00<br/>
              2024-01-16,Mouse,Accesorios,Sur,5,45.99
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <a 
            href="/reports" 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Ver Informes →
          </a>
        </div>
      </div>
    </Layout>
  );
};

// Dashboard completo con gráficos reales
const FullDashboard = () => {
  const [dashboardData, setDashboardData] = React.useState<DashboardData | null>(null);
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
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          setError('No estás autenticado');
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
      <Layout>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-600">Cargando dashboard...</p>
          </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Error al cargar dashboard</h2>
          <p>{error}</p>
          </div>
      </Layout>
    );
  }

  const stats = dashboardData?.statistics || {
    total_files: 0,
    total_reports: 0,
    total_sales: 0,
    total_records: 0
  };

  return (
    <Layout>
      <div id="dashboard-content" className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 Dashboard - IntelliReport
          </h1>
          <p className="text-gray-600">
            Resumen ejecutivo de tus análisis de datos y métricas de negocio
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Total de Ventas
              </h3>
              <div className="text-2xl">💰</div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              ${stats.total_sales ? Number(stats.total_sales).toLocaleString() : '0'}
            </p>
            <p className="text-sm text-green-600">
              📈 Basado en {stats.total_records} registros
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Archivos Procesados
              </h3>
              <div className="text-2xl">📁</div>
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-2">
              {stats.total_files}
            </p>
            <p className="text-sm text-blue-600">
              📊 {stats.total_reports} informes generados
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Registros Analizados
              </h3>
              <div className="text-2xl">📋</div>
            </div>
            <p className="text-3xl font-bold text-green-600 mb-2">
              {stats.total_records?.toLocaleString() || '0'}
            </p>
            <p className="text-sm text-green-600">
              🔍 Datos procesados con IA
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Promedio por Venta
              </h3>
              <div className="text-2xl">📊</div>
            </div>
            <p className="text-3xl font-bold text-yellow-600 mb-2">
              ${stats.total_records > 0 ? ((stats.total_sales || 0) / stats.total_records).toFixed(2) : '0'}
            </p>
            <p className="text-sm text-yellow-600">
              💡 Valor promedio calculado
            </p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico de Líneas */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
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
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico de Pie */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
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
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              🤖 Resumen Automático con IA
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="text-base font-semibold mb-2 text-gray-700">
                Análisis de Performance
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {stats.total_files > 0 ? 
                  `Basado en ${stats.total_files} archivo(s) procesado(s), se han analizado ${stats.total_records.toLocaleString()} registros de ventas, generando un volumen total de $${Number(stats.total_sales || 0).toLocaleString()}. El promedio por transacción es de $${stats.total_records > 0 ? ((stats.total_sales || 0) / stats.total_records).toFixed(2) : '0'}.`
                  :
                  'Aún no has subido archivos para análisis. Te recomendamos comenzar subiendo un archivo CSV con datos de ventas para generar insights automáticos con IA.'
                }
              </p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="text-base font-semibold mb-2 text-yellow-800">
                💡 Recomendaciones
              </h4>
              <ul className="text-sm text-yellow-700 leading-relaxed pl-4 space-y-1">
                <li>• Enfócate en las categorías con mejor rendimiento</li>
                <li>• Analiza las tendencias estacionales en tus datos</li>
                <li>• Considera expandir en regiones con menor participación</li>
                <li>• Optimiza el inventario basado en los patrones de demanda</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="bg-white p-8 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-6 text-gray-900">
            🚀 Acciones Rápidas
          </h3>
          <div className="flex flex-wrap gap-4">
            <a 
              href="/upload" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition-colors"
            >
              📤 Subir Nuevo Archivo
            </a>
            <a 
              href="/reports" 
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition-colors"
            >
              📊 Ver Todos los Informes
            </a>
            {/* <button 
              onClick={async () => {
                await exportDashboardToPDF('dashboard-content', {
                  filename: `dashboard-intellireport-${new Date().toISOString().split('T')[0]}.pdf`
                });
              }}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition-colors"
            >
              📄 Exportar Dashboard PDF
            </button>
            <button 
              onClick={async () => {
                await exportQuickStats(stats);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition-colors"
            >
              📋 Resumen Ejecutivo PDF
            </button> */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

// ReportsPage simplificada para testing
const SimpleReportsPage = () => {
  const [reports, setReports] = React.useState<Report[]>([]);
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
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          setError('No estás autenticado');
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
      <Layout>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-600">Cargando informes...</p>
          </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📊 Mis Informes
        </h1>
          <p className="text-gray-600">
          Gestiona y visualiza tus informes de análisis de ventas
        </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Informes Recientes</h2>
            <a 
              href="/upload" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              📤 Subir Nuevo Archivo
            </a>
          </div>
          
          {reports.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg mb-4 text-gray-600">📄 No tienes informes todavía</p>
              <p className="mb-8 text-gray-500">Sube tu primer archivo CSV para generar informes automáticos</p>
              <a 
                href="/upload" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                📤 Subir Archivo
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {report.title || `Informe #${report.id}`}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Creado: {new Date(report.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
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
                          } catch {
                            alert('Error de conexión al descargar PDF');
                          }
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        📄 PDF
                      </button>
                      <a 
                        href={`/reports/${report.id}`}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Ver Detalles →
                      </a>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Registros</p>
                      <p className="text-xl font-bold text-gray-900">
                        {report.total_records || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total Ventas</p>
                      <p className="text-xl font-bold text-green-600">
                        ${report.total_sales ? Number(report.total_sales).toLocaleString() : '0'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Estado</p>
                      <p className="text-sm font-medium text-green-600">
                        ✅ Completado
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Tipos de Informes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-900">📈 Análisis de Ventas</h4>
              <p className="text-gray-600 text-sm">Tendencias y patrones de ventas</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-900">🏷️ Análisis por Producto</h4>
              <p className="text-gray-600 text-sm">Performance de productos</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-900">🌍 Análisis Regional</h4>
              <p className="text-gray-600 text-sm">Ventas por región geográfica</p>
            </div>
          </div>
        </div>
        </div>
    </Layout>
  );
};

// ReportDetailPage simplificada para testing
const SimpleReportDetailPage = () => {
  const [report, setReport] = React.useState<Report | null>(null);
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
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          setError('No estás autenticado');
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
      <Layout>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-600">Cargando informe...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-red-600 mb-8">{error}</p>
          <a href="/reports" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            ← Volver a Informes
          </a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📊 Informe #{reportId}
        </h1>
        </div>
        
        {report && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">
              {report.title || 'Análisis de Datos'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Total de Registros</h3>
                <p className="text-2xl font-bold text-gray-900">{report.total_records || 0}</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Total de Ventas</h3>
                <p className="text-2xl font-bold text-green-600">
                  ${report.total_sales ? Number(report.total_sales).toLocaleString() : '0'}
                </p>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Fecha de Análisis</h3>
                <p className="text-base text-gray-900">
                  {report.created_at ? new Date(report.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
            
            {report.summary && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">📋 Resumen del Análisis</h3>
                <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap text-gray-700">
                  {report.summary}
                </div>
              </div>
            )}
            
            {report.insights && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">💡 Insights Generados</h3>
                <div className="bg-yellow-50 p-6 rounded-lg whitespace-pre-wrap text-yellow-800">
                  {report.insights}
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="flex flex-wrap gap-4">
          <a 
            href="/reports" 
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            ← Volver a Informes
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
              } catch {
                alert('Error de conexión al descargar PDF');
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            📄 Descargar PDF
          </button>
          <a 
            href="/upload" 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            📤 Subir Otro Archivo
          </a>
        </div>
      </div>
    </Layout>
  );
};

function App() {
  return (
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
            {/* Páginas públicas que funcionan */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/logout" element={<LogoutPage />} />
              
            {/* Páginas de perfil y usuario */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-info"
                element={
                  <ProtectedRoute>
                    <UserInfoPage />
                  </ProtectedRoute>
                }
              />
              
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
