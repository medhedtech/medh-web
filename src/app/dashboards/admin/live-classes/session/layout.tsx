"use client";

import React from "react";

export default function SessionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-900">
      {children}
    </div>
  );
}
