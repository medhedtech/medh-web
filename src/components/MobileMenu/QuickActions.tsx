"use client";
import React from 'react';
import Link from 'next/link';
import { IQuickActionsProps } from './types';
import { STYLES } from '@/constants/uiStyles';
import { MENU_CONFIG } from '@/constants/menu';

/**
 * Quick Actions component for most used application features
 */
const QuickActions: React.FC<IQuickActionsProps> = ({ 
  isLoggedIn,
  onClose 
}) => {
  // Get the appropriate quick actions based on authentication status
  const quickActions = isLoggedIn 
    ? MENU_CONFIG.quickActions.authenticated 
    : MENU_CONFIG.quickActions.guest;

  return (
    <div className="px-4 py-3">
      <h2 className={STYLES.sectionHeading}>Quick Actions</h2>
      <div className="grid grid-cols-4 gap-3 mt-2">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          
          return (
            <Link
              key={index}
              href={action.path}
              onClick={onClose}
              className={STYLES.quickAction}
            >
              <div className={`${STYLES.iconWrapper} ${action.bg || ''}`}>
                <Icon className={`h-5 w-5 ${action.color || 'text-gray-700 dark:text-gray-300'}`} />
              </div>
              <span className="text-xs font-medium mt-1 text-gray-600 dark:text-gray-400">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions; 