import ProtectedPage from "@/app/protectedRoutes";
import AddCourse from "@/components/layout/main/dashboards/AddCourse";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

export const metadata = {
  title: "Admin Reviews",
  description: "Admin Reviews",
};
const Admin_Reviews = () => {
  return (
    <ProtectedPage>
      <main>
        {/* <DashboardWrapper> */}
        
          <div>
            <HeadingDashboard />
          </div>

          <AddCourse />
        
        {/* </DashboardWrapper> */}
        
      </main>
    </ProtectedPage>
  );
};

export default Admin_Reviews;
