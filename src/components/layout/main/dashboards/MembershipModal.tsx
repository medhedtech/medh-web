"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Check, Star, Zap, Shield, Clock, Users, BookOpen } from 'lucide-react';
import { useToast } from '@/components/shared/ui/ToastProvider';

interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  duration: string;
  popular?: boolean;
  features: string[];
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const membershipPlans: MembershipPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 999,
    originalPrice: 1499,
    duration: 'month',
    features: [
      'Access to 10+ courses',
      'Standard video quality',
      'Community support',
      'Basic certificates',
      'Mobile app access'
    ],
    icon: BookOpen,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 1999,
    originalPrice: 2999,
    duration: 'month',
    popular: true,
    features: [
      'Access to 50+ courses',
      'HD video quality',
      'Priority support',
      'Verified certificates',
      'Offline downloads',
      'Live sessions access',
      'Career guidance'
    ],
    icon: Crown,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 4999,
    originalPrice: 7499,
    duration: 'month',
    features: [
      'Unlimited course access',
      '4K video quality',
      'Dedicated support',
      'Industry certificates',
      'Advanced analytics',
      'Custom learning paths',
      'One-on-one mentoring',
      'Job placement assistance'
    ],
    icon: Zap,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  }
];

const MembershipModal: React.FC<MembershipModalProps> = ({ isOpen, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleUpgrade = async (): Promise<void> => {
    const plan = membershipPlans.find(p => p.id === selectedPlan);
    if (!plan) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showToast.success(
        `Successfully upgraded to ${plan.name} plan! Welcome to your enhanced learning experience.`,
        { duration: 5000 }
      );
      
      onClose();
    } catch (error) {
      showToast.error('Failed to upgrade membership. Please try again.', { duration: 4000 });
    } finally {
      setIsLoading(false);
    }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        duration: 0.5,
        bounce: 0.3
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.3
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={backdropVariants}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30">
                <Crown className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Upgrade Your Membership
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose the perfect plan for your learning journey
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Benefits Banner */}
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-6 h-6 text-amber-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Why Upgrade?
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Verified Certificates
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Expert Mentorship
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-purple-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Lifetime Access
                  </span>
                </div>
              </div>
            </div>

            {/* Membership Plans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {membershipPlans.map((plan) => {
                const IconComponent = plan.icon;
                const isSelected = selectedPlan === plan.id;
                
                return (
                  <motion.div
                    key={plan.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? `${plan.borderColor} ${plan.bgColor} shadow-lg`
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-1 rounded-full text-xs font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="text-center">
                      <div className={`inline-flex p-3 rounded-xl ${plan.bgColor} mb-4`}>
                        <IconComponent className={`w-8 h-8 ${plan.color}`} />
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {plan.name}
                      </h3>
                      
                      <div className="mb-4">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            ₹{plan.price}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            /{plan.duration}
                          </span>
                        </div>
                        {plan.originalPrice && (
                          <div className="flex items-center justify-center gap-2 mt-1">
                            <span className="text-sm text-gray-500 line-through">
                              ₹{plan.originalPrice}
                            </span>
                            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                              Save {Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)}%
                            </span>
                          </div>
                        )}
                      </div>

                      <ul className="text-left space-y-3 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-3">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 right-4"
                        >
                          <div className={`w-6 h-6 rounded-full ${plan.color.replace('text-', 'bg-')} flex items-center justify-center`}>
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Maybe Later
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpgrade}
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[200px]"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    <Crown className="w-5 h-5" />
                    Upgrade Now
                  </>
                )}
              </motion.button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>Instant Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  <span>50,000+ Happy Learners</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MembershipModal; 