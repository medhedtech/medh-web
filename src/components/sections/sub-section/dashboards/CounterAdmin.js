"use client";
import React, { useState, useEffect } from "react";
import counter from "@/assets/images/counter/icons_badge.svg";
import counter2 from "@/assets/images/counter/card-1.png";
import counter3 from "@/assets/images/counter/card-2.png";
import counter4 from "@/assets/images/counter/card-3.png";
import counter5 from "@/assets/images/counter/card-4.png";
import counter6 from "@/assets/images/counter/card-5.png";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { Loader } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";

// Dashboard Counter Card Component
const DashboardCard = ({ name, image, data, color, textColor }) => (
  <div
    className={`${color} rounded-xl p-6 transition-all duration-200 hover:shadow-lg`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">
          {name}
        </p>
        <h3 className={`text-3xl font-bold ${textColor}`}>
          {data.toLocaleString()}
        </h3>
      </div>
      <div className="h-12 w-12 rounded-lg overflow-hidden bg-white dark:bg-gray-800 p-2 shadow-sm">
        <Image
          src={image}
          alt={name}
          width={32}
          height={32}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  </div>
);

// Dashboard Items Configuration
const DASHBOARD_ITEMS = [
  {
    key: "enrolledCourses",
    name: "Enrolled Courses",
    image: counter,
    color: "bg-blue-50 dark:bg-blue-900/20",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  {
    key: "activeStudents",
    name: "Active Students",
    image: counter2,
    color: "bg-emerald-50 dark:bg-emerald-900/20",
    textColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    key: "totalInstructors",
    name: "Total Instructors",
    image: counter3,
    color: "bg-purple-50 dark:bg-purple-900/20",
    textColor: "text-purple-600 dark:text-purple-400",
  },
  {
    key: "totalCourses",
    name: "Total Courses",
    image: counter4,
    color: "bg-amber-50 dark:bg-amber-900/20",
    textColor: "text-amber-600 dark:text-amber-400",
  },
  {
    key: "corporateEmployees",
    name: "Corporate Employees",
    image: counter5,
    color: "bg-rose-50 dark:bg-rose-900/20",
    textColor: "text-rose-600 dark:text-rose-400",
  },
  {
    key: "schools",
    name: "Schools/Institutes",
    image: counter6,
    color: "bg-indigo-50 dark:bg-indigo-900/20",
    textColor: "text-indigo-600 dark:text-indigo-400",
  },
];

// Initial State
const INITIAL_COUNTS = {
  enrolledCourses: 0,
  activeStudents: 0,
  totalInstructors: 0,
  totalCourses: 0,
  corporateEmployees: 0,
  schools: 0,
};

const CounterAdmin = ({ title = "Dashboard Overview", subtitle = "Monitor key metrics and performance indicators" }) => {
  const { getQuery, loading } = useGetQuery();
  const [counts, setCounts] = useState(INITIAL_COUNTS);

  // Fetch Counts Data from API
  const fetchCounts = async () => {
    try {
      await getQuery({
        url: apiUrls?.adminDashboard?.getDashboardCount,
        onSuccess: (response) => {
          if (response?.counts) {
            setCounts(response.counts);
          } else {
            toast.error("Invalid data format received");
          }
        },
        onFail: (error) => {
          console.error("Failed to fetch counts:", error);
          toast.error("Failed to fetch dashboard data");
        },
      });
    } catch (error) {
      console.error("Error fetching counts:", error);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="animate-spin h-8 w-8 text-emerald-600 dark:text-emerald-400" />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {subtitle}
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DASHBOARD_ITEMS.map((item) => (
          <DashboardCard
            key={item.key}
            name={item.name}
            image={item.image}
            data={counts[item.key]}
            color={item.color}
            textColor={item.textColor}
          />
        ))}
      </div>
    </>
  );
};

export default CounterAdmin;
