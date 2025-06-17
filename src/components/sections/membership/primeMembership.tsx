"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Star, ArrowRight, CheckCircle, AlertCircle, X } from "lucide-react";
import SelectCourseModal from "@/components/layout/main/dashboards/SelectCourseModal";
import LoginForm from "@/components/shared/login/LoginForm";
import MembershipBanner from "./membershipBanner";

// TypeScript interfaces
interface IPlan {
  duration: string;
  price: string;
  period: string;
}

interface IMembershipData {
  type: string;
  icon: React.ReactNode;
  color: 'primary' | 'amber';
  plans: IPlan[];
  description: string;
  features: string[];
}

interface IPlans {
  [key: string]: {
    silver: string;
    gold: string;
    period: string;
  };
}

const membershipData: IMembershipData[] = [
  {
    type: "Silver",
    icon: <Star className="w-6 h-6" />,
    color: "primary",
    plans: [
      { duration: "MONTHLY", price: "INR 999.00", period: "per month" },
      { duration: "QUARTERLY", price: "INR 2,499.00", period: "per 3 months" },
      { duration: "HALF-YEARLY", price: "INR 3,999.00", period: "per 6 months" },
      { duration: "ANNUALLY", price: "INR 4,999.00", period: "per annum" },
    ],
    description:
      "Ideal for focused skill development. Explore and learn all self-paced blended courses within any 'Single-Category' of your preference.",
    features: [
      "Access to LIVE Q&A Doubt Clearing Sessions",
      "Special discount on all live courses",
      "Community access",
      "Access to free courses",
      "Placement Assistance"
    ]
  },
  {
    type: "Gold",
    icon: <Crown className="w-6 h-6" />,
    color: "amber",
    plans: [
      { duration: "MONTHLY", price: "INR 1,999.00", period: "per month" },
      { duration: "QUARTERLY", price: "INR 3,999.00", period: "per 3 months" },
      { duration: "HALF-YEARLY", price: "INR 5,999.00", period: "per 6 months" },
      { duration: "ANNUALLY", price: "INR 6,999.00", period: "per annum" },
    ],
    description:
      "Perfect for diverse skill acquisition. Explore and learn all self-paced blended courses within any '03-Categories' of your preference.",
    features: [
      "Access to LIVE Q&A Doubt Clearing Sessions",
      "Minimum 15% discount on all live courses",
      "Community access",
      "Access to free courses",
      "Career Counselling",
      "Placement Assistance"
    ]
  },
];

