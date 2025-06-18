"use client";
import { apiUrls } from "@/apis";
import React, { useEffect, useState } from "react";
import MyTable from "@/components/shared/common-table/page";
import useGetQuery from "@/hooks/getQuery.hook";
import Preloader from "@/components/shared/others/Preloader";
import { toast } from "react-toastify";
import useDeleteQuery from "@/hooks/deleteQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import { FaTimes, FaSearch, FaCalendarAlt, FaEdit, FaTrash } from "react-icons/fa";
import { Loader } from "lucide-react";
import DatePicker from "react-datepicker";

// Function to format the date
const formatDate = (date) => {
  if (!date) return "";
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  const formattedDate = new Date(date).toLocaleDateString("en-GB", options);
  const [day, month, year] = formattedDate.split("/");
  return `${day}-${month}-${year}`;
};

export default function AdminFeedbackComplaints() {
  // State Management
  const [feedbacks, setFeedbacks] = useState([]);
  const [instructorFeedbacks, setInstructorFeedbacks] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [editComplaint, setEditComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("feedbacks"); // feedbacks, instructor_feedbacks, or complaints
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const { getQuery, loading } = useGetQuery();
  const { deleteQuery } = useDeleteQuery();
  const { postQuery } = usePostQuery();

  // Fetch data from API
  const fetchData = async (url, setState) => {
    if (!url) {
      console.error("URL is undefined");
      showToast.error("Invalid API endpoint");
      return;
    }

    try {
      await getQuery({
        url,
        onSuccess: (response) => {
          if (Array.isArray(response?.data)) {
            // Sort by date (newest first)
            const sortedData = response.data.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setState(sortedData);
          } else if (Array.isArray(response)) {
            // Handle direct array response
            const sortedData = response.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setState(sortedData);
          } else {
            setState([]);
            showToast.error("Invalid data format received");
          }
        },
        onError: (error) => {
          console.error("Error fetching data:", error);
          setState([]);
          showToast.error(error?.message || "Failed to fetch data");
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast.error("Something went wrong!");
      setState([]);
    }
  };

  useEffect(() => {
    // Check if API endpoints are defined
    if (!apiUrls?.feedbacks?.getAllFeedbacks) {
      console.error("Feedback API endpoints are not defined");
      showToast.error("API configuration error");
      return;
    }

    // Fetch initial data
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          fetchData(apiUrls.feedbacks.getAllFeedbacks, setFeedbacks),
          fetchData(apiUrls.feedbacks.getAllComplaints, setComplaints),
          fetchData(apiUrls.feedbacks.getAllInstructorFeedbacks, setInstructorFeedbacks)
        ]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        showToast.error("Failed to load some data");
      }
    };

    fetchInitialData();
  }, []);

  // Handle delete action
  const handleDelete = async (url, id, fetchUrl, setState) => {
    if (!url || !id) {
      showToast.error("Invalid delete request");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteQuery({
        url: `${url}/${id}`,
        onSuccess: (res) => {
          showToast.success(res?.message || "Deleted successfully");
          fetchData(fetchUrl, setState);
        },
        onError: (error) => {
          showToast.error(error?.message || "Failed to delete");
          console.error("Delete failed:", error);
        }
      });
    } catch (error) {
      showToast.error("Something went wrong!");
      console.error("Error:", error);
    }
  };

  // Handle edit action (open edit modal)
  const handleEdit = (complaint) => {
    setEditComplaint(complaint);
    setNewStatus(complaint?.status || "");
  };

  // Handle form submission for status update
  const handleUpdateStatus = async () => {
    if (!editComplaint?._id) {
      showToast.error("Invalid complaint selected");
      return;
    }

    if (!newStatus) {
      showToast.error("Please select a valid status");
      return;
    }

    try {
      await postQuery({
        url: apiUrls.feedbacks.updateFeedback(editComplaint._id),
        data: { status: newStatus },
        onSuccess: () => {
          showToast.success("Complaint status updated successfully");
          fetchData(apiUrls.feedbacks.getAllComplaints, setComplaints);
          setEditComplaint(null);
        },
        onError: (error) => {
          showToast.error(error?.message || "Failed to update complaint status");
        }
      });
    } catch (error) {
      console.error("Error updating status:", error);
      showToast.error("Unexpected error occurred");
    }
  };

  // Filter Function
  const getFilteredData = (data) => {
    if (!data) return [];
    let filtered = [...data];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.full_name?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.feedback_title?.toLowerCase().includes(query) ||
        item.feedback_text?.toLowerCase().includes(query) ||
        item.message?.toLowerCase().includes(query) ||
        item.name?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
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

  // Table Columns
  const getFeedbackColumns = (type) => [
    { 
      Header: "Title", 
      accessor: type === "complaints" ? "name" : "feedback_title",
      Cell: ({ value }) => (
        <div className="font-semibold text-gray-800 dark:text-gray-100">
          {value || "N/A"}
        </div>
      )
    },
    {
      Header: type === "complaints" ? "Description" : "Feedback",
      accessor: type === "complaints" ? "description" : "feedback_text",
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
      Header: "Type",
      accessor: "feedback_for",
      Cell: ({ value }) => value ? (
        <div className="text-emerald-600 dark:text-emerald-400 font-medium capitalize">
          {value.toLowerCase()}
        </div>
      ) : null,
      show: type !== "complaints"
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value, row }) => {
        if (!value || type !== "complaints") return null;

        const statusFormatted = value.charAt(0).toUpperCase() + value.slice(1);
        const getStatusStyles = (status) => {
          switch (status.toLowerCase()) {
            case "resolved":
              return "bg-green-500 text-white";
            case "in-progress":
              return "bg-yellow-500 text-white";
            case "open":
              return "bg-blue-500 text-white";
            default:
              return "bg-gray-300 text-black";
          }
        };

        return (
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-md font-semibold ${getStatusStyles(value)}`}>
              {statusFormatted}
            </span>
            <button
              onClick={() => handleEdit(row.original)}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              title="Change Status"
            >
              <FaEdit size={16} />
            </button>
          </div>
        );
      },
      show: type === "complaints"
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
          <button
            onClick={() => handleDelete(
              type === "complaints" 
                ? apiUrls.feedbacks.deleteFeedback(row.original._id)
                : type === "instructor" 
                  ? apiUrls.feedbacks.deleteFeedback(row.original._id)
                  : apiUrls.feedbacks.deleteFeedback(row.original._id),
              row.original._id,
              type === "complaints" 
                ? apiUrls.feedbacks.getAllComplaints
                : type === "instructor"
                  ? apiUrls.feedbacks.getAllInstructorFeedbacks
                  : apiUrls.feedbacks.getAllFeedbacks,
              type === "complaints" 
                ? setComplaints
                : type === "instructor"
                  ? setInstructorFeedbacks
                  : setFeedbacks
            )}
            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            title="Delete"
          >
            <FaTrash size={16} />
          </button>
        </div>
      )
    }
  ].filter(column => column.show !== false);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6 space-y-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Feedback & Complaints Management
              </h1>

              {/* Tabs */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab("feedbacks")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "feedbacks"
                      ? "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Student Feedbacks
                </button>
                <button
                  onClick={() => setActiveTab("instructor_feedbacks")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "instructor_feedbacks"
                      ? "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Instructor Feedbacks
                </button>
                <button
                  onClick={() => setActiveTab("complaints")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "complaints"
                      ? "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Complaints
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {/* Search */}
              <div className="relative flex-grow max-w-md">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab.replace("_", " ")}...`}
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
                columns={getFeedbackColumns(activeTab)}
                data={getFilteredData(
                  activeTab === "complaints"
                    ? complaints
                    : activeTab === "instructor_feedbacks"
                    ? instructorFeedbacks
                    : feedbacks
                )}
                entryText={`Total ${activeTab.replace("_", " ")}: `}
              />
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editComplaint && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md transform transition-all">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Update Complaint Status
                </h2>
                <button
                  onClick={() => setEditComplaint(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                  >
                    <option value="">Select Status</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In-Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setEditComplaint(null)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateStatus}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl transform transition-all">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {activeTab === "complaints" ? "Full Description" : "Full Message"}
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
