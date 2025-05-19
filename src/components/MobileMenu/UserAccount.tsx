"use client";
import Link from 'next/link';
import { User, Home, LogOut } from 'lucide-react';
import { STYLES } from '@/constants/uiStyles';
import { IUserAccountProps } from './types';

/**
 * UserAccount Component
 * Displays user information and authentication actions
 */
const UserAccount: React.FC<IUserAccountProps> = ({ 
  isLoggedIn, 
  userName, 
  userRole,
  onClose,
  onLogout 
}) => {
  return (
    <div className="px-4 py-2">
      <h2 className={STYLES.sectionHeading}>Account</h2>
      
      {isLoggedIn ? (
        <div className="mt-2 pt-2">
          {/* User profile */}
          <div className={STYLES.userProfile}>
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full
                bg-primary-100 dark:bg-primary-900/20
                text-primary-600 dark:text-primary-400
                flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
            </div>
            <div className="ml-3">
              <div className="font-medium text-gray-900 dark:text-white">
                {userName || 'User'}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {userRole || 'Member'}
              </div>
            </div>
          </div>

          {/* User actions */}
          <div className="space-y-1 mt-3">
            <Link
              href="/dashboards"
              onClick={onClose}
              className={STYLES.actionButton}
              aria-label="Go to dashboard"
            >
              <Home className="h-5 w-5 mr-3" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-2 pt-2">
          <div className="space-y-3">
            <Link
              href="/login"
              onClick={onClose}
              className={STYLES.primaryButton}
              aria-label="Sign in to your account"
            >
              Sign In
            </Link>

            <Link
              href="/signup"
              onClick={onClose}
              className={STYLES.secondaryButton}
              aria-label="Create a new account"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAccount; 