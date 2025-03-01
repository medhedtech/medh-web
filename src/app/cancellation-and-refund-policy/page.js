import CancellationPolicy from "@/components/layout/main/CancellationPolicy";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import React from "react";

export const metadata = {
  title: "Cancellation-Policy",
  description: "Cancellation-Policy | Medh",
};

const Privacy_Cancellation = () => {
  return (
    <PageWrapper>
      <main>
        <CancellationPolicy/>
        
      </main>
    </PageWrapper>
  );
};

export default Privacy_Cancellation;
