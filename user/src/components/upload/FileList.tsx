import React, { useState } from 'react';
import { Trash2, RefreshCw, FileText, Eye } from 'lucide-react';
import { Card, Button, LoadingSection, Alert } from '../ui';
import { useFiles, useDeleteFile, useReprocessFile } from '../../hooks/useFiles';
import { formatDateTime, formatRelativeDate, getStatusColor, getStatusText } from '../../utils/formatters';
import type { CSVFile } from '../../types';

interface FileListProps {
  onViewReport?: (reportId: number) => void;
}

export const FileList: React.FC<FileListProps> = ({ onViewReport }) => {
  const [error, setError] = useState<string>('');
  const { data: files, isLoading, error: queryError } = useFiles();
  const deleteMutation = useDeleteFile();
  const reprocessMutation = useReprocessFile();

  const handleDelete = async (fileId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este archivo?')) {
      return;
    }

    try {
      setError('');
      await deleteMutation.mutateAsync(fileId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el archivo');
    }
  };

  const handleReprocess = async (fileId: number) => {
    try {
      setError('');
      const result = await reprocessMutation.mutateAsync(fileId);
      if (onViewReport) {
        onViewReport(result.report_id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al reprocesar el archivo');
    }
  };

  if (isLoading) {
    return <LoadingSection text="Cargando archivos..." />;
  }

  if (queryError) {
    return (
      <Alert variant="error">
        Error al cargar los archivos. Intenta recargar la página.
      </Alert>
    );
  }

  if (!files || files.length === 0) {
    return (
      <Card className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay archivos
        </h3>
        <p className="text-gray-500">
          Sube tu primer archivo CSV para comenzar a generar informes.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Archivos Subidos ({files.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {files.map((file) => (
            <FileItem
              key={file.id}
              file={file}
              onDelete={handleDelete}
              onReprocess={handleReprocess}
              onViewReport={onViewReport}
              isDeleting={deleteMutation.isPending}
              isReprocessing={reprocessMutation.isPending}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

interface FileItemProps {
  file: CSVFile;
  onDelete: (fileId: number) => void;
  onReprocess: (fileId: number) => void;
  onViewReport?: (reportId: number) => void;
  isDeleting: boolean;
  isReprocessing: boolean;
}

const FileItem: React.FC<FileItemProps> = ({
  file,
  onDelete,
  onReprocess,
  onViewReport,
  isDeleting,
  isReprocessing,
}) => {
  return (
    <div className="px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <FileText className="h-5 w-5 text-gray-400" />
        <div>
          <h4 className="text-sm font-medium text-gray-900">
            {file.original_name}
          </h4>
          <p className="text-sm text-gray-500">
            Subido {formatRelativeDate(file.created_at)} • {formatDateTime(file.created_at)}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
            file.status
          )}`}
        >
          {getStatusText(file.status)}
        </span>

        <div className="flex items-center space-x-2">
          {file.status === 'completed' && onViewReport && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewReport(file.id)}
            >
              <Eye className="h-4 w-4" />
              Ver Informe
            </Button>
          )}

          {file.status === 'error' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReprocess(file.id)}
              isLoading={isReprocessing}
            >
              <RefreshCw className="h-4 w-4" />
              Reprocesar
            </Button>
          )}

          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(file.id)}
            isLoading={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
}; 