import React from 'react';
import { buildAdvancedComponent } from '@/utils/designSystem';
import { Award, RefreshCw } from 'lucide-react';

const CertificateManagementLoading: React.FC = () => {
  const cardClasses = buildAdvancedComponent.glassCard({ variant: 'primary', hover: false });

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 animate-pulse"></div>
      </div>

      {/* Tab Navigation Skeleton */}
      <div className="mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[1, 2, 3].map((index) => (
              <div key={index} className="flex items-center space-x-2 py-4 px-1">
                <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        <div className={`${cardClasses} p-6`}>
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Award className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                <RefreshCw className="w-6 h-6 text-primary-500 absolute -top-1 -right-1 animate-spin" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Loading Certificate Management
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Please wait while we prepare your certificate management tools...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional skeleton cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`${cardClasses} p-6`}>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className={`${cardClasses} p-6`}>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateManagementLoading; 