const PrimeMembership: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>("Monthly");
  const [selectedMembershipType, setSelectedMembershipType] = useState<string>(""); // "Silver" or "Gold" or ""
  const [selectedSilverPlan, setSelectedSilverPlan] = useState<string>("MONTHLY");
  const [selectedGoldPlan, setSelectedGoldPlan] = useState<string>("MONTHLY");
  const [isSelectCourseModalOpen, setSelectCourseModalOpen] = useState<boolean>(false);
  const [planType, setPlanType] = useState<string>("");
  const [selectedMembership, setSelectedMembership] = useState<string>("");
  const [isLoginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const plans: IPlans = {
    Monthly: { silver: "$49", gold: "$59", period: "per month" },
    Quarterly: { silver: "$129", gold: "$149", period: "per 3 months" },
    "Half-Yearly": { silver: "$249", gold: "$299", period: "per 6 months" },
    Yearly: { silver: "$499", gold: "$599", period: "per year" },
  };

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
    // Set the selected membership type (this will deselect the other one)
    setSelectedMembershipType(membershipType);
    
    if (membershipType === "Silver") {
      setSelectedSilverPlan(planDuration);
    } else if (membershipType === "Gold") {
      setSelectedGoldPlan(planDuration);
    }
  };

  return (
    <>
      {/* Membership Banner */}
      <MembershipBanner />
      
      {/* Membership Plans Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-gradient-to-br from-primary-500/10 via-secondary-500/10 to-transparent rounded-full blur-3xl opacity-60 -translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-primary-500/10 via-secondary-500/10 to-transparent rounded-full blur-3xl opacity-60 translate-x-1/4 translate-y-1/4"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <h1 id="choose-membership" className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
              Choose Your <span className="text-primary-500 dark:text-primary-400">MEDH</span> Membership
            </h1>
          </motion.div>

          {/* Membership Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {membershipData.map((membership: IMembershipData, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border-2 ${
                  membership.color === 'amber' 
                    ? 'border-amber-200 dark:border-amber-800' 
                    : 'border-primary-200 dark:border-primary-800'
                }`}
              >
                {/* Header */}
                <div className={`p-6 ${
                  membership.color === 'amber' 
                    ? 'bg-gradient-to-r from-amber-500/10 to-amber-600/10' 
                    : 'bg-gradient-to-r from-primary-500/10 to-primary-600/10'
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      membership.color === 'amber'
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                        : 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    }`}>
                      {membership.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {membership.type}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Membership
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {membership.description}
                  </p>
                </div>

                {/* Plans Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    {membership.plans.map((plan: IPlan, idx: number) => {
                      const isSelected = selectedMembershipType === membership.type && (
                        membership.type === "Silver" 
                          ? selectedSilverPlan === plan.duration 
                          : selectedGoldPlan === plan.duration
                      );
                      
                      return (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handlePlanSelection(membership.type, plan.duration)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 text-left ${
                            isSelected
                              ? membership.color === 'amber'
                                ? 'border-amber-500 bg-amber-50 dark:border-amber-400 dark:bg-amber-900/20 shadow-lg'
                                : 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20 shadow-lg'
                              : membership.color === 'amber'
                                ? 'border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-900/10'
                                : 'border-primary-200 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/10'
                          }`}
                        >
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {plan.duration}
                          </p>
                          <p className={`text-xl font-bold ${
                            membership.color === 'amber'
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-primary-600 dark:text-primary-400'
                          }`}>
                            {plan.price}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {plan.period}
                          </p>
                          {isSelected && (
                            <CheckCircle className={`w-5 h-5 mt-2 ${
                              membership.color === 'amber'
                                ? 'text-amber-500 dark:text-amber-400'
                                : 'text-primary-500 dark:text-primary-400'
                            }`} />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Features */}
                  <div className="mt-6 space-y-3">
                    {membership.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className={`w-5 h-5 ${
                          membership.color === 'amber'
                            ? 'text-amber-500 dark:text-amber-400'
                            : 'text-primary-500 dark:text-primary-400'
                        }`} />
                        <span className="text-gray-600 dark:text-gray-300">
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
                    className={`mt-6 w-full py-3 px-6 rounded-lg flex items-center justify-center gap-2 ${
                      membership.color === 'amber'
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : 'bg-primary-500 hover:bg-primary-600 text-white'
                    }`}
                  >
                    Select {membership.type} Plan
                    <ArrowRight className="w-5 h-5" />
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
            className="text-center mb-12"
          >
            <div className="bg-gradient-to-r from-primary-50 to-amber-50 dark:from-primary-900/20 dark:to-amber-900/20 rounded-2xl p-8 max-w-2xl mx-auto border border-primary-200 dark:border-primary-800">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">
                START YOUR 7-DAY FREE TRIAL TODAY
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                No commitment • Cancel anytime
              </p>
            </div>
          </motion.div>

          {/* Note Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 max-w-3xl mx-auto"
          >
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
              <p className="text-yellow-800 dark:text-yellow-200 text-sm text-center">
                Note: Only Medh&#39;s Blended Courses having &#39;Pre-Recorded Videos
                with Live Interactive Doubt Clearing Sessions&#39; would be eligible
                for these memberships.
              </p>
            </div>
          </motion.div>

          {/* Explore More Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const element = document.getElementById('membership-features');
                if (element) {
                  element.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }
              }}
              className="inline-flex items-center px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Explore More Features
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>

        {/* Modals */}
        {isSelectCourseModalOpen && (
          <SelectCourseModal
            isOpen={isSelectCourseModalOpen}
            onClose={() => setSelectCourseModalOpen(false)}
            planType={planType}
            amount={plans[selectedPlan][planType as keyof typeof plans[string]]}
            selectedPlan={selectedPlan}
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
};

export default PrimeMembership;
