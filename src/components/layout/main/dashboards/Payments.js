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
import { FaReceipt, FaChartLine, FaFilter, FaSort } from "react-icons/fa";
import { MdOutlineReceiptLong } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  XCircle,
  Calendar,
  DollarSign,
  Users,
  Activity,
  Tag
} from "lucide-react";
import jsPDF from 'jspdf';
import { useTheme } from 'next-themes';
import { toast } from 'react-hot-toast';

// Function to dynamically import jspdf-autotable
const loadAutoTable = async () => {
  try {
    // Dynamic import for jspdf-autotable
    const autoTableModule = await import('jspdf-autotable');
    return autoTableModule.default;
  } catch (error) {
    console.error('Failed to load jspdf-autotable:', error);
    return null;
  }
};

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

  // Add currency conversion rates (you may want to fetch these from an API in production)
  const currencyRates = {
    USD: 1,
    INR: 0.012 // Example rate: 1 INR = 0.012 USD
  };

  // Helper function to format currency
  const formatCurrency = (amount, currency = 'USD') => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return formatter.format(amount);
  };

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
      console.log("Fetching payments with studentId:", studentId, "activeTab:", activeTab);
      fetchPayments();
    }
  }, [studentId, authToken, page, limit, activeTab]);

  // Apply filters when filter parameters change
  useEffect(() => {
    console.log("Applying filters. Payments count:", payments.length);
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
        console.log("API Response:", response); // Debug log
        
        // Check if response is an array (direct data)
        if (Array.isArray(response)) {
          console.log("Processing direct array response:", response.length);
          
          const formattedPayments = response.map((item) => ({
            id: item.id,
            orderId: item.orderId || (item.id ? `ORD-${item.id.substring(0, 8)}` : "N/A"),
            price: item.price?.amount || 0,
            course: item.course || item.course_id?.course_title || "Unknown Course",
            courseId: item.course_id?._id || null,
            courseImage: item.courseImage || item.course_id?.course_image || "",
            joinDate: item.enrollmentDate || item.enrollment_date || "N/A",
            status: item.status || item.enrollmentStatus || "N/A",
            paymentType: item.type || "Course Enrollment",
            receiptUrl: null, // Will need to generate
            paymentMethod: item.paymentMethod || "Card",
            transactionId: item.id || "N/A",
            currency: item.price?.currency || "INR",
            studentName: item.studentName || "N/A",
            expiryDate: item.expiryDate || null,
            batch_size: item.paymentType === "batch" ? 2 : 1,
            is_self_paced: item.is_self_paced || false,
            progress: item.progress || 0,
            isCertified: item.isCertified || false
          }));
          
          console.log("Formatted payments:", formattedPayments.length);
          setPayments(formattedPayments);
          
          // Update pagination
          setTotalPages(Math.ceil(response.length / limit));
          
          // Update payment statistics
          if (activeTab === "all") {
            updatePaymentStatistics({ data: response });
          }
          
          // Clear any auth errors if request was successful
          setAuthError(false);
        } 
        // Check if response has a data property
        else if (response?.data) {
          console.log("Processing response with data property");
          
          // Process the data array
          if (Array.isArray(response.data)) {
            console.log("Processing data array:", response.data.length);
            
            const formattedPayments = response.data.map((item) => ({
              id: item.id,
              orderId: item.orderId || (item.id ? `ORD-${item.id.substring(0, 8)}` : "N/A"),
              price: item.price?.amount || 0,
              course: item.course || item.course_id?.course_title || "Unknown Course",
              courseId: item.course_id?._id || null,
              courseImage: item.courseImage || item.course_id?.course_image || "",
              joinDate: item.enrollmentDate || item.enrollment_date || "N/A",
              status: item.status || item.enrollmentStatus || "N/A",
              paymentType: item.type || "Course Enrollment",
              receiptUrl: null, // Will need to generate
              paymentMethod: item.paymentMethod || "Card",
              transactionId: item.id || "N/A",
              currency: item.price?.currency || "INR",
              studentName: item.studentName || "N/A",
              expiryDate: item.expiryDate || null,
              batch_size: item.paymentType === "batch" ? 2 : 1,
              is_self_paced: item.is_self_paced || false,
              progress: item.progress || 0,
              isCertified: item.isCertified || false
            }));
            
            console.log("Formatted payments:", formattedPayments.length);
            setPayments(formattedPayments);
            
            // Update pagination from the API response
            if (response.pagination) {
              setTotalPages(response.pagination.totalPages || Math.ceil(response.pagination.total / limit));
            } else {
              setTotalPages(Math.ceil(response.data.length / limit));
            }
            
            // Update payment statistics
            if (activeTab === "all") {
              updatePaymentStatistics(response);
            }
            
            // Clear any auth errors if request was successful
            setAuthError(false);
          } else {
            console.error("Response data is not an array:", response.data);
            setPayments([]);
          }
        } else {
          console.error("Unexpected API response format:", response);
          setPayments([]);
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
    // Get the data array from the response
    const paymentsData = Array.isArray(data) ? data : (data.data || []);
    
    // Calculate statistics from the payment data
    const totalSpent = paymentsData.reduce((total, payment) => {
      const amount = payment.price?.amount || 0;
      const currency = payment.price?.currency || 'INR';
      // Convert to USD if different currency
      const amountInUSD = amount * (currencyRates[currency] || 1);
      return total + amountInUSD;
    }, 0);
    
    // Get the most recent payment date
    const allDates = paymentsData
      .map(p => p.enrollmentDate || p.enrollment_date)
      .filter(date => date);
    
    const lastPaymentDate = allDates.length > 0 
      ? new Date(Math.max(...allDates.map(date => new Date(date).getTime()))).toISOString() 
      : '';
    
    // Count active subscriptions/enrollments
    const activeEnrollments = paymentsData.filter(p => 
      p.status === 'active' || p.status === 'completed' || p.enrollmentStatus === 'active'
    ).length;
    
    setPaymentStats({
      totalSpent,
      totalPayments: paymentsData.length,
      lastPaymentDate,
      activeSubscriptions: activeEnrollments
    });
  };

  // Filter and sort payment data based on search query, status, and sort order
  const filterAndSortData = () => {
    console.log("Filtering data. Payments count:", payments.length); // Debug log
    
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

    console.log("Filtered data count:", filteredData.length); // Debug log
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
    console.log("Changing tab to:", tab);
    setActiveTab(tab);
    setPage(1);
    // Reset filters when changing tabs to ensure we show all data for the new tab
    resetFilters();
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

  // Update the generatePDFReceipt function
  const generatePDFReceipt = async (payment) => {
    try {
      // Create a new jsPDF instance
      const doc = new jsPDF();
      
      // Dynamically load the autoTable plugin
      const autoTable = await loadAutoTable();
      
      if (!autoTable) {
        console.error('jspdf-autotable plugin not properly loaded');
        // Fallback to a simpler receipt without tables
        return generateSimpleReceipt(doc, payment);
      }
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Add header with company info
      doc.setFontSize(20);
      doc.setTextColor(44, 62, 80);
      doc.text('MEDH', 15, 20);
      
      // Add receipt title and info
      doc.setFontSize(24);
      doc.setTextColor(44, 62, 80);
      doc.text('RECEIPT', pageWidth - 70, 30);
      
      // Add receipt number and date
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Receipt #: ${payment.orderId?.substring(0, 8) || 'N/A'}`, pageWidth - 70, 40);
      doc.text(`Date: ${new Date(payment.joinDate).toLocaleDateString()}`, pageWidth - 70, 45);
      
      // Add company info
      doc.setFontSize(10);
      doc.setTextColor(70, 70, 70);
      doc.text('Medh Education Technologies', 15, 50);
      doc.text('123 Education Street', 15, 55);
      doc.text('Bangalore, Karnataka 560001', 15, 60);
      doc.text('India', 15, 65);
      doc.text('GST: 29AABCU9603R1ZJ', 15, 70);
      
      // Add line
      doc.setDrawColor(220, 220, 220);
      doc.line(15, 80, pageWidth - 15, 80);
      
      // Add student info
      doc.setFontSize(12);
      doc.setTextColor(44, 62, 80);
      doc.text('Billed To:', 15, 95);
      doc.setFontSize(10);
      doc.setTextColor(70, 70, 70);
      doc.text(payment.studentName || 'Student Name', 15, 105);
      
      // Add payment details table
      const tableData = [
        [
          payment.course || 'Course Name',
          `${payment.currency === 'INR' ? '₹' : '$'}${parseFloat(payment.price || 0).toFixed(2)}`
        ]
      ];
      
      // Use the dynamically loaded autoTable function
      autoTable(doc, {
        startY: 120,
        head: [['Description', 'Amount']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [66, 139, 202],
          textColor: [255, 255, 255],
          fontSize: 10
        },
        styles: {
          fontSize: 9,
          cellPadding: 5
        },
        columnStyles: {
          0: { cellWidth: 130 },
          1: { cellWidth: 30, halign: 'right' }
        }
      });
      
      // Get the final Y position after the table
      const finalY = doc.lastAutoTable.finalY + 10;
      
      // Add total
      doc.setFontSize(10);
      doc.setTextColor(44, 62, 80);
      doc.text('Subtotal:', pageWidth - 80, finalY);
      doc.text(`${payment.currency === 'INR' ? '₹' : '$'}${parseFloat(payment.price || 0).toFixed(2)}`, pageWidth - 30, finalY, { align: 'right' });
      doc.text('Tax:', pageWidth - 80, finalY + 7);
      doc.text('0.00', pageWidth - 30, finalY + 7, { align: 'right' });
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('Total:', pageWidth - 80, finalY + 15);
      doc.text(`${payment.currency === 'INR' ? '₹' : '$'}${parseFloat(payment.price || 0).toFixed(2)}`, pageWidth - 30, finalY + 15, { align: 'right' });
      
      // Add payment info
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Payment Method: ${payment.paymentMethod || 'N/A'}`, 15, finalY + 30);
      doc.text(`Transaction ID: ${payment.transactionId || 'N/A'}`, 15, finalY + 37);
      doc.text(`Status: ${payment.status || 'N/A'}`, 15, finalY + 44);
      
      // Add footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('This is a computer generated receipt and does not require a signature.', pageWidth/2, pageHeight - 20, { align: 'center' });
      
      return doc;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate receipt');
    }
  };

  // Fallback function for when autoTable is not available
  const generateSimpleReceipt = (doc, payment) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Add header with company info
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text('MEDH', 15, 20);
    
    // Add receipt title and info
    doc.setFontSize(24);
    doc.setTextColor(44, 62, 80);
    doc.text('RECEIPT', pageWidth - 70, 30);
    
    // Add receipt number and date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Receipt #: ${payment.orderId?.substring(0, 8) || 'N/A'}`, pageWidth - 70, 40);
    doc.text(`Date: ${new Date(payment.joinDate).toLocaleDateString()}`, pageWidth - 70, 45);
    
    // Add company info
    doc.setFontSize(10);
    doc.setTextColor(70, 70, 70);
    doc.text('Medh Education Technologies', 15, 50);
    doc.text('123 Education Street', 15, 55);
    doc.text('Bangalore, Karnataka 560001', 15, 60);
    doc.text('India', 15, 65);
    doc.text('GST: 29AABCU9603R1ZJ', 15, 70);
    
    // Add line
    doc.setDrawColor(220, 220, 220);
    doc.line(15, 80, pageWidth - 15, 80);
    
    // Add student info
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.text('Billed To:', 15, 95);
    doc.setFontSize(10);
    doc.setTextColor(70, 70, 70);
    doc.text(payment.studentName || 'Student Name', 15, 105);
    
    // Add payment details without table
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.text('Description', 15, 120);
    doc.text('Amount', pageWidth - 50, 120);
    
    // Add line
    doc.setDrawColor(220, 220, 220);
    doc.line(15, 125, pageWidth - 15, 125);
    
    // Add course and price
    doc.setFontSize(10);
    doc.setTextColor(70, 70, 70);
    doc.text(payment.course || 'Course Name', 15, 135);
    doc.text(`${payment.currency === 'INR' ? '₹' : '$'}${parseFloat(payment.price || 0).toFixed(2)}`, pageWidth - 50, 135, { align: 'right' });
    
    // Add total
    doc.setFontSize(10);
    doc.setTextColor(44, 62, 80);
    doc.text('Subtotal:', pageWidth - 80, 155);
    doc.text(`${payment.currency === 'INR' ? '₹' : '$'}${parseFloat(payment.price || 0).toFixed(2)}`, pageWidth - 30, 155, { align: 'right' });
    doc.text('Tax:', pageWidth - 80, 162);
    doc.text('0.00', pageWidth - 30, 162, { align: 'right' });
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Total:', pageWidth - 80, 170);
    doc.text(`${payment.currency === 'INR' ? '₹' : '$'}${parseFloat(payment.price || 0).toFixed(2)}`, pageWidth - 30, 170, { align: 'right' });
    
    // Add payment info
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Payment Method: ${payment.paymentMethod || 'N/A'}`, 15, 185);
    doc.text(`Transaction ID: ${payment.transactionId || 'N/A'}`, 15, 192);
    doc.text(`Status: ${payment.status || 'N/A'}`, 15, 199);
    
    // Add footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('This is a computer generated receipt and does not require a signature.', pageWidth/2, pageHeight - 20, { align: 'center' });
    
    return doc;
  };

  // Update the handleGenerateReceipt function
  const handleGenerateReceipt = async (payment) => {
    try {
      setLoading(true);
      
      // Generate PDF
      const doc = await generatePDFReceipt(payment);
      
      // Save the PDF
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      // Update the payment with the receipt URL
      const updatedPayments = payments.map(p => 
        p.id === payment.id 
          ? { ...p, receiptUrl: pdfUrl } 
          : p
      );
      setPayments(updatedPayments);
      
      // Update filtered payments
      filterAndSortData();
      
      // Show receipt in modal
      setSelectedPayment({
        ...payment,
        receiptUrl: pdfUrl
      });
      setShowReceiptModal(true);
      
      showToast.success('Receipt generated successfully!');
    } catch (error) {
      console.error('Error generating receipt:', error);
      toast.error('Failed to generate receipt. Please try again.');
    } finally {
      setLoading(false);
    }
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
      icon: <FaReceipt className="w-4 h-4" />,
      render: (row) => (
        <div className="font-medium space-y-1">
          <div className="flex items-center gap-2">
            {row.orderId && row.orderId !== "N/A" ? (
              <div className="group relative">
                <span className="text-sm text-gray-900 dark:text-white font-mono cursor-help">
                  {`${row.orderId.substring(0, 8)}...`}
                </span>
                <div className="absolute left-0 top-full mt-1 z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 whitespace-nowrap">
                  {row.orderId}
                </div>
              </div>
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                {row.id ? `ID: ${row.id.substring(0, 8)}...` : "No ID available"}
              </span>
            )}
          </div>
          <span className="block text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {row.joinDate && row.joinDate !== "N/A" ? new Date(row.joinDate).toLocaleDateString() : "N/A"}
          </span>
        </div>
      )
    },
    { 
      Header: "Course", 
      accessor: "course", 
      width: 180,
      icon: <BookOpen className="w-4 h-4" />,
      render: (row) => (
        <div className="max-w-[180px] space-y-1.5" title={row.course}>
          <div className="flex items-center gap-2">
            {row.courseImage && (
              <div className="w-8 h-8 rounded-md overflow-hidden flex-shrink-0">
                <Image 
                  src={row.courseImage} 
                  alt={row.course} 
                  width={32} 
                  height={32}
                  className="object-cover"
                />
              </div>
            )}
            <p className="font-medium text-gray-900 dark:text-white truncate">
              {row.course}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {row.is_self_paced !== undefined && (
              <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
                row.is_self_paced 
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' 
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
              }`}>
                {row.is_self_paced ? (
                  <>
                    <Clock className="w-3 h-3" />
                    Self-paced
                  </>
                ) : (
                  <>
                    <Calendar className="w-3 h-3" />
                    Scheduled
                  </>
                )}
              </span>
            )}
            {row.batch_size > 1 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 flex items-center gap-1">
                <Users className="w-3 h-3" />
                Batch
              </span>
            )}
            {row.progress !== undefined && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 flex items-center gap-1">
                <Activity className="w-3 h-3" />
                {row.progress}%
              </span>
            )}
          </div>
        </div>
      )
    },
    {
      Header: "Price",
      accessor: "price",
      width: 120,
      icon: <DollarSign className="w-4 h-4" />,
      render: (row) => {
        const currency = row.currency || 'INR';
        const currencySymbol = currency === 'INR' ? '₹' : '$';
        return (
          <div className="font-medium space-y-1">
            <span className="text-gray-900 dark:text-white flex items-center gap-1">
              {currencySymbol}{parseFloat(row.price || 0).toFixed(2)}
            </span>
            <span className="block text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" />
              {row.paymentMethod || 'Card'}
            </span>
          </div>
        );
      }
    },
    {
      Header: "Type",
      accessor: "paymentType",
      width: 120,
      icon: <Tag className="w-4 h-4" />,
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
            row.paymentType === "Subscription"
              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
              : "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
          }`}>
            {row.paymentType === "Subscription" ? (
              <>
                <MdOutlineReceiptLong className="w-4 h-4" />
                Subscription
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4" />
                {row.paymentType || "Enrollment"}
              </>
            )}
          </span>
        </div>
      )
    },
    {
      Header: "Status",
      accessor: "status",
      icon: <Activity className="w-4 h-4" />,
      render: (row) => {
        const statusLower = (row.status || "").toLowerCase();
        let statusConfig = {
          icon: null,
          className: ""
        };
        
        if (statusLower === "completed" || statusLower === "success" || statusLower === "active") {
          statusConfig = {
            icon: <CheckCircle className="w-4 h-4" />,
            className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
          };
        } else if (statusLower === "pending") {
          statusConfig = {
            icon: <Clock className="w-4 h-4" />,
            className: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
          };
        } else {
          statusConfig = {
            icon: <XCircle className="w-4 h-4" />,
            className: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
          };
        }
        
        return (
          <div className="flex justify-center">
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.className}`}>
              {statusConfig.icon}
              {row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase() : "N/A"}
            </span>
          </div>
        );
      },
      width: 120,
    },
    {
      Header: "Expiry",
      accessor: "expiryDate",
      width: 120,
      icon: <Calendar className="w-4 h-4" />,
      render: (row) => (
        <div className="text-sm">
          {row.expiryDate ? (
            <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <Calendar className="w-4 h-4" />
              {new Date(row.expiryDate).toLocaleDateString()}
            </div>
          ) : (
            <span className="text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              N/A
            </span>
          )}
        </div>
      )
    },
    {
      Header: "Action",
      accessor: "actions",
      width: 180,
      render: (row) => (
        <div className="flex gap-2 items-center justify-end">
          {row.receiptUrl ? (
            <>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={row.receiptUrl}
                download={`receipt-${row.orderId?.substring(0, 8) || 'download'}.pdf`}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-primary hover:text-primary-dark"
                title="Download Receipt"
              >
                <FiDownload className="w-5 h-5" />
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleViewReceipt(row)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-blue-600 hover:text-blue-700"
                title="View Receipt"
              >
                <FiEye className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleResendReceipt(row)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-emerald-600 hover:text-emerald-700"
                title="Email Receipt"
                disabled={isResendingReceipt}
              >
                <FiMail className="w-5 h-5" />
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGenerateReceipt(row)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-colors ${
                ['completed', 'success', 'active'].includes(row.status?.toLowerCase())
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!['completed', 'success', 'active'].includes(row.status?.toLowerCase())}
            >
              <MdOutlineReceiptLong className="w-5 h-5" />
              Generate
            </motion.button>
          )}
        </div>
      ),
    },
  ];

  // Pagination UI
  const renderPagination = () => {
    return (
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 border-t border-gray-100 dark:border-gray-700/50">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {Math.min((page - 1) * limit + 1, filteredPayments.length)} to {Math.min(page * limit, filteredPayments.length)} of {filteredPayments.length} entries
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>

          <nav className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
              className={`p-2 rounded-lg transition-colors ${
                page === 1
                  ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <motion.button
                key={pageNum}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPage(pageNum)}
                className={`min-w-[2.5rem] h-10 rounded-lg text-sm font-medium transition-colors ${
                  pageNum === page
                    ? 'bg-primary text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {pageNum}
              </motion.button>
            ))}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className={`p-2 rounded-lg transition-colors ${
                page === totalPages
                  ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </nav>
        </div>
      </div>
    );
  };

  // Payment statistics UI
  const renderPaymentStatistics = () => {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 mb-8 shadow-lg border border-gray-100 dark:border-gray-700/50"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Payment Summary
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Overview of your financial activity
            </p>
          </div>
          <button 
            onClick={() => setShowStatistics(!showStatistics)}
            className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
          >
            {showStatistics ? 'Hide' : 'Show'} Statistics
          </button>
        </div>
        
        {showStatistics && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 p-6 border border-blue-100 dark:border-blue-800/30"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Spent</p>
                  <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/50">
                    <FaChartLine className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {formatCurrency(paymentStats.totalSpent)}
                </h3>
                <p className="text-sm text-blue-600/60 dark:text-blue-400/60">
                  Lifetime spending
                </p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 p-6 border border-emerald-100 dark:border-emerald-800/30"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 dark:bg-emerald-400/5 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Total Payments</p>
                  <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/50">
                    <FaReceipt className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {paymentStats.totalPayments}
                </h3>
                <p className="text-sm text-emerald-600/60 dark:text-emerald-400/60">
                  Successful transactions
                </p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 p-6 border border-purple-100 dark:border-purple-800/30"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Last Payment</p>
                  <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/50">
                    <FiCalendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {paymentStats.lastPaymentDate 
                    ? new Date(paymentStats.lastPaymentDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })
                    : 'N/A'}
                </h3>
                <p className="text-sm text-purple-600/60 dark:text-purple-400/60">
                  Most recent transaction
                </p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 p-6 border border-amber-100 dark:border-amber-800/30"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 dark:bg-amber-400/5 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Active Subscriptions</p>
                  <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50">
                    <MdOutlineReceiptLong className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {paymentStats.activeSubscriptions}
                </h3>
                <p className="text-sm text-amber-600/60 dark:text-amber-400/60">
                  Current subscriptions
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
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
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={selectedPayment.receiptUrl}
                  download={`receipt-${selectedPayment.orderId?.substring(0, 8) || 'download'}.pdf`}
                  className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors"
                >
                  <FiDownload className="w-4 h-4" /> Download Receipt
                </motion.a>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleResendReceipt(selectedPayment)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                  disabled={isResendingReceipt}
                >
                  <FiMail className="w-4 h-4" /> 
                  {isResendingReceipt ? 'Sending...' : 'Email Receipt'}
                </motion.button>
              </div>
              
              {resendSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 p-3 bg-green-50 text-green-600 rounded-lg text-center flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Receipt email sent successfully!
                </motion.div>
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
                        {selectedPayment.paymentType === "Subscription" ? "Subscription" : "Enrollment"}
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

  // Add new animation variants
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  const filterVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
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
      <div className="w-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700/50">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Payments
          </h1>
        </div>
        
        {/* Payment Statistics */}
        {renderPaymentStatistics()}
        
        {/* Payment Tabs */}
        <div className="px-6 mb-6">
          <div className="flex space-x-2 p-1 bg-gray-100/50 dark:bg-gray-700/50 rounded-xl">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "all" 
                  ? "bg-white dark:bg-gray-800 text-primary shadow-sm" 
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
              onClick={() => handleTabChange("all")}
            >
              All Payments
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "enrollments" 
                  ? "bg-white dark:bg-gray-800 text-primary shadow-sm" 
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
              onClick={() => handleTabChange("enrollments")}
            >
              Enrollments
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "subscriptions" 
                  ? "bg-white dark:bg-gray-800 text-primary shadow-sm" 
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
              onClick={() => handleTabChange("subscriptions")}
            >
              Subscriptions
            </motion.button>
          </div>
        </div>

        {/* Advanced Filters */}
        <motion.div
          variants={filterVariants}
          initial="hidden"
          animate={showAdvancedFilters ? "visible" : "hidden"}
          className="px-6"
        >
          {renderAdvancedFilters()}
        </motion.div>
        
        {/* Search and Filters */}
        <div className="p-6 space-y-4">
          <motion.div 
            variants={filterVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col md:flex-row items-center gap-4"
          >
            <div className="relative w-full md:w-1/3">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <SearchIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by Course, Price or Order ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
              />
            </div>

            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <button
                  onClick={() => handleDropdownToggle("filter")}
                  className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all duration-200 flex items-center gap-2"
                >
                  <BiFilterAlt className="w-5 h-5" />
                  <span>Filter</span>
                </button>

                {openDropdown === "filter" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute z-20 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
                  >
                    <div className="p-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status
                      </label>
                      <select
                        className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={selectedStatus}
                        onChange={(e) => handleFilterSelection(e.target.value)}
                      >
                        <option value="">All Statuses</option>
                        <option value="success">Success</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <button
                  onClick={() => handleDropdownToggle("sort")}
                  className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all duration-200 flex items-center gap-2"
                >
                  <FaSort className="w-5 h-5" />
                  <span>Sort</span>
                </button>

                {openDropdown === "sort" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 z-20 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
                  >
                    <div className="py-2">
                      {[
                        { label: "Date: New to Old", value: "newToOld" },
                        { label: "Date: Old to New", value: "oldToNew" },
                        { label: "Price: High to Low", value: "highToLow" },
                        { label: "Price: Low to High", value: "lowToHigh" }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleSortSelection(option.value)}
                          className={`w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
                            sortOrder === option.value
                              ? "text-primary bg-primary/5"
                              : "text-gray-700 dark:text-gray-200"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all duration-200 flex items-center gap-2"
              >
                <FaFilter className="w-5 h-5" />
                <span>Advanced</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Table Section */}
          <motion.div
            variants={tableVariants}
            initial="hidden"
            animate="visible"
            className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm overflow-hidden"
          >
            {loading && payments.length > 0 ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <Preloader />
              </div>
            ) : filteredPayments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center min-h-[400px] text-center p-8"
              >
                <div className="w-20 h-20 mb-6 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center">
                  <FaReceipt className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Payments Found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                  {payments.length === 0 
                    ? "You don't have any payments yet. Enroll in a course to see your payments here."
                    : "We couldn't find any payments matching your criteria. Try adjusting your filters or search terms."}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Reset Filters
                  </button>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Clear Search
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                <MyTable columns={columns} data={filteredPayments.slice((page - 1) * limit, page * limit)} />
                {renderPagination()}
              </>
            )}
          </motion.div>
        </div>

        {/* Receipt Modal */}
        {renderReceiptModal()}

        {/* Debug Mode */}
        {debugMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="m-6 border border-red-200 dark:border-red-800/30 p-4 rounded-xl bg-red-50/50 dark:bg-red-900/10"
          >
            <p className="font-medium text-red-800 dark:text-red-400 mb-2">Debug Information:</p>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-xs font-mono overflow-auto max-h-32">
              <p className="text-gray-700 dark:text-gray-300">User ID: {localStorage.getItem("userId") || "Not found"}</p>
              <p className="text-gray-700 dark:text-gray-300">Token: {localStorage.getItem("token") ? "Found in localStorage" : "Not found in localStorage"}</p>
              <p className="text-gray-700 dark:text-gray-300">Header Format: Using 'x-access-token' header (not 'Authorization')</p>
              <p className="text-gray-700 dark:text-gray-300">Token Preview: {localStorage.getItem("token") ? `${localStorage.getItem("token").substring(0, 20)}...` : "N/A"}</p>
            </div>
            <p className="text-xs mt-2 text-red-600 dark:text-red-400">Press Alt+Shift+D to toggle debug mode</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PaymentTable;