import ReschedulePolicy from "@/components/layout/main/ReschedulePolicy";
import ThemeController from "@/components/shared/others/ThemeController";
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
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Reschedule_Policy;
