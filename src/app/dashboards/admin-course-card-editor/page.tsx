import { Metadata } from "next";
import { NextPage } from "next";
import ProtectedPage from "@/app/protectedRoutes";
import CourseCardEditorMain from "@/components/layout/main/dashboards/CourseCardEditorMain";

import DashboardWrapper from "@/components/shared/wrappers/DashboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata: Metadata = {
  title: "Course Card Editor | Medh - Education LMS Template",
  description: "Admin Dashboard for editing course card text and design",
};

const AdminCourseCardEditor: NextPage = () => {
  return (
    <ProtectedPage>
      <PageWrapper>
        <main>
          <DashboardWrapper>
            
              <CourseCardEditorMain />
            
          </DashboardWrapper>
        </main>
      </PageWrapper>
    </ProtectedPage>
  );
};

export default AdminCourseCardEditor; 