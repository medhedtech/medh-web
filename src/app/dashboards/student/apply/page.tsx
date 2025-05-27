import { Metadata } from "next";
import ApplyDashboard from "@/components/sections/dashboards/ApplyDashboard";

export const metadata: Metadata = {
  title: "Apply for Placement | Student Dashboard",
  description: "Submit your placement application and connect with potential employers",
};

export default function ApplyPage() {
  return <ApplyDashboard />;
} 