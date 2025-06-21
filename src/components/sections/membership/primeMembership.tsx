"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Crown, Star, ArrowRight, CheckCircle, AlertCircle, X, Loader2, Sparkles, Gift, Shield } from "lucide-react";
import dynamic from "next/dynamic";

// Lazy load heavy components to reduce initial bundle size
const SelectCourseModal = dynamic(() => import("@/components/layout/main/dashboards/SelectCourseModal"), {
  loading: () => <div className="fixed inset-0 bg-black/50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-white" /></div>,
  ssr: false
});

const LoginForm = dynamic(() => import("@/components/shared/login/LoginForm"), {
  loading: () => <div className="p-8 bg-white rounded-lg"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>,
  ssr: false
});

const MembershipBanner = dynamic(() => import("./membershipBanner"), {
  loading: () => <div className="h-64 bg-gradient-to-r from-blue-50 to-violet-50 animate-pulse" />,
  ssr: true
});
// Note: Design system utilities may not be available, using fallback styling

// Import membership APIs
import {
  getMembershipPricing,
  getMembershipBenefits,
  createMembershipEnrollment,
  calculateMembershipPricing,
  formatMembershipDuration,
  getBillingCycleFromDuration,
  validateMembershipEnrollmentData,
  type TMembershipType,
  type TBillingCycle,
  type IMembershipPricing,
  type IMembershipBenefits,
  type IMembershipEnrollmentInput
} from "@/apis/membership";

// TypeScript interfaces
interface IPlan {
  duration: string;
  price: string;
  period: string;
  duration_months: number;
  billing_cycle: string;
  original_price?: string;
  savings?: string;
}

interface IMembershipData {
  type: TMembershipType;
  icon: React.ReactNode;
  color: 'primary' | 'amber';
  plans: IPlan[];
  description: string;
  features: string[];
  benefits?: IMembershipBenefits;
}

// Enhanced modal state interface
interface IModalState {
  isSelectCourseModalOpen: boolean;
  isLoginModalOpen: boolean;
  selectedMembershipType: TMembershipType | "";
  selectedSilverPlan: string;
  selectedGoldPlan: string;
  enrollmentLoading: boolean;
  modalError: string | null;
}

// Enhanced props for SelectCourseModal
interface IEnhancedSelectCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  planType: TMembershipType;
  amount: string;
  selectedPlan: string;
  closeParent: () => void;
  membershipData: IMembershipData;
  onEnrollmentSuccess: (enrollmentData: any) => void;
  onEnrollmentError: (error: string) => void;
  maxSelections: number;
  isLoading?: boolean;
}

// Fallback static data in case API fails
const getStaticMembershipData = (): IMembershipData[] => [
  {
    type: "silver" as TMembershipType,
    icon: <Star className="w-6 h-6" />,
    color: "primary",
    plans: [
      { duration: "MONTHLY", price: "INR 999.00", period: "per month", duration_months: 1, billing_cycle: "monthly" },
      { duration: "QUARTERLY", price: "INR 2,499.00", period: "per 3 months", duration_months: 3, billing_cycle: "quarterly" },
      { duration: "HALF-YEARLY", price: "INR 3,999.00", period: "per 6 months", duration_months: 6, billing_cycle: "half_yearly" },
      { duration: "ANNUALLY", price: "INR 4,999.00", period: "per annum", duration_months: 12, billing_cycle: "annually" },
    ],
    description: "Ideal for focused skill development. Explore and learn all self-paced blended courses within any 'Single-Category' of your preference.",
    features: [
      "Access to LIVE Q&A Doubt Clearing Sessions",
      "Special discount on all live courses", 
      "Community access",
      "Access to free courses",
      "Placement Assistance"
    ]
  },
  {
    type: "gold" as TMembershipType,
    icon: <Crown className="w-6 h-6" />,
    color: "amber",
    plans: [
      { duration: "MONTHLY", price: "INR 1,999.00", period: "per month", duration_months: 1, billing_cycle: "monthly" },
      { duration: "QUARTERLY", price: "INR 3,999.00", period: "per 3 months", duration_months: 3, billing_cycle: "quarterly" },
      { duration: "HALF-YEARLY", price: "INR 5,999.00", period: "per 6 months", duration_months: 6, billing_cycle: "half_yearly" },
      { duration: "ANNUALLY", price: "INR 6,999.00", period: "per annum", duration_months: 12, billing_cycle: "annually" },
    ],
    description: "Perfect for diverse skill acquisition. Explore and learn all self-paced blended courses within any '03-Categories' of your preference.",
    features: [
      "Access to LIVE Q&A Doubt Clearing Sessions",
      "Minimum 15% discount on all live courses",
      "Community access", 
      "Access to free courses",
      "Career Counselling",
      "Placement Assistance"
    ]
  }
];

const PrimeMembership: React.FC = () => {
  // State management - Consolidated modal state
  const [membershipData, setMembershipData] = useState<IMembershipData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Enhanced modal state management
  const [modalState, setModalState] = useState<IModalState>({
    isSelectCourseModalOpen: false,
    isLoginModalOpen: false,
    selectedMembershipType: "",
    selectedSilverPlan: "MONTHLY",
    selectedGoldPlan: "MONTHLY",
    enrollmentLoading: false,
    modalError: null
  });

  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Memoize static data to prevent unnecessary recalculations
  const staticMembershipData = useMemo(() => getStaticMembershipData(), []);

  // Fetch membership data on component mount
  useEffect(() => {
    const fetchMembershipData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch pricing data
        const pricingResponse = await getMembershipPricing();

        if (pricingResponse.status !== 'success') {
          throw new Error(pricingResponse.error || 'Failed to fetch pricing');
        }

        const pricingData = pricingResponse.data?.pricing;
        console.log('Pricing data received:', pricingData);

        if (!pricingData) {
          console.warn('No pricing data available from API, using fallback data');
          // Use fallback data instead of throwing error
          setMembershipData(staticMembershipData);
          return;
        }

        // Extract features from API data
        const silverFeatures = pricingData.silver?.monthly?.features || [];
        const goldFeatures = pricingData.gold?.monthly?.features || [];

        // Transform API data to component format
        const transformedData: IMembershipData[] = [
          {
            type: "silver" as TMembershipType,
            icon: <Star className="w-6 h-6" />,
            color: "primary",
            plans: transformPlansData("silver", pricingData),
            description: "Ideal for focused skill development. Access to all self-paced blended courses within any Single-Category.",
            features: silverFeatures,
            benefits: undefined // We'll fetch benefits separately if needed
          },
          {
            type: "gold" as TMembershipType,
            icon: <Crown className="w-6 h-6" />,
            color: "amber",
            plans: transformPlansData("gold", pricingData),
            description: "Perfect for diverse skill acquisition. Access to all self-paced blended courses within any 03-Categories.",
            features: goldFeatures,
            benefits: undefined // We'll fetch benefits separately if needed
          }
        ];

        setMembershipData(transformedData);
      } catch (err) {
        console.error('Error fetching membership data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load membership data');
        
        // Fallback to static data
        setMembershipData(staticMembershipData);
      } finally {
        setLoading(false);
      }
    };

    fetchMembershipData();
  }, [staticMembershipData]);

  // Transform pricing data from API to component format
  const transformPlansData = (membershipType: TMembershipType, pricingData: any): IPlan[] => {
    if (!pricingData || !pricingData[membershipType]) {
      return [];
    }

    const plans = pricingData[membershipType];
    const durationMap: { [key: string]: { duration: string, months: number, billing: string } } = {
      monthly: { duration: "MONTHLY", months: 1, billing: "monthly" },
      quarterly: { duration: "QUARTERLY", months: 3, billing: "quarterly" },
      half_yearly: { duration: "HALF-YEARLY", months: 6, billing: "half_yearly" },
      annual: { duration: "ANNUALLY", months: 12, billing: "annually" }
    };

    return Object.entries(plans).map(([key, plan]: [string, any]) => {
      const durationInfo = durationMap[key];
      if (!durationInfo || !plan) return null;

      // Calculate savings compared to monthly
      const monthlyAmount = plans.monthly?.amount || 0;
      const totalMonthlyPrice = monthlyAmount * durationInfo.months;
      const currentPrice = plan.amount;
      const savings = durationInfo.months > 1 ? totalMonthlyPrice - currentPrice : 0;
      
      return {
        duration: durationInfo.duration,
        price: `INR ${plan.amount.toLocaleString()}.00`,
        period: getPeriodText(durationInfo.months),
        duration_months: durationInfo.months,
        billing_cycle: durationInfo.billing,
        original_price: undefined, // API doesn't provide original price
        savings: savings > 0 ? `Save INR ${savings.toLocaleString()}` : undefined
      };
    }).filter(Boolean) as IPlan[];
  };

  // Get period text for display
  const getPeriodText = (durationMonths: number): string => {
    switch (durationMonths) {
      case 1: return "per month";
      case 3: return "per 3 months";
      case 6: return "per 6 months";
      case 12: return "per annum";
      default: return `per ${durationMonths} months`;
    }
  };

  // Enhanced helper functions with better error handling
  const getSelectedPlanPrice = useCallback((): string => {
    try {
      const membership = membershipData.find(m => m.type === modalState.selectedMembershipType);
      if (!membership) return "0";
      
      const selectedPlanDuration = modalState.selectedMembershipType === 'silver' ? modalState.selectedSilverPlan : modalState.selectedGoldPlan;
      const selectedPlan = membership.plans.find(p => p.duration === selectedPlanDuration);
      
      if (!selectedPlan) return "0";
      const numeric = parseFloat(selectedPlan.price.replace(/[^0-9.]/g, ''));
      return isNaN(numeric) ? "0" : numeric.toString();
    } catch (error) {
      console.error('Error getting selected plan price:', error);
      return "0";
    }
  }, [membershipData, modalState.selectedMembershipType, modalState.selectedSilverPlan, modalState.selectedGoldPlan]);

  const getSelectedPlanName = useCallback((): string => {
    try {
      return modalState.selectedMembershipType === 'silver' ? modalState.selectedSilverPlan : modalState.selectedGoldPlan;
    } catch (error) {
      console.error('Error getting selected plan name:', error);
      return "MONTHLY";
    }
  }, [modalState.selectedMembershipType, modalState.selectedSilverPlan, modalState.selectedGoldPlan]);

  // Validate modal state before opening
  const canOpenSelectCourseModal = useCallback((membershipType: string): boolean => {
    if (!membershipType) return false;
    if (modalState.enrollmentLoading) return false;
    if (loading) return false;
    
    const membership = membershipData.find(m => m.type === membershipType);
    return membership !== undefined && membership.plans.length > 0;
  }, [membershipData, modalState.enrollmentLoading, loading]);

  // Memoize functions to prevent unnecessary re-renders
  const checkUserLogin = useCallback((): boolean => {
    const userId = localStorage.getItem("userId");
    return userId !== null;
  }, []);

  const handleSelectCourseModal = useCallback((membershipType: string): void => {
    // Enhanced validation before opening modal
    if (!checkUserLogin()) {
      setModalState(prev => ({ ...prev, isLoginModalOpen: true }));
      return;
    }
    
    if (!canOpenSelectCourseModal(membershipType)) {
      const errorMsg = loading 
        ? 'Please wait for plans to load' 
        : modalState.enrollmentLoading 
        ? 'Please wait for current enrollment to complete'
        : 'Invalid membership type selected';
      
      setModalState(prev => ({ ...prev, modalError: errorMsg }));
      return;
    }
    
    setModalState(prev => ({ 
      ...prev, 
      selectedMembershipType: membershipType as TMembershipType,
      isSelectCourseModalOpen: true,
      modalError: null
    }));
  }, [checkUserLogin, canOpenSelectCourseModal, loading, modalState.enrollmentLoading]);

  const handleMembershipChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
    const membership = e.target.value;
    if (membership) {
      handleSelectCourseModal(membership);
    }
  }, [handleSelectCourseModal]);

  const handlePlanSelection = useCallback((membershipType: string, planDuration: string): void => {
    setModalState(prev => ({ ...prev, selectedMembershipType: membershipType as TMembershipType }));
    
    if (membershipType === "silver") {
      setModalState(prev => ({ ...prev, selectedSilverPlan: planDuration }));
    } else if (membershipType === "gold") {
      setModalState(prev => ({ ...prev, selectedGoldPlan: planDuration }));
    }
  }, []);

  // Enhanced enrollment handler with better error handling
  const handleEnrollment = useCallback(async (membershipType: TMembershipType, selectedCategories: string[] = []) => {
    try {
      setModalState(prev => ({ ...prev, enrollmentLoading: true, modalError: null }));

      // Validate user authentication
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      
      if (!userId || !token) {
        throw new Error('Please log in to continue with enrollment');
      }

      // Get selected plan details
      const membership = membershipData.find(m => m.type === membershipType);
      if (!membership) throw new Error('Membership type not found');

      const selectedPlanDuration = membershipType === 'silver' ? modalState.selectedSilverPlan : modalState.selectedGoldPlan;
      const selectedPlan = membership.plans.find(p => p.duration === selectedPlanDuration);
      if (!selectedPlan) throw new Error('Selected plan not found');

      // Validate category selection
      const maxCategories = membershipType === 'silver' ? 1 : 3;
      if (selectedCategories.length === 0) {
        throw new Error('Please select at least one category');
      }
      if (selectedCategories.length > maxCategories) {
        throw new Error(`${membershipType === 'silver' ? 'Silver' : 'Gold'} membership allows up to ${maxCategories} categories`);
      }

      // Create enrollment data with proper validation
      const enrollmentData: IMembershipEnrollmentInput = {
        membership_type: membershipType,
        duration_months: selectedPlan.duration_months,
        billing_cycle: selectedPlan.billing_cycle as TBillingCycle,
        auto_renewal: true,
        selected_categories: selectedCategories,
        payment_info: {
          amount: parseInt(selectedPlan.price.replace(/[^\d]/g, '')),
          currency: 'INR',
          payment_method: 'upi',
          transaction_id: `TXN${Date.now()}_${userId}`
        }
      };

      // Validate enrollment data
      const validation = validateMembershipEnrollmentData(enrollmentData);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Create enrollment
      const response = await createMembershipEnrollment(enrollmentData);
      
      if (response.status === 'success') {
        // Show success message with details
        const enrollmentDetails = response.data?.enrollment;
        const successMessage = `Successfully enrolled in ${membershipType.toUpperCase()} membership for ${selectedPlan.duration_months} months!`;
        
        alert(successMessage);
        
        // Close modal and reset state
        setModalState(prev => ({ 
          ...prev, 
          isSelectCourseModalOpen: false,
          modalError: null,
          enrollmentLoading: false
        }));
        
        // Redirect to membership dashboard
        window.location.href = '/dashboards/student-membership';
      } else {
        throw new Error(response.error || 'Enrollment failed. Please try again.');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to enroll in membership. Please try again.';
      
      setModalState(prev => ({ ...prev, modalError: errorMessage }));
      alert(errorMessage);
    } finally {
      setModalState(prev => ({ ...prev, enrollmentLoading: false }));
    }
  }, [membershipData, modalState.selectedSilverPlan, modalState.selectedGoldPlan]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-lg text-slate-600 dark:text-slate-400">Loading membership plans...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && membershipData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Failed to Load Membership Plans</h2>
          <p className="text-slate-600 dark:text-slate-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Membership Banner */}
      <MembershipBanner />
      
      {/* Membership Plans Section */}
      <section className="bg-slate-50 dark:bg-slate-950 min-h-screen relative overflow-hidden">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>
        
        {/* Professional Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-violet-50/30 dark:from-blue-950/10 dark:via-transparent dark:to-violet-950/10"></div>
        
        {/* Floating Orbs with Professional Colors */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/10 dark:bg-blue-800/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-violet-200/10 dark:bg-violet-800/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-36 h-36 bg-emerald-200/10 dark:bg-emerald-800/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

        <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-12 z-10">
          {/* Professional Header Card */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-600/50 shadow-xl p-6 md:p-8 mb-6 md:mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 rounded-2xl mr-4">
                  <Crown className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <h1 id="choose-membership" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                Choose Your <span className="text-medhgreen dark:text-medhgreen">MEDH</span> Membership
              </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Professional Learning Plans
                  </p>
                </div>
              </div>
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-4">
                Select the perfect membership plan that aligns with your learning goals and unlock premium features designed for professional growth.
              </p>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>7-day money-back guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-violet-500" />
                  <span>Instant access</span>
                </div>
              </div>
              
              {error && (
                <div className="mt-4 p-3 bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg backdrop-blur-sm">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <AlertCircle className="w-4 h-4 inline mr-2" />
                    Using cached data due to connection issues. Some features may be limited.
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Professional Membership Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
            {membershipData.map((membership: IMembershipData, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-600/50 shadow-xl hover:shadow-2xl hover-lift-gpu hover-scale-gpu transition-gpu cursor-pointer overflow-hidden min-h-[44px] touch-manipulation gpu-accelerated"
              >
                {/* Professional Header */}
                <div className={`p-4 sm:p-6 lg:p-8 ${
                  membership.type === 'gold' 
                    ? 'bg-gradient-to-r from-amber-50/30 to-orange-50/30 dark:from-amber-950/10 dark:to-orange-950/10' 
                    : 'bg-gradient-to-r from-blue-50/30 to-violet-50/30 dark:from-blue-950/10 dark:to-violet-950/10'
                } backdrop-blur-sm`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 backdrop-blur-sm ${
                      membership.type === 'gold'
                        ? 'bg-amber-100/50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                        : 'bg-blue-100/50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    }`}>
                      <div className="transition-all duration-300 group-hover:scale-110">
                        {membership.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight transition-colors duration-300">
                        {membership.type.charAt(0).toUpperCase() + membership.type.slice(1)}
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {membership.type === 'gold' ? 'Multi-Skill Developers' : 'Focused Learners'}
                      </p>
                    </div>
                    {membership.type === 'gold' && (
                      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
                        Most Popular
                      </div>
                    )}
                  </div>
                  <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    {membership.description}
                  </p>
                </div>

                {/* Plans Content */}
                <div className="p-3 sm:p-4 md:p-6 lg:p-8">
                                      {/* Pricing Display */}
                    <div className="mb-4 sm:mb-6">
                      {/* Current Selected Plan Price */}
                      <div className="text-center mb-4 p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-lg sm:rounded-xl">
                        <div className="flex items-baseline justify-center gap-1 sm:gap-2 mb-2">
                          <span className={`text-2xl sm:text-3xl md:text-4xl font-bold ${
                            membership.color === 'amber'
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-blue-600 dark:text-blue-400'
                          }`}>
                            {(() => {
                              const selectedPlanDuration = membership.type === "silver" ? modalState.selectedSilverPlan : modalState.selectedGoldPlan;
                              const selectedPlan = membership.plans.find(p => p.duration === selectedPlanDuration);
                              if (!selectedPlan) return "0";
                              const numeric = parseFloat(selectedPlan.price.replace(/[^0-9.]/g, ''));
                              return numeric.toString();
                            })()}
                          </span>
                          <span className="text-sm md:text-base text-slate-600 dark:text-slate-400 whitespace-nowrap">
                            /{(() => {
                              const selectedPlanDuration = membership.type === "silver" ? modalState.selectedSilverPlan : modalState.selectedGoldPlan;
                              const selectedPlan = membership.plans.find(p => p.duration === selectedPlanDuration);
                              return selectedPlan?.period || membership.plans[0]?.period || "month";
                            })()}
                          </span>
                        </div>
                      
                      {/* Per month breakdown for longer plans */}
                      {(() => {
                        const selectedPlanDuration = membership.type === "silver" ? modalState.selectedSilverPlan : modalState.selectedGoldPlan;
                        const selectedPlan = membership.plans.find(p => p.duration === selectedPlanDuration);
                        if (selectedPlan && selectedPlan.duration_months > 1) {
                          const monthlyAmount = Math.round(parseFloat(selectedPlan.price.replace(/[^0-9.]/g, '')) / selectedPlan.duration_months);
                          return (
                            <div className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                              (effective ₹{monthlyAmount.toLocaleString()}/month)
                            </div>
                          );
                        }
                        return null;
                      })()}
                      
                      {/* Savings Badge */}
                      {(() => {
                        const selectedPlanDuration = membership.type === "silver" ? modalState.selectedSilverPlan : modalState.selectedGoldPlan;
                        const selectedPlan = membership.plans.find(p => p.duration === selectedPlanDuration);
                        if (selectedPlan && selectedPlan.savings) {
                          return (
                            <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold mt-2">
                              🎉 {selectedPlan.savings}
                            </div>
                          );
                        }
                        return <div className="h-6"></div>; // Placeholder for spacing
                      })()}
                    </div>
                  </div>

                  {/* Plan Selection Grid */}
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3 sm:mb-4 text-center">
                      Choose Your Billing Cycle
                    </h3>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {membership.plans.map((plan: IPlan, idx: number) => {
                      const isSelected = modalState.selectedMembershipType === membership.type && (
                        membership.type === "silver" 
                          ? modalState.selectedSilverPlan === plan.duration 
                          : modalState.selectedGoldPlan === plan.duration
                      );
                      
                      // Calculate savings percentage
                      const monthlyPlan = membership.plans.find(p => p.duration === 'MONTHLY');
                      const monthlyPrice = monthlyPlan ? parseInt(monthlyPlan.price.replace(/[^\d]/g, '')) : 0;
                      const currentPrice = parseInt(plan.price.replace(/[^\d]/g, ''));
                      const totalMonthlyPrice = monthlyPrice * plan.duration_months;
                      const savingsPercentage = plan.duration_months > 1 ? Math.round(((totalMonthlyPrice - currentPrice) / totalMonthlyPrice) * 100) : 0;
                      
                      return (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handlePlanSelection(membership.type, plan.duration)}
                          className={`relative p-3 sm:p-4 rounded-lg border transition-all duration-200 text-center hover:shadow-md min-h-[44px] touch-manipulation ${
                            isSelected
                              ? membership.color === 'amber'
                                ? 'border-amber-500 bg-amber-50 dark:border-amber-400 dark:bg-amber-900/20 shadow-lg ring-2 ring-amber-200 dark:ring-amber-800'
                                : 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20 shadow-lg ring-2 ring-blue-200 dark:ring-blue-800'
                              : membership.color === 'amber'
                                ? 'border-slate-200 dark:border-slate-600 hover:border-amber-300 dark:hover:border-amber-600 hover:bg-amber-50/50 dark:hover:bg-amber-900/10'
                                : 'border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
                          }`}
                        >
                          {/* Popular Badge */}
                          {plan.duration === 'QUARTERLY' && (
                            <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                              Popular
                            </div>
                          )}
                          
                          {/* Savings Badge */}
                          {savingsPercentage > 0 && (
                            <div className="absolute -top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                              Save {savingsPercentage}%
                            </div>
                          )}
                          
                          <div className="mt-2">
                            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 whitespace-nowrap">
                              {plan.duration.replace('-', ' ')}
                          </p>
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <p className={`text-base font-bold ${
                              membership.color === 'amber'
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-blue-600 dark:text-blue-400'
                            }`}>
                                {plan.price.replace('INR ', '₹').replace('.00', '')}
                            </p>
                            {plan.original_price && (
                              <span className="text-xs text-slate-500 line-through">
                                  {plan.original_price.replace('INR ', '₹').replace('.00', '')}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {plan.period}
                          </p>
                          {isSelected && (
                              <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 mt-1 ${
                              membership.color === 'amber'
                                ? 'text-amber-500 dark:text-amber-400'
                                : 'text-blue-500 dark:text-blue-400'
                            }`} />
                          )}
                          </div>
                        </motion.button>
                      );
                    })}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                    {membership.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 sm:gap-3">
                        <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 transition-colors duration-200 ${
                          membership.color === 'amber'
                            ? 'text-amber-500 dark:text-amber-400'
                            : 'text-blue-500 dark:text-blue-400'
                        }`} />
                        <span className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Enhanced Professional Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectCourseModal(membership.type)}
                    disabled={modalState.enrollmentLoading || loading}
                    className={`mt-6 w-full py-4 px-6 rounded-xl font-semibold text-base flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed transition-gpu hover-lift-gpu hover:shadow-lg min-h-[44px] touch-manipulation gpu-accelerated ${
                      membership.type === 'gold'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/25'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-blue-500/25'
                    }`}
                  >
                    {modalState.enrollmentLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing Enrollment...</span>
                      </>
                    ) : loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Loading Plans...</span>
                      </>
                    ) : (
                      <>
                        <span>Get {membership.type.charAt(0).toUpperCase() + membership.type.slice(1)} Access</span>
                        <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                      </>
                    )}
                  </motion.button>
                  
                  {/* Additional CTA Info */}
                  <div className="mt-3 text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      🔒 Secure payment • 💳 All payment methods accepted
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Enhanced Free Trial Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-6 md:mb-8"
          >
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-600/50 shadow-xl text-center max-w-4xl mx-auto p-6 md:p-8">
              <div className="relative overflow-hidden bg-gradient-to-r from-blue-50/30 via-violet-50/30 to-emerald-50/30 dark:from-blue-950/10 dark:via-violet-950/10 dark:to-emerald-950/10 rounded-xl p-6 md:p-8 backdrop-blur-sm">
                {/* Animated background elements */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl mr-3">
                      <Gift className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                      START YOUR 7-DAY FREE TRIAL
                </h3>
                  </div>
                  
                  <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    Experience the full power of MEDH membership with complete access to all features
                  </p>
                  
                  {/* Trial Benefits */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">Full platform access</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">No commitment required</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">Cancel anytime</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    💡 Pro tip: Most students see significant progress within the first week
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Professional Note Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mb-8"
          >
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-amber-200/50 dark:border-amber-600/30 shadow-xl p-6 md:p-8 max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-amber-50/30 to-orange-50/30 dark:from-amber-950/10 dark:to-orange-950/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-amber-100/50 dark:bg-amber-900/30 rounded-xl">
                    <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                      Important Information
                    </h4>
                    <p className="text-base md:text-lg text-amber-700 dark:text-amber-300 leading-relaxed">
                      These memberships apply exclusively to MEDH's Blended Courses featuring 
                      pre-recorded videos with live interactive doubt clearing sessions. 
                      All courses include professional certification upon completion.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-amber-100/50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm">
                        📹 Pre-recorded content
                      </span>
                      <span className="px-3 py-1 bg-amber-100/50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm">
                        🎯 Live doubt sessions
                      </span>
                      <span className="px-3 py-1 bg-amber-100/50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm">
                        🏆 Professional certification
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Modals with Better Integration */}
        {modalState.isSelectCourseModalOpen && modalState.selectedMembershipType && (
          <SelectCourseModal
            isOpen={modalState.isSelectCourseModalOpen}
            onClose={() => setModalState(prev => ({ 
              ...prev, 
              isSelectCourseModalOpen: false,
              modalError: null 
            }))}
            planType={modalState.selectedMembershipType}
            amount={getSelectedPlanPrice()}
            selectedPlan={getSelectedPlanName()}
            closeParent={() => setModalState(prev => ({ 
              ...prev, 
              isSelectCourseModalOpen: false,
              modalError: null 
            }))}
          />
        )}

        {/* Error Display Modal */}
        {modalState.modalError && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setModalState(prev => ({ ...prev, modalError: null }))}
            ></div>
            
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 z-50 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                    Enrollment Error
                  </h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {modalState.modalError}
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setModalState(prev => ({ ...prev, modalError: null }))}
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setModalState(prev => ({ 
                        ...prev, 
                        modalError: null,
                        isSelectCourseModalOpen: true 
                      }));
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Login Modal */}
        {modalState.isLoginModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setModalState(prev => ({ ...prev, isLoginModalOpen: false }))}
            ></div>
            
            {/* Modal Container */}
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 z-50 overflow-hidden animate-fadeIn">
              {/* Close Button */}
              <button 
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
                onClick={() => setModalState(prev => ({ ...prev, isLoginModalOpen: false }))}
                aria-label="Close login form"
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* LoginForm Component */}
              <LoginForm />
            </div>
          </div>
        )}
      </section>
    </>
      );
};

export default PrimeMembership;
