"use client";
import { useEffect } from "react";
import CountDashboard from "./CountDashboard";
import counterUp from "@/libs/counterup";
import CountStudentdashboard from "@/components/sections/sub-section/dashboards/CountStudentdashboard";

const CounterStudentdashboard = ({ counts, children }) => {
  useEffect(() => {
    counterUp();
  });
  return (
    <div>
      <div className="p-10px md:px-10 md:py-0px  dark:bg-whiteColor-dark dark:shadow-accordion-dark ">
        {children ? children : ""}

        {/* counter area */}
        <div className="counter grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-30px gap-y-5 pb-5">
          {counts?.map((count, idx) => (
            // <CountDashboard key={idx} count={count} />
            <CountStudentdashboard key={idx} count={count} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CounterStudentdashboard;
