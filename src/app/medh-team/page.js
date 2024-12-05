import AdvisoryBoard from "@/components/sections/team/advisoryBoard";
import DynamicTeam from "@/components/sections/team/dynamicTeam";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import React from "react";

const Team = () => {
  return (
    <div>
      <PageWrapper>
        <DynamicTeam />
        <AdvisoryBoard />
        <ThemeController />
      </PageWrapper>
    </div>
  );
};

export default Team;
