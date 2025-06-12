"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FaPlus, FaTimes, FaSearch, FaCalendarAlt } from "react-icons/fa";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import MyTable from "@/components/shared/common-table/page";
import AddBlog from "./AddBlogs";
import useDeleteQuery from "@/hooks/deleteQuery.hook";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTheme } from "next-themes";

// Fix JSX namespace issue
declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> { }
  }
}

// Enhanced TypeScript interfaces following project conventions
interface IBlogData {
  _id: string;
  title: string;
  description: string;
  upload_image: string;
  createdAt: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  author: string;
  slug: string;
  meta_title?: string;
  meta_description?: string;
  blog_link?: string;
  categories: string[];
  tags: string[];
  content: string;
}

interface ITableColumn {
  Header: string;
  accessor: string;
  Cell?: ({ value, row }: { value: any; row: { original: IBlogData } }) => JSX.Element;
}

const formatDate = (date: string): string => {
  if (!date) return "";
  const options: Intl.DateTimeFormatOptions = { 
    day: "2-digit", 
    month: "2-digit", 
    year: "numeric" 
  };
  const formattedDate = new Date(date).toLocaleDateString("en-GB", options);
  const [day, month, year] = formattedDate.split("/");
  return `${day}-${month}-${year}`;
};

const AdminBlogs: React.FC = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  
  // State Management with proper typing
  const [showAddBlogForm, setShowAddBlogForm] = useState<boolean>(false);
  const [blogs, setBlogs] = useState<IBlogData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  
  const { getQuery } = useGetQuery();
  const { deleteQuery, loading } = useDeleteQuery();
  
  const isDark = mounted ? theme === 'dark' : true;

  // Mount effect
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch Blogs Data from API with enhanced error handling
  const fetchBlogs = useCallback(async (): Promise<void> => {
    try {
      await getQuery({
        url: apiUrls?.Blogs?.getAllBlogs({
          page: 1,
          limit: 100,
          sort_by: "createdAt",
          sort_order: "desc"
        }),
        onSuccess: (response: any) => {
          console.log("API Response:", response);
          
          // Handle the actual API response structure
          let blogData: IBlogData[] = [];
          
          if (response?.success && Array.isArray(response?.data)) {
            blogData = response.data;
          } else if (Array.isArray(response?.data?.blogs)) {
            blogData = response.data.blogs;
          } else if (Array.isArray(response?.blogs)) {
            blogData = response.blogs;
          } else if (Array.isArray(response)) {
            blogData = response;
          } else {
            console.error("Unexpected response format:", response);
            setBlogs([]);
            toast.error("Failed to fetch blogs - unexpected response format");
            return;
          }

          console.log("Processed blog data:", blogData);

          // Sort by date (newest first)
          const sortedData = blogData.sort(
            (a: IBlogData, b: IBlogData) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setBlogs(sortedData);
          toast.success(`Successfully loaded ${sortedData.length} blogs`);
        },
        onFail: (err: any) => {
          console.error("API error:", err);
          setBlogs([]);
          toast.error("Failed to fetch blogs");
        },
      });
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      setBlogs([]);
      toast.error("Something went wrong!");
    }
  }, [getQuery]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = useCallback(async (id: string): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await deleteQuery({
        url: apiUrls?.Blogs?.deleteBlog(id),
        onSuccess: (res: { message?: string }) => {
          toast.success(res?.message || "Blog deleted successfully");
          fetchBlogs();
        },
        onFail: (error: any) => {
          toast.error("Failed to delete blog");
          console.error("Delete failed:", error);
        },
      });
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Error:", error);
    }
  }, [deleteQuery, fetchBlogs]);

  // Enhanced filter function with proper typing
  const getFilteredData = useCallback((): IBlogData[] => {
    let filtered = [...blogs];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((item: IBlogData) =>
        item.title?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );
    }

    // Apply date range filter
    if (startDate && endDate) {
      filtered = filtered.filter((item: IBlogData) => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    return filtered;
  }, [blogs, searchQuery, startDate, endDate]);

  // Enhanced table columns with proper typing
  const columns: ITableColumn[] = [
    {
      Header: "Image",
      accessor: "upload_image",
      Cell: ({ value }: { value: string }) => (
        <div className="h-10 w-10 rounded-full overflow-hidden">
          <img 
            src={value} 
            alt="Blog" 
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-image.jpg'; // Fallback image
            }}
          />
        </div>
      ),
    },
    { 
      Header: "Title", 
      accessor: "title",
      Cell: ({ value }: { value: string }) => (
        <div className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
          {value || "N/A"}
        </div>
      )
    },
    {
      Header: "Description",
      accessor: "description",
      Cell: ({ value }: { value: string }) => {
        if (!value) return <span className="text-gray-400 italic">No description</span>;
        
        const words = value.split(" ");
        const preview = words.slice(0, 6).join(" ");
        const hasMore = words.length > 6;

        return (
          <div className="flex items-center">
            <span className={isDark ? 'text-gray-200' : 'text-gray-700'}>{preview}</span>
            {hasMore && (
              <button
                onClick={() => setSelectedMessage(value)}
                className={`ml-2 text-sm font-medium transition-colors ${
                  isDark 
                    ? 'text-emerald-400 hover:text-emerald-300' 
                    : 'text-emerald-600 hover:text-emerald-700'
                }`}
              >
                Read More
              </button>
            )}
          </div>
        );
      }
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }: { value: string }) => {
        const getStatusColor = (status: string) => {
          switch (status) {
            case 'published':
              return isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700';
            case 'draft':
              return isDark ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-700';
            case 'archived':
              return isDark ? 'bg-gray-500/20 text-gray-300' : 'bg-gray-100 text-gray-700';
            default:
              return isDark ? 'bg-gray-500/20 text-gray-300' : 'bg-gray-100 text-gray-700';
          }
        };

        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(value)}`}>
            {value || 'draft'}
          </span>
        );
      }
    },
    {
      Header: "Date",
      accessor: "createdAt",
      Cell: ({ value }: { value: string }) => (
        <div className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {formatDate(value)}
        </div>
      )
    },
    {
      Header: "Action",
      accessor: "actions",
      Cell: ({ row }: { row: { original: IBlogData } }) => (
        <button
          onClick={() => handleDelete(row.original._id)}
          className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
            isDark 
              ? 'text-rose-400 hover:bg-rose-900/30' 
              : 'text-rose-600 hover:bg-rose-50'
          }`}
        >
          Delete
        </button>
      ),
    },
  ];

  // Handle add blog form navigation
  const handleAddBlogCancel = useCallback(() => {
    setShowAddBlogForm(false);
    fetchBlogs(); // Refresh the list when returning from add form
  }, [fetchBlogs]);

  if (showAddBlogForm) {
    return <AddBlog onCancel={handleAddBlogCancel} />;
  }

  return (
    <div className={`min-h-screen p-6 space-y-8 transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className={`border rounded-xl shadow-sm overflow-hidden backdrop-blur-xl ${
          isDark 
            ? 'bg-white/5 border-white/10' 
            : 'bg-white/80 border-gray-200'
        }`}>
          {/* Header */}
          <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h1 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Blog Management
              </h1>

              <button
                onClick={() => setShowAddBlogForm(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FaPlus className="w-4 h-4 mr-2" />
                Add Blog
              </button>
            </div>

            {/* Filters */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {/* Search */}
              <div className="relative flex-grow max-w-md">
                <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  isDark ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500'
                  }`}
                />
              </div>

              {/* Date Range Picker */}
              <div className="relative">
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => setDateRange(update as [Date | null, Date | null])}
                  placeholderText="Select date range"
                  className={`pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                />
                <FaCalendarAlt className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  isDark ? 'text-gray-400' : 'text-gray-400'
                }`} />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader className={`animate-spin h-8 w-8 ${
                  isDark ? 'text-emerald-400' : 'text-emerald-600'
                }`} />
              </div>
            ) : (
              <MyTable
                columns={columns}
                data={getFilteredData()}
                entryText="Total blogs: "
              />
            )}
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl shadow-xl w-full max-w-2xl transform transition-all ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Full Description
                </h2>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className={`transition-colors ${
                    isDark 
                      ? 'text-gray-400 hover:text-gray-200' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <p className={`whitespace-pre-wrap ${
                  isDark ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {selectedMessage}
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                    isDark 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
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
};

export default AdminBlogs; 