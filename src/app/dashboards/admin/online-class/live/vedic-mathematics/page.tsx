"use client";

import React from "react";
import { FaCalculator } from "react-icons/fa";
import OnlineClassManagementPage from "@/components/Dashboard/admin/online-class/OnlineClassManagementPage";

export default function ManageVedicMathematicsPage() {
  return (
    <OnlineClassManagementPage
      courseCategory="Vedic Mathematics"
      pageTitle="Manage Vedic Mathematics Classes"
      pageDescription="manage instructors and class types for vedic mathematics"
      icon={FaCalculator}
      gradientColors="bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500"
      backUrl="/dashboards/admin/online-class/live"
    />
  );
} 