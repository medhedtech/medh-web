import React, { InputHTMLAttributes, ReactNode } from 'react';

interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Unique identifier for the input
   */
  id: string;
  
  /**
   * Input label text
   */
  label?: string;
  
  /**
   * Helper text displayed below the input
   */
  helperText?: string;
  
  /**
   * Error message displayed when validation fails
   */
  error?: string;
  
  /**
   * Icon displayed at the start of the input
   */
  leftIcon?: ReactNode;
  
  /**
   * Icon displayed at the end of the input
   */
  rightIcon?: ReactNode;
  
  /**
   * Input size
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Whether the input should take the full width of its container
   */
  fullWidth?: boolean;
  
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;
  
  /**
   * Whether the input is required
   */
  required?: boolean;
  
  /**
   * Whether the input is readonly
   */
  readOnly?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  size = 'md',
  fullWidth = false,
  disabled = false,
  required = false,
  readOnly = false,
  className = '',
  type = 'text',
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'py-1.5 text-sm',
    md: 'py-2 text-base',
    lg: 'py-2.5 text-lg'
  };
  
  // Padding classes based on icons
  const paddingClasses = {
    left: leftIcon ? 'pl-10' : 'pl-4',
    right: rightIcon ? 'pr-10' : 'pr-4'
  };
  
  // Container classes
  const containerClasses = [
    'relative',
    fullWidth ? 'w-full' : ''
  ].filter(Boolean).join(' ');
  
  // Input classes
  const inputClasses = [
    'block border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
    sizeClasses[size],
    paddingClasses.left,
    paddingClasses.right,
    fullWidth ? 'w-full' : '',
    disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white',
    readOnly ? 'bg-gray-50' : '',
    error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={containerClasses}>
      {label && (
        <label 
          htmlFor={id} 
          className={`block text-sm font-medium mb-1 ${
            error ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{leftIcon}</span>
          </div>
        )}
        
        <input
          id={id}
          type={type}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-description` : undefined}
          className={inputClasses}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{rightIcon}</span>
          </div>
        )}
      </div>
      
      {(helperText || error) && (
        <p 
          id={error ? `${id}-error` : `${id}-description`}
          className={`mt-1 text-sm ${
            error ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default InputField; 