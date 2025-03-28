"use client";
import ProtectedPage from "@/app/protectedRoutes";
import InstructorMainClasses from "@/components/layout/main/dashboards/instructor-all-main-classes";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import { NextPage } from "next";
import React from "react";

const InstructorMainClassesPage: NextPage = () => {
  return (
    <ProtectedPage>
      <DashboardContainer>
        <InstructorMainClasses />
      </DashboardContainer>
    </ProtectedPage>
  );
};

export default InstructorMainClassesPage; 