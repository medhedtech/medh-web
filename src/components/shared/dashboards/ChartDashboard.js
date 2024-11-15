import React from "react";
import PieChartDashboard from "./PieChartDashboard";
import LineChartDashboard from "./LineChartDashboard";

const ChartDashboard = () => {
  return (
    <div className="py-10 px-5 mb-30px  dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      <div className="flex flex-wrap m-8 p-4 rounded-lg bg-whiteColor dark:bg-inherit shadow-md">
        {/* linechart */}
        <LineChartDashboard />
        {/* piechart */}
        <PieChartDashboard />
      </div>
    </div>
  );
};

export default ChartDashboard;
