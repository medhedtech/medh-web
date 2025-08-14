"use client";

import React from "react";
import CreateLiveSessionForm from "@/components/Dashboard/admin/online-class/CreateLiveSessionForm";

export default function CreateLiveSessionPage() {
  return (
    <CreateLiveSessionForm 
      courseCategory="AI and Data Science"
      backUrl="/dashboards/admin/live-classes"
    />
  );
}

