"use client";

import React from 'react';
import ProtectedPage from '@/app/protectedRoutes';
import InstructorDashboardLayout from '@/components/layout/main/dashboards/InstructorDashboard';

interface InstructorLayoutProps {
  children: React.ReactNode;
}

export default function InstructorLayout({ children }: InstructorLayoutProps) {
  return (
    <ProtectedPage>
      <InstructorDashboardLayout>
        {children}
      </InstructorDashboardLayout>
    </ProtectedPage>
  );
} 