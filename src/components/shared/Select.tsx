import React, { forwardRef } from 'react';
import ReactSelect from 'react-select';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  options?: SelectOption[];
  error?: string;
  required?: boolean;
  isMulti?: boolean;
  onChange?: (option: any) => void;
  value?: SelectOption | SelectOption[];
  placeholder?: string;
  isDisabled?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  [key: string]: any;
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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
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
              borderColor: error 
                ? '#ef4444' 
                : state.isFocused 
                  ? 'var(--primary-500)' 
                  : 'var(--gray-300)',
              backgroundColor: 'var(--input-bg-light)',
              color: 'var(--input-text-light)',
              boxShadow: state.isFocused 
                ? '0 0 0 2px rgba(var(--primary-500), 0.2)' 
                : 'none',
              '&:hover': {
                borderColor: state.isFocused 
                  ? 'var(--primary-500)' 
                  : 'var(--gray-400)'
              },
              '@media (prefers-color-scheme: dark)': {
                backgroundColor: 'var(--input-bg-dark)',
                color: 'var(--input-text-dark)',
                borderColor: error 
                  ? '#f87171' 
                  : state.isFocused 
                    ? 'var(--primary-400)' 
                    : 'var(--gray-600)',
                '&:hover': {
                  borderColor: state.isFocused 
                    ? 'var(--primary-400)' 
                    : 'var(--gray-500)'
                }
              }
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected 
                ? 'var(--primary-500)' 
                : state.isFocused 
                  ? 'var(--gray-100)' 
                  : 'white',
              color: state.isSelected ? 'white' : 'var(--gray-900)',
              '&:active': {
                backgroundColor: 'var(--primary-600)'
              },
              '@media (prefers-color-scheme: dark)': {
                backgroundColor: state.isSelected 
                  ? 'var(--primary-600)' 
                  : state.isFocused 
                    ? 'var(--gray-700)' 
                    : 'var(--gray-800)',
                color: state.isSelected ? 'white' : 'var(--gray-100)',
                '&:active': {
                  backgroundColor: 'var(--primary-700)'
                }
              }
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: 'white',
              '@media (prefers-color-scheme: dark)': {
                backgroundColor: 'var(--gray-800)',
                borderColor: 'var(--gray-700)'
              }
            }),
            multiValue: (base) => ({
              ...base,
              backgroundColor: 'var(--primary-100)',
              '@media (prefers-color-scheme: dark)': {
                backgroundColor: 'var(--primary-900)'
              }
            }),
            multiValueLabel: (base) => ({
              ...base,
              color: 'var(--primary-800)',
              '@media (prefers-color-scheme: dark)': {
                color: 'var(--primary-300)'
              }
            }),
            multiValueRemove: (base) => ({
              ...base,
              color: 'var(--primary-500)',
              '&:hover': {
                backgroundColor: 'var(--primary-500)',
                color: 'white'
              },
              '@media (prefers-color-scheme: dark)': {
                color: 'var(--primary-400)',
                '&:hover': {
                  backgroundColor: 'var(--primary-700)',
                  color: 'white'
                }
              }
            })
          }}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: 'var(--primary-500)',
              primary75: 'var(--primary-400)',
              primary50: 'var(--primary-300)',
              primary25: 'var(--primary-100)',
              danger: '#ef4444',
              dangerLight: '#fee2e2',
              neutral0: 'var(--input-bg-light)',
              neutral5: 'var(--gray-100)',
              neutral10: 'var(--gray-200)',
              neutral20: 'var(--gray-300)',
              neutral30: 'var(--gray-400)',
              neutral40: 'var(--gray-500)',
              neutral50: 'var(--gray-500)',
              neutral60: 'var(--gray-600)',
              neutral70: 'var(--gray-700)',
              neutral80: 'var(--gray-800)',
              neutral90: 'var(--gray-900)',
            },
          })}
        />
        {error && <p className="text-red-500 dark:text-red-400 text-xs">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select; 