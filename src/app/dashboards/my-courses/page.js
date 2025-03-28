import ProtectedPage from "@/app/protectedRoutes";
import MyCoursesDashboard from "@/components/layout/main/dashboards/MyCoursesDashboard";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import React from "react";

const My_Courses = () => {
  return (
    <PageWrapper>
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <div className="px-6 py-12">  
          <MyCoursesDashboard />
          </div>
        </DashboardContainer>
        
      </main>
    </ProtectedPage>
    </PageWrapper>
  );
};

export default My_Courses;
