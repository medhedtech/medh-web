"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, ChevronRight, MapPin, Globe, Clock, Award } from "lucide-react";
import MultiStepJobApply from "./MultiStepJobApply";
import { 
  fetchActiveJobPosts, 
  submitJobApplication, 
  searchJobs,
  type IJobPost,
  type IJobApplication,
  type IJobSearchParams,
  formatJobData,
  getJobStatusColor,
  getApplicationStatusColor
} from '@/apis/jobs.api';
import Preloader from "@/components/shared/others/Preloader";
import { FaBriefcase, FaMapMarkerAlt, FaClock, FaDollarSign, FaChevronRight as FaChevronRightIcon, FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { toast } from 'sonner';

// TypeScript interfaces - Updated to match new API
interface IJobPosition extends IJobPost {
  // Legacy compatibility fields
  id: string;
  postedDate?: string;
  salary?: string;
  requirements?: string[];
}

interface IJobFilters {
  search: string;
  location: string;
  minSalary: number | null;
  maxSalary: number | null;
  employmentType: string;
  department: string;
  experienceLevel: string;
  skills: string[];
}

interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

interface IJobDataState {
  jobs: IJobPosition[];
  activeJob: string | null;
  isLoading: boolean;
  error: string | null;
  lastFetchTime: number;
  filters: IJobFilters;
  pagination: IPagination;
}

interface IJobSectionProps {
  title: string;
  children: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
}

interface IListSectionProps {
  items: string[];
}

interface IGeneralApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IJobPositionsProps {
  positions?: IJobPosition[];
}

interface IJobDefaultFields {
  responsibilities: string[];
  qualifications: string[];
  mode: string;
  market: string;
  selectionProcess: string[];
  officeLocation: string;
  homeRequirements: string[];
  note: string;
  note_description: string;
  remuneration: string;
}

interface ICacheData {
  timestamp: number;
  data: IJobPosition[];
  filters?: IJobFilters;
  pagination?: IPagination;
}

interface ICacheManager {
  set: (data: IJobPosition[]) => boolean;
  get: () => IJobPosition[] | null;
  clear: () => boolean;
}

interface IJobApplicationFormData {
  name: string;
  email: string;
  phone: string;
  resume: File | null;
  coverLetter: string;
  portfolio: string;
  hearAboutUs: string;
}

// Animation variants with proper typing
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
} as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
} as const;

// Move default job fields outside component to prevent recreation
const defaultJobFields: IJobDefaultFields = {
  responsibilities: [
    "Deliver live online classes and engage with students effectively",
    "Develop and maintain course curriculum",
    "Track and report student progress",
    "Collaborate with team members for continuous improvement",
    "Participate in training and development sessions"
  ],
  qualifications: [
    "Bachelor's or Master's degree in relevant field",
    "Minimum 2 years of teaching experience",
    "Strong communication and presentation skills",
    "Proficiency in online teaching tools",
    "Passion for education and student success"
  ],
  mode: "Hybrid (Work from Office & Remote)",
  market: "INDIA, US, UK, and AUSTRALIA",
  selectionProcess: [
    "Initial Application Review",
    "Telephonic Interview",
    "Online Assessment",
    "Demo Session",
    "Final Interview"
  ],
  officeLocation: "Andheri East, Mumbai",
  homeRequirements: [
    "High-speed internet connection (minimum 10 Mbps)",
    "Laptop with HD camera and microphone",
    "Quiet, professional workspace",
    "Reliable power backup"
  ],
  note: "Professional headset can be provided if needed.",
  note_description: "Join our mission to transform education through innovation and technology. We offer comprehensive training and support to ensure your success in this role.",
  remuneration: "Competitive compensation package based on experience and expertise"
};

// Separate components to prevent re-renders
const JobSection = React.memo<IJobSectionProps>(({ title, children, icon: Icon }) => (
  <motion.div variants={fadeInUp} className="mb-6">
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-5 h-5 text-primary-500" />
      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
        {title}
      </h3>
    </div>
    {children}
  </motion.div>
));

JobSection.displayName = 'JobSection';

