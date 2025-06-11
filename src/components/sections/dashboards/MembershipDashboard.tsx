"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Crown, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  CreditCard, 
  Gift,
  Star,
  Clock,
  AlertCircle,
  Shield,
  Zap,
  Users,
  BookOpen,
  Award,
  RefreshCw
} from 'lucide-react';
import StudentDashboardLayout from '@/components/sections/dashboards/StudentDashboardLayout';

// Types for membership data
interface IMembershipPlan {
  id: string;
  name: string;
  type: 'basic' | 'premium' | 'enterprise';
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  isActive: boolean;
  expiryDate?: string;
}

interface IMembershipHistory {
  id: string;
  planName: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: 'active' | 'expired' | 'cancelled';
  paymentMethod: string;
}

interface IMembershipBenefit {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isAvailable: boolean;
  usageCount?: number;
  maxUsage?: number;
}

const MembershipContent: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<IMembershipPlan | null>(null);
  const [membershipHistory, setMembershipHistory] = useState<IMembershipHistory[]>([]);
  const [membershipBenefits, setMembershipBenefits] = useState<IMembershipBenefit[]>([]);
  const [availablePlans, setAvailablePlans] = useState<IMembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'enrolled' | 'upgrade-downgrade' | 'pay-subscription'>('enrolled');

  // Format date function
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fetch membership data
  const fetchMembershipData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: Replace with actual API calls
      // const response = await fetch('/api/student/membership');
      // const data = await response.json();
      
      // Mock data for now - will be replaced with real API data
      setCurrentPlan(null);
      setMembershipHistory([]);
      setMembershipBenefits([]);
      setAvailablePlans([]);
      
    } catch (err) {
      setError('Failed to load membership data. Please try again.');
      console.error('Error fetching membership data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembershipData();
  }, [fetchMembershipData]);

  const handleRetry = () => {
    fetchMembershipData();
  };

  const getPlanIcon = (type: string) => {
    switch (type) {
      case 'basic':
        return <Shield className="w-5 h-5" />;
      case 'premium':
        return <Crown className="w-5 h-5" />;
      case 'enterprise':
        return <Zap className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const getPlanColor = (type: string) => {
    switch (type) {
      case 'basic':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'premium':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'enterprise':
        return 'bg-orange-50 border-orange-200 text-orange-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading membership details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Membership</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Membership</h1>
          <p className="text-gray-600">Manage your subscription and benefits</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {[
            { key: 'enrolled', label: 'Enrolled Membership', icon: <CheckCircle className="w-4 h-4" /> },
            { key: 'upgrade-downgrade', label: 'Upgrade / Downgrade Membership', icon: <RefreshCw className="w-4 h-4" /> },
            { key: 'pay-subscription', label: 'Pay Periodical Subscription', icon: <CreditCard className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'enrolled' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Enrolled Membership</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              View and manage your current membership enrollment details, including plan features and benefits.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-gray-500">No active enrollment found</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'upgrade-downgrade' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center py-12">
            <RefreshCw className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upgrade / Downgrade Membership</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Modify your current membership plan. Upgrade to unlock more features or downgrade to reduce costs.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-gray-500">Plan modification options will appear here</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pay-subscription' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-purple-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pay Periodical Subscription</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Manage your subscription payments, view billing history, and update payment methods.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-gray-500">Payment options and billing details will appear here</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MembershipDashboard: React.FC = () => {
  const [studentId, setStudentId] = useState<string | null>(null);

  React.useEffect(() => {
    // In a real implementation, you would get the student ID from authentication
    // For demo purposes, we're using a mock ID
    const mockStudentId = '123456789';
    setStudentId(mockStudentId);
    
    // Alternative: Get from local storage or auth service
    // const user = JSON.parse(localStorage.getItem('user') || '{}');
    // setStudentId(user?.id || null);
  }, []);

  return (
    <StudentDashboardLayout 
      userRole="student"
      fullName="Student User" // In real app, get from user data
      userEmail="student@example.com" // In real app, get from user data
      userImage="" // In real app, get from user data
      userNotifications={0}
      userSettings={{
        theme: "light",
        language: "en",
        notifications: true
      }}
    >
      {studentId && <MembershipContent />}
    </StudentDashboardLayout>
  );
};

export default MembershipDashboard; 