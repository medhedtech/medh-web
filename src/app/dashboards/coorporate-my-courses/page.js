import ProtectedPage from "@/app/protectedRoutes";
import CoorporateMyCoursesDashboard from "@/components/layout/main/dashboards/CoorporateMyCourses_Dashboard";


import React from "react";

const Coorporate_My_Courses = () => {
  return (
    <ProtectedPage>
      <main>
        
          <CoorporateMyCoursesDashboard />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Coorporate_My_Courses;
