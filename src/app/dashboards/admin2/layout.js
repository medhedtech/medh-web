import AdminDashboardLayout from "@/components/sections/dashboards/AdminDashboardLayout";

export default function Admin2Layout({ children }) {
  return (
    <AdminDashboardLayout userRole="admin">
      {children}
    </AdminDashboardLayout>
  );
} 