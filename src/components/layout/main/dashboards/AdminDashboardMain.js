"use client";
import React from "react";
import AdminFeedbacks from "@/components/sections/sub-section/dashboards/AdminFeedbacks";
import CounterAdmin from "@/components/sections/sub-section/dashboards/CounterAdmin";

const AdminDashboardMain = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      {/* Stats Overview Section */}
      <section>
        <CounterAdmin
          title="Dashboard Overview"
          subtitle="Real-time metrics and performance indicators"
        />
      </section>

      {/* Recent Activity Section */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Recent Activity
          </h2>
          <AdminFeedbacks />
        </div>
      </section>

      {/* Additional Widgets Section */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Quick Actions Widget */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="space-y-4">
            {/* Add your quick action buttons or links here */}
          </div>
        </div>

        {/* Recent Updates Widget */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Updates
          </h2>
          <div className="space-y-4">
            {/* Add your recent updates content here */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardMain;
