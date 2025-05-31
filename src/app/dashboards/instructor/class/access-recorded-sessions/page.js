import ProtectedPage from "@/app/protectedRoutes";
import Access_Recorded_Sessions_Instructor from "@/components/layout/main/dashboards/Access_Instructor_Recorded_Sessions";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import React from "react";

const AccessRecordedClasses_Instrutor = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <Access_Recorded_Sessions_Instructor />
        </DashboardContainer>
        
      </main>
    </ProtectedPage>
  );
};

export default AccessRecordedClasses_Instrutor;
