"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Gift, Clock, CreditCard, Star, Shield, Zap } from "lucide-react";
import Link from "next/link";
import StudentDashboardLayout from "./StudentDashboardLayout";

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

// Updated TabButton with blog-style filter button styling
const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 overflow-hidden group ${
      active
        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:shadow-lg'
        : 'glass-stats text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/20 dark:hover:bg-gray-700/20'
    }`}
  >
    {/* Animated background for active state */}
    {active && (
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 animate-gradient-x"></div>
    )}
    
    {/* Shimmer effect on hover */}
    <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100"></div>
    
    <span className="relative z-10 group-hover:scale-110 transition-transform">{children}</span>
  </motion.button>
);

const StudentMembership: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<MembershipPlan | null>(null);
  const [availablePlans, setAvailablePlans] = useState<MembershipPlan[]>([]);

  useEffect(() => {
    const fetchMembershipData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // TODO: Replace with actual API calls
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - will be replaced with real API data
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
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-3"
        >
          <Crown className="w-8 h-8 text-primary-500" />
          <span className="text-gray-600 dark:text-gray-400 text-lg">Loading your membership...</span>
        </motion.div>
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
      className="p-8 lg:p-12 rounded-lg max-w-7xl mx-auto"
    >
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="text-center pt-6 pb-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-center mb-4"
          >
            <div className="p-2 bg-primary-100/80 dark:bg-primary-900/30 rounded-xl backdrop-blur-sm mr-3">
              <Crown className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              My Membership
            </h1>
          </motion.div>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4 mb-6">
            Manage your membership plans and explore premium benefits
          </p>
        </div>

        {/* Tabs - in a box container */}
        <div className="flex justify-center">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {tabs.map((tab, idx) => {
              return (
                <TabButton
                  key={idx}
                  active={currentTab === idx}
                  onClick={() => setCurrentTab(idx)}
                >
                  <span className="relative z-10 font-medium">{tab.name}</span>
                </TabButton>
              );
            })}
          </div>
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
              <>
                <Crown className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Enrolled Membership
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
                  You don't have an enrolled membership plan yet. Choose from our available plans to unlock premium features and benefits.
                </p>
                <Link
                  href="/medh-membership/"
                  className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Browse Membership Plans
                </Link>
              </>
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