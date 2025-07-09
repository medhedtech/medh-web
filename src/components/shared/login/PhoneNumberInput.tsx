import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';
import Joi from 'joi';
// @ts-ignore: No type declarations for country-codes-list
const countryCodesList = require('country-codes-list');

export interface CountryOption {
  name: string;
  iso2: string;
  dialCode: string;
  flag: string;
  priority?: number;
}

export interface PhoneNumberInputProps {
  value: {
    country: string;
    number: string;
  };
  onChange: (value: { country: string; number: string }) => void;
  error?: string;
  placeholder?: string;
  className?: string;
  fixedCountry?: string;
}

// Use country-codes-list to generate countryOptions
const rawCountryList = countryCodesList.customList('countryCode', '{countryNameEn}|{countryCode}|{countryCallingCode}|{flag}');
const countryOptions: CountryOption[] = (Object.values(rawCountryList) as string[]).map((entry) => {
  const [name, iso2, dialCode, flag] = entry.split('|');
  return {
    name,
    iso2: iso2.toLowerCase(),
    dialCode: dialCode.replace('+', ''),
    flag,
  };
});

// Sort countries by priority (highest first) and then by name
const sortedCountries = [...countryOptions].sort((a, b) => {
  // Sort by priority first (highest first)
  const priorityA = a.priority || 0;
  const priorityB = b.priority || 0;
  
  if (priorityB !== priorityA) {
    return priorityB - priorityA;
  }
  
  // Then sort by name
  return a.name.localeCompare(b.name);
});

// Phone number Joi schema (number part should be digits only)
export const phoneNumberSchema = Joi.object({
  country: Joi.string().required().messages({
    'string.empty': 'Country code is required',
  }),
  number: Joi.string().pattern(/^(\+[0-9]+|[0-9]{6,14})$/).required().messages({
    'string.empty': 'Phone number is required',
    'string.pattern.base': 'Phone number must be a valid number (with or without + prefix)',
  }),
});

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({ value, onChange, error, placeholder, className, fixedCountry }) => {
  // If fixedCountry is set, use it for the country code and flag
  const country = fixedCountry || value.country;
  const selectedCountry = countryOptions.find(c => c.iso2 === (country || '').toLowerCase()) || countryOptions.find(c => c.iso2 === 'in') || countryOptions[0];

  return (
    <div className={`relative ${className || ''}`}>
      <div className={`flex items-stretch border rounded-lg sm:rounded-xl overflow-hidden focus-within:ring-1 ${
        error
          ? 'border-red-500 ring-red-500/30 bg-red-50/30 dark:bg-red-900/10'
          : 'border-gray-200 dark:border-gray-600 focus-within:border-primary-500 focus-within:ring-primary-500/20 bg-gray-50/50 dark:bg-gray-700/30'
      }`}>
        {/* Static country code and flag if fixedCountry is set */}
        <span className="flex items-center h-10 px-3 bg-gray-100/80 dark:bg-gray-700/50 border-r border-gray-200 dark:border-gray-600 select-none">
          <span className="text-base font-semibold leading-none align-middle">{selectedCountry.iso2.toUpperCase()}</span>
          <span className="ml-1 text-base font-medium leading-none align-middle" style={{ position: 'relative', top: '1px' }}>+{selectedCountry.dialCode}</span>
        </span>
        <input
          type="tel"
          value={value.number}
          onChange={e => {
            // Allow only numbers, spaces, hyphens, parentheses, and plus sign
            const sanitizedValue = e.target.value.replace(/[^0-9\s\-\(\)\+]/g, '');
            onChange({ country: selectedCountry.iso2, number: sanitizedValue });
          }}
          onKeyDown={e => {
            // Prevent alphabetic characters from being typed
            const allowedKeys = [
              'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
              'Home', 'End', 'Tab', 'Enter', 'Escape'
            ];
            // Allow numbers (0-9)
            if (e.key >= '0' && e.key <= '9') return;
            // Allow special characters commonly used in phone numbers
            if (['+', '-', '(', ')', ' '].includes(e.key)) return;
            // Allow control keys
            if (allowedKeys.includes(e.key)) return;
            // Allow Ctrl/Cmd combinations (copy, paste, etc.)
            if (e.ctrlKey || e.metaKey) return;
            // Prevent all other keys (including alphabetic characters)
            e.preventDefault();
          }}
          onPaste={e => {
            // Handle paste event to filter out non-numeric characters
            e.preventDefault();
            const pasteData = e.clipboardData.getData('text');
            const sanitized = pasteData.replace(/[^0-9\s\-\(\)\+]/g, '');
            if (sanitized) {
              onChange({ country: selectedCountry.iso2, number: sanitized });
            }
          }}
          placeholder={placeholder || 'Phone number'}
          className="flex-1 h-10 px-3 py-0 bg-transparent outline-none text-sm placeholder-gray-400"
        />
      </div>
      
      {error && (
        <p className="mt-1 text-xs text-red-500 flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mt-0.5 mr-1.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      
      {/* Removed dropdown logic as fixedCountry is set */}
    </div>
  );
};

// Country option component
interface CountryOptionProps {
  country: CountryOption;
  selected: boolean;
  onClick: () => void;
}

const CountryOption: React.FC<CountryOptionProps> = ({ country, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center w-full px-3 py-2.5 text-sm ${
      selected 
        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
        : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-900 dark:text-gray-100'
    }`}
  >
    <span className="text-lg mr-2.5">{country.flag}</span>
    <span className="flex-1 font-medium truncate text-left">{country.name}</span>
    <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">+{country.dialCode}</span>
    {selected && <Check className="ml-2 h-4 w-4 text-primary-500" />}
  </button>
);

export default PhoneNumberInput;
