"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, 
  Phone, 
  Mail, 
  Calendar, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Star, 
  Activity,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  MessageSquare,
  Building,
  GraduationCap,
  UserPlus,
  FileText,
  Briefcase,
  Heart,
  AlertCircle,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Settings,
  ArrowRight,
  ChevronDown,
  MoreHorizontal,
  X,
  Send,
  PhoneCall,
  MapPin,
  Globe,
  Video,
  Zap,
  Target,
  Loader2,
  User,
  Grid3X3,
  List,
  SortAsc,
  SortDesc
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { buildAdvancedComponent, getResponsive, getEnhancedSemanticColor } from "@/utils/designSystem";
import { useTheme } from "next-themes";
import { useFormsData, IFormData } from "@/hooks/useFormsData";
import { useSalesAuth } from "@/hooks/useSalesAuth";

const formCategories = [
  {
    id: "book_a_free_demo_session",
    name: "Demo Sessions",
    icon: Video,
    color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    iconColor: "text-blue-600 dark:text-blue-400",
    description: "Free demo session bookings"
  },
  {
    id: "corporate_training_inquiry",
    name: "Corporate Training",
    icon: Building,
    color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
    iconColor: "text-purple-600 dark:text-purple-400",
    description: "Business training inquiries"
  },
  {
    id: "hire_from_medh_inquiry",
    name: "Hire from MEDH",
    icon: Briefcase,
    color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    iconColor: "text-green-600 dark:text-green-400",
    description: "Hiring inquiries"
  },
  {
    id: "school_partnership_inquiry",
    name: "School Partnerships",
    icon: Heart,
    color: "bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800",
    iconColor: "text-pink-600 dark:text-pink-400",
    description: "School partnership opportunities"
  },
  {
    id: "contact_us",
    name: "General Contact",
    icon: MessageSquare,
    color: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
    iconColor: "text-orange-600 dark:text-orange-400",
    description: "General inquiries & support"
  },
  {
    id: "educator_application",
    name: "Educator Applications",
    icon: GraduationCap,
    color: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    description: "Instructor applications"
  }
];

const statusConfig = {
  submitted: { label: "Submitted", color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800", icon: "📝" },
  pending: { label: "Pending Review", color: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800", icon: "⏳" },
  confirmed: { label: "Confirmed", color: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800", icon: "✅" },
  scheduled: { label: "Scheduled", color: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800", icon: "📅" },
  processing: { label: "In Progress", color: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800", icon: "🔄" },
  completed: { label: "Completed", color: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800", icon: "🎯" },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800", icon: "❌" },
  rejected: { label: "Rejected", color: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800", icon: "🚫" }
};

const priorityConfig = {
  low: { label: "Low", color: "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600", icon: "⚡" },
  medium: { label: "Medium", color: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700", icon: "🔵" },
  high: { label: "High", color: "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700", icon: "🟠" },
  urgent: { label: "Urgent", color: "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700", icon: "🔴" }
};

const SalesDashboard = () => {
  const { theme } = useTheme();
  const { user, isAuthenticated, hasPermission } = useSalesAuth();
  const {
    forms: filteredForms,
    allForms,
    loading,
    error,
    filters,
    stats,
    pagination,
    fetchForms,
    updateFormStatus,
    performBulkAction,
    exportForms,
    goToPage,
    goToNextPage,
    goToPrevPage,
    changePageSize,
    setFilters
  } = useFormsData();

  const [selectedForms, setSelectedForms] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [sortField, setSortField] = useState<string>("submitted_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters({ [key]: value, page: 1 });
  };

  const handleSearchChange = (search: string) => {
    setFilters({ search, page: 1 });
  };

  const handleBulkAction = async (action: string) => {
    if (selectedForms.length === 0) return;
    
    const success = await performBulkAction(selectedForms, action);
    if (success) {
      setSelectedForms([]);
    }
  };

  const handleQuickAction = async (formId: string, action: string) => {
    switch (action) {
      case 'call':
        console.log(`Calling form ${formId}`);
        break;
      case 'email':
        console.log(`Emailing form ${formId}`);
        break;
      case 'confirm':
        await updateFormStatus(formId, 'confirmed');
        break;
      case 'view':
        const form = allForms.find(f => f.id === formId);
        if (form) {
          setSelectedForm(form);
          setShowFormModal(true);
        }
        break;
      default:
        console.log(`Performing ${action} on form:`, formId);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const handleRefresh = () => {
    fetchForms();
  };

  const handleExport = async (format: 'csv' | 'excel' | 'pdf' = 'csv') => {
    await exportForms(format);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Enhanced Form Details Modal Component
  const FormDetailsModal = ({ form, isOpen, onClose }: { form: any, isOpen: boolean, onClose: () => void }) => {
    if (!isOpen || !form) return null;

    const category = formCategories.find(cat => cat.id === form.type) || formCategories[0];
    const status = statusConfig[form.status as keyof typeof statusConfig] || statusConfig.submitted;
    const priority = priorityConfig[form.priority as keyof typeof priorityConfig] || priorityConfig.medium;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          {/* Premium Header */}
          <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 ${category.color} rounded-2xl shadow-lg`}>
                  <category.icon className={`w-6 h-6 ${category.iconColor}`} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {form.name}
                  </h2>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{category.name}</span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    <span className="text-sm font-mono text-gray-500">{form.application_id}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${priority.color}`}>
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  {priority.label}
                </span>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${status.color}`}>
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  {status.label}
                </span>
                <button
                  onClick={onClose}
                  className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Content with Rich Detail Display */}
          <div className="p-8 overflow-y-auto max-h-[calc(90vh-220px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              {/* Contact Information Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <User className="w-5 h-5 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Contact Details</h3>
                </div>
                <div className="space-y-5">
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <User className="w-5 h-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</p>
                      <p className="text-gray-900 dark:text-white font-semibold text-lg">
                        {form.contact_info?.full_name || form.name || 'Not provided'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <Mail className="w-5 h-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</p>
                      <a href={`mailto:${form.contact_info?.email || form.email}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-lg transition-colors">
                        {form.contact_info?.email || form.email}
                      </a>
                    </div>
                  </div>
                  
                  {(form.contact_info?.mobile_number?.formatted || form.phone) && (
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <Phone className="w-5 h-5 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</p>
                        <div className="flex items-center space-x-2">
                          <a href={`tel:${form.contact_info?.mobile_number?.formatted || form.phone}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-lg transition-colors">
                            {form.contact_info?.mobile_number?.formatted || form.phone}
                          </a>
                          {form.contact_info?.mobile_number?.is_validated && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {(form.contact_info?.city || form.city) && (
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
                        <p className="text-gray-900 dark:text-white font-semibold text-lg">
                          {form.contact_info?.city || form.city}
                          {(form.contact_info?.country || form.country) && 
                            `, ${(form.contact_info?.country || form.country).toUpperCase()}`
                          }
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {(form.contact_info?.company || form.company || form.professional_info?.company_name) && (
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <Building className="w-5 h-5 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</p>
                        <p className="text-gray-900 dark:text-white font-semibold text-lg">
                          {form.contact_info?.company || form.company || form.professional_info?.company_name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Session & Course Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Session Information</h3>
                </div>
                <div className="space-y-5">
                  {(form.student_details?.preferred_course?.[0] || form.course) && (
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <BookOpen className="w-5 h-5 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Course Interest</p>
                        <p className="text-gray-900 dark:text-white font-semibold text-lg">
                          {form.student_details?.preferred_course?.[0] || form.course}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {(form.demo_session_details?.preferred_date || form.preferred_date) && (
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Preferred Date</p>
                        <p className="text-gray-900 dark:text-white font-semibold text-lg">
                          {new Date(form.demo_session_details?.preferred_date || form.preferred_date).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {(form.demo_session_details?.preferred_time_slot || form.preferred_time) && (
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <Clock className="w-5 h-5 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Preferred Time</p>
                        <p className="text-gray-900 dark:text-white font-semibold text-lg">
                          {form.demo_session_details?.preferred_time_slot || form.preferred_time}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {form.demo_session_details?.timezone && (
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <Globe className="w-5 h-5 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Timezone</p>
                        <p className="text-gray-900 dark:text-white font-semibold text-lg">
                          {form.demo_session_details.timezone}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Submitted</p>
                      <p className="text-gray-900 dark:text-white font-semibold text-lg">
                        {formatDate(form.submitted_at)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <Globe className="w-5 h-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Source</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-gray-900 dark:text-white font-semibold text-lg capitalize">
                          {form.source || 'Website'}
                        </p>
                        {form.auto_filled && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            Auto-filled
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* True Edge-to-Edge Comprehensive Additional Information */}
            <div className="mt-10 -mx-8">
              <div className="px-8 py-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <FileText className="w-5 h-5 mr-3 text-green-600" />
                  Detailed Information
                </h3>
              </div>
              
              <div className="bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                
                {/* Expanded Student Profile */}
                {form.student_details && (
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-blue-100 dark:border-gray-700 col-span-1 lg:col-span-2">
                    <div className="flex items-center justify-between mb-8">
                      <h4 className="font-bold text-gray-900 dark:text-white text-xl flex items-center">
                        <GraduationCap className="w-6 h-6 mr-3 text-blue-600" />
                        {form.is_student_under_16 ? 'Student Profile (Under 16)' : 'Student Profile'}
                      </h4>
                      <div className="flex items-center space-x-2">
                        {form.is_student_under_16 !== undefined && (
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold ${
                            form.is_student_under_16 
                              ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' 
                              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          }`}>
                            {form.is_student_under_16 ? '👶 Under 16' : '🎓 16 & Above'}
                          </span>
                        )}
                      </div>
                    </div>
                    
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column - Personal Information */}
                      <div className="space-y-6">
                        <h5 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                          <User className="w-5 h-5 mr-2 text-blue-600" />
                          Personal Information
                        </h5>
                        
                        {form.student_details.name && (
                          <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-blue-100 dark:border-gray-700">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Student Name</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              {form.student_details.name}
                            </p>
                          </div>
                        )}
                        
                        {(form.student_details.grade || form.student_details.highest_qualification) && (
                          <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-blue-100 dark:border-gray-700">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                              {form.student_details.grade ? 'Current Grade' : 'Qualification'}
                            </p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              {form.student_details.grade ? 
                                form.student_details.grade.replace('_', ' ').replace('-', ' to ').replace('grade ', 'Grade ') :
                                (() => {
                                  const qualification = form.student_details.highest_qualification;
                                  if (qualification?.includes('_passed')) {
                                    return qualification.replace('_passed', ' Passed').replace('_', ' ');
                                  }
                                  return qualification?.replace('_', ' ').replace(/(\d+)(th|st|nd|rd)$/, '$1$2 Grade') || '';
                                })()
                              }
                            </p>
                          </div>
                        )}
                        
                        {(form.student_details.school_name || form.student_details.education_institute_name) && (
                          <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-blue-100 dark:border-gray-700">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                              {form.student_details.school_name ? 'School' : 'Institute'}
                            </p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              {form.student_details.school_name || form.student_details.education_institute_name}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Right Column - Academic Status */}
                      <div className="space-y-6">
                        <h5 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                          <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
                          Academic Status
                        </h5>
                        
                        {form.student_details.preferred_course && form.student_details.preferred_course.length > 0 && (
                          <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-blue-100 dark:border-gray-700">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Course Interest</p>
                                                         <div className="flex flex-wrap gap-2">
                               {form.student_details.preferred_course.map((course: string, index: number) => (
                                 <span key={index} className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                   {course}
                                 </span>
                               ))}
                             </div>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 gap-4">
                          {form.student_details.currently_studying !== undefined && (
                            <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-blue-100 dark:border-gray-700">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Currently Studying</p>
                                <div className="flex items-center space-x-2">
                                  <span className={`w-3 h-3 rounded-full ${form.student_details.currently_studying ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                  <span className={`font-bold ${form.student_details.currently_studying ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                                    {form.student_details.currently_studying ? 'Yes' : 'No'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {form.student_details.currently_working !== undefined && (
                            <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-blue-100 dark:border-gray-700">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Currently Working</p>
                                <div className="flex items-center space-x-2">
                                  <span className={`w-3 h-3 rounded-full ${form.student_details.currently_working ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                  <span className={`font-bold ${form.student_details.currently_working ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                                    {form.student_details.currently_working ? 'Yes' : 'No'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Additional Student Info */}
                        {(form.student_details.email && form.student_details.email !== form.contact_info?.email) && (
                          <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-blue-100 dark:border-gray-700">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Student Email</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              {form.student_details.email}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Message & Consent Information */}
                {(form.message || form.consent) && (
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-green-100 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-6 text-lg flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
                      Message & Consent
                    </h4>
                    
                    {form.message && (
                      <div className="mb-6">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Message</p>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-green-100 dark:border-gray-600">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{form.message}</p>
                        </div>
                      </div>
                    )}
                    
                    {form.consent && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Consent Status</p>
                        {form.consent.terms_and_privacy !== undefined && (
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Terms & Privacy</span>
                            <span className={`text-sm font-semibold ${form.consent.terms_and_privacy ? 'text-green-600' : 'text-red-600'}`}>
                              {form.consent.terms_and_privacy ? '✓ Accepted' : '✗ Declined'}
                            </span>
                          </div>
                        )}
                        {form.consent.marketing_consent !== undefined && (
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Marketing</span>
                            <span className={`text-sm font-semibold ${form.consent.marketing_consent ? 'text-green-600' : 'text-red-600'}`}>
                              {form.consent.marketing_consent ? '✓ Accepted' : '✗ Declined'}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Technical & System Information */}
                {(form.browser_info || form.user_agent || form.ip_address) && (
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-orange-100 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-6 text-lg flex items-center">
                      <Settings className="w-5 h-5 mr-2 text-orange-600" />
                      Technical Info
                    </h4>
                    <div className="space-y-4">
                      {form.application_id && (
                        <div className="flex justify-between items-center py-3 border-b border-orange-100 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">Application ID</span>
                          <span className="text-gray-900 dark:text-white font-mono text-sm font-semibold">
                            {form.application_id}
                          </span>
                        </div>
                      )}
                      
                      {form.browser_info?.os && (
                        <div className="flex justify-between items-center py-3 border-b border-orange-100 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">Operating System</span>
                          <span className="text-gray-900 dark:text-white font-semibold">
                            {form.browser_info.os}
                          </span>
                        </div>
                      )}
                      
                      {form.ip_address && (
                        <div className="flex justify-between items-center py-3 border-b border-orange-100 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">IP Address</span>
                          <span className="text-gray-900 dark:text-white font-mono text-sm font-semibold">
                            {form.ip_address.replace('::ffff:', '')}
                          </span>
                        </div>
                      )}
                      
                      {form.captcha_validated !== undefined && (
                        <div className="flex justify-between items-center py-3">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">CAPTCHA</span>
                          <span className={`font-semibold ${form.captcha_validated ? 'text-green-600' : 'text-orange-600'}`}>
                            {form.captcha_validated ? '✓ Verified' : 'Pending'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>

          {/* Premium Footer */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 p-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleQuickAction(form.id, 'call')}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
                >
                  <PhoneCall className="w-5 h-5" />
                  Call Now
                </button>
                <button
                  onClick={() => handleQuickAction(form.id, 'email')}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
                >
                  <Send className="w-5 h-5" />
                  Send Email
                </button>
                <button
                  onClick={() => handleQuickAction(form.id, 'confirm')}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
                >
                  <CheckCircle className="w-5 h-5" />
                  Confirm
                </button>
              </div>
              <button
                onClick={onClose}
                className="px-8 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl font-semibold transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  // Show loading state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Authenticating</h2>
          <p className="text-gray-600 dark:text-gray-400">Please wait while we verify your access...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Unable to Load Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {error}
          </p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const StatCard = ({ icon, title, value, trend, color, subtitle }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-800 p-6 transition-all duration-300 hover:scale-105"
    >
      <div className="flex items-center justify-between mb-6">
        <div className={`p-3 ${color} rounded-2xl shadow-lg`}>
          {icon}
        </div>
        {trend && (
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${trend.startsWith('+') ? 'text-green-700 bg-green-50 dark:bg-green-900/30 dark:text-green-300' : 'text-red-700 bg-red-50 dark:bg-red-900/30 dark:text-red-300'}`}>
            {trend.startsWith('+') ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />}
            {trend}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">{title}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 font-medium">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );

  const FormCard = ({ form }: { form: any }) => {
    const category = formCategories.find(cat => cat.id === form.type) || formCategories[0];
    const status = statusConfig[form.status as keyof typeof statusConfig] || statusConfig.pending;
    const priority = priorityConfig[form.priority as keyof typeof priorityConfig] || priorityConfig.medium;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-800 p-8 transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden"
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-gray-800/50 dark:to-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-4">
              <div className={`p-3 ${category.color} rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <category.icon className={`w-6 h-6 ${category.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 dark:text-white text-xl leading-tight mb-1">
                  {form.name || form.contact_name || form.company}
                </h4>
                <p className="text-sm text-gray-500 font-semibold">{category.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${priority.color}`}>
                <span className="w-2 h-2 rounded-full bg-current"></span>
                {priority.label}
              </span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
              <span className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                {form.email}
              </span>
            </div>
            {form.phone && (
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <span className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                  {form.phone}
                </span>
              </div>
            )}
            {form.course && (
              <div className="flex items-start space-x-3">
                <BookOpen className="w-5 h-5 text-gray-400 mt-0.5" />
                <span className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                  {form.course}
                </span>
              </div>
            )}
            {form.city && (
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <span className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                  {form.city}{form.country && `, ${form.country.toUpperCase()}`}
                </span>
              </div>
            )}
            {(form.preferred_date || form.preferred_time) && (
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <span className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                  {form.preferred_date && new Date(form.preferred_date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                  {form.preferred_date && form.preferred_time && ' • '}
                  {form.preferred_time}
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${status.color}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                {status.label}
              </span>
              <span className="text-xs text-gray-500 font-semibold">
                {formatDate(form.submitted_at)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleQuickAction(form.id, 'call')}
                className="p-2.5 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl transition-all duration-200 hover:scale-110"
                title="Call"
              >
                <PhoneCall className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleQuickAction(form.id, 'email')}
                className="p-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl transition-all duration-200 hover:scale-110"
                title="Email"
              >
                <Send className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleQuickAction(form.id, 'view')}
                className="p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl transition-all duration-200 hover:scale-110"
                title="View Details"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Enhanced Table View Component
  const FormTable = ({ forms }: { forms: any[] }) => {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedForms(forms.map(f => f.id));
                      } else {
                        setSelectedForms([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center space-x-2 hover:text-blue-600"
                  >
                    <span>Contact</span>
                    {sortField === 'name' && (
                      sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Category</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Course</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                  <button
                    onClick={() => handleSort('submitted_at')}
                    className="flex items-center space-x-2 hover:text-blue-600"
                  >
                    <span>Submitted</span>
                    {sortField === 'submitted_at' && (
                      sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Priority</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {forms.map((form, index) => {
                const category = formCategories.find(cat => cat.id === form.type) || formCategories[0];
                const status = statusConfig[form.status as keyof typeof statusConfig] || statusConfig.pending;
                const priority = priorityConfig[form.priority as keyof typeof priorityConfig] || priorityConfig.medium;

                return (
                  <motion.tr
                    key={form.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-gray-800/50 dark:hover:to-gray-700/50 transition-all duration-300"
                  >
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox"
                        checked={selectedForms.includes(form.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedForms([...selectedForms, form.id]);
                          } else {
                            setSelectedForms(selectedForms.filter(id => id !== form.id));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 ${category.color} rounded-xl`}>
                          <category.icon className={`w-4 h-4 ${category.iconColor}`} />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {form.name || form.contact_name || form.company}
                          </div>
                          <div className="text-sm text-gray-500">{form.email}</div>
                          {form.phone && (
                            <div className="text-sm text-gray-500">{form.phone}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {form.course || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {formatDate(form.submitted_at)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${status.color}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${priority.color}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {priority.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuickAction(form.id, 'call')}
                          className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl transition-all duration-200"
                          title="Call"
                        >
                          <PhoneCall className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleQuickAction(form.id, 'email')}
                          className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl transition-all duration-200"
                          title="Email"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleQuickAction(form.id, 'view')}
                          className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl transition-all duration-200"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Pagination Component
  const PaginationControls = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 rounded-b-3xl">
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">
            Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
            {pagination.totalItems} results
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Page Size Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700 dark:text-gray-300 font-semibold">Show:</span>
            <select
              value={pagination.itemsPerPage}
              onChange={(e) => changePageSize(Number(e.target.value))}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* Pagination Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPrevPage}
              disabled={!pagination.hasPrevPage}
              className="px-4 py-2 text-sm font-semibold text-gray-500 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 transition-all duration-200"
            >
              Previous
            </button>

            {startPage > 1 && (
              <>
                <button
                  onClick={() => goToPage(1)}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  1
                </button>
                {startPage > 2 && <span className="px-2 text-gray-500 font-bold">...</span>}
              </>
            )}

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  page === pagination.currentPage
                    ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 border border-blue-600 shadow-lg'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {page}
              </button>
            ))}

            {endPage < pagination.totalPages && (
              <>
                {endPage < pagination.totalPages - 1 && <span className="px-2 text-gray-500 font-bold">...</span>}
                <button
                  onClick={() => goToPage(pagination.totalPages)}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  {pagination.totalPages}
                </button>
              </>
            )}

            <button
              onClick={goToNextPage}
              disabled={!pagination.hasNextPage}
              className="px-4 py-2 text-sm font-semibold text-gray-500 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 transition-all duration-200"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-gray-900 dark:to-slate-950">
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        
        {/* Premium Header */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-pink-50/50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      Sales Dashboard
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                      Manage all form submissions and lead inquiries in one centralized location
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-50 hover:scale-105"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  Refresh Data
                </button>
                <div className="relative">
                  <button 
                    className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
                    onClick={() => handleExport('csv')}
                  >
                    <Download className="w-5 h-5" />
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <StatCard
            icon={<FileText className="w-7 h-7 text-blue-600" />}
            title="Total Forms"
            value={stats.total.toString()}
            trend="+12%"
            color="bg-blue-50 dark:bg-blue-900/20"
            subtitle="This month"
          />
          <StatCard
            icon={<Clock className="w-7 h-7 text-yellow-600" />}
            title="Pending Review"
            value={stats.pending.toString()}
            color="bg-yellow-50 dark:bg-yellow-900/20"
            subtitle="Needs attention"
          />
          <StatCard
            icon={<CheckCircle className="w-7 h-7 text-green-600" />}
            title="Confirmed"
            value={stats.confirmed.toString()}
            trend="+8%"
            color="bg-green-50 dark:bg-green-900/20"
            subtitle="This week"
          />
          <StatCard
            icon={<AlertCircle className="w-7 h-7 text-red-600" />}
            title="Urgent"
            value={stats.urgent.toString()}
            color="bg-red-50 dark:bg-red-900/20"
            subtitle="High priority"
          />
          <StatCard
            icon={<TrendingUp className="w-7 h-7 text-purple-600" />}
            title="Today"
            value={stats.todayForms.toString()}
            color="bg-purple-50 dark:bg-purple-900/20"
            subtitle="New submissions"
          />
        </div>

        {/* Enhanced Form Categories */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-10">
          <div className="flex items-center space-x-3 mb-8">
            <Target className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Form Categories</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            <button
              onClick={() => handleFilterChange('category', 'all')}
              className={`p-6 rounded-2xl border-2 transition-all text-center group hover:scale-105 ${
                filters.category === "all"
                  ? "border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 shadow-lg"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:shadow-md"
              }`}
            >
              <Target className={`w-8 h-8 mx-auto mb-3 ${filters.category === "all" ? "text-blue-600" : "text-gray-600 group-hover:text-blue-600"} transition-colors`} />
              <div className="font-bold text-sm mb-1">All Forms</div>
              <div className="text-xs text-gray-500 font-semibold">{allForms.length} total</div>
            </button>
            
            {formCategories.map((category) => {
              const count = allForms.filter(form => form.type === category.id).length;
              return (
                <button
                  key={category.id}
                  onClick={() => handleFilterChange('category', category.id)}
                  className={`p-6 rounded-2xl border-2 transition-all text-center group hover:scale-105 ${
                    filters.category === category.id
                      ? `${category.color} border-current shadow-lg`
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  <category.icon className={`w-8 h-8 mx-auto mb-3 ${filters.category === category.id ? category.iconColor : "text-gray-600 group-hover:" + category.iconColor} transition-colors`} />
                  <div className="font-bold text-sm mb-1">{category.name}</div>
                  <div className="text-xs text-gray-500 font-semibold">{count} forms</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            
            {/* Search */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search by name, email, phone, or course..."
                value={filters.search || ''}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 font-medium"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-3 px-6 py-4 border border-gray-300 dark:border-gray-600 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 font-semibold"
              >
                <Filter className="w-5 h-5" />
                Advanced Filters
                <ChevronDown className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-2xl p-2">
                <button
                  onClick={() => setViewMode("card")}
                  className={`p-3 rounded-xl transition-all duration-300 ${viewMode === "card" ? "bg-white dark:bg-gray-700 shadow-md text-blue-600" : "text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-3 rounded-xl transition-all duration-300 ${viewMode === "table" ? "bg-white dark:bg-gray-700 shadow-md text-blue-600" : "text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
                    >
                      <option value="all">All Status</option>
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <option key={key} value={key}>{config.icon} {config.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Priority</label>
                    <select
                      value={filters.priority}
                      onChange={(e) => handleFilterChange('priority', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
                    >
                      <option value="all">All Priority</option>
                      {Object.entries(priorityConfig).map(([key, config]) => (
                        <option key={key} value={key}>{config.icon} {config.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Date Range</label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="quarter">This Quarter</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setFilters({
                          category: 'all',
                          status: 'all',
                          priority: 'all',
                          dateRange: 'all',
                          search: ''
                        });
                      }}
                      className="w-full px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-300 font-semibold"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-0">
            Showing <span className="font-bold text-gray-900 dark:text-white">{((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}</span> to <span className="font-bold text-gray-900 dark:text-white">{Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}</span> of <span className="font-bold text-gray-900 dark:text-white">{pagination.totalItems}</span> forms
            <span className="ml-2 text-xs text-gray-500 font-semibold">(Page {pagination.currentPage} of {pagination.totalPages})</span>
            {filters.category !== "all" && (
              <span className="ml-3 inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold">
                {formCategories.find(cat => cat.id === filters.category)?.name}
                <button onClick={() => handleFilterChange('category', 'all')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          {selectedForms.length > 0 && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                {selectedForms.length} selected
              </span>
              <button
                onClick={() => handleBulkAction('confirm')}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm rounded-xl font-semibold transition-all duration-300"
              >
                Confirm All
              </button>
              <button
                onClick={() => handleBulkAction('email')}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm rounded-xl font-semibold transition-all duration-300"
              >
                Send Email
              </button>
              <button
                onClick={() => setSelectedForms([])}
                className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white text-sm rounded-xl font-semibold transition-all duration-300"
              >
                Clear Selection
              </button>
            </div>
          )}
        </div>

        {/* Forms Display */}
        {loading ? (
          <div className={viewMode === "card" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : ""}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-3xl p-8 animate-pulse border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                  <div className="space-y-2 flex-1">
                    <div className="w-3/4 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="w-5/6 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="w-2/3 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {viewMode === "card" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                  {filteredForms.map((form, index) => (
                    <motion.div
                      key={form.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <FormCard form={form} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <FormTable forms={filteredForms} />
            )}
          </div>
        )}

        {filteredForms.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No forms found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
              Try adjusting your search criteria or filters to find what you're looking for
            </p>
          </div>
        )}
      </div>

      {/* Enhanced Pagination Controls */}
      {pagination.totalPages > 1 && !loading && (
        <PaginationControls />
      )}

      {/* Form Details Modal */}
      <AnimatePresence>
        {showFormModal && (
          <FormDetailsModal
            form={selectedForm}
            isOpen={showFormModal}
            onClose={() => {
              setShowFormModal(false);
              setSelectedForm(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SalesDashboard;