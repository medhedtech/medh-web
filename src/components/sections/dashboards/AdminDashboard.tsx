"use client";

import React, { useContext } from "react";
import { BarChart, Users, BookOpen, CreditCard, Calendar, TrendingUp, Clock, CheckCircle, ArrowRight, PlusCircle, Edit, UserPlus } from "lucide-react";
import { AdminDashboardContext } from "./AdminDashboardLayout";
import Link from "next/link";

const StatCard = ({ icon, title, value, trend, color }: { 
  icon: React.ReactNode;
  title: string;
  value: string;
  trend?: string;
  color: string;
}) => (
  <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <h3 className="text-xl font-bold">{value}</h3>
      {trend && (
        <p className={`text-xs flex items-center mt-1 ${
          trend.startsWith('+') ? 'text-green-500' : 'text-red-500'
        }`}>
          {trend.startsWith('+') ? 
            <TrendingUp className="h-3 w-3 mr-1" /> : 
            <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
          }
          {trend} from last month
        </p>
      )}
    </div>
  </div>
);

const QuickActionButton = ({ icon, title, href, color }: {
  icon: React.ReactNode;
  title: string;
  href: string;
  color: string;
}) => (
  <Link href={href}>
    <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-md hover:translate-y-[-2px] h-full ${color}`}>
      <div className="mb-2">
        {icon}
      </div>
      <p className="text-sm font-medium text-center">{title}</p>
    </div>
  </Link>
);

const AdminDashboard: React.FC = () => {
  // Use context if available from AdminDashboardLayout
  const dashboardContext = useContext(AdminDashboardContext);
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
          title="Total Students"
          value="1,248"
          trend="+12%"
          color="bg-blue-100 dark:bg-blue-900/30"
        />
        
        <StatCard
          icon={<BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
          title="Active Courses"
          value="24"
          trend="+5%"
          color="bg-purple-100 dark:bg-purple-900/30"
        />
        
        <StatCard
          icon={<CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />}
          title="Revenue"
          value="₹3.2M"
          trend="+18%"
          color="bg-green-100 dark:bg-green-900/30"
        />
        
        <StatCard
          icon={<Calendar className="h-6 w-6 text-amber-600 dark:text-amber-400" />}
          title="Upcoming Classes"
          value="12"
          color="bg-amber-100 dark:bg-amber-900/30"
        />
      </div>
      
      {/* Quick Actions Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <QuickActionButton 
            icon={<PlusCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />}
            title="Add New Course"
            href="/dashboards/admin-addcourse"
            color="hover:bg-emerald-50 dark:hover:bg-emerald-900/10"
          />
          <QuickActionButton 
            icon={<Edit className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
            title="Update Courses"
            href="/dashboards/admin-course"
            color="hover:bg-blue-50 dark:hover:bg-blue-900/10"
          />
          <QuickActionButton 
            icon={<UserPlus className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
            title="Add Instructor"
            href="/dashboards/admin-add-instructor"
            color="hover:bg-purple-50 dark:hover:bg-purple-900/10"
          />
          <QuickActionButton 
            icon={<Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />}
            title="Manage Students"
            href="/dashboards/admin-studentmange"
            color="hover:bg-amber-50 dark:hover:bg-amber-900/10"
          />
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Enrollments</h2>
            <button className="text-primary-600 text-sm flex items-center">
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="space-y-3">
            {[
              { name: "Rahul Sharma", course: "AI & Data Science", time: "2d ago", status: "Paid" },
              { name: "Priya Singh", course: "Digital Marketing", time: "1d ago", status: "Pending" },
              { name: "Amit Kumar", course: "Web Development", time: "5h ago", status: "Paid" },
              { name: "Neha Patel", course: "Vedic Mathematics", time: "1h ago", status: "Pending" },
              { name: "Vijay Mehta", course: "Personality Development", time: "20m ago", status: "Paid" }
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 mr-3"></div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">Enrolled in {item.course}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.status === "Paid" 
                      ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" 
                      : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                  } mr-3`}>
                    {item.status}
                  </span>
                  <span className="text-sm text-gray-500">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Upcoming Tasks</h2>
          <div className="space-y-3">
            {[
              { title: "Review new instructor applications", due: "Today, 5 PM", type: "High" },
              { title: "Update course materials", due: "Tomorrow", type: "Medium" },
              { title: "Schedule demo classes", due: "In 2 days", type: "Medium" },
              { title: "Finalize Q2 pricing strategy", due: "Next week", type: "Low" }
            ].map((task, index) => (
              <div key={index} className="flex items-start space-x-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div className={`p-2 rounded-full ${
                  task.type === "High" 
                    ? "bg-red-100 dark:bg-red-900/30" 
                    : task.type === "Medium"
                      ? "bg-amber-100 dark:bg-amber-900/30"
                      : "bg-blue-100 dark:bg-blue-900/30"
                }`}>
                  <Clock className={`h-4 w-4 ${
                    task.type === "High" 
                      ? "text-red-600 dark:text-red-400" 
                      : task.type === "Medium"
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-blue-600 dark:text-blue-400"
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{task.title}</p>
                  <p className="text-xs text-gray-500">{task.due}</p>
                </div>
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <CheckCircle className="h-4 w-4 text-gray-400 hover:text-green-500 dark:hover:text-green-400" />
                </button>
              </div>
            ))}
          </div>
          <button className="mt-3 w-full py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-sm font-medium transition-colors">
            View All Tasks
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 