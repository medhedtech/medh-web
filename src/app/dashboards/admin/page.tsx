"use client";

import { Suspense } from 'react';
import Loading from "@/app/loading";
import dynamic from 'next/dynamic';

// Import AdminDashboard component with authentication
const AdminDashboard = dynamic(
  () => import("@/components/sections/dashboards/AdminDashboard"),
  { 
    loading: () => <Loading/>,
    ssr: false // Now allowed since this is a client component
  }
);

// Metadata will be handled by the layout or individual components

function AdminDashboardPage() {
  return (
    <Suspense fallback={<Loading/>}>
      <AdminDashboard />
    </Suspense>
  );
}

// Export without withAuth HOC - authentication will be handled in the AdminDashboard component
export default AdminDashboardPage;