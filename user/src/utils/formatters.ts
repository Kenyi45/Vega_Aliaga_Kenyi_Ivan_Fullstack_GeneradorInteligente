import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Formatear números como moneda
export const formatCurrency = (amount: number | string): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'USD',
  }).format(numAmount);
};

// Formatear números con separadores de miles
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('es-PE').format(num);
};

// Formatear porcentajes
export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};

// Formatear fechas
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd/MM/yyyy', { locale: es });
};

// Formatear fechas con hora
export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: es });
};

// Formatear fechas relativas
export const formatRelativeDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Hoy';
  if (diffInDays === 1) return 'Ayer';
  if (diffInDays < 7) return `Hace ${diffInDays} días`;
  if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`;
  
  return formatDate(dateObj);
};

// Truncar texto
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Obtener color basado en estado
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'text-green-600 bg-green-100';
    case 'processing':
      return 'text-yellow-600 bg-yellow-100';
    case 'error':
      return 'text-red-600 bg-red-100';
    case 'uploaded':
      return 'text-blue-600 bg-blue-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

// Obtener texto de estado en español
export const getStatusText = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'Completado';
    case 'processing':
      return 'Procesando';
    case 'error':
      return 'Error';
    case 'uploaded':
      return 'Subido';
    default:
      return 'Desconocido';
  }
}; 