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
                        {membership.type}
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
                          <p className={`text-lg md:text-xl font-bold ${
                            membership.color === 'amber'
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-blue-600 dark:text-blue-400'
                          }`}>
                            {plan.price}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {plan.period}
                          </p>
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
                    className={`mt-6 w-full py-3 md:py-4 px-6 rounded-lg flex items-center justify-center gap-2 font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 min-h-[44px] ${
                      membership.color === 'amber'
                        ? 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white'
                    }`}
                  >
                    Select {membership.type} Plan
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-200 group-hover:translate-x-1" />
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
