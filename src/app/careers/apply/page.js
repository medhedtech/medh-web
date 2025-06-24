import React from "react";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import MultiStepJobApply from "@/components/sections/careers/MultiStepJobApply";

export const metadata = {
  title: "Apply for a Career at MEDH | Join Our Team",
  description: "Apply for a career opportunity at MEDH. Join our dynamic team and help transform education through innovative solutions.",
  keywords: "career application, job application, careers at MEDH, apply for job, job opportunities, work at MEDH",
  openGraph: {
    title: "Apply for a Career at MEDH | Join Our Team",
    description: "Apply for a career opportunity at MEDH. Join our dynamic team and help transform education through innovative solutions.",
    type: "website",
    images: [
      {
        url: "/images/careers-og.jpg",
        width: 1200,
        height: 630,
        alt: "MEDH Careers - Apply Now"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Apply for a Career at MEDH | Join Our Team",
    description: "Apply for a career opportunity at MEDH. Join our dynamic team and help transform education through innovative solutions.",
    images: ["/images/careers-og.jpg"]
  }
};

export default function CareerApplyPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 pb-16">
        <MultiStepJobApply 
          showGeneralApplicationOption={true}
        />
      </div>
    </PageWrapper>
  );
} 