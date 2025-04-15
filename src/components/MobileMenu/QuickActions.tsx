"use client";
import { useCallback } from 'react';
import Link from 'next/link';
import { MENU_CONFIG } from '@/constants/menu';
import { STYLES } from '@/constants/uiStyles';
import { IQuickActionsProps, IMenuItemProps } from './types';

/**
 * QuickActions Component
 * Displays quick access menu items based on authentication status
 */
const QuickActions: React.FC<IQuickActionsProps> = ({ 
  isLoggedIn, 
  onClose 
}) => {
  // Menu item component for quick actions
  const QuickActionItem = useCallback(({ 
    icon: Icon, 
    label, 
    path, 
    color, 
    bg 
  }: IMenuItemProps) => {
    return (
      <Link 
        href={path} 
        onClick={onClose}
        className={STYLES.quickActionItem}
        aria-label={label}
      >
        <div className={`flex items-center justify-center w-10 h-10 rounded-xl mb-1 ${bg || 'bg-gray-200 dark:bg-gray-700'}`}>
          <Icon className={`h-5 w-5 ${color || 'text-gray-700 dark:text-gray-300'}`} />
        </div>
        <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
      </Link>
    );
  }, [onClose]);

  // Get quick actions based on authentication status
  const getQuickActions = useCallback(() => {
    return isLoggedIn 
      ? MENU_CONFIG.quickActions.authenticated 
      : MENU_CONFIG.quickActions.guest;
  }, [isLoggedIn]);

  return (
    <div className="px-4 py-2">
      <h2 className={STYLES.sectionHeading}>Quick Access</h2>
      <div className={STYLES.gridContainer}>
        {getQuickActions().map((action, index) => (
          <QuickActionItem
            key={index}
            {...action}
          />
        ))}
      </div>
    </div>
  );
};

export default QuickActions; 