import ProtectedPage from "@/app/protectedRoutes";
import StudentPlacements from "@/components/layout/main/dashboards/AdminPlacements";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import React from "react";

export const metadata = {
  title: "Admin Enrollments",
  description: "Enrollments",
};

const Admin_Placements = () => {
  return (
    <ProtectedPage>
      <main>
        
          <div className="px-6">
            <HeadingDashboard />
          </div>
          <StudentPlacements />
        
      </main>
    </ProtectedPage>
  );
};

export default Admin_Placements;
