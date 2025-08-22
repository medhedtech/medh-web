"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import CreateLiveSessionForm from "@/components/Dashboard/admin/online-class/CreateLiveSessionForm";

export default function CreateLiveSessionPage() {
  const searchParams = useSearchParams();
  const editSessionId = searchParams.get('edit');

  return (
    <CreateLiveSessionForm 
      courseCategory="AI and Data Science"
      backUrl="/dashboards/admin/live-classes"
      editSessionId={editSessionId}
    />
  );
}

