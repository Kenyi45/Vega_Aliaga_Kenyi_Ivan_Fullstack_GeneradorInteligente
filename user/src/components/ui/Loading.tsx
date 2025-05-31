import React from 'react';
import { cn } from '../../utils/cn';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

const Spinner: React.FC<{ size: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size,
  className,
}) => (
  <svg
    className={cn('animate-spin', sizeClasses[size], className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const Dots: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex space-x-1', className)}>
    <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
    <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
    <div className="h-2 w-2 animate-bounce rounded-full bg-current" />
  </div>
);

const Pulse: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex space-x-2', className)}>
    <div className="h-4 w-4 animate-pulse rounded-full bg-current" />
    <div className="h-4 w-4 animate-pulse rounded-full bg-current [animation-delay:0.2s]" />
    <div className="h-4 w-4 animate-pulse rounded-full bg-current [animation-delay:0.4s]" />
  </div>
);

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  className,
  text,
}) => {
  const renderLoading = () => {
    switch (variant) {
      case 'dots':
        return <Dots className={className} />;
      case 'pulse':
        return <Pulse className={className} />;
      default:
        return <Spinner size={size} className={className} />;
    }
  };

  if (text) {
    return (
      <div className="flex items-center justify-center space-x-2">
        {renderLoading()}
        <span className="text-sm text-gray-600">{text}</span>
      </div>
    );
  }

  return renderLoading();
};

// Componente de loading para página completa
export const LoadingPage: React.FC<{ text?: string }> = ({ text = 'Cargando...' }) => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-center">
      <Loading size="lg" className="mx-auto text-blue-600" />
      <p className="mt-4 text-lg text-gray-600">{text}</p>
    </div>
  </div>
);

// Componente de loading para secciones
export const LoadingSection: React.FC<{ text?: string; className?: string }> = ({
  text = 'Cargando...',
  className,
}) => (
  <div className={cn('flex items-center justify-center py-8', className)}>
    <div className="text-center">
      <Loading className="mx-auto text-blue-600" />
      <p className="mt-2 text-sm text-gray-600">{text}</p>
    </div>
  </div>
); 