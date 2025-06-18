"use client";
import { apiUrls } from "@/apis";
import React, { useEffect, useState } from "react";
import MyTable from "@/components/shared/common-table/page";
import useGetQuery from "@/hooks/getQuery.hook";
import { FaTimes, FaSearch, FaCalendarAlt } from "react-icons/fa";
import { Loader } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

const formatDate = (date) => {
  if (!date) return "";
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  const formattedDate = new Date(date).toLocaleDateString("en-GB", options);
  const [day, month, year] = formattedDate.split("/");
  return `${day}-${month}-${year}`;
};

export default function StudentPlacements() {
  const [placements, setPlacements] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [selectedMessage, setSelectedMessage] = useState(null);
  const { getQuery, loading } = useGetQuery();

  // Fetch placements from API
  const fetchPlacements = async () => {
    try {
      await getQuery({
        url: apiUrls?.placements?.getPlacements,
        onSuccess: (response) => {
          if (Array.isArray(response)) {
            // Sort by date (newest first)
            const sortedData = response.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setPlacements(sortedData);
          } else {
            setPlacements([]);
            showToast.error("Invalid data format received");
          }
        },
        onFail: (error) => {
          console.error("Failed to fetch placements:", error);
          setPlacements([]);
          showToast.error("Failed to fetch placements");
        },
      });
    } catch (error) {
      console.error("Error fetching placements:", error);
      showToast.error("Something went wrong!");
      setPlacements([]);
    }
  };

  useEffect(() => {
    fetchPlacements();
  }, []);

  // Filter Function
  const getFilteredData = () => {
    let filtered = [...placements];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.full_name?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.city?.toLowerCase().includes(query) ||
        item.completed_course?.toLowerCase().includes(query) ||
        item.area_of_interest?.toLowerCase().includes(query)
      );
    }

    // Apply date range filter
    if (startDate && endDate) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    return filtered;
  };

  const columns = [
    { 
      Header: "Name", 
      accessor: "full_name",
      Cell: ({ value }) => (
        <div className="font-semibold text-gray-800 dark:text-gray-100">
          {value || "N/A"}
        </div>
      )
    },
    { 
      Header: "Email", 
      accessor: "email",
      Cell: ({ value }) => (
        <div className="text-gray-700 dark:text-gray-200">
          {value || "N/A"}
        </div>
      )
    },
    { 
      Header: "City", 
      accessor: "city",
      Cell: ({ value }) => (
        <div className="text-gray-700 dark:text-gray-200">
          {value || "N/A"}
        </div>
      )
    },
    { 
      Header: "Phone", 
      accessor: "phone_number",
      Cell: ({ value }) => (
        <div className="text-gray-700 dark:text-gray-200">
          {value || "N/A"}
        </div>
      )
    },
    {
      Header: "Course",
      accessor: "completed_course",
      Cell: ({ value }) => (
        <div className="text-emerald-600 dark:text-emerald-400 font-medium">
          {value || "N/A"}
        </div>
      )
    },
    {
      Header: "Year",
      accessor: "course_completed_year",
      Cell: ({ value }) => (
        <div className="text-gray-700 dark:text-gray-200 font-medium">
          {value || "N/A"}
        </div>
      )
    },
    {
      Header: "Interest Area",
      accessor: "area_of_interest",
      Cell: ({ value }) => (
        <div className="text-blue-600 dark:text-blue-400 font-medium">
          {value || "N/A"}
        </div>
      )
    },
    {
      Header: "Message",
      accessor: "message",
      Cell: ({ value }) => {
        if (!value) return <span className="text-gray-400 italic">No message</span>;
        
        const words = value.split(" ");
        const preview = words.slice(0, 6).join(" ");
        const hasMore = words.length > 6;

        return (
          <div className="flex items-center">
            <span className="text-gray-700 dark:text-gray-200">{preview}</span>
            {hasMore && (
              <button
                onClick={() => setSelectedMessage(value)}
                className="ml-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 text-sm font-medium transition-colors"
              >
                Read More
              </button>
            )}
          </div>
        );
      }
    },
    {
      Header: "Applied On",
      accessor: "createdAt",
      Cell: ({ value }) => (
        <div className="text-gray-600 dark:text-gray-300 font-medium">
          {formatDate(value)}
        </div>
      )
    }
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6 space-y-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Placement Management
              </h1>
            </div>

            {/* Filters */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {/* Search */}
              <div className="relative flex-grow max-w-md">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search placements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:ring-emerald-500 dark:focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Date Range Picker */}
              <div className="relative">
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => setDateRange(update)}
                  placeholderText="Select date range"
                  className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:ring-emerald-500 dark:focus:border-emerald-500 transition-colors"
                />
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader className="animate-spin h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
            ) : (
              <MyTable
                columns={columns}
                data={getFilteredData()}
                entryText="Total placements: "
              />
            )}
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl transform transition-all">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Full Message
                </h2>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                  {selectedMessage}
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
