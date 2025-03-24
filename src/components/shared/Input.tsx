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
        <label className="block text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          ref={ref}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-customGreen transition-colors
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          `}
          {...props}
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 