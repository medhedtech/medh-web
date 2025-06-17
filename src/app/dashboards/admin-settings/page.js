import ProtectedPage from "@/app/protectedRoutes";
import AdminSettingsMain from "@/components/layout/main/dashboards/AdminSettingsMain";



export const metadata = {
  title: "Admin Settings | Medh - Education LMS Template",
  description: "Admin Settings | Medh - Education LMS Template",
};
const Admin_Settings = () => {
  return (
    <ProtectedPage>
      <main>
        
          <AdminSettingsMain />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Admin_Settings;
