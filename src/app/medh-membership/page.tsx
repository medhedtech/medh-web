"use client";
import React, { Suspense, useEffect } from "react";
import { NextPage } from "next";
import dynamic from "next/dynamic";

// Dynamic imports with loading priority
const MembershipBanner = dynamic(() => import("@/components/sections/membership/membershipBanner"), {
  loading: () => <SectionLoader text="Loading banner..." />,
  ssr: true,
});

const MembershipOverview = dynamic(() => import("@/components/sections/membership/membershipOverview"), {
  loading: () => <SectionLoader text="Loading overview..." />,
  ssr: true,
});

const MembershipFaq = dynamic(() => import("@/components/sections/membership/membershipFaq"), {
  loading: () => <SectionLoader text="Loading FAQ..." />,
  ssr: true,
});

const MembershipCourceBanner = dynamic(() => import("@/components/sections/membership/membershipCourseBanner"), {
  loading: () => <SectionLoader text="Loading courses..." />,
  ssr: true,
});

const PrimeMembership = dynamic(() => import("@/components/sections/membership/primeMembership"), {
  loading: () => <SectionLoader text="Loading prime benefits..." />,
  ssr: true,
});

const MembershipFeatures = dynamic(() => import("@/components/sections/membership/membershipFeatures"), {
  loading: () => <SectionLoader text="Loading features..." />,
  ssr: true,
});

const Certified = dynamic(() => import("@/components/sections/why-medh/Certified"), {
  loading: () => <SectionLoader text="Loading certifications..." />,
  ssr: true,
});

// Components that don't need to be dynamically imported
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

// TypeScript interfaces
interface ISectionLoaderProps {
  text: string;
}

// Enhanced loading component with skeleton animation
const SectionLoader: React.FC<ISectionLoaderProps> = ({ text }) => (
  <div className="w-full min-h-[300px] flex flex-col items-center justify-center space-y-4 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse">
    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>
  </div>
);

const MembershipPage: NextPage = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const shouldScroll = sessionStorage.getItem('scrollToMembershipCard');
      if (shouldScroll) {
        let attempts = 0;
        const maxAttempts = 20; // 2 seconds (20 x 100ms)
        const interval = setInterval(() => {
          const el = document.getElementById('membership-cards');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            sessionStorage.removeItem('scrollToMembershipCard');
            clearInterval(interval);
          } else if (++attempts > maxAttempts) {
            clearInterval(interval);
          }
        }, 100);
      }
    }
  }, []);
  return (
    <PageWrapper>
      <MembershipBanner />
      <PrimeMembership />
      <MembershipFeatures />
      <Certified />
      <MembershipFaq />
    </PageWrapper>
  );
};

export default MembershipPage;
