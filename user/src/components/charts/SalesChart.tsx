import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardContent } from '../ui';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import type { ChartData, MonthlyTrend } from '../../types';

const COLORS = [
  '#3B82F6', // blue-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#8B5CF6', // violet-500
  '#06B6D4', // cyan-500
  '#84CC16', // lime-500
  '#F97316', // orange-500
];

interface SalesBarChartProps {
  title: string;
  data: ChartData;
  className?: string;
}

export const SalesBarChart: React.FC<SalesBarChartProps> = ({
  title,
  data,
  className,
}) => {
  const chartData = data.labels.map((label, index) => ({
    name: label,
    value: data.data[index] || 0,
  }));

  return (
    <Card className={className}>
      <CardHeader>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), 'Ventas']}
              labelStyle={{ color: '#374151' }}
            />
            <Bar dataKey="value" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

interface SalesPieChartProps {
  title: string;
  data: ChartData;
  className?: string;
}

export const SalesPieChart: React.FC<SalesPieChartProps> = ({
  title,
  data,
  className,
}) => {
  const chartData = data.labels.map((label, index) => ({
    name: label,
    value: data.data[index] || 0,
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className={className}>
      <CardHeader>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [
                formatCurrency(value),
                `${((value / total) * 100).toFixed(1)}%`,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

interface MonthlyTrendsChartProps {
  title: string;
  data: MonthlyTrend[];
  className?: string;
}

export const MonthlyTrendsChart: React.FC<MonthlyTrendsChartProps> = ({
  title,
  data,
  className,
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === 'sales') {
                  return [formatCurrency(value), 'Ventas'];
                }
                return [`${value.toFixed(1)}%`, 'Crecimiento'];
              }}
            />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="sales"
              stackId="1"
              stroke={COLORS[0]}
              fill={COLORS[0]}
              fillOpacity={0.6}
              name="Ventas"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="growth"
              stroke={COLORS[3]}
              strokeWidth={3}
              name="Crecimiento %"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

interface SalesLineChartProps {
  title: string;
  data: ChartData;
  className?: string;
}

export const SalesLineChart: React.FC<SalesLineChartProps> = ({
  title,
  data,
  className,
}) => {
  const chartData = data.labels.map((label, index) => ({
    name: label,
    value: data.data[index] || 0,
  }));

  return (
    <Card className={className}>
      <CardHeader>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), 'Ventas']}
              labelStyle={{ color: '#374151' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={COLORS[0]}
              strokeWidth={3}
              dot={{ fill: COLORS[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}; 