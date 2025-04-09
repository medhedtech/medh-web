import { Metadata } from 'next';
import ZoomMeetingsMain from "@/components/layout/main/ZoomMeetingsMain";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata: Metadata = {
  title: "Zoom Meetings | Medh - Education LMS Template",
  description: "Access and manage your Zoom meetings and live classes",
  keywords: ["zoom meetings", "live classes", "virtual classroom", "online education"],
};

export default function ZoomMeetingsPage() {
  return (
    <PageWrapper>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <ZoomMeetingsMain />
      </main>
    </PageWrapper>
  );
} 