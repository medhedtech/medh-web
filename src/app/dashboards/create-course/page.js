import ProtectedPage from "@/app/protectedRoutes";
import CreateCourseMain from "@/components/layout/main/CreateCourseMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Create Course | Medh - Education LMS Template",
  description: "Create Course | Medh - Education LMS Template",
};
const Create_Course = () => {
  return (
    <ProtectedPage>
      <PageWrapper>
        <main>
          <CreateCourseMain />
          <ThemeController />
        </main>
      </PageWrapper>
    </ProtectedPage>
  );
};

export default Create_Course;
