import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

import PreviewUpdateDetail from "@/components/layout/main/dashboards/PreviewUpdateDetail";
import ProtectedPage from "@/app/protectedRoutes";
export const metadata = {
  title: "Admin Reviews | Medh - Education LMS Template",
  description: "Admin Reviews | Medh - Education LMS Template",
};
const Update_data = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <HeadingDashboard />
          <PreviewUpdateDetail />
        </DashboardContainer>
        
      </main>
    </ProtectedPage>
  );
};

export default Update_data;
