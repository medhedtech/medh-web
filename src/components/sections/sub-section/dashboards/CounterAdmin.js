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
import Image from "next/image";
import { RefreshCw, AlertCircle } from "lucide-react";

// Dashboard Counter Card Component
const DashboardCard = ({ name, image, data, color, textColor, description }) => (
  <div
    className={`${color} rounded-xl p-4 sm:p-6 transition-all duration-200 hover:shadow-lg`}
  >
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-gray-600 dark:text-gray-300 font-medium mb-1 sm:mb-2 truncate">
          {name}
        </p>
        <h3 className={`text-2xl sm:text-3xl font-bold ${textColor} truncate`}>
          {data.toLocaleString()}
        </h3>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>
      <div className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 rounded-lg overflow-hidden bg-white dark:bg-gray-800 p-2 shadow-sm ml-4">
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
    description: "Total course enrollments"
  },
  {
    key: "activeStudents",
    name: "Active Students",
    image: counter2,
    color: "bg-emerald-50 dark:bg-emerald-900/20",
    textColor: "text-emerald-600 dark:text-emerald-400",
    description: "Currently active learners"
  },
  {
    key: "totalInstructors",
    name: "Total Instructors",
    image: counter3,
    color: "bg-purple-50 dark:bg-purple-900/20",
    textColor: "text-purple-600 dark:text-purple-400",
    description: "Teaching staff members"
  },
  {
    key: "totalCourses",
    name: "Total Courses",
    image: counter4,
    color: "bg-amber-50 dark:bg-amber-900/20",
    textColor: "text-amber-600 dark:text-amber-400",
    description: "Available learning programs"
  },
  {
    key: "corporateEmployees",
    name: "Corporate Employees",
    image: counter5,
    color: "bg-rose-50 dark:bg-rose-900/20",
    textColor: "text-rose-600 dark:text-rose-400",
    description: "Business sector learners"
  },
  {
    key: "schools",
    name: "Schools/Institutes",
    image: counter6,
    color: "bg-indigo-50 dark:bg-indigo-900/20",
    textColor: "text-indigo-600 dark:text-indigo-400",
    description: "Educational institutions"
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
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch Counts Data from API
  const fetchCounts = async (refresh = false) => {
    try {
      setIsRefreshing(true);
      setError(null); // Clear any previous errors
      
      await getQuery({
        url: apiUrls?.adminDashboard?.getDashboardCount,
        onSuccess: (response) => {
          if (response) {
            // Handle different possible response formats
            if (response.counts) {
              // Format 1: response.counts contains the stats
              setCounts(response.counts);
              setLastUpdated(new Date());
              setError(null);
            } else if (response.data && response.data.counts) {
              // Format 2: response.data.counts contains the stats
              setCounts(response.data.counts);
              setLastUpdated(new Date());
              setError(null);
            } else if (response.data) {
              // Format 3: response.data directly contains the stats
              setCounts(response.data);
              setLastUpdated(new Date());
              setError(null);
            } else {
              // If we can't find the stats in the expected locations, log the response and use fallback
              console.warn("Unexpected API response format:", response);
              setCounts(INITIAL_COUNTS);
              setError("Invalid data format received from server");
              showToast.error("Invalid data format received");
            }
          } else {
            // If response is null or undefined
            console.warn("Empty API response received");
            setCounts(INITIAL_COUNTS);
            setError("Empty response received from server");
            showToast.error("Empty response received");
          }
        },
        onFail: (error) => {
          console.error("Failed to fetch counts:", error);
          setError("Failed to fetch dashboard data");
          showToast.error("Failed to fetch dashboard data");
        },
      });
    } catch (error) {
      console.error("Error fetching counts:", error);
      setError("Something went wrong while fetching data");
      showToast.error("Something went wrong!");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchCounts(true);
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
              {subtitle}
            </p>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            {lastUpdated && (
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
            <button
              onClick={handleRefresh}
              disabled={loading || isRefreshing}
              className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              title="Refresh dashboard data"
            >
              <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-[200px] sm:min-h-[300px]">
          <Loader className="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 dark:text-emerald-400" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center min-h-[200px] sm:min-h-[300px] text-center">
          <div className="text-red-500 mb-2">
            <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 mx-auto" />
          </div>
          <p className="text-gray-900 dark:text-white font-medium">{error}</p>
          <button
            onClick={() => fetchCounts(true)}
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Dashboard Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {DASHBOARD_ITEMS.map((item) => (
            <DashboardCard
              key={item.key}
              name={item.name}
              image={item.image}
              data={counts[item.key]}
              color={item.color}
              textColor={item.textColor}
              description={item.description}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CounterAdmin;
