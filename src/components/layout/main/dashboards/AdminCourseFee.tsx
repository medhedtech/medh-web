import React, { useState, useEffect, useRef, useMemo, Fragment, ChangeEvent } from 'react';
import axios from 'axios';
import {
  ChevronDown, 
  ChevronUp, 
  Edit2, 
  Save, 
  X as XIcon, 
  Plus, 
  Trash2, 
  RefreshCcw,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Info,
  Loader,
  Check,
  Edit,
  DollarSign,
  LucideIcon
} from 'lucide-react';
import { 
  bulkUpdateCoursePrices,
  fetchCoursePrices,
  updateCoursePricing
} from '@/apis/course/course';
import { 
  PriceDetails, 
  BulkPriceUpdatePayload, 
  CoursePriceResponse,
  BulkPriceUpdateResponse, 
  ErrorResponse
} from '@/types/api-responses';
import { PriceEditor } from '@/components/shared/currency/PriceEditor';
import { 
  getAllCurrencies, 
  createCurrency, 
  updateCurrency, 
  getCurrencyByCountryCode 
} from '@/apis/currency/currency';
import { apiUrls, apiBaseUrl } from '@/apis/index';
// Import the UI components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CurrencyRateEditor } from '@/components/shared/currency/CurrencyRateEditor';
import { BulkUpdateSection } from '@/components/shared/sections/BulkUpdateSection';
import Toast from '@/components/shared/ui/Toast';
import ActionButton from '@/components/shared/buttons/ActionButton';

// First, update the PriceFilterParams interface to include currency
interface PriceFilterParams {
  status?: string;
  courseCategory?: string;
  search?: string;
  course_id?: string;
  course_grade?: string;
  course_type?: string;
  pricing_status?: string;
  has_pricing?: string;
  currency?: string;
}

// New API response interface
interface CoursePricingItem {
  currency: string;
  prices: {
    individual: string;
    batch: string;
  };
  discounts: {
    earlyBird: string;
    group: string;
  };
  batchSize: {
    min: number;
    max: number;
  };
  status: string;
}

interface CourseWithPricing {
  courseId: string;
  courseTitle: string;
  courseCategory?: string;
  pricing: CoursePricingItem[];
}

interface CoursePricingListResponse {
  success: boolean;
  count: number;
  data: CourseWithPricing[];
  message?: string;
}

interface CoursePrice {
  id: string;
  title: string;
  category?: string;
  selected: boolean;
  prices: PriceDetails[];
  isEditing: boolean;
  editedPrices?: PriceDetails[];
}

interface CourseFeeFilterProps {
  onFilterChange: (filters: PriceFilterParams) => void;
  categories: string[];
  currencies?: string[];
  classTypes?: string[];
  loading?: boolean;
}

interface BulkUpdateConfig {
  type: '' | 'fixed' | 'increase_percent' | 'decrease_percent' | 'increase_amount' | 'decrease_amount';
  value: string;
  priceType: 'batch' | 'individual' | 'both';
  currency?: string;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
  field: 'title' | 'category';
  direction: SortDirection;
}

interface ICurrency {
  _id: string;
  country: string;
  countryCode: string;
  valueWrtUSD: number;
  symbol: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ICreateCurrencyInput {
  country: string;
  countryCode: string;
  valueWrtUSD: number;
  symbol: string;
}

// Create a select option type for clarity
interface SelectOption {
  value: string;
  label: string;
}

interface CurrencyRate {
  valueWrtUSD: number;
  symbol: string;
  name: string;
  rate: number;
}

interface CurrencyRates {
  [key: string]: CurrencyRate;
}

// Add currency format helper function
const currencyFormat = (amount: number | string, currency: string): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return formatter.format(Number(amount));
};

