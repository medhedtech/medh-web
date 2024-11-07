import PaymentTable from "@/components/layout/main/dashboards/Payments";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import React from "react";

const StudentPayment = () => {
  return (
    <div>
      <DashboardContainer>
        <HeadingDashboard />
        <PaymentTable />
      </DashboardContainer>
    </div>
  );
};

export default StudentPayment;
