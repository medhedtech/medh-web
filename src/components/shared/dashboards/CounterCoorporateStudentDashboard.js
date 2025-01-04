"use client";
import { useEffect } from "react";
import counterUp from "@/libs/counterup";
import CountStudentdashboard from "@/components/sections/sub-section/dashboards/CountStudentdashboard";

const CoorporateCounterStudentdashboard = ({ counts, children }) => {
  useEffect(() => {
    counterUp();
  });
  return (
    <div>
      <div className="p-10px md:px-10 md:py-0px  dark:bg-whiteColor-dark dark:shadow-accordion-dark ">
        {children ? children : ""}

        {/* counter area */}
        <div className="counter grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-x-30px gap-y-5 pb-5">
          {counts?.map((count, idx) => (
            // <CountDashboard key={idx} count={count} />
            <CountStudentdashboard key={idx} count={count} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoorporateCounterStudentdashboard;
