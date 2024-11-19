import StudentProfileMain from "@/components/layout/main/dashboards/StudentProfileMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Student Profile | Edurock - Education LMS Template",
  description: "Student Profile | Edurock - Education LMS Template",
};
const Student_Profile = () => {
  return (
    // <PageWrapper>
    <main>
      {/* <DsahboardWrapper> */}
      <DashboardContainer>
        <div className="px-4">
          <HeadingDashboard />
        </div>
        <StudentProfileMain />
      </DashboardContainer>
      {/* </DsahboardWrapper> */}
      <ThemeController />
    </main>
    // </PageWrapper>
  );
};

export default Student_Profile;
