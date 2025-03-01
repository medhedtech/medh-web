import LessonAssignmentMain from "@/components/layout/main/LessonAssignmentMain";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Lesson Assignment | Medh - Education LMS Template",
  description: "Lesson Assignment | Medh - Education LMS Template",
};
const Lesson_Assignment = () => {
  return (
    <PageWrapper>
      <main>
        <LessonAssignmentMain />
        
      </main>
    </PageWrapper>
  );
};

export default Lesson_Assignment;
