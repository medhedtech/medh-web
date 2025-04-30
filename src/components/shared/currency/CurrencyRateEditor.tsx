import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Plus } from 'lucide-react';

interface CurrencyRate {
  valueWrtUSD: number;
  symbol: string;
  name: string;
  rate: number;
}

interface CurrencyRates {
  [key: string]: CurrencyRate;
}

interface CurrencyRateEditorProps {
  rates: CurrencyRates;
  onSave: (rates: CurrencyRates) => void;
  isLoading?: boolean;
  onRefresh?: () => void;
  onBulkAddCurrencyPricing?: (currencyCode: string) => void;
}

export const CurrencyRateEditor: React.FC<CurrencyRateEditorProps> = ({
  rates,
  onSave,
  isLoading = false,
  onRefresh,
  onBulkAddCurrencyPricing
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Currency Exchange Rates</h2>
          <p className="text-sm text-gray-500">Update exchange rates for pricing calculations</p>
        </div>
        {onRefresh && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Rates
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(rates).map(([code, rate]) => (
            <div key={code} className="flex items-center space-x-2">
              <span className="w-20 font-medium">{code}</span>
              <span className="w-10 text-gray-500">{rate.symbol}</span>
              <Input
                className="w-32"
                type="number"
                step="0.001"
                value={rate.rate}
                onChange={(e) => {
                  const newRates = { ...rates };
                  newRates[code] = { ...rate, rate: parseFloat(e.target.value) || 0 };
                  onSave(newRates);
                }}
                disabled={isLoading}
              />
            </div>
          ))}
        </div>

        {onBulkAddCurrencyPricing && (
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Bulk Add Currency Pricing</h3>
            <div className="flex items-center space-x-2">
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                disabled={isLoading}
              >
                <option value="">Select currency</option>
                {Object.entries(rates).map(([code, rate]) => (
                  <option key={code} value={code}>{code} ({rate.symbol})</option>
                ))}
              </select>
              <Button 
                onClick={() => {
                  if (selectedCurrency) {
                    onBulkAddCurrencyPricing(selectedCurrency);
                  }
                }}
                disabled={!selectedCurrency || isLoading}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add to All
              </Button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              This will add the selected currency pricing to all courses based on USD conversion rates.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrencyRateEditor; 