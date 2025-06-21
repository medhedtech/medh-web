import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Info, DollarSign, Users, Percent, CheckCircle2, AlertCircle } from 'lucide-react';
import { PriceDetails } from '@/types/api-responses';

interface CurrencyRate {
  symbol: string;
  name: string;
  rate: number;
  valueWrtUSD?: number;
}

interface PriceEditorProps {
  price: PriceDetails;
  index: number;
  onChange: (index: number, price: Partial<PriceDetails>) => void;
  onRemove?: (index: number) => void;
  currencyRates: Record<string, CurrencyRate>;
  disabled?: boolean;
  isNew?: boolean;
}

export const PriceEditor: React.FC<PriceEditorProps> = ({
  price,
  index,
  onChange,
  onRemove,
  currencyRates,
  disabled = false,
  isNew = false
}) => {
  const [isExpanded, setIsExpanded] = useState(isNew);

  // Currency options with enhanced display
  const currencyOptions = Object.entries(currencyRates).map(([code, currency]) => ({
    value: code,
    label: `${code} - ${currency.name}`,
    symbol: currency.symbol,
    rate: currency.rate
  }));

  // Handle currency change with rate conversion
  const handleCurrencyChange = (newCurrency: string) => {
    if (newCurrency === price.currency) return;
    
    const oldRate = currencyRates[price.currency]?.rate || 1;
    const newRate = currencyRates[newCurrency]?.rate || 1;
    
    // Convert existing prices to new currency
    const conversionFactor = oldRate / newRate;
    
    onChange(index, {
      currency: newCurrency,
      individual: Math.round(price.individual * conversionFactor),
      batch: Math.round(price.batch * conversionFactor)
    });
  };

  // Calculate savings
  const individualSavings = price.individual > 0 && price.batch > 0 
    ? ((price.individual - price.batch) / price.individual * 100).toFixed(1)
    : '0';

  const earlyBirdPrice = price.individual && price.early_bird_discount 
    ? price.individual * (1 - price.early_bird_discount / 100)
    : 0;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${price.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                {isNew ? 'New Pricing Option' : `Pricing Option ${index + 1}`}
              </h4>
              {price.currency && (
                <p className="text-sm text-gray-600">
                  {currencyRates[price.currency]?.name || price.currency}
                  {currencyRates[price.currency] && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      1 USD = {currencyRates[price.currency].rate.toFixed(2)} {price.currency}
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {price.individual > 0 && price.batch > 0 && parseFloat(individualSavings) > 0 && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                {individualSavings}% batch savings
              </span>
            )}
            {onRemove && (
              <Button
                onClick={() => onRemove(index)}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                disabled={disabled}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Currency Selection - Enhanced */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            <DollarSign className="inline h-4 w-4 mr-1" />
            Currency
          </label>
          <div className="relative">
            <select
              value={price.currency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 appearance-none cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors duration-200"
              disabled={disabled}
              aria-label="Select currency"
            >
              <option value="" disabled>Choose a currency</option>
              {currencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.symbol} {option.value} - {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          {price.currency && currencyRates[price.currency] && (
            <div className="flex items-center text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
              <Info className="h-4 w-4 mr-2" />
              <span>
                Exchange rate: 1 USD = {currencyRates[price.currency].rate.toFixed(2)} {price.currency}
              </span>
            </div>
          )}
        </div>

        {/* Pricing Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Individual Price */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              <Users className="inline h-4 w-4 mr-1" />
              Individual Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                {currencyRates[price.currency]?.symbol || price.currency}
              </span>
              <Input
                type="number"
                value={price.individual || ''}
                onChange={(e) => onChange(index, { individual: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                className="pl-8 h-12 text-lg font-medium border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                min="0"
                step="0.01"
                disabled={disabled}
                aria-label="Individual price"
              />
            </div>
          </div>

          {/* Batch Price */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              <Users className="inline h-4 w-4 mr-1" />
              Batch Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                {currencyRates[price.currency]?.symbol || price.currency}
              </span>
              <Input
                type="number"
                value={price.batch || ''}
                onChange={(e) => onChange(index, { batch: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                className="pl-8 h-12 text-lg font-medium border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                min="0"
                step="0.01"
                disabled={disabled}
                aria-label="Batch price"
              />
            </div>
          </div>
        </div>

        {/* Batch Size Configuration */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h5 className="text-sm font-semibold text-gray-700 flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Batch Size Configuration
          </h5>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Minimum Size</label>
              <Input
                type="number"
                value={price.min_batch_size || 2}
                onChange={(e) => onChange(index, { min_batch_size: parseInt(e.target.value) || 2 })}
                placeholder="Min"
                min="1"
                className="h-10"
                disabled={disabled}
                aria-label="Minimum batch size"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Maximum Size</label>
              <Input
                type="number"
                value={price.max_batch_size || 10}
                onChange={(e) => onChange(index, { max_batch_size: parseInt(e.target.value) || 10 })}
                placeholder="Max"
                min={price.min_batch_size || 2}
                className="h-10"
                disabled={disabled}
                aria-label="Maximum batch size"
              />
            </div>
          </div>
          <div className="text-xs text-gray-600 bg-white p-2 rounded border">
            <strong>Batch size range:</strong> {price.min_batch_size || 2} - {price.max_batch_size || 10} students
          </div>
        </div>

        {/* Discounts Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 space-y-4">
          <h5 className="text-sm font-semibold text-gray-700 flex items-center">
            <Percent className="h-4 w-4 mr-2" />
            Discount Configuration
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Early Bird Discount (%)</label>
              <Input
                type="number"
                value={price.early_bird_discount || 0}
                onChange={(e) => onChange(index, { early_bird_discount: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                min="0"
                max="100"
                step="0.1"
                className="h-10"
                disabled={disabled}
                aria-label="Early bird discount percentage"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Group Discount (%)</label>
              <Input
                type="number"
                value={price.group_discount || 0}
                onChange={(e) => onChange(index, { group_discount: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                min="0"
                max="100"
                step="0.1"
                className="h-10"
                disabled={disabled}
                aria-label="Group discount percentage"
              />
            </div>
          </div>
        </div>

        {/* Status Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h5 className="text-sm font-semibold text-gray-700">Pricing Status</h5>
            <p className="text-xs text-gray-600">Enable or disable this pricing option</p>
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name={`status-${index}`}
                value="true"
                checked={price.is_active === true}
                onChange={() => onChange(index, { is_active: true })}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                disabled={disabled}
              />
              <span className="ml-2 text-sm font-medium text-green-700 flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Active
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name={`status-${index}`}
                value="false"
                checked={price.is_active === false}
                onChange={() => onChange(index, { is_active: false })}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                disabled={disabled}
              />
              <span className="ml-2 text-sm font-medium text-red-700 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                Inactive
              </span>
            </label>
          </div>
        </div>

        {/* Price Summary - Enhanced */}
        {price.currency && (price.individual > 0 || price.batch > 0) && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
            <h5 className="text-sm font-semibold text-gray-800 mb-4 flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Pricing Summary
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg border">
                <div className="text-xs text-gray-600 mb-1">Individual Price</div>
                <div className="text-lg font-bold text-gray-900">
                  {currencyRates[price.currency]?.symbol}{price.individual?.toFixed(2)}
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <div className="text-xs text-gray-600 mb-1">Batch Price</div>
                <div className="text-lg font-bold text-gray-900">
                  {currencyRates[price.currency]?.symbol}{price.batch?.toFixed(2)}
                </div>
                {parseFloat(individualSavings) > 0 && (
                  <div className="text-xs text-green-600 font-medium">
                    {individualSavings}% savings vs individual
                  </div>
                )}
              </div>
              {earlyBirdPrice > 0 && (
                <div className="md:col-span-2 bg-green-100 p-3 rounded-lg border border-green-200">
                  <div className="text-xs text-green-700 mb-1">Early Bird Price</div>
                  <div className="text-lg font-bold text-green-800">
                    {currencyRates[price.currency]?.symbol}{earlyBirdPrice.toFixed(2)}
                  </div>
                  <div className="text-xs text-green-600">
                    {price.early_bird_discount}% discount applied
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceEditor; 