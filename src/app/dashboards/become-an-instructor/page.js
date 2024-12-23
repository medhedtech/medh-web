import ProtectedPage from "@/app/protectedRoutes";
import BecomAnInstructorMain from "@/components/layout/main/BecomAnInstructorMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Become An Instructor | Medh - Education LMS Template",
  description: "Become An Instructor | Medh - Education LMS Template",
};
const Become_An_Instructor = () => {
  return (
    <ProtectedPage>
      <PageWrapper>
        <main>
          <BecomAnInstructorMain />
          <ThemeController />
        </main>
      </PageWrapper>
    </ProtectedPage>
  );
};

export default Become_An_Instructor;
