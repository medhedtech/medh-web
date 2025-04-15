import SidebarDashboard from "../dashboards/SidebarDashboard";

const DashboardContainer = ({ children }) => {
  return (
    <section>
      <div className="">
        <div className="flex ">
          <SidebarDashboard />
          <div className="w-full">{children}</div>
        </div>
      </div>
    </section>
  );
};

export default DashboardContainer;
