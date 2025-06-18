"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { apiBaseUrl } from '@/apis';
import { showToast } from '@/utils/toastManager';
import Button from '@/components/shared/buttons/Button';
import { User, Mail, Phone, Calendar, Book, Globe, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import LoadingIndicator from '@/components/shared/loaders/LoadingIndicator';
import { DataTable } from '@/components/shared/tables/DataTable';

interface StudentFormData {
  full_name: string;
  email: string;
  phone_numbers: {
    country: string;
    number: string;
  }[];
  date_of_birth?: string;
  gender?: string;
  language?: string;
  education_level?: string;
  status?: string;
}

interface Student {
  _id: string;
  full_name: string;
  email: string;
  phone_numbers?: { country: string; number: string }[];
  status?: string;
  created_at?: string;
  updated_at?: string;
  meta?: {
    date_of_birth?: string;
    gender?: string;
    language?: string;
    education_level?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

const schema = yup.object().shape({
  full_name: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone_numbers: yup.array().of(
    yup.object().shape({
      country: yup.string().required('Country code is required'),
      number: yup.string().required('Phone number is required')
    })
  ).required('At least one phone number is required'),
  date_of_birth: yup.string().optional(),
  gender: yup.string().optional(),
  language: yup.string().optional(),
  education_level: yup.string().optional(),
  status: yup.string().optional()
});

const EditStudent: React.FC<{ studentId: string | null }> = ({ studentId }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState<boolean>(false);
  
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<StudentFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      full_name: '',
      email: '',
      phone_numbers: [{ country: 'IN', number: '' }],
    }
  });

  // Fetch student data if we have an ID
  useEffect(() => {
    if (studentId) {
      fetchStudent(studentId);
    } else {
      fetchAllStudents();
    }
  }, [studentId]);

  // Filter students based on search term
  useEffect(() => {
    if (allStudents.length > 0 && searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      const filtered = allStudents.filter(
        student => 
          student.full_name?.toLowerCase().includes(searchTermLower) ||
          student.email?.toLowerCase().includes(searchTermLower)
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(allStudents);
    }
  }, [searchTerm, allStudents]);

  const fetchStudent = async (id: string) => {
    setIsLoading(true);
    setFetchError(null);
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setFetchError("Authentication token not found. Please login again.");
        setIsLoading(false);
        return;
      }
      
      const response = await axios.get(`${apiBaseUrl}/auth/get?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.data) {
        const studentData = response.data.data;
        setStudent(studentData);
        
        // Populate the form with student data
        setValue('full_name', studentData.full_name);
        setValue('email', studentData.email);
        
        // Handle phone numbers
        if (studentData.phone_numbers && studentData.phone_numbers.length > 0) {
          setValue('phone_numbers', studentData.phone_numbers);
        }
        
        // Handle meta data
        if (studentData.meta) {
          setValue('date_of_birth', studentData.meta.date_of_birth);
          setValue('gender', studentData.meta.gender);
          setValue('language', studentData.meta.language);
          setValue('education_level', studentData.meta.education_level);
        }
        
        // Status
        setValue('status', studentData.status);
      } else {
        setFetchError("Failed to fetch student data");
      }
    } catch (error: any) {
      console.error('Error fetching student:', error);
      setFetchError(error.response?.data?.message || "Failed to fetch student data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllStudents = async () => {
    setIsLoadingStudents(true);
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        showToast.error("Authentication token not found. Please login again.");
        setIsLoadingStudents(false);
        return;
      }
      
      const response = await axios.get(`${apiBaseUrl}/auth/get-all-students`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.data && response.data.data.students) {
        setAllStudents(response.data.data.students);
        setFilteredStudents(response.data.data.students);
      } else {
        showToast.error("Failed to fetch students");
      }
    } catch (error: any) {
      console.error('Error fetching students:', error);
      showToast.error(error.response?.data?.message || "Failed to fetch students");
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const onSubmit = async (data: StudentFormData) => {
    if (!student || !student._id) {
      showToast.error("Student ID is missing");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Get token from local storage
      const token = localStorage.getItem("token");
      
      if (!token) {
        showToast.error("Authentication token not found. Please login again.");
        setIsSubmitting(false);
        return;
      }

      // Prepare data for API
      const studentData = {
        id: student._id,
        full_name: data.full_name,
        email: data.email,
        phone_numbers: data.phone_numbers,
        status: data.status || student.status || 'active',
        meta: {
          ...(student.meta || {}),
          date_of_birth: data.date_of_birth,
          gender: data.gender,
          language: data.language,
          education_level: data.education_level
        }
      };
      
      // Call API to update student
      const response = await axios.put(`${apiBaseUrl}/auth/update-by-email`, studentData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.success) {
        showToast.success('Student updated successfully!');
        setSubmitSuccess(true);
      } else {
        showToast.error(response.data?.message || 'Failed to update student');
      }
    } catch (error: any) {
      console.error('Error updating student:', error);
      showToast.error(error.response?.data?.message || 'Failed to update student. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStudentSelect = (studentData: Student) => {
    router.push(`/dashboards/admin/edit-student?id=${studentData._id}`);
  };

  // Define columns for student selection table
  const columns = [
    {
      header: "Name",
      accessorKey: "full_name",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            {row.original.full_name ? row.original.full_name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <p className="font-medium">{row.original.full_name}</p>
            <p className="text-sm text-gray-500">{row.original.email}</p>
          </div>
        </div>
      )
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }: any) => (
        <div>
          <span 
            className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
              row.original.status === "active" 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
            }`}
          >
            {row.original.status === "active" ? "Active" : "Inactive"}
          </span>
        </div>
      )
    },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: ({ row }: any) => (
        <div>
          {row.original.phone_numbers && row.original.phone_numbers.length > 0 
            ? `${row.original.phone_numbers[0].country} ${row.original.phone_numbers[0].number}`
            : "N/A"}
        </div>
      )
    },
    {
      header: "Actions",
      cell: ({ row }: any) => (
        <Button 
          variant="primary" 
          size="sm" 
          onClick={() => handleStudentSelect(row.original)}
        >
          Edit
        </Button>
      )
    }
  ];

  // Country codes
  const countryCodes = [
    { code: 'IN', name: 'India (+91)' },
    { code: 'US', name: 'United States (+1)' },
    { code: 'GB', name: 'United Kingdom (+44)' },
    { code: 'CA', name: 'Canada (+1)' },
    { code: 'AU', name: 'Australia (+61)' },
    { code: 'SG', name: 'Singapore (+65)' },
    { code: 'AE', name: 'UAE (+971)' },
    { code: 'SA', name: 'Saudi Arabia (+966)' }
  ];

  // If we don't have a student ID, show the student selection interface
  if (!studentId) {
    return (
      <div className="space-y-6">
        {/* Search and filters */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-2.5"
            placeholder="Search students by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setSearchTerm("")}
            >
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        
        {/* Students table */}
        {isLoadingStudents ? (
          <div className="flex justify-center py-10">
            <LoadingIndicator type="spinner" size="lg" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredStudents}
            initialState={{
              pagination: {
                pageSize: 10
              }
            }}
            onRowClick={(row) => handleStudentSelect(row as Student)}
          />
        )}
        
        {/* Actions */}
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboards/admin/students')}
          >
            Back to Students List
          </Button>
        </div>
      </div>
    );
  }

  // If we're showing the edit form
  return (
    <div className="max-w-3xl mx-auto">
      {isLoading ? (
        <div className="flex justify-center py-10">
          <LoadingIndicator type="spinner" size="lg" />
        </div>
      ) : fetchError ? (
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-red-700 dark:text-red-400 mb-2">Error</h3>
          <p className="text-red-600 dark:text-red-300">{fetchError}</p>
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboards/admin/edit-student')}
            >
              Back to Student Selection
            </Button>
          </div>
        </div>
      ) : submitSuccess ? (
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-lg font-medium text-green-700 dark:text-green-400 mb-2">
            Student updated successfully!
          </h3>
          <div className="flex justify-center space-x-4 mt-4">
            <Button 
              onClick={() => {
                setSubmitSuccess(false);
                fetchStudent(studentId);
              }}
              variant="primary"
            >
              Continue Editing
            </Button>
            <Button 
              onClick={() => router.push('/dashboards/admin/students')}
              variant="outline"
            >
              View All Students
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h2>
              <div className="text-sm text-gray-500">
                ID: {student?._id}
              </div>
            </div>
            
            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  {...register('full_name')}
                  className={`pl-10 block w-full rounded-md py-2 px-3 border ${
                    errors.full_name ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-primary focus:border-primary`}
                  placeholder="Enter full name"
                />
              </div>
              {errors.full_name && (
                <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
              )}
            </div>
            
            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  {...register('email')}
                  className={`pl-10 block w-full rounded-md py-2 px-3 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-primary focus:border-primary`}
                  placeholder="Enter email address"
                  disabled // Email cannot be changed
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            {/* Phone */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="w-1/3">
                  <select
                    {...register('phone_numbers.0.country')}
                    className={`block w-full rounded-md py-2 px-3 border ${
                      errors.phone_numbers?.[0]?.country ? 'border-red-300' : 'border-gray-300'
                    } focus:outline-none focus:ring-primary focus:border-primary`}
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-2/3 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...register('phone_numbers.0.number')}
                    className={`pl-10 block w-full rounded-md py-2 px-3 border ${
                      errors.phone_numbers?.[0]?.number ? 'border-red-300' : 'border-gray-300'
                    } focus:outline-none focus:ring-primary focus:border-primary`}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              {(errors.phone_numbers?.[0]?.country || errors.phone_numbers?.[0]?.number) && (
                <p className="mt-1 text-sm text-red-600">Phone number is required</p>
              )}
            </div>
            
            {/* Status */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                {...register('status')}
                className="block w-full rounded-md py-2 px-3 border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          {/* Additional Information */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Additional Information</h2>
            
            {/* Date of Birth */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date of Birth
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  {...register('date_of_birth')}
                  className="pl-10 block w-full rounded-md py-2 px-3 border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            
            {/* Gender */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gender
              </label>
              <select
                {...register('gender')}
                className="block w-full rounded-md py-2 px-3 border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
            
            {/* Language */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Preferred Language
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  {...register('language')}
                  className="pl-10 block w-full rounded-md py-2 px-3 border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="">Select Language</option>
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                  <option value="chinese">Chinese</option>
                  <option value="japanese">Japanese</option>
                  <option value="arabic">Arabic</option>
                </select>
              </div>
            </div>
            
            {/* Education Level */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Education Level
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Book className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  {...register('education_level')}
                  className="pl-10 block w-full rounded-md py-2 px-3 border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="">Select Education Level</option>
                  <option value="high_school">High School</option>
                  <option value="diploma">Diploma</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                  <option value="doctorate">Doctorate</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating Student...' : 'Update Student'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditStudent; 