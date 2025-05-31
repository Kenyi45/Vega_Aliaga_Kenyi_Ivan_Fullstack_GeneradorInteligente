import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, DollarSign, Eye } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Card, CardHeader, CardContent, LoadingSection, Alert, Button } from '../components/ui';
import { useReports } from '../hooks/useReports';
import { formatCurrency, formatDate, formatNumber } from '../utils/formatters';

export const ReportsPage: React.FC = () => {
  const { data: reports, isLoading, error } = useReports();

  if (isLoading) {
    return (
      <Layout>
        <LoadingSection text="Cargando informes..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Alert variant="error">
          Error al cargar los informes. Intenta recargar la página.
        </Alert>
      </Layout>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <Layout>
        <div className="text-center py-12">
          <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            No hay informes disponibles
          </h1>
          <p className="text-gray-600 mb-6">
            Sube tu primer archivo CSV para generar informes inteligentes
          </p>
          <Link to="/upload">
            <Button>
              Subir Archivo
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Informes</h1>
            <p className="text-gray-600">
              Todos tus análisis de ventas generados ({reports.length} informes)
            </p>
          </div>
          <Link to="/upload">
            <Button>
              Nuevo Informe
            </Button>
          </Link>
        </div>

        {/* Lista de informes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {report.csv_file.original_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(report.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Métricas principales */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Ventas Totales
                      </p>
                      <p className="text-lg font-semibold text-blue-600">
                        {formatCurrency(parseFloat(report.total_sales))}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Registros
                      </p>
                      <p className="text-lg font-semibold text-green-600">
                        {formatNumber(report.total_records)}
                      </p>
                    </div>
                  </div>

                  {/* Período */}
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Período de Datos
                    </p>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(report.date_range_start)} - {formatDate(report.date_range_end)}
                    </div>
                  </div>

                  {/* Insights (extracto) */}
                  {report.auto_insights && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        Insight Principal
                      </p>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {report.auto_insights.substring(0, 120)}
                        {report.auto_insights.length > 120 && '...'}
                      </p>
                    </div>
                  )}

                  {/* Botón de acción */}
                  <div className="pt-4 border-t border-gray-200">
                    <Link to={`/reports/${report.id}`} className="block">
                      <Button variant="outline" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Informe Completo
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}; 