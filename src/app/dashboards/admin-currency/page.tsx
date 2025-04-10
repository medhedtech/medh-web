"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminDashboardLayout from '@/components/sections/dashboards/AdminDashboardLayout';
import withAuth from '@/lib/withAuth';
import { UserRole } from '@/interfaces/userRole';

const AdminCurrencyPage = () => {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to admin dashboard with the hash parameter
    router.push('/dashboards/admin#admin-currency');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );
};

export default withAuth(AdminCurrencyPage, [UserRole.ADMIN.toString(), UserRole.SUPER_ADMIN.toString()]); 