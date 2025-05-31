export interface DashboardStatistics {
  total_files: number;
  total_reports: number;
  total_sales: number;
  total_records: number;
}

export interface DashboardData {
  statistics: DashboardStatistics;
  charts?: {
    monthly_sales?: any[];
    category_sales?: any[];
    regional_distribution?: any[];
  };
}

export interface Report {
  id: number;
  title?: string;
  created_at: string;
  total_records?: number;
  total_sales?: number;
  summary?: string;
  insights?: string;
}

export interface ChartDataPoint {
  [key: string]: string | number;
}

export interface PieDataPoint {
  name: string;
  value: number;
  color: string;
} 