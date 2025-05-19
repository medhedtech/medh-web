import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';
import Joi from 'joi';

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

// Comprehensive country list with dial codes
const countryOptions: CountryOption[] = [
  { name: 'Afghanistan', iso2: 'af', dialCode: '93', flag: '🇦🇫' },
  { name: 'Albania', iso2: 'al', dialCode: '355', flag: '🇦🇱' },
  { name: 'Algeria', iso2: 'dz', dialCode: '213', flag: '🇩🇿' },
  { name: 'Andorra', iso2: 'ad', dialCode: '376', flag: '🇦🇩' },
  { name: 'Angola', iso2: 'ao', dialCode: '244', flag: '🇦🇴' },
  { name: 'Anguilla', iso2: 'ai', dialCode: '1264', flag: '🇦🇮' },
  { name: 'Antigua and Barbuda', iso2: 'ag', dialCode: '1268', flag: '🇦🇬' },
  { name: 'Argentina', iso2: 'ar', dialCode: '54', flag: '🇦🇷' },
  { name: 'Armenia', iso2: 'am', dialCode: '374', flag: '🇦🇲' },
  { name: 'Australia', iso2: 'au', dialCode: '61', flag: '🇦🇺', priority: 2 },
  { name: 'Austria', iso2: 'at', dialCode: '43', flag: '🇦🇹' },
  { name: 'Azerbaijan', iso2: 'az', dialCode: '994', flag: '🇦🇿' },
  { name: 'Bahamas', iso2: 'bs', dialCode: '1242', flag: '🇧🇸' },
  { name: 'Bahrain', iso2: 'bh', dialCode: '973', flag: '🇧🇭' },
  { name: 'Bangladesh', iso2: 'bd', dialCode: '880', flag: '🇧🇩' },
  { name: 'Barbados', iso2: 'bb', dialCode: '1246', flag: '🇧🇧' },
  { name: 'Belarus', iso2: 'by', dialCode: '375', flag: '🇧🇾' },
  { name: 'Belgium', iso2: 'be', dialCode: '32', flag: '🇧🇪' },
  { name: 'Belize', iso2: 'bz', dialCode: '501', flag: '🇧🇿' },
  { name: 'Benin', iso2: 'bj', dialCode: '229', flag: '🇧🇯' },
  { name: 'Bermuda', iso2: 'bm', dialCode: '1441', flag: '🇧🇲' },
  { name: 'Brazil', iso2: 'br', dialCode: '55', flag: '🇧🇷' },
  { name: 'Canada', iso2: 'ca', dialCode: '1', flag: '🇨🇦', priority: 2 },
  { name: 'China', iso2: 'cn', dialCode: '86', flag: '🇨🇳', priority: 3 },
  { name: 'France', iso2: 'fr', dialCode: '33', flag: '🇫🇷', priority: 3 },
  { name: 'Germany', iso2: 'de', dialCode: '49', flag: '🇩🇪', priority: 3 },
  { name: 'India', iso2: 'in', dialCode: '91', flag: '🇮🇳', priority: 1 },
  { name: 'Italy', iso2: 'it', dialCode: '39', flag: '🇮🇹' },
  { name: 'Japan', iso2: 'jp', dialCode: '81', flag: '🇯🇵', priority: 3 },
  { name: 'Malaysia', iso2: 'my', dialCode: '60', flag: '🇲🇾' },
  { name: 'Mexico', iso2: 'mx', dialCode: '52', flag: '🇲🇽' },
  { name: 'Netherlands', iso2: 'nl', dialCode: '31', flag: '🇳🇱' },
  { name: 'New Zealand', iso2: 'nz', dialCode: '64', flag: '🇳🇿' },
  { name: 'Nigeria', iso2: 'ng', dialCode: '234', flag: '🇳🇬' },
  { name: 'Pakistan', iso2: 'pk', dialCode: '92', flag: '🇵🇰', priority: 3 },
  { name: 'Russia', iso2: 'ru', dialCode: '7', flag: '🇷🇺' },
  { name: 'Saudi Arabia', iso2: 'sa', dialCode: '966', flag: '🇸🇦' },
  { name: 'Singapore', iso2: 'sg', dialCode: '65', flag: '🇸🇬', priority: 3 },
  { name: 'South Africa', iso2: 'za', dialCode: '27', flag: '🇿🇦' },
  { name: 'South Korea', iso2: 'kr', dialCode: '82', flag: '🇰🇷' },
  { name: 'Spain', iso2: 'es', dialCode: '34', flag: '🇪🇸' },
  { name: 'Sweden', iso2: 'se', dialCode: '46', flag: '🇸🇪' },
  { name: 'Switzerland', iso2: 'ch', dialCode: '41', flag: '🇨🇭' },
  { name: 'Turkey', iso2: 'tr', dialCode: '90', flag: '🇹🇷' },
  { name: 'United Arab Emirates', iso2: 'ae', dialCode: '971', flag: '🇦🇪', priority: 3 },
  { name: 'United Kingdom', iso2: 'gb', dialCode: '44', flag: '🇬🇧', priority: 2 },
  { name: 'United States', iso2: 'us', dialCode: '1', flag: '🇺🇸', priority: 2 },
  // Many more countries would be added in a real implementation
];

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

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({ value, onChange, error, placeholder, className }) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Make India the default country
  const indiaCountry = countryOptions.find(c => c.iso2 === 'in');
  const selectedCountry = countryOptions.find(c => c.iso2 === value.country) || indiaCountry || countryOptions[0];

  // Initialize with India as default if no country is specified
  useEffect(() => {
    if (!value.country && indiaCountry) {
      onChange({ country: 'in', number: value.number });
    }
  }, []);

  // Get preferred countries (those with priority)
  const preferredCountries = sortedCountries.filter(c => c.priority);
  // Get remaining countries sorted alphabetically
  const otherCountries = sortedCountries.filter(c => !c.priority);

  const filteredOptions = searchTerm
    ? sortedCountries.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.dialCode.includes(searchTerm) ||
        c.iso2.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [...preferredCountries, ...otherCountries];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  return (
    <div className={`relative ${className || ''}`}> 
      <div className={`flex items-stretch border rounded-lg sm:rounded-xl overflow-hidden focus-within:ring-1 ${
          error 
            ? 'border-red-500 ring-red-500/30 bg-red-50/30 dark:bg-red-900/10' 
            : 'border-gray-200 dark:border-gray-600 focus-within:border-primary-500 focus-within:ring-primary-500/20 bg-gray-50/50 dark:bg-gray-700/30'
        }`}>  
        <button
          type="button"
          onClick={() => setOpen(prev => !prev)}
          className="flex items-center h-10 px-3 bg-gray-100/80 dark:bg-gray-700/50 border-r border-gray-200 dark:border-gray-600"
        >
          <span className="text-lg">{selectedCountry.flag}</span>
          <span className="ml-1 text-sm font-medium">+{selectedCountry.dialCode}</span>
          <ChevronDown className="ml-1 h-3.5 w-3.5 text-gray-500" />
        </button>
        <input
          type="tel"
          value={value.number}
          onChange={e => onChange({ country: selectedCountry.iso2, number: e.target.value })}
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
      
      {open && (
        <div 
          ref={dropdownRef}
          className="absolute z-20 mt-1 w-80 max-h-64 overflow-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl shadow-lg scrollbar-thin"
          style={{ 
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(156, 163, 175, 0.5) transparent'
          }}
        >
          {/* Search bar */}
          <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search country or code..."
                className="w-full h-9 pl-9 pr-9 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>
          
          {/* Country list */}
          <div className="py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No countries match your search
              </div>
            ) : (
              <>
                {/* Preferred countries section */}
                {!searchTerm && preferredCountries.length > 0 && (
                  <div className="mb-1 pb-1 border-b border-gray-200 dark:border-gray-700">
                    {preferredCountries.map(c => (
                      <CountryOption
                        key={c.iso2}
                        country={c}
                        selected={c.iso2 === selectedCountry.iso2}
                        onClick={() => {
                          onChange({ country: c.iso2, number: value.number });
                          setOpen(false);
                          setSearchTerm('');
                        }}
                      />
                    ))}
                  </div>
                )}
                
                {/* All countries or search results */}
                {(searchTerm ? filteredOptions : otherCountries).map(c => (
                  <CountryOption
                    key={c.iso2}
                    country={c}
                    selected={c.iso2 === selectedCountry.iso2}
                    onClick={() => {
                      onChange({ country: c.iso2, number: value.number });
                      setOpen(false);
                      setSearchTerm('');
                    }}
                  />
                ))}
              </>
            )}
          </div>
        </div>
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