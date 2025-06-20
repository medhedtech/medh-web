"use client";
import React from 'react';
import MembershipPricing from '@/components/sections/membership/MembershipPricing';
import type { TMembershipType, TBillingCycle } from '@/apis/membership/membership';

export default function MembershipExamplePage() {
  const handlePlanSelection = (membershipType: TMembershipType, billingCycle: TBillingCycle, amount: number) => {
    console.log('Plan selected:', { membershipType, billingCycle, amount });
    // Here you would typically redirect to payment or enrollment flow
    alert(`Selected: ${membershipType.toUpperCase()} plan for ₹${amount.toLocaleString()} (${billingCycle})`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MembershipPricing 
        onSelectPlan={handlePlanSelection}
        className="py-8"
      />
    </div>
  );
} 