import AdminFeedbacks from "@/components/sections/sub-section/dashboards/AdminFeedbacks";
import CounterAdmin from "@/components/sections/sub-section/dashboards/CounterAdmin";

const AdminDashboardMain = () => {
  return (
    <>
      <CounterAdmin />
      <div className="px-10">
        <AdminFeedbacks />
      </div>
      <div className="px-10 grid grid-cols-1 xl:grid-cols-2 gap-30px"></div>
    </>
  );
};

export default AdminDashboardMain;
