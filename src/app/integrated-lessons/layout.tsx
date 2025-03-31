import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Lessons | Medh - Education LMS Template",
  description: "All lessons and course materials | Medh - Education LMS Template",
  metadataBase: new URL("https://example.com") // Replace with your actual production URL
};

interface IntegratedLessonsLayoutProps {
  children: ReactNode;
}

export default function IntegratedLessonsLayout({ children }: IntegratedLessonsLayoutProps) {
  return children;
} 