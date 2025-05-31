import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, handleApiError } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { LoginCredentials, RegisterData } from '../types';
import { AxiosError } from 'axios';

// Hook para login
export const useLogin = () => {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      login(data.user, {
        access: data.access,
        refresh: data.refresh,
      });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: AxiosError) => {
      throw new Error(handleApiError(error));
    },
  });
};

// Hook para registro
export const useRegister = () => {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (data) => {
      login(data.user, {
        access: data.access,
        refresh: data.refresh,
      });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: AxiosError) => {
      throw new Error(handleApiError(error));
    },
  });
};

// Hook para obtener perfil
export const useProfile = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['profile'],
    queryFn: authService.getProfile,
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para actualizar perfil
export const useUpdateProfile = () => {
  const { updateUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (data) => {
      updateUser(data);
      queryClient.setQueryData(['profile'], data);
    },
    onError: (error: AxiosError) => {
      throw new Error(handleApiError(error));
    },
  });
};

// Hook para logout
export const useLogout = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return () => {
    logout();
    queryClient.clear();
  };
}; 