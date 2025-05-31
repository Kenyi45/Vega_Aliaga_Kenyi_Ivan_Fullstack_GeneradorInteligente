import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fileService, handleApiError } from '../services/api';
import { AxiosError } from 'axios';

// Hook para obtener archivos
export const useFiles = () => {
  return useQuery({
    queryKey: ['files'],
    queryFn: fileService.getFiles,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

// Hook para subir archivo CSV
export const useUploadCSV = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => fileService.uploadCSV(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
    onError: (error: AxiosError) => {
      throw new Error(handleApiError(error));
    },
  });
};

// Hook para eliminar archivo
export const useDeleteFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId: number) => fileService.deleteFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
    onError: (error: AxiosError) => {
      throw new Error(handleApiError(error));
    },
  });
};

// Hook para reprocesar archivo
export const useReprocessFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId: number) => fileService.reprocessFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
    onError: (error: AxiosError) => {
      throw new Error(handleApiError(error));
    },
  });
}; 