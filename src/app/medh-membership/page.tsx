import React, { Suspense } from "react";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { buildAdvancedComponent, getResponsive } from "@/utils/designSystem";
import Image from "next/image";

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
  return (
    <PageWrapper>
      {/* Glassmorphic Hero Section */}
      <section className="relative min-h-[320px] flex items-center justify-center bg-slate-50 dark:bg-slate-900 py-8 sm:py-12 md:py-16">
        <div className="absolute inset-0 pointer-events-none select-none">
          {/* Optional: background pattern or gradient */}
        </div>
        <div className="relative z-10 max-w-2xl w-full mx-auto px-4">
          <div className="backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border border-white/20 dark:border-slate-800/40 rounded-2xl shadow-lg p-6 sm:p-10 flex flex-col items-center text-center">
            <Image
              src="/assets/images/membership/medh-membership.svg"
              alt="Medh Membership"
              width={80}
              height={80}
              className="mb-4"
              priority
            />
            <h1 className={getResponsive.fluidText('heading') + " font-bold text-slate-900 dark:text-slate-100 mb-2"}>
              Unlock <span className="text-[#3bac63]">Medh Membership</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 mb-2 max-w-xl mx-auto">
              Exclusive benefits, premium resources, and a thriving community—designed to help you grow, learn, and succeed with Medh.
            </p>
          </div>
        </div>
      </section>
      <PrimeMembership />
      <MembershipFeatures />
      <Certified />
      <MembershipFaq />
    </PageWrapper>
  );
};

export default MembershipPage;
