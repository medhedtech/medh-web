"use client";

import React from "react";
import { FaUserTie } from "react-icons/fa";
import OnlineClassManagementPage from "@/components/Dashboard/admin/online-class/OnlineClassManagementPage";

export default function ManagePersonalityDevelopmentPage() {
  return (
    <OnlineClassManagementPage
      courseCategory="Personality Development"
      pageTitle="Manage Personality Development Classes"
      pageDescription="manage instructors and class types for personality development"
      icon={FaUserTie}
      gradientColors="bg-gradient-to-br from-pink-500 via-rose-500 to-red-500"
      backUrl="/dashboards/admin/online-class/live"
    />
  );
} 