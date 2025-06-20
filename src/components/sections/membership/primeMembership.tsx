"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Star, ArrowRight, CheckCircle, AlertCircle, X, Loader2 } from "lucide-react";
import SelectCourseModal from "@/components/layout/main/dashboards/SelectCourseModal";
import LoginForm from "@/components/shared/login/LoginForm";
import MembershipBanner from "./membershipBanner";

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

const PrimeMembership: React.FC = () => {
  // State management
  const [membershipData, setMembershipData] = useState<IMembershipData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  
  const [selectedMembershipType, setSelectedMembershipType] = useState<string>("");
  const [selectedSilverPlan, setSelectedSilverPlan] = useState<string>("MONTHLY");
  const [selectedGoldPlan, setSelectedGoldPlan] = useState<string>("MONTHLY");
  const [isSelectCourseModalOpen, setSelectCourseModalOpen] = useState<boolean>(false);
  const [planType, setPlanType] = useState<string>("");
  const [selectedMembership, setSelectedMembership] = useState<string>("");
  const [isLoginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Fetch membership data on component mount
  useEffect(() => {
    const fetchMembershipData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch pricing and benefits in parallel
        const [pricingResponse, silverBenefitsResponse, goldBenefitsResponse] = await Promise.all([
          getMembershipPricing(),
          getMembershipBenefits('silver'),
          getMembershipBenefits('gold')
        ]);

        if (pricingResponse.status !== 'success') {
          throw new Error(pricingResponse.error || 'Failed to fetch pricing');
        }

        if (silverBenefitsResponse.status !== 'success' || goldBenefitsResponse.status !== 'success') {
          throw new Error('Failed to fetch membership benefits');
        }

        const pricingPlans = pricingResponse.data?.pricing_plans || [];
        const silverBenefits = silverBenefitsResponse.data?.benefits;
        const goldBenefits = goldBenefitsResponse.data?.benefits;

        // Transform API data to component format
        const transformedData: IMembershipData[] = [
          {
            type: "silver" as TMembershipType,
            icon: <Star className="w-6 h-6" />,
            color: "primary",
            plans: transformPlansData(pricingPlans.filter(p => p.membership_type === 'silver')),
            description: silverBenefits?.description || "Ideal for focused skill development. Access to 1 course category with premium features.",
            features: silverBenefits?.features.additional_benefits || [
              "Access to LIVE Q&A Doubt Clearing Sessions",
              "Special discount on all live courses",
              "Community access",
              "Access to free courses",
              "Placement Assistance"
            ],
            benefits: silverBenefits
          },
          {
            type: "gold" as TMembershipType,
            icon: <Crown className="w-6 h-6" />,
            color: "amber",
            plans: transformPlansData(pricingPlans.filter(p => p.membership_type === 'gold')),
            description: goldBenefits?.description || "Perfect for diverse skill acquisition. Access to 3 course categories with exclusive benefits.",
            features: goldBenefits?.features.additional_benefits || [
              "Access to LIVE Q&A Doubt Clearing Sessions",
              "Minimum 15% discount on all live courses",
              "Community access",
              "Access to free courses",
              "Career Counselling",
              "Placement Assistance"
            ],
            benefits: goldBenefits
          }
        ];

        setMembershipData(transformedData);
      } catch (err) {
        console.error('Error fetching membership data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load membership data');
        
        // Fallback to static data
        setMembershipData(getStaticMembershipData());
      } finally {
        setLoading(false);
      }
    };

    fetchMembershipData();
  }, []);

  // Transform pricing data from API to component format
  const transformPlansData = (pricingPlans: IMembershipPricing[]): IPlan[] => {
    const durationMap: { [key: number]: string } = {
      1: "MONTHLY",
      3: "QUARTERLY", 
      6: "HALF-YEARLY",
      12: "ANNUALLY"
    };

    return pricingPlans.map(plan => {
      const pricing = calculateMembershipPricing(plan.membership_type, plan.duration_months);
      
      return {
        duration: durationMap[plan.duration_months] || `${plan.duration_months}-MONTH`,
        price: `INR ${plan.price_inr.toLocaleString()}.00`,
        period: getPeriodText(plan.duration_months),
        duration_months: plan.duration_months,
        billing_cycle: plan.billing_cycle,
        original_price: plan.original_price_inr ? `INR ${plan.original_price_inr.toLocaleString()}.00` : undefined,
        savings: pricing.savings_compared_to_monthly > 0 ? `Save INR ${pricing.savings_compared_to_monthly}` : undefined
      };
    });
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

  const checkUserLogin = (): boolean => {
    const userId = localStorage.getItem("userId");
    return userId !== null;
  };

  const handleSelectCourseModal = (membershipType: string): void => {
    if (!checkUserLogin()) {
      setLoginModalOpen(true);
      return;
    }
    if (!membershipType) return;
    setPlanType(membershipType.toLowerCase());
    setSelectCourseModalOpen(true);
  };

  const handleMembershipChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const membership = e.target.value;
    setSelectedMembership(membership);
    if (membership) {
      handleSelectCourseModal(membership);
    }
  };

  const handlePlanSelection = (membershipType: string, planDuration: string): void => {
    setSelectedMembershipType(membershipType);
    
    if (membershipType === "silver") {
      setSelectedSilverPlan(planDuration);
    } else if (membershipType === "gold") {
      setSelectedGoldPlan(planDuration);
    }
  };

  // Handle membership enrollment
  const handleEnrollment = async (membershipType: TMembershipType, selectedCategories: string[] = []) => {
    try {
      setEnrollmentLoading(true);

      // Get selected plan details
      const membership = membershipData.find(m => m.type === membershipType);
      if (!membership) throw new Error('Membership type not found');

      const selectedPlanDuration = membershipType === 'silver' ? selectedSilverPlan : selectedGoldPlan;
      const selectedPlan = membership.plans.find(p => p.duration === selectedPlanDuration);
      if (!selectedPlan) throw new Error('Selected plan not found');

      // Create enrollment data
      const enrollmentData: IMembershipEnrollmentInput = {
        membership_type: membershipType,
        duration_months: selectedPlan.duration_months,
        billing_cycle: getBillingCycleFromDuration(selectedPlan.duration_months),
        auto_renewal: true,
        selected_categories: selectedCategories,
        payment_info: {
          amount: parseInt(selectedPlan.price.replace(/[^\d]/g, '')),
          currency: 'INR',
          payment_method: 'upi',
          transaction_id: `TXN${Date.now()}`
        }
      };

      // Validate enrollment data
      const validation = validateMembershipEnrollmentData(enrollmentData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Create enrollment
      const response = await createMembershipEnrollment(enrollmentData);
      
      if (response.status === 'success') {
        // Success - redirect to success page or show success message
        alert('Membership enrolled successfully!');
        setSelectCourseModalOpen(false);
        
        // Optionally redirect to dashboard or membership page
        window.location.href = '/dashboard/membership';
      } else {
        throw new Error(response.error || 'Enrollment failed');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      alert(error instanceof Error ? error.message : 'Failed to enroll in membership');
    } finally {
      setEnrollmentLoading(false);
    }
  };

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
      <section className="relative bg-slate-50 dark:bg-slate-900 py-16 lg:py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-amber-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-amber-950/20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-amber-200/20 dark:bg-amber-800/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-36 h-36 bg-purple-200/20 dark:bg-purple-800/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

        <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 z-10">
          {/* Section Header */}
          <div className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 p-6 md:p-8 shadow-sm shadow-slate-200/50 dark:shadow-slate-800/50 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 id="choose-membership" className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                Choose Your <span className="text-blue-600 dark:text-blue-400">MEDH</span> Membership
              </h1>
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                Select the perfect membership plan that aligns with your learning goals and unlock premium features.
              </p>
              {error && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <AlertCircle className="w-4 h-4 inline mr-2" />
                    Using cached data due to connection issues. Some features may be limited.
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Membership Cards */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">
            {membershipData.map((membership: IMembershipData, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                className={`group bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-xl hover:shadow-slate-200/25 dark:hover:shadow-slate-800/50 hover:-translate-y-2 hover:scale-[1.02] hover:border-slate-300 dark:hover:border-slate-500 transition-all duration-300 ease-out cursor-pointer overflow-hidden ${
                  membership.color === 'amber' 
                    ? 'hover:border-amber-300 dark:hover:border-amber-600' 
                    : 'hover:border-blue-300 dark:hover:border-blue-600'
                }`}
              >
                {/* Header */}
                <div className={`p-6 ${
                  membership.color === 'amber' 
                    ? 'bg-gradient-to-r from-amber-50/50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/20' 
                    : 'bg-gradient-to-r from-blue-50/50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20'
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                      membership.color === 'amber'
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    }`}>
                      <div className="transition-all duration-300 group-hover:scale-110">
                        {membership.icon}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-50 transition-colors duration-300 group-hover:text-slate-700 dark:group-hover:text-slate-200">
                        {membership.type.charAt(0).toUpperCase() + membership.type.slice(1)}
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Membership
                      </p>
                    </div>
                  </div>
                  <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    {membership.description}
                  </p>
                </div>

                {/* Plans Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    {membership.plans.map((plan: IPlan, idx: number) => {
                      const isSelected = selectedMembershipType === membership.type && (
                        membership.type === "silver" 
                          ? selectedSilverPlan === plan.duration 
                          : selectedGoldPlan === plan.duration
                      );
                      
                      return (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handlePlanSelection(membership.type, plan.duration)}
                          className={`p-4 rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer transition-all duration-200 text-left hover:shadow-md ${
                            isSelected
                              ? membership.color === 'amber'
                                ? 'border-amber-500 bg-amber-50 dark:border-amber-400 dark:bg-amber-900/20 shadow-lg'
                                : 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20 shadow-lg'
                              : membership.color === 'amber'
                                ? 'hover:border-amber-300 dark:hover:border-amber-600 hover:bg-amber-50/50 dark:hover:bg-amber-900/10'
                                : 'hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
                          }`}
                        >
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                            {plan.duration}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className={`text-lg md:text-xl font-bold ${
                              membership.color === 'amber'
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-blue-600 dark:text-blue-400'
                            }`}>
                              {plan.price}
                            </p>
                            {plan.original_price && (
                              <span className="text-xs text-slate-500 line-through">
                                {plan.original_price}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {plan.period}
                          </p>
                          {plan.savings && (
                            <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">
                              {plan.savings}
                            </p>
                          )}
                          {isSelected && (
                            <CheckCircle className={`w-5 h-5 mt-2 ${
                              membership.color === 'amber'
                                ? 'text-amber-500 dark:text-amber-400'
                                : 'text-blue-500 dark:text-blue-400'
                            }`} />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Features */}
                  <div className="mt-6 space-y-3">
                    {membership.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${
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

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectCourseModal(membership.type)}
                    disabled={enrollmentLoading}
                    className={`mt-6 w-full py-3 md:py-4 px-6 rounded-lg flex items-center justify-center gap-2 font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed ${
                      membership.color === 'amber'
                        ? 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white'
                    }`}
                  >
                    {enrollmentLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Select {membership.type.charAt(0).toUpperCase() + membership.type.slice(1)} Plan
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-200 group-hover:translate-x-1" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Free Trial Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <div className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 p-6 md:p-8 shadow-sm shadow-slate-200/50 dark:shadow-slate-800/50 text-center max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-blue-50/50 to-amber-50/50 dark:from-blue-950/20 dark:to-amber-950/20 rounded-lg p-6 mb-4">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                  START YOUR 7-DAY FREE TRIAL TODAY
                </h3>
                <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  No commitment • Cancel anytime
                </p>
              </div>
            </div>
          </motion.div>

          {/* Note Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-amber-200 dark:border-amber-600 p-6 max-w-3xl mx-auto mb-8"
          >
            <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm md:text-base text-amber-800 dark:text-amber-200 leading-relaxed">
                  <strong>Note:</strong> Only Medh's Blended Courses having 'Pre-Recorded Videos
                  with Live Interactive Doubt Clearing Sessions' would be eligible
                  for these memberships.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Modals */}
        {isSelectCourseModalOpen && (
          <SelectCourseModal
            isOpen={isSelectCourseModalOpen}
            onClose={() => setSelectCourseModalOpen(false)}
            planType={planType}
            amount={getSelectedPlanPrice()}
            selectedPlan={getSelectedPlanName()}
            closeParent={() => setSelectCourseModalOpen(false)}
          />
        )}
        
        {/* Login Modal */}
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setLoginModalOpen(false)}
            ></div>
            
            {/* Modal Container */}
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 z-50 overflow-hidden animate-fadeIn">
              {/* Close Button */}
              <button 
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
                onClick={() => setLoginModalOpen(false)}
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

  // Helper function to get selected plan price
  function getSelectedPlanPrice(): string {
    const membership = membershipData.find(m => m.type === planType);
    if (!membership) return "0";
    
    const selectedPlanDuration = planType === 'silver' ? selectedSilverPlan : selectedGoldPlan;
    const selectedPlan = membership.plans.find(p => p.duration === selectedPlanDuration);
    
    return selectedPlan?.price.replace(/[^\d]/g, '') || "0";
  }

  // Helper function to get selected plan name
  function getSelectedPlanName(): string {
    const selectedPlanDuration = planType === 'silver' ? selectedSilverPlan : selectedGoldPlan;
    return selectedPlanDuration;
  }
};

export default PrimeMembership;
