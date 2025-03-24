import React from 'react';
import { UseFormRegister, UseFormSetValue, FormState } from 'react-hook-form';
import { ICourseFormData } from '@/types/course.types';
import { PlusCircle, MinusCircle, DollarSign } from 'lucide-react';

interface CoursePricingProps {
  register: UseFormRegister<ICourseFormData>;
  setValue: UseFormSetValue<ICourseFormData>;
  formState: {
    errors: FormState<ICourseFormData>['errors'];
  };
  watch: any;
}

const currencyOptions = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' }
];

const CoursePricing: React.FC<CoursePricingProps> = ({
  register,
  setValue,
  formState: { errors },
  watch
}) => {
  const [prices, setPrices] = React.useState([{
    id: 1,
    currency: 'USD',
    individual: '',
    batch: '',
    min_batch_size: 2,
    max_batch_size: 10,
    early_bird_discount: 0,
    group_discount: 0,
    is_active: true
  }]);

  const getCurrencySymbol = (currencyCode: string) => {
    const currency = currencyOptions.find(c => c.code === currencyCode);
    return currency ? currency.symbol : '$';
  };

  const addNewCurrency = () => {
    setPrices([...prices, {
      id: prices.length + 1,
      currency: 'USD',
      individual: '',
      batch: '',
      min_batch_size: 2,
      max_batch_size: 10,
      early_bird_discount: 0,
      group_discount: 0,
      is_active: true
    }]);
  };

  const removeCurrency = (id: number) => {
    const updatedPrices = prices.filter(price => price.id !== id);
    setPrices(updatedPrices);
    updateFormPrices(updatedPrices);
  };

  const updatePrice = (id: number, field: string, value: string | number | boolean) => {
    const updatedPrices = prices.map(price => {
      if (price.id === id) {
        return { ...price, [field]: value };
      }
      return price;
    });
    setPrices(updatedPrices);
    updateFormPrices(updatedPrices);

    // Update course_fee with the first batch price
    if (field === 'batch' && id === 1) {
      setValue('course_fee', Number(value));
    }
  };

  const updateFormPrices = (updatedPrices: any[]) => {
    const formattedPrices = updatedPrices.map(({ id, ...price }) => ({
      ...price,
      individual: Number(price.individual),
      batch: Number(price.batch),
      min_batch_size: Number(price.min_batch_size),
      max_batch_size: Number(price.max_batch_size),
      early_bird_discount: Number(price.early_bird_discount),
      group_discount: Number(price.group_discount)
    }));
    setValue('prices', formattedPrices);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Course Pricing</h2>

      {prices.map((price) => (
        <div key={price.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            {/* Currency Selection */}
            <div className="flex justify-between items-center">
              <div className="w-full max-w-xs">
                <label className="block text-sm font-medium text-gray-700">Currency</label>
                <select
                  value={price.currency}
                  onChange={(e) => updatePrice(price.id, 'currency', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                >
                  {currencyOptions.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name}
                    </option>
                  ))}
                </select>
              </div>
              {prices.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCurrency(price.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <MinusCircle size={20} />
                </button>
              )}
            </div>

            {/* Individual and Batch Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Individual Price (Per Person)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">
                      {getCurrencySymbol(price.currency)}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={price.individual}
                    onChange={(e) => updatePrice(price.id, 'individual', e.target.value)}
                    className="block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Batch Price (Per Person)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">
                      {getCurrencySymbol(price.currency)}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={price.batch}
                    onChange={(e) => updatePrice(price.id, 'batch', e.target.value)}
                    className="block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Batch Size */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Batch Size</label>
                <div className="mt-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500">Minimum</label>
                    <input
                      type="number"
                      value={price.min_batch_size}
                      onChange={(e) => updatePrice(price.id, 'min_batch_size', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                      min="2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Maximum</label>
                    <input
                      type="number"
                      value={price.max_batch_size}
                      onChange={(e) => updatePrice(price.id, 'max_batch_size', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                      min={Number(price.min_batch_size)}
                    />
                  </div>
                </div>
              </div>

              {/* Discounts */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Discounts (%)</label>
                <div className="mt-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500">Early Bird</label>
                    <input
                      type="number"
                      value={price.early_bird_discount}
                      onChange={(e) => updatePrice(price.id, 'early_bird_discount', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Group</label>
                    <input
                      type="number"
                      value={price.group_discount}
                      onChange={(e) => updatePrice(price.id, 'group_discount', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="mt-4 bg-gray-50 rounded-md p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Individual Price:</p>
                  <p className="text-lg font-medium">
                    {getCurrencySymbol(price.currency)}{Number(price.individual).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Batch Price (per person):</p>
                  <p className="text-lg font-medium text-customGreen">
                    {getCurrencySymbol(price.currency)}{Number(price.batch).toFixed(2)}
                  </p>
                </div>
                {price.early_bird_discount > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Early Bird Price:</p>
                    <p className="text-lg font-medium text-blue-600">
                      {getCurrencySymbol(price.currency)}
                      {(Number(price.batch) * (1 - Number(price.early_bird_discount) / 100)).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addNewCurrency}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-customGreen bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customGreen"
      >
        <PlusCircle className="mr-2 h-5 w-5" />
        Add Another Currency
      </button>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <DollarSign className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              The batch price will be used as the default course fee. Early bird and group discounts
              will be automatically calculated based on the batch price.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePricing; 