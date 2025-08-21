import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  InformationCircleIcon,
  ChevronRightIcon,
  UserCircleIcon,
  DocumentTextIcon,
  LinkIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

interface ProfileCompletionData {
  overall_completion: {
    percentage: number;
    level: string;
    message: string;
    color: string;
  };
  category_completion: {
    basic_info: {
      completion_percentage: number;
      required_fields: {
        completed: number;
        total: number;
        completion_percentage: number;
      };
      fields: Array<{
        field_name: string;
        required: boolean;
        completed: boolean;
        display_name: string;
      }>;
    };
    personal_details: {
      completion_percentage: number;
      required_fields: {
        completed: number;
        total: number;
        completion_percentage: number;
      };
      fields: Array<{
        field_name: string;
        required: boolean;
        completed: boolean;
        display_name: string;
      }>;
    };
    social_links: {
      completion_percentage: number;
      optional_fields: {
        completed: number;
        total: number;
        completion_percentage: number;
      };
      fields: Array<{
        field_name: string;
        required: boolean;
        completed: boolean;
        display_name: string;
      }>;
    };
  };
  next_steps: Array<{
    field_name: string;
    category: string;
    display_name: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  completion_benefits: {
    current_level: string;
    next_level: string;
    benefits_unlocked: string[];
    next_benefits: string[];
  };
}

interface ProfileCompletionBarProps {
  userId?: string;
  onFieldClick?: (fieldName: string, category: string) => void;
  className?: string;
  showDetails?: boolean;
  compact?: boolean;
  refreshTrigger?: string | number;
}

const ProfileCompletionBar: React.FC<ProfileCompletionBarProps> = ({
  userId,
  onFieldClick,
  className = '',
  showDetails = true,
  compact = false,
  refreshTrigger
}) => {
  const [completionData, setCompletionData] = useState<ProfileCompletionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [previousPercentage, setPreviousPercentage] = useState<number>(0);
  const [showProgressUpdate, setShowProgressUpdate] = useState(false);

  useEffect(() => {
    fetchProfileCompletion();
  }, [userId, refreshTrigger]);

  const fetchProfileCompletion = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch('/api/v1/profile/me/completion', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Profile completion endpoint not found. Please restart the backend server.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        const newPercentage = result.data.overall_completion.percentage;
        
        // Check if progress increased
        if (completionData && newPercentage > completionData.overall_completion.percentage) {
          setPreviousPercentage(completionData.overall_completion.percentage);
          setShowProgressUpdate(true);
          
          // Hide the update notification after 3 seconds
          setTimeout(() => {
            setShowProgressUpdate(false);
          }, 3000);
        }
        
        setCompletionData(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch profile completion data');
      }
    } catch (err) {
      console.error('Error fetching profile completion:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldClick = (fieldName: string, category: string) => {
    if (onFieldClick) {
      onFieldClick(fieldName, category);
    } else {
      // Default behavior - scroll to profile edit section or open modal
      console.log(`Edit field: ${fieldName} in category: ${category}`);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'basic_info': return <UserCircleIcon className="w-5 h-5" />;
      case 'personal_details': return <DocumentTextIcon className="w-5 h-5" />;
      case 'social_links': return <LinkIcon className="w-5 h-5" />;
      default: return <InformationCircleIcon className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-start space-x-3">
          <ExclamationCircleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-yellow-800 mb-1">
              Profile Completion Unavailable
            </h3>
            <p className="text-xs text-yellow-700 mb-3">
              {error.includes('404') ? 
                'Backend endpoint not ready. Please restart the server.' : 
                error
              }
            </p>
            
            {/* Fallback progress display */}
            <div className="bg-white rounded-lg p-3 border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Estimated Progress
                </span>
                <span className="text-sm font-bold text-blue-600">27%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: '27%' }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Complete your profile to unlock more features!
              </p>
            </div>
            
            <button 
              onClick={fetchProfileCompletion}
              className="mt-2 text-yellow-600 hover:text-yellow-800 text-sm underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!completionData) {
    return null;
  }

  const { overall_completion, category_completion, next_steps, completion_benefits } = completionData;

  if (compact) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-3 ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Profile Completion</span>
          <span className="text-sm font-semibold" style={{ color: overall_completion.color }}>
            {overall_completion.percentage}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <motion.div
            className="h-2 rounded-full transition-all duration-500 ease-out"
            style={{ 
              backgroundColor: overall_completion.color,
              width: `${overall_completion.percentage}%`
            }}
            initial={{ width: 0 }}
            animate={{ width: `${overall_completion.percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        
        <p className="text-xs text-gray-600">{overall_completion.message}</p>
        
        {next_steps.length > 0 && (
          <button 
            onClick={() => setShowDetailedView(true)}
            className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center"
          >
            View suggestions <ChevronRightIcon className="w-3 h-3 ml-1" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <StarIcon className="w-5 h-5 mr-2 text-yellow-500" />
            Profile Completion
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold" style={{ color: overall_completion.color }}>
              {overall_completion.percentage}%
            </span>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              overall_completion.level === 'excellent' ? 'bg-green-100 text-green-800' :
              overall_completion.level === 'good' ? 'bg-blue-100 text-blue-800' :
              overall_completion.level === 'fair' ? 'bg-yellow-100 text-yellow-800' :
              overall_completion.level === 'basic' ? 'bg-orange-100 text-orange-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {overall_completion.level.replace('_', ' ').toUpperCase()}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
          <motion.div
            className="h-3 rounded-full transition-all duration-1000 ease-out"
            style={{ 
              backgroundColor: overall_completion.color,
              width: `${overall_completion.percentage}%`
            }}
            initial={{ width: 0 }}
            animate={{ width: `${overall_completion.percentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>

        {/* Progress Update Notification */}
        {showProgressUpdate && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3"
          >
            <div className="flex items-center space-x-2">
              <CheckCircleIconSolid className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  🎉 Progress Updated!
                </p>
                <p className="text-xs text-green-600">
                  {previousPercentage}% → {overall_completion.percentage}% (+{overall_completion.percentage - previousPercentage}%)
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <p className="text-sm text-gray-600 mb-3">{overall_completion.message}</p>

        {/* Toggle Details Button */}
        {showDetails && (
          <button
            onClick={() => setShowDetailedView(!showDetailedView)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            {showDetailedView ? 'Hide Details' : 'View Details'}
            <ChevronRightIcon className={`w-4 h-4 ml-1 transition-transform ${showDetailedView ? 'rotate-90' : ''}`} />
          </button>
        )}
      </div>

      {/* Detailed View */}
      {showDetails && showDetailedView && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 space-y-4"
        >
          {/* Category Breakdown */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Category Breakdown</h4>
            <div className="space-y-3">
              {Object.entries(category_completion).map(([categoryKey, categoryData]) => (
                <div key={categoryKey} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {getCategoryIcon(categoryKey)}
                      <span className="ml-2 text-sm font-medium text-gray-700 capitalize">
                        {categoryKey.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {categoryData.completion_percentage}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${categoryData.completion_percentage}%` }}
                    />
                  </div>

                  <div className="text-xs text-gray-600">
                    {categoryData.required_fields && (
                      <span>
                        Required: {categoryData.required_fields.completed}/{categoryData.required_fields.total}
                      </span>
                    )}
                    {categoryData.optional_fields && (
                      <span>
                        Optional: {categoryData.optional_fields.completed}/{categoryData.optional_fields.total}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          {next_steps.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Recommended Next Steps</h4>
              <div className="space-y-2">
                {next_steps.slice(0, 5).map((step, index) => (
                  <motion.div
                    key={`${step.category}-${step.field_name}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-all ${getPriorityColor(step.priority)}`}
                    onClick={() => handleFieldClick(step.field_name, step.category)}
                  >
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${
                        step.priority === 'high' ? 'bg-red-500' :
                        step.priority === 'medium' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`} />
                      <div>
                        <p className="text-sm font-medium">{step.display_name}</p>
                        <p className="text-xs opacity-75 capitalize">{step.category.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <ChevronRightIcon className="w-4 h-4" />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Unlocked Benefits</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <h5 className="text-sm font-medium text-green-800 mb-2 flex items-center">
                  <CheckCircleIconSolid className="w-4 h-4 mr-1" />
                  Current Level Benefits
                </h5>
                <ul className="text-xs text-green-700 space-y-1">
                  {completion_benefits.benefits_unlocked.map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-1 h-1 bg-green-500 rounded-full mr-2" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {completion_benefits.next_benefits.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h5 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                    <StarIcon className="w-4 h-4 mr-1" />
                    Next Level Benefits
                  </h5>
                  <ul className="text-xs text-blue-700 space-y-1">
                    {completion_benefits.next_benefits.slice(0, 4).map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1 h-1 bg-blue-500 rounded-full mr-2" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfileCompletionBar;
