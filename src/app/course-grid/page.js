import CourseGridMain from "@/components/layout/main/CourseGridMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Course Grid | Medh - Education LMS Template",
  description: "Course Grid | Medh - Education LMS Template",
};

const Course_Grid = async () => {
  return (
    <PageWrapper>
      <main>
        <CourseGridMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Course_Grid;
