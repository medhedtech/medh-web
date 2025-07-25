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
                bg-gradient-to-br from-primary-500 to-primary-600 
                dark:from-primary-400 dark:to-primary-500
                text-white dark:text-white
                flex items-center justify-center font-semibold text-sm
                shadow-sm">
                {userName && userName.length > 0 ? 
                  userName.charAt(0).toUpperCase() : 
                  <User className="h-5 w-5" />
                }
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <div 
                className="font-medium text-gray-900 dark:text-white truncate"
                title={userName || 'User'}
              >
                {userName || 'User'}
              </div>
              <div 
                className="text-sm text-gray-500 dark:text-gray-400 capitalize truncate"
                title={userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'Member'}
              >
                {userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'Member'}
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
            
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className={`${STYLES.actionButton} text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left`}
              aria-label="Sign out of your account"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Sign Out</span>
            </button>
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