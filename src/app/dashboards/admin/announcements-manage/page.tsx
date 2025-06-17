import { Suspense } from 'react';
import ProtectedPage from "@/app/protectedRoutes";

import Loading from "@/app/loading";
import dynamic from 'next/dynamic';

// Dynamically import the ManageAnnouncements component
const ManageAnnouncements = dynamic(
  () => import("@/components/layout/main/dashboards/ManageAnnouncements"),
  { 
    loading: () => <Loading/>,
    ssr: true
  }
);

export const metadata = {
  title: "Manage Announcements | Medh",
  description: "Comprehensive announcement management interface for admins - create, edit, delete, and schedule announcements.",
  keywords: "manage announcements, announcement admin, edit announcements, medh admin, announcement control",
  openGraph: {
    title: "Manage Announcements | Medh",
    description: "Comprehensive announcement management interface for admins - create, edit, delete, and schedule announcements.",
    type: "website",
  },
};

export default function ManageAnnouncementsPage() {
  return (
    <ProtectedPage>
      <main>
        
          <Suspense fallback={<Loading/>}>
            <ManageAnnouncements />
          </Suspense>
        
      </main>
    </ProtectedPage>
  );
} 