import AddCourse from "@/components/layout/main/dashboards/AddCourse";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

import DashboardWrapper from "@/components/shared/wrappers/DashboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import Previewdetail from "@/components/layout/main/dashboards/Previewdetail";
import ProtectedPage from "@/app/protectedRoutes";
export const metadata = {
  title: "Admin Reviews | Medh - Education LMS Template",
  description: "Admin Reviews | Medh - Education LMS Template",
};
const Add_data = () => {
  return (
    <ProtectedPage>
      <main>
        {/* <DashboardWrapper> */}
        <DashboardContainer>
          <HeadingDashboard />

          <Previewdetail />
        </DashboardContainer>
        {/* </DashboardWrapper> */}
        
      </main>
    </ProtectedPage>
  );
};

export default Add_data;
