"use client";
import { useCallback } from 'react';
import Link from 'next/link';
import { MENU_CONFIG } from '@/constants/menu';
import { STYLES } from '@/constants/uiStyles';
import { IIndustriesProps, IMenuItemProps } from './types';

/**
 * Industries Component
 * Displays industry categories for filtering courses
 */
const Industries: React.FC<IIndustriesProps> = ({ onClose }) => {
  // Menu item component for industries
  const IndustryItem = useCallback(({ 
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
        className={STYLES.menuItem}
        aria-label={`Browse ${label} courses`}
      >
        <div className={`${STYLES.iconWrapper} ${bg || ''}`}>
          <Icon className={`h-5 w-5 ${color || 'text-gray-700 dark:text-gray-300'}`} />
        </div>
        <span className="text-xs font-medium mt-1
          text-gray-600 dark:text-gray-400
          group-hover:text-gray-900 dark:group-hover:text-white">
          {label}
        </span>
      </Link>
    );
  }, [onClose]);

  return (
    <div className="px-4 py-3">
      <h2 className={STYLES.sectionHeading}>Browse By Industry</h2>
      <div className="grid grid-cols-4 gap-3">
        {MENU_CONFIG.industries.map((industry, index) => (
          <IndustryItem
            key={index}
            {...industry}
          />
        ))}
      </div>
    </div>
  );
};

export default Industries; 