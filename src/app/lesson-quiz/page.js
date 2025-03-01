import LessonQuizMain from "@/components/layout/main/LessonQuizMain";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Lesson Quiz | Medh - Education LMS Template",
  description: "Lesson Quiz | Medh - Education LMS Template",
};
const Lesson_Quiz = () => {
  return (
    <PageWrapper>
      <main>
        <LessonQuizMain />
        
      </main>
    </PageWrapper>
  );
};

export default Lesson_Quiz;
