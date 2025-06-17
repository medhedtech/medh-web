import ProtectedPage from "@/app/protectedRoutes";
import StudentProfileMain from "@/components/layout/main/dashboards/StudentProfileMain";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

export const metadata = {
  title: "Student Profile | Medh - Education",
  description: "Student Profile | Medh - Education",
};
const Student_Profile = () => {
  return (
    <ProtectedPage>
      <main>
        
          <div>
            <HeadingDashboard />
          </div>
          <StudentProfileMain />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Student_Profile;
