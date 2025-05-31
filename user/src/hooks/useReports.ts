import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reportService, handleApiError } from '../services/api';
import { AxiosError } from 'axios';

// Hook para obtener dashboard
export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: reportService.getDashboard,
    staleTime: 1 * 60 * 1000, // 1 minuto
    refetchInterval: 30 * 1000, // Actualizar cada 30 segundos
  });
};

// Hook para obtener todos los reportes
export const useReports = () => {
  return useQuery({
    queryKey: ['reports'],
    queryFn: reportService.getReports,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

// Hook para obtener un reporte específico
export const useReport = (reportId: number | null) => {
  return useQuery({
    queryKey: ['report', reportId],
    queryFn: () => reportService.getReport(reportId!),
    enabled: !!reportId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para generar PDF
export const useGeneratePDF = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reportId: number) => reportService.generatePDF(reportId),
    onSuccess: (data, reportId) => {
      // Actualizar el reporte en cache con la URL del PDF
      queryClient.setQueryData(['report', reportId], (oldData: any) => {
        if (oldData) {
          return { ...oldData, pdf_url: data.pdf_url };
        }
        return oldData;
      });
    },
    onError: (error: AxiosError) => {
      throw new Error(handleApiError(error));
    },
  });
};

// Hook para descargar PDF
export const useDownloadPDF = () => {
  return useMutation({
    mutationFn: async (reportId: number) => {
      const blob = await reportService.downloadPDF(reportId);
      
      // Crear URL temporal para la descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `informe-${reportId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    },
    onError: (error: AxiosError) => {
      throw new Error(handleApiError(error));
    },
  });
}; 