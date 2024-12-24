import ProtectedPage from "@/app/protectedRoutes";
import Access_Recorded_Sessions_Instructor from "@/components/layout/main/dashboards/Access_Instructor_Recorded_essions";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import React from "react";

const AccessRecordedClasses_Instrutor = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <Access_Recorded_Sessions_Instructor />
        </DashboardContainer>
        <ThemeController />
      </main>
    </ProtectedPage>
  );
};

export default AccessRecordedClasses_Instrutor;