const CourseFeeFilter: React.FC<CourseFeeFilterProps> = ({ 
  onFilterChange, 
  categories, 
  currencies = ["USD", "INR"],
  classTypes = ["Live Courses", "Blended Courses", "Pre-Recorded"],
  loading = false
}) => {
  const [status, setStatus] = useState<string>('Published');
  const [category, setCategory] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [courseId, setCourseId] = useState<string>('');
  const [courseGrade, setCourseGrade] = useState<string>('');
  const [courseType, setCourseType] = useState<string>('');
  const [pricingStatus, setPricingStatus] = useState<string>('');
  const [hasPricing, setHasPricing] = useState<string>('');
  const [currency, setCurrency] = useState<string>('');
  const [advancedSearch, setAdvancedSearch] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Use a ref to store the timeout ID for debounce
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    applyFilters();
  };

  // Apply filters with current state values
  const applyFilters = (): void => {
    setIsSearching(false);
    onFilterChange({ 
      status, 
      courseCategory: category, 
      search, 
      course_id: courseId,
      course_grade: courseGrade,
      course_type: courseType,
      pricing_status: pricingStatus,
      has_pricing: hasPricing,
      currency
    });
  };

  // Reset all filters
  const resetFilters = (): void => {
    setStatus('Published');
    setCategory('');
    setSearch('');
    setCourseId('');
    setCourseGrade('');
    setCourseType('');
    setPricingStatus('');
    setHasPricing('');
    setCurrency('');
    
    // Apply the reset filters
    setTimeout(() => {
      onFilterChange({
        status: 'Published'
      });
    }, 0);
  };

  // Debounced search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setSearch(value);
    setIsSearching(true);
    
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set a new timeout
    searchTimeoutRef.current = setTimeout(() => {
      applyFilters();
    }, 500);
  };

  // Event handlers for select inputs
  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setStatus(e.target.value);
    setIsSearching(true);
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setCategory(e.target.value);
    setIsSearching(true);
  };

  const handleCurrencyChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setCurrency(e.target.value);
    setIsSearching(true);
  };

  const handleCourseIdChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCourseId(e.target.value);
    setIsSearching(true);
  };

  const handleCourseGradeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCourseGrade(e.target.value);
    setIsSearching(true);
  };

  const handleCourseTypeChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setCourseType(e.target.value);
    setIsSearching(true);
  };

  const handlePricingStatusChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setPricingStatus(e.target.value);
    setIsSearching(true);
  };

  const handleHasPricingChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setHasPricing(e.target.value);
    setIsSearching(true);
  };

  // Clean up the timeout when component unmounts
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Convert arrays to select options
  const categoryOptions: SelectOption[] = categories.map(cat => ({ value: cat, label: cat }));
  const currencyOptions: SelectOption[] = currencies.map(curr => ({ value: curr, label: curr }));
  const classTypeOptions: SelectOption[] = classTypes.map(type => ({ value: type, label: type }));
  const statusOptions: SelectOption[] = [
    { value: 'Published', label: 'Published' },
    { value: 'Draft', label: 'Draft' },
    { value: 'Archived', label: 'Archived' }
  ];
  const pricingStatusOptions: SelectOption[] = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
  ];
  const hasPricingOptions: SelectOption[] = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' }
  ];

  return (
    <div className="mb-4 bg-white p-6 rounded-lg shadow-sm">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by title or keyword"
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={status}
            onChange={handleStatusChange}
            disabled={loading}
          >
            {statusOptions.map((option, index) => (
              <option key={`status-${index}-${option.value}`} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={category}
            onChange={handleCategoryChange}
            disabled={loading}
          >
            {categoryOptions.map((option, index) => (
              <option key={`category-${index}-${option.value}`} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={currency}
            onChange={handleCurrencyChange}
            disabled={loading}
          >
            {currencyOptions.map((option, index) => (
              <option key={`currency-${index}-${option.value}`} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {advancedSearch && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course ID</label>
              <Input
                value={courseId}
                onChange={handleCourseIdChange} 
                placeholder="Enter course ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Grade</label>
              <Input
                value={courseGrade}
                onChange={handleCourseGradeChange} 
                placeholder="Enter course grade"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Type</label>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={courseType}
                onChange={handleCourseTypeChange}
                disabled={loading}
              >
                {classTypeOptions.map((option, index) => (
                  <option key={`courseType-${index}-${option.value}`} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pricing Status</label>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={pricingStatus}
                onChange={handlePricingStatusChange}
                disabled={loading}
              >
                {pricingStatusOptions.map((option, index) => (
                  <option key={`pricingStatus-${index}-${option.value}`} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Has Pricing</label>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={hasPricing}
                onChange={handleHasPricingChange}
                disabled={loading}
              >
                {hasPricingOptions.map((option, index) => (
                  <option key={`hasPricing-${index}-${option.value}`} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </>
        )}
        
        <div className="col-span-1 md:col-span-3 flex justify-between mt-4">
          <button
            type="button"
            className={`px-3 py-2 text-sm font-medium rounded-md ${advancedSearch ? 'bg-gray-200 text-gray-800' : 'bg-white border border-gray-300 text-gray-700'}`}
            onClick={() => setAdvancedSearch(!advancedSearch)}
          >
            {advancedSearch ? "Simple Search" : "Advanced Search"}
          </button>
          
          <div className="space-x-2">
            <button
              type="button"
              className="px-3 py-2 text-sm font-medium border border-gray-300 rounded-md bg-white text-gray-700"
              onClick={resetFilters}
              disabled={loading}
            >
              Reset
            </button>
            
            <button
              type="submit"
              className="px-3 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white"
              disabled={loading}
            >
              {loading ? "Loading..." : "Apply Filters"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

// Add Filters interface before the AdminCourseFee component
interface Filters extends PriceFilterParams {
  status: string;
  category: string;
  search: string;
}

interface ExpandedRows {
  [key: string]: boolean;
}

const AdminCourseFee: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    category: 'all',
    search: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<string[]>([]);
  const [currencies, setCurrencies] = useState<ICurrency[]>([]);
  const [currencyRates, setCurrencyRates] = useState<CurrencyRates>({});
  const [bulkConfig, setBulkUpdateConfig] = useState<BulkUpdateConfig>({
    type: '',
    value: '',
    priceType: 'both',
    currency: undefined
  });
  const [sortState, setSortState] = useState<SortState>({
    field: 'title',
    direction: null
  });
  const [toastConfig, setToastConfig] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    show: false,
    message: '',
    type: 'info'
  });
  const [courses, setCourses] = useState<CoursePrice[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');

  // ======= Currency Management Functions =======
  
  // Fetch currencies from API
  const fetchCurrencies = async () => {
    setLoading(true);
    try {
      const currencies = await getAllCurrencies();
      
      // Start with default rates to ensure we always have USD
      const rates: CurrencyRates = {
        USD: { 
          valueWrtUSD: 1,
          symbol: "$", 
          name: "US Dollar", 
          rate: 1 
        }
      };
      
      // Add all currencies from the API
      currencies.forEach((currency) => {
        rates[currency.countryCode] = {
          valueWrtUSD: currency.valueWrtUSD,
          symbol: currency.symbol,
          name: currency.country,
          rate: currency.valueWrtUSD
        };
      });
      
      // Only update if we got currencies back from API
      if (Object.keys(rates).length > 1) {
        setCurrencyRates(rates);
      }
      
    } catch (error) {
      console.error("Error fetching currencies:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Load currencies on initial component load
  useEffect(() => {
    fetchCurrencies();
  }, []);
  
  // Handle currency rates update
  const handleCurrencyRatesUpdate = async (newRates: CurrencyRates) => {
    try {
      const updatedRates: CurrencyRates = {};
      Object.entries(newRates).forEach(([code, rate]) => {
        updatedRates[code] = {
          ...rate,
          valueWrtUSD: rate.rate // Use rate as valueWrtUSD
        };
      });
      setCurrencyRates(updatedRates);
      showToast("Currency conversion rates updated successfully", "success");
    } catch (error) {
      console.error('Error updating currency rates:', error);
      showToast('Failed to update currency rates', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ======= Course Management Functions =======
  
  // Fetch courses on initial load and when filters change
  useEffect(() => {
    fetchCourses();
  }, [filters]);
  
  // Update the showToast function to accept 'info' as a valid type
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToastConfig({ show: true, message, type });
    setTimeout(() => {
      setToastConfig(prev => ({ ...prev, show: false }));
    }, 5000);
  };
  
  const fetchCourses = async () => {
    setLoading(true);
    try {
      // Get the API URL based on filters
      const url = `${apiBaseUrl}/courses/prices`;
      
      // Prepare the parameters for the API request
      const params: Record<string, any> = {};
      
      // Add filter parameters if they exist
      if (filters.status) params.status = filters.status;
      if (filters.courseCategory) params.courseCategory = filters.courseCategory;
      if (filters.search) params.search = filters.search;
      if (filters.course_id) params.course_id = filters.course_id;
      if (filters.course_grade) params.course_grade = filters.course_grade;
      if (filters.course_type) params.course_type = filters.course_type;
      if (filters.currency) params.currency = filters.currency;
      if (filters.pricing_status) params.pricing_status = filters.pricing_status;
      if (filters.has_pricing) params.has_pricing = filters.has_pricing;

      // Get authentication token from localStorage
      const token = localStorage.getItem('token');
      
      // Make the API request
      const response = await axios.get<CoursePricingListResponse>(url, { 
        params,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.success) {
        // Get the courses from the response
        const apiCourses = response.data.data;
        
        // Extract categories from API response if available
        const categories = Array.from(new Set(
          apiCourses
            .map(course => course.courseCategory || '')
            .filter(Boolean)
        ));
        setCategories(categories.length > 0 ? categories : []);
        
        // Helper function to parse price string to number
        const parsePriceString = (priceStr: string | number): number => {
          if (typeof priceStr === 'number') return priceStr;
          // Remove currency symbols and any whitespace
          const cleanPrice = priceStr.replace(/[₹$€£\s]/g, '');
          // Convert to number
          const numPrice = parseFloat(cleanPrice);
          // Return 0 if parsing fails
          return isNaN(numPrice) ? 0 : numPrice;
        };
        
        // Map the API response to our internal format
        const mappedCourses = apiCourses.map(course => {
          // Map pricing to our price details format
          const validPrices: PriceDetails[] = course.pricing
            .filter(price => price.currency !== 'Not specified' && price.prices.individual !== 'N/A')
            .map(price => ({
            currency: price.currency,
            individual: parsePriceString(price.prices.individual),
            batch: parsePriceString(price.prices.batch),
              min_batch_size: typeof price.batchSize.min === 'string' ? 2 : price.batchSize.min,
              max_batch_size: typeof price.batchSize.max === 'string' ? 10 : price.batchSize.max,
            early_bird_discount: price.discounts.earlyBird === "N/A" ? 0 : parseFloat(price.discounts.earlyBird),
            group_discount: price.discounts.group === "N/A" ? 0 : parseFloat(price.discounts.group),
            is_active: price.status === "Active"
          }));
          
          return {
            id: course.courseId,
            title: course.courseTitle,
            category: course.courseCategory || '', 
            selected: false,
            prices: validPrices,
            isEditing: false
          };
        });
        
        setCourses(mappedCourses);
      } else {
        showToast(response.data?.message || 'Failed to fetch courses', 'error');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      showToast('Failed to fetch courses. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectAll = (checked: boolean) => {
    setSelectedCourses(prev => {
      const newSet = new Set(prev);
      if (checked) {
        courses.forEach(course => newSet.add(course.id));
      }
      return newSet;
    });
  };
  
  const handleSelectCourse = (id: string, checked: boolean) => {
    setSelectedCourses(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };
  
  const toggleRowExpansion = (courseId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };
  
  const toggleEditMode = (courseId: string) => {
    setCourses(prev => {
      const updatedCourses = prev.map(course => {
        if (course.id === courseId) {
          // When entering edit mode, create a deep copy of prices for editing
          // When exiting edit mode, remove editedPrices
          return { 
            ...course, 
            isEditing: !course.isEditing,
            editedPrices: !course.isEditing ? JSON.parse(JSON.stringify(course.prices)) : undefined
          };
        }
        return course;
      });
      return updatedCourses;
    });

    // Auto-expand the row when entering edit mode
    if (!courses.find(c => c.id === courseId)?.isEditing) {
      setExpandedRows(prev => {
        const newSet = new Set(prev);
        newSet.add(courseId);
        return newSet;
      });
    }
  };
  
  const handlePriceChange = (courseId: string, priceIndex: number, updatedPrice: Partial<PriceDetails>) => {
    setCourses(prev => {
      const updatedCourses = prev.map(course => {
        if (course.id === courseId && course.editedPrices) {
          const newEditedPrices = [...course.editedPrices];
          const existingPrice = newEditedPrices[priceIndex] || {
            individual: 0,
            batch: 0,
            currency: '',
            prices: [],
            batchSize: 0,
            discounts: []
          };
          newEditedPrices[priceIndex] = {
            ...existingPrice,
            ...updatedPrice
          };
          return { ...course, editedPrices: newEditedPrices };
        }
        return course;
      });
      return updatedCourses;
    });
  };
  
  const handleAddPriceOption = (courseId: string) => {
    setCourses(prev => {
      const updatedCourses = prev.map(course => {
        if (course.id === courseId) {
          const newEditedPrices = course.editedPrices ? [...course.editedPrices] : [];
          newEditedPrices.push({
            individual: 0,
            batch: 0,
            currency: selectedCurrency,
            prices: [],
            batchSize: 0,
            discounts: []
          });
          return { ...course, editedPrices: newEditedPrices };
        }
        return course;
      });
      return updatedCourses;
    });
  };
  
  const handleRemovePriceOption = (courseId: string, priceIndex: number) => {
    setCourses(prev => {
      const updatedCourses = prev.map(course => {
        if (course.id === courseId && course.editedPrices) {
          const newEditedPrices = [...course.editedPrices];
          newEditedPrices.splice(priceIndex, 1);
          return { ...course, editedPrices: newEditedPrices };
        }
        return course;
      });
      return updatedCourses;
    });
  };
  
  const saveCoursePricing = async (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course || !course.editedPrices) return;
    
    setLoading(true);
    
    try {
      // Convert from our internal PriceDetails format to the API's expected format
      // The API expects currency, individual, and batch fields (not individualPrice/batchPrice)
      const apiPricing = course.editedPrices.map(price => ({
        currency: price.currency,
        individual: price.individual,
        batch: price.batch,
        min_batch_size: price.min_batch_size || 2,
        max_batch_size: price.max_batch_size || 10,
        early_bird_discount: price.early_bird_discount || 0,
        group_discount: price.group_discount || 0,
        is_active: price.is_active
      }));
      
      // Call the API to update pricing
      const url = `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/prices`;
      
      // Get authentication token from localStorage
      const token = localStorage.getItem('token');
      
      // Send "prices" instead of "pricing" to match what the API expects
      const response = await axios.put(url, {
        prices: apiPricing
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.success) {
        // Update the course in state with the new prices
        setCourses(prev => {
          const updatedCourses = prev.map(c => {
            if (c.id === courseId) {
              return {
                ...c,
                prices: course.editedPrices as PriceDetails[],
                isEditing: false,
                editedPrices: undefined
              };
            }
            return c;
          });
          return updatedCourses;
        });
        
        showToast(`Updated pricing for "${course.title}"`, 'success');
      } else {
        showToast(response.data?.message || 'Failed to update pricing', 'error');
      }
    } catch (error) {
      console.error('Error updating course pricing:', error);
      showToast('Failed to update pricing. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const cancelEditing = (courseId: string) => {
    setCourses(prev => {
      const updatedCourses = prev.map(course => {
        if (course.id === courseId) {
          return {
            ...course,
            isEditing: false,
            editedPrices: undefined
          };
        }
        return course;
      });
      return updatedCourses;
    });
  };
  
  const handleBulkUpdateConfig = (config: Partial<BulkUpdateConfig>) => {
    setBulkUpdateConfig(prevConfig => ({
      ...prevConfig,
      ...config
    }));
  };
  
  const applyBulkUpdate = async () => {
    if (!bulkConfig.type || !bulkConfig.value || Number(bulkConfig.value) <= 0) {
      showToast('Please specify a valid update type and value', 'error');
      return;
    }
    
    // Get selected courses
    const selectedCourses = courses.filter(course => selectedCourses.has(course.id));
    if (selectedCourses.length === 0) {
      showToast('No courses selected', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      // Create update payloads for each course
      const bulkUpdates = selectedCourses.map(course => {
        // Apply the bulk update to each price option
        const updatedPrices = course.prices.map(price => {
          // Skip if currency filter is set and doesn't match
          if (bulkConfig.currency && price.currency !== bulkConfig.currency) {
            return price;
          }
          
          // Create a copy of the price to modify
          const updatedPrice = { ...price };
          const value = Number(bulkConfig.value);
          
          // Apply update based on type and priceType
          if (bulkConfig.priceType === 'both' || bulkConfig.priceType === 'batch') {
            updatedPrice.batch = applyPriceUpdate(updatedPrice.batch, bulkConfig.type, value);
          }
          
          if (bulkConfig.priceType === 'both' || bulkConfig.priceType === 'individual') {
            updatedPrice.individual = applyPriceUpdate(updatedPrice.individual, bulkConfig.type, value);
          }
          
          return updatedPrice;
        });
        
        // Convert to the API's expected format
        const apiPricing = updatedPrices.map(price => ({
          currency: price.currency,
          individual: price.individual,
          batch: price.batch,
          min_batch_size: price.min_batch_size || 2,
          max_batch_size: price.max_batch_size || 10,
          early_bird_discount: price.early_bird_discount || 0,
          group_discount: price.group_discount || 0,
          is_active: price.is_active
        }));
        
        return {
          courseId: course.id,
          prices: apiPricing
        };
      });
      
      // Call the API to update the prices
      const url = `${process.env.NEXT_PUBLIC_API_URL}/courses/prices/bulk-update`;
      
      // Get authentication token from localStorage
      const token = localStorage.getItem('token');
      
      const response = await axios.post(url, {
        updates: bulkUpdates
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.success) {
        // Update the courses in state with the new prices
        setCourses(prev => {
          const updatedCourses = prev.map(course => {
            const selected = selectedCourses.has(course.id);
            if (!selected) return course;
            
            // Find the updated pricing for this course
            const update = bulkUpdates.find(u => u.courseId === course.id);
            if (update) {
              // Convert back to our internal format
              const prices: PriceDetails[] = update.prices.map(price => ({
                currency: price.currency,
                individual: price.individual,
                batch: price.batch,
                min_batch_size: price.min_batch_size || 2,
                max_batch_size: price.max_batch_size || 10,
                early_bird_discount: price.early_bird_discount || 0,
                group_discount: price.group_discount || 0,
                is_active: price.is_active
              }));
              
              return {
                ...course,
                prices
              };
            }
            return course;
          });
          return updatedCourses;
        });
        
        showToast(`Updated pricing for ${selectedCourses.size} courses`, 'success');
      } else {
        showToast(response.data?.message || 'Failed to update pricing', 'error');
      }
    } catch (error) {
      console.error('Error applying bulk update:', error);
      console.error('Error applying psychology pricing:', error);
      showToast('Failed to apply psychology pricing. Please try again.', 'error');
    } finally {
      setSaving(null);
    }
  };
  
  const selectedCount = courses.filter(course => course.selected).length;
  
  const handleAddFirstPriceOption = (courseId: string) => {
    setCourses(courses.map(course => {
      if (course.id === courseId) {
        // Create a default price with the first available currency from our rates
        // or USD as fallback
        const defaultCurrency = Object.keys(currencyRates)[0] || 'USD';
        const defaultPrice: PriceDetails = {
          currency: defaultCurrency,
          individual: 0,
          batch: 0,
          min_batch_size: 2,
          max_batch_size: 10,
          early_bird_discount: 0,
          group_discount: 0,
          is_active: true
        };
        
        return { 
          ...course, 
          isEditing: true,
          editedPrices: [defaultPrice]
        };
      }
      return course;
    }));

    // Auto-expand the row when adding the first price option
    setExpandedRows(prev => ({
      ...prev,
      [courseId]: true
    }));
  };

  // Add sorting function
  const handleSort = (field: 'title' | 'category') => {
    setSortState(prev => {
      if (prev.field === field) {
        // If clicking the same field, cycle through: asc -> desc -> null
        if (prev.direction === 'asc') return { field, direction: 'desc' };
        if (prev.direction === 'desc') return { field, direction: null };
        return { field, direction: 'asc' };
      }
      // If clicking a new field, start with ascending sort
      return { field, direction: 'asc' };
    });
  };

  // Add sorted courses computation
  const sortedCourses = useMemo(() => {
    if (!sortState.direction) return courses;

    return [...courses].sort((a, b) => {
      const aValue = a[sortState.field] || '';
      const bValue = b[sortState.field] || '';
      
      if (sortState.direction === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }, [courses, sortState]);

  // Add function to fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/categories`);
      if (response.data && response.data.success) {
        setCategories(response.data.data.map((cat: any) => cat.name));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Add useEffect to fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleBulkAddCurrencyPricing = async (currencyCode: string) => {
    if (!currencyCode) {
      showToast('Please select a currency', 'error');
      return;
    }
    
    setSaving('bulk-currency');
    
    try {
      // Get the selected currency rate
      const currencyRate = currencyRates[currencyCode];
      if (!currencyRate) {
        throw new Error('Currency rate not found');
      }
      
      // Get courses that don't have pricing in the selected currency
      const coursesNeedingPricing = courses.filter(course => {
        // Check if course already has pricing in the selected currency
        return !course.prices.some(price => price.currency === currencyCode);
      });
      
      if (coursesNeedingPricing.length === 0) {
        showToast(`All courses already have pricing in ${currencyCode}`, 'success');
        setSaving(null);
        return;
      }
      
      // Create updates for these courses
      const bulkUpdates = coursesNeedingPricing.map(course => {
        // Start with current prices
        const existingPrices = [...course.prices];
        
        // Find USD price to use as base for conversion (if exists)
        const usdPrice = existingPrices.find(price => price.currency === 'USD');
        
        // If no USD price, skip this course
        if (!usdPrice) return null;
        
        // Create new price option based on USD
        const newPrice: PriceDetails = {
          currency: currencyCode,
          individual: usdPrice.individual * currencyRate.rate,
          batch: usdPrice.batch * currencyRate.rate,
          min_batch_size: usdPrice.min_batch_size || 2,
          max_batch_size: usdPrice.max_batch_size || 10,
          early_bird_discount: usdPrice.early_bird_discount || 0,
          group_discount: usdPrice.group_discount || 0,
          is_active: true
        };
        
        // Add the new price to existing prices
        const updatedPrices = [...existingPrices, newPrice];
        
        // Convert to the API's expected format
        const apiPricing = updatedPrices.map(price => ({
          currency: price.currency,
          individual: price.individual,
          batch: price.batch,
          min_batch_size: price.min_batch_size || 2,
          max_batch_size: price.max_batch_size || 10,
          early_bird_discount: price.early_bird_discount || 0,
          group_discount: price.group_discount || 0,
          is_active: price.is_active
        }));
        
        return {
          courseId: course.id,
          prices: apiPricing
        };
      }).filter(Boolean); // Remove null updates (courses with no USD pricing)
      
      if (bulkUpdates.length === 0) {
        showToast(`No courses found with USD pricing to convert from`, 'error');
        setSaving(null);
        return;
      }
      
      // Call the API to update the prices
      const url = `${process.env.NEXT_PUBLIC_API_URL}/courses/prices/bulk-update`;
      
      // Get authentication token from localStorage
      const token = localStorage.getItem('token');
      
      const response = await axios.post(url, {
        updates: bulkUpdates
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.success) {
        // Update the courses in state with the new prices
        setCourses(courses.map(course => {
          const update = bulkUpdates.find(u => u?.courseId === course.id);
          if (!update) return course;
          
          // Convert back to our internal format
          const prices: PriceDetails[] = update.prices.map(price => ({
            currency: price.currency,
            individual: price.individual,
            batch: price.batch,
            min_batch_size: price.min_batch_size || 2,
            max_batch_size: price.max_batch_size || 10,
            early_bird_discount: price.early_bird_discount || 0,
            group_discount: price.group_discount || 0,
            is_active: price.is_active
          }));
          
          return {
            ...course,
            prices
          };
        }));
        
        showToast(`Added ${currencyCode} pricing to ${bulkUpdates.length} courses based on USD rates`, 'success');
      } else {
        showToast(response.data?.message || 'Failed to update pricing', 'error');
      }
    } catch (error) {
      console.error('Error applying bulk currency update:', error);
      showToast('Failed to apply bulk currency updates. Please try again.', 'error');
    } finally {
      setSaving(null);
    }
  };

  const applyPsychologyPricingToSelected = async () => {
    setSaving('psychology-pricing');
    
    // Get selected courses
    const selectedCoursesList = courses.filter(course => selectedCourses.has(course.id));
    if (selectedCoursesList.length === 0) {
      showToast('No courses selected', 'error');
      setSaving('');
      return;
    }

    try {
      // Apply psychology pricing to each selected course
      const psychologyUpdates = selectedCoursesList.map(course => {
        // Apply psychology pricing to each price option
        const updatedPrices = course.prices.map((price: PriceDetails) => {
          const updatedPrice = { ...price };
          
          // Round individual price to end with 9
          if (updatedPrice.individual) {
            const numValue = parseFloat(updatedPrice.individual);
            if (numValue > 0) {
              const rounded = Math.floor(numValue) - 0.01;
              updatedPrice.individual = rounded.toFixed(2);
            }
          }
          
          // Round batch price to end with 9
          if (updatedPrice.batch) {
            const numValue = parseFloat(updatedPrice.batch);
            if (numValue > 0) {
              const rounded = Math.floor(numValue) - 0.01;
              updatedPrice.batch = rounded.toFixed(2);
            }
          }
          
          return updatedPrice;
        });
        
        // Convert to the API's expected format
        const apiPricing = updatedPrices.map((price: PriceDetails) => ({
          currency: price.currency,
          prices: {
            individual: price.individual,
            batch: price.batch
          },
          discounts: {
            earlyBird: price.earlyBird || "0",
            group: price.groupDiscount || "0"
          },
          batchSize: {
            min: price.minBatchSize || 0,
            max: price.maxBatchSize || 0
          },
          status: "active"
        }));
        
        return {
          courseId: course.id,
          prices: updatedPrices,
          apiPricing
        };
      });
      
      // Save updated pricing to the API
      let successCount = 0;
      for (const update of psychologyUpdates) {
        try {
          const response = await axios.post('/api/courses/pricing', {
            courseId: update.courseId,
            pricing: update.apiPricing
          });
          
          if (response.data.success) {
            successCount++;
            
            // Update local state
            setCourses(prevCourses => 
              prevCourses.map(course => 
                course.id === update.courseId 
                  ? { ...course, prices: update.prices } 
                  : course
              )
            );
          }
        } catch (error) {
          console.error(`Failed to update course ${update.courseId}:`, error);
        }
      }
      
      // Show success message
      if (successCount > 0) {
        showToast(`Applied psychology pricing to ${successCount} of ${psychologyUpdates.length} courses`, 'success');
      } else {
        showToast('Failed to apply psychology pricing. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error applying psychology pricing:', error);
      showToast('Error applying psychology pricing. Please try again.', 'error');
    } finally {
      setSaving('');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Course Pricing Management</h1>
      </div>
      
      <CourseFeeFilter 
        onFilterChange={setFilters} 
        categories={categories} 
        currencies={Object.keys(currencyRates)}
        classTypes={["Live Courses", "Blended Courses", "Pre-Recorded"]}
        loading={loading || saving !== ''}
      />
      
      <BulkUpdateSection 
        selectedCount={selectedCount}
        onBulkUpdateConfig={handleBulkUpdateConfig}
        onApplyBulkUpdate={applyBulkUpdate}
        bulkConfig={bulkConfig}
        currencies={Object.keys(currencyRates)}
        currencyRates={currencyRates}
      />
      
      {/* Add Psychology Pricing Button */}
      <div className="mb-6">
        <Card>
          <CardHeader
            title="Psychology Pricing"
            subtitle="Apply psychology pricing (rounding to nearest 9) to selected courses"
          />
          <div className="p-6">
            <Button
              onClick={applyPsychologyPricingToSelected}
              variant="default"
              disabled={selectedCount === 0 || saving === 'psychology-pricing'}
              className="w-full"
            >
              {saving === 'psychology-pricing' ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Applying Psychology Pricing...
                </>
              ) : (
                <>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Apply Psychology Pricing (120→119, 115209→115199)
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Course Pricing</h3>
          <p className="text-sm text-gray-500">Manage individual and batch pricing for all courses</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  <input 
                    type="checkbox" 
                    className="focus:ring-customGreen h-5 w-5 text-customGreen border-gray-300 rounded"
                    checked={selectAll} 
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    disabled={loading || courses.length === 0}
                  />
                </th>
                <th 
                  scope="col" 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Course Title</span>
                    {sortState.field === 'title' && (
                      <span className="text-gray-400">
                        {sortState.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Category</span>
                    {sortState.field === 'category' && (
                      <span className="text-gray-400">
                        {sortState.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pricing Options
                </th>
                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center">
                      <RefreshCcw className="animate-spin h-10 w-10 text-customGreen mb-3" />
                      <span className="text-base">Loading courses...</span>
                    </div>
                  </td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center">
                      <AlertCircle className="h-10 w-10 text-amber-500 mb-3" />
                      <span className="text-base">No courses found. Try changing your filters.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedCourses.map(course => (
                  <Fragment key={course.id}>
                    <tr className={`${expandedRows[course.id] ? 'bg-gray-50' : 'hover:bg-gray-50'}`}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input 
                          type="checkbox" 
                          className="focus:ring-customGreen h-5 w-5 text-customGreen border-gray-300 rounded"
                          checked={course.selected} 
                          onChange={(e) => handleSelectCourse(course.id, e.target.checked)}
                          disabled={course.isEditing}
                        />
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        <div className="space-y-1.5">
                          <div className="font-semibold text-gray-900 line-clamp-1">
                            {course.title.split('|')[0].trim()}
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs">
                            {course.title.split('|').slice(1).map((detail, index) => {
                              const [label, value] = detail.split(':').map(s => s.trim());
                              let badgeColor = 'bg-gray-100 text-gray-800';
                              
                              // Determine badge color based on label
                              if (label.toLowerCase().includes('grade')) {
                                if (value.toLowerCase().includes('preschool')) {
                                  badgeColor = 'bg-pink-100 text-pink-800';
                                } else if (value.toLowerCase().includes('executive') || value.toLowerCase().includes('professional')) {
                                  badgeColor = 'bg-purple-100 text-purple-800';
                                } else if (value.toLowerCase().includes('all grade')) {
                                  badgeColor = 'bg-indigo-100 text-indigo-800';
                                } else {
                                  badgeColor = 'bg-blue-100 text-blue-800';
                                }
                              } else if (label.toLowerCase().includes('duration')) {
                                badgeColor = 'bg-green-100 text-green-800';
                              }

                              return (
                                <span 
                                  key={index}
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}
                                >
                                  {label}: {value}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.category || 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        <div className="flex flex-wrap gap-2">
                          {course.prices.length > 0 ? (
                            course.prices.map((price, index) => (
                              <div 
                                key={index} 
                                className={`flex items-center space-x-2 px-2 py-1 rounded-md ${
                                  price.is_active 
                                    ? 'bg-green-50 border border-green-200' 
                                    : 'bg-gray-50 border border-gray-200'
                                }`}
                              >
                                <span className={`w-2 h-2 rounded-full ${price.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                <div className="flex flex-col">
                                  <div className="flex items-center space-x-1">
                                    <span className="font-medium text-gray-900">{currencyFormat(price.individual, price.currency)}</span>
                                    <span className="text-xs text-gray-500">/ individual</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <span className="font-medium text-gray-900">{currencyFormat(price.batch, price.currency)}</span>
                                    <span className="text-xs text-gray-500">/ batch</span>
                                  </div>
                                  {(price.early_bird_discount ?? 0) > 0 && (
                                    <div className="text-xs text-green-600">
                                      Early Bird: {price.early_bird_discount}% off
                                    </div>
                                  )}
                                  {(price.group_discount ?? 0) > 0 && (
                                    <div className="text-xs text-blue-600">
                                      Group: {price.group_discount}% off
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="flex items-center space-x-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-md">
                              <AlertCircle className="h-4 w-4 text-amber-500" />
                              <span className="text-sm text-amber-700">No pricing set</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-2">
                          {course.isEditing ? (
                            <>
                              <ActionButton 
                                icon={Check} 
                                onClick={() => saveCoursePricing(course.id)}
                                title="Save"
                                disabled={saving === course.id}
                                variant="success"
                              />
                              <ActionButton 
                                icon={saving === course.id ? RefreshCw : XIcon} 
                                onClick={() => cancelEditing(course.id)}
                                title="Cancel"
                                disabled={saving === course.id}
                                variant="danger"
                              />
                            </>
                          ) : (
                            <>
                              <ActionButton 
                                icon={Edit} 
                                onClick={() => course.prices.length > 0 ? toggleEditMode(course.id) : handleAddFirstPriceOption(course.id)}
                                title={course.prices.length > 0 ? "Edit" : "Add"}
                                variant="primary"
                              />
                              <ActionButton 
                                icon={expandedRows[course.id] ? ChevronUp : ChevronDown} 
                                onClick={() => toggleRowExpansion(course.id)}
                                title={expandedRows[course.id] ? "Collapse" : "Expand"}
                              />
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedRows[course.id] && (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 bg-gray-50">
                          <div className="space-y-4">
                            {course.isEditing ? (
                              <>
                                <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                                  <h4 className="text-lg font-medium text-gray-900">Edit Pricing Options</h4>
                                  {course.editedPrices && course.editedPrices.length > 0 && (
                                    <button
                                      onClick={() => handleAddPriceOption(course.id)}
                                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors border border-blue-200 flex items-center"
                                    >
                                      <span className="mr-1 text-lg font-semibold">+</span> Add Price Option
                                    </button>
                                  )}
                                </div>
                                <div className="space-y-4">
                                  {course.editedPrices?.map((price, index) => (
                                    <PriceEditor
                                      key={index}
                                      price={price}
                                      index={index}
                                      onChange={(idx, updatedPrice) => handlePriceChange(course.id, idx, updatedPrice)}
                                      onRemove={course.editedPrices && course.editedPrices.length > 1 
                                        ? (idx) => handleRemovePriceOption(course.id, idx) 
                                        : undefined}
                                      isNew={course.prices.length === 0}
                                      currencyRates={currencyRates}
                                    />
                                  ))}
                                </div>
                              </>
                            ) : (
                              <>
                                <h4 className="text-base font-medium text-gray-900">Pricing Details</h4>
                                {course.prices.length > 0 ? (
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {course.prices.map((price, index) => (
                                      <div key={index} className={`p-5 rounded-lg ${price.is_active 
                                        ? 'bg-white border-2 border-blue-200 shadow-sm' 
                                        : 'bg-gray-50 border border-gray-200'}`}>
                                        <div className="flex justify-between mb-3 items-center">
                                          <span className="text-base font-medium text-gray-900">{price.currency}</span>
                                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${price.is_active 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-gray-100 text-gray-600'}`}>
                                            {price.is_active ? 'Active' : 'Inactive'}
                                          </span>
                              </div>
                                        <div className="space-y-3">
                                          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                            <span className="text-sm text-gray-500">Individual Price:</span>
                                            <span className="text-base font-semibold">{currencyFormat(price.individual, price.currency)}</span>
                            </div>
                                          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                            <span className="text-sm text-gray-500">Batch Price:</span>
                                            <span className="text-base font-semibold">{currencyFormat(price.batch, price.currency)}</span>
                                </div>
                                          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                            <span className="text-sm text-gray-500">Batch Size:</span>
                                            <span className="text-sm">{price.min_batch_size || 2} - {price.max_batch_size || 10} people</span>
                              </div>
                                          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                            <span className="text-sm text-gray-500">Early Bird Discount:</span>
                                            <span className="text-sm">{price.early_bird_discount || 0}%</span>
                            </div>
                                          <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Group Discount:</span>
                                            <span className="text-sm">{price.group_discount || 0}%</span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 text-center">
                                    <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                                    <h5 className="text-lg text-amber-800 font-medium mb-3">No Pricing Defined</h5>
                                    <p className="text-amber-700 mb-5 max-w-md mx-auto">This course doesn't have any pricing options defined yet.</p>
                                    <button
                                      onClick={() => handleAddFirstPriceOption(course.id)}
                                      className="px-5 py-2 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors"
                                    >
                                      Add Pricing Options
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Showing {courses.length} courses
          </p>
          {saving === 'bulk' && (
            <div className="flex items-center text-sm text-customGreen">
              <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
              Applying bulk updates...
            </div>
          )}
          {saving === 'bulk-currency' && (
            <div className="flex items-center text-sm text-customGreen">
              <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
              Adding currency pricing to courses...
            </div>
          )}
          {saving === 'psychology-pricing' && (
            <div className="flex items-center text-sm text-customGreen">
              <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
              Applying psychology pricing...
            </div>
          )}
        </div>
      </div>
      
      {/* Toast notification */}
      {toastConfig.show && (
        <Toast 
          message={toastConfig.message} 
          type={toastConfig.type} 
          onClose={() => setToastConfig(prev => ({ ...prev, show: false }))} 
        />
      )}
    </div>
  );
};

// Add home display pricing interfaces and components
interface HomeDisplayPricingItem {
  currency: string;
  prices: {
    individual: string;
    batch: string;
  };
  discounts: {
    earlyBird: string;
    group: string;
  };
  batchSize: {
    min: number;
    max: number;
  };
  status: string;
}

interface HomeDisplayItem {
  id: string;
  title: string;
  category: string;
  classType: string;
  display_order: number;
  is_active: boolean;
  pricing: HomeDisplayPricingItem[];
}

interface HomeDisplayPricingListResponse {
  success: boolean;
  count: number;
  filters: {
    categories: string[];
    types: string[];
    currencies: string[];
  };
  data: HomeDisplayItem[];
  message?: string;
}

interface HomeDisplayPrice {
  id: string;
  title: string;
  category: string;
  classType: string;
  display_order: number;
  is_active: boolean;
  selected: boolean;
  prices: HomeDisplayPricingItem[];
  isEditing: boolean;
  editedPrices?: HomeDisplayPricingItem[];
}

interface HomeDisplayFilterParams {
  status?: string;
  category?: string;
  classType?: string;
  search?: string;
  display_id?: string;
  pricing_status?: string;
  has_pricing?: string;
  currency?: string;
}

// Add ExpandedRowContent component interface
interface ExpandedRowContentProps {
  item: HomeDisplayPrice;
  onPriceChange: (index: number, price: HomeDisplayPricingItem, displayId: string) => void;
  onAddPrice: () => void;
  onRemovePrice: (index: number, displayId: string) => void;
  currencyRates: CurrencyRates;
}

// Add ExpandedRowContent component
const ExpandedRowContent: React.FC<ExpandedRowContentProps> = ({
  item,
  onPriceChange,
  onAddPrice,
  onRemovePrice,
  currencyRates
}) => {
  return (
    <div className="space-y-4">
      {item.isEditing ? (
        <>
          {item.editedPrices?.map((price, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <Select
                  value={price.currency}
                  onChange={(value) => onPriceChange(index, { ...price, currency: value }, item.id)}
                  options={Object.entries(currencyRates).map(([code, currency]) => ({
                    value: code,
                    label: `${code} (${currency.symbol})`
                  }))}
                  disabled={!item.isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Individual Price
                </label>
                <Input
                  value={price.prices.individual}
                  onChange={(value) => onPriceChange(index, { 
                    ...price, 
                    prices: { ...price.prices, individual: value }
                  }, item.id)}
                  placeholder="Enter individual price"
                  type="number"
                  disabled={!item.isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch Price
                </label>
                <Input
                  value={price.prices.batch}
                  onChange={(value) => onPriceChange(index, { 
                    ...price, 
                    prices: { ...price.prices, batch: value }
                  }, item.id)}
                  placeholder="Enter batch price"
                  type="number"
                  disabled={!item.isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch Size
                </label>
                <div className="flex space-x-2">
                  <Input
                    value={price.batchSize.min.toString()}
                    onChange={(value) => onPriceChange(index, { 
                      ...price, 
                      batchSize: { ...price.batchSize, min: parseInt(value) || 0 }
                    }, item.id)}
                    placeholder="Min"
                    type="number"
                    disabled={!item.isEditing}
                  />
                  <Input
                    value={price.batchSize.max.toString()}
                    onChange={(value) => onPriceChange(index, { 
                      ...price, 
                      batchSize: { ...price.batchSize, max: parseInt(value) || 0 }
                    }, item.id)}
                    placeholder="Max"
                    type="number"
                    disabled={!item.isEditing}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Early Bird Discount (%)
                </label>
                <Input
                  value={price.discounts.earlyBird}
                  onChange={(value) => onPriceChange(index, { 
                    ...price, 
                    discounts: { ...price.discounts, earlyBird: value }
                  }, item.id)}
                  placeholder="Enter early bird discount"
                  type="number"
                  disabled={!item.isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group Discount (%)
                </label>
                <Input
                  value={price.discounts.group}
                  onChange={(value) => onPriceChange(index, { 
                    ...price, 
                    discounts: { ...price.discounts, group: value }
                  }, item.id)}
                  placeholder="Enter group discount"
                  type="number"
                  disabled={!item.isEditing}
                />
              </div>

              {item.isEditing && (
                <div className="flex items-end">
                  <Button
                    onClick={() => onRemovePrice(index, item.id)}
                    variant="danger"
                    icon={Trash2}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          ))}
          <div className="flex justify-end mt-4">
            <Button
              onClick={onAddPrice}
              variant="default"
              icon={Plus}
            >
              Add Price Option
            </Button>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {item.prices.map((price, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-medium">
                  {currencyRates[price.currency]?.symbol || price.currency}
                </span>
                <span className="text-sm text-gray-500">{price.currency}</span>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Individual:</span>
                  <span className="ml-2 font-medium">
                    {currencyRates[price.currency]?.symbol || ''}{price.prices.individual}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Batch:</span>
                  <span className="ml-2 font-medium">
                    {currencyRates[price.currency]?.symbol || ''}{price.prices.batch}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Batch Size:</span>
                  <span className="ml-2 font-medium">
                    {price.batchSize.min} - {price.batchSize.max}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Early Bird Discount:</span>
                  <span className="ml-2 font-medium">{price.discounts.earlyBird}%</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Group Discount:</span>
                  <span className="ml-2 font-medium">{price.discounts.group}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const HomeDisplayPricing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [displayItems, setDisplayItems] = useState<HomeDisplayPrice[]>([]);
  const [filteredDisplayItems, setFilteredDisplayItems] = useState<HomeDisplayPrice[]>([]);
  const [displayTypes, setDisplayTypes] = useState<string[]>([]);
  const [currencies, setCurrencies] = useState<string[]>(["USD", "INR"]);
  const [currencyRates, setCurrencyRates] = useState<CurrencyRates>({
    USD: {
      valueWrtUSD: 1,
      symbol: '$',
      name: 'US Dollar',
      rate: 1
    },
    INR: {
      valueWrtUSD: 0.012,
      symbol: '₹',
      name: 'Indian Rupee',
      rate: 83.33
    }
  });
  const [selectedCurrencyForBulk, setSelectedCurrencyForBulk] = useState<string>('');
  const [expandedRows, setExpandedRows] = useState<ExpandedRows>({});
  const [selectedAll, setSelectedAll] = useState(false);
  const [sortState, setSortState] = useState<SortState>({ field: 'title', direction: null });
  const [bulkConfig, setBulkConfig] = useState<BulkUpdateConfig>({
    type: '',
    value: '',
    priceType: 'both'
  });
  const [toastState, setToastState] = useState<{ visible: boolean, message: string, type: 'success' | 'error' | 'info' }>({
    visible: false,
    message: '',
    type: 'info'
  });
  const [filterParams, setFilterParams] = useState<HomeDisplayFilterParams>({
    status: 'Published'
  });

  // Toast helper function
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToastState({
      visible: true,
      message,
      type
    });
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setToastState(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  // Add currency rates editor state
  const [isEditingRates, setIsEditingRates] = useState(false);
  const [editedRates, setEditedRates] = useState<CurrencyRates>(currencyRates);

  // Update fetchCurrencyRates to use the same API as the main currency feature
  const fetchCurrencyRates = async () => {
    try {
      setIsLoading(true);
      const response = await getAllCurrencies();
      
      // Start with default rates to ensure we always have USD
      const rates: CurrencyRates = {
        USD: { 
          valueWrtUSD: 1,
          symbol: "$", 
          name: "US Dollar", 
          rate: 1 
        }
      };
      
      // Add all currencies from the API
      response.forEach((currency) => {
        if (currency.countryCode) {
          rates[currency.countryCode] = {
            valueWrtUSD: currency.valueWrtUSD,
            symbol: currency.symbol,
            name: currency.country,
            rate: currency.valueWrtUSD
          };
        }
      });
      
      // Only update if we got currencies back from API
      if (Object.keys(rates).length > 1) {
        setCurrencyRates(rates);
      }
      
    } catch (error) {
      console.error("Error fetching currencies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update handleCurrencyRateUpdate to use the same API
  const handleCurrencyRateUpdate = async (newRates: CurrencyRates) => {
    try {
      setIsLoading(true);
      const updates = Object.entries(newRates).map(([code, data]) => ({
        countryCode: code,
        country: data.name,
        valueWrtUSD: data.rate,
        symbol: data.symbol
      }));

      const promises = updates.map(update => 
        updateCurrency(update.countryCode, update)
      );

      await Promise.all(promises);
      setCurrencyRates(newRates);
      showToast('Currency rates updated successfully', 'success');
    } catch (error) {
      console.error('Error updating currency rates:', error);
      showToast('Failed to update currency rates', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Add useEffect to fetch currency rates on component mount
  useEffect(() => {
    fetchCurrencyRates();
  }, []);

  // Fetch home display items with prices
  const fetchHomeDisplays = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('Authentication token not found', 'error');
        return;
      }

      const url = new URL(apiUrls.home.getAllHomeDisplaysWithPrices, window.location.origin);
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch home display items');
      }

      const data: HomeDisplayPricingListResponse = await response.json();
      
      if (data.success) {
        // Transform the data for our UI
        const displayItemsWithUI = data.data.map(item => ({
          id: item.id,
          title: item.title,
          category: item.category,
          classType: item.classType,
          display_order: item.display_order,
          is_active: item.is_active,
          selected: false,
          prices: item.pricing || [], // Map pricing array to prices
          isEditing: false
        }));

        setDisplayItems(displayItemsWithUI);
        setFilteredDisplayItems(displayItemsWithUI);
        
        // Update filters from API response
        if (data.filters) {
          setDisplayTypes(data.filters.types || []);
          setCurrencies(data.filters.currencies || []);
        }
      } else {
        showToast(data.message || 'Failed to fetch home display items', 'error');
      }
    } catch (error) {
      console.error('Error fetching home display items:', error);
      showToast('Failed to fetch home display items', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filters: HomeDisplayFilterParams) => {
    setFilterParams(filters);
  };

  // Apply bulk update to home display items
  const applyBulkUpdate = async () => {
    try {
      if (!bulkConfig.type || !bulkConfig.value) {
        showToast('Please select update type and enter a value', 'error');
        return;
      }

      const selectedItems = filteredDisplayItems.filter(item => item.selected);
      if (selectedItems.length === 0) {
        showToast('Please select at least one home display item', 'error');
        return;
      }

      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('Authentication token not found', 'error');
        return;
      }

      // Helper function for price updates
      const applyPriceUpdate = (currentPrice: number, updateType: string, value: number): number => {
        switch (updateType) {
          case 'fixed':
            return value;
          case 'increase_percent':
            return currentPrice * (1 + value / 100);
          case 'decrease_percent':
            return currentPrice * (1 - value / 100);
          case 'increase_amount':
            return currentPrice + value;
          case 'decrease_amount':
            return Math.max(0, currentPrice - value);
          default:
            return currentPrice;
        }
      };

      // Prepare updated prices for selected items
      const updatedDisplayItems = selectedItems.map(item => {
        const updatedPrices = item.prices.map(price => {
          if (!bulkConfig.currency || price.currency === bulkConfig.currency) {
            const currentIndividualPrice = parseFloat(price.prices.individual) || 0;
            const currentBatchPrice = parseFloat(price.prices.batch) || 0;
            
            const updatedIndividualPrice = applyPriceUpdate(currentIndividualPrice, bulkConfig.type, parseFloat(bulkConfig.value) || 0);
            const updatedBatchPrice = applyPriceUpdate(currentBatchPrice, bulkConfig.type, parseFloat(bulkConfig.value) || 0);

            return {
              ...price,
              prices: {
                individual: updatedIndividualPrice.toFixed(2),
                batch: updatedBatchPrice.toFixed(2)
              }
            };
          }
          return price;
        });

        return {
          displayId: item.id,
          pricing: updatedPrices
        };
      });

      // Send bulk update request
      const response = await fetch(apiUrls.home.bulkUpdateHomeDisplayPrices, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          displayItems: updatedDisplayItems
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update home display prices');
      }

      const result = await response.json();
      
      if (result.success) {
        showToast('Home display prices updated successfully', 'success');
        fetchHomeDisplays(); // Refresh the data
      } else {
        showToast(result.message || 'Failed to update home display prices', 'error');
      }
    } catch (error) {
      console.error('Error updating home display prices:', error);
      showToast('Error updating home display prices. Please try again.', 'error');
    } finally {
      setSaving('');
    }
  };

  // Toggle edit mode for a home display item
  const toggleEditMode = (displayId: string) => {
    setFilteredDisplayItems(prev => 
      prev.map(item => {
        if (item.id === displayId) {
          return {
            ...item,
            isEditing: !item.isEditing,
            editedPrices: !item.isEditing ? [...item.prices] : undefined
          };
        }
        return item;
      })
    );
  };

  // Save home display pricing
  const saveHomeDisplayPricing = async (displayId: string) => {
    try {
      const displayItem = filteredDisplayItems.find(item => item.id === displayId);
      if (!displayItem || !displayItem.editedPrices) {
        return;
      }

      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('Authentication token not found', 'error');
        return;
      }

      const response = await fetch(`${apiUrls.home.getHomeDisplayPrices(displayId)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          displayId,
          pricing: displayItem.editedPrices
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update home display prices');
      }

      const result = await response.json();
      
      if (result.success) {
        showToast('Home display prices updated successfully', 'success');
        
        // Update local state with the edited prices
        setFilteredDisplayItems(prev => 
          prev.map(item => {
            if (item.id === displayId) {
              return {
                ...item,
                isEditing: false,
                prices: item.editedPrices || item.prices
              };
            }
            return item;
          })
        );
      } else {
        showToast(result.message || 'Failed to update home display prices', 'error');
      }
    } catch (error) {
      console.error('Error updating home display prices:', error);
      showToast('Failed to update home display prices', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel editing for a home display item
  const cancelEditing = (displayId: string) => {
    setFilteredDisplayItems(prev => 
      prev.map(item => {
        if (item.id === displayId) {
          return {
            ...item,
            isEditing: false,
            editedPrices: undefined
          };
        }
        return item;
      })
    );
  };

  // Handle price change for a home display item
  const handlePriceChange = (displayId: string, priceIndex: number, updatedPrice: HomeDisplayPricingItem) => {
    setFilteredDisplayItems(prev => 
      prev.map(item => {
        if (item.id === displayId && item.editedPrices) {
          const newPrices = [...item.editedPrices];
          newPrices[priceIndex] = {
            ...updatedPrice,
            prices: {
              individual: updatedPrice.prices.individual,
              batch: updatedPrice.prices.batch
            },
            discounts: {
              earlyBird: updatedPrice.discounts.earlyBird,
              group: updatedPrice.discounts.group
            },
            batchSize: {
              min: updatedPrice.batchSize.min,
              max: updatedPrice.batchSize.max
            },
            status: updatedPrice.status
          };
          return {
            ...item,
            editedPrices: newPrices
          };
        }
        return item;
      })
    );
  };

  // Add a new price option for a home display item
  const handleAddPriceOption = (displayId: string) => {
    setFilteredDisplayItems(prev => 
      prev.map(item => {
        if (item.id === displayId && item.editedPrices) {
          // Determine which currencies are already used
          const existingCurrencies = item.editedPrices.map(price => price.currency);
          
          // Find the first available currency
          const availableCurrency = currencies.find(curr => !existingCurrencies.includes(curr)) || 'USD';
          
          const newPrice: HomeDisplayPricingItem = {
            currency: availableCurrency,
            prices: {
              individual: '0.00',
              batch: '0.00'
            },
            discounts: {
              earlyBird: 'N/A',
              group: 'N/A'
            },
            batchSize: {
              min: 2,
              max: 10
            },
            status: 'Active'
          };
          
          return {
            ...item,
            editedPrices: [...item.editedPrices, newPrice]
          };
        }
        return item;
      })
    );
  };

  // Remove a price option for a home display item
  const handleRemovePriceOption = (displayId: string, priceIndex: number) => {
    setFilteredDisplayItems(prev => 
      prev.map(item => {
        if (item.id === displayId && item.editedPrices) {
          const newPrices = [...item.editedPrices];
          newPrices.splice(priceIndex, 1);
          return {
            ...item,
            editedPrices: newPrices
          };
        }
        return item;
      })
    );
  };

  useEffect(() => {
    fetchHomeDisplays();
    // Use existing currency data instead of calling fetchCurrencies
    const fetchCurrenciesData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch(`${apiBaseUrl}/currencies`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) return;
        
        const data = await response.json();
        if (data.success && data.data.currencies) {
          const currencyCodes = data.data.currencies.map((curr: any) => curr.countryCode);
          setCurrencies(currencyCodes);
          
          // Update exchange rates
          const rates: CurrencyRates = {};
          data.data.currencies.forEach((curr: any) => {
            rates[curr.countryCode] = {
              symbol: curr.symbol || curr.countryCode,
              name: curr.country || curr.countryCode,
              rate: curr.valueWrtUSD || 1
            };
          });
          setCurrencyRates(rates);
        }
      } catch (error) {
        console.error('Error fetching currencies:', error);
      }
    };
    
    fetchCurrenciesData();
  }, [filterParams]);

  // Add missing functions
  const handleSelectAll = (checked: boolean) => {
    setSelectedAll(checked);
    setFilteredDisplayItems(prev => prev.map(item => ({ ...item, selected: checked })));
  };

  const handleSort = (field: 'title' | 'category') => {
    const direction = sortState.field === field && sortState.direction === 'asc' ? 'desc' : 'asc';
    setSortState({ field, direction });
    
    setFilteredDisplayItems(prev => 
      [...prev].sort((a, b) => {
        const aValue = field === 'title' ? a.title : a.category || '';
        const bValue = field === 'title' ? b.title : b.category || '';
        return direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      })
    );
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    setFilteredDisplayItems(prev => 
      prev.map(item => item.id === id ? { ...item, selected: checked } : item)
    );
    
    // Update selectedAll state
    const updatedItems = filteredDisplayItems.map(item => 
      item.id === id ? { ...item, selected: checked } : item
    );
    setSelectedAll(updatedItems.every(item => item.selected));
  };

  // Update handleBulkAddCurrencyPricing to use the new currency rates
  const handleBulkAddCurrencyPricing = async (currencyCode: string) => {
    try {
      if (!currencyCode) {
        showToast('Please select a currency', 'error');
        return;
      }

      setIsLoading(true);
      const currencyRate = currencyRates[currencyCode];
      if (!currencyRate) {
        showToast(`Currency rate not found for ${currencyCode}`, 'error');
        return;
      }

      // Filter items that don't have pricing in the selected currency
      const itemsNeedingPricing = filteredDisplayItems.filter(item => 
        !item.prices.some(price => price.currency === currencyCode)
      );

      if (itemsNeedingPricing.length === 0) {
        showToast(`All items already have pricing in ${currencyCode}`, 'success');
        setIsLoading(false);
        return;
      }

      // Create updates for these items
      const bulkUpdates = itemsNeedingPricing.map(item => {
        // Find USD price to use as base for conversion
        const usdPrice = item.prices.find(price => price.currency === 'USD');
        if (!usdPrice) return null;

        // Create new price based on USD
        const newPrice: HomeDisplayPricingItem = {
          currency: currencyCode,
          prices: {
            individual: (parseFloat(usdPrice.prices.individual) * currencyRate.rate).toFixed(2),
            batch: (parseFloat(usdPrice.prices.batch) * currencyRate.rate).toFixed(2)
          },
          discounts: {
            earlyBird: usdPrice.discounts.earlyBird,
            group: usdPrice.discounts.group
          },
          batchSize: {
            min: usdPrice.batchSize.min,
            max: usdPrice.batchSize.max
          },
          status: 'active'
        };

        return {
          displayId: item.id,
          prices: [...item.prices, newPrice]
        };
      }).filter(Boolean);

      if (bulkUpdates.length === 0) {
        showToast('No items found with USD pricing to convert from', 'error');
        setIsLoading(false);
        return;
      }

      // Call API to update prices
      const response = await fetch(apiUrls.home.bulkUpdateHomeDisplayPrices, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ updates: bulkUpdates })
      });

      if (!response.ok) {
        throw new Error('Failed to update prices');
      }

      const result = await response.json();
      if (result.success) {
        showToast(`Successfully added ${currencyCode} pricing to ${bulkUpdates.length} items`, 'success');
        fetchHomeDisplays(); // Refresh the list
      } else {
        showToast(result.message || 'Failed to update prices', 'error');
      }
    } catch (error) {
      console.error('Error in bulk adding currency pricing:', error);
      showToast('Failed to add currency pricing', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Add currency list display section
  const CurrencyList = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Object.entries(currencyRates).map(([code, currency]) => (
        <Card key={code} className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-lg">{code}</span>
            <span className="text-2xl">{currency.symbol}</span>
          </div>
          <div className="text-sm text-gray-600">{currency.name}</div>
          <div className="mt-2 text-sm font-medium">
            1 USD = {currency.rate.toFixed(2)} {code}
          </div>
        </Card>
      ))}
    </div>
  );

  // Add toggleRowExpansion function
  const toggleRowExpansion = (itemId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Currency List Section */}
      <CurrencyList />

      {/* Currency Rate Editor */}
      <Card>
        <CardHeader
          title="Bulk Add Course Pricing with Currency"
          subtitle="Update exchange rates and add new currencies"
        />
        <div className="p-6">
          <div className="space-y-4">
            {Object.entries(currencyRates).map(([code, rate]) => (
              <div key={code} className="flex items-center space-x-4">
                <div className="w-24">
                  <span className="font-medium">{code}</span>
                </div>
                <div className="flex-1">
                  <Input
                    value={rate.rate.toString()}
                    onChange={(value) => {
                      const newRates = { ...currencyRates };
                      newRates[code] = { ...rate, rate: parseFloat(value) };
                      handleCurrencyRateUpdate(newRates);
                    }}
                    type="number"
                    placeholder="Exchange rate"
                    disabled={isLoading}
                  />
                </div>
                <div className="w-24 text-sm text-gray-500">
                  {rate.symbol}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h4 className="text-base font-medium text-gray-900 mb-3">Bulk Add Display Item Pricing with Currency</h4>
            <div className="flex items-end gap-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Currency</label>
                <Select
                  value={selectedCurrencyForBulk}
                  onChange={(value) => setSelectedCurrencyForBulk(value)}
                  options={Object.entries(currencyRates).map(([code, currency]) => ({ value: code, label: `${code} (${currency.symbol})` }))}
                  placeholder="Select currency"
                />
                <p className="mt-1 text-xs text-gray-500">
                  This will add pricing based on USD prices converted to the selected currency
                </p>
              </div>
              <Button
                onClick={() => handleBulkAddCurrencyPricing(selectedCurrencyForBulk)}
                variant="success"
                disabled={!selectedCurrencyForBulk || isLoading}
              >
                Bulk Add Pricing
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {toastState.visible && (
        <Toast
          message={toastState.message}
          type={toastState.type}
          onClose={() => setToastState({ ...toastState, visible: false })}
        />
      )}
    </div>
  );
};

// Combine HomeDisplayPricing and AdminCourseFee in a single component
const AdminHomeDisplayTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pricing' | 'home-display'>('pricing');

  return (
    <div className="w-full">
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'pricing' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('pricing')}
        >
          Course Pricing
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'home-display' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('home-display')}
        >
          Home Display Pricing
        </button>
      </div>
      
      {activeTab === 'pricing' && <AdminCourseFee />}
      {activeTab === 'home-display' && <HomeDisplayPricing />}
    </div>
  );
};

export default AdminHomeDisplayTabs; 

