import SidebarDashboard from "@/components/sections/sub-section/dashboards/SidebarDashboard";
import { ReactNode } from "react";

interface DashboardContainerProps {
  children: ReactNode;
}

const DashboardContainer = ({ children }: DashboardContainerProps) => {
  return (
    <section>
      <div className="">
        <div className="flex">
          <SidebarDashboard />
          <div className="w-full">{children}</div>
        </div>
      </div>
    </section>
  );
};

export default DashboardContainer; 