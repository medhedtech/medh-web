import React from "react";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import JobApplicationForm from "@/components/sections/careers/jobApply";

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
      <div className="pt-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Apply for a Career at <span className="text-medhgreen">MEDH</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join our dynamic team and be part of our mission to transform education through innovative learning solutions.
            </p>
          </div>
        </div>
      </div>
      
      <JobApplicationForm showUploadField={true} pageTitle="Career Application" />
    </PageWrapper>
  );
} 