"use client";
import { apiUrls } from "@/apis";
import React, { useEffect, useState } from "react";
import MyTable from "@/components/shared/common-table/page";
import useGetQuery from "@/hooks/getQuery.hook";
import useDeleteQuery from "@/hooks/deleteQuery.hook";
import { FaEye, FaPlus, FaTimes, FaSearch, FaCalendarAlt } from "react-icons/fa";
import { Loader } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AddJobPost from "./AddjobPost";

const formatDate = (date) => {
  if (!date) return "";
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  const formattedDate = new Date(date).toLocaleDateString("en-GB", options);
  const [day, month, year] = formattedDate.split("/");
  return `${day}-${month}-${year}`;
};

export default function AdminJobApplicants() {
  // State Management
  const [applicants, setApplicants] = useState([]);
  const [jobPosts, setJobPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showAddPostForm, setShowAddPostForm] = useState(false);
  const [activeTab, setActiveTab] = useState("posts"); // posts or applicants
  const { getQuery, loading } = useGetQuery();
  const { deleteQuery } = useDeleteQuery();

  // Fetch data from API (generic fetch function)
  const fetchData = async (url, setState) => {
    try {
      await getQuery({
        url,
        onSuccess: (response) => {
          if (response?.success && Array.isArray(response.data)) {
            // Sort by date (newest first)
            const sortedData = response.data.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setState(sortedData);
          } else {
            setState([]);
            showToast.error("Invalid data format received");
          }
        },
        onFail: () => {
          setState([]);
          showToast.error("Failed to fetch data");
        },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast.error("Something went wrong!");
    }
  };

  // Fetch job applicants and posted jobs
  useEffect(() => {
    fetchData(apiUrls?.jobForm?.getAllJobPosts, setApplicants);
    fetchData(apiUrls?.jobForm?.getAllNewJobs, setJobPosts);
  }, []);

  const handleDelete = async (url, id, fetchUrl, setState) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteQuery({
        url: `${url}/${id}`,
        onSuccess: (res) => {
          showToast.success(res?.message || "Deleted successfully");
          fetchData(fetchUrl, setState);
        },
        onFail: (error) => {
          showToast.error("Failed to delete");
          console.error("Delete failed:", error);
        },
      });
    } catch (error) {
      showToast.error("Something went wrong!");
      console.error("Error:", error);
    }
  };

  // Filter Function
  const getFilteredData = (data) => {
    if (!data) return [];
    let filtered = [...data];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        if (activeTab === 'posts') {
          return (
            item.title?.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query)
          );
        } else {
          return (
            item.full_name?.toLowerCase().includes(query) ||
            item.email?.toLowerCase().includes(query) ||
            item.designation?.toLowerCase().includes(query) ||
            item.country?.toLowerCase().includes(query)
          );
        }
      });
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

  const applicantColumns = [
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
      Header: "Country", 
      accessor: "country",
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
      Header: "Position",
      accessor: "designation",
      Cell: ({ value }) => (
        <div className="text-emerald-600 dark:text-emerald-400 font-medium">
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
      Header: "Date",
      accessor: "createdAt",
      Cell: ({ value }) => (
        <div className="text-gray-600 dark:text-gray-300 font-medium">
          {formatDate(value)}
        </div>
      )
    },
    {
      Header: "Action",
      accessor: "actions",
      Cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original?.resume_image && (
            <button
              onClick={() => window.open(row.original.resume_image, "_blank")}
              className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
              title="View Resume"
            >
              <FaEye className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => handleDelete(
              apiUrls?.jobForm?.deleteJobPost,
              row.original._id,
              apiUrls?.jobForm?.getAllJobPosts,
              setApplicants
            )}
            className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/30 rounded-lg transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  const jobPostColumns = [
    { 
      Header: "Title", 
      accessor: "title",
      Cell: ({ value }) => (
        <div className="font-semibold text-gray-800 dark:text-gray-100">
          {value || "N/A"}
        </div>
      )
    },
    {
      Header: "Description",
      accessor: "description",
      Cell: ({ value }) => {
        if (!value) return <span className="text-gray-400 italic">No description</span>;
        
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
      Header: "Date",
      accessor: "createdAt",
      Cell: ({ value }) => (
        <div className="text-gray-600 dark:text-gray-300 font-medium">
          {formatDate(value)}
        </div>
      )
    },
    {
      Header: "Action",
      accessor: "actions",
      Cell: ({ row }) => (
        <button
          onClick={() => handleDelete(
            apiUrls?.jobForm?.deleteNewJobPost,
            row.original._id,
            apiUrls?.jobForm?.getAllNewJobs,
            setJobPosts
          )}
          className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/30 rounded-lg transition-colors font-medium"
        >
          Delete
        </button>
      )
    }
  ];

  if (showAddPostForm) {
    return <AddJobPost onCancel={() => setShowAddPostForm(false)} />;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6 space-y-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Job Management
              </h1>

              <div className="flex items-center gap-4">
                {/* Tabs */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => setActiveTab("posts")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === "posts"
                        ? "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    Job Posts
                  </button>
                  <button
                    onClick={() => setActiveTab("applicants")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === "applicants"
                        ? "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    Applicants
                  </button>
                </div>

                {/* Add Job Post Button */}
                {activeTab === "posts" && (
                  <button
                    onClick={() => setShowAddPostForm(true)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 font-medium"
                  >
                    <FaPlus className="w-4 h-4" />
                    Add Job Post
                  </button>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {/* Search */}
              <div className="relative flex-grow max-w-md">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={activeTab === "posts" ? "Search job posts..." : "Search applicants..."}
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
          <div className="p-6 bg-white dark:bg-gray-800">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader className="animate-spin h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
            ) : (
              <MyTable
                columns={activeTab === "posts" ? jobPostColumns : applicantColumns}
                data={getFilteredData(activeTab === "posts" ? jobPosts : applicants)}
                entryText={`Total ${activeTab === "posts" ? "job posts" : "applicants"}: `}
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
                  {activeTab === "posts" ? "Full Description" : "Full Message"}
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
