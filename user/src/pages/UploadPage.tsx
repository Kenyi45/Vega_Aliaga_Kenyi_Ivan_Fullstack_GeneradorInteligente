import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, HelpCircle } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { FileDropzone } from '../components/upload/FileDropzone';
import { FileList } from '../components/upload/FileList';
import { Card, CardHeader, CardContent } from '../components/ui';

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();

  const handleUploadSuccess = (reportId: number) => {
    // Redirigir al informe generado después de unos segundos
    setTimeout(() => {
      navigate(`/reports/${reportId}`);
    }, 3000);
  };

  const handleViewReport = (reportId: number) => {
    navigate(`/reports/${reportId}`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subir Archivo CSV</h1>
          <p className="text-gray-600">
            Sube tu archivo de datos de ventas para generar informes inteligentes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Área de subida */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Subir Nuevo Archivo
                </h2>
              </CardHeader>
              <CardContent>
                <FileDropzone onUploadSuccess={handleUploadSuccess} />
              </CardContent>
            </Card>

            {/* Lista de archivos */}
            <FileList onViewReport={handleViewReport} />
          </div>

          {/* Panel de ayuda */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Guía de Uso
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm text-gray-600">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      1. Formato del Archivo
                    </h4>
                    <p>
                      Tu archivo CSV debe contener columnas de ventas como:
                      fecha, producto, cantidad, precio, región, etc.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      2. Columnas Recomendadas
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Fecha (Date, Fecha)</li>
                      <li>Producto (Product, Producto)</li>
                      <li>Cantidad (Quantity, Cantidad)</li>
                      <li>Precio/Ventas (Price, Sales, Precio, Ventas)</li>
                      <li>Región (Region, Región)</li>
                      <li>Categoría (Category, Categoría)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      3. Proceso de Análisis
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Subida y validación del archivo</li>
                      <li>Análisis automático de datos</li>
                      <li>Generación de gráficos</li>
                      <li>Creación de insights automáticos</li>
                      <li>Informe listo para visualizar</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      4. Formatos Soportados
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Archivos .csv</li>
                      <li>Codificación UTF-8</li>
                      <li>Separador: coma (,)</li>
                      <li>Tamaño máximo: 10MB</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium text-gray-900">
                  Ejemplo de Datos
                </h3>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-md p-3 text-xs font-mono">
                  <div className="text-gray-700">
                    fecha,producto,categoria,region,cantidad,precio<br />
                    2024-01-15,Laptop Pro,Electrónicos,Norte,2,1500.00<br />
                    2024-01-16,Mouse Inalámbrico,Accesorios,Sur,5,45.99<br />
                    2024-01-17,Teclado Mecánico,Accesorios,Centro,3,120.50
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}; 