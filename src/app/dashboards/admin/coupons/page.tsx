"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Eye, 
  Copy, 
  Calendar, 
  Percent, 
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  Tag,
  Gift,
  TrendingUp,
  BarChart3,
  Download,
  Upload,
  RefreshCw,
  AlertCircle,
  Clock
} from 'lucide-react';
import useGetQuery from '@/hooks/getQuery.hook';
import usePostQuery from '@/hooks/postQuery.hook';
import useDeleteQuery from '@/hooks/deleteQuery.hook';

interface Coupon {
  _id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description?: string;
  minAmount?: number;
  maxDiscount?: number;
  validFrom?: string;
  validUntil?: string;
  usageLimit?: number;
  usedCount?: number;
  isActive: boolean;
  applicableCourses?: string[];
  excludedCourses?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface CouponFormData {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
  minAmount: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  isActive: boolean;
}

const CouponManagement: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');
  const [filterType, setFilterType] = useState<'all' | 'percentage' | 'fixed'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isEditModalAnimating, setIsEditModalAnimating] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [formData, setFormData] = useState<CouponFormData>({
    code: '',
    type: 'percentage',
    value: 0,
    description: '',
    minAmount: 0,
    maxDiscount: undefined,
    validFrom: '',
    validUntil: '',
    usageLimit: 100,
    isActive: true
  });

  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();
  const { deleteQuery } = useDeleteQuery();

  // Handle client-side mounting and initial data fetch
  useEffect(() => {
    setIsMounted(true);
    // Reset states on mount/refresh
    setError(null);
    setIsLoading(true);
    setIsRefreshing(false);
    
    // Fetch data after component is mounted
    fetchCoupons();

    // Fallback timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.warn('⏰ Loading timeout reached, forcing loading state to false');
      setIsLoading(false);
      if (!error) {
        setError('Loading took too long. Please refresh the page.');
      }
    }, 15000); // 15 seconds timeout

    return () => clearTimeout(loadingTimeout);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Handle window focus events to refresh data when user returns to page
  useEffect(() => {
    const handleFocus = () => {
      if (isMounted && !isLoading && !isRefreshing) {
        // Small delay to ensure page is fully focused
        setTimeout(() => {
          refreshCoupons();
        }, 500);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isMounted && !isLoading && !isRefreshing) {
        setTimeout(() => {
          refreshCoupons();
        }, 500);
      }
    };

    // Add event listeners only if mounted
    if (isMounted) {
      window.addEventListener('focus', handleFocus);
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isMounted, isLoading, isRefreshing]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ctrl/Cmd + R or F5 for manual refresh
      if ((event.ctrlKey || event.metaKey) && event.key === 'r' && !event.shiftKey) {
        event.preventDefault();
        if (isMounted && !isLoading && !isRefreshing) {
          refreshCoupons();
        }
      }
      // F5 for refresh
      if (event.key === 'F5') {
        event.preventDefault();
        if (isMounted && !isLoading && !isRefreshing) {
          refreshCoupons();
        }
      }
    };

    if (isMounted) {
      document.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isMounted, isLoading, isRefreshing]);

  // Fetch coupons from API
  const fetchCoupons = async () => {
    // Ensure we're in the browser environment
    if (typeof window === 'undefined') {
      return;
    }

    console.log('🔄 Starting to fetch coupons...');
    setIsLoading(true);
    setError(null);
    
    try {
      // Get auth token safely
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Only add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/coupons/validate', {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        throw new Error('Failed to fetch coupons');
      }

      const data = await response.json();
      console.log('📦 API Response:', data);
      
      if (data.success && data.coupons) {
        // Transform API response to match our Coupon interface
        const transformedCoupons: Coupon[] = data.coupons.map((coupon: any, index: number) => ({
          _id: coupon._id || `api-${index}`,
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
          description: coupon.description || '',
          minAmount: coupon.minAmount || 0,
          maxDiscount: coupon.maxDiscount,
          validFrom: coupon.validFrom || new Date().toISOString().split('T')[0],
          validUntil: coupon.validUntil || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          usageLimit: coupon.usageLimit || 100,
          usedCount: coupon.usedCount || 0,
          isActive: coupon.isActive !== undefined ? coupon.isActive : true,
          applicableCourses: coupon.applicableCourses || [],
          excludedCourses: coupon.excludedCourses || [],
          createdAt: coupon.createdAt || new Date().toISOString(),
          updatedAt: coupon.updatedAt || new Date().toISOString()
        }));

        setCoupons(transformedCoupons);
        setFilteredCoupons(transformedCoupons);
        console.log('✅ Successfully loaded', transformedCoupons.length, 'coupons from API');
      } else {
        // Fallback to mock data if API doesn't return expected format
        console.warn('API response format unexpected, using fallback data');
        const fallbackCoupons = await getFallbackCoupons();
        setCoupons(fallbackCoupons);
        setFilteredCoupons(fallbackCoupons);
        console.log('⚠️ Using fallback data with', fallbackCoupons.length, 'coupons');
      }
    } catch (error: any) {
      console.error('Error fetching coupons:', error);
      setError(error.message || 'Failed to fetch coupons');
      
      // Always try to load fallback data on error
      try {
        const fallbackCoupons = await getFallbackCoupons();
        setCoupons(fallbackCoupons);
        setFilteredCoupons(fallbackCoupons);
        console.log('🔄 Using fallback data after error with', fallbackCoupons.length, 'coupons');
      } catch (fallbackError) {
        console.error('Error loading fallback data:', fallbackError);
        setCoupons([]);
        setFilteredCoupons([]);
      }
    } finally {
      // Always update loading state to prevent infinite loading
      setIsLoading(false);
      console.log('🏁 Finished fetching coupons, loading state set to false');
    }
  };

  // Fallback coupon data (based on the route.ts mock data)
  const getFallbackCoupons = async (): Promise<Coupon[]> => {
    return [
      {
        _id: '1',
        code: 'WELCOME10',
        type: 'percentage',
        value: 10,
        description: '10% off for new students',
        minAmount: 100,
        maxDiscount: 1000,
        validFrom: '2024-01-01',
        validUntil: '2024-12-31',
        usageLimit: 1000,
        usedCount: 50,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        _id: '2',
        code: 'SAVE500',
        type: 'fixed',
        value: 500,
        description: '₹500 off on any course',
        minAmount: 2000,
        validFrom: '2024-01-01',
        validUntil: '2024-06-30',
        usageLimit: 500,
        usedCount: 25,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        _id: '3',
        code: 'STUDENT25',
        type: 'percentage',
        value: 25,
        description: '25% off for students',
        minAmount: 500,
        maxDiscount: 2000,
        validFrom: '2024-01-01',
        validUntil: '2024-12-31',
        usageLimit: 200,
        usedCount: 75,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        _id: '4',
        code: 'EARLYBIRD',
        type: 'percentage',
        value: 15,
        description: 'Early bird special - 15% off',
        minAmount: 1000,
        maxDiscount: 1500,
        validFrom: '2024-01-01',
        validUntil: '2024-12-31',
        usageLimit: 300,
        usedCount: 120,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        _id: '5',
        code: 'TESTMODE',
        type: 'fixed',
        value: 100,
        description: 'Test coupon for development',
        minAmount: 1,
        validFrom: '2024-01-01',
        validUntil: '2024-12-31',
        usageLimit: 999,
        usedCount: 0,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        _id: '6',
        code: 'WELCOME50',
        type: 'percentage',
        value: 50,
        description: '50% off welcome discount for test users',
        minAmount: 1,
        maxDiscount: 5000,
        validFrom: '2024-01-01',
        validUntil: '2024-12-31',
        usageLimit: 100,
        usedCount: 0,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ];
  };

  // Filter coupons based on search and filters
  useEffect(() => {
    let filtered = coupons;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(coupon => 
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      const now = new Date();
      filtered = filtered.filter(coupon => {
        switch (filterStatus) {
          case 'active':
            return coupon.isActive && new Date(coupon.validUntil || '') > now;
          case 'inactive':
            return !coupon.isActive;
          case 'expired':
            return new Date(coupon.validUntil || '') <= now;
          default:
            return true;
        }
      });
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(coupon => coupon.type === filterType);
    }

    setFilteredCoupons(filtered);
  }, [coupons, searchTerm, filterStatus, filterType]);

  // Refresh data function
  const refreshCoupons = async () => {
    // Prevent refresh if component is not mounted
    if (!isMounted) return;
    
    setIsRefreshing(true);
    setError(null); // Clear any existing errors
    
    try {
      await fetchCoupons();
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      if (isMounted) {
        setIsRefreshing(false);
      }
    }
  };

  const handleAddCoupon = async () => {
    try {
      // TODO: Implement POST API endpoint for creating coupons
      // For now, simulate API call and update local state
      console.log('Adding coupon:', formData);
      
      const newCoupon: Coupon = {
        _id: `new-${Date.now()}`,
        ...formData,
        usedCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add to local state (in real implementation, this would be handled by API response)
      setCoupons(prevCoupons => [...prevCoupons, newCoupon]);
      setShowAddModal(false);
      resetForm();

      // Show success message
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(newCoupon.code);
      }
      
      // TODO: Add toast notification
      console.log(`Coupon ${newCoupon.code} created successfully!`);
    } catch (error) {
      console.error('Error adding coupon:', error);
      // TODO: Add error toast notification
    }
  };

  const handleEditCoupon = async () => {
    if (!selectedCoupon || isSubmittingEdit) return;
    
    setIsSubmittingEdit(true);
    
    try {
      // TODO: Implement PUT API endpoint for updating coupons
      console.log('Editing coupon:', formData);
      
      // Add small delay to prevent flashing
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedCoupons = coupons.map(coupon =>
        coupon._id === selectedCoupon._id
          ? { ...coupon, ...formData, updatedAt: new Date().toISOString() }
          : coupon
      );
      
      setCoupons(updatedCoupons);
      
      // Smooth modal close with animation
      setIsEditModalAnimating(true);
      setTimeout(() => {
        setShowEditModal(false);
        setSelectedCoupon(null);
        setIsEditModalAnimating(false);
        resetForm();
      }, 200);
      
      // TODO: Add success toast notification
      console.log(`Coupon ${formData.code} updated successfully!`);
    } catch (error) {
      console.error('Error editing coupon:', error);
      // TODO: Add error toast notification
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    const couponToDelete = coupons.find(c => c._id === couponId);
    if (!couponToDelete) return;

    const confirmMessage = `Are you sure you want to delete coupon "${couponToDelete.code}"? This action cannot be undone.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        // TODO: Implement DELETE API endpoint
        console.log('Deleting coupon:', couponId);
        
        setCoupons(prevCoupons => prevCoupons.filter(coupon => coupon._id !== couponId));
        
        // TODO: Add success toast notification
        console.log(`Coupon ${couponToDelete.code} deleted successfully!`);
      } catch (error) {
        console.error('Error deleting coupon:', error);
        // TODO: Add error toast notification
      }
    }
  };

  const toggleCouponStatus = async (couponId: string) => {
    try {
      // TODO: Implement PATCH API endpoint for status toggle
      const couponToToggle = coupons.find(c => c._id === couponId);
      if (!couponToToggle) return;

      console.log('Toggling coupon status:', couponId);
      
      const updatedCoupons = coupons.map(coupon =>
        coupon._id === couponId
          ? { ...coupon, isActive: !coupon.isActive, updatedAt: new Date().toISOString() }
          : coupon
      );
      
      setCoupons(updatedCoupons);
      
      const newStatus = !couponToToggle.isActive ? 'activated' : 'deactivated';
      // TODO: Add success toast notification
      console.log(`Coupon ${couponToToggle.code} ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error toggling coupon status:', error);
      // TODO: Add error toast notification
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'percentage',
      value: 0,
      description: '',
      minAmount: 0,
      maxDiscount: undefined,
      validFrom: '',
      validUntil: '',
      usageLimit: 100,
      isActive: true
    });
  };

  // Wrapper function to handle form submission safely and prevent flashing
  const handleSafeSubmit = async (submitFn: () => Promise<void>) => {
    if (isSubmittingEdit) return; // Prevent double submission
    
    try {
      await submitFn();
    } catch (error) {
      console.error('Form submission error:', error);
      setIsSubmittingEdit(false);
      setIsEditModalAnimating(false);
    }
  };

  const openEditModal = (coupon: Coupon) => {
    // Prevent opening if already animating
    if (isEditModalAnimating || isSubmittingEdit) return;
    
    setSelectedCoupon(coupon);
    
    // Pre-populate form data with proper formatting
    const editFormData = {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      description: coupon.description || '',
      minAmount: coupon.minAmount || 0,
      maxDiscount: coupon.maxDiscount,
      validFrom: coupon.validFrom ? coupon.validFrom.split('T')[0] : new Date().toISOString().split('T')[0],
      validUntil: coupon.validUntil ? coupon.validUntil.split('T')[0] : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      usageLimit: coupon.usageLimit || 100,
      isActive: coupon.isActive
    };
    
    setFormData(editFormData);
    
    // Smooth modal opening
    requestAnimationFrame(() => {
      setShowEditModal(true);
    });
  };

  const copyCouponCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      // TODO: Add toast notification
      console.log(`Coupon code "${code}" copied to clipboard!`);
    } catch (error) {
      console.error('Failed to copy coupon code:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        console.log(`Coupon code "${code}" copied to clipboard!`);
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
      }
      document.body.removeChild(textArea);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCouponStatus = (coupon: Coupon) => {
    if (!coupon.isActive) return 'inactive';
    const now = new Date();
    const expiryDate = new Date(coupon.validUntil || '');
    if (expiryDate <= now) return 'expired';
    return 'active';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'inactive':
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
      case 'expired':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  const CouponModal = ({ isOpen, onClose, title, onSubmit }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    onSubmit: () => void;
  }) => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isEditModalAnimating ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSubmittingEdit) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ 
              scale: isEditModalAnimating ? 0.95 : 1, 
              opacity: isEditModalAnimating ? 0 : 1 
            }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
              <button
                onClick={onClose}
                disabled={isSubmittingEdit}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XCircle className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Coupon Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => {
                    if (!isSubmittingEdit) {
                      setFormData({ ...formData, code: e.target.value.toUpperCase() });
                    }
                  }}
                  placeholder="Enter coupon code (e.g., SAVE20)"
                  disabled={isSubmittingEdit}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>

              {/* Coupon Type and Value */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Discount Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      if (!isSubmittingEdit) {
                        setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' });
                      }
                    }}
                    disabled={isSubmittingEdit}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {formData.type === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'} *
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                    placeholder={formData.type === 'percentage' ? '10' : '500'}
                    min="0"
                    max={formData.type === 'percentage' ? '100' : undefined}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter coupon description"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Minimum Amount and Max Discount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Order Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.minAmount}
                    onChange={(e) => setFormData({ ...formData, minAmount: parseFloat(e.target.value) || 0 })}
                    placeholder="1000"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {formData.type === 'percentage' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Maximum Discount (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.maxDiscount || ''}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: parseFloat(e.target.value) || undefined })}
                      placeholder="2000"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                )}
              </div>

              {/* Valid From and Valid Until */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Valid From *
                  </label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Valid Until *
                  </label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              {/* Usage Limit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Usage Limit
                </label>
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) || 100 })}
                  placeholder="100"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Active (coupon can be used immediately)
                </label>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                disabled={isSubmittingEdit}
                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                disabled={isSubmittingEdit && selectedCoupon !== null}
                className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmittingEdit && selectedCoupon !== null ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  selectedCoupon ? 'Update Coupon' : 'Create Coupon'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Show loading screen during initial load or if not mounted yet
  if (isLoading || !isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <RefreshCw className="w-8 h-8 animate-spin text-primary-600" />
            <p className="text-gray-600 dark:text-gray-400">
              {!isMounted ? 'Initializing...' : 'Loading coupons...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Coupon Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Create and manage discount coupons for your courses
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={refreshCoupons}
              disabled={isLoading || isRefreshing}
              className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-5 h-5 ${(isLoading || isRefreshing) ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add New Coupon
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error Loading Coupons
                </h3>
                                 <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                   {error}. Using fallback data instead.
                 </p>
               </div>
               <div className="flex gap-2 ml-auto">
                 <button
                   onClick={refreshCoupons}
                   disabled={isLoading || isRefreshing}
                   className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 disabled:opacity-50"
                   title="Retry"
                 >
                   <RefreshCw className={`w-5 h-5 ${(isLoading || isRefreshing) ? 'animate-spin' : ''}`} />
                 </button>
                 <button
                   onClick={() => setError(null)}
                   className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                   title="Dismiss"
                 >
                   <XCircle className="w-5 h-5" />
                 </button>
               </div>
            </div>
          </div>
        )}

        {/* Background Refresh Indicator */}
        {isRefreshing && !isLoading && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Refreshing coupon data...
              </p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Coupons</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{coupons.length}</p>
              </div>
              <Tag className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Coupons</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {coupons.filter(c => getCouponStatus(c) === 'active').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Uses</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {coupons.reduce((sum, coupon) => sum + (coupon.usedCount || 0), 0)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Expired</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {coupons.filter(c => getCouponStatus(c) === 'expired').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by coupon code or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </select>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Types</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>
        </div>

        {/* Coupons Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Coupon
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type & Value
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Validity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCoupons.map((coupon) => {
                  const status = getCouponStatus(coupon);
                  const usagePercentage = coupon.usageLimit ? (coupon.usedCount || 0) / coupon.usageLimit * 100 : 0;
                  
                  return (
                    <tr key={coupon._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      {/* Coupon Info */}
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {coupon.code}
                            </span>
                            <button
                              onClick={() => copyCouponCode(coupon.code)}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                            >
                              <Copy className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {coupon.description || 'No description'}
                          </p>
                        </div>
                      </td>

                      {/* Type & Value */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {coupon.type === 'percentage' ? (
                            <Percent className="w-4 h-4 text-blue-500" />
                          ) : (
                            <DollarSign className="w-4 h-4 text-green-500" />
                          )}
                          <span className="font-medium">
                            {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                          </span>
                        </div>
                        {coupon.minAmount && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Min: ₹{coupon.minAmount}
                          </p>
                        )}
                        {coupon.maxDiscount && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Max: ₹{coupon.maxDiscount}
                          </p>
                        )}
                      </td>

                      {/* Validity */}
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-gray-900 dark:text-white">
                            {coupon.validFrom ? formatDate(coupon.validFrom) : 'No start date'}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400">
                            to {coupon.validUntil ? formatDate(coupon.validUntil) : 'No end date'}
                          </p>
                        </div>
                      </td>

                      {/* Usage */}
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-900 dark:text-white">
                              {coupon.usedCount || 0} / {coupon.usageLimit || 'Unlimited'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {Math.round(usagePercentage)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(coupon)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4 text-gray-500" />
                          </button>
                          <button
                            onClick={() => toggleCouponStatus(coupon._id)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          >
                            {coupon.isActive ? (
                              <XCircle className="w-4 h-4 text-red-500" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteCoupon(coupon._id)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredCoupons.length === 0 && (
            <div className="text-center py-12">
              <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No coupons found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                  ? 'Try adjusting your filters or search terms.'
                  : 'Create your first coupon to get started.'}
              </p>
            </div>
          )}
        </div>

        {/* Add/Edit Coupon Modal */}
        <CouponModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Coupon"
          onSubmit={handleAddCoupon}
        />

        <CouponModal
          isOpen={showEditModal}
          onClose={() => {
            if (!isSubmittingEdit) {
              setIsEditModalAnimating(true);
              setTimeout(() => {
                setShowEditModal(false);
                setSelectedCoupon(null);
                setIsEditModalAnimating(false);
                resetForm();
              }, 150);
            }
          }}
          title="Edit Coupon"
          onSubmit={() => handleSafeSubmit(handleEditCoupon)}
        />
      </div>
    </div>
  );
};

export default CouponManagement; 