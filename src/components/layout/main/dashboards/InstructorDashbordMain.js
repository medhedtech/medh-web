import AdminFeedbacks from "@/components/sections/sub-section/dashboards/AdminFeedbacks";
import CounterInstructor from "@/components/sections/sub-section/dashboards/CounterInstructor";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import InstructorDashboard from "./InstructorDashboard";
import HeadingDashboardOnly from "@/components/shared/headings/HeadingDashbordsOnly";

const InstructorDashbordMain = () => {
  return (
    <>
      <main className="px-4">
        <div className="px-6">
        <HeadingDashboardOnly />
        </div>
        <InstructorDashboard />
      </main>
    </>
  );
};

export default InstructorDashbordMain;
