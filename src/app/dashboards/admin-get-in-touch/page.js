import ProtectedPage from "@/app/protectedRoutes";
import GetInTouch from "@/components/layout/main/dashboards/AdminGetInTouch";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

export const metadata = {
  title: "Admin Get In Touch",
  description: "Get In Touch",
};
const Admin_Contacts = () => {
  return (
    <ProtectedPage>
    <main>
      
        <div className="px-6">
          <HeadingDashboard />
        </div>
        <GetInTouch />
      
      
    </main>
    </ProtectedPage>
  );
};

export default Admin_Contacts;
