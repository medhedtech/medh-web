import React, { useState, useEffect } from 'react';
import { Phone, ChevronDown } from 'lucide-react';
import Joi from 'joi';
import PhoneInput from 'react-phone-number-input';
import { parsePhoneNumber, isValidPhoneNumber, getCountries, getCountryCallingCode } from 'libphonenumber-js';
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
  onChange: (value: { country: string; number: string; isValid: boolean; formattedNumber: string }) => void;
  error?: string;
  placeholder?: string;
  className?: string;
  defaultCountry?: string;
  preferredCountries?: string[];
}

// Enhanced phone number validation
export const phoneNumberSchema = Joi.object({
  country: Joi.string().required().messages({
    'string.empty': 'Country code is required',
  }),
  number: Joi.string().min(6).max(20).required().messages({
    'string.empty': 'Phone number is required',
    'string.min': 'Phone number is too short',
    'string.max': 'Phone number is too long',
  }),
});

// Popular countries for quick access
const PREFERRED_COUNTRIES = ['IN', 'US', 'GB', 'AU', 'CA', 'AE', 'SG'];

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({ 
  value, 
  onChange, 
  error, 
  placeholder = "Enter your phone number", 
  className,
  defaultCountry = 'IN',
  preferredCountries = PREFERRED_COUNTRIES
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);

  // Initialize phone number properly
  useEffect(() => {
    if (value.number) {
      // Try to format the existing number
      try {
        const fullNumber = value.number.startsWith('+') 
          ? value.number 
          : `+${getCountryCallingCode(value.country as any)}${value.number}`;
        setPhoneNumber(fullNumber);
      } catch (error) {
        setPhoneNumber(value.number);
      }
    } else {
      setPhoneNumber('');
    }
  }, [value.number, value.country]);

  const handlePhoneChange = (newPhoneNumber: string | undefined) => {
    const phoneStr = newPhoneNumber || '';
    setPhoneNumber(phoneStr);
    
    let countryCode = defaultCountry;
    let nationalNumber = '';
    let isPhoneValid = false;
    let formattedNumber = phoneStr;

    if (phoneStr) {
      try {
        // Validate using libphonenumber-js
        isPhoneValid = isValidPhoneNumber(phoneStr);
        
        if (isPhoneValid) {
          const parsed = parsePhoneNumber(phoneStr);
          if (parsed) {
            countryCode = parsed.country || defaultCountry;
            nationalNumber = parsed.nationalNumber;
            formattedNumber = parsed.formatInternational();
          }
        } else {
          // Extract country and number for invalid numbers too
          const parsed = parsePhoneNumber(phoneStr);
          if (parsed) {
            countryCode = parsed.country || defaultCountry;
            nationalNumber = parsed.nationalNumber;
          }
        }
      } catch (err) {
        // Fallback for unparseable numbers
        console.warn('Phone number parsing failed:', err);
      }
    }

    setIsValid(isPhoneValid);
    
    onChange({ 
      country: countryCode, 
      number: nationalNumber || phoneStr.replace(/^\+\d+\s?/, ''), // Remove country code
      isValid: isPhoneValid,
      formattedNumber
    });
  };

  return (
    <div className={`relative ${className || ''}`}>
      {/* Enhanced Phone Input with Modern Styling */}
      <div className={`
        relative block w-full border-2 rounded-xl shadow-sm transition-all duration-200
        ${error
          ? 'border-red-300 focus-within:ring-red-500 focus-within:border-red-500 bg-red-50 dark:bg-red-900/10'
          : isValid && phoneNumber
          ? 'border-green-300 focus-within:ring-green-500 focus-within:border-green-500 bg-green-50 dark:bg-green-900/10'
          : 'border-gray-300 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600'
        }
        focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-0
        dark:text-white
      `}>
        
        {/* Phone Icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
          <Phone className={`h-5 w-5 ${
            error 
              ? 'text-red-400' 
              : isValid && phoneNumber 
              ? 'text-green-500' 
              : 'text-gray-400'
          }`} />
        </div>

        {/* React Phone Input */}
        <PhoneInput
          international
          countryCallingCodeEditable={false}
          defaultCountry={defaultCountry as any}
          preferredCountries={preferredCountries as any}
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          className="enhanced-phone-input"
          numberInputProps={{
            className: `
              w-full pl-14 pr-4 py-4 bg-transparent border-0 focus:outline-none focus:ring-0
              text-base font-medium placeholder-gray-400 dark:placeholder-gray-400 dark:text-white
            `
          }}
          countrySelectProps={{
            unicodeFlags: true,
            className: `
              !border-0 !bg-transparent focus:!outline-none focus:!ring-0 
              text-base font-medium cursor-pointer
            `
          }}
        />
        
        {/* Country Dropdown Arrow */}
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Validation Status & Error Messages */}
      <div className="mt-2 space-y-1">
        {/* Success Message */}
        {isValid && phoneNumber && !error && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Valid phone number</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Invalid Number Warning (only if user has typed something) */}
        {phoneNumber && !isValid && !error && (
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm font-medium">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>Please enter a valid phone number</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneNumberInput;
