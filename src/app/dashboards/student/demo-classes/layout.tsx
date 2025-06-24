import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo Classes & Booking | Student Dashboard | Medh",
  description: "Schedule new demo classes, manage your bookings, access session materials, and track your demo class progress",
};

export default function DemoClassesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 