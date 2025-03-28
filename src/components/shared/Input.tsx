import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
        </label>
        <input
          ref={ref}
          className={`w-full p-3 border rounded-lg transition-colors
            ${error 
              ? 'border-red-500 dark:border-red-400' 
              : 'border-gray-300 dark:border-gray-600'
            }
            ${props.disabled 
              ? 'bg-gray-100 dark:bg-gray-700/50 cursor-not-allowed' 
              : 'bg-white dark:bg-gray-800'
            }
            focus:outline-none focus:ring-2 
            focus:ring-primary-500/20 dark:focus:ring-primary-400/20 
            focus:border-primary-500 dark:focus:border-primary-400
            text-gray-900 dark:text-gray-100
            placeholder:text-gray-400 dark:placeholder:text-gray-500
          `}
          {...props}
        />
        {error && <p className="text-red-500 dark:text-red-400 text-xs">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 