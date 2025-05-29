"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { 
  Search, 
  Filter, 
  Calendar, 
  UserCheck, 
  School, 
  BookOpen, 
  ArrowUpDown, 
  CheckCircle2, 
  PlusSquare, 
  Trash2, 
  Columns, 
  X,
  Power,
  PlayCircle,
  Clock,
  XCircle,
  RefreshCw
} from 'lucide-react';
import useGetQuery from '@/hooks/getQuery.hook';
import usePostQuery from '@/hooks/postQuery.hook';
import { apiUrls } from '@/apis';
import { batchAPI, type TBatchStatus } from '@/apis/batch';

// Define instructor type
interface Instructor {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  expertise?: string[];
  rating?: number;
}

// Define course type
interface Course {
  _id: string;
  course_title: string;
  course_image?: string;
  course_category?: string;
  course_subcategory?: string;
  course_level?: string;
  course_duration?: string;
  assigned_instructor?: string;
}

// Define batch type
interface Batch {
  _id: string;
  batch_name: string;
  course_id: string;
  course_name: string;
  instructor_id: string;
  instructor_name: string;
  start_date: string;
  end_date: string;
  class_days: string[];
  class_time: string;
  max_students: number;
  enrolled_students: number;
  status: string;
}

// Form schema for batch creation
const batchSchema = yup.object().shape({
  batch_name: yup.string().required('Batch name is required'),
  course_id: yup.string().required('Course selection is required'),
  instructor_id: yup.string().required('Instructor assignment is required'),
  start_date: yup.string().required('Start date is required'),
  end_date: yup.string().required('End date is required'),
  class_days: yup.array().of(yup.string()).min(1, 'At least one class day must be selected'),
  class_time: yup.string().required('Class time is required'),
  max_students: yup.number().positive('Maximum students must be positive').required('Maximum students is required'),
  status: yup.string().required('Status is required'),
});

const BatchAssignment: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null);

  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: yupResolver(batchSchema) as any,
    defaultValues: {
      batch_name: '',
      course_id: '',
      instructor_id: '',
      start_date: '',
      end_date: '',
      class_days: [] as string[],
      class_time: '',
      max_students: 20,
      status: 'upcoming'
    }
  });

  // Selected form values
  const course_id = watch('course_id');
  const class_days = watch('class_days');

  // Status transition logic
  const getStatusTransitions = (currentStatus: string): TBatchStatus[] => {
    const transitions: Record<string, TBatchStatus[]> = {
      'upcoming': ['Active', 'Cancelled'],
      'active': ['Completed', 'Cancelled'],
      'completed': [], // No transitions from completed
      'cancelled': ['Upcoming'] // Can reactivate cancelled batches
    };
    return transitions[currentStatus.toLowerCase()] || [];
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    const icons = {
      'upcoming': <Clock className="h-4 w-4" />,
      'active': <PlayCircle className="h-4 w-4" />,
      'completed': <CheckCircle2 className="h-4 w-4" />,
      'cancelled': <XCircle className="h-4 w-4" />
    };
    return icons[statusLower as keyof typeof icons] || <Clock className="h-4 w-4" />;
  };

  const handleStatusUpdate = async (batchId: string, newStatus: TBatchStatus) => {
    try {
      setStatusUpdateLoading(batchId);
      
      const response = await batchAPI.updateBatchStatus(batchId, newStatus);
      
      if ((response as any)?.data) {
        toast.success(`Batch status updated to ${newStatus} successfully`);
        
        // Update the batch in local state
        setBatches(prev => prev.map(batch => 
          batch._id === batchId 
            ? { ...batch, status: newStatus.toLowerCase() }
            : batch
        ));
      } else {
        throw new Error('Failed to update batch status');
      }
    } catch (error) {
      console.error('Error updating batch status:', error);
      toast.error('Failed to update batch status');
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  // Fetch instructors, courses, and batches on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch instructors
        const instructorsResponse = await getQuery({
          url: apiUrls.instructor.getAllInstructors,
          onSuccess: () => {},
          onFail: () => {
            toast.error('Failed to fetch instructors');
          }
        });

        if (instructorsResponse?.data) {
          const instructorsData = Array.isArray(instructorsResponse.data) 
            ? instructorsResponse.data 
            : instructorsResponse.data.data || [];
          setInstructors(instructorsData);
        }

        // Fetch courses
        const coursesResponse = await getQuery({
          url: apiUrls.courses.getAllCourses,
          onSuccess: () => {},
          onFail: () => {
            toast.error('Failed to fetch courses');
          }
        });

        if (coursesResponse?.data) {
          const coursesData = Array.isArray(coursesResponse.data) 
            ? coursesResponse.data 
            : coursesResponse.data.data || [];
          setCourses(coursesData);
        }

        // Fetch batches
        const batchesResponse = await getQuery({
          url: apiUrls.batches.getAllBatches,
          onSuccess: () => {},
          onFail: () => {
            toast.error('Failed to fetch batches');
          }
        });

        if (batchesResponse?.data) {
          const batchesData = Array.isArray(batchesResponse.data) 
            ? batchesResponse.data 
            : batchesResponse.data.data || [];
          setBatches(batchesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load required data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getQuery]);

  // Toggle class day selection
  const toggleClassDay = (day: string) => {
    const currentDays = [...class_days];
    if (currentDays.includes(day)) {
      setValue('class_days', currentDays.filter((d) => d !== day));
    } else {
      setValue('class_days', [...currentDays, day]);
    }
  };

  // Filter batches based on search term and filters
  const filteredBatches = batches.filter((batch) => {
    // Apply search term filter
    const matchesSearch = batch.batch_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.instructor_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter
    const matchesStatus = statusFilter === 'all' || batch.status === statusFilter;
    
    // Apply course filter
    const matchesCourse = courseFilter === 'all' || batch.course_id === courseFilter;
    
    return matchesSearch && matchesStatus && matchesCourse;
  });

  // Load batch data for editing
  const handleEditBatch = (batch: Batch) => {
    setSelectedBatch(batch);
    setIsEditing(true);
    setShowForm(true);
    
    // Set form values
    reset({
      batch_name: batch.batch_name,
      course_id: batch.course_id,
      instructor_id: batch.instructor_id,
      start_date: new Date(batch.start_date).toISOString().split('T')[0],
      end_date: new Date(batch.end_date).toISOString().split('T')[0],
      class_days: batch.class_days,
      class_time: batch.class_time,
      max_students: batch.max_students,
      status: batch.status
    });
  };

  // Create new batch
  const handleNewBatch = () => {
    setSelectedBatch(null);
    setIsEditing(false);
    setShowForm(true);
    
    // Reset form values
    reset({
      batch_name: '',
      course_id: '',
      instructor_id: '',
      start_date: '',
      end_date: '',
      class_days: [] as string[],
      class_time: '',
      max_students: 20,
      status: 'upcoming'
    });
  };

  // Cancel form editing/creation
  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setSelectedBatch(null);
    reset();
  };

  // Delete batch
  const handleDeleteBatch = async (batch: Batch) => {
    if (window.confirm(`Are you sure you want to delete batch "${batch.batch_name}"?`)) {
      try {
        await postQuery({
          url: `${apiUrls.batches.deleteBatch}/${batch._id}`,
          postData: {},
          onSuccess: () => {
            toast.success('Batch deleted successfully');
            // Remove batch from state
            setBatches(prev => prev.filter(b => b._id !== batch._id));
          },
          onFail: (error) => {
            console.error("Delete error:", error);
            toast.error(error?.response?.data?.message || 'Failed to delete batch');
          },
        });
      } catch (error) {
        console.error('Error deleting batch:', error);
        toast.error('An error occurred while deleting the batch');
      }
    }
  };

  // Form submission
  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      
      // Find course and instructor names for reference
      const course = courses.find(c => c._id === data.course_id);
      const instructor = instructors.find(i => i._id === data.instructor_id);
      
      if (!course || !instructor) {
        toast.error('Invalid course or instructor selection');
        return;
      }
      
      // Prepare data
      const batchData = {
        ...data,
        course_name: course.course_title,
        instructor_name: instructor.name
      };
      
      if (isEditing && selectedBatch) {
        // Update existing batch
        await postQuery({
          url: `${apiUrls.batches.updateBatch}/${selectedBatch._id}`,
          postData: batchData,
          onSuccess: () => {
            toast.success('Batch updated successfully');
            
            // Update batch in state
            setBatches(prev => prev.map(b => 
              b._id === selectedBatch._id ? { ...b, ...batchData } : b
            ));
            
            // Close form
            handleCancel();
          },
          onFail: (error) => {
            console.error("Update error:", error);
            toast.error(error?.response?.data?.message || 'Failed to update batch');
          },
        });
      } else {
        // Create new batch
        await postQuery({
          url: apiUrls.batches.createBatch,
          postData: batchData,
          onSuccess: (response) => {
            toast.success('Batch created successfully');
            
            // Add new batch to state
            const newBatch = {
              _id: response.data._id || `temp-${Date.now()}`,
              ...batchData,
              enrolled_students: 0
            };
            
            setBatches(prev => [...prev, newBatch as Batch]);
            
            // Close form
            handleCancel();
          },
          onFail: (error) => {
            console.error("Create error:", error);
            toast.error(error?.response?.data?.message || 'Failed to create batch');
          },
        });
      }
    } catch (error) {
      console.error('Error submitting batch:', error);
      toast.error('An error occurred while saving the batch');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto">
      {!showForm ? (
        <div>
          {/* Batches Header & Controls */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold">Batch Management</h1>
            
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                <input 
                  type="text"
                  placeholder="Search batches..."
                  className="pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <select 
                  className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                
                <select 
                  className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                >
                  <option value="all">All Courses</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>{course.course_title}</option>
                  ))}
                </select>
              </div>
              
              <button 
                onClick={handleNewBatch}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center gap-1.5"
              >
                <PlusSquare className="h-4 w-4" />
                <span>New Batch</span>
              </button>
            </div>
          </div>
          
          {/* Batches Table */}
          {isLoading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700/60 rounded w-full"></div>
                ))}
              </div>
            </div>
          ) : filteredBatches.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <School className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Batches Found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {searchTerm || statusFilter !== 'all' || courseFilter !== 'all'
                  ? "No batches match your search criteria. Try changing your filters."
                  : "Start by creating your first batch assignment."}
              </p>
              <button 
                onClick={handleNewBatch}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md inline-flex items-center gap-2"
              >
                <PlusSquare className="h-4 w-4" />
                <span>Create First Batch</span>
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Batch
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Instructor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Schedule
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Students
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredBatches.map((batch) => (
                      <tr key={batch._id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900 dark:text-white">{batch.batch_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-200">{batch.course_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-200">{batch.instructor_name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-gray-200">
                            <div className="flex items-center mb-1">
                              <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                              <span>
                                {new Date(batch.start_date).toLocaleDateString()} - {new Date(batch.end_date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {batch.class_days.join(', ')} at {batch.class_time}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm text-gray-900 dark:text-gray-200">
                              {batch.enrolled_students} / {batch.max_students}
                            </div>
                            <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full ml-2">
                              <div 
                                className={`h-full rounded-full ${
                                  batch.enrolled_students / batch.max_students > 0.8 
                                    ? 'bg-amber-500' 
                                    : batch.enrolled_students / batch.max_students > 0.5
                                      ? 'bg-emerald-500'
                                      : 'bg-blue-500'
                                }`}
                                style={{ width: `${(batch.enrolled_students / batch.max_students) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            batch.status === 'active' 
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400'
                              : batch.status === 'upcoming'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                : batch.status === 'completed'
                                  ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          }`}>
                            {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center space-x-2">
                            {/* Status Toggle Buttons */}
                            {getStatusTransitions(batch.status).map((newStatus) => (
                              <button
                                key={newStatus}
                                onClick={() => handleStatusUpdate(batch._id, newStatus)}
                                disabled={statusUpdateLoading === batch._id}
                                className={`p-1.5 text-xs rounded-md transition-colors ${
                                  newStatus === 'Active'
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40'
                                    : newStatus === 'Completed'
                                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                      : newStatus === 'Cancelled'
                                        ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40'
                                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                title={`Change status to ${newStatus}`}
                              >
                                {statusUpdateLoading === batch._id ? (
                                  <RefreshCw className="h-3 w-3 animate-spin" />
                                ) : (
                                  <>
                                    {getStatusIcon(newStatus)}
                                    <span className="ml-1 hidden sm:inline">{newStatus}</span>
                                  </>
                                )}
                              </button>
                            ))}
                            
                            {/* Edit Button */}
                            <button 
                              onClick={() => handleEditBatch(batch)}
                              className="p-1.5 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-md"
                              title="Edit Batch"
                            >
                              <Columns className="h-4 w-4" />
                            </button>
                            
                            {/* Delete Button */}
                            <button 
                              onClick={() => handleDeleteBatch(batch)}
                              className="p-1.5 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/20 rounded-md"
                              title="Delete Batch"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {/* Batch Form Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {isEditing ? `Edit Batch: ${selectedBatch?.batch_name}` : 'Create New Batch'}
            </h2>
            <button 
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Close form"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Batch Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Batch Name
                  </label>
                  <input
                    type="text"
                    {...register("batch_name")}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.batch_name ? 'border-red-500 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700`}
                    placeholder="e.g., Morning Batch 01"
                  />
                  {errors.batch_name && (
                    <p className="mt-1 text-xs text-red-500">{errors.batch_name.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Course
                  </label>
                  <select
                    {...register("course_id")}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.course_id ? 'border-red-500 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700`}
                  >
                    <option value="">-- Select Course --</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.course_title}
                      </option>
                    ))}
                  </select>
                  {errors.course_id && (
                    <p className="mt-1 text-xs text-red-500">{errors.course_id.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Assign Instructor
                  </label>
                  <select
                    {...register("instructor_id")}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.instructor_id ? 'border-red-500 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700`}
                  >
                    <option value="">-- Assign Instructor --</option>
                    {instructors.map((instructor) => (
                      <option key={instructor._id} value={instructor._id}>
                        {instructor.name}
                      </option>
                    ))}
                  </select>
                  {errors.instructor_id && (
                    <p className="mt-1 text-xs text-red-500">{errors.instructor_id.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Maximum Students
                  </label>
                  <input
                    type="number"
                    {...register("max_students")}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.max_students ? 'border-red-500 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700`}
                    min="1"
                  />
                  {errors.max_students && (
                    <p className="mt-1 text-xs text-red-500">{errors.max_students.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <select
                    {...register("status")}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.status ? 'border-red-500 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700`}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-xs text-red-500">{errors.status.message}</p>
                  )}
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Start Date
                  </label>
                  <input
                    type="date"
                    {...register("start_date")}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.start_date ? 'border-red-500 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700`}
                  />
                  {errors.start_date && (
                    <p className="mt-1 text-xs text-red-500">{errors.start_date.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    End Date
                  </label>
                  <input
                    type="date"
                    {...register("end_date")}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.end_date ? 'border-red-500 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700`}
                  />
                  {errors.end_date && (
                    <p className="mt-1 text-xs text-red-500">{errors.end_date.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Class Days
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleClassDay(day)}
                        className={`px-3 py-1.5 text-sm rounded-md ${
                          class_days.includes(day)
                            ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700'
                            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                        } border hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                  {errors.class_days && (
                    <p className="mt-1 text-xs text-red-500">{errors.class_days.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Class Time
                  </label>
                  <input
                    type="time"
                    {...register("class_time")}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.class_time ? 'border-red-500 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700`}
                  />
                  {errors.class_time && (
                    <p className="mt-1 text-xs text-red-500">{errors.class_time.message}</p>
                  )}
                </div>
                
                {/* Course Preview (if selected) */}
                {course_id && courses.find(c => c._id === course_id) && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected Course</h3>
                    <div className="flex items-center">
                      {courses.find(c => c._id === course_id)?.course_image && (
                        <div className="relative h-12 w-12 mr-3 rounded-md overflow-hidden">
                          <Image
                            src={courses.find(c => c._id === course_id)?.course_image || ''}
                            alt="Course"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {courses.find(c => c._id === course_id)?.course_title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {courses.find(c => c._id === course_id)?.course_duration || 'No duration specified'} • {courses.find(c => c._id === course_id)?.course_level || 'No level specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:bg-blue-400 dark:disabled:bg-blue-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : isEditing ? 'Update Batch' : 'Create Batch'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BatchAssignment; 