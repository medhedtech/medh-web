"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface CurrencySwitcherProps {
  variant?: 'compact' | 'full';
  className?: string;
}

const CurrencySwitcher: React.FC<CurrencySwitcherProps> = ({ 
  variant = 'compact',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { 
    currency, 
    currencies, 
    changeCurrency, 
    getAvailableCurrencies,
    getCurrentCurrency
  } = useCurrency();
  
  const availableCurrencies = getAvailableCurrencies();
  const currentCurrency = getCurrentCurrency();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const handleCurrencyChange = (currencyCode: string) => {
    changeCurrency(currencyCode);
    setIsOpen(false);
  };
  
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Currency Selector Button */}
      <button
        onClick={toggleDropdown}
        className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-colors
          ${variant === 'compact' 
            ? 'text-sm hover:bg-gray-100 dark:hover:bg-gray-800'
            : 'text-base border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2'
          }`}
      >
        <Globe className={`${variant === 'compact' ? 'w-4 h-4' : 'w-5 h-5'} text-gray-500`} />
        
        {variant === 'compact' ? (
          <span className="font-medium">{currency.code}</span>
        ) : (
          <span className="font-medium ml-1">{currency.symbol} {currency.code}</span>
        )}
        
        <ChevronDown className={`${variant === 'compact' ? 'w-3 h-3' : 'w-4 h-4'} text-gray-500`} />
      </button>
      
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-1 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 min-w-[150px]">
          <div className="max-h-60 overflow-auto">
            {availableCurrencies.map((currencyOption) => (
              <button
                key={currencyOption.code}
                onClick={() => handleCurrencyChange(currencyOption.code)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between
                  ${currencyOption.code === currency.code ? 'bg-primary-50 dark:bg-primary-900/20 font-medium' : ''}`}
              >
                <span className="flex items-center">
                  <span className="mr-2">{currencyOption.symbol}</span>
                  <span>{currencyOption.code}</span>
                </span>
                
                {variant === 'full' && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">{currencyOption.name}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySwitcher; 