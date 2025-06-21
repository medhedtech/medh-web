"use client";
import React, { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, Zap, Crown, Users, BookOpen, MessageCircle, Award, TrendingUp, ChevronDown } from 'lucide-react';
import { getMembershipPricing, calculateMembershipPricing, formatMembershipDuration, getBillingCycleFromDuration } from '@/apis/membership/membership';
import type { IMembershipPricingData, TMembershipType, TBillingCycle } from '@/apis/membership/membership';
import { toast } from 'react-hot-toast';

interface MembershipPricingProps {
  onSelectPlan?: (membershipType: TMembershipType, billingCycle: TBillingCycle, amount: number) => void;
  className?: string;
}

interface BillingOption {
  cycle: TBillingCycle;
  label: string;
  months: number;
  popular?: boolean;
}

const MembershipPricing: React.FC<MembershipPricingProps> = ({ onSelectPlan, className = "" }): React.ReactElement => {
  const [pricingData, setPricingData] = useState<IMembershipPricingData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBilling, setSelectedBilling] = useState<TBillingCycle>('quarterly');
  const [error, setError] = useState<string | null>(null);

  // Billing cycle options
  const billingOptions: BillingOption[] = [
    { cycle: 'monthly', label: 'Monthly', months: 1 },
    { cycle: 'quarterly', label: '3 Months', months: 3, popular: true },
    { cycle: 'half_yearly', label: '6 Months', months: 6 },
    { cycle: 'annually', label: 'Annual', months: 12 }
  ];

  // Fallback pricing data
  const fallbackPricing: IMembershipPricingData = {
    silver: {
      monthly: {
        amount: 999,
        currency: "INR",
        duration: "1 month",
        features: [
          "Access to all self-paced blended courses within any Single-Category",
          "Access to LIVE Q&A Doubt Clearing Sessions",
          "Special discount on all live courses",
          "Community access",
          "Access to free courses",
          "Placement Assistance"
        ]
      },
      quarterly: {
        amount: 2499,
        currency: "INR",
        duration: "3 months",
        features: [
          "Access to all self-paced blended courses within any Single-Category",
          "Access to LIVE Q&A Doubt Clearing Sessions",
          "Special discount on all live courses",
          "Community access",
          "Access to free courses",
          "Placement Assistance"
        ]
      },
      half_yearly: {
        amount: 3999,
        currency: "INR",
        duration: "6 months",
        features: [
          "Access to all self-paced blended courses within any Single-Category",
          "Access to LIVE Q&A Doubt Clearing Sessions",
          "Special discount on all live courses",
          "Community access",
          "Access to free courses",
          "Placement Assistance"
        ]
      },
      annual: {
        amount: 4999,
        currency: "INR",
        duration: "12 months",
        features: [
          "Access to all self-paced blended courses within any Single-Category",
          "Access to LIVE Q&A Doubt Clearing Sessions",
          "Special discount on all live courses",
          "Community access",
          "Access to free courses",
          "Placement Assistance"
        ]
      }
    },
    gold: {
      monthly: {
        amount: 1999,
        currency: "INR",
        duration: "1 month",
        features: [
          "Access to all self-paced blended courses within any 03-Categories",
          "Access to LIVE Q&A Doubt Clearing Sessions",
          "Minimum 15% discount on all live courses",
          "Community access",
          "Access to free courses",
          "Career Counselling",
          "Placement Assistance"
        ]
      },
      quarterly: {
        amount: 3999,
        currency: "INR",
        duration: "3 months",
        features: [
          "Access to all self-paced blended courses within any 03-Categories",
          "Access to LIVE Q&A Doubt Clearing Sessions",
          "Minimum 15% discount on all live courses",
          "Community access",
          "Access to free courses",
          "Career Counselling",
          "Placement Assistance"
        ]
      },
      half_yearly: {
        amount: 5999,
        currency: "INR",
        duration: "6 months",
        features: [
          "Access to all self-paced blended courses within any 03-Categories",
          "Access to LIVE Q&A Doubt Clearing Sessions",
          "Minimum 15% discount on all live courses",
          "Community access",
          "Access to free courses",
          "Career Counselling",
          "Placement Assistance"
        ]
      },
      annual: {
        amount: 6999,
        currency: "INR",
        duration: "12 months",
        features: [
          "Access to all self-paced blended courses within any 03-Categories",
          "Access to LIVE Q&A Doubt Clearing Sessions",
          "Minimum 15% discount on all live courses",
          "Community access",
          "Access to free courses",
          "Career Counselling",
          "Placement Assistance"
        ]
      }
    }
  };

  // Fetch pricing data from API
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getMembershipPricing();
        
        if (response.data && response.data.pricing) {
          setPricingData(response.data.pricing);
          console.log('Pricing data loaded from API:', response.data.pricing);
        } else {
          throw new Error('Invalid API response structure');
        }
      } catch (error: any) {
        console.error('Failed to fetch pricing data:', error);
        setError(error.message || 'Failed to load pricing');
        // Use fallback data when API fails
        setPricingData(fallbackPricing);
        toast.error('Using fallback pricing data');
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, []);

  // Get current pricing data (API or fallback)
  const getCurrentPricing = () => {
    return pricingData || fallbackPricing;
  };

  // Get plan data for a specific membership type and billing cycle
  const getPlanData = (membershipType: TMembershipType, billingCycle: TBillingCycle) => {
    const pricing = getCurrentPricing();
    const cycleKey = billingCycle === 'annually' ? 'annual' : billingCycle;
    return pricing[membershipType][cycleKey as keyof typeof pricing[TMembershipType]];
  };

  // Calculate savings compared to monthly
  const calculateSavings = (membershipType: TMembershipType, billingCycle: TBillingCycle) => {
    const pricing = getCurrentPricing();
    const currentPlan = getPlanData(membershipType, billingCycle);
    const monthlyPlan = pricing[membershipType].monthly;
    
    const billingOption = billingOptions.find(opt => opt.cycle === billingCycle);
    if (!billingOption || billingOption.months === 1) return null;
    
    const monthlyTotal = monthlyPlan.amount * billingOption.months;
    const savings = monthlyTotal - currentPlan.amount;
    const savingsPercentage = Math.round((savings / monthlyTotal) * 100);
    
    return {
      amount: savings,
      percentage: savingsPercentage,
      monthlyTotal
    };
  };

  // Handle plan selection
  const handleSelectPlan = (membershipType: TMembershipType) => {
    const planData = getPlanData(membershipType, selectedBilling);
    if (onSelectPlan) {
      onSelectPlan(membershipType, selectedBilling, planData.amount);
    } else {
      toast.success(`Selected ${membershipType.toUpperCase()} ${formatMembershipDuration(billingOptions.find(opt => opt.cycle === selectedBilling)?.months || 1)} plan`);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-16 ${className}`} role="status">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" aria-hidden="true"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading membership plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto px-4 py-16 ${className}`}>
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
          role="region"
          aria-label="Membership Header"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your MEDH Membership
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Select the perfect membership plan that aligns with your learning goals and unlock premium features.
          </p>
        </motion.div>

        {/* Special Offer Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8 max-w-2xl mx-auto"
        >
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-4 text-center shadow-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-bold text-lg">Limited Time Offer!</span>
              <Star className="w-5 h-5 fill-current" />
            </div>
            <p className="text-sm opacity-90">
              Save up to <strong>50%</strong> when you choose longer plans • Start learning today!
            </p>
          </div>
        </motion.div>

        {/* Billing Cycle Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-2xl p-1.5 mb-8"
        >
          {billingOptions.map((option) => (
            <button
              key={option.cycle}
              onClick={() => setSelectedBilling(option.cycle)}
              className={`relative px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                selectedBilling === option.cycle
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {option.label}
              {option.popular && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                  Popular
                </span>
              )}
              {/* Show savings on longer plans */}
              {(function renderSavings(): React.ReactNode {
                const savings = calculateSavings('silver', option.cycle);
                return savings && savings.percentage > 0 ? (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                    Save {savings.percentage.toString()}%
                  </span>
                ) : null;
              })()}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Silver Membership */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-xl"
        >
          {/* Plan Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl mb-4">
              <Star className="w-8 h-8 text-gray-600 dark:text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Silver Membership
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Ideal for focused skill development. Access to 1 course category with premium features.
            </p>
          </div>

          {/* Pricing */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <div className="flex items-baseline justify-center mb-2">
                <span className="text-5xl font-bold text-gray-900 dark:text-white">
                  ₹{getPlanData('silver', selectedBilling).amount.toLocaleString()}
                </span>
                <span className="text-gray-600 dark:text-gray-400 ml-2 text-lg">
                  /{formatMembershipDuration(billingOptions.find(opt => opt.cycle === selectedBilling)?.months || 1)}
                </span>
              </div>
              
              {/* Per month breakdown for longer plans */}
              {selectedBilling !== 'monthly' && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ₹{Math.round(getPlanData('silver', selectedBilling).amount / (billingOptions.find(opt => opt.cycle === selectedBilling)?.months || 1)).toLocaleString()} per month
                </div>
              )}
            </div>
            
            {/* Savings Badge */}
            {(function renderSavingsBadge(): React.ReactNode {
              const savings = calculateSavings('silver', selectedBilling);
              return savings && savings.percentage > 0 ? (
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold shadow-sm">
                  🎉 Save {savings.percentage}% • ₹{savings.amount.toLocaleString()} off
                </div>
              ) : (
                <div className="h-8"></div> // Placeholder to maintain spacing
              );
            })()}
          </div>

          {/* Features */}
          <div className="space-y-4 mb-8">
            {getPlanData('silver', selectedBilling).features.map((feature: string, index: number) => (
              <div key={`silver-feature-${index}`} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Value Proposition */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Perfect for</div>
              <div className="font-semibold text-gray-900 dark:text-white">Focused Learners</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Master one skill category deeply
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => handleSelectPlan('silver')}
            className="w-full bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 text-white py-4 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Select Silver Plan
          </button>
        </motion.div>

        {/* Gold Membership */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-3xl p-8 border-2 border-amber-200 dark:border-amber-700 hover:border-amber-300 dark:hover:border-amber-600 transition-all duration-300 hover:shadow-xl"
        >
          {/* Popular Badge */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
              Most Popular
            </div>
          </div>

          {/* Plan Header */}
          <div className="text-center mb-8 mt-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl mb-4">
              <Crown className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Gold Membership
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Perfect for diverse skill acquisition. Access to 3 course categories with exclusive benefits.
            </p>
          </div>

          {/* Pricing */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <div className="flex items-baseline justify-center mb-2">
                <span className="text-5xl font-bold text-gray-900 dark:text-white">
                  ₹{getPlanData('gold', selectedBilling).amount.toLocaleString()}
                </span>
                <span className="text-gray-600 dark:text-gray-400 ml-2 text-lg">
                  /{formatMembershipDuration(billingOptions.find(opt => opt.cycle === selectedBilling)?.months || 1)}
                </span>
              </div>
              
              {/* Per month breakdown for longer plans */}
              {selectedBilling !== 'monthly' && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ₹{Math.round(getPlanData('gold', selectedBilling).amount / (billingOptions.find(opt => opt.cycle === selectedBilling)?.months || 1)).toLocaleString()} per month
                </div>
              )}
            </div>
            
            {/* Savings Badge */}
            {(function renderSavingsBadge(): React.ReactNode {
              const savings = calculateSavings('gold', selectedBilling);
              return savings && savings.percentage > 0 ? (
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold shadow-sm">
                  🎉 Save {savings.percentage}% • ₹{savings.amount.toLocaleString()} off
                </div>
              ) : (
                <div className="h-8"></div> // Placeholder to maintain spacing
              );
            })()}
          </div>

          {/* Features */}
          <div className="space-y-4 mb-8">
            {getPlanData('gold', selectedBilling).features.map((feature: string, index: number) => (
              <div key={`gold-feature-${index}`} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Value Proposition */}
          <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl border border-amber-200 dark:border-amber-700">
            <div className="text-center">
              <div className="text-sm text-amber-700 dark:text-amber-300 mb-1">Perfect for</div>
              <div className="font-semibold text-amber-900 dark:text-amber-100">Multi-Skill Developers</div>
              <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                Explore 3 categories + career growth
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => handleSelectPlan('gold')}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Select Gold Plan
          </button>
        </motion.div>
      </div>

      {/* Pricing Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-16 mb-12"
      >
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Compare All Plans
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            See how much you save with longer commitments
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-2 text-gray-900 dark:text-white font-semibold">Duration</th>
                <th className="text-center py-4 px-2 text-gray-900 dark:text-white font-semibold">Silver Plan</th>
                <th className="text-center py-4 px-2 text-gray-900 dark:text-white font-semibold">Gold Plan</th>
                <th className="text-center py-4 px-2 text-gray-900 dark:text-white font-semibold">You Save</th>
              </tr>
            </thead>
            <tbody>
              {billingOptions.map((option, index) => {
                const silverPlan = getPlanData('silver', option.cycle);
                const goldPlan = getPlanData('gold', option.cycle);
                const silverSavings = calculateSavings('silver', option.cycle);
                const goldSavings = calculateSavings('gold', option.cycle);
                
                return (
                  <tr key={option.cycle} className={`border-b border-gray-100 dark:border-gray-700 ${selectedBilling === option.cycle ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">{option.label}</span>
                        {option.popular && (
                          <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs px-2 py-1 rounded-full font-medium">
                            Popular
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <div className="font-bold text-gray-900 dark:text-white text-lg">
                        ₹{silverPlan.amount.toLocaleString()}
                      </div>
                      {option.months > 1 && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ₹{Math.round(silverPlan.amount / option.months).toLocaleString()}/month
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-2 text-center">
                      <div className="font-bold text-gray-900 dark:text-white text-lg">
                        ₹{goldPlan.amount.toLocaleString()}
                      </div>
                      {option.months > 1 && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ₹{Math.round(goldPlan.amount / option.months).toLocaleString()}/month
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-2 text-center">
                      {silverSavings && silverSavings.percentage > 0 ? (
                        <div className="text-green-600 dark:text-green-400 font-semibold">
                          {silverSavings.percentage}% off
                        </div>
                      ) : (
                        <div className="text-gray-400">-</div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Additional Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-12"
      >
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 mb-8">
          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            🎓 What's Included in Every Plan
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div className="flex flex-col items-center gap-2">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">Community Access</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">Self-Paced Learning</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MessageCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">Live Q&A Sessions</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">Placement Assistance</span>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">
          ✅ All plans include a <strong>7-day money-back guarantee</strong>
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-sm">
          Cancel anytime • No hidden fees • Instant access • 24/7 support
        </p>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl"
        >
          <p className="text-yellow-800 dark:text-yellow-200 text-sm text-center">
            <strong>Note:</strong> Using fallback pricing data. {error}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default MembershipPricing; 