import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Calendar, TrendingUp } from 'lucide-react';
import type { Report } from '../../types/dashboard';
import { formatCurrency, formatDate, formatNumber } from '../../utils/formatters';
import { cn } from '../../utils/cn';

interface RecentReportsProps {
  reports: Report[];
  className?: string;
}

interface ReportItemProps {
  report: Report;
}

const ReportItem: React.FC<ReportItemProps> = ({ report }) => {
  return (
    <div className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                {report.title || 'Sin título'}
              </h4>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(report.created_at)}
                </span>
                <span className="flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {formatNumber(report.total_records || 0)} registros
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-green-600">
                {formatCurrency(parseFloat((report.total_sales || 0).toString()))}
              </p>
              <Link
                to={`/reports/${report.id}`}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center mt-1"
              >
                Ver detalles
                <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RecentReports: React.FC<RecentReportsProps> = ({
  reports,
  className,
}) => {
  if (reports.length === 0) {
    return (
      <div className={cn('p-6', className)}>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Informes Recientes</h3>
        <div className="text-center py-8">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">
            No hay informes disponibles. Sube un archivo CSV para comenzar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('p-6', className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Informes Recientes
        </h3>
        <Link
          to="/reports"
          className="text-sm text-blue-600 hover:text-blue-500 font-medium flex items-center"
        >
          Ver todos
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      <div className="space-y-4">
        {reports.slice(0, 5).map((report) => (
          <ReportItem key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}; 