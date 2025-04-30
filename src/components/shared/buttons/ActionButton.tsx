import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  title?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'default';
  disabled?: boolean;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const variantMap = {
  primary: 'default',
  secondary: 'secondary',
  success: 'success',
  danger: 'destructive',
  warning: 'warning',
  info: 'outline',
  default: 'default'
};

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  onClick,
  title,
  variant = 'default',
  disabled = false,
  className = '',
  size = 'default'
}) => {
  const mappedVariant = variantMap[variant] || 'default';
  
  return (
    <Button
      onClick={onClick}
      variant={mappedVariant as any}
      disabled={disabled}
      className={`flex items-center ${className}`}
      size={size}
      title={title}
    >
      <Icon className="h-4 w-4" />
      {title && <span className="ml-2">{title}</span>}
    </Button>
  );
};

export default ActionButton; 