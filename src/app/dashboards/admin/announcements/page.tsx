import { Suspense } from 'react';
import ProtectedPage from "@/app/protectedRoutes";

import Loading from "@/app/loading";
import dynamic from 'next/dynamic';

// Dynamically import the AdminAnnouncements component
const AdminAnnouncements = dynamic(
  () => import("@/components/layout/main/dashboards/AdminAnnouncements"),
  { 
    loading: () => <Loading/>,
    ssr: true
  }
);

export const metadata = {
  title: "Admin Announcements | Medh",
  description: "View and manage all system announcements for students, instructors, and admins.",
  keywords: "admin announcements, system notifications, medh admin, announcement management",
  openGraph: {
    title: "Admin Announcements | Medh",
    description: "View and manage all system announcements for students, instructors, and admins.",
    type: "website",
  },
};

export default function AdminAnnouncementsPage() {
  return (
    <ProtectedPage>
      <main>
        
          <Suspense fallback={<Loading/>}>
            <AdminAnnouncements />
          </Suspense>
        
      </main>
    </ProtectedPage>
  );
} 