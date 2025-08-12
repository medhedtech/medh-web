"use client";

import React, { useEffect, useState } from "react";
import StudentDashboardLayout from "@/components/sections/dashboards/StudentDashboardLayout";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Video, 
  Download, 
  Eye, 
  User, 
  FileText,
  Award,
  MessageSquare,
  CheckCircle,
  XCircle,
  RefreshCw,
  Play,
  Pause,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Star,
  Users,
  BookOpen,
  FileText as FileTextIcon,
  Headphones,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Info,
  AlertCircle,
  CalendarDays,
  Timer,
  Target,
  GraduationCap,
  Shield,
  Zap,
  Globe,
  Monitor,
  Smartphone,
  Database,
  Palette,
  Cloud,
  Lock,
  Settings,
  BarChart3,
  TrendingUp,
  Activity
} from "lucide-react";

interface DemoClass {
  _id: string;
  title: string;
  date: string;
  time: string;
  topic: string;
  synopsis: string;
  instructor: {
    name: string;
    avatar: string;
    expertise: string;
    email: string;
    phone: string;
    bio: string;
  };
  status: 'scheduled' | 'attended' | 'cancelled' | 'rescheduled';
  recording_url?: string;
  certificate_url?: string;
  feedback?: {
    from_instructor: string;
    rating: number;
    comments: string;
    date: string;
    strengths: string[];
    areas_for_improvement: string[];
    overall_assessment: string;
  };
  zoom_link?: string;
  duration: string;
  category: string;
  max_participants: number;
  current_participants: number;
  prerequisites: string[];
  materials_required: string[];
  agenda: {
    time: string;
    activity: string;
    description: string;
  }[];
  technical_requirements: string[];
  cancellation_policy: string;
  reschedule_policy: string;
  attendance_notes?: string;
  completion_criteria: string[];
  certificate_requirements: string[];
  follow_up_resources: string[];
  student_notes?: string;
  instructor_notes?: string;
  class_recording_notes?: string;
  certificate_issued_date?: string;
  certificate_valid_until?: string;
  certificate_verification_code?: string;
}

interface DemoStats {
  total: number;
  scheduled: number;
  attended: number;
  cancelled: number;
  rescheduled: number;
  certificates: number;
  recordings: number;
  feedback: number;
}

const DemoClassesPageClient = () => {
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
  });
  const [demoClasses, setDemoClasses] = useState<DemoClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'scheduled' | 'attended' | 'cancelled' | 'rescheduled'>('all');
  const [stats, setStats] = useState<DemoStats>({
    total: 0,
    scheduled: 0,
    attended: 0,
    cancelled: 0,
    rescheduled: 0,
    certificates: 0,
    recordings: 0,
    feedback: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});
  const [instructorStats, setInstructorStats] = useState<Record<string, number>>({});

  useEffect(() => {
    setUserData({
      fullName: localStorage.getItem("fullName") || "Student",
      email: localStorage.getItem("email") || "",
    });
    fetchDemoClasses();
  }, []);

  const fetchDemoClasses = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (activeTab !== 'all') params.append('status', activeTab);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedInstructor) params.append('instructor', selectedInstructor);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/v1/demo-classes?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setDemoClasses(data.data.demoClasses);
        setStats(data.data.stats);
        setCategoryStats(data.data.categoryStats);
        setInstructorStats(data.data.instructorStats);
      } else {
        setError(data.message || 'Failed to fetch demo classes');
      }
    } catch (error) {
      console.error('Error fetching demo classes:', error);
      setError('Failed to load demo classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemoClasses();
  }, [activeTab, selectedCategory, selectedInstructor, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'attended':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Calendar className="w-4 h-4" />;
      case 'attended':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'rescheduled':
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'web development':
        return <Globe className="w-4 h-4" />;
      case 'mobile development':
        return <Smartphone className="w-4 h-4" />;
      case 'data science':
        return <Database className="w-4 h-4" />;
      case 'digital marketing':
        return <TrendingUp className="w-4 h-4" />;
      case 'ui/ux design':
        return <Palette className="w-4 h-4" />;
      case 'cloud computing':
        return <Cloud className="w-4 h-4" />;
      case 'cybersecurity':
        return <Lock className="w-4 h-4" />;
      case 'devops':
        return <Settings className="w-4 h-4" />;
      case 'artificial intelligence':
        return <Zap className="w-4 h-4" />;
      case 'blockchain':
        return <Shield className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const handleAction = async (action: string, demoClass: DemoClass) => {
    try {
      switch (action) {
        case 'view_details':
          setExpandedClass(expandedClass === demoClass._id ? null : demoClass._id);
          break;
        case 'attend':
          if (demoClass.zoom_link) {
            window.open(demoClass.zoom_link, '_blank');
          }
          break;
        case 'cancel':
          const cancelResponse = await fetch('/api/v1/demo-classes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'cancel', demoClassId: demoClass._id })
          });
          if (cancelResponse.ok) {
            fetchDemoClasses(); // Refresh data
          }
          break;
        case 'reschedule':
          // Open reschedule modal or navigate to reschedule page
          console.log('Reschedule demo class:', demoClass.title);
          break;
        case 'view_recording':
          if (demoClass.recording_url) {
            window.open(demoClass.recording_url, '_blank');
          }
          break;
        case 'download_certificate':
          if (demoClass.certificate_url) {
            window.open(demoClass.certificate_url, '_blank');
          }
          break;
        case 'view_feedback':
          // Show feedback modal or expand feedback section
          console.log('View feedback for:', demoClass.title);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error performing action:', error);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <StudentDashboardLayout
        userRole="student"
        fullName={userData.fullName}
        userEmail={userData.email}
        userImage=""
        userNotifications={0}
        userSettings={{
          theme: "light",
          language: "en",
          notifications: true
        }}
      >
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </StudentDashboardLayout>
    );
  }

  return (
    <StudentDashboardLayout
      userRole="student"
      fullName={userData.fullName}
      userEmail={userData.email}
      userImage=""
      userNotifications={0}
      userSettings={{
        theme: "light",
        language: "en",
        notifications: true
      }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Demo Classes
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Manage your demo class schedule, view recordings, download certificates, and read instructor feedback.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Demo Classes</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Attended</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.attended}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Scheduled</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.scheduled}</p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Certificates</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.certificates}</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search demo classes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">All Categories</option>
                      {Object.keys(categoryStats).map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Instructor
                    </label>
                    <select
                      value={selectedInstructor}
                      onChange={(e) => setSelectedInstructor(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">All Instructors</option>
                      {Object.keys(instructorStats).map(instructor => (
                        <option key={instructor} value={instructor}>{instructor}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {[
              { id: 'all', label: 'All Classes', icon: <Calendar className="w-4 h-4" /> },
              { id: 'scheduled', label: 'Scheduled', icon: <Clock className="w-4 h-4" /> },
              { id: 'attended', label: 'Attended', icon: <CheckCircle className="w-4 h-4" /> },
              { id: 'cancelled', label: 'Cancelled', icon: <XCircle className="w-4 h-4" /> },
              { id: 'rescheduled', label: 'Rescheduled', icon: <RefreshCw className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Demo Classes Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Demo Class Details
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Information
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {demoClasses.map((demoClass, index) => (
                  <React.Fragment key={demoClass._id}>
                    <motion.tr
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                              {getCategoryIcon(demoClass.category)}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {demoClass.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(demoClass.date).toLocaleDateString()} at {demoClass.time}
                            </div>
                            <div className="flex items-center mt-1">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(demoClass.status)}`}>
                                {getStatusIcon(demoClass.status)}
                                {demoClass.status.charAt(0).toUpperCase() + demoClass.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium text-gray-900 dark:text-white">Topic:</span>
                            <span className="text-gray-600 dark:text-gray-400 ml-2">{demoClass.topic}</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-gray-900 dark:text-white">Instructor:</span>
                            <span className="text-gray-600 dark:text-gray-400 ml-2">{demoClass.instructor.name}</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-gray-900 dark:text-white">Duration:</span>
                            <span className="text-gray-600 dark:text-gray-400 ml-2">{demoClass.duration}</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-gray-900 dark:text-white">Participants:</span>
                            <span className="text-gray-600 dark:text-gray-400 ml-2">
                              {demoClass.current_participants}/{demoClass.max_participants}
                            </span>
                          </div>
                          {demoClass.status === 'attended' && demoClass.feedback && (
                            <div className="text-sm">
                              <span className="font-medium text-gray-900 dark:text-white">Rating:</span>
                              <span className="text-gray-600 dark:text-gray-400 ml-2">
                                <div className="flex items-center gap-1">
                                  {renderStars(demoClass.feedback.rating)}
                                  <span className="ml-1">({demoClass.feedback.rating}/5)</span>
                                </div>
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {/* View Details Button */}
                          <button
                            onClick={() => handleAction('view_details', demoClass)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                          >
                            <Eye className="w-3 h-3" />
                            View Details
                          </button>

                          {/* Status-specific actions */}
                          {demoClass.status === 'scheduled' && (
                            <>
                              <button
                                onClick={() => handleAction('attend', demoClass)}
                                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                              >
                                <Play className="w-3 h-3" />
                                Attend
                              </button>
                              <button
                                onClick={() => handleAction('cancel', demoClass)}
                                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                              >
                                <XCircle className="w-3 h-3" />
                                Cancel
                              </button>
                              <button
                                onClick={() => handleAction('reschedule', demoClass)}
                                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300"
                              >
                                <RefreshCw className="w-3 h-3" />
                                Reschedule
                              </button>
                            </>
                          )}

                          {demoClass.status === 'attended' && (
                            <>
                              {demoClass.recording_url && (
                                <button
                                  onClick={() => handleAction('view_recording', demoClass)}
                                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                                >
                                  <Video className="w-3 h-3" />
                                  Recording
                                </button>
                              )}
                              {demoClass.certificate_url && (
                                <button
                                  onClick={() => handleAction('download_certificate', demoClass)}
                                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                                >
                                  <Download className="w-3 h-3" />
                                  Certificate
                                </button>
                              )}
                              {demoClass.feedback && (
                                <button
                                  onClick={() => handleAction('view_feedback', demoClass)}
                                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  Feedback
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>

                    {/* Expanded Details */}
                    {expandedClass === demoClass._id && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50 dark:bg-gray-700/50"
                      >
                        <td colSpan={3} className="px-6 py-4">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Class Information</h4>
                                <div className="space-y-2 text-sm">
                                  <div><span className="font-medium">Synopsis:</span> {demoClass.synopsis}</div>
                                  <div><span className="font-medium">Category:</span> {demoClass.category}</div>
                                  <div><span className="font-medium">Duration:</span> {demoClass.duration}</div>
                                  <div><span className="font-medium">Max Participants:</span> {demoClass.max_participants}</div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Instructor Details</h4>
                                <div className="flex items-center space-x-3 mb-3">
                                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-gray-500" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900 dark:text-white">{demoClass.instructor.name}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">{demoClass.instructor.expertise}</div>
                                  </div>
                                </div>
                                <div className="space-y-1 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    {demoClass.instructor.email}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    {demoClass.instructor.phone}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{demoClass.instructor.bio}</p>
                              </div>

                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Agenda</h4>
                                <div className="space-y-2">
                                  {demoClass.agenda.map((item, idx) => (
                                    <div key={idx} className="flex items-start space-x-3 text-sm">
                                      <div className="font-medium text-gray-500 dark:text-gray-400 min-w-[80px]">{item.time}</div>
                                      <div>
                                        <div className="font-medium text-gray-900 dark:text-white">{item.activity}</div>
                                        <div className="text-gray-600 dark:text-gray-400">{item.description}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Requirements</h4>
                                <div className="space-y-3">
                                  <div>
                                    <div className="font-medium text-sm text-gray-900 dark:text-white mb-1">Prerequisites:</div>
                                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                      {demoClass.prerequisites.map((prereq, idx) => (
                                        <li key={idx} className="flex items-center gap-2">
                                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                          {prereq}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <div className="font-medium text-sm text-gray-900 dark:text-white mb-1">Materials Required:</div>
                                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                      {demoClass.materials_required.map((material, idx) => (
                                        <li key={idx} className="flex items-center gap-2">
                                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                          {material}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <div className="font-medium text-sm text-gray-900 dark:text-white mb-1">Technical Requirements:</div>
                                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                      {demoClass.technical_requirements.map((req, idx) => (
                                        <li key={idx} className="flex items-center gap-2">
                                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                          {req}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>

                              {demoClass.status === 'attended' && demoClass.feedback && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Instructor Feedback</h4>
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium text-gray-900 dark:text-white">Rating:</span>
                                      <div className="flex items-center gap-1">
                                        {renderStars(demoClass.feedback.rating)}
                                        <span className="text-sm text-gray-600 dark:text-gray-400">({demoClass.feedback.rating}/5)</span>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Comments:</div>
                                      <p className="text-sm text-gray-600 dark:text-gray-400">{demoClass.feedback.comments}</p>
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Strengths:</div>
                                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                        {demoClass.feedback.strengths.map((strength, idx) => (
                                          <li key={idx} className="flex items-center gap-2">
                                            <CheckCircle className="w-3 h-3 text-green-500" />
                                            {strength}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Areas for Improvement:</div>
                                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                        {demoClass.feedback.areas_for_improvement.map((area, idx) => (
                                          <li key={idx} className="flex items-center gap-2">
                                            <Target className="w-3 h-3 text-blue-500" />
                                            {area}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Overall Assessment:</div>
                                      <p className="text-sm text-gray-600 dark:text-gray-400">{demoClass.feedback.overall_assessment}</p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {demoClass.status === 'attended' && demoClass.certificate_url && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Certificate Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <div><span className="font-medium">Issued Date:</span> {demoClass.certificate_issued_date}</div>
                                    <div><span className="font-medium">Valid Until:</span> {demoClass.certificate_valid_until}</div>
                                    <div><span className="font-medium">Verification Code:</span> {demoClass.certificate_verification_code}</div>
                                  </div>
                                </div>
                              )}

                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Policies</h4>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <div className="font-medium text-gray-900 dark:text-white">Cancellation Policy:</div>
                                    <p className="text-gray-600 dark:text-gray-400">{demoClass.cancellation_policy}</p>
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900 dark:text-white">Reschedule Policy:</div>
                                    <p className="text-gray-600 dark:text-gray-400">{demoClass.reschedule_policy}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {demoClasses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Calendar className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Demo Classes Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {activeTab === 'all' 
                  ? "You don't have any demo classes scheduled yet."
                  : `You don't have any ${activeTab} demo classes.`
                }
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </StudentDashboardLayout>
  );
};

export default DemoClassesPageClient;
