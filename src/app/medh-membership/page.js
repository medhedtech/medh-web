import React, { Suspense } from "react";
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


// Enhanced loading component with skeleton animation
const SectionLoader = ({ text }) => (
  <div className="w-full min-h-[300px] flex flex-col items-center justify-center space-y-4 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse">
    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>
  </div>
);

export default function MembershipPage() {
  return (
    <PageWrapper>
      <main className="min-h-screen">
        <Suspense fallback={<SectionLoader text="Loading banner..." />}>
          <MembershipBanner />
        </Suspense>
        <Suspense fallback={<SectionLoader text="Loading overview..." />}>
          <MembershipOverview />
        </Suspense>
        <Suspense fallback={<SectionLoader text="Loading features..." />}>
          <MembershipFeatures />
        </Suspense>
        <Suspense fallback={<SectionLoader text="Loading prime benefits..." />}>
          <PrimeMembership />
        </Suspense>
        <Suspense fallback={<SectionLoader text="Loading FAQ..." />}>
          <MembershipFaq />
        </Suspense>
        <Suspense fallback={<SectionLoader text="Loading courses..." />}>
          <MembershipCourceBanner />
        </Suspense>
        <div className="bg-white dark:bg-screen-dark pb-16">
          <Suspense fallback={<SectionLoader text="Loading certifications..." />}>
            <Certified />
          </Suspense>
        </div>
        
      </main>
    </PageWrapper>
  );
}
