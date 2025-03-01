import InstructorMain from "@/components/layout/main/InstructorMain";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Instructor | Medh - Education LMS Template",
  description: "Instructor | Medh - Education LMS Template",
};
const Instructors = () => {
  return (
    <PageWrapper>
      <main>
        <InstructorMain />
        
      </main>
    </PageWrapper>
  );
};

export default Instructors;
