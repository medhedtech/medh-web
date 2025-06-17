import ProtectedPage from "@/app/protectedRoutes";
import MyCoursesDashboard from "@/components/layout/main/dashboards/MyCoursesDashboard";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import React from "react";

const My_Courses = () => {
  return (
    <PageWrapper>
    <ProtectedPage>
      <main>
        
          <div className="px-6 py-12">  
          <MyCoursesDashboard />
          </div>
        
        
      </main>
    </ProtectedPage>
    </PageWrapper>
  );
};

export default My_Courses;
