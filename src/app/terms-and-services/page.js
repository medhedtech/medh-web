import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import React from "react";
import TermsAndCOnsitions from "@/components/layout/main/Terms&COnsitions";

export const metadata = {
  title: "Terms & Conditions",
  description: "Terms & Conditions | Medh",
};

const TermsConditions = () => {
  return (
    <PageWrapper>
      <main>
        <TermsAndCOnsitions/>
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default TermsConditions;
