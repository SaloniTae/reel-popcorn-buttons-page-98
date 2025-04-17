
import React from 'react';
import { cn } from '@/lib/utils';

type LoadingSpinnerProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
};

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary',
  className,
  ...props 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const colorClasses = {
    primary: 'border-t-blue-600',
    white: 'border-t-white',
    gray: 'border-t-gray-600',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-solid border-gray-200',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      {...props}
    />
  );
};

export { LoadingSpinner };
