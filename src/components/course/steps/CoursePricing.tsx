import React, { useState, useEffect } from 'react';
import { UseFormRegister, UseFormSetValue, FormState } from 'react-hook-form';
import { ICourseFormData } from '@/types/course.types';
import { 
  PlusCircle, 
  MinusCircle, 
  DollarSign, 
  Percent, 
  Globe, 
  Users, 
  Calendar,
  ArrowRight, 
  TrendingUp, 
  EyeOff,
  CheckCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CoursePricingProps {
  register: UseFormRegister<ICourseFormData>;
  setValue: UseFormSetValue<ICourseFormData>;
  formState: {
    errors: FormState<ICourseFormData>['errors'];
  };
  watch: any;
}

const currencyOptions = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flagEmoji: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', flagEmoji: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flagEmoji: '🇬🇧' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flagEmoji: '🇮🇳' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flagEmoji: '🇦🇺' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flagEmoji: '🇨🇦' }
];

const CoursePricing: React.FC<CoursePricingProps> = ({
  register,
  setValue,
  formState: { errors },
  watch
}) => {
  const [prices, setPrices] = useState([{
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
  
  const [activePriceCard, setActivePriceCard] = useState<number>(1);
  const [showDiscountTip, setShowDiscountTip] = useState<boolean>(false);
  const [savingIndicator, setSavingIndicator] = useState<boolean>(false);

  const getCurrencySymbol = (currencyCode: string) => {
    const currency = currencyOptions.find(c => c.code === currencyCode);
    return currency ? currency.symbol : '$';
  };
  
  const getCurrencyFlag = (currencyCode: string) => {
    const currency = currencyOptions.find(c => c.code === currencyCode);
    return currency ? currency.flagEmoji : '';
  };

  const addNewCurrency = () => {
    const newPriceCard = {
      id: prices.length + 1,
      currency: 'USD',
      individual: '',
      batch: '',
      min_batch_size: 2,
      max_batch_size: 10,
      early_bird_discount: 0,
      group_discount: 0,
      is_active: true
    };
    
    setPrices([...prices, newPriceCard]);
    setActivePriceCard(newPriceCard.id);
    
    // Indicate saving for feedback
    setSavingIndicator(true);
    setTimeout(() => setSavingIndicator(false), 500);
  };

  const removeCurrency = (id: number) => {
    const updatedPrices = prices.filter(price => price.id !== id);
    setPrices(updatedPrices);
    updateFormPrices(updatedPrices);
    
    // If removing active card, set active to first available
    if (activePriceCard === id && updatedPrices.length > 0) {
      setActivePriceCard(updatedPrices[0].id);
    }
    
    // Indicate saving for feedback
    setSavingIndicator(true);
    setTimeout(() => setSavingIndicator(false), 500);
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
    
    // Indicate saving for feedback
    setSavingIndicator(true);
    setTimeout(() => setSavingIndicator(false), 500);
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
  
  const calculateDiscountedPrice = (basePrice: number, discountPercent: number) => {
    return basePrice * (1 - discountPercent / 100);
  };

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-customGreen to-blue-500 bg-clip-text text-transparent">
          Course Pricing
        </h2>
        
        {savingIndicator && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm"
          >
            <CheckCircle className="w-4 h-4 mr-1" /> Changes saved
          </motion.div>
        )}
      </motion.div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {prices.map((price) => (
            <button
              key={`tab-${price.id}`}
              onClick={() => setActivePriceCard(price.id)}
              className={`flex items-center px-4 py-3 font-medium text-sm transition-all duration-200 ${
                activePriceCard === price.id 
                  ? 'text-customGreen border-b-2 border-customGreen bg-green-50/30' 
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{getCurrencyFlag(price.currency)}</span>
              {price.currency}
            </button>
          ))}
          <button
            onClick={addNewCurrency}
            className="flex items-center px-4 py-3 text-sm font-medium text-gray-500 hover:text-customGreen hover:bg-green-50/30 transition-all duration-200"
          >
            <PlusCircle className="w-4 h-4 mr-1" />
            Add Currency
          </button>
        </div>
        
        <div className="p-6">
          <AnimatePresence mode="wait">
            {prices.map((price) => (
              <motion.div
                key={`card-${price.id}`}
                initial={{ opacity: 0, x: 20 }}
                animate={activePriceCard === price.id ? { opacity: 1, x: 0 } : { opacity: 0, x: 20, height: 0, overflow: 'hidden' }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={activePriceCard === price.id ? 'block' : 'hidden'}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-customGreen to-teal-400 text-white text-lg font-semibold shadow-sm mr-3">
                      {getCurrencySymbol(price.currency)}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {getCurrencyFlag(price.currency)} {price.currency}
                      </h3>
                      <p className="text-sm text-gray-500">Set pricing in {currencyOptions.find(c => c.code === price.currency)?.name}</p>
                    </div>
                  </div>
                  
                  {prices.length > 1 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => removeCurrency(price.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <MinusCircle size={20} />
                    </motion.button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Individual Price</h4>
                        <p className="text-xs text-gray-500">Price per person for individual enrollment</p>
                      </div>
                    </div>
                    
                    <div className="relative rounded-xl overflow-hidden">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">
                          {getCurrencySymbol(price.currency)}
                        </span>
                      </div>
                      <input
                        type="number"
                        value={price.individual}
                        onChange={(e) => updatePrice(price.id, 'individual', e.target.value)}
                        className="block w-full pl-7 pr-12 py-3 rounded-xl border-gray-200 focus:border-customGreen focus:ring focus:ring-customGreen focus:ring-opacity-50 transition-all"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-sm font-medium">
                          {price.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-100 shadow-sm hover:shadow-md transition-shadow p-5">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-customGreen bg-opacity-20 flex items-center justify-center text-customGreen mr-3">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Batch Price</h4>
                        <p className="text-xs text-gray-500">Price per person for batch enrollment</p>
                      </div>
                    </div>
                    
                    <div className="relative rounded-xl overflow-hidden">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">
                          {getCurrencySymbol(price.currency)}
                        </span>
                      </div>
                      <input
                        type="number"
                        value={price.batch}
                        onChange={(e) => updatePrice(price.id, 'batch', e.target.value)}
                        className="block w-full pl-7 pr-12 py-3 rounded-xl border-gray-200 focus:border-customGreen focus:ring focus:ring-customGreen focus:ring-opacity-50 transition-all"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-sm font-medium">
                          {price.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Batch Size</h4>
                        <p className="text-xs text-gray-500">Minimum and maximum students per batch</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-700">Minimum</label>
                        <div className="relative rounded-xl overflow-hidden">
                          <input
                            type="number"
                            value={price.min_batch_size}
                            onChange={(e) => updatePrice(price.id, 'min_batch_size', e.target.value)}
                            className="block w-full pr-10 py-3 rounded-xl border-gray-200 focus:border-customGreen focus:ring focus:ring-customGreen focus:ring-opacity-50 transition-all"
                            min="2"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Users className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-700">Maximum</label>
                        <div className="relative rounded-xl overflow-hidden">
                          <input
                            type="number"
                            value={price.max_batch_size}
                            onChange={(e) => updatePrice(price.id, 'max_batch_size', e.target.value)}
                            className="block w-full pr-10 py-3 rounded-xl border-gray-200 focus:border-customGreen focus:ring focus:ring-customGreen focus:ring-opacity-50 transition-all"
                            min={Number(price.min_batch_size)}
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Users className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative bg-gradient-to-br from-orange-50 to-white rounded-2xl border border-orange-100 shadow-sm p-5">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                        <Percent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">Discounts</h4>
                        <p className="text-xs text-gray-500">Special pricing offers</p>
                      </div>
                      <button 
                        onClick={() => setShowDiscountTip(!showDiscountTip)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showDiscountTip ? <X className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                    </div>
                    
                    {showDiscountTip && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute right-5 top-16 w-64 p-3 bg-white rounded-lg shadow-lg border border-amber-100 text-xs text-gray-600 z-10"
                      >
                        <p><strong>Early Bird:</strong> Discount for early enrollments before course starts</p>
                        <p className="mt-1"><strong>Group:</strong> Discount for groups enrolling together</p>
                        <div className="absolute w-3 h-3 bg-white border-t border-l border-amber-100 transform rotate-45 -top-1.5 right-5"></div>
                      </motion.div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-700">Early Bird %</label>
                        <div className="relative rounded-xl overflow-hidden">
                          <input
                            type="number"
                            value={price.early_bird_discount}
                            onChange={(e) => updatePrice(price.id, 'early_bird_discount', e.target.value)}
                            className="block w-full pr-10 py-3 rounded-xl border-gray-200 focus:border-customGreen focus:ring focus:ring-customGreen focus:ring-opacity-50 transition-all"
                            min="0"
                            max="100"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Percent className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-700">Group %</label>
                        <div className="relative rounded-xl overflow-hidden">
                          <input
                            type="number"
                            value={price.group_discount}
                            onChange={(e) => updatePrice(price.id, 'group_discount', e.target.value)}
                            className="block w-full pr-10 py-3 rounded-xl border-gray-200 focus:border-customGreen focus:ring focus:ring-customGreen focus:ring-opacity-50 transition-all"
                            min="0"
                            max="100"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Percent className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {Number(price.batch) > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 bg-gradient-to-r from-customGreen/10 to-teal-100/30 backdrop-blur-sm rounded-2xl p-5 shadow-sm"
                  >
                    <h3 className="text-base font-medium text-gray-800 mb-3">Price Summary</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Individual Price:</span>
                          <span className="text-lg font-semibold text-gray-800">
                            {getCurrencySymbol(price.currency)}{Number(price.individual || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-customGreen">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Batch Price:</span>
                          <span className="text-lg font-semibold text-customGreen">
                            {getCurrencySymbol(price.currency)}{Number(price.batch || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      
                      {Number(price.early_bird_discount) > 0 && (
                        <div className="bg-white rounded-xl p-4 shadow-sm relative overflow-hidden">
                          <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs px-2 py-1 rotate-12 shadow-sm">
                            SAVE {price.early_bird_discount}%
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Early Bird:</span>
                            <div className="text-right">
                              <span className="text-xs line-through text-gray-400 block">
                                {getCurrencySymbol(price.currency)}{Number(price.batch || 0).toFixed(2)}
                              </span>
                              <span className="text-lg font-semibold text-amber-600">
                                {getCurrencySymbol(price.currency)}
                                {calculateDiscountedPrice(
                                  Number(price.batch || 0), 
                                  Number(price.early_bird_discount || 0)
                                ).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={addNewCurrency}
        className="mt-4 inline-flex items-center px-4 py-2 bg-white border border-customGreen text-customGreen font-medium rounded-full shadow-sm hover:bg-customGreen hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customGreen transition-colors duration-200"
      >
        <Globe className="mr-2 h-5 w-5" />
        Add Another Currency
      </motion.button>

      <div className="flex p-5 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl border border-blue-100 mt-8">
        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-400 text-white rounded-full shadow-md">
          <TrendingUp className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-800">Pricing Strategy Tips</h3>
          <div className="mt-1 text-sm text-gray-600 space-y-1">
            <p>• The batch price is used as the default course fee.</p>
            <p>• Early bird discounts encourage early enrollment - consider 10-15% off.</p>
            <p>• Group discounts work well for teams - typically 5-20% based on group size.</p>
            <p>• Individual pricing is usually higher than batch pricing (1.5x-2x).</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePricing; 