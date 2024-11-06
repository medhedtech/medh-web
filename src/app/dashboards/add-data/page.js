import AddCourse from "@/components/layout/main/dashboards/AddCourse";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Admin Reviews | Edurock - Education LMS Template",
  description: "Admin Reviews | Edurock - Education LMS Template",
};
const Add_data = () => {
  return (
    <PageWrapper>
      <main>
        {/* <DsahboardWrapper> */}
          <DashboardContainer>
           <HeadingDashboard />
           <div>hello</div>
        
          </DashboardContainer>
        {/* </DsahboardWrapper> */}
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Add_data;
