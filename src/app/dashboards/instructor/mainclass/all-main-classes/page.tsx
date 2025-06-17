"use client";
import ProtectedPage from "@/app/protectedRoutes";
import InstructorMainClasses from "@/components/layout/main/dashboards/instructor-all-main-classes";

import { NextPage } from "next";
import React from "react";

const InstructorMainClassesPage: NextPage = () => {
  return (
    <ProtectedPage>
      
        <InstructorMainClasses />
      
    </ProtectedPage>
  );
};

export default InstructorMainClassesPage; 