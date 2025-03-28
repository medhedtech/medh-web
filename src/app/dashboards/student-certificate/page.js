"use client";
import React, { useState } from "react";
import CertificateCoursesEnroll from "@/components/layout/main/dashboards/CertificateCoursesEnroll";
import ViewCertificate from "@/components/layout/main/dashboards/ViewCertificate";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

import ProtectedPage from "@/app/protectedRoutes";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";


const StudentCertificate = () => {
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateurl, setCertificateUrl] = useState("");

  const handleViewCertificate = () => {
    setShowCertificate(true);
  };

  return (
    <ProtectedPage >
      <PageWrapper>
      <main>
        <DashboardContainer> 
        <div className="py-24">
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
          </div>
        </DashboardContainer>
      </main>

      </PageWrapper>
    </ProtectedPage>
  );
};

export default StudentCertificate;
