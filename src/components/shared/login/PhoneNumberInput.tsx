import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import Joi from 'joi';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import '@/styles/phone-input.css';

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
  const [phoneNumber, setPhoneNumber] = useState<string>(value.number || '');
  const [selectedCountry, setSelectedCountry] = useState<string>(value.country || 'IN');

  // Update internal state when external value changes
  useEffect(() => {
    setPhoneNumber(value.number || '');
    setSelectedCountry(value.country || 'IN');
  }, [value.number, value.country]);

  const handlePhoneChange = (newPhoneNumber: string | undefined) => {
    const phoneStr = newPhoneNumber || '';
    setPhoneNumber(phoneStr);
    
    onChange({ 
      country: selectedCountry, 
      number: phoneStr 
    });
  };

  // Format phone number for react-phone-number-input (E.164 format)
  const formatPhoneNumberForInput = (phoneNumber: string): string => {
    if (!phoneNumber) return '';
    
    // Remove any trailing spaces
    const trimmed = phoneNumber.trim();
    
    // If it already starts with +, return as is
    if (trimmed.startsWith('+')) {
      return trimmed;
    }
    
    // If it's just a country code without +, add it
    if (trimmed && !trimmed.includes(' ')) {
      return `+${trimmed}`;
    }
    
    return trimmed;
  };

  return (
    <div className={`relative ${className || ''}`}>
      <div className={`
        block w-full pl-12 pr-4 py-4 border-2 rounded-xl shadow-sm placeholder-gray-400
        focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200
        text-base font-medium
        ${error
          ? 'border-red-300 focus:ring-red-500 bg-red-50 dark:bg-red-900/10'
          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600'
        }
        dark:text-white dark:placeholder-gray-400
      `}>
        <PhoneInput
          international
          country={selectedCountry as any}
          value={formatPhoneNumberForInput(phoneNumber)}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          className={`PhoneInput ${error ? 'PhoneInput--error' : ''}`}
          countrySelectProps={{ unicodeFlags: true }}
          // Disable country selection dropdown
          countrySelectComponent={() => null}
        />
      </div>
      
      {/* Phone icon */}
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Phone className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm font-medium mt-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default PhoneNumberInput;
