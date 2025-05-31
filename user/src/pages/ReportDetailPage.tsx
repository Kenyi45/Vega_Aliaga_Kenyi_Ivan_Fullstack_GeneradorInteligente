import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { ReportView } from '../components/reports/ReportView';
import { LoadingSection, Alert, Button } from '../components/ui';
import { useReport } from '../hooks/useReports';

export const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const reportId = id ? parseInt(id, 10) : null;

  const { data: report, isLoading, error } = useReport(reportId);

  if (!reportId || isNaN(reportId)) {
    return <Navigate to="/reports" replace />;
  }

  if (isLoading) {
    return (
      <Layout>
        <LoadingSection text="Cargando informe..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="space-y-4">
          <Link to="/reports">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Informes
            </Button>
          </Link>
          <Alert variant="error">
            Error al cargar el informe. Verifica que el informe existe y tienes permisos para verlo.
          </Alert>
        </div>
      </Layout>
    );
  }

  if (!report) {
    return (
      <Layout>
        <div className="space-y-4">
          <Link to="/reports">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Informes
            </Button>
          </Link>
          <Alert variant="warning">
            No se encontró el informe solicitado.
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Navegación */}
        <Link to="/reports">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Informes
          </Button>
        </Link>

        {/* Contenido del informe */}
        <ReportView report={report} />
      </div>
    </Layout>
  );
}; 