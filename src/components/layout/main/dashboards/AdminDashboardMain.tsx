"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Layers, FileText, Calendar, DollarSign, Award, Bell, Book } from 'lucide-react';
import { apiUrls } from '@/apis';
import useGetQuery from '@/hooks/getQuery.hook';

interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalInstructors: number;
  totalEnrollments: number;
  totalRevenue: number;
  totalCertificates: number;
}

const AdminDashboardMain = () => {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalCourses: 0,
    totalInstructors: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    totalCertificates: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { getQuery } = useGetQuery();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getQuery({
          url: apiUrls.adminDashboard.getDashboardCount,
          requireAuth: true,
        });

        if (response?.status === "success" && response.data) {
          setStats({
            totalStudents: response.data.totalStudents || 0,
            totalCourses: response.data.totalCourses || 0,
            totalInstructors: response.data.totalInstructors || 0,
            totalEnrollments: response.data.totalEnrollments || 0,
            totalRevenue: response.data.totalRevenue || 0,
            totalCertificates: response.data.totalCertificates || 0,
          });
        } else {
          throw new Error(response?.error || "Failed to fetch dashboard stats");
        }
      } catch (err: any) {
        console.error("Error fetching dashboard stats:", err);
        setError(err.message || "An error occurred while fetching dashboard stats");
        // Set some mock data for development
        setStats({
          totalStudents: 120,
          totalCourses: 45,
          totalInstructors: 18,
          totalEnrollments: 350,
          totalRevenue: 25000,
          totalCertificates: 97,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [getQuery]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(amount);
  };

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const statCards = [
    { 
      title: 'Total Students', 
      value: formatNumber(stats.totalStudents), 
      icon: <Users className="h-8 w-8 text-blue-500" />,
      color: 'bg-blue-100 text-blue-800',
      onClick: () => router.push('/dashboards/admin-dashboard?view=admin-studentmange')
    },
    { 
      title: 'Total Courses', 
      value: formatNumber(stats.totalCourses), 
      icon: <Book className="h-8 w-8 text-indigo-500" />,
      color: 'bg-indigo-100 text-indigo-800',
      onClick: () => router.push('/dashboards/admin-dashboard?view=admin-listofcourse')
    },
    { 
      title: 'Total Instructors', 
      value: formatNumber(stats.totalInstructors), 
      icon: <FileText className="h-8 w-8 text-purple-500" />,
      color: 'bg-purple-100 text-purple-800',
      onClick: () => router.push('/dashboards/admin-dashboard?view=admin-instuctoremange')
    },
    { 
      title: 'Total Enrollments', 
      value: formatNumber(stats.totalEnrollments), 
      icon: <Calendar className="h-8 w-8 text-green-500" />,
      color: 'bg-green-100 text-green-800',
      onClick: () => router.push('/dashboards/admin-dashboard?view=admin-enrollments')
    },
    { 
      title: 'Total Revenue', 
      value: formatCurrency(stats.totalRevenue), 
      icon: <DollarSign className="h-8 w-8 text-amber-500" />,
      color: 'bg-amber-100 text-amber-800',
      onClick: () => router.push('/dashboards/admin-dashboard?view=admin-course-fee')
    },
    { 
      title: 'Total Certificates', 
      value: formatNumber(stats.totalCertificates), 
      icon: <Award className="h-8 w-8 text-rose-500" />,
      color: 'bg-rose-100 text-rose-800',
      onClick: () => router.push('/dashboards/admin-dashboard?view=admin-generatecertificate')
    }
  ];

  const recentActivity = [
    { 
      id: 1, 
      title: 'New Student Registration', 
      time: '2 hours ago',
      icon: <Users className="h-5 w-5 text-blue-500" />
    },
    { 
      id: 2,
      title: 'Course Fee Updated',
      time: '5 hours ago',
      icon: <DollarSign className="h-5 w-5 text-amber-500" />
    },
    { 
      id: 3,
      title: 'New Course Added', 
      time: '1 day ago',
      icon: <Book className="h-5 w-5 text-indigo-500" />
    },
    { 
      id: 4,
      title: 'New Feedback Received', 
      time: '2 days ago',
      icon: <Bell className="h-5 w-5 text-purple-500" />
    }
  ];

  return (
    <div className="py-6 px-6 md:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Overview of platform activity and stats</p>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="animate-pulse text-primary-500">Loading dashboard stats...</div>
        </div>
      ) : error ? (
        <div className="mt-4 rounded-md bg-red-50 p-4 text-red-700">
          <p>{error}</p>
          <p className="mt-2 text-sm">Using sample data instead</p>
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card, index) => (
          <div 
            key={index} 
            className="overflow-hidden rounded-lg bg-white shadow transition-all hover:shadow-md hover:ring-2 hover:ring-primary-500 hover:ring-opacity-50"
            onClick={card.onClick}
            style={{ cursor: 'pointer' }}
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {card.icon}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="truncate text-sm font-medium text-gray-500">{card.title}</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{card.value}</dd>
                </div>
              </div>
            </div>
            <div className={`bg-gray-50 px-5 py-3 ${card.color}`}>
              <div className="text-sm">
                <span className="font-medium">
                  View details →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-medium">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start border-b border-gray-100 pb-3">
                <div className="flex-shrink-0 p-2 rounded-md bg-gray-50">
                  {activity.icon}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-medium">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/dashboards/admin-dashboard?view=admin-studentmange')}
              className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700"
            >
              View Students
            </button>
            <button
              onClick={() => router.push('/dashboards/admin-dashboard?view=add-course')}
              className="rounded-md bg-green-600 px-4 py-2 text-white shadow-sm hover:bg-green-700"
            >
              Add Course
            </button>
            <button
              onClick={() => router.push('/dashboards/admin-dashboard?view=admin-instuctoremange')}
              className="rounded-md bg-purple-600 px-4 py-2 text-white shadow-sm hover:bg-purple-700"
            >
              View Instructors
            </button>
            <button
              onClick={() => router.push('/dashboards/admin-dashboard?view=online-class')}
              className="rounded-md bg-amber-600 px-4 py-2 text-white shadow-sm hover:bg-amber-700"
            >
              Schedule Class
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardMain;
