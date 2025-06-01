import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Upload, 
  BarChart3, 
  AlertCircle, 
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp 
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { StatsCard } from '../components/dashboard/StatsCard';
import { RecentReports } from '../components/dashboard/RecentReports';
import { LoadingSection, Alert, Button } from '../components/ui';
import { useDashboard } from '../hooks/useReports';
import { formatCurrency, formatNumber } from '../utils/formatters';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: dashboardData, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <Layout>
        <LoadingSection text="Cargando dashboard..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Alert variant="error">
          Error al cargar el dashboard. Intenta recargar la página.
        </Alert>
      </Layout>
    );
  }

  if (!dashboardData) {
    return (
      <Layout>
        <Alert variant="warning">
          No se pudieron cargar los datos del dashboard.
        </Alert>
      </Layout>
    );
  }

  const { statistics, recent_reports } = dashboardData;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Estadísticas principales - Diseño moderno como en la imagen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Sales"
            value={formatNumber(statistics.total_sales ? Math.floor(statistics.total_sales) : 890)}
            subtitle="+3.8k this week"
            icon={DollarSign}
            color="green"
            trend={{ value: 18, isPositive: true }}
          />
          <StatsCard
            title="Visitor"
            value={formatNumber(statistics.total_files * 100 || 1234)}
            subtitle="+2.8k this week"
            icon={FileText}
            color="yellow"
            trend={{ value: 18, isPositive: true }}
          />
          <StatsCard
            title="Total Orders"
            value={formatNumber(statistics.total_records || 567)}
            subtitle="+7.8k this week"
            icon={BarChart3}
            color="blue"
            trend={{ value: 18, isPositive: true }}
          />
          <StatsCard
            title="Refunded"
            value={formatNumber(statistics.error_files || 123)}
            subtitle="+1.2k this week"
            icon={TrendingUp}
            color="red"
            trend={{ value: 18, isPositive: false }}
          />
        </div>

        {/* Gráficos y tablas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Stats - Ocupa 2 columnas */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Revenue Stats</h3>
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>This year</option>
                  <option>Last year</option>
                  <option>This month</option>
                </select>
              </div>
              
              {/* Simulación de gráfico de líneas */}
              <div className="h-64 flex items-end justify-between space-x-2 border-b border-gray-200 pb-4">
                {[30, 45, 55, 70, 85, 95, 110, 125, 140, 160, 180, 200].map((height, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-500 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                      style={{ height: `${height}px` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                    </span>
                  </div>
                ))}
          </div>

              <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                <span>0</span>
                <span>250</span>
              </div>
            </div>
          </div>

          {/* Sales by Category - Ocupa 1 columna */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Sales by Category</h3>
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>This year</option>
                  <option>Last year</option>
                </select>
              </div>
              
              {/* Simulación de gráfico circular */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#FF6B6B"
                      strokeWidth="3"
                      strokeDasharray="30, 70"
                      strokeLinecap="round"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#4ECDC4"
                      strokeWidth="3"
                      strokeDasharray="25, 75"
                      strokeDashoffset="-30"
                      strokeLinecap="round"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#45B7D1"
                      strokeWidth="3"
                      strokeDasharray="20, 80"
                      strokeDashoffset="-55"
                      strokeLinecap="round"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#FFA726"
                      strokeWidth="3"
                      strokeDasharray="25, 75"
                      strokeDashoffset="-75"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
            </div>

              {/* Leyenda */}
                <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <span className="text-sm text-gray-600">Fashion</span>
                  </div>
                  <span className="text-sm font-semibold">15.8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-gray-600">Electronics</span>
                  </div>
                  <span className="text-sm font-semibold">29.1%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-sm text-gray-600">Health and Careness</span>
                  </div>
                  <span className="text-sm font-semibold">22.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                    <span className="text-sm text-gray-600">Sporting Goods</span>
                  </div>
                  <span className="text-sm font-semibold">33%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informes recientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <RecentReports
            reports={recent_reports}
            className="border-0 shadow-none"
          />
        </div>
      </div>
    </Layout>
  );
}; 