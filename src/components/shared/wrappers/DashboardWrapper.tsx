"use client";

import React, { ReactNode } from "react";
import HeroDashboard from "@/components/sections/hero-banners/HeroDashboard";

interface DashboardWrapperProps {
  children: ReactNode;
}

const DashboardWrapper: React.FC<DashboardWrapperProps> = ({ children }) => {
  return (
    <>
      <HeroDashboard />
      {children}
    </>
  );
};

export default DashboardWrapper;
