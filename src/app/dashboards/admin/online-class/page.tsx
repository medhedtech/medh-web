"use client";

import React from "react";
import dynamic from 'next/dynamic';

// Import OnlineClass component with dynamic import and ssr disabled
const OnlineClass = dynamic(
  () => import('@/components/layout/main/dashboards/OnlineClass'),
  { ssr: false }
);

export default function AdminOnlineClassPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <OnlineClass />
    </div>
  );
} 