const ListSection = React.memo<IListSectionProps>(({ items }) => (
  <ul className="space-y-2 pl-6">
    {items.map((item, index) => (
      <motion.li
        key={index}
        variants={fadeInUp}
        className="flex items-start gap-2 text-gray-600 dark:text-gray-300"
      >
        <ChevronRight className="w-4 h-4 mt-1 text-primary-500 flex-shrink-0" />
        <span>{item}</span>
      </motion.li>
    ))}
  </ul>
));

ListSection.displayName = 'ListSection';

// Cache key for localStorage
const JOBS_CACHE_KEY = 'medh_jobs_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Helper function to handle localStorage with error boundaries
const cacheManager: ICacheManager = {
  set: (data: IJobPosition[]): boolean => {
    try {
      const cacheData: ICacheData = {
        timestamp: Date.now(),
        data: data
      };
      localStorage.setItem(JOBS_CACHE_KEY, JSON.stringify(cacheData));
      return true;
    } catch (error) {
      console.error('Cache write failed:', error);
      return false;
    }
  },
  get: (): IJobPosition[] | null => {
    try {
      const cache = localStorage.getItem(JOBS_CACHE_KEY);
      if (!cache) return null;

      const { timestamp, data }: ICacheData = JSON.parse(cache);
      if (!timestamp || !data) return null;

      const isExpired = Date.now() - timestamp > CACHE_DURATION;
      return isExpired ? null : data;
    } catch (error) {
      console.error('Cache read failed:', error);
      return null;
    }
  },
  clear: (): boolean => {
    try {
      localStorage.removeItem(JOBS_CACHE_KEY);
      return true;
    } catch (error) {
      console.error('Cache clear failed:', error);
      return false;
    }
  }
};

