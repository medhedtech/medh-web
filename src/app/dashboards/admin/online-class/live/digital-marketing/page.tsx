"use client";

import React from "react";
import { FaBullhorn } from "react-icons/fa";
import OnlineClassManagementPage from "@/components/Dashboard/admin/online-class/OnlineClassManagementPage";

export default function ManageDigitalMarketingPage() {
  return (
    <OnlineClassManagementPage
      courseCategory="Digital Marketing with Data Analytics"
      pageTitle="Manage Digital Marketing Classes"
      pageDescription="manage instructors and class types for digital marketing"
      icon={FaBullhorn}
      gradientColors="bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500"
      backUrl="/dashboards/admin/online-class/live"
    />
  );
} 