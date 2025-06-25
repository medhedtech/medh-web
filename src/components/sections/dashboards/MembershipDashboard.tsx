"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Gift, Clock, CreditCard, Star, Shield, Zap } from "lucide-react";
import Link from "next/link";
import StudentDashboardLayout from "./StudentDashboardLayout";
import PremiumMembershipCard from "./PremiumMembershipCard";
import "@/styles/membership-dashboard.css";

interface MembershipPlan {
  id: string;
  name: string;
  type: 'basic' | 'premium' | 'enterprise';
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  isActive: boolean;
  expiryDate?: string;
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

// Updated TabButton with mobile-first design
const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children }) => (
  <motion.button
    onClick={onClick}
    className={`
      relative min-w-[120px] sm:min-w-[160px] rounded-md transition-all duration-300
      hover:bg-white/5 dark:hover:bg-white/5 
      focus:outline-none focus:ring-2 focus:ring-blue-500/20 
      touch-manipulation
      ${active ? 'text-white' : 'text-gray-600 dark:text-gray-400'}
    `}
    whileTap={{ scale: 0.98 }}
  >
    {active && (
      <motion.div
        layoutId="activeTab"
        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-md shadow-lg"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    {children}
  </motion.button>
);

const StudentMembership: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<MembershipPlan | null>(null);
  const [availablePlans, setAvailablePlans] = useState<MembershipPlan[]>([]);
  const [membershipType, setMembershipType] = useState<'Silver' | 'Gold' | null>(null);

  useEffect(() => {
    const fetchMembershipData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // TODO: Replace with actual API calls
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - will be replaced with real API data
        // For demo purposes, let's simulate a Gold membership
        // In production, this should come from your API
        const mockMembership = Math.random() > 0.5 ? 'Gold' : 'Silver'; // Random for demo
        setMembershipType(mockMembership); // Set to mockMembership for demo
        // setMembershipType(null); // Set to null for no membership state
        
        setCurrentPlan(null);
        setAvailablePlans([]);
        
      } catch (err) {
        console.error("Error fetching membership data:", err);
        setError("Failed to load membership data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembershipData();
  }, []);

  const tabs = [
    { name: "Enrolled Membership", content: [] },
    { name: "Upgrade / Downgrade Membership", content: [] },
    { name: "Pay Periodical Subscription", content: [] },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 dark:border-blue-400 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <span className="text-slate-600 dark:text-slate-400 text-lg font-medium">
            Loading your membership...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-6 bg-red-50 dark:bg-red-900/20 rounded-lg max-w-md">
          <Crown className="w-12 h-12 text-red-500" />
          <h3 className="text-xl font-semibold text-red-700 dark:text-red-400">Error Loading Membership</h3>
          <p className="text-red-600 dark:text-red-300 text-center">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-8 lg:p-12 rounded-lg max-w-7xl mx-auto"
    >
      <div className="flex flex-col space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center pt-4 sm:pt-6 pb-2 sm:pb-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-center mb-3 sm:mb-4"
          >
            <div className="p-2 bg-blue-100/80 dark:bg-blue-900/30 rounded-xl backdrop-blur-sm mr-3">
              <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              My Membership
            </h1>
          </motion.div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4 mb-4 sm:mb-6">
            Manage your membership plans and explore premium benefits
          </p>
        </div>

        {/* Tabs - in a scrollable container for mobile */}
        <div className="relative w-full">
        <div className="flex justify-center">
            <div className="w-full max-w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory touch-pan-x smooth-scroll pb-4 px-4 sm:px-0">
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 min-w-max mx-auto gap-1">
            {tabs.map((tab, idx) => {
              return (
                <TabButton
                  key={idx}
                  active={currentTab === idx}
                  onClick={() => setCurrentTab(idx)}
                >
                      <span className="relative z-10 font-medium whitespace-nowrap snap-center px-3 py-2">{tab.name}</span>
                </TabButton>
              );
            })}
              </div>
          </div>
          </div>
          
          {/* Scroll indicators */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 scroll-fade-left pointer-events-none md:hidden" style={{"--bg-color": "var(--tw-bg-white)"} as React.CSSProperties} />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 scroll-fade-right pointer-events-none md:hidden" style={{"--bg-color": "var(--tw-bg-white)"} as React.CSSProperties} />
        </div>

        {/* Demo Toggle - Remove in production */}
        <div className="text-center mb-6">
          <button
            onClick={() => {
              if (membershipType === null) {
                setMembershipType('Silver');
              } else if (membershipType === 'Silver') {
                setMembershipType('Gold');
              } else {
                setMembershipType(null);
              }
            }}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
          >
            Demo: Switch to {
              membershipType === null ? 'Silver' : 
              membershipType === 'Silver' ? 'Gold' : 
              'No Membership'
            }
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center text-center py-12"
          >
            {currentTab === 0 && (
              // Enrolled Membership
              <div className="w-full max-w-4xl mx-auto">
                <PremiumMembershipCard
                  membershipType={membershipType}
                  expiryDate={membershipType ? "March 15, 2025" : undefined}
                  plan={membershipType ? "QUARTERLY" : undefined}
                  onUpgrade={() => {
                    // Navigate to membership plans
                    window.location.href = "/medh-membership/";
                  }}
                  onRenew={() => {
                    // Handle renewal logic
                    console.log("Renewing membership...");
                  }}
                />
              </div>
            )}

            {currentTab === 1 && (
              // Upgrade / Downgrade Membership
              <>
                <Gift className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Upgrade Options Available
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Please check back later for membership upgrade and downgrade options.
                </p>
              </>
            )}

            {currentTab === 2 && (
              // Pay Periodical Subscription
              <>
                <CreditCard className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Subscription Payment Due
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your subscription payment information will appear here when due.
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const MembershipDashboard: React.FC = () => {
  return (
    <StudentDashboardLayout 
      userRole="student"
      fullName="Student"
      userEmail="student@example.com"
      userImage=""
      userNotifications={0}
      userSettings={{
        theme: "light",
        language: "en",
        notifications: true
      }}
    >
      <StudentMembership />
    </StudentDashboardLayout>
  );
};

export default MembershipDashboard;