"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Search, 
  Filter,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Eye,
  Edit3,
  Trash2,
  Download,
  Upload,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  CreditCard,
  BarChart3,
  MessageCircle,
  FileText,
  TrendingUp,
  Award,
  Star,
  Activity,
  DollarSign,
  CalendarDays,
  GraduationCap,
  PlayCircle,
  Video,
  RefreshCw,
  X
} from 'lucide-react';
import { showToast } from '@/utils/toastManager';
import { motion, AnimatePresence } from 'framer-motion';
import BatchAssignmentModal from '@/components/shared/modals/BatchAssignmentModal';
import { 
  enrollmentAPI,
  batchAPI,
  type IEnrollmentWithDetails,
  type TEnrollmentStatus,
  type IBatchWithDetails
} from '@/apis/instructor-assignments';

// Enhanced Student interface based on API response structure
interface IEnhancedStudent {
  _id: string;
  full_name: string;
  email: string;
  phone_numbers?: Array<{
    country: string;
    number: string;
  }>;
  status: 'Active' | 'Inactive';
  enrollment_date: string;
  enrollment_status: 'active' | 'completed' | 'cancelled' | 'on_hold' | 'expired';
  progress: number;
  payment_plan: 'full' | 'installment';
  profile_image?: string;
}

// Enhanced batch interface with zoom and recorded lessons
interface IEnhancedBatch extends IBatchWithDetails {
  schedule?: Array<{
    // Date-based format (required)
    date: string; // Format: "2024-01-15"
    title?: string; // Optional session title
    description?: string; // Optional session description
    // Common fields
    start_time: string;
    end_time: string;
    _id: string;
    zoom_meeting?: {
      meeting_id: string;
      join_url: string;
      topic: string;
      password: string;
    };
    recorded_lessons?: Array<{
      title: string;
      url: string;
      recorded_date: string;
      created_by: string;
      _id: string;
    }>;
  }>;
}

interface BatchStudentEnrollmentProps {
  batch: IEnhancedBatch & {
    enrolled_students_details?: Array<{
      student: IEnhancedStudent;
      enrollment_date: string;
      enrollment_status: string;
      progress: number;
      payment_plan: string;
    }>;
  };
  onUpdate: () => void;
}

// Enhanced status configuration
const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  active: {
    color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    icon: <CheckCircle className="h-4 w-4" />,
    label: 'Active'
  },
  completed: {
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    icon: <GraduationCap className="h-4 w-4" />,
    label: 'Completed'
  },
  cancelled: {
    color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    icon: <XCircle className="h-4 w-4" />,
    label: 'Cancelled'
  },
  on_hold: {
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    icon: <Clock className="h-4 w-4" />,
    label: 'On Hold'
  },
  expired: {
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    icon: <AlertCircle className="h-4 w-4" />,
    label: 'Expired'
  }
};

// Payment plan configuration
const paymentPlanConfig = {
  full: {
    color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
    icon: <DollarSign className="h-3 w-3" />,
    label: 'Full Payment'
  },
  installment: {
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    icon: <CreditCard className="h-3 w-3" />,
    label: 'Installment'
  }
};

const BatchStudentEnrollment: React.FC<BatchStudentEnrollmentProps> = ({
  batch,
  onUpdate
}) => {
  // State Management
  const [enrolledStudents, setEnrolledStudents] = useState<IEnhancedStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [paymentFilter, setPaymentFilter] = useState<string>('');
  const [progressFilter, setProgressFilter] = useState<string>('');
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<IEnhancedStudent | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [sortBy, setSortBy] = useState<'name' | 'enrollment_date' | 'progress'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Load students from API data or batch details
  useEffect(() => {
    loadStudents();
  }, [batch]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading students for batch:', batch._id);

      // Check if we already have enrolled_students_details in the batch prop
      if (batch.enrolled_students_details && batch.enrolled_students_details.length > 0) {
        console.log('✅ Using enrolled_students_details from batch prop:', batch.enrolled_students_details.length);
        
        // Transform the enrolled_students_details to our enhanced student format
        const transformedStudents: IEnhancedStudent[] = batch.enrolled_students_details
          .filter(enrollment => enrollment.student && enrollment.student._id) // Filter out null/undefined students
          .map(enrollment => ({
            _id: enrollment.student._id,
            full_name: enrollment.student.full_name || 'Unknown Student',
            email: enrollment.student.email || 'no-email@example.com',
            phone_numbers: enrollment.student.phone_numbers || [],
            status: enrollment.student.status || 'Unknown',
            enrollment_date: enrollment.enrollment_date,
            enrollment_status: enrollment.enrollment_status as any,
            progress: enrollment.progress || 0,
            payment_plan: enrollment.payment_plan as any,
            profile_image: enrollment.student.profile_image
          }));

        setEnrolledStudents(transformedStudents);
        setLastRefresh(new Date());
        console.log('✅ Students loaded from batch details:', transformedStudents.length);
        return;
      }

      // Fallback: Try to fetch from API
      try {
        if (batch._id) {
          console.log('🔄 Fetching batch details from API...');
          
          // Try to get batch details with enrolled students
          const batchResponse = await batchAPI.getBatchById(batch._id);
          
          if (batchResponse?.data) {
            let batchData;
            
            if ((batchResponse.data as any).success && (batchResponse.data as any).data) {
              batchData = (batchResponse.data as any).data;
            } else {
              batchData = batchResponse.data;
            }
            
            if (batchData.enrolled_students_details && batchData.enrolled_students_details.length > 0) {
              const transformedStudents: IEnhancedStudent[] = batchData.enrolled_students_details
                .filter((enrollment: any) => enrollment.student && enrollment.student._id) // Filter out null/undefined students
                .map((enrollment: any) => ({
                  _id: enrollment.student._id,
                  full_name: enrollment.student.full_name || 'Unknown Student',
                  email: enrollment.student.email || 'no-email@example.com',
                  phone_numbers: enrollment.student.phone_numbers || [],
                  status: enrollment.student.status || 'Unknown',
                  enrollment_date: enrollment.enrollment_date,
                  enrollment_status: enrollment.enrollment_status,
                  progress: enrollment.progress || 0,
                  payment_plan: enrollment.payment_plan,
                  profile_image: enrollment.student.profile_image
                }));

              setEnrolledStudents(transformedStudents);
              setLastRefresh(new Date());
              console.log('✅ Students loaded from API response:', transformedStudents.length);
              return;
            }
          }
        }
      } catch (apiError) {
        console.warn('API fetch failed, using fallback approach:', apiError);
      }

      // Final fallback: Create mock data based on batch capacity and enrolled count
      console.log('📊 Creating fallback student data for development');
      const mockStudents: IEnhancedStudent[] = [];
      
      for (let i = 0; i < (batch.enrolled_students || 0); i++) {
        // Use deterministic values instead of Math.random() to prevent hydration mismatches
        const studentIndex = i + 1;
        const phoneNumber = `+91${9000000000 + studentIndex}`;
        const enrollmentDate = new Date(Date.now() - (studentIndex * 24 * 60 * 60 * 1000)).toISOString();
        const enrollmentStatus = studentIndex % 5 === 0 ? 'completed' : 'active';
        const progress = Math.min(studentIndex * 10, 100);
        const paymentPlan = studentIndex % 3 === 0 ? 'installment' : 'full';
        
        mockStudents.push({
          _id: `mock_student_${studentIndex}`,
          full_name: `Student ${studentIndex}`,
          email: `student${studentIndex}@example.com`,
          phone_numbers: [{ country: 'IN', number: phoneNumber }],
          status: 'Active',
          enrollment_date: enrollmentDate,
          enrollment_status: enrollmentStatus,
          progress: progress,
          payment_plan: paymentPlan
        });
      }

      setEnrolledStudents(mockStudents);
      setLastRefresh(new Date());
      console.log('🎭 Using mock student data:', mockStudents.length);

    } catch (error) {
      console.error('❌ Error loading students:', error);
      setEnrolledStudents([]);
      setLastRefresh(new Date());
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort students
  const getFilteredAndSortedStudents = () => {
    let filtered = enrolledStudents.filter(student => {
      const matchesSearch = !searchQuery || 
        student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || student.enrollment_status === statusFilter;
      const matchesPayment = !paymentFilter || student.payment_plan === paymentFilter;
      const matchesProgress = !progressFilter || 
        (progressFilter === 'not_started' && student.progress === 0) ||
        (progressFilter === 'in_progress' && student.progress > 0 && student.progress < 100) ||
        (progressFilter === 'completed' && student.progress >= 100);
      
      return matchesSearch && matchesStatus && matchesPayment && matchesProgress;
    });

    // Sort students
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.full_name.localeCompare(b.full_name);
          break;
        case 'enrollment_date':
          comparison = new Date(a.enrollment_date).getTime() - new Date(b.enrollment_date).getTime();
          break;
        case 'progress':
          comparison = a.progress - b.progress;
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  };

  // Calculate statistics
  const getStudentStats = () => {
    const total = enrolledStudents.length;
    const active = enrolledStudents.filter(s => s.enrollment_status === 'active').length;
    const completed = enrolledStudents.filter(s => s.enrollment_status === 'completed').length;
    const avgProgress = total > 0 ? enrolledStudents.reduce((sum, s) => sum + s.progress, 0) / total : 0;
    const fullPayment = enrolledStudents.filter(s => s.payment_plan === 'full').length;
    
    return { total, active, completed, avgProgress, fullPayment };
  };

  const stats = getStudentStats();
  const filteredStudents = getFilteredAndSortedStudents();

  // Student card component
  const StudentCard: React.FC<{ student: IEnhancedStudent }> = ({ student }) => {
    const status = statusConfig[student.enrollment_status];
    const paymentPlan = paymentPlanConfig[student.payment_plan];
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -6, transition: { duration: 0.2 } }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 group"
      >
        {/* Gradient Header */}
        <div className="h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12"></div>
          {/* Progress indicator on header */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${student.progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="p-5 relative">
          {/* Student Avatar & Info */}
          <div className="flex items-start justify-between mb-5 -mt-8 relative">
            <div className="flex items-start space-x-4">
              <div className="relative z-10">
                {student.profile_image ? (
                  <img 
                    src={student.profile_image} 
                    alt={student.full_name}
                    className="h-14 w-14 rounded-2xl object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                  />
                ) : (
                  <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {student.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                )}
                {/* Enhanced Status Indicator */}
                <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-3 border-white dark:border-gray-800 shadow-lg ${
                  student.status === 'Active' 
                    ? 'bg-gradient-to-r from-green-400 to-green-500' 
                    : 'bg-gradient-to-r from-gray-300 to-gray-400'
                }`}>
                  <div className={`absolute inset-1 rounded-full ${
                    student.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                  }`}></div>
                </div>
              </div>
              
              <div className="min-w-0 flex-1 pt-2">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1 truncate">
                  {student.full_name}
                </h3>
                {student.phone_numbers && student.phone_numbers.length > 0 && (
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <Phone className="h-3 w-3 mr-1.5 flex-shrink-0" />
                    <span className="truncate">{student.phone_numbers[0].number}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Enhanced Status & Payment Badges */}
            <div className="flex flex-col items-end space-y-2 pt-2">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm ${status.color} border border-current/20`}>
                <span className="w-1.5 h-1.5 rounded-full mr-2 bg-current animate-pulse"></span>
                {status.label}
              </span>
              <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm ${paymentPlan.color} border border-current/20`}>
                {paymentPlan.icon}
                <span className="ml-1.5">{paymentPlan.label === 'Full Payment' ? 'Full' : 'Install'}</span>
              </span>
            </div>
          </div>

          {/* Enhanced Progress Section */}
          <div className="mb-5 p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700/50 dark:to-blue-900/20 rounded-xl border border-gray-100 dark:border-gray-600">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Course Progress
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {student.progress}%
                </span>
                {student.progress >= 100 && (
                  <Award className="h-4 w-4 text-yellow-500" />
                )}
              </div>
            </div>
            
            {/* Enhanced Progress Bar */}
            <div className="relative">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full relative overflow-hidden ${
                    student.progress >= 100 
                      ? 'bg-gradient-to-r from-green-400 to-green-500' 
                      : student.progress >= 80 
                        ? 'bg-gradient-to-r from-blue-400 to-blue-500'
                        : student.progress >= 50 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                          : 'bg-gradient-to-r from-red-400 to-pink-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${student.progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  {/* Animated shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-shimmer"></div>
                </motion.div>
              </div>
              
              {/* Progress milestones */}
              <div className="absolute -top-1 left-0 right-0 flex justify-between">
                {[25, 50, 75, 100].map((milestone) => (
                  <div 
                    key={milestone}
                    className={`w-1 h-5 rounded-full ${
                      student.progress >= milestone 
                        ? 'bg-gray-400 dark:bg-gray-300' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    } opacity-60`}
                    style={{ marginLeft: milestone === 25 ? '25%' : milestone === 50 ? '50%' : milestone === 75 ? '75%' : '100%' }}
                  />
                ))}
              </div>
            </div>
            
            {/* Progress Status Text */}
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 text-center">
              {student.progress === 0 && "Not started yet"}
              {student.progress > 0 && student.progress < 25 && "Just getting started"}
              {student.progress >= 25 && student.progress < 50 && "Making good progress"}
              {student.progress >= 50 && student.progress < 75 && "Halfway there!"}
              {student.progress >= 75 && student.progress < 100 && "Almost complete"}
              {student.progress >= 100 && "Course completed! 🎉"}
            </div>
          </div>

          {/* Enhanced Quick Access Section */}
          <div className="mb-5 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-purple-900 dark:text-purple-300 flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Quick Actions
              </h4>
              <div className="h-1 w-1 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {/* Enhanced Zoom Meeting Button */}
              {batch.schedule?.some(s => s.zoom_meeting) && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const nextSession = batch.schedule?.find(s => s.zoom_meeting);
                    if (nextSession?.zoom_meeting) {
                      window.open(nextSession.zoom_meeting.join_url, '_blank');
                    }
                  }}
                  className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2.5 rounded-lg font-semibold text-xs shadow-lg hover:shadow-xl transition-all duration-200 group"
                >
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                  <div className="relative flex items-center justify-center space-x-1">
                    <Video className="h-3.5 w-3.5" />
                    <span>Join Zoom</span>
                  </div>
                </motion.button>
              )}
              
              {/* Enhanced Recordings Button */}
              {batch.schedule?.some(s => s.recorded_lessons && s.recorded_lessons.length > 0) && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedStudent(student)}
                  className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-2.5 rounded-lg font-semibold text-xs shadow-lg hover:shadow-xl transition-all duration-200 group"
                >
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                  <div className="relative flex items-center justify-center space-x-1">
                    <PlayCircle className="h-3.5 w-3.5" />
                    <span>Recordings</span>
                  </div>
                </motion.button>
              )}
              
              {/* Enhanced WhatsApp Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const phoneNumber = student.phone_numbers?.[0]?.number;
                  if (phoneNumber) {
                    window.open(`https://wa.me/${phoneNumber.replace('+', '')}`, '_blank');
                  }
                }}
                className="relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2.5 rounded-lg font-semibold text-xs shadow-lg hover:shadow-xl transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!student.phone_numbers?.[0]}
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                <div className="relative flex items-center justify-center space-x-1">
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>WhatsApp</span>
                </div>
              </motion.button>

              {/* Enhanced Email Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open(`mailto:${student.email}`, '_blank')}
                className="relative overflow-hidden bg-gradient-to-r from-gray-500 to-gray-600 text-white px-3 py-2.5 rounded-lg font-semibold text-xs shadow-lg hover:shadow-xl transition-all duration-200 group"
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                <div className="relative flex items-center justify-center space-x-1">
                  <Mail className="h-3.5 w-3.5" />
                  <span>Email</span>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Enhanced Enrollment Details */}
          <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
            <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Calendar className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Enrolled</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {new Date(student.enrollment_date).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Clock className="h-3 w-3 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Duration</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {Math.floor((new Date().getTime() - new Date(student.enrollment_date).getTime()) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex space-x-2 flex-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedStudent(student)}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSendMessage(student._id, student.full_name)}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </motion.button>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleUnenrollStudent(student._id, student.full_name)}
              className="ml-3 p-2.5 text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200"
              title="Unenroll Student"
            >
              <UserMinus className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  };

  const handleSendMessage = async (studentId: string, studentName: string) => {
    try {
      // Placeholder for messaging functionality
      // This could integrate with a messaging system, WhatsApp API, or email
      showToast.info(`Opening message interface for ${studentName}`);
      
      // For now, we'll just show a placeholder
      // In a real implementation, this could:
      // 1. Open a modal with messaging options
      // 2. Redirect to a messaging page
      // 3. Open WhatsApp with pre-filled message
      // 4. Open email client
      
    } catch (error) {
      console.error('Error sending message:', error);
      showToast.error('Failed to open messaging interface');
    }
  };

  const handleUnenrollStudent = async (studentId: string, studentName: string) => {
    if (!confirm(`Are you sure you want to unenroll ${studentName} from this batch?`)) {
      return;
    }

    // Optimistic update
    const originalStudents = [...enrolledStudents];
    setEnrolledStudents(prev => prev.filter(s => s._id !== studentId));

    try {
      setLoading(true);
      
      const response = await batchAPI.removeStudent(batch._id!, studentId);
      
      if (response?.data?.success || (response as any)?.success) {
        showToast.success(`${studentName} has been unenrolled from the batch`);
        onUpdate();
        setLastRefresh(new Date());
      } else {
        throw new Error('Failed to remove student from batch');
      }
    } catch (error: any) {
      console.error('Error unenrolling student:', error);
      // Rollback optimistic update
      setEnrolledStudents(originalStudents);
      showToast.error('Failed to unenroll student');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading students...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-3 sm:space-y-0">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Student Management
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage enrollments for {batch.batch_name}
            </p>
            {lastRefresh && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            {/* Refresh button */}
            <button
              onClick={async () => {
                setRefreshing(true);
                await loadStudents();
                onUpdate();
                setRefreshing(false);
                setLastRefresh(new Date());
              }}
              disabled={refreshing}
              className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              title="Refresh student data"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              <span className="sm:hidden">{refreshing ? 'Sync...' : 'Sync'}</span>
            </button>

            <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'cards' 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
                title="Card View"
              >
                <BarChart3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'table' 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
                title="Table View"
              >
                <FileText className="h-4 w-4" />
              </button>
            </div>
            
            <button
              onClick={() => setShowEnrollModal(true)}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Enroll Students</span>
              <span className="sm:hidden">Enroll</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full transform -translate-x-6 translate-y-6"></div>
            
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-blue-100 uppercase tracking-wide">Total Students</p>
                <p className="text-2xl sm:text-3xl font-bold text-white mt-1">{stats.total}</p>
                <p className="text-xs text-blue-200 mt-1">All enrollments</p>
              </div>
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full transform -translate-x-6 translate-y-6"></div>
            
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-green-100 uppercase tracking-wide">Active Students</p>
                <p className="text-2xl sm:text-3xl font-bold text-white mt-1">{stats.active}</p>
                <p className="text-xs text-green-200 mt-1">Currently learning</p>
              </div>
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-700 rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all duration-300 group col-span-2 sm:col-span-1"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full transform -translate-x-6 translate-y-6"></div>
            
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-purple-100 uppercase tracking-wide">Completed</p>
                <p className="text-2xl sm:text-3xl font-bold text-white mt-1">{stats.completed}</p>
                <p className="text-xs text-purple-200 mt-1">Course finished</p>
              </div>
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all duration-300 group col-span-2 sm:col-span-1 lg:col-span-1"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full transform -translate-x-6 translate-y-6"></div>
            
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-orange-100 uppercase tracking-wide">Avg Progress</p>
                <p className="text-2xl sm:text-3xl font-bold text-white mt-1">{Math.round(stats.avgProgress)}%</p>
                <p className="text-xs text-orange-200 mt-1">
                  {stats.avgProgress >= 80 ? 'Excellent!' : stats.avgProgress >= 60 ? 'Good pace' : 'Needs support'}
                </p>
              </div>
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all duration-300 group col-span-2 sm:col-span-1 lg:col-span-1"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full transform -translate-x-6 translate-y-6"></div>
            
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-emerald-100 uppercase tracking-wide">Full Payment</p>
                <p className="text-2xl sm:text-3xl font-bold text-white mt-1">{stats.fullPayment}</p>
                <p className="text-xs text-emerald-200 mt-1">{stats.total > 0 ? Math.round((stats.fullPayment / stats.total) * 100) : 0}% of total</p>
              </div>
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Enhanced Zoom Meetings Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="relative overflow-hidden bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all duration-300 group col-span-2 sm:col-span-1 lg:col-span-1"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full transform -translate-x-6 translate-y-6"></div>
            
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-sky-100 uppercase tracking-wide">Live Sessions</p>
                <p className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  {batch.schedule?.filter(s => s.zoom_meeting).length || 0}
                </p>
                <p className="text-xs text-sky-200 mt-1">Zoom meetings</p>
              </div>
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Video className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
            
            {/* Quick Join Button */}
            {batch.schedule?.some(s => s.zoom_meeting) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const nextSession = batch.schedule?.find(s => s.zoom_meeting);
                  if (nextSession?.zoom_meeting) {
                    window.open(nextSession.zoom_meeting.join_url, '_blank');
                  }
                }}
                className="absolute bottom-2 right-2 p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all duration-200 opacity-0 group-hover:opacity-100"
                title="Quick Join"
              >
                <Video className="h-4 w-4" />
              </motion.button>
            )}
          </motion.div>

          {/* Enhanced Recorded Lessons Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="relative overflow-hidden bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all duration-300 group col-span-2 sm:col-span-2 lg:col-span-1"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full transform -translate-x-6 translate-y-6"></div>
            
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-violet-100 uppercase tracking-wide">Recordings</p>
                <p className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  {batch.schedule?.reduce((total, s) => total + (s.recorded_lessons?.length || 0), 0) || 0}
                </p>
                <p className="text-xs text-violet-200 mt-1">
                  {batch.schedule?.filter(s => s.recorded_lessons && s.recorded_lessons.length > 0).length || 0} sessions
                </p>
              </div>
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <PlayCircle className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
            
            {/* Quick Access Button */}
            {batch.schedule?.some(s => s.recorded_lessons && s.recorded_lessons.length > 0) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // Scroll to recordings section or open first recording
                  const firstRecording = batch.schedule?.find(s => s.recorded_lessons && s.recorded_lessons.length > 0)?.recorded_lessons?.[0];
                  if (firstRecording) {
                    window.open(firstRecording.url, '_blank');
                  }
                }}
                className="absolute bottom-2 right-2 p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all duration-200 opacity-0 group-hover:opacity-100"
                title="Quick Play"
              >
                <PlayCircle className="h-4 w-4" />
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="on_hold">On Hold</option>
            </select>
          </div>
          
          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
            >
              <option value="">All Payment</option>
              <option value="full">Full Payment</option>
              <option value="installment">Installment</option>
            </select>
          </div>
          
          <div>
            <select
              value={progressFilter}
              onChange={(e) => setProgressFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
            >
              <option value="">All Progress</option>
              <option value="not_started">Not Started (0%)</option>
              <option value="in_progress">In Progress (1-99%)</option>
              <option value="completed">Completed (100%)</option>
            </select>
          </div>
          
          <div>
            <select
              value={`${sortBy}_${sortOrder}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split('_');
                setSortBy(sort as any);
                setSortOrder(order as any);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
            >
              <option value="name_asc">Name A-Z</option>
              <option value="name_desc">Name Z-A</option>
              <option value="enrollment_date_desc">Newest First</option>
              <option value="enrollment_date_asc">Oldest First</option>
              <option value="progress_desc">Highest Progress</option>
              <option value="progress_asc">Lowest Progress</option>
            </select>
          </div>
        </div>
      </div>

      {/* Batch Resources Overview */}
      {(batch.schedule?.some(s => s.zoom_meeting) || batch.schedule?.some(s => s.recorded_lessons && s.recorded_lessons.length > 0)) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6"
        >
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Batch Resources & Schedule
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Access live sessions, recordings, and learning materials
                  </p>
                </div>
              </div>
              
              {/* Resource Summary Badges */}
              <div className="flex items-center space-x-3">
                {batch.schedule?.some(s => s.zoom_meeting) && (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800">
                    <Video className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                      {batch.schedule?.filter(s => s.zoom_meeting).length} Live Sessions
                    </span>
                  </div>
                )}
                
                {batch.schedule?.some(s => s.recorded_lessons && s.recorded_lessons.length > 0) && (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl border border-purple-200 dark:border-purple-800">
                    <PlayCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-semibold text-purple-900 dark:text-purple-300">
                      {batch.schedule?.reduce((total, s) => total + (s.recorded_lessons?.length || 0), 0)} Recordings
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Enhanced Zoom Meetings Section */}
              {batch.schedule?.some(s => s.zoom_meeting) && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                        <Video className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      Live Zoom Sessions
                      <span className="ml-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500 text-white">
                        {batch.schedule?.filter(s => s.zoom_meeting).length}
                      </span>
                    </h4>
                    
                    {/* Quick Join All Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        batch.schedule?.filter(s => s.zoom_meeting).forEach(session => {
                          if (session.zoom_meeting) {
                            window.open(session.zoom_meeting.join_url, '_blank');
                          }
                        });
                      }}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Join All Sessions
                    </motion.button>
                  </div>
                  
                  <div className="space-y-3">
                    {batch.schedule?.filter(s => s.zoom_meeting).map((session, index) => {
                      // Helper function to get display date/time info
                      const getScheduleDisplay = (session: any) => {
                        const displayDate = new Date(session.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        });
                        return {
                          dateText: displayDate,
                          isSpecificDate: true,
                          title: session.title,
                          description: session.description
                        };
                      };

                      const scheduleInfo = getScheduleDisplay(session);

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group relative overflow-hidden bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300"
                        >
                          {/* Decorative Elements */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-200 dark:bg-cyan-800 rounded-full opacity-20 transform -translate-x-12 translate-y-12"></div>
                          
                          <div className="relative p-5">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-500 rounded-lg shadow-lg">
                                  <Calendar className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <h5 className="font-bold text-blue-900 dark:text-blue-100 text-lg">
                                    {scheduleInfo.title || new Date(session.date).toLocaleDateString('en-US', { weekday: 'long' })} Sessions
                                  </h5>
                                  <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                                    <span className="font-medium">
                                      {scheduleInfo.isSpecificDate ? scheduleInfo.dateText : `Every ${scheduleInfo.dateText}`}
                                    </span>
                                    <span className="text-blue-500">•</span>
                                    <span className="font-medium">
                                      {session.start_time} - {session.end_time}
                                    </span>
                                  </div>
                                  {scheduleInfo.description && (
                                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1 max-w-md">
                                      {scheduleInfo.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.open(session.zoom_meeting!.join_url, '_blank')}
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105"
                              >
                                <Video className="h-5 w-5 mr-2" />
                                Join Now
                              </motion.button>
                            </div>
                            
                            {/* Meeting Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-3 border border-blue-200/50 dark:border-blue-700/50">
                                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Meeting ID</p>
                                <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mt-1">
                                  {session.zoom_meeting!.meeting_id}
                                </p>
                              </div>
                              
                              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-3 border border-blue-200/50 dark:border-blue-700/50">
                                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Password</p>
                                <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mt-1">
                                  {session.zoom_meeting!.password}
                                </p>
                              </div>
                              
                              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-3 border border-blue-200/50 dark:border-blue-700/50 sm:col-span-1">
                                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Topic</p>
                                <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mt-1 truncate" title={session.zoom_meeting!.topic}>
                                  {session.zoom_meeting!.topic}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Enhanced Recorded Lessons Section */}
              {batch.schedule?.some(s => s.recorded_lessons && s.recorded_lessons.length > 0) && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
                        <PlayCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      Recorded Lessons
                      <span className="ml-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500 text-white">
                        {batch.schedule?.reduce((total, s) => total + (s.recorded_lessons?.length || 0), 0)}
                      </span>
                    </h4>
                    
                    {/* Download All Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export List
                    </motion.button>
                  </div>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                    {batch.schedule?.map((session, sessionIndex) => 
                      session.recorded_lessons && session.recorded_lessons.length > 0 ? (
                        <div key={sessionIndex} className="space-y-3">
                          {/* Session Day Header */}
                          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                            <div className="p-2 bg-purple-500 rounded-lg">
                              <Calendar className="h-4 w-4 text-white" />
                            </div>
                            <h5 className="font-bold text-purple-900 dark:text-purple-300 text-lg">
                              {session.title || new Date(session.date).toLocaleDateString('en-US', { weekday: 'long' })} Sessions
                            </h5>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-purple-500 text-white">
                              {session.recorded_lessons.length}
                            </span>
                          </div>
                          
                          {/* Recorded Lessons List */}
                          <div className="space-y-2 pl-4">
                            {session.recorded_lessons.map((lesson, lessonIndex) => (
                              <motion.div
                                key={lessonIndex}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: lessonIndex * 0.1 }}
                                className="group relative overflow-hidden bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300"
                              >
                                {/* Decorative Elements */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 transform translate-x-12 -translate-y-12"></div>
                                
                                <div className="relative p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                                      <div className="p-2 bg-purple-500 rounded-lg flex-shrink-0">
                                        <PlayCircle className="h-4 w-4 text-white" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h6 className="font-bold text-purple-900 dark:text-purple-100 text-base mb-1 truncate">
                                          {lesson.title}
                                        </h6>
                                        <div className="flex items-center space-x-4 text-xs text-purple-700 dark:text-purple-300">
                                          <span className="flex items-center space-x-1">
                                            <Calendar className="h-3 w-3" />
                                            <span>Recorded: {new Date(lesson.recorded_date).toLocaleDateString()}</span>
                                          </span>
                                          <span className="flex items-center space-x-1">
                                            <Clock className="h-3 w-3" />
                                            <span>{new Date(lesson.recorded_date).toLocaleTimeString()}</span>
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2 flex-shrink-0">
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => window.open(lesson.url, '_blank')}
                                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200"
                                      >
                                        <PlayCircle className="h-4 w-4 mr-2" />
                                        Watch Now
                                      </motion.button>
                                      
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => window.open(lesson.url, '_blank')}
                                        className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                                        title="Download"
                                      >
                                        <Download className="h-4 w-4" />
                                      </motion.button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Students List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No students found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {enrolledStudents.length === 0 
                  ? 'No students are enrolled in this batch yet.'
                  : 'Try adjusting your search filters to find students.'
                }
              </p>
              <button
                onClick={() => setShowEnrollModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Enroll First Student
              </button>
            </div>
          ) : (
            <div className={`${viewMode === 'cards' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
              <AnimatePresence>
                {filteredStudents.map((student) => (
                  <StudentCard key={student._id} student={student} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Student Details & Resources
              </h2>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XCircle className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Student Info */}
              <div className="flex items-center space-x-4">
                {selectedStudent.profile_image ? (
                  <img 
                    src={selectedStudent.profile_image} 
                    alt={selectedStudent.full_name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xl">
                      {selectedStudent.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedStudent.full_name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedStudent.email}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[selectedStudent.enrollment_status].color}`}>
                      {statusConfig[selectedStudent.enrollment_status].icon}
                      <span className="ml-1">{statusConfig[selectedStudent.enrollment_status].label}</span>
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${paymentPlanConfig[selectedStudent.payment_plan].color}`}>
                      {paymentPlanConfig[selectedStudent.payment_plan].icon}
                      <span className="ml-1">{paymentPlanConfig[selectedStudent.payment_plan].label}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Student Info */}
                <div className="space-y-6">
                  {/* Progress Section */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Course Progress</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {selectedStudent.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${
                              selectedStudent.progress >= 100 ? 'bg-green-500' : 
                              selectedStudent.progress >= 50 ? 'bg-blue-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${selectedStudent.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{selectedStudent.email}</span>
                        <button
                          onClick={() => window.open(`mailto:${selectedStudent.email}`, '_blank')}
                          className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </div>
                      {selectedStudent.phone_numbers && selectedStudent.phone_numbers.map((phone, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-900 dark:text-white">{phone.number}</span>
                          <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {phone.country}
                          </span>
                          <button
                            onClick={() => window.open(`https://wa.me/${phone.number.replace('+', '')}`, '_blank')}
                            className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                            title="Send WhatsApp Message"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">
                          Enrolled: {new Date(selectedStudent.enrollment_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">
                          {Math.floor((new Date().getTime() - new Date(selectedStudent.enrollment_date).getTime()) / (1000 * 60 * 60 * 24))} days enrolled
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Batch Resources */}
                <div className="space-y-6">
                  {/* Zoom Meetings */}
                  {batch.schedule?.some(s => s.zoom_meeting) && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Zoom Meetings</h4>
                      <div className="space-y-3">
                        {batch.schedule?.filter(s => s.zoom_meeting).map((session, index) => (
                          <div key={index} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-blue-900 dark:text-blue-300">
                                {session.title || new Date(session.date).toLocaleDateString('en-US', { weekday: 'long' })} Sessions
                              </h5>
                              <button
                                onClick={() => window.open(session.zoom_meeting!.join_url, '_blank')}
                                className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <Video className="h-4 w-4 mr-1" />
                                Join
                              </button>
                            </div>
                            <div className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                              <p><strong>Meeting ID:</strong> {session.zoom_meeting!.meeting_id}</p>
                              <p><strong>Password:</strong> {session.zoom_meeting!.password}</p>
                              <p><strong>Topic:</strong> {session.zoom_meeting!.topic}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recorded Lessons */}
                  {batch.schedule?.some(s => s.recorded_lessons && s.recorded_lessons.length > 0) && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recorded Lessons</h4>
                      <div className="space-y-3">
                        {batch.schedule?.map((session, sessionIndex) => 
                          session.recorded_lessons && session.recorded_lessons.length > 0 ? (
                            <div key={sessionIndex} className="space-y-2">
                              <h5 className="font-medium text-gray-700 dark:text-gray-300">
                                {session.title || new Date(session.date).toLocaleDateString('en-US', { weekday: 'long' })} Sessions
                              </h5>
                              {session.recorded_lessons.map((lesson, lessonIndex) => (
                                <div key={lessonIndex} className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h6 className="font-medium text-purple-900 dark:text-purple-300">
                                        {lesson.title}
                                      </h6>
                                      <p className="text-sm text-purple-700 dark:text-purple-400">
                                        Recorded: {new Date(lesson.recorded_date).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => window.open(lesson.url, '_blank')}
                                      className="inline-flex items-center px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                      <PlayCircle className="h-4 w-4 mr-1" />
                                      Watch
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : null
                        )}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          const phoneNumber = selectedStudent.phone_numbers?.[0]?.number;
                          if (phoneNumber) {
                            window.open(`https://wa.me/${phoneNumber.replace('+', '')}?text=Hi ${selectedStudent.full_name}, I hope you're doing well with your ${batch.course_details?.course_title} course!`, '_blank');
                          }
                        }}
                        className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        disabled={!selectedStudent.phone_numbers?.[0]}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Send Message
                      </button>
                      <button
                        onClick={() => window.open(`mailto:${selectedStudent.email}?subject=Regarding your ${batch.course_details?.course_title} course`, '_blank')}
                        className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </button>
                      <button
                        onClick={() => handleUnenrollStudent(selectedStudent._id, selectedStudent.full_name)}
                        className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <UserMinus className="h-4 w-4 mr-2" />
                        Unenroll
                      </button>
                      <button
                        onClick={() => setSelectedStudent(null)}
                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Enrollment Modal */}
      {showEnrollModal && (
        <BatchAssignmentModal
          isOpen={showEnrollModal}
          onClose={() => setShowEnrollModal(false)}
          onSuccess={async () => {
            setRefreshing(true);
            await loadStudents();
            onUpdate();
            setRefreshing(false);
            setLastRefresh(new Date());
            showToast.success('Student enrolled successfully!');
          }}
          mode="batch_enrollment"
          batch={batch}
          course={{
            _id: batch.course_details?._id || '',
            course_title: batch.course_details?.course_title || '',
            course_category: batch.course_details?.course_category || '',
            course_image: batch.course_details?.course_image
          }}
        />
      )}
    </div>
  );
};

export default BatchStudentEnrollment; 