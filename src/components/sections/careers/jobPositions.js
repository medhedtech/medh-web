"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, ChevronRight, MapPin, Globe, Clock, Award } from "lucide-react";
import JobApply from "./jobApply";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import { toast } from "react-toastify";
import Preloader from "@/components/shared/others/Preloader";
import { FaBriefcase, FaMapMarkerAlt, FaClock, FaDollarSign, FaChevronRight as FaChevronRightIcon, FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import Link from 'next/link';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Move default job fields outside component to prevent recreation
const defaultJobFields = {
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
const JobSection = React.memo(({ title, children, icon: Icon }) => (
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

const ListSection = React.memo(({ items }) => (
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

// Cache key for localStorage
const JOBS_CACHE_KEY = 'medh_jobs_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Helper function to handle localStorage with error boundaries
const cacheManager = {
  set: (data) => {
    try {
      const cacheData = {
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
  get: () => {
    try {
      const cache = localStorage.getItem(JOBS_CACHE_KEY);
      if (!cache) return null;

      const { timestamp, data } = JSON.parse(cache);
      if (!timestamp || !data) return null;

      const isExpired = Date.now() - timestamp > CACHE_DURATION;
      return isExpired ? null : data;
    } catch (error) {
      console.error('Cache read failed:', error);
      return null;
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(JOBS_CACHE_KEY);
      return true;
    } catch (error) {
      console.error('Cache clear failed:', error);
      return false;
    }
  }
};

// Custom hook for job data fetching with optimized performance
const useJobData = () => {
  const [state, setState] = useState({
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

  const { getQuery } = useGetQuery();
  const isMounted = useRef(true);
  const fetchingRef = useRef(false);
  const lastFiltersRef = useRef(state.filters);
  const debounceTimerRef = useRef(null);

  const fetchJobs = useCallback(async (options = {}) => {
    const { forceFetch = false, silent = false, newFilters = null } = options;
    
    if (fetchingRef.current) return;

    const currentFilters = newFilters || state.filters;
    
    // Only include non-empty filter values
    const cleanFilters = Object.entries(currentFilters).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && (!Array.isArray(value) || value.length > 0)) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const hasFiltersChanged = JSON.stringify(cleanFilters) !== JSON.stringify(lastFiltersRef.current);
    
    if (!forceFetch && !hasFiltersChanged && Date.now() - state.lastFetchTime < 5000) {
      return;
    }

    try {
      fetchingRef.current = true;
      !silent && setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Use the correct endpoint from apiUrls
      const url = apiUrls.jobForm.getAllJobPosts;
      
      console.log('Fetching jobs from:', url); // Debug log

      const response = await getQuery({ 
        url,
        params: {
          page: state.pagination.page,
          limit: state.pagination.limit,
          ...cleanFilters
        }
      });

      // Debug logging
      console.log('Job API Response:', {
        url,
        success: response?.success,
        status: response?.status,
        data: response?.data,
      });

      if (!isMounted.current) return;

      // Handle 404 and other error cases
      if (response?.status === 404) {
        throw new Error('Job listings endpoint not found. Please check API configuration.');
      }

      // Add proper data validation
      if (response?.success) {
        // For development/testing, use mock data if no real data is available
        const jobsData = response.data?.jobs || [];
        const total = response.data?.total || 0;

        // Mock data for development/testing
        const mockJobs = [
          {
            id: '1',
            title: 'Senior Full Stack Developer',
            description: 'We are looking for an experienced Full Stack Developer...',
            department: 'Engineering',
            location: 'Remote',
            employmentType: 'Full-time',
            salary: '$120k - $150k',
            postedDate: '2 days ago'
          },
          {
            id: '2',
            title: 'Product Manager',
            description: 'Seeking a talented Product Manager to join our team...',
            department: 'Product',
            location: 'Mumbai',
            employmentType: 'Full-time',
            salary: '$90k - $120k',
            postedDate: '1 week ago'
          }
        ];

        const finalJobs = jobsData.length > 0 ? jobsData : mockJobs;
        
        setState(prev => ({
          ...prev,
          jobs: finalJobs.map(job => ({
            id: job?.id || '',
            title: job?.title || '',
            description: job?.description || '',
            department: job?.department || '',
            location: job?.location || '',
            employmentType: job?.employmentType || 'Full-time',
            salary: job?.salary || '',
            postedDate: job?.postedDate || 'Recently',
            applyUrl: apiUrls.jobForm.createJobPost
          })),
          activeJob: prev.activeJob || (finalJobs[0]?.id ?? null),
          pagination: {
            ...prev.pagination,
            total: total || finalJobs.length
          },
          isLoading: false,
          error: null,
          lastFetchTime: Date.now(),
          filters: cleanFilters
        }));

        lastFiltersRef.current = cleanFilters;
        
        // Cache the results
        cacheManager.set({
          jobs: finalJobs,
          timestamp: Date.now(),
          filters: cleanFilters,
          pagination: {
            page: state.pagination.page,
            limit: state.pagination.limit,
            total: total || finalJobs.length
          }
        });
      } else {
        throw new Error(response?.message || "Invalid response format");
      }
    } catch (error) {
      if (!isMounted.current) return;
      
      console.error('Job fetch error:', error);
      const errorMessage = error?.message || "Failed to fetch job positions";
      !silent && toast.error(errorMessage);
      
      // Use mock data in case of error in development
      const mockJobs = [
        {
          id: '1',
          title: 'Senior Full Stack Developer',
          description: 'We are looking for an experienced Full Stack Developer...',
          department: 'Engineering',
          location: 'Remote',
          employmentType: 'Full-time',
          salary: '$120k - $150k',
          postedDate: '2 days ago'
        }
      ];

      setState(prev => ({
        ...prev,
        jobs: process.env.NODE_ENV === 'development' ? mockJobs : [],
        error: errorMessage,
        isLoading: false
      }));
    } finally {
      if (isMounted.current) {
        fetchingRef.current = false;
      }
    }
  }, [getQuery, state.pagination.page, state.pagination.limit, state.filters]);

  const debouncedFetch = useCallback((options = {}) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      fetchJobs(options);
    }, 500); // Increased debounce time to 500ms
  }, [fetchJobs]);

  const updateFilters = useCallback((newFilters) => {
    // Only update if filters actually changed
    setState(prev => {
      const updatedFilters = { ...prev.filters, ...newFilters };
      if (JSON.stringify(updatedFilters) === JSON.stringify(prev.filters)) {
        return prev; // No change needed
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

  const updatePagination = useCallback((newPage, newLimit = state.pagination.limit) => {
    setState(prev => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        page: newPage,
        limit: newLimit
      }
    }));
  }, []);

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
  }, []); // Empty dependency array for initial fetch only

  // Remove visibility change handler to prevent extra fetches
  const setActiveJob = useCallback((jobTitle) => {
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
const JobOpening = React.memo(() => {
  const { jobs, activeJob, setActiveJob, isLoading, error } = useJobData();

  // Memoized job finder with stable reference
  const job = React.useMemo(() => 
    jobs.find((jobItem) => jobItem.title === activeJob),
    [jobs, activeJob]
  );

  // Stable callback reference
  const handleJobChange = useCallback((title) => {
    setActiveJob(title);
  }, [setActiveJob]);

  if (isLoading && !jobs.length) {
    return <Preloader />;
  }

  if (error && !jobs.length) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <section className="py-16 w-full bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Job Positions / <span className="text-primary-500">Openings</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join our team and be part of transforming education through innovation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Job Navigation */}
            <motion.div
              variants={fadeInUp}
              className="lg:col-span-3 flex flex-col gap-2"
            >
              {jobs.map((jobItem) => (
                <button
                  key={jobItem.title}
                  onClick={() => handleJobChange(jobItem.title)}
                  className={`
                    p-4 rounded-xl text-left transition-all duration-300
                    ${activeJob === jobItem.title
                      ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5" />
                    <span className="font-medium">{jobItem.title}</span>
                  </div>
                </button>
              ))}
            </motion.div>

            {/* Job Details */}
            {job && (
              <motion.div
                variants={fadeInUp}
                className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
              >
                <motion.div variants={staggerContainer} className="space-y-6">
                  <JobSection title="Job Description" icon={Briefcase}>
                    <p className="text-gray-600 dark:text-gray-300">{job.description}</p>
                  </JobSection>

                  <JobSection title="Key Responsibilities" icon={Award}>
                    <ListSection items={defaultJobFields.responsibilities} />
                  </JobSection>

                  <JobSection title="Qualifications" icon={Award}>
                    <ListSection items={defaultJobFields.qualifications} />
                  </JobSection>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <JobSection title="Work Mode" icon={Clock}>
                      <p className="text-gray-600 dark:text-gray-300">{defaultJobFields.mode}</p>
                    </JobSection>

                    <JobSection title="Markets" icon={Globe}>
                      <p className="text-gray-600 dark:text-gray-300">{defaultJobFields.market}</p>
                    </JobSection>
                  </div>

                  <JobSection title="Selection Process" icon={Award}>
                    <ListSection items={defaultJobFields.selectionProcess} />
                  </JobSection>

                  <JobSection title="Office Location" icon={MapPin}>
                    <p className="text-gray-600 dark:text-gray-300">{defaultJobFields.officeLocation}</p>
                  </JobSection>

                  <JobSection title="Work from Home Requirements" icon={Briefcase}>
                    <ListSection items={defaultJobFields.homeRequirements} />
                  </JobSection>

                  {defaultJobFields.note && (
                    <div className="bg-primary-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <p className="font-medium text-primary-700 dark:text-primary-300 mb-2">
                        {defaultJobFields.note}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {defaultJobFields.note_description}
                      </p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* Application Form */}
            <motion.div
              variants={fadeInUp}
              className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
            >
              <JobApply activeJob={activeJob} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

const GeneralApplicationModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null,
    coverLetter: '',
    portfolio: '',
    hearAboutUs: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
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
                      rows="4"
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

const JobPositions = ({ positions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { jobs, isLoading, error, updateFilters } = useJobData();

  // Handle job application
  const handleApply = async (jobId) => {
    try {
      // First get user details
      const userId = '67bc13bfe224f0cf63673553'; // This should come from your auth context/state
      const userResponse = await getQuery({ 
        url: apiUrls.user.getDetailsbyId(userId),
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth token if needed
        }
      });

      console.log('User details response:', userResponse); // Debug log

      if (!userResponse?.success) {
        throw new Error(userResponse?.error || 'Failed to fetch user details');
      }

      // Then submit the job application
      const response = await fetch(apiUrls.jobForm.createJobPost, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth token if needed
        },
        body: JSON.stringify({
          jobId,
          userId,
          userDetails: userResponse.data,
          applicationDate: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        showToast.success('Application submitted successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData?.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Application error:', error);
      toast.error(error.message || 'Error submitting application. Please try again.');
    }
  };

  // Debounce search updates
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
    <div className="bg-gray-50 dark:bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Current Openings
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Find your perfect role and join our mission to transform education
          </motion.p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search positions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="flex space-x-4">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Job Listings */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 text-sm font-medium text-primary-700 bg-primary-100 dark:text-primary-400 dark:bg-primary-900/30 rounded-full">
                    {job.employmentType}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {job.postedDate}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {job.title}
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaBriefcase className="mr-2" />
                    <span>{job.department}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{job.location}</span>
                  </div>
                  {job.salary && (
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <FaDollarSign className="mr-2" />
                      <span>{job.salary}</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
                  {job.description}
                </p>
                <div className="flex space-x-3">
                  <Link 
                    href={`/careers/${job.id}`}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
                  >
                    View Details
                    <FaChevronRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleApply(job.id)}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-200"
                  >
                    Quick Apply
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results Message */}
        {jobs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No positions found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try adjusting your search or filters
            </p>
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Don't see the right position?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200"
          >
            Submit General Application
            <FaChevronRightIcon className="ml-2 h-4 w-4" />
          </button>
        </motion.div>
      </div>

      <GeneralApplicationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

// Example prop types
JobPositions.defaultProps = {
  positions: [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      salary: "$120k - $150k",
      description: "We're looking for a Senior Full Stack Developer to join our engineering team...",
      postedDate: "2 days ago"
    },
    // Add more example positions as needed
  ]
};

export default JobPositions;
