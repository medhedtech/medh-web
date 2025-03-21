import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorDisplay = ({ error, onRetry }) => {
  return (
    <div className="text-center p-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center"
      >
        <AlertCircle className="w-8 h-8 text-red-500" />
      </motion.div>

      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {error.type === 'network' ? 'Network Error' : 'Something went wrong'}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {error.message || 'An unexpected error occurred'}
      </p>
      
      {error.details && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {error.details}
        </p>
      )}

      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-primaryColor/90 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </motion.button>
      )}
    </div>
  );
};

export default ErrorDisplay; 