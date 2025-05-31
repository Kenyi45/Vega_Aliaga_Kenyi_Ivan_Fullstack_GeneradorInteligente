import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Upload, 
  BarChart3, 
  AlertCircle, 
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp 
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { StatsCard } from '../components/dashboard/StatsCard';
import { RecentReports } from '../components/dashboard/RecentReports';
import { LoadingSection, Alert, Button } from '../components/ui';
import { useDashboard } from '../hooks/useReports';
import { formatCurrency, formatNumber } from '../utils/formatters';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: dashboardData, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <Layout>
        <LoadingSection text="Cargando dashboard..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Alert variant="error">
          Error al cargar el dashboard. Intenta recargar la página.
        </Alert>
      </Layout>
    );
  }

  if (!dashboardData) {
    return (
      <Layout>
        <Alert variant="warning">
          No se pudieron cargar los datos del dashboard.
        </Alert>
      </Layout>
    );
  }

  const { statistics, recent_reports } = dashboardData;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">
              Resumen de tus informes y análisis de ventas
            </p>
          </div>
          <Button
            onClick={() => navigate('/upload')}
            className="flex items-center"
          >
            <Upload className="h-4 w-4 mr-2" />
            Subir Archivo
          </Button>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Archivos Totales"
            value={formatNumber(statistics.total_files)}
            subtitle="Archivos subidos"
            icon={FileText}
            color="blue"
          />
          <StatsCard
            title="Informes Generados"
            value={formatNumber(statistics.total_reports)}
            subtitle="Análisis completados"
            icon={BarChart3}
            color="green"
          />
          <StatsCard
            title="Ventas Analizadas"
            value={formatCurrency(statistics.total_sales)}
            subtitle="Total procesado"
            icon={DollarSign}
            color="yellow"
          />
          <StatsCard
            title="Registros Procesados"
            value={formatNumber(statistics.total_records)}
            subtitle="Datos analizados"
            icon={TrendingUp}
            color="gray"
          />
        </div>

        {/* Estado de archivos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Completados"
            value={formatNumber(statistics.completed_files)}
            subtitle="Listos para ver"
            icon={CheckCircle}
            color="green"
          />
          <StatsCard
            title="Procesando"
            value={formatNumber(statistics.processing_files)}
            subtitle="En análisis"
            icon={Clock}
            color="yellow"
          />
          <StatsCard
            title="Con Errores"
            value={formatNumber(statistics.error_files)}
            subtitle="Requieren atención"
            icon={AlertCircle}
            color="red"
          />
        </div>

        {/* Informes recientes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentReports
              reports={recent_reports}
              className="h-full"
            />
          </div>

          {/* Panel de acciones rápidas */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">¿Nuevo por aquí?</h3>
              <p className="text-blue-100 text-sm mb-4">
                Sube tu primer archivo CSV para comenzar a generar informes inteligentes
              </p>
              <Button
                variant="outline"
                onClick={() => navigate('/upload')}
                className="bg-white text-blue-600 hover:bg-gray-50 border-white"
              >
                <Upload className="h-4 w-4 mr-2" />
                Subir Archivo
              </Button>
            </div>

            {statistics.total_reports > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Acciones Rápidas
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/reports')}
                    className="w-full justify-start"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Ver Todos los Informes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/upload')}
                    className="w-full justify-start"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Subir Nuevo Archivo
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}; 