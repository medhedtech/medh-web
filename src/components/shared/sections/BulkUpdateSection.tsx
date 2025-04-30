import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Interface for bulk update configuration
interface BulkUpdateConfig {
  type: '' | 'fixed' | 'increase_percent' | 'decrease_percent' | 'increase_amount' | 'decrease_amount';
  value: string;
  priceType: 'batch' | 'individual' | 'both';
  currency?: string;
}

interface BulkUpdateSectionProps {
  onUpdate: (config: BulkUpdateConfig) => void;
  isLoading?: boolean;
  currencies?: string[];
}

export const BulkUpdateSection: React.FC<BulkUpdateSectionProps> = ({
  onUpdate,
  isLoading = false,
  currencies = []
}) => {
  const [config, setConfig] = useState<BulkUpdateConfig>({
    type: '',
    value: '',
    priceType: 'both',
    currency: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (config.type && config.value) {
      onUpdate(config);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <h2 className="text-xl font-semibold">Bulk Update Pricing</h2>
        <p className="text-sm text-gray-500">Update pricing for multiple courses at once</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Update Type</label>
              <select
                name="type"
                value={config.type}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                disabled={isLoading}
              >
                <option value="">Select update type</option>
                <option value="fixed">Set fixed price</option>
                <option value="increase_percent">Increase by percentage</option>
                <option value="decrease_percent">Decrease by percentage</option>
                <option value="increase_amount">Increase by amount</option>
                <option value="decrease_amount">Decrease by amount</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
              <Input
                name="value"
                type="number"
                value={config.value}
                onChange={handleInputChange}
                placeholder={config.type.includes('percent') ? 'Percentage' : 'Amount'}
                step="0.01"
                min="0"
                disabled={isLoading || !config.type}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apply To</label>
              <select
                name="priceType"
                value={config.priceType}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                disabled={isLoading}
              >
                <option value="both">Both prices</option>
                <option value="individual">Individual price only</option>
                <option value="batch">Batch price only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency (Optional)</label>
              <select
                name="currency"
                value={config.currency}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                disabled={isLoading}
              >
                <option value="">All currencies</option>
                {currencies.map((currency, index) => (
                  <option key={`currency-${index}-${currency}`} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isLoading || !config.type || !config.value}
            >
              Apply Bulk Update
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BulkUpdateSection; 