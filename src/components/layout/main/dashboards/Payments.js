"use client";
import React, { useState, useEffect, useRef } from "react";
import { BiFilterAlt } from "react-icons/bi";
import { SearchIcon } from "@/assets/images/icon/SearchIcon";
import MyTable from "@/components/shared/common-table/page";
import Image from "next/image";
import RecieptImage from "../../../../assets/images/dashbord/EditImage.png";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import Preloader from "@/components/shared/others/Preloader";
import usePostQuery from "@/hooks/postQuery.hook";
import { FiDownload, FiMail, FiEye, FiCalendar } from "react-icons/fi";
import { FaReceipt, FaChartLine, FaFilter } from "react-icons/fa";
import { MdOutlineReceiptLong } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Auth helper function to get token - using x-access-token format
const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  
  // Get the token from localStorage
  const token = localStorage.getItem("token");
  
  // Return without Bearer prefix for x-access-token usage
  return token;
};

// Inline Modal component to prevent import errors
const Modal = ({ isOpen, onClose, title, children }) => {
  const overlayRef = useRef(null);
  
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };
  
  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div 
        className="w-full max-w-2xl bg-white rounded-lg shadow-xl mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoMdClose size={24} />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

const PaymentTable = () => {
  // State variables
  const [openDropdown, setOpenDropdown] = useState("");
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'enrollments', 'subscriptions'
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("newToOld");
  const [studentId, setStudentId] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showStatistics, setShowStatistics] = useState(true);
  const [paymentStats, setPaymentStats] = useState({
    totalSpent: 0,
    totalPayments: 0,
    lastPaymentDate: '',
    activeSubscriptions: 0
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });
  const [priceRange, setPriceRange] = useState({
    min: '',
    max: ''
  });
  const [courseType, setCourseType] = useState("all"); // "all", "self-paced", "scheduled"
  const [batchFilter, setBatchFilter] = useState("all"); // "all", "individual", "batch"
  const [isResendingReceipt, setIsResendingReceipt] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [authError, setAuthError] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  
  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();

  // Fetch user ID and authentication token on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Get userId from localStorage, matching the dashboard approach
      const storedUserId = localStorage.getItem("userId");
      // Get token using our helper function (which matches dashboard)
      const token = getAuthToken();
      
      if (storedUserId) {
        setStudentId(storedUserId);
        
        if (token) {
          setAuthToken(token);
        } else {
          console.error("Authentication token not found in localStorage");
          setAuthError(true);
          // Redirect to login after a delay, matching dashboard behavior
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        }
      } else {
        setLoading(false);
        console.error("Student ID not found in localStorage");
        setAuthError(true);
      }
    }
  }, []);

  // Fetch payments when studentId or page/filter parameters change
  useEffect(() => {
    if (studentId && authToken) {
      fetchPayments();
    }
  }, [studentId, authToken, page, limit, activeTab]);

  // Apply filters when filter parameters change
  useEffect(() => {
    filterAndSortData();
  }, [searchQuery, selectedStatus, sortOrder, payments, dateRange, priceRange, courseType, batchFilter]);

  // Toggle debug mode with key sequence (Alt+Shift+D)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.shiftKey && e.key === 'D') {
        setDebugMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch payment data using the new API
  const fetchPayments = () => {
    setLoading(true);
    
    // Get fresh token for x-access-token header
    const token = getAuthToken();
    
    if (!token) {
      console.error("Token not found when trying to fetch payments");
      setAuthError(true);
      setLoading(false);
      return;
    }
    
    // Determine payment_type based on activeTab
    let paymentType = "";
    if (activeTab === "enrollments") paymentType = "enrollment";
    if (activeTab === "subscriptions") paymentType = "subscription";
    
    // Add headers with x-access-token instead of Authorization
    const headers = {
      'x-access-token': token,
      'Content-Type': 'application/json'
    };
    
    console.log("Making API request with token header");
    
    getQuery({
      url: apiUrls.payment.getStudentPayments(studentId, {
        page,
        limit,
        payment_type: paymentType
      }),
      headers,
      onSuccess: (response) => {
        if (response?.success) {
          // New data structure mapping based on the updated API response format
          const allPayments = [];
          
          // Process enrollments if they exist
          if (response.data.enrollments && response.data.enrollments.length > 0) {
            const formattedEnrollments = response.data.enrollments.map((enrollment) => ({
              id: enrollment._id,
              orderId: enrollment._id,
              price: enrollment.course_id?.course_fee || 0,
              course: enrollment.course_id?.course_title || "N/A",
              courseId: enrollment.course_id?._id || null,
              joinDate: enrollment.enrollment_date || enrollment.createdAt || "N/A",
              status: enrollment.payment_status || enrollment.status || "N/A",
              paymentType: "enrollment",
              receiptUrl: null, // Will need to generate
              paymentMethod: enrollment.payment_details?.payment_method || "Card",
              transactionId: enrollment._id || "N/A",
              currency: enrollment.payment_details?.currency || "USD",
              studentName: enrollment.student_id?.full_name || "N/A",
              expiryDate: enrollment.expiry_date || null,
              batch_size: enrollment.batch_size || 1,
              is_self_paced: enrollment.is_self_paced
            }));
            
            allPayments.push(...formattedEnrollments);
          }
          
          // Process subscriptions if they exist
          if (response.data.subscriptions && response.data.subscriptions.length > 0) {
            const formattedSubscriptions = response.data.subscriptions.map((subscription) => ({
              id: subscription._id,
              orderId: subscription._id,
              price: subscription.amount || 0,
              course: subscription.plan_name || "Subscription Plan",
              courseId: null,
              joinDate: subscription.start_date || subscription.createdAt || "N/A",
              status: subscription.status || "N/A",
              paymentType: "subscription",
              receiptUrl: null, // Will need to generate
              paymentMethod: subscription.payment_method || "Card",
              transactionId: subscription._id || "N/A",
              currency: subscription.currency || "USD",
              studentName: subscription.student_id?.full_name || "N/A",
              expiryDate: subscription.end_date || null
            }));
            
            allPayments.push(...formattedSubscriptions);
          }
          
          setPayments(allPayments);
          setTotalPages(Math.ceil(response.data.total / limit));
          
          // Update payment statistics
          if (activeTab === "all") {
            updatePaymentStatistics(response.data);
          }
          
          // Clear any auth errors if request was successful
          setAuthError(false);
        } else {
          console.error("Failed to fetch payments:", response?.message);
          
          // Set auth error if authentication fails
          if (response?.message?.includes("Authentication failed") || 
              response?.message?.includes("No token provided") ||
              response?.message?.includes("Unauthorized")) {
            setAuthError(true);
          }
        }
        setLoading(false);
      },
      onFail: (error) => {
        console.error("Error fetching payments:", error);
        
        // Check if error is authentication related
        if (error?.response?.status === 401 || 
            error?.message?.includes("Authentication failed") || 
            error?.message?.includes("token")) {
          setAuthError(true);
        }
        
        setLoading(false);
      },
    });
  };

  // Update payment statistics from API response
  const updatePaymentStatistics = (data) => {
    // Calculate statistics from the enrollment and subscription data
    const enrollments = data.enrollments || [];
    const subscriptions = data.subscriptions || [];
    
    // Calculate total spent
    const totalEnrollmentSpent = enrollments.reduce((total, enrollment) => 
      total + (enrollment.course_id?.course_fee || 0), 0);
    
    const totalSubscriptionSpent = subscriptions.reduce((total, subscription) => 
      total + (subscription.amount || 0), 0);
    
    const totalSpent = totalEnrollmentSpent + totalSubscriptionSpent;
    
    // Get the most recent payment date
    const allDates = [
      ...enrollments.map(e => e.enrollment_date || e.createdAt),
      ...subscriptions.map(s => s.start_date || s.createdAt)
    ].filter(date => date); // Remove undefined dates
    
    const lastPaymentDate = allDates.length > 0 
      ? new Date(Math.max(...allDates.map(date => new Date(date).getTime()))).toISOString() 
      : '';
    
    // Count active subscriptions
    const activeSubscriptions = subscriptions.filter(s => 
      s.status === 'active' || s.status === 'completed'
    ).length;
    
    setPaymentStats({
      totalSpent,
      totalPayments: enrollments.length + subscriptions.length,
      lastPaymentDate,
      activeSubscriptions
    });
  };

  // Filter and sort payment data based on search query, status, and sort order
  const filterAndSortData = () => {
    let filteredData = [...payments];

    // Filter by search query (course, price, and order ID)
    if (searchQuery) {
      filteredData = filteredData.filter(
        (payment) =>
          payment.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.price.toString().includes(searchQuery) ||
          payment.orderId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatus) {
      filteredData = filteredData.filter(
        (payment) => payment.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    // Filter by date range
    if (dateRange.startDate && dateRange.endDate) {
      filteredData = filteredData.filter(payment => {
        const paymentDate = new Date(payment.joinDate);
        return paymentDate >= dateRange.startDate && paymentDate <= dateRange.endDate;
      });
    }

    // Filter by price range
    if (priceRange.min !== '' || priceRange.max !== '') {
      filteredData = filteredData.filter(payment => {
        const price = parseFloat(payment.price);
        if (priceRange.min !== '' && priceRange.max !== '') {
          return price >= parseFloat(priceRange.min) && price <= parseFloat(priceRange.max);
        } else if (priceRange.min !== '') {
          return price >= parseFloat(priceRange.min);
        } else if (priceRange.max !== '') {
          return price <= parseFloat(priceRange.max);
        }
        return true;
      });
    }
    
    // Filter by course type (self-paced or scheduled)
    if (courseType !== "all") {
      filteredData = filteredData.filter(payment => {
        if (courseType === "self-paced") {
          return payment.is_self_paced === true;
        } else if (courseType === "scheduled") {
          return payment.is_self_paced === false;
        }
        return true;
      });
    }
    
    // Filter by batch size
    if (batchFilter !== "all") {
      filteredData = filteredData.filter(payment => {
        if (batchFilter === "individual") {
          return payment.batch_size <= 1 || !payment.batch_size;
        } else if (batchFilter === "batch") {
          return payment.batch_size > 1;
        }
        return true;
      });
    }

    // Sort data by date
    if (sortOrder === "newToOld") {
      filteredData.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
    } else if (sortOrder === "oldToNew") {
      filteredData.sort((a, b) => new Date(a.joinDate) - new Date(b.joinDate));
    } else if (sortOrder === "highToLow") {
      filteredData.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortOrder === "lowToHigh") {
      filteredData.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    }

    setFilteredPayments(filteredData);
  };

  // Handle dropdown toggle
  const handleDropdownToggle = (dropdownType) => {
    setOpenDropdown((prev) => (prev === dropdownType ? "" : dropdownType));
  };

  // Handle filter selection
  const handleFilterSelection = (status) => {
    setSelectedStatus(status);
    setOpenDropdown("");
  };

  // Handle sort selection
  const handleSortSelection = (order) => {
    setSortOrder(order);
    setOpenDropdown("");
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedStatus("");
    setSortOrder("newToOld");
    setDateRange({ startDate: null, endDate: null });
    setPriceRange({ min: '', max: '' });
    setCourseType("all");
    setBatchFilter("all");
    setShowAdvancedFilters(false);
  };

  // Generate receipt for a payment
  const handleGenerateReceipt = (payment) => {
    setLoading(true);
    
    // Get fresh token for x-access-token header
    const token = getAuthToken();
    
    if (!token) {
      console.error("Token not found when trying to generate receipt");
      setAuthError(true);
      setLoading(false);
      return;
    }
    
    // Add headers with x-access-token instead of Authorization
    const headers = {
      'x-access-token': token,
      'Content-Type': 'application/json'
    };
    
    postQuery({
      url: apiUrls.payment.generateReceipt(payment.paymentType, payment.id),
      headers,
      onSuccess: (response) => {
        if (response?.success) {
          // Update the payment in the list with the new receipt URL
          const updatedPayments = payments.map(p => 
            p.id === payment.id 
              ? { ...p, receiptUrl: response.data.receipt_url } 
              : p
          );
          setPayments(updatedPayments);
          filterAndSortData();
          
          // Show receipt in modal
          setSelectedPayment({
            ...payment,
            receiptUrl: response.data.receipt_url
          });
          setShowReceiptModal(true);
        } else {
          console.error("Failed to generate receipt:", response?.message);
        }
        setLoading(false);
      },
      onFail: (error) => {
        console.error("Error generating receipt:", error);
        
        // Check if error is authentication related
        if (error?.response?.status === 401 || 
            error?.message?.includes("Authentication failed") || 
            error?.message?.includes("token")) {
          setAuthError(true);
        }
        
        setLoading(false);
      }
    });
  };

  // Resend receipt email
  const handleResendReceipt = (payment) => {
    setIsResendingReceipt(true);
    setResendSuccess(false);
    
    // Get fresh token for x-access-token header
    const token = getAuthToken();
    
    if (!token) {
      console.error("Token not found when trying to resend receipt email");
      setAuthError(true);
      setIsResendingReceipt(false);
      return;
    }
    
    // Add headers with x-access-token instead of Authorization
    const headers = {
      'x-access-token': token,
      'Content-Type': 'application/json'
    };
    
    postQuery({
      url: apiUrls.payment.resendReceiptEmail(payment.paymentType, payment.id),
      headers,
      onSuccess: (response) => {
        if (response?.success) {
          setResendSuccess(true);
          setTimeout(() => {
            setResendSuccess(false);
          }, 3000);
        } else {
          console.error("Failed to resend receipt:", response?.message);
        }
        setIsResendingReceipt(false);
      },
      onFail: (error) => {
        console.error("Error resending receipt:", error);
        
        // Check if error is authentication related
        if (error?.response?.status === 401 || 
            error?.message?.includes("Authentication failed") || 
            error?.message?.includes("token")) {
          setAuthError(true);
        }
        
        setIsResendingReceipt(false);
      }
    });
  };

  // View receipt details
  const handleViewReceipt = (payment) => {
    setSelectedPayment(payment);
    setShowReceiptModal(true);
  };

  // Table columns configuration
  const columns = [
    { 
      Header: "Order ID", 
      accessor: "orderId", 
      width: 100,
      render: (row) => (
        <span className="font-medium text-sm">
          {row.orderId.substring(0, 8)}...
        </span>
      )
    },
    { 
      Header: "Course", 
      accessor: "course", 
      width: 180,
      render: (row) => (
        <div className="max-w-[180px] truncate" title={row.course}>
          <p className="font-medium">{row.course}</p>
          {row.is_self_paced !== undefined && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${row.is_self_paced ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
              {row.is_self_paced ? 'Self-paced' : 'Scheduled'}
            </span>
          )}
          {row.batch_size > 1 && (
            <span className="text-xs ml-1 px-2 py-0.5 rounded-full bg-green-100 text-green-800">
              Batch: {row.batch_size}
            </span>
          )}
        </div>
      )
    },
    { 
      Header: "Date", 
      accessor: "joinDate", 
      width: 120,
      render: (row) => (
        <span className="text-sm">
          {new Date(row.joinDate).toLocaleDateString()}
        </span>
      )
    },
    {
      Header: "Price",
      accessor: "price",
      width: 100,
      render: (row) => {
        const currency = row.currency || 'USD';
        const currencySymbol = currency === 'INR' ? '₹' : '$';
        return `${currencySymbol}${parseFloat(row.price).toFixed(2)}`;
      }
    },
    {
      Header: "Type",
      accessor: "paymentType",
      width: 120,
      render: (row) => (
        <div className="rounded-md px-3 py-1 bg-blue-50 text-blue-600 text-sm">
          {row.paymentType === "subscription" ? "Subscription" : "Enrollment"}
        </div>
      )
    },
    {
      Header: "Status",
      accessor: "status",
      render: (row) => {
        const statusLower = row.status.toLowerCase();
        let statusClass = "";
        
        if (statusLower === "completed" || statusLower === "success" || statusLower === "active") {
          statusClass = "bg-[#D9F2D9] text-[#3AA438]";
        } else if (statusLower === "pending") {
          statusClass = "bg-[#FFF0D9] text-[#FFA927]";
        } else {
          statusClass = "bg-[#FAD2D2] text-[#D9534F]";
        }
        
        return (
          <div className="flex justify-center items-center">
            <div
              className={`rounded-md font-normal px-3 py-1 text-sm ${statusClass}`}
            >
              {row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase()}
            </div>
          </div>
        );
      },
      width: 100,
    },
    {
      Header: "Expiry",
      accessor: "expiryDate",
      width: 100,
      render: (row) => (
        <span className="text-sm">
          {row.expiryDate ? new Date(row.expiryDate).toLocaleDateString() : "N/A"}
        </span>
      )
    },
    {
      Header: "Action",
      accessor: "actions",
      render: (row) => (
        <div className="flex gap-2 items-center">
          {row.receiptUrl ? (
            <>
              <a
                href={row.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Download Receipt"
              >
                <FiDownload className="text-primary" />
              </a>
              <button
                onClick={() => handleViewReceipt(row)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="View Receipt"
              >
                <FiEye className="text-blue-600" />
              </button>
              <button
                onClick={() => handleResendReceipt(row)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Email Receipt"
              >
                <FiMail className="text-green-600" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleViewReceipt(row)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="View Details"
              >
                <FiEye className="text-blue-600" />
              </button>
              <button
                onClick={() => handleGenerateReceipt(row)}
                className="px-3 py-1 bg-primary text-white rounded-md flex items-center gap-1 text-sm"
                disabled={!['completed', 'success', 'active'].includes(row.status.toLowerCase())}
              >
                <MdOutlineReceiptLong />
                Receipt
              </button>
            </>
          )}
        </div>
      ),
      width: 180,
    },
  ];

  // Pagination UI
  const renderPagination = () => {
    return (
      <div className="flex justify-between items-center mt-4 px-6 py-2">
        <div>
          <span className="text-sm text-gray-600">
            Showing {Math.min((page - 1) * limit + 1, filteredPayments.length)} to {Math.min(page * limit, filteredPayments.length)} of {filteredPayments.length} entries
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page === 1}
            className={`px-3 py-1 rounded ${page === 1 ? 'bg-gray-200 text-gray-500' : 'bg-primary text-white'}`}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`px-3 py-1 rounded ${pageNum === page ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              {pageNum}
            </button>
          ))}
          <button
            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className={`px-3 py-1 rounded ${page === totalPages ? 'bg-gray-200 text-gray-500' : 'bg-primary text-white'}`}
          >
            Next
          </button>
        </div>
        <div>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded px-2 py-1"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>
      </div>
    );
  };

  // Payment statistics UI
  const renderPaymentStatistics = () => {
    return (
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Payment Summary</h2>
          <button 
            onClick={() => setShowStatistics(!showStatistics)}
            className="text-sm text-primary"
          >
            {showStatistics ? 'Hide' : 'Show'} Statistics
          </button>
        </div>
        
        {showStatistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Spent</p>
                  <p className="text-xl font-bold text-gray-800">${paymentStats.totalSpent.toFixed(2)}</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-full">
                  <FaChartLine className="text-blue-600" size={20} />
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Payments</p>
                  <p className="text-xl font-bold text-gray-800">{paymentStats.totalPayments}</p>
                </div>
                <div className="bg-green-100 p-2 rounded-full">
                  <FaReceipt className="text-green-600" size={20} />
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Last Payment</p>
                  <p className="text-xl font-bold text-gray-800">
                    {paymentStats.lastPaymentDate 
                      ? new Date(paymentStats.lastPaymentDate).toLocaleDateString() 
                      : 'N/A'}
                  </p>
                </div>
                <div className="bg-purple-100 p-2 rounded-full">
                  <FiCalendar className="text-purple-600" size={20} />
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Subscriptions</p>
                  <p className="text-xl font-bold text-gray-800">{paymentStats.activeSubscriptions}</p>
                </div>
                <div className="bg-yellow-100 p-2 rounded-full">
                  <MdOutlineReceiptLong className="text-yellow-600" size={20} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Receipt modal UI
  const renderReceiptModal = () => {
    if (!selectedPayment) return null;
    
    return (
      <Modal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        title="Payment Receipt"
      >
        <div className="p-4">
          {selectedPayment.receiptUrl ? (
            <div className="flex flex-col gap-4">
              <div className="aspect-[8.5/11] bg-gray-100 rounded-lg overflow-hidden">
                <iframe 
                  src={selectedPayment.receiptUrl} 
                  className="w-full h-full"
                  title="Payment Receipt"
                />
              </div>
              
              <div className="flex justify-between mt-4">
                <a
                  href={selectedPayment.receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2"
                >
                  <FiDownload /> Download Receipt
                </a>
                
                <button
                  onClick={() => handleResendReceipt(selectedPayment)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2"
                  disabled={isResendingReceipt}
                >
                  <FiMail /> {isResendingReceipt ? 'Sending...' : 'Email Receipt'}
                </button>
              </div>
              
              {resendSuccess && (
                <div className="mt-2 p-2 bg-green-50 text-green-600 rounded-md text-center">
                  Receipt email sent successfully!
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Course</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedPayment.course}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Amount</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedPayment.currency === 'INR' ? '₹' : '$'}
                        {parseFloat(selectedPayment.price).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Payment Date</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(selectedPayment.joinDate).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Payment Method</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedPayment.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedPayment.status}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Type</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedPayment.paymentType === "subscription" ? "Subscription" : "Enrollment"}
                      </p>
                    </div>
                    
                    {selectedPayment.expiryDate && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Expiry Date</p>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(selectedPayment.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    
                    {selectedPayment.batch_size && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Batch Size</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedPayment.batch_size}</p>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Order ID</p>
                      <p className="mt-1 text-sm text-gray-900 break-all">{selectedPayment.orderId}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center py-6">
                <MdOutlineReceiptLong size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Receipt not available. Generate a receipt first.</p>
                <button
                  onClick={() => {
                    handleGenerateReceipt(selectedPayment);
                  }}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
                  disabled={!['completed', 'success', 'active'].includes(selectedPayment.status.toLowerCase())}
                >
                  Generate Receipt
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    );
  };

  // Advanced filters UI
  const renderAdvancedFilters = () => {
    return (
      <div className={`bg-white p-4 rounded-lg shadow-sm mb-4 transition-all duration-300 ${showAdvancedFilters ? 'max-h-96' : 'max-h-0 overflow-hidden opacity-0 p-0'}`}>
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="flex items-center gap-2">
                <DatePicker
                  selected={dateRange.startDate}
                  onChange={(date) => setDateRange({...dateRange, startDate: date})}
                  selectsStart
                  startDate={dateRange.startDate}
                  endDate={dateRange.endDate}
                  placeholderText="Start Date"
                  className="w-full p-2 border rounded-md"
                />
                <span>to</span>
                <DatePicker
                  selected={dateRange.endDate}
                  onChange={(date) => setDateRange({...dateRange, endDate: date})}
                  selectsEnd
                  startDate={dateRange.startDate}
                  endDate={dateRange.endDate}
                  minDate={dateRange.startDate}
                  placeholderText="End Date"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <div className="flex items-center gap-2">
                <div className="relative w-full">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">$</span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                    className="w-full pl-8 pr-4 py-2 border rounded-md"
                  />
                </div>
                <span>to</span>
                <div className="relative w-full">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">$</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                    className="w-full pl-8 pr-4 py-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Type</label>
              <select
                value={courseType}
                onChange={(e) => setCourseType(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="all">All Types</option>
                <option value="self-paced">Self-paced</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Size</label>
              <select
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="all">All Enrollments</option>
                <option value="individual">Individual</option>
                <option value="batch">Batch (Group)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4 max-w-md w-full text-center">
          <h2 className="text-lg font-semibold mb-2">Authentication Error</h2>
          <p>Your session may have expired. Please sign in again to continue.</p>
        </div>
        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              // Redirect to login page
              window.location.href = "/login";
            }
          }}
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (loading && !payments.length) {
    return <Preloader />;
  }

  return (
    <div className="flex items-start justify-center md:px-12 w-full font-Open">
      <div className="w-full bg-white dark:bg-inherit rounded-lg shadow-sm">
        <h1 className="text-size-32 px-6 py-4 dark:text-white">Payments</h1>
        
        {/* Payment Statistics Dashboard */}
        {renderPaymentStatistics()}
        
        {/* Payment Tabs */}
        <div className="flex border-b border-gray-200 mb-4 px-6">
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === "all" 
                ? "border-b-2 border-primary text-primary" 
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("all")}
          >
            All Payments
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === "enrollments" 
                ? "border-b-2 border-primary text-primary" 
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("enrollments")}
          >
            Enrollments
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === "subscriptions" 
                ? "border-b-2 border-primary text-primary" 
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("subscriptions")}
          >
            Subscriptions
          </button>
        </div>
        
        {/* Advanced Filters */}
        {renderAdvancedFilters()}
        
        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 space-y-4 md:space-y-0 px-6">
          <div className="relative w-full md:w-1/3">
            <span className="absolute inset-y-0 left-4 flex items-center text-[#666666]">
              <SearchIcon fill="#666666" />
            </span>
            <input
              type="text"
              placeholder="Search by Course, Price or Order ID"
              className="w-full pl-10 pr-4 py-2 border border-[#666666] dark:bg-inherit text-[#666666] rounded-[10px] focus:outline-none focus:ring-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex space-x-2 justify-center md:justify-start">
            <div className="relative">
              <button
                onClick={() => handleDropdownToggle("filter")}
                className="px-6 py-2 border border-[#666666] text-[#666666] rounded-[10px] flex items-center space-x-1"
              >
                <BiFilterAlt />
                <span className="pl-1">Filter</span>
              </button>

              {openDropdown === "filter" && (
                <div className="absolute z-10 bg-white shadow-lg p-4 rounded-md w-48">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={selectedStatus}
                      onChange={(e) => handleFilterSelection(e.target.value)}
                    >
                      <option value="">All</option>
                      <option value="success">Success</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => handleDropdownToggle("sort")}
                className="px-6 py-2 border border-[#666666] text-[#666666] rounded-[10px] flex items-center space-x-1"
              >
                <span>Sort</span>
              </button>

              {openDropdown === "sort" && (
                <div className="absolute z-10 bg-white shadow-lg p-4 rounded-md w-48">
                  <button
                    onClick={() => handleSortSelection("newToOld")}
                    className="block w-full text-left px-2 py-1 rounded hover:bg-gray-100"
                  >
                    Date: New to Old
                  </button>
                  <button
                    onClick={() => handleSortSelection("oldToNew")}
                    className="block w-full text-left px-2 py-1 rounded hover:bg-gray-100"
                  >
                    Date: Old to New
                  </button>
                  <button
                    onClick={() => handleSortSelection("highToLow")}
                    className="block w-full text-left px-2 py-1 rounded hover:bg-gray-100"
                  >
                    Price: High to Low
                  </button>
                  <button
                    onClick={() => handleSortSelection("lowToHigh")}
                    className="block w-full text-left px-2 py-1 rounded hover:bg-gray-100"
                  >
                    Price: Low to High
                  </button>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="px-6 py-2 border border-[#666666] text-[#666666] rounded-[10px] flex items-center space-x-1"
            >
              <FaFilter />
              <span className="pl-1">Advanced</span>
            </button>
          </div>
        </div>
        
        {/* Payment Table */}
        {loading && payments.length > 0 ? (
          <div className="flex justify-center py-10">
            <Preloader />
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="text-center py-10">
            <FaReceipt size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No payment records found</p>
            <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          <>
            <MyTable columns={columns} data={filteredPayments.slice((page - 1) * limit, page * limit)} />
            {renderPagination()}
          </>
        )}
        
        {/* Receipt Modal */}
        {renderReceiptModal()}

        {debugMode && (
          <div className="mt-4 border border-red-300 p-3 rounded-md bg-red-50">
            <p className="font-medium text-red-800 mb-2">Debug Information:</p>
            <div className="bg-white p-2 rounded text-xs font-mono overflow-auto max-h-32">
              <p>User ID: {localStorage.getItem("userId") || "Not found"}</p>
              <p>Token: {localStorage.getItem("token") ? "Found in localStorage" : "Not found in localStorage"}</p>
              <p>Header Format: Using 'x-access-token' header (not 'Authorization')</p>
              <p>Token Preview: {localStorage.getItem("token") ? `${localStorage.getItem("token").substring(0, 20)}...` : "N/A"}</p>
            </div>
            <p className="text-xs mt-2 text-red-600">Press Alt+Shift+D to toggle debug mode</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentTable;
