import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, X, Check, Phone } from 'lucide-react';
import Joi from 'joi';
import * as countryCodesList from 'country-codes-list';

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
}

// Use country-codes-list to generate countryOptions with proper typing
const rawCountryList = countryCodesList.customList('countryCode', '{countryNameEn}|{countryCode}|{countryCallingCode}');

// Priority countries (most commonly used)
const priorityCountries = ['in', 'us', 'gb', 'ca', 'au', 'de', 'fr', 'jp', 'sg', 'ae'];

const countryOptions: CountryOption[] = Object.entries(rawCountryList).map(([code, data]) => {
  const [name, iso2, dialCode] = (data as string).split('|');
  const priority = priorityCountries.indexOf(iso2.toLowerCase()) + 1;
  
  return {
    name,
    iso2: iso2.toLowerCase(),
    dialCode: dialCode.replace('+', ''),
    flag: getFlagEmoji(iso2.toLowerCase()),
    priority: priority > 0 ? 10 - priority : 0, // Higher priority = lower index
  };
});

// Function to get flag emoji from country code
function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

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

// Phone number Joi schema
export const phoneNumberSchema = Joi.object({
  country: Joi.string().required().messages({
    'string.empty': 'Country code is required',
  }),
  number: Joi.string().pattern(/^(\+?[0-9\s\-\(\)]{6,20})$/).required().messages({
    'string.empty': 'Phone number is required',
    'string.pattern.base': 'Phone number must be a valid number',
  }),
});

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({ 
  value, 
  onChange, 
  error, 
  placeholder = "Enter your phone number", 
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedCountry = sortedCountries.find(c => c.iso2 === (value.country || '').toLowerCase()) || 
                         sortedCountries.find(c => c.iso2 === 'in') || 
                         sortedCountries[0];

  // Filter countries based on search term
  const filteredCountries = sortedCountries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.dialCode.includes(searchTerm) ||
    country.iso2.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Priority countries for display at top
  const priorityCountriesFiltered = filteredCountries.filter(c => c.priority > 0);
  const otherCountriesFiltered = filteredCountries.filter(c => c.priority === 0);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = (country: CountryOption) => {
    onChange({ 
      country: country.iso2, 
      number: value.number 
    });
    setIsOpen(false);
    setSearchTerm('');
    
    // Focus back to phone input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handlePhoneChange = (inputValue: string) => {
    // Allow only numbers, spaces, hyphens, parentheses, and plus sign
    const sanitizedValue = inputValue.replace(/[^0-9\s\-\(\)\+]/g, '');
    onChange({ 
      country: selectedCountry.iso2, 
      number: sanitizedValue 
    });
  };

  return (
    <div className={`relative ${className || ''}`} ref={dropdownRef}>
      <div className={`flex items-stretch border rounded-lg sm:rounded-xl overflow-hidden focus-within:ring-1 transition-all duration-200 ${
        error
          ? 'border-red-500 ring-red-500/30 bg-red-50/30 dark:bg-red-900/10'
          : 'border-gray-200 dark:border-gray-600 focus-within:border-primary-500 focus-within:ring-primary-500/20 bg-gray-50/50 dark:bg-gray-700/30'
      }`}>
        {/* Country selector button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center h-10 px-3 bg-gray-100/80 dark:bg-gray-700/50 border-r border-gray-200 dark:border-gray-600 hover:bg-gray-200/80 dark:hover:bg-gray-600/50 transition-colors duration-200 focus:outline-none focus:bg-gray-200/80 dark:focus:bg-gray-600/50 min-w-[80px]"
        >
          <span className="text-lg mr-1.5 leading-none">{selectedCountry.flag}</span>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mr-1">+{selectedCountry.dialCode}</span>
          <ChevronDown className={`h-3 w-3 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Phone number input */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="tel"
            value={value.number}
            onChange={e => handlePhoneChange(e.target.value)}
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
                handlePhoneChange(sanitized);
              }
            }}
            placeholder={placeholder}
            className="w-full h-10 px-3 py-0 bg-transparent outline-none text-sm placeholder-gray-400 dark:placeholder-gray-500"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Phone className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl shadow-lg z-50 max-h-80 overflow-hidden">
          {/* Search input */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full h-9 pl-10 pr-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Countries list */}
          <div className="max-h-60 overflow-y-auto">
            {filteredCountries.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No countries found
              </div>
            ) : (
              <>
                {/* Priority countries */}
                {priorityCountriesFiltered.length > 0 && (
                  <>
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-200 dark:border-gray-700">
                      Popular
                    </div>
                    {priorityCountriesFiltered.map((country) => (
                      <CountryOption
                        key={`priority-${country.iso2}`}
                        country={country}
                        selected={selectedCountry.iso2 === country.iso2}
                        onClick={() => handleCountrySelect(country)}
                      />
                    ))}
                    {otherCountriesFiltered.length > 0 && (
                      <div className="border-t border-gray-200 dark:border-gray-700">
                        <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30">
                          All Countries
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Other countries */}
                {otherCountriesFiltered.map((country) => (
                  <CountryOption
                    key={country.iso2}
                    country={country}
                    selected={selectedCountry.iso2 === country.iso2}
                    onClick={() => handleCountrySelect(country)}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mt-0.5 mr-1.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
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
    className={`flex items-center w-full px-3 py-2.5 text-sm transition-colors duration-150 ${
      selected 
        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
        : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-900 dark:text-gray-100'
    }`}
  >
    <span className="text-lg mr-3 leading-none">{country.flag}</span>
    <span className="flex-1 font-medium truncate text-left">{country.name}</span>
    <span className="text-xs text-gray-500 dark:text-gray-400 font-mono ml-2">+{country.dialCode}</span>
    {selected && <Check className="ml-2 h-4 w-4 text-primary-500 flex-shrink-0" />}
  </button>
);

export default PhoneNumberInput;
