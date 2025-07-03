import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Certificates | Student Dashboard | Medh",
  description: "View and download your course completion certificates",
};

// Dynamically import the client component
const CertificatePageClient = dynamic(() => import("./CertificatePageClient"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  ),
});

// Server component
export default function CertificatePage() {
  return <CertificatePageClient />;
} 