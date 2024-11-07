"use client";
import React, { useState } from "react";
import CertificateCoursesEnroll from "@/components/layout/main/dashboards/CertificateCoursesEnroll";
import ViewCertificate from "@/components/layout/main/dashboards/ViewCertificate";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";

const StudentCertificate = () => {
  const [showCertificate, setShowCertificate] = useState(false);

  const handleViewCertificate = () => {
    setShowCertificate(true);
  };

  return (
    <div>
      <main>
        <DashboardContainer>
          <HeadingDashboard />
          {showCertificate ? (
            <ViewCertificate />
          ) : (
            <CertificateCoursesEnroll
              onViewCertificate={handleViewCertificate}
            />
          )}
          <ThemeController />
        </DashboardContainer>
      </main>
    </div>
  );
};

export default StudentCertificate;
