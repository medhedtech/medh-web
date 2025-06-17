import ProtectedPage from "@/app/protectedRoutes";
import AdminFeedbackComplaints from "@/components/layout/main/dashboards/Admin-Feedback-Complaints";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

export const metadata = {
  title: "feedback and complaints",
  description: "Review, Complaints & Grievances",
};
const Admin_Feedback_Complaints = () => {
  return (
    <ProtectedPage>
      <main>
        
          <div>
            <HeadingDashboard />
          </div>
          <AdminFeedbackComplaints />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Admin_Feedback_Complaints;
