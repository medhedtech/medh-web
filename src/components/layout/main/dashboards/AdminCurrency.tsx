"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  RefreshCw, 
  Save, 
  Plus, 
  Trash2, 
  DollarSign, 
  ArrowUpDown, 
  Check, 
  AlertCircle,
  Flag,
  Globe,
  Settings
} from 'lucide-react';

const AdminCurrency = () => {
  // Get currency data from context
  const { 
    currencies, 
    changeCurrency, 
    getAvailableCurrencies, 
    updateCurrencies, 
    setAutoDetectPreference, 
    autoDetect: contextAutoDetect 
  } = useCurrency();
  
  // Component states
  const [availableCurrencies, setAvailableCurrencies] = useState([]);
  const [currencyRates, setCurrencyRates] = useState({});
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [newCurrency, setNewCurrency] = useState({ code: '', name: '', symbol: '', rate: 1 });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [autoDetect, setAutoDetect] = useState(contextAutoDetect);
  
  // Load current currency data
  useEffect(() => {
    const loadCurrencyData = async () => {
      try {
        setLoading(true);
        const availableCurrencies = getAvailableCurrencies();
        
        // Create a rates object from the available currencies
        const rates = {};
        availableCurrencies.forEach(currency => {
          rates[currency.code] = currency.rate;
        });
        
        setAvailableCurrencies(availableCurrencies);
        setCurrencyRates(rates);
        
        // Get default currency from localStorage if available
        try {
          const adminSettings = localStorage.getItem('currencySettings');
          if (adminSettings) {
            const settings = JSON.parse(adminSettings);
            if (settings.defaultCurrency) {
              setDefaultCurrency(settings.defaultCurrency);
            }
            
            if (settings.autoDetect !== undefined) {
              setAutoDetect(settings.autoDetect);
            }
          }
        } catch (error) {
          console.error('Error loading admin settings:', error);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading currency data:', error);
        setNotification({ 
          show: true, 
          type: 'error', 
          message: 'Failed to load currency data. Please try again.' 
        });
        setLoading(false);
      }
    };
    
    loadCurrencyData();
  }, [getAvailableCurrencies, contextAutoDetect]);

  // Handle currency rate change
  const handleRateChange = (currencyCode, newRate) => {
    setCurrencyRates(prev => ({
      ...prev,
      [currencyCode]: parseFloat(newRate)
    }));
  };

  // Handle adding a new currency
  const handleAddCurrency = () => {
    if (newCurrency.code && newCurrency.name && newCurrency.symbol && newCurrency.rate) {
      // Validate currency code (3 uppercase letters)
      if (!/^[A-Z]{3}$/.test(newCurrency.code)) {
        setNotification({
          show: true,
          type: 'error',
          message: 'Currency code must be 3 uppercase letters (e.g., USD, EUR)'
        });
        return;
      }
      
      // Check if currency already exists
      if (availableCurrencies.some(c => c.code === newCurrency.code)) {
        setNotification({
          show: true,
          type: 'error',
          message: `Currency ${newCurrency.code} already exists`
        });
        return;
      }
      
      // Add the new currency
      const updatedCurrencies = [
        ...availableCurrencies,
        { 
          code: newCurrency.code, 
          name: newCurrency.name, 
          symbol: newCurrency.symbol, 
          rate: parseFloat(newCurrency.rate) 
        }
      ];
      
      setAvailableCurrencies(updatedCurrencies);
      setCurrencyRates(prev => ({
        ...prev,
        [newCurrency.code]: parseFloat(newCurrency.rate)
      }));
      
      // Reset the form
      setNewCurrency({ code: '', name: '', symbol: '', rate: 1 });
      
      setNotification({
        show: true,
        type: 'success',
        message: `Currency ${newCurrency.code} added successfully`
      });
    } else {
      setNotification({
        show: true,
        type: 'error',
        message: 'Please fill in all fields for the new currency'
      });
    }
  };

  // Handle removing a currency
  const handleRemoveCurrency = (currencyCode) => {
    // Don't allow removing the default currency (USD)
    if (currencyCode === 'USD') {
      setNotification({
        show: true,
        type: 'error',
        message: 'Cannot remove the base currency (USD)'
      });
      return;
    }
    
    // Filter out the currency
    const updatedCurrencies = availableCurrencies.filter(
      currency => currency.code !== currencyCode
    );
    
    setAvailableCurrencies(updatedCurrencies);
    
    // Also remove from rates
    const updatedRates = { ...currencyRates };
    delete updatedRates[currencyCode];
    setCurrencyRates(updatedRates);
    
    setNotification({
      show: true,
      type: 'success',
      message: `Currency ${currencyCode} removed successfully`
    });
  };

  // Handle setting default currency
  const handleSetDefaultCurrency = (currencyCode) => {
    setDefaultCurrency(currencyCode);
    setNotification({
      show: true,
      type: 'success',
      message: `${currencyCode} set as default currency`
    });
  };

  // Save all currency changes
  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      
      // Create currencies object for the context
      const currenciesObject = {};
      availableCurrencies.forEach(currency => {
        currenciesObject[currency.code] = {
          symbol: currency.symbol,
          name: currency.name,
          rate: currencyRates[currency.code]
        };
      });
      
      // Update context with new currencies
      updateCurrencies(currenciesObject);
      
      // Set auto-detect preference in context
      setAutoDetectPreference(autoDetect);
      
      // Save default currency to localStorage
      try {
        const adminSettings = localStorage.getItem('currencySettings');
        if (adminSettings) {
          const settings = JSON.parse(adminSettings);
          settings.defaultCurrency = defaultCurrency;
          localStorage.setItem('currencySettings', JSON.stringify(settings));
        } else {
          localStorage.setItem('currencySettings', JSON.stringify({
            currencies: currenciesObject,
            defaultCurrency,
            autoDetect
          }));
        }
      } catch (error) {
        console.error('Error saving default currency:', error);
      }
      
      setNotification({
        show: true,
        type: 'success',
        message: 'Currency settings saved successfully'
      });
      
      // Exit edit mode
      setEditMode(false);
      setLoading(false);
    } catch (error) {
      console.error('Error saving currency settings:', error);
      setNotification({
        show: true,
        type: 'error',
        message: 'Failed to save currency settings. Please try again.'
      });
      setLoading(false);
    }
  };

  // Function to fetch latest rates from an external API
  const fetchLatestRates = async () => {
    try {
      setLoading(true);
      setNotification({
        show: true,
        type: 'info',
        message: 'Fetching latest exchange rates...'
      });
      
      // This would be replaced with your actual API call
      // For example: const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
      
      // Simulating API response for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sample updated rates (in a real app, these would come from the API)
      const updatedRates = {
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
        INR: 83.20,
        AUD: 1.53,
        CAD: 1.37,
        SGD: 1.35,
        AED: 3.67
      };
      
      setCurrencyRates(updatedRates);
      
      setNotification({
        show: true,
        type: 'success',
        message: 'Exchange rates updated successfully'
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching latest rates:', error);
      setNotification({
        show: true,
        type: 'error',
        message: 'Failed to fetch latest exchange rates. Please try again.'
      });
      setLoading(false);
    }
  };

  // Function to toggle auto-detect
  const toggleAutoDetect = (value) => {
    setAutoDetect(value);
  };

  // Clear notification after 5 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Currency Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage currency settings for your platform
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={fetchLatestRates}
            disabled={loading}
            className="flex items-center px-4 py-2 text-sm font-medium rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/30 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Update Rates
          </button>
          
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center px-4 py-2 text-sm font-medium rounded-md bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-300 dark:hover:bg-primary-900/30 transition-colors"
            >
              <Settings className="w-4 h-4 mr-2" />
              Edit Settings
            </button>
          ) : (
            <button
              onClick={handleSaveChanges}
              disabled={loading}
              className="flex items-center px-4 py-2 text-sm font-medium rounded-md bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          )}
        </div>
      </div>
      
      {/* Notification */}
      {notification.show && (
        <div className={`mb-6 p-3 rounded-md ${
          notification.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' :
          notification.type === 'error' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300' :
          'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <Check className="w-5 h-5 mr-2" />
            ) : notification.type === 'error' ? (
              <AlertCircle className="w-5 h-5 mr-2" />
            ) : (
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
            )}
            {notification.message}
          </div>
        </div>
      )}
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center p-8">
          <RefreshCw className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      )}
      
      {!loading && (
        <>
          {/* Main settings */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h2 className="text-lg font-medium mb-3 flex items-center text-gray-800 dark:text-white">
              <Globe className="w-5 h-5 mr-2 text-primary-500" />
              General Settings
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Default Currency
                </label>
                <select
                  value={defaultCurrency}
                  onChange={(e) => handleSetDefaultCurrency(e.target.value)}
                  disabled={!editMode}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {availableCurrencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Auto-detect User's Currency
                </label>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => toggleAutoDetect(true)}
                    disabled={!editMode}
                    className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                      autoDetect 
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    Enabled
                  </button>
                  <button
                    onClick={() => toggleAutoDetect(false)}
                    disabled={!editMode}
                    className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                      !autoDetect 
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    Disabled
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Currency table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-primary-500" />
                Supported Currencies
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage exchange rates and supported currencies
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Symbol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Exchange Rate (to USD)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Default
                    </th>
                    {editMode && (
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {availableCurrencies.map((currency) => (
                    <tr key={currency.code}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {currency.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {currency.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {currency.symbol}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {editMode ? (
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={currencyRates[currency.code]}
                            onChange={(e) => handleRateChange(currency.code, e.target.value)}
                            className="w-24 p-1 border border-gray-300 dark:border-gray-700 rounded"
                          />
                        ) : (
                          currencyRates[currency.code]
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {defaultCurrency === currency.code ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            Default
                          </span>
                        ) : editMode ? (
                          <button
                            onClick={() => handleSetDefaultCurrency(currency.code)}
                            className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            Set as default
                          </button>
                        ) : null}
                      </td>
                      {editMode && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleRemoveCurrency(currency.code)}
                            disabled={currency.code === 'USD'}
                            className={`text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 ${
                              currency.code === 'USD' ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Add new currency form */}
          {editMode && (
            <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <h3 className="text-lg font-medium mb-4 flex items-center text-gray-800 dark:text-white">
                <Plus className="w-5 h-5 mr-2 text-primary-500" />
                Add New Currency
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Currency Code
                  </label>
                  <input
                    type="text"
                    placeholder="USD"
                    maxLength={3}
                    value={newCurrency.code}
                    onChange={(e) => setNewCurrency({...newCurrency, code: e.target.value.toUpperCase()})}
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    3-letter code (e.g., USD, EUR)
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Currency Name
                  </label>
                  <input
                    type="text"
                    placeholder="US Dollar"
                    value={newCurrency.name}
                    onChange={(e) => setNewCurrency({...newCurrency, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    placeholder="$"
                    value={newCurrency.symbol}
                    onChange={(e) => setNewCurrency({...newCurrency, symbol: e.target.value})}
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Exchange Rate (to USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="1.0"
                    value={newCurrency.rate}
                    onChange={(e) => setNewCurrency({...newCurrency, rate: e.target.value})}
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
                  />
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleAddCurrency}
                  className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Currency
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminCurrency; 