"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Crown, Star, ArrowRight, CheckCircle, AlertCircle, X, Loader2, Zap, Users, TrendingUp } from "lucide-react";
import dynamic from "next/dynamic";
import ReactDOM from "react-dom";

// Lazy load heavy components
const SelectCourseModal = dynamic(() => import("@/components/layout/main/dashboards/SelectCourseModal"), {
  loading: () => <div className="fixed inset-0 bg-black/50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-white" /></div>,
  ssr: false
});

const LoginForm = dynamic(() => import("@/components/shared/login/LoginForm"), {
  loading: () => <div className="p-8 bg-white rounded-lg"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>,
  ssr: false
});

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
  isPopular?: boolean;
  discount?: string;
  socialProof?: string;
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

// Fallback static data with psychological triggers
const getStaticMembershipData = (): IMembershipData[] => [
  {
    type: "silver" as TMembershipType,
    icon: <Star className="w-4 h-4" />,
    color: "primary",
    isPopular: false,
    discount: "Save up to 58%",
    socialProof: "2,847 students enrolled",
    plans: [
      { duration: "MONTHLY", price: "INR 999.00", period: "per month", duration_months: 1, billing_cycle: "monthly" },
      { duration: "QUARTERLY", price: "INR 2,499.00", period: "per 3 months", duration_months: 3, billing_cycle: "quarterly" },
      { duration: "HALF-YEARLY", price: "INR 3,999.00", period: "per 6 months", duration_months: 6, billing_cycle: "half_yearly" },
      { duration: "ANNUALLY", price: "INR 4,999.00", period: "per annum", duration_months: 12, billing_cycle: "annually" },
    ],
    description: "Perfect for focused learning in one specialized area",
    features: [
      // HIGHLIGHTED FEATURE
      "<span class='font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded block sm:hidden text-center'>Select <b>1 Category</b> only. Full access to all its courses.</span><span class='font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded hidden sm:inline'>Select <b>1 Category</b> only. Full access to all its courses.</span>",
      "Live Q&A sessions",
      "Community access",
      "Career support"
    ]
  },
  {
    type: "gold" as TMembershipType,
    icon: <Crown className="w-4 h-4" />,
    color: "amber",
    isPopular: true,
    discount: "Save up to 65%",
    socialProof: "4,521 students enrolled",
    plans: [
      { duration: "MONTHLY", price: "INR 1,999.00", period: "per month", duration_months: 1, billing_cycle: "monthly" },
      { duration: "QUARTERLY", price: "INR 3,999.00", period: "per 3 months", duration_months: 3, billing_cycle: "quarterly" },
      { duration: "HALF-YEARLY", price: "INR 5,999.00", period: "per 6 months", duration_months: 6, billing_cycle: "half_yearly" },
      { duration: "ANNUALLY", price: "INR 6,999.00", period: "per annum", duration_months: 12, billing_cycle: "annually" },
    ],
    description: "Most comprehensive package for serious learners",
    features: [
      // HIGHLIGHTED FEATURE
      "<span class='font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded block sm:hidden text-center'>Select <b>up to 3 Categories</b>. Full access to all courses within them.</span><span class='font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded hidden sm:inline'>Select <b>up to 3 Categories</b>. Full access to all courses within them.</span>",
      "Priority support",
      "Career counseling",
      "Job placement assistance"
    ]
  }
];

