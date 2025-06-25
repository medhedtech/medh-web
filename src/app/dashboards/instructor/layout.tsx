"use client"
import ProtectedPage from "@/app/protectedRoutes";
import InstructorDashboardLayout from "@/components/layout/main/dashboards/InstructorDashboardLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedPage>
      <InstructorDashboardLayout>
        {children}
      </InstructorDashboardLayout>
    </ProtectedPage>
  );
} 