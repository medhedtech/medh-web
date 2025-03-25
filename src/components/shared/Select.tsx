import React, { forwardRef } from 'react';
import ReactSelect from 'react-select';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  options: Option[];
  error?: string;
  required?: boolean;
  isMulti?: boolean;
  value?: Option | Option[];
  onChange?: (value: any) => void;
  isDisabled?: boolean;
}

const Select = forwardRef<any, SelectProps>(
  ({ label, options = [], error, required, isMulti = false, ...props }, ref) => {
    // Ensure options are valid
    const validOptions = Array.isArray(options) 
      ? options.filter(
          opt => opt && typeof opt === 'object' && 'value' in opt && 'label' in opt
        ) 
      : [];
    
    // Provide a fallback option if no valid options exist
    const safeOptions = validOptions.length > 0 
      ? validOptions 
      : [{ value: '', label: 'No options available' }];

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <ReactSelect
          ref={ref}
          options={safeOptions}
          isMulti={isMulti}
          className={`react-select-container ${error ? 'react-select-error' : ''}`}
          classNamePrefix="react-select"
          {...props}
          styles={{
            control: (base, state) => ({
              ...base,
              borderColor: error ? '#ef4444' : state.isFocused ? '#10B981' : '#D1D5DB',
              boxShadow: state.isFocused ? '0 0 0 2px rgba(16, 185, 129, 0.2)' : 'none',
              '&:hover': {
                borderColor: state.isFocused ? '#10B981' : '#9CA3AF'
              }
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected ? '#10B981' : state.isFocused ? '#E5E7EB' : 'white',
              color: state.isSelected ? 'white' : 'black',
              '&:active': {
                backgroundColor: '#10B981'
              }
            })
          }}
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select; 