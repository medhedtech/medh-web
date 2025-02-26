import ProtectedPage from "@/app/protectedRoutes";
import AdminFeedbackComplaints from "@/components/layout/main/dashboards/Admin-Feedback-Complaints";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
export const metadata = {
  title: "feedback and complaints",
  description: "Review, Complaints & Grievances",
};
const Admin_Feedback_Complaints = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <div>
            <HeadingDashboard />
          </div>
          <AdminFeedbackComplaints />
        </DashboardContainer>
        <ThemeController />
      </main>
    </ProtectedPage>
  );
};

export default Admin_Feedback_Complaints;
