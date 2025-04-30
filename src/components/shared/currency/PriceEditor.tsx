import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

// Define interfaces similar to the ones used in AdminCourseFee.tsx
interface PriceDetails {
  currency: string;
  individual: number;
  batch: number;
  batchSize: {
    min: number;
    max: number;
  };
  discounts: {
    earlyBird: string;
    group: string;
  };
}

interface PriceEditorProps {
  price: PriceDetails;
  index: number;
  onChange: (index: number, price: Partial<PriceDetails>) => void;
  onRemove: (index: number) => void;
  currencyOptions?: { value: string; label: string }[];
  disabled?: boolean;
}

export const PriceEditor: React.FC<PriceEditorProps> = ({
  price,
  index,
  onChange,
  onRemove,
  currencyOptions = [],
  disabled = false
}) => {
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={price.currency}
            onChange={(e) => onChange(index, { currency: e.target.value })}
            disabled={disabled}
          >
            {currencyOptions.map((option, i) => (
              <option key={`currency-${i}-${option.value}`} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Individual Price</label>
          <Input
            type="number"
            value={price.individual}
            onChange={(e) => onChange(index, { individual: parseFloat(e.target.value) || 0 })}
            placeholder="Individual price"
            disabled={disabled}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Batch Price</label>
          <Input
            type="number"
            value={price.batch}
            onChange={(e) => onChange(index, { batch: parseFloat(e.target.value) || 0 })}
            placeholder="Batch price"
            disabled={disabled}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Batch Size Range</label>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={price.batchSize.min}
              onChange={(e) => onChange(index, { 
                batchSize: { ...price.batchSize, min: parseInt(e.target.value) || 0 } 
              })}
              placeholder="Min"
              disabled={disabled}
              className="w-1/2"
            />
            <span>to</span>
            <Input
              type="number"
              value={price.batchSize.max}
              onChange={(e) => onChange(index, { 
                batchSize: { ...price.batchSize, max: parseInt(e.target.value) || 0 } 
              })}
              placeholder="Max"
              disabled={disabled}
              className="w-1/2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Early Bird Discount (%)</label>
          <Input
            type="number"
            value={price.discounts.earlyBird}
            onChange={(e) => onChange(index, { 
              discounts: { ...price.discounts, earlyBird: e.target.value } 
            })}
            placeholder="Early bird discount"
            disabled={disabled}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Group Discount (%)</label>
          <Input
            type="number"
            value={price.discounts.group}
            onChange={(e) => onChange(index, { 
              discounts: { ...price.discounts, group: e.target.value } 
            })}
            placeholder="Group discount"
            disabled={disabled}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          onClick={() => onRemove(index)}
          variant="destructive"
          size="sm"
          disabled={disabled}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Remove
        </Button>
      </div>
    </div>
  );
};

export default PriceEditor; 