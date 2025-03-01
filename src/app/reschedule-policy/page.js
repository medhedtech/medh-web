import ReschedulePolicy from "@/components/layout/main/ReschedulePolicy";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import React from "react";

export const metadata = {
  title: "Reschedule-Policy",
  description: "Reschedule-Policy | Medh",
};

const Reschedule_Policy = () => {
  return (
    <PageWrapper>
      <main>
        <ReschedulePolicy />
        
      </main>
    </PageWrapper>
  );
};

export default Reschedule_Policy;
