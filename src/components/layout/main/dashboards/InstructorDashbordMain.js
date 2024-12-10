import AdminFeedbacks from "@/components/sections/sub-section/dashboards/AdminFeedbacks";
import CounterInstructor from "@/components/sections/sub-section/dashboards/CounterInstructor";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import InstructorDashboard from "./InstructorDashboard";

const InstructorDashbordMain = () => {
  return (
    <>
      <main className="px-4">
        <HeadingDashboard />
        <InstructorDashboard />
      </main>
    </>
  );
};

export default InstructorDashbordMain;
