// Tipos de autenticación
export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  company?: string;
  position?: string;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  company?: string;
  position?: string;
  password: string;
  password_confirm: string;
}

export interface AuthResponse {
  message: string;
  refresh: string;
  access: string;
  user: User;
}

// Tipos para archivos CSV
export interface CSVFile {
  id: number;
  original_name: string;
  status: 'uploaded' | 'processing' | 'completed' | 'error';
  created_at: string;
  updated_at: string;
}

// Tipos para datos de ventas
export interface SalesData {
  id: number;
  date: string;
  product: string;
  category: string;
  region: string;
  sales_amount: string;
  quantity: number;
  additional_data: Record<string, any>;
}

// Tipos para tendencias mensuales
export interface MonthlyTrend {
  month: string;
  sales: number;
  growth: number;
}

// Tipos para datos de gráficos
export interface ChartData {
  labels: string[];
  data: number[];
}

// Tipos para informes
export interface Report {
  id: number;
  csv_file: CSVFile;
  total_sales: string;
  total_records: number;
  date_range_start: string;
  date_range_end: string;
  top_products: ChartData;
  sales_by_region: ChartData;
  sales_by_date: ChartData;
  monthly_trends: MonthlyTrend[];
  auto_insights: string;
  created_at: string;
  updated_at: string;
  sales_data_sample: SalesData[];
  pdf_url?: string;
}

export interface ReportSummary {
  id: number;
  csv_file: CSVFile;
  total_sales: string;
  total_records: number;
  date_range_start: string;
  date_range_end: string;
  created_at: string;
}

// Tipos para dashboard
export interface DashboardStats {
  total_files: number;
  total_reports: number;
  completed_files: number;
  processing_files: number;
  error_files: number;
  total_sales: number;
  total_records: number;
}

export interface DashboardData {
  statistics: DashboardStats;
  recent_reports: ReportSummary[];
}

// Tipos para respuestas de la API
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}

// Tipos para upload
export interface UploadResponse {
  message: string;
  csv_file: CSVFile;
  report_id: number;
}

// Tipos para PDF
export interface PDFResponse {
  message: string;
  pdf_url: string;
} 