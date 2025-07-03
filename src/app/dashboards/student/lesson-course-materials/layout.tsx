import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lesson Course Materials | Student Dashboard | Medh",
  description: "Access and download course materials, resources, and study guides",
};

export default function LessonCourseMaterialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 