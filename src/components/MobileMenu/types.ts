import { LucideIcon } from 'lucide-react';

// Common interfaces
export interface IBasicProps {
  children?: React.ReactNode;
  className?: string;
}

// Menu item interfaces
export interface IMenuItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  color?: string;
  bg?: string;
  onClick?: () => void;
}

// Mobile menu props
export interface IMobileMenuProps {
  isOpen?: boolean;
  onClose?: () => void;
}

// Search Bar props
export interface ISearchBarProps {
  onClose: () => void;
}

// Search suggestion
export interface ISearchSuggestion {
  type: string;
  title: string;
  path: string;
}

// User account props
export interface IUserAccountProps {
  isLoggedIn: boolean;
  userName?: string;
  userRole?: string;
  onClose: () => void;
  onLogout: () => void;
}

// Quick Actions props
export interface IQuickActionsProps {
  isLoggedIn: boolean;
  onClose: () => void;
}

// Industries props
export interface IIndustriesProps {
  onClose: () => void;
}

// Theme switcher props
export interface IThemeSwitcherProps {
  onClose: () => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
} 