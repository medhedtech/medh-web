"use client";

import dynamic from "next/dynamic";

// Import the dashboard component dynamically with SSR disabled
const UpcomingClassesDashboard = dynamic(
  () => import('@/components/sections/dashboards/UpcomingClassesDashboard'),
  { ssr: false }
);

/**
 * ClientWrapper - Client component that handles the dynamic import
 */
export default function ClientWrapper() {
  return <UpcomingClassesDashboard />;
} 