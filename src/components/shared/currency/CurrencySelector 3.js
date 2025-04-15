"use client";
import React, { useState } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { ChevronDown } from 'lucide-react';

const CurrencySelector = ({ className = '', mini = false }) => {
  const { currency, changeCurrency, getAvailableCurrencies, getCurrentCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const currencies = getAvailableCurrencies();
  const currentCurrency = getCurrentCurrency();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCurrencyChange = (currencyCode) => {
    changeCurrency(currencyCode);
    setIsOpen(false);
  };

  // Mini version for navbar/header
  if (mini) {
    return (
      <div className={`relative ${className}`}>
        <button
          className="flex items-center space-x-1 text-sm font-medium hover:text-customGreen transition-colors p-2 rounded-md"
          onClick={toggleDropdown}
        >
          <span>{currentCurrency.symbol}</span>
          <span>{currentCurrency.code}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        
        {isOpen && (
          <div className="absolute right-0 mt-2 py-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
            {currencies.map((curr) => (
              <button
                key={curr.code}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  curr.code === currency ? 'bg-gray-100 dark:bg-gray-700 font-medium text-customGreen' : ''
                }`}
                onClick={() => handleCurrencyChange(curr.code)}
              >
                <span className="mr-2">{curr.symbol}</span>
                {curr.code}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Full version
  return (
    <div className={`relative ${className}`}>
      <div className="text-sm font-medium mb-2">Currency</div>
      <button
        className="flex items-center justify-between w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-customGreen"
        onClick={toggleDropdown}
      >
        <div className="flex items-center">
          <span className="mr-2">{currentCurrency.symbol}</span>
          <span>{currentCurrency.name}</span>
        </div>
        <ChevronDown className="w-4 h-4" />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {currencies.map((curr) => (
            <button
              key={curr.code}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                curr.code === currency ? 'bg-gray-100 dark:bg-gray-700 font-medium text-customGreen' : ''
              }`}
              onClick={() => handleCurrencyChange(curr.code)}
            >
              <div className="flex items-center">
                <span className="mr-2">{curr.symbol}</span>
                <span>{curr.name}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencySelector; 