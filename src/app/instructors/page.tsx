import InstructorMain from "@/components/layout/main/InstructorMain";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import type { NextPage } from "next";

export const metadata: { 
  title: string; 
  description: string;
  metadataBase: URL;
} = {
  title: "Instructor | Medh - Education LMS Template",
  description: "Instructor | Medh - Education LMS Template",
  metadataBase: new URL("https://example.com") // Replace with your actual production URL
};

const Instructors: NextPage = () => {
  return (
    <PageWrapper>
      <main>
        <InstructorMain />
      </main>
    </PageWrapper>
  );
};

export default Instructors;
