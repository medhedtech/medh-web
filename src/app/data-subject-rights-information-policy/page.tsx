import DataSubjectRightsPolicy from "@/components/layout/main/DataSubjectRightsPolicy";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import React from "react";

export const metadata = {
  title: "Data Subject Rights Information Policy",
  description: "Data Subject Rights Information Policy | Medh",
};

const DataSubjectRightsPage = () => {
  return (
    <PageWrapper>
      <main>
        <DataSubjectRightsPolicy />
      </main>
    </PageWrapper>
  );
};

export default DataSubjectRightsPage;
