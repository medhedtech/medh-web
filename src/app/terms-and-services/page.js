
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import React from "react";
import TermsAndCOnsitions from "@/components/layout/main/TermsAndConditions";

export const metadata = {
  title: "Terms & Conditions",
  description: "Terms & Conditions | Medh",
};

const TermsConditions = () => {
  return (
    <PageWrapper>
      <main className="pt-16">
        <TermsAndCOnsitions/>
        
      </main>
    </PageWrapper>
  );
};

export default TermsConditions;
