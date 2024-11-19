import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import React from "react";
import PrivacyPolicy from "@/components/layout/main/PrivacyPolicy";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy-Policy | Medh",
};

const Privacy_Privacy = () => {
  return (
    <PageWrapper>
      <main>
        <PrivacyPolicy/>
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Privacy_Privacy;
