import React from 'react';

type SkeletonType = 'dashboard' | 'courses' | 'membership' | 'quiz' | 'form' | 'certificates' | 'payments' | 'calendar' | 'classes' | 'default';

interface SkeletonLoaderProps {
  /**
   * Type of skeleton to display, which determines the layout
   */
  type?: SkeletonType;
  
  /**
   * Number of items to show for list-type skeletons (e.g. courses)
   */
  count?: number;
  
  /**
   * Custom className to apply
   */
  className?: string;
}

/**
 * Skeleton loader component that provides consistent loading states
 * across the application. The type prop determines the layout.
 */
const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  type = 'default',
  count = 3,
  className = ''
}) => {
  // Base pulse animation class
  const pulseClass = "animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md";
  
  const renderDashboardSkeleton = () => (
    <div className="p-6 space-y-8">
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div className={`${pulseClass} h-10 w-56`}></div>
        <div className={`${pulseClass} h-10 w-32`}></div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={`stat-${i}`} className="p-5 rounded-xl border border-gray-100 dark:border-gray-800">
            <div className={`${pulseClass} h-6 w-32 mb-3`}></div>
            <div className={`${pulseClass} h-10 w-24 mb-2`}></div>
            <div className={`${pulseClass} h-4 w-full max-w-[180px]`}></div>
          </div>
        ))}
      </div>
      
      {/* Content section */}
      <div className="space-y-6">
        <div className={`${pulseClass} h-8 w-48 mb-4`}></div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={`content-${i}`} className="flex items-center gap-4">
              <div className={`${pulseClass} h-12 w-12 rounded-full`}></div>
              <div className="space-y-2 flex-1">
                <div className={`${pulseClass} h-5 w-full max-w-[260px]`}></div>
                <div className={`${pulseClass} h-4 w-full max-w-[180px]`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  const renderCoursesSkeleton = () => (
    <div className="p-6 space-y-6">
      {/* Filter section */}
      <div className="flex flex-wrap gap-4 justify-between mb-6">
        <div className={`${pulseClass} h-10 w-48`}></div>
        <div className="flex gap-3">
          <div className={`${pulseClass} h-10 w-28`}></div>
          <div className={`${pulseClass} h-10 w-28`}></div>
        </div>
      </div>
      
      {/* Course cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(count)].map((_, i) => (
          <div key={`course-${i}`} className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
            <div className={`${pulseClass} h-48 w-full`}></div>
            <div className="p-5 space-y-3">
              <div className={`${pulseClass} h-6 w-4/5`}></div>
              <div className={`${pulseClass} h-4 w-full`}></div>
              <div className={`${pulseClass} h-4 w-3/4`}></div>
              <div className="flex justify-between items-center pt-3">
                <div className={`${pulseClass} h-8 w-20`}></div>
                <div className={`${pulseClass} h-8 w-8 rounded-full`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  const renderMembershipSkeleton = () => (
    <div className="p-6 space-y-8">
      {/* Header section */}
      <div className={`${pulseClass} h-10 w-64 mb-8`}></div>
      
      {/* Membership cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={`plan-${i}`} className="border border-gray-100 dark:border-gray-800 rounded-xl p-6">
            <div className={`${pulseClass} h-7 w-32 mb-4`}></div>
            <div className={`${pulseClass} h-12 w-28 mb-3`}></div>
            <div className={`${pulseClass} h-4 w-full mb-6`}></div>
            
            <div className="space-y-3 mb-8">
              {[...Array(4)].map((_, j) => (
                <div key={`feature-${i}-${j}`} className="flex gap-2 items-center">
                  <div className={`${pulseClass} h-5 w-5 rounded-full`}></div>
                  <div className={`${pulseClass} h-4 w-full`}></div>
                </div>
              ))}
            </div>
            
            <div className={`${pulseClass} h-10 w-full rounded-md`}></div>
          </div>
        ))}
      </div>
    </div>
  );
  
  const renderFormSkeleton = () => (
    <div className="p-6 max-w-2xl mx-auto">
      <div className={`${pulseClass} h-10 w-48 mb-8`}></div>
      
      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={`field-${i}`} className="space-y-2">
            <div className={`${pulseClass} h-5 w-32`}></div>
            <div className={`${pulseClass} h-12 w-full rounded-md`}></div>
          </div>
        ))}
        
        <div className="pt-4">
          <div className={`${pulseClass} h-12 w-32 rounded-md`}></div>
        </div>
      </div>
    </div>
  );
  
  const renderCertificatesSkeleton = () => (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div className={`${pulseClass} h-10 w-64`}></div>
        <div className={`${pulseClass} h-10 w-32`}></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(count)].map((_, i) => (
          <div key={`cert-${i}`} className="border border-gray-100 dark:border-gray-800 rounded-xl p-5">
            <div className="flex gap-4">
              <div className={`${pulseClass} h-24 w-20 rounded-md`}></div>
              <div className="flex-1 space-y-3">
                <div className={`${pulseClass} h-6 w-full max-w-[260px]`}></div>
                <div className={`${pulseClass} h-4 w-32`}></div>
                <div className={`${pulseClass} h-4 w-48`}></div>
                <div className="flex gap-2">
                  <div className={`${pulseClass} h-8 w-24 rounded-md`}></div>
                  <div className={`${pulseClass} h-8 w-24 rounded-md`}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  const renderPaymentsSkeleton = () => (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div className={`${pulseClass} h-10 w-48`}></div>
        <div className="flex gap-2">
          <div className={`${pulseClass} h-10 w-24`}></div>
          <div className={`${pulseClass} h-10 w-32`}></div>
        </div>
      </div>
      
      <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800">
        <div className="grid grid-cols-6 p-4 bg-gray-50 dark:bg-gray-800/50">
          {[...Array(6)].map((_, i) => (
            <div key={`header-${i}`} className={`${pulseClass} h-5 w-3/4`}></div>
          ))}
        </div>
        
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {[...Array(count)].map((_, i) => (
            <div key={`payment-${i}`} className="grid grid-cols-6 p-4 items-center">
              {[...Array(6)].map((_, j) => (
                <div key={`cell-${i}-${j}`} className={`${pulseClass} h-5 w-${j === 0 ? '16' : j === 5 ? '20' : '3/4'}`}></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  const renderQuizSkeleton = () => (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <div className={`${pulseClass} h-10 w-64 mb-2`}></div>
      <div className={`${pulseClass} h-6 w-full max-w-md mb-10`}></div>
      
      <div className="space-y-10">
        {[...Array(count)].map((_, i) => (
          <div key={`question-${i}`} className="space-y-4">
            <div className={`${pulseClass} h-6 w-full max-w-lg`}></div>
            
            <div className="space-y-3 mt-4">
              {[...Array(4)].map((_, j) => (
                <div key={`answer-${i}-${j}`} className="flex items-center gap-3 p-3 border border-gray-100 dark:border-gray-800 rounded-lg">
                  <div className={`${pulseClass} h-5 w-5 rounded-full`}></div>
                  <div className={`${pulseClass} h-5 w-full max-w-[300px]`}></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-6 flex justify-between">
        <div className={`${pulseClass} h-10 w-24 rounded-md`}></div>
        <div className={`${pulseClass} h-10 w-24 rounded-md`}></div>
      </div>
    </div>
  );
  
  const renderClassesSkeleton = () => (
    <div className="p-6 space-y-6">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <div className={`${pulseClass} h-8 w-48 mb-2`}></div>
        <div className={`${pulseClass} h-4 w-64`}></div>
      </div>
      
      {/* Tabs section */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={`tab-${i}`} className={`${pulseClass} h-10 w-28`}></div>
        ))}
      </div>
      
      {/* Filter section */}
      <div className="flex flex-wrap gap-4 justify-between mb-6">
        <div className={`${pulseClass} h-10 w-56`}></div>
        <div className="flex gap-3">
          <div className={`${pulseClass} h-10 w-32`}></div>
          <div className={`${pulseClass} h-10 w-32`}></div>
        </div>
      </div>
      
      {/* Class cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(count)].map((_, i) => (
          <div key={`class-${i}`} className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
            <div className={`${pulseClass} h-48 w-full`}></div>
            <div className="p-4 space-y-3">
              <div className={`${pulseClass} h-6 w-4/5`}></div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`${pulseClass} h-4 w-4 rounded-full`}></div>
                  <div className={`${pulseClass} h-4 w-3/4`}></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`${pulseClass} h-4 w-4 rounded-full`}></div>
                  <div className={`${pulseClass} h-4 w-2/4`}></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`${pulseClass} h-4 w-4 rounded-full`}></div>
                  <div className={`${pulseClass} h-4 w-3/5`}></div>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <div className={`${pulseClass} h-8 w-full rounded-md`}></div>
                <div className={`${pulseClass} h-8 w-full rounded-md`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  const renderDefaultSkeleton = () => (
    <div className="p-6 space-y-6">
      <div className={`${pulseClass} h-8 w-64 mb-6`}></div>
      
      <div className="space-y-4">
        {[...Array(count)].map((_, i) => (
          <div key={`row-${i}`} className={`${pulseClass} h-16 w-full rounded-lg`}></div>
        ))}
      </div>
    </div>
  );
  
  const renderSkeleton = () => {
    switch (type) {
      case 'dashboard':
        return renderDashboardSkeleton();
      case 'courses':
        return renderCoursesSkeleton();
      case 'membership':
        return renderMembershipSkeleton();
      case 'form':
        return renderFormSkeleton();
      case 'certificates':
        return renderCertificatesSkeleton();
      case 'payments':
        return renderPaymentsSkeleton();
      case 'quiz':
        return renderQuizSkeleton();
      case 'classes':
        return renderClassesSkeleton();
      default:
        return renderDefaultSkeleton();
    }
  };
  
  return (
    <div className={`min-h-[60vh] ${className}`} role="status" aria-label={`Loading ${type}`}>
      {renderSkeleton()}
      <span className="sr-only">Loading {type}...</span>
    </div>
  );
};

export default SkeletonLoader; 