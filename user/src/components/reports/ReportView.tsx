import React, { useState } from 'react';
import { Download, FileText, Calendar, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardContent, Button, LoadingSection, Alert } from '../ui';
import { SalesBarChart, SalesPieChart, MonthlyTrendsChart, SalesLineChart } from '../charts/SalesChart';
import { useGeneratePDF, useDownloadPDF } from '../../hooks/useReports';
import { formatCurrency, formatNumber, formatDate } from '../../utils/formatters';
import type { Report } from '../../types';

interface ReportViewProps {
  report: Report;
  className?: string;
}

export const ReportView: React.FC<ReportViewProps> = ({ report, className }) => {
  const [error, setError] = useState<string>('');
  const generatePDFMutation = useGeneratePDF();
  const downloadPDFMutation = useDownloadPDF();

  const handleGeneratePDF = async () => {
    try {
      setError('');
      await generatePDFMutation.mutateAsync(report.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar PDF');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setError('');
      await downloadPDFMutation.mutateAsync(report.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al descargar PDF');
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {error && (
        <Alert variant="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Header del informe */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Informe de Ventas
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Basado en: {report.csv_file.original_name}
              </p>
            </div>
            <div className="flex space-x-2">
              {report.pdf_url ? (
                <Button
                  variant="outline"
                  onClick={handleDownloadPDF}
                  isLoading={downloadPDFMutation.isPending}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar PDF
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleGeneratePDF}
                  isLoading={generatePDFMutation.isPending}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generar PDF
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {formatCurrency(parseFloat(report.total_sales))}
              </div>
              <div className="text-sm text-gray-500">Ventas Totales</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {formatNumber(report.total_records)}
              </div>
              <div className="text-sm text-gray-500">Registros</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-700">
                {formatDate(report.date_range_start)} - {formatDate(report.date_range_end)}
              </div>
              <div className="text-sm text-gray-500">Período</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights automáticos */}
      {report.auto_insights && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Insights Automáticos
            </h2>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {report.auto_insights}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesBarChart
          title="Top Productos por Ventas"
          data={report.top_products}
        />
        <SalesPieChart
          title="Ventas por Región"
          data={report.sales_by_region}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SalesLineChart
          title="Tendencia de Ventas por Fecha"
          data={report.sales_by_date}
        />
      </div>

      {report.monthly_trends && report.monthly_trends.length > 0 && (
        <div className="grid grid-cols-1 gap-6">
          <MonthlyTrendsChart
            title="Tendencias Mensuales"
            data={report.monthly_trends}
          />
        </div>
      )}

      {/* Muestra de datos */}
      {report.sales_data_sample && report.sales_data_sample.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">
              Muestra de Datos ({report.sales_data_sample.length} registros)
            </h2>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Región
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cantidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ventas
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {report.sales_data_sample.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(row.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.product}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.region}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(row.quantity)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(parseFloat(row.sales_amount))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información del informe */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">
            Información del Informe
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Archivo original:</span>
              <span className="ml-2 text-gray-600">{report.csv_file.original_name}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Fecha de creación:</span>
              <span className="ml-2 text-gray-600">{formatDate(report.created_at)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Última actualización:</span>
              <span className="ml-2 text-gray-600">{formatDate(report.updated_at)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Total de registros:</span>
              <span className="ml-2 text-gray-600">{formatNumber(report.total_records)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 