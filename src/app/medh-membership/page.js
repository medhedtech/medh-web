
import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { Metadata } from "next";

// Dynamic imports for better performance
const MembershipBanner = dynamic(() => import("@/components/sections/membership/membershipBanner"), {
  ssr: true,
});
const MembershipOverview = dynamic(() => import("@/components/sections/membership/membershipOverview"), {
  ssr: true,
});
const MembershipFaq = dynamic(() => import("@/components/sections/membership/membershipFaq"), {
  ssr: true,
});
const MembershipCourceBanner = dynamic(() => import("@/components/sections/membership/membershipCourseBanner"), {
  ssr: true,
});
const PrimeMembership = dynamic(() => import("@/components/sections/membership/primeMembership"), {
  ssr: true,
});
const MembershipFeatures = dynamic(() => import("@/components/sections/membership/membershipFeatures"), {
  ssr: true,
});
const Certified = dynamic(() => import("@/components/sections/why-medh/Certified"), {
  ssr: true,
});

// Components that don't need to be dynamically imported
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ThemeController from "@/components/shared/others/ThemeController";

// Loading fallback component
const LoadingFallback = () => (
  <div className="w-full h-32 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
  </div>
);

export const metadata = {
  title: 'Medh Membership - Join Our Learning Community',
  description: 'Explore Medh membership plans and unlock premium learning resources, expert-led courses, and exclusive benefits.',
};

export default function Membership() {
  return (
    <PageWrapper>
      <main className="min-h-screen bg-white dark:bg-gray-900">
        <Suspense fallback={<LoadingFallback />}>
          <div className="space-y-12 md:space-y-16">
            <MembershipBanner />
            
            <section className="container mx-auto px-4">
              <MembershipOverview />
            </section>
            
            <section className="bg-gray-50 dark:bg-gray-800 py-12">
              <div className="container mx-auto px-4">
                <PrimeMembership />
              </div>
            </section>
            
            <section className="container mx-auto px-4">
              <MembershipFeatures />
            </section>
            
            <section className="bg-gray-50 dark:bg-gray-800 py-12">
              <div className="container mx-auto px-4">
                <MembershipFaq />
              </div>
            </section>
            
            <section className="container mx-auto px-4">
              <MembershipCourceBanner />
            </section>
            
            <section className="pb-16 container mx-auto px-4">
              <Certified />
            </section>
          </div>
        </Suspense>
        
        <div className="fixed bottom-4 right-4 z-50">
          <ThemeController />
        </div>
      </main>
    </PageWrapper>
  );
}