const PrimeMembership: React.FC = () => {
  // State management
  const [membershipData, setMembershipData] = useState<IMembershipData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state management
  const [modalState, setModalState] = useState<IModalState>({
    isSelectCourseModalOpen: false,
    isLoginModalOpen: false,
    selectedMembershipType: "",
    selectedSilverPlan: "ANNUALLY", // Default to best value
    selectedGoldPlan: "ANNUALLY", // Default to best value
    enrollmentLoading: false,
    modalError: null
  });

  // Memoize static data
  const staticMembershipData = useMemo(() => getStaticMembershipData(), []);

  // Fetch membership data on component mount
  useEffect(() => {
    const fetchMembershipData = async () => {
      try {
        setLoading(true);
        setError(null);

        const pricingResponse = await getMembershipPricing();

        if (pricingResponse.status !== 'success') {
          throw new Error(pricingResponse.error || 'Failed to fetch pricing');
        }

        const pricingData = pricingResponse.data?.pricing;

        if (!pricingData) {
          setMembershipData(staticMembershipData);
          return;
        }

        const silverFeatures = pricingData.silver?.monthly?.features || staticMembershipData[0].features;
        const goldFeatures = pricingData.gold?.monthly?.features || staticMembershipData[1].features;

        const transformedData: IMembershipData[] = [
          {
            type: "silver" as TMembershipType,
            icon: <Star className="w-4 h-4" />,
            color: "primary",
            isPopular: false,
            discount: "Save up to 58%",
            socialProof: "2,847 students enrolled",
            plans: transformPlansData("silver", pricingData),
            description: "Perfect for focused learning in one specialized area",
            features: silverFeatures.slice(0, 4), // Compact feature list
            benefits: undefined
          },
          {
            type: "gold" as TMembershipType,
            icon: <Crown className="w-4 h-4" />,
            color: "amber",
            isPopular: true,
            discount: "Save up to 65%",
            socialProof: "4,521 students enrolled",
            plans: transformPlansData("gold", pricingData),
            description: "Most comprehensive package for serious learners",
            features: goldFeatures.slice(0, 4), // Compact feature list
            benefits: undefined
          }
        ];

        setMembershipData(transformedData);
      } catch (err) {
        console.error('Error fetching membership data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load membership data');
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
      return staticMembershipData.find(m => m.type === membershipType)?.plans || [];
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

      return {
        duration: durationInfo.duration,
        price: `INR ${plan.amount.toLocaleString()}.00`,
        period: getPeriodText(durationInfo.months),
        duration_months: durationInfo.months,
        billing_cycle: durationInfo.billing,
        original_price: undefined,
        savings: undefined
      };
    }).filter(Boolean) as IPlan[];
  };

  const getPeriodText = (durationMonths: number): string => {
    switch (durationMonths) {
      case 1: return "per month";
      case 3: return "per 3 months";
      case 6: return "per 6 months";
      case 12: return "per annum";
      default: return `per ${durationMonths} months`;
    }
  };

  // Helper functions
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
      return "ANNUALLY";
    }
  }, [modalState.selectedMembershipType, modalState.selectedSilverPlan, modalState.selectedGoldPlan]);

  const checkUserLogin = useCallback((): boolean => {
    const userId = localStorage.getItem("userId");
    return userId !== null;
  }, []);

  const handleSelectCourseModal = useCallback((membershipType: string): void => {
    const normalizedType = membershipType === 'medh-silver membership' ? 'silver' : membershipType === 'medh-gold membership' ? 'gold' : membershipType;
    if (!checkUserLogin()) {
      setModalState(prev => ({ ...prev, isLoginModalOpen: true }));
      return;
    }
    
    setModalState(prev => ({ 
      ...prev, 
      selectedMembershipType: normalizedType as TMembershipType,
      isSelectCourseModalOpen: true,
      modalError: null
    }));
  }, [checkUserLogin]);

  const handlePlanSelection = useCallback((membershipType: string, planDuration: string): void => {
    const normalizedType = membershipType === 'medh-silver membership' ? 'silver' : membershipType === 'medh-gold membership' ? 'gold' : membershipType;
    setModalState(prev => ({ ...prev, selectedMembershipType: normalizedType as TMembershipType }));
    
    if (normalizedType === "silver") {
      setModalState(prev => ({ ...prev, selectedSilverPlan: planDuration }));
    } else if (normalizedType === "gold") {
      setModalState(prev => ({ ...prev, selectedGoldPlan: planDuration }));
    }
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 pt-8 pb-0">
      <div className="w-full">
        {/* Main Container */}
        <div className="bg-white dark:bg-gray-800 border-t border-b border-gray-200 dark:border-gray-700">
          {/* Compact Header with Urgency */}
          <div id="membership-section" className="text-center mb-8 px-6 md:px-8 lg:px-10 pt-6 md:pt-8 lg:pt-10">
            <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-sm font-medium mb-3">
              <Zap className="w-3 h-3" />
              Limited Time Offer - 65% OFF
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Choose Your Learning Journey
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join thousands of professionals advancing their careers
            </p>
          </div>

        {/* Compact Membership Cards */}
        <div id="membership-cards" className="grid md:grid-cols-2 gap-6 mb-8 px-6 md:px-8 lg:px-10">
          {membershipData.map((membership: IMembershipData, index: number) => {
            const selectedPlanDuration = membership.type === "silver" ? modalState.selectedSilverPlan : modalState.selectedGoldPlan;
            const selectedPlan = membership.plans.find(p => p.duration === selectedPlanDuration);
            const monthlyPlan = membership.plans.find(p => p.duration === "MONTHLY");
            
            let savings = 0;
            if (selectedPlan && monthlyPlan && selectedPlan.duration_months > 1) {
              const monthlyPrice = parseFloat(monthlyPlan.price.replace(/[^0-9.]/g, ''));
              const selectedPrice = parseFloat(selectedPlan.price.replace(/[^0-9.]/g, ''));
              const totalMonthlyPrice = monthlyPrice * selectedPlan.duration_months;
              savings = totalMonthlyPrice - selectedPrice;
            }

            return (
              <div
                key={index}
                className={`relative bg-white dark:bg-gray-800 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                  membership.isPopular 
                    ? 'border-amber-400 dark:border-amber-500 shadow-lg shadow-amber-500/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                }`}
              >
                {/* Popular Badge */}
                {membership.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                      🔥 MOST POPULAR
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className={`p-4 ${
                  membership.type === 'gold' 
                    ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20' 
                    : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
                } rounded-t-xl relative`}>
                  <div className="flex flex-col items-center text-center w-full mb-2">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className={`p-1.5 rounded-lg ${
                        membership.type === 'gold'
                          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      }`}>
                        {membership.icon}
                      </span>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                        {membership.type}
                      </h2>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {membership.description}
                    </p>
                  </div>
                  {/* Discount Top Right */}
                  <div className={`absolute top-2 right-3 text-xs font-medium ${
                    membership.color === 'amber' 
                      ? 'text-amber-600 dark:text-amber-400' 
                      : 'text-blue-600 dark:text-blue-400'
                  }`}>
                    {membership.discount}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Compact Plan Selection - replaced with plan cards */}
                  <div className="mb-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {membership.plans.map((plan: IPlan, idx: number) => {
                        const monthlyPlan = membership.plans.find(p => p.duration === "MONTHLY");
                        const monthlyNum = monthlyPlan ? parseFloat(monthlyPlan.price.replace(/[^0-9.]/g, '')) : 0;
                        const currentNum = parseFloat(plan.price.replace(/[^0-9.]/g, ''));
                        const totalMonthlyPrice = monthlyNum * plan.duration_months;
                        const planSavings = plan.duration_months > 1 ? totalMonthlyPrice - currentNum : 0;
                        const isSelected = selectedPlanDuration === plan.duration;
                        const isBestValue = plan.duration === "ANNUALLY";
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handlePlanSelection(membership.type, plan.duration)}
                            className={`flex-1 min-w-0 rounded-lg border-2 px-4 py-3 text-left transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/50
                              text-center flex flex-col items-center
                              ${isSelected ? (membership.color === 'amber' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/10' : 'border-blue-500 bg-blue-50 dark:bg-blue-900/10') : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}
                              hover:scale-105 relative`}
                          >
                            <div className="font-bold text-base sm:text-lg mb-1 capitalize">{plan.duration.replace('-', ' ')}</div>
                            <div className="flex items-end gap-1 mb-1">
                              <span className="text-xs text-gray-500">₹</span>
                              <span className={`text-xl font-bold ${membership.color === 'amber' ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'}`}>{parseFloat(plan.price.replace(/[^0-9.]/g, '')).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="text-xs text-gray-500 mb-1">{plan.period}</div>
                            {planSavings > 0 && (
                              <div className="text-xs text-green-600 dark:text-green-400 font-medium">Save ₹{Math.round(planSavings).toLocaleString()}</div>
                            )}
                            {isBestValue && (
                              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10 whitespace-nowrap">Best Value</div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Compact Features */}
                  {membership.features.length > 0 && (
                  <div className="mb-4">
                      {/* Highlighted feature as full-width block */}
                      <div className="flex items-center gap-2 mb-2 justify-center">
                        <CheckCircle className={`w-4 h-4 flex-shrink-0 ${
                          membership.color === 'amber'
                            ? 'text-amber-500 dark:text-amber-400'
                            : 'text-blue-500 dark:text-blue-400'
                        }`} />
                        <span className="text-xs text-gray-600 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: membership.features[0] }} />
                      </div>
                      {/* Other three features in a single row */}
                      <div className="flex flex-row flex-wrap items-center justify-center gap-4">
                        {membership.features.slice(1).map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-1">
                          <CheckCircle className={`w-3 h-3 flex-shrink-0 ${
                            membership.color === 'amber'
                              ? 'text-amber-500 dark:text-amber-400'
                              : 'text-blue-500 dark:text-blue-400'
                          }`} />
                            <span className="text-xs text-gray-600 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: feature }} />
                        </div>
                      ))}
                    </div>
                  </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => handleSelectCourseModal(membership.type)}
                    disabled={modalState.enrollmentLoading || loading}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                      membership.color === 'amber'
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25'
                    }`}
                  >
                    {modalState.enrollmentLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Start Learning Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

          {/* Compact Trust Signals */}
          <div className="text-center px-6 md:px-8 lg:px-10">
            <div className="inline-flex items-center gap-4 bg-gray-50 dark:bg-gray-700 rounded-lg px-6 py-3 shadow-sm border border-gray-100 dark:border-gray-600">
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>70+ Courses</span>
              </div>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Industry Certified</span>
              </div>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Job Assistance</span>
              </div>
            </div>
          </div>
        {/* Highlighted Note */}
        <div className="text-center my-4">
          <span className="inline-block bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 font-semibold px-4 py-2 rounded-lg text-sm">
            *Note: Only <span className="underline font-bold">Blended Courses</span> available with Medh Membership
          </span>
          </div>
        </div>
      </div>

      {/* Modals */}
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

      {modalState.isLoginModalOpen &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-[101] flex items-center justify-center">
            <div 
              className="fixed inset-0 bg-black/50"
              onClick={() => setModalState(prev => ({ ...prev, isLoginModalOpen: false }))}
            ></div>
            <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md mx-4 z-[102] p-2 sm:p-4">
              <button 
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
                onClick={() => setModalState(prev => ({ ...prev, isLoginModalOpen: false }))}
                aria-label="Close login modal"
              >
                <X className="w-5 h-5" />
              </button>
              <LoginForm popupMode={true} redirectPath="/medh-membership" />
            </div>
          </div>,
          typeof window !== 'undefined' ? document.getElementById('modal-root')! : document.body
        )
      }

      {modalState.modalError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={() => setModalState(prev => ({ ...prev, modalError: null }))}
          ></div>
          
          <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md mx-4 z-50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h3 className="font-medium text-gray-900 dark:text-white">Error</h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
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
      )}
    </section>
  );
};

export default PrimeMembership;
