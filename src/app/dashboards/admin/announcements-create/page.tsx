import { Suspense } from 'react';
import ProtectedPage from "@/app/protectedRoutes";

import Loading from "@/app/loading";
import dynamic from 'next/dynamic';

// Dynamically import the CreateAnnouncement component
const CreateAnnouncement = dynamic(
  () => import("@/components/layout/main/dashboards/CreateAnnouncement"),
  { 
    loading: () => <Loading/>,
    ssr: true
  }
);

export const metadata = {
  title: "Create Announcement | Medh",
  description: "Create new announcements for students, instructors, and system-wide notifications.",
  keywords: "create announcement, new announcement, announcement form, medh admin, system notification",
  openGraph: {
    title: "Create Announcement | Medh",
    description: "Create new announcements for students, instructors, and system-wide notifications.",
    type: "website",
  },
};

export default function CreateAnnouncementPage() {
  return (
    <ProtectedPage>
      <main>
          <Suspense fallback={<Loading/>}>
            <CreateAnnouncement />
          </Suspense>
      </main>
    </ProtectedPage>
  );
} 