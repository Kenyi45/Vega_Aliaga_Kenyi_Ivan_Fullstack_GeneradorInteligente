import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Calendar } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui';
import { formatCurrency, formatRelativeDate } from '../../utils/formatters';
import type { ReportSummary } from '../../types';

interface RecentReportsProps {
  reports: ReportSummary[];
  className?: string;
}

export const RecentReports: React.FC<RecentReportsProps> = ({
  reports,
  className,
}) => {
  if (reports.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <h3 className="text-lg font-medium text-gray-900">Informes Recientes</h3>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">
              No hay informes disponibles. Sube un archivo CSV para comenzar.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
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
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports.slice(0, 5).map((report) => (
            <ReportItem key={report.id} report={report} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface ReportItemProps {
  report: ReportSummary;
}

const ReportItem: React.FC<ReportItemProps> = ({ report }) => {
  return (
    <Link
      to={`/reports/${report.id}`}
      className="block hover:bg-gray-50 rounded-lg p-3 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {report.csv_file.original_name}
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {formatRelativeDate(report.created_at)}
              </span>
              <span>{report.total_records} registros</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">
            {formatCurrency(parseFloat(report.total_sales))}
          </p>
          <p className="text-xs text-gray-500">Ventas totales</p>
        </div>
      </div>
    </Link>
  );
}; 