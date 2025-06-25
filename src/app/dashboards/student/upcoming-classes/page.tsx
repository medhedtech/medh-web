import { Metadata } from "next";
import ClientWrapper from "./client";

export const metadata: Metadata = {
  title: "Upcoming Classes | Student Dashboard | Medh",
  description: "View your scheduled upcoming classes and sessions",
};

// Server component that uses the client wrapper
export default function UpcomingClassesPage() {
  return <ClientWrapper />;
} 