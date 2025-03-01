import ProtectedPage from "@/app/protectedRoutes";
import CoorporateStudentProfile_Main from "@/components/layout/main/dashboards/CoorporateStudentProfile_Details";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboardOnly from "@/components/shared/headings/HeadingDashbordsOnly";


export const metadata = {
  title: "Corporate Student Profile | Medh",
  description: "Corporate Profile | Medh - Education",
};
const Coorporate_Student_Profile = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <div className="px-4">
            <HeadingDashboardOnly />
          </div>
          <CoorporateStudentProfile_Main />
        </DashboardContainer>
        
      </main>
    </ProtectedPage>
  );
};

export default Coorporate_Student_Profile;
