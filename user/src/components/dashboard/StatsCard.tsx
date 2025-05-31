import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '../ui';
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
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  className?: string;
}

const colorClasses = {
  blue: {
    icon: 'bg-blue-500 text-white',
    trend: 'text-blue-600',
  },
  green: {
    icon: 'bg-green-500 text-white',
    trend: 'text-green-600',
  },
  yellow: {
    icon: 'bg-yellow-500 text-white',
    trend: 'text-yellow-600',
  },
  red: {
    icon: 'bg-red-500 text-white',
    trend: 'text-red-600',
  },
  gray: {
    icon: 'bg-gray-500 text-white',
    trend: 'text-gray-600',
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
    <Card className={cn('p-6', className)}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={cn('p-3 rounded-lg', colors.icon)}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">
                {value}
              </div>
              {trend && (
                <div
                  className={cn(
                    'ml-2 flex items-baseline text-sm font-semibold',
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  <svg
                    className={cn(
                      'self-center flex-shrink-0 h-5 w-5',
                      trend.isPositive ? 'text-green-500' : 'text-red-500'
                    )}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d={
                        trend.isPositive
                          ? 'M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z'
                          : 'M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z'
                      }
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">
                    {trend.isPositive ? 'Aumentó' : 'Disminuyó'} en
                  </span>
                  {Math.abs(trend.value)}%
                </div>
              )}
            </dd>
            {subtitle && (
              <dd className="mt-1 text-sm text-gray-500">{subtitle}</dd>
            )}
          </dl>
        </div>
      </div>
    </Card>
  );
}; 