import { Suspense } from 'react';
import ProtectedPage from "@/app/protectedRoutes";

import Loading from "@/app/loading";
import dynamic from 'next/dynamic';

// Dynamically import the NotificationSettings component
const NotificationSettings = dynamic(
  () => import("@/components/layout/main/dashboards/NotificationSettings"),
  { 
    loading: () => <Loading/>,
    ssr: true
  }
);

export const metadata = {
  title: "Notification Settings | Medh",
  description: "Configure notification preferences, email settings, and announcement delivery options for the platform.",
  keywords: "notification settings, email notifications, announcement settings, medh admin, system configuration",
  openGraph: {
    title: "Notification Settings | Medh",
    description: "Configure notification preferences, email settings, and announcement delivery options for the platform.",
    type: "website",
  },
};

export default function NotificationSettingsPage() {
  return (
    <ProtectedPage>
      <main>
        
          <Suspense fallback={<Loading/>}>
            <NotificationSettings />
          </Suspense>
        
      </main>
    </ProtectedPage>
  );
} 