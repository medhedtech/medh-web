import { Metadata } from "next";
import CourseCardEditorMain from "@/components/layout/main/dashboards/CourseCardEditorMain";

export const metadata: Metadata = {
  title: "Course Card Editor | Medh - Education LMS Template",
  description: "Admin Dashboard for editing course card text and design",
};

export default function AdminCourseCardEditorPage() {
  return (
    <CourseCardEditorMain />
  );
} 