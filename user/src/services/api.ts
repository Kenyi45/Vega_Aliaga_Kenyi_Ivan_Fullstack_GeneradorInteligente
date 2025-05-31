import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  CSVFile,
  Report,
  DashboardData,
  UploadResponse,
  PDFResponse,
  ApiError,
} from '../types';

// Extender la interfaz para incluir _retry
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    // Si el token ha expirado, intentar refrescarlo
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          // Reintentar la solicitud original
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access}`;
          }
          return api(originalRequest);
        }
      } catch {
        // Si no se puede refrescar el token, cerrar sesión
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login/', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register/', data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile/');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put('/auth/profile/', data);
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<{ access: string }> => {
    const response = await api.post('/auth/token/refresh/', {
      refresh: refreshToken,
    });
    return response.data;
  },
};

// Servicios de archivos CSV
export const fileService = {
  uploadCSV: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getFiles: async (): Promise<CSVFile[]> => {
    const response = await api.get('/csv-files/');
    return response.data;
  },

  deleteFile: async (fileId: number): Promise<{ message: string }> => {
    const response = await api.delete(`/csv-files/${fileId}/delete/`);
    return response.data;
  },

  reprocessFile: async (fileId: number): Promise<{ message: string; report_id: number }> => {
    const response = await api.post(`/csv-files/${fileId}/reprocess/`);
    return response.data;
  },
};

// Servicios de informes
export const reportService = {
  getDashboard: async (): Promise<DashboardData> => {
    const response = await api.get('/dashboard/');
    return response.data;
  },

  getReport: async (reportId: number): Promise<Report> => {
    const response = await api.get(`/reports/${reportId}/`);
    return response.data;
  },

  getReports: async (): Promise<Report[]> => {
    const response = await api.get('/reports/');
    return response.data;
  },

  generatePDF: async (reportId: number): Promise<PDFResponse> => {
    const response = await api.post(`/reports/${reportId}/generate-pdf/`);
    return response.data;
  },

  downloadPDF: async (reportId: number): Promise<Blob> => {
    const response = await api.get(`/reports/${reportId}/download-pdf/`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// Manejo de errores
export const handleApiError = (error: AxiosError<ApiError>): string => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  if (error.response?.data?.details) {
    const details = error.response.data.details;
    const firstError = Object.values(details)[0];
    return Array.isArray(firstError) ? firstError[0] : 'Error desconocido';
  }

  if (error.message) {
    return error.message;
  }

  return 'Ha ocurrido un error inesperado';
};

// Utilidades
export const isValidToken = (): boolean => {
  const token = localStorage.getItem('access_token');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch {
    return false;
  }
};

export const clearAuthTokens = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

export default api; 