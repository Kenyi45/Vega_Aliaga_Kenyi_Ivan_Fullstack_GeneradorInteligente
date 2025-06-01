import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  className?: string;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-500',
    text: 'text-blue-600',
    trendPositive: 'text-blue-600',
    trendNegative: 'text-red-500',
  },
  green: {
    bg: 'bg-green-50',
    iconBg: 'bg-green-500',
    text: 'text-green-600',
    trendPositive: 'text-green-600',
    trendNegative: 'text-red-500',
  },
  yellow: {
    bg: 'bg-yellow-50',
    iconBg: 'bg-yellow-500',
    text: 'text-yellow-600',
    trendPositive: 'text-green-600',
    trendNegative: 'text-red-500',
  },
  red: {
    bg: 'bg-red-50',
    iconBg: 'bg-red-500',
    text: 'text-red-600',
    trendPositive: 'text-green-600',
    trendNegative: 'text-red-600',
  },
  purple: {
    bg: 'bg-purple-50',
    iconBg: 'bg-purple-500',
    text: 'text-purple-600',
    trendPositive: 'text-green-600',
    trendNegative: 'text-red-500',
  },
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'blue',
  className,
}) => {
  const colors = colorClasses[color];

  return (
    <div className={cn('bg-white rounded-xl p-6 shadow-sm border border-gray-100', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <div className={cn('p-2 rounded-lg', colors.iconBg)}>
              <Icon className="h-5 w-5 text-white" />
          </div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              {title}
            </h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-gray-900">
                {value}
              </span>
              {trend && (
                <div className="flex items-center space-x-1">
                  {trend.isPositive ? (
                    <span className="text-green-500 text-lg">▲</span>
                  ) : (
                    <span className="text-red-500 text-lg">▼</span>
                  )}
                  <span className={cn(
                    'text-sm font-semibold',
                    trend.isPositive ? 'text-green-600' : 'text-red-500'
                  )}>
                    {Math.abs(trend.value)}%
                  </span>
                </div>
              )}
            </div>
            
            {subtitle && (
              <p className="text-sm text-gray-500">
                {trend && (
                  <span className={cn(
                    'font-medium mr-1',
                    trend.isPositive ? 'text-green-600' : 'text-red-500'
                  )}>
                    {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
                  </span>
                )}
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 