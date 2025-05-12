"use client";

import React from "react";
import StudentProfilePage from "@/components/sections/dashboards/student/StudentProfilePage";
import AuthGuard from "@/components/shared/others/AuthGuard";

export default function StudentProfile() {
  return (
    <AuthGuard redirectPath="/dashboards/student/profile">
      <StudentProfilePage />
    </AuthGuard>
  );
} 