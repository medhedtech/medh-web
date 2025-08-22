import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Access Recorded Sessions | Medh",
  description: "Watch and review your recorded class sessions. Access all your course recordings in one place for convenient learning at your own pace.",
  keywords: "recorded sessions, online classes, medical education, e-learning, video lectures, course recordings",
};

interface RecordedSessionsLayoutProps {
  children: React.ReactNode;
}

export default function RecordedSessionsLayout({ children }: RecordedSessionsLayoutProps) {
  return children;
}
