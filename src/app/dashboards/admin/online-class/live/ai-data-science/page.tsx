"use client";

import React from "react";
import { FaRobot } from "react-icons/fa";
import OnlineClassManagementPage from "@/components/Dashboard/admin/online-class/OnlineClassManagementPage";

export default function ManageAIDataSciencePage() {
  return (
    <OnlineClassManagementPage
      courseCategory="AI and Data Science"
      pageTitle="Manage AI & Data Science Classes"
      pageDescription="manage instructors and class types for AI and data science"
      icon={FaRobot}
      gradientColors="bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500"
      backUrl="/dashboards/admin/online-class/live"
    />
  );
} 