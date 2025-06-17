// import ProtectedPage from "@/app/protectedRoutes";
// import CorporateDashboardMain from "@/components/layout/main/dashboards/CorporateDashboardMain";
// 
// 
// export const metadata = {
//   title: "Corporate Dashboard | Medh - Education LMS Template",
//   description: "Corporate Dashboard | Medh - Education LMS Template",
// };
// const Corporate_Dashboard = () => {
//   return (
//     <ProtectedPage>
//       <main>
//         
//           <CorporateDashboardMain />
//         
//         
//       </main>
//     </ProtectedPage>
//   );
// };

// export default Corporate_Dashboard;

import ProtectedPage from "@/app/protectedRoutes";
import CoorporateMyCoursesDashboard from "@/components/layout/main/dashboards/CoorporateMyCourses_Dashboard";
import CoorporateAdminMyCoursesDashboard from "@/components/layout/main/dashboards/Corporate-Admin-My-Courses";


import React from "react";

const Coorporate_Dashboard = () => {
  return (
    <ProtectedPage>
      <main>
        
          {/* <CoorporateMyCoursesDashboard /> */}
          <CoorporateAdminMyCoursesDashboard/>
        
        
      </main>
    </ProtectedPage>
  );
};

export default Coorporate_Dashboard;

