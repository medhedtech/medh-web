import LessonCourseMaterialsMain from "@/components/layout/main/LessonCourseMaterialsMain";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Lesson Course Materials | Medh - Education LMS Template",
  description: "Lesson Course Materials | Medh - Education LMS Template",
};
const Lesson_Course_Materials = () => {
  return (
    <PageWrapper>
      <main>
        <LessonCourseMaterialsMain />
        
      </main>
    </PageWrapper>
  );
};

export default Lesson_Course_Materials;