// Enhanced custom hook for job data fetching using new API
const useJobData = () => {
  const [state, setState] = useState<IJobDataState>({
    jobs: [],
    activeJob: null,
    isLoading: true,
    error: null,
    lastFetchTime: 0,
    filters: {
      search: '',
      location: '',
      minSalary: null,
      maxSalary: null,
      employmentType: '',
      department: '',
      experienceLevel: '',
      skills: []
    },
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    }
  });

  const isMounted = useRef(true);
  const fetchingRef = useRef(false);
  const lastFiltersRef = useRef(state.filters);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchJobs = useCallback(async (options: {
    forceFetch?: boolean;
    silent?: boolean;
    newFilters?: Partial<IJobFilters>;
  } = {}) => {
    const { forceFetch = false, silent = false, newFilters = null } = options;
    
    if (fetchingRef.current) return;

    const currentFilters = newFilters ? { ...state.filters, ...newFilters } : state.filters;
    
    // Convert filters to API search params
    const searchParams: IJobSearchParams = {
      page: state.pagination.page,
      limit: state.pagination.limit,
      search: currentFilters.search || undefined,
      department: currentFilters.department || undefined,
      location: currentFilters.location || undefined,
      employmentType: currentFilters.employmentType || undefined,
      salaryMin: currentFilters.minSalary || undefined,
      salaryMax: currentFilters.maxSalary || undefined,
      sort_by: 'createdAt',
      sort_order: 'desc'
    };

    // Remove undefined values
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key as keyof IJobSearchParams] === undefined) {
        delete searchParams[key as keyof IJobSearchParams];
      }
    });

    const hasFiltersChanged = JSON.stringify(searchParams) !== JSON.stringify(lastFiltersRef.current);
    
    if (!forceFetch && !hasFiltersChanged && Date.now() - state.lastFetchTime < 5000) {
      return;
    }

    try {
      fetchingRef.current = true;
      !silent && setState(prev => ({ ...prev, isLoading: true, error: null }));

      console.log('Fetching jobs with params:', searchParams);

      // Use the new API
      const response = await fetchActiveJobPosts(searchParams);

      console.log('Job API Response:', {
        success: response?.status === 'success',
        status: response?.status,
        data: response?.data,
      });

      if (!isMounted.current) return;

      if (response?.status === 'success' && response?.data) {
        const { jobs = [], pagination = {}, total = 0 } = response.data;
        
        // Transform API data to match component interface
        const transformedJobs: IJobPosition[] = jobs.map(job => ({
          ...job,
          id: job._id,
          // Legacy compatibility
          postedDate: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently',
          salary: job.salaryRange 
            ? `${job.salaryRange.currency} ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}`
            : undefined,
          requirements: job.qualifications?.skills || [],
          // Enhanced fields
          ...formatJobData(job)
        }));

        setState(prev => ({
          ...prev,
          jobs: transformedJobs,
          activeJob: prev.activeJob || (transformedJobs[0]?._id ?? null),
          pagination: {
            ...prev.pagination,
            total: total || transformedJobs.length,
            totalPages: pagination.totalPages || Math.ceil((total || transformedJobs.length) / prev.pagination.limit)
          },
          isLoading: false,
          error: null,
          lastFetchTime: Date.now(),
          filters: currentFilters
        }));

        lastFiltersRef.current = searchParams as any;
        
        // Cache the results
        cacheManager.set(transformedJobs);
      } else {
        throw new Error(response?.error || "Failed to fetch job positions");
      }
    } catch (error) {
      if (!isMounted.current) return;
      
      console.error('Job fetch error:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch job positions";
      !silent && toast.error(errorMessage);
      
      // Try to use cached data on error
      const cachedData = cacheManager.get();
      if (cachedData && cachedData.length > 0) {
        setState(prev => ({
          ...prev,
          jobs: cachedData,
          error: null,
          isLoading: false
        }));
        toast.info('Showing cached job listings');
      } else {
        setState(prev => ({
          ...prev,
          jobs: [],
          error: errorMessage,
          isLoading: false
        }));
      }
    } finally {
      if (isMounted.current) {
        fetchingRef.current = false;
      }
    }
  }, [state.pagination.page, state.pagination.limit, state.filters]);

  const debouncedFetch = useCallback((options: Parameters<typeof fetchJobs>[0] = {}) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      fetchJobs(options);
    }, 500);
  }, [fetchJobs]);

  const updateFilters = useCallback((newFilters: Partial<IJobFilters>) => {
    setState(prev => {
      const updatedFilters = { ...prev.filters, ...newFilters };
      if (JSON.stringify(updatedFilters) === JSON.stringify(prev.filters)) {
        return prev;
      }
      return {
        ...prev,
        pagination: { ...prev.pagination, page: 1 },
        filters: updatedFilters
      };
    });
  }, []);

  // Effect to handle filter changes
  useEffect(() => {
    debouncedFetch({ forceFetch: true });
  }, [state.filters, debouncedFetch]);

  const updatePagination = useCallback((newPage: number, newLimit: number = state.pagination.limit) => {
    setState(prev => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        page: newPage,
        limit: newLimit
      }
    }));
  }, [state.pagination.limit]);

  // Effect to handle pagination changes
  useEffect(() => {
    debouncedFetch({ forceFetch: true });
  }, [state.pagination.page, state.pagination.limit, debouncedFetch]);

  // Initial fetch only
  useEffect(() => {
    isMounted.current = true;
    fetchJobs();

    return () => {
      isMounted.current = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const setActiveJob = useCallback((jobTitle: string) => {
    setState(prev => ({ ...prev, activeJob: jobTitle }));
  }, []);

  return {
    ...state,
    setActiveJob,
    updateFilters,
    updatePagination,
    refetchJobs: useCallback(() => fetchJobs({ forceFetch: true }), [fetchJobs])
  };
};

// Memoize the entire JobOpening component
// const JobOpening = React.memo(() => {
//   ... entire component removed ...
// });

const GeneralApplicationModal: React.FC<IGeneralApplicationModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<IJobApplicationFormData>({
    name: '',
    email: '',
    phone: '',
    resume: null,
    coverLetter: '',
    portfolio: '',
    hearAboutUs: ''
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    toast.success('Application submitted successfully!');
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const files = (e.target as HTMLInputElement).files;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  General Application
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Resume *
                    </label>
                    <input
                      type="file"
                      name="resume"
                      required
                      accept=".pdf,.doc,.docx"
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Accepted formats: PDF, DOC, DOCX
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Cover Letter
                    </label>
                    <textarea
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="Tell us why you'd like to work with us..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Portfolio URL
                    </label>
                    <input
                      type="url"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="https://"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      How did you hear about us?
                    </label>
                    <select
                      name="hearAboutUs"
                      value={formData.hearAboutUs}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select an option</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="jobBoard">Job Board</option>
                      <option value="referral">Referral</option>
                      <option value="socialMedia">Social Media</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors duration-200"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Update the JobPositions component to include the form directly
const JobPositions: React.FC<IJobPositionsProps> = ({ positions }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { jobs, isLoading, error, updateFilters } = useJobData();

  const handleApply = async (jobId: string) => {
    try {
      const userId = localStorage.getItem('userId') || '';
      const userName = localStorage.getItem('userName') || localStorage.getItem('fullName') || '';
      const userEmail = localStorage.getItem('userEmail') || '';
      
      // Create user details object
      const userDetails = {
        fullName: userName,
        email: userEmail,
        phone: localStorage.getItem('userPhone') || '',
      };

      const apiResponse = await submitJobApplication({
        jobId,
        userId,
        userDetails,
        applicationDate: new Date().toISOString()
      });
      
      if (apiResponse.status === 'success') {
        toast.success('Application submitted successfully!');
      } else {
        throw new Error(apiResponse.error || 'Failed to submit application');
      }
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  // Debounce search updates into filters
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({
        search: searchTerm,
        department: selectedDepartment === 'All' ? '' : selectedDepartment,
        location: selectedLocation === 'All' ? '' : selectedLocation
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedDepartment, selectedLocation, updateFilters]);

  // Extract unique departments and locations from jobs
  const departments = ['All', ...new Set(jobs.map(job => job.department))];
  const locations = ['All', ...new Set(jobs.map(job => job.location))];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent mb-6"
          >
            Current Openings
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Find your perfect role and join our mission to transform education through innovation
          </motion.p>
        </div>

        {/* Main Content Grid - Form and Search */}
        <div className="grid grid-cols-1 gap-8 lg:gap-12">
          {/* Search and Job Listings - Full Width */}
          <div className="w-full">
            {/* Search and Filters */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 mb-8 shadow-lg border border-gray-200/20 dark:border-gray-700/20"
            >
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                  <input
                    type="text"
                    placeholder="Search positions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 lg:w-auto">
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="px-4 py-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm min-w-[140px]"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="px-4 py-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm min-w-[140px]"
                  >
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Job Listings */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            >
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  variants={itemVariants}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/20 dark:border-gray-700/20 group hover:-translate-y-1"
                >
                  <div className="p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
                      <div className="flex items-center gap-3 mb-4 sm:mb-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FaBriefcase className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <span className="inline-block px-4 py-2 text-sm font-semibold text-primary-700 bg-primary-100 dark:text-primary-300 dark:bg-primary-900/40 rounded-full mb-2">
                            {job.employmentType}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {job.postedDate}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {job.title}
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-3">
                          <FaBriefcase className="w-4 h-4" />
                        </div>
                        <span className="font-medium">{job.department}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-3">
                          <FaMapMarkerAlt className="w-4 h-4" />
                        </div>
                        <span className="font-medium">{job.location}</span>
                      </div>
                      {job.salary && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300 sm:col-span-2">
                          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-3">
                            <FaDollarSign className="w-4 h-4" />
                          </div>
                          <span className="font-medium">{job.salary}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed line-clamp-3">
                      {job.description}
                    </p>
                    
                    <div className="flex flex-col gap-3">
                      <Link 
                        href={`/careers/${job.id}`}
                        className="w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-primary-500 to-blue-500 text-white rounded-xl hover:from-primary-600 hover:to-blue-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl group/btn"
                      >
                        View Details
                        <FaChevronRightIcon className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                      <button
                        onClick={() => handleApply(job.id)}
                        className="w-full inline-flex items-center justify-center px-6 py-4 border-2 border-primary-500 text-primary-500 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 font-semibold hover:border-primary-600 hover:text-primary-600"
                      >
                        Quick Apply
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* No Results Message */}
            {jobs.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaSearch className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  No positions found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Try adjusting your search criteria or check back later for new opportunities
                </p>
              </motion.div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-16">
                <Preloader />
              </div>
            )}

            {/* Error State */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaTimes className="w-10 h-10 text-red-500" />
                </div>
                <p className="text-red-500 text-lg font-medium">{error}</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <GeneralApplicationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

// Remove the defaultProps assignment that's causing TypeScript errors
export default JobPositions; 