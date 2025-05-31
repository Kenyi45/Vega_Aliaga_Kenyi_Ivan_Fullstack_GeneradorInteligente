import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Button, Alert } from '../ui';
import { useUploadCSV } from '../../hooks/useFiles';
import { cn } from '../../utils/cn';

interface FileDropzoneProps {
  onUploadSuccess?: (reportId: number) => void;
  className?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onUploadSuccess,
  className,
}) => {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const uploadMutation = useUploadCSV();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        setError('');
        setSuccess('');
        
        const result = await uploadMutation.mutateAsync(file);
        setSuccess('¡Archivo subido exitosamente! Procesando datos...');
        onUploadSuccess?.(result.report_id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al subir el archivo');
      }
    },
    [uploadMutation, onUploadSuccess]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const hasRejectedFiles = fileRejections.length > 0;

  return (
    <div className={cn('space-y-4', className)}>
      {error && (
        <Alert variant="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {hasRejectedFiles && (
        <Alert variant="warning">
          <div>
            <p className="font-medium">Archivos rechazados:</p>
            <ul className="mt-1 list-disc list-inside text-sm">
              {fileRejections.map(({ file, errors }) => (
                <li key={file.name}>
                  {file.name} - {errors.map(e => e.message).join(', ')}
                </li>
              ))}
            </ul>
          </div>
        </Alert>
      )}

      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50',
          uploadMutation.isPending && 'pointer-events-none opacity-60'
        )}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            {uploadMutation.isPending ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                <span className="text-blue-600">Subiendo...</span>
              </div>
            ) : isDragActive ? (
              <Upload className="h-12 w-12 text-blue-500" />
            ) : (
              <FileText className="h-12 w-12 text-gray-400" />
            )}
          </div>

          <div>
            <p className="text-lg font-medium text-gray-900">
              {isDragActive
                ? 'Suelta el archivo aquí'
                : 'Arrastra y suelta tu archivo CSV'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              o{' '}
              <span className="text-blue-600 font-medium">
                haz clic para seleccionar
              </span>
            </p>
          </div>

          <div className="text-xs text-gray-400 space-y-1">
            <p>• Solo archivos CSV</p>
            <p>• Tamaño máximo: 10MB</p>
            <p>• Debe contener columnas de ventas (fecha, producto, cantidad, precio, etc.)</p>
          </div>
        </div>
      </div>

      {uploadMutation.isPending && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Subiendo y procesando archivo... Esto puede tomar unos momentos.
          </p>
        </div>
      )}
    </div>
  );
}; 