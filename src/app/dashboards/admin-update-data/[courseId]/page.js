import AddCourse from "@/components/layout/main/dashboards/AddCourse";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import PreviewUpdateDetail from "@/components/layout/main/dashboards/PreviewUpdateDetail";
export const metadata = {
  title: "Admin Reviews | Medh - Education LMS Template",
  description: "Admin Reviews | Medh - Education LMS Template",
};
const Update_data = () => {
  return (
    // <PageWrapper>
      <main>
        {/* <DsahboardWrapper> */}
          <DashboardContainer>
           <HeadingDashboard />
          
           <PreviewUpdateDetail />
        
          </DashboardContainer>
        {/* </DsahboardWrapper> */}
        <ThemeController />
      </main>
    // </PageWrapper>
  );
};

export default Update_data;
