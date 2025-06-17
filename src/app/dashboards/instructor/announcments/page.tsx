import { Suspense } from 'react';
import ProtectedPage from "@/app/protectedRoutes";

import Loading from "@/app/loading";
import dynamic from 'next/dynamic';

// Dynamically import the InstructorAnnouncements component
const InstructorAnnouncements = dynamic(
  () => import("@/components/layout/main/dashboards/InstructorAnnouncements"),
  { 
    loading: () => <Loading/>,
    ssr: true
  }
);

export const metadata = {
  title: "Instructor Announcements | Medh",
  description: "View announcements relevant to instructors - course updates, system notifications, and teaching resources.",
  keywords: "instructor announcements, teaching notifications, course updates, medh instructor, instructor dashboard",
  openGraph: {
    title: "Instructor Announcements | Medh",
    description: "View announcements relevant to instructors - course updates, system notifications, and teaching resources.",
    type: "website",
  },
};

export default function InstructorAnnouncementsPage() {
  return (
    <ProtectedPage>
      <main>
        
          <Suspense fallback={<Loading/>}>
            <InstructorAnnouncements />
          </Suspense>
        
      </main>
    </ProtectedPage>
  );
} 