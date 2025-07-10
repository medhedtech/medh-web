import InstructorDetailsMain from "@/components/layout/main/InstructorDetailsMain";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
// import instructors from "@/../public/fakedata/instructors.json";
import { notFound } from "next/navigation";
import type { NextPage } from "next";

export const metadata: { title: string; description: string } = {
  title: "Instructor Details | Medh - Education LMS Template",
  description: "Instructor Details | Medh - Education LMS Template",
};

interface InstructorDetailsProps {
  params: {
    id: string;
  };
}

interface Instructor {
  id: number;
  // Add additional instructor properties if needed
}

const Instructor_Details: NextPage<InstructorDetailsProps> = async ({ params }) => {
  const { id } = await params;
  return (
    <PageWrapper>
      <main>
        <InstructorDetailsMain id={id} />
      </main>
    </PageWrapper>
  );
};

export default Instructor_Details; 