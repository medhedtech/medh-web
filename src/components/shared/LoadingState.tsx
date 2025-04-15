import React from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

interface LoadingStateProps {
  /**
   * Main loading message displayed to the user
   */
  message?: string;
  
  /**
   * Secondary description explaining the loading state
   */
  description?: string;
  
  /**
   * Optional custom className for styling adjustments
   */
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  description = 'Please wait while we load your content',
  className = ''
}) => {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 ${className}`} role="status" aria-live="polite">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto mb-6"
          aria-hidden="true"
        >
          <Loader className="w-full h-full text-primary-500 dark:text-primary-400" />
        </motion.div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {message}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
};

export default LoadingState; 