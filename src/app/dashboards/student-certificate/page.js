"use client";
import React, { useState } from "react";
import CertificateCoursesEnroll from "@/components/layout/main/dashboards/CertificateCoursesEnroll";
import ViewCertificate from "@/components/layout/main/dashboards/ViewCertificate";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
import ProtectedPage from "@/app/protectedRoutes";

const StudentCertificate = () => {
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateurl, setCertificateUrl] = useState("");

  const handleViewCertificate = () => {
    setShowCertificate(true);
  };

  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <div className="px-6">
            <HeadingDashboard />
          </div>
          {showCertificate ? (
            <div className="px-6 pb-4">
              <ViewCertificate certificateUrl={certificateurl} />
            </div>
          ) : (
            <CertificateCoursesEnroll
              onViewCertificate={handleViewCertificate}
              setCertificateUrl={setCertificateUrl}
            />
          )}
          <ThemeController />
        </DashboardContainer>
      </main>
    </ProtectedPage>
  );
};

export default StudentCertificate;
