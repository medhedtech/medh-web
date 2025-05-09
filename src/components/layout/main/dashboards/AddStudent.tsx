"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { apiBaseUrl } from '@/apis';
import { toast } from 'react-toastify';
import Button from '@/components/shared/buttons/Button';
import { User, Mail, Phone, Calendar, Book, Globe, Lock } from 'lucide-react';

interface StudentFormData {
  full_name: string;
  email: string;
  phone_numbers: {
    country: string;
    number: string;
  }[];
  password: string;
  confirm_password: string;
  date_of_birth?: string;
  gender?: string;
  language?: string;
  education_level?: string;
  agree_terms: boolean;
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
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirm_password: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  date_of_birth: yup.string().nullable(),
  gender: yup.string().nullable(),
  language: yup.string().nullable(),
  education_level: yup.string().nullable(),
  agree_terms: yup.boolean().oneOf([true], 'You must accept the terms and conditions').required(),
});

const AddStudent: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<StudentFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      full_name: '',
      email: '',
      phone_numbers: [{ country: 'IN', number: '' }],
      password: '',
      confirm_password: '',
      agree_terms: false
    }
  });

  const onSubmit = async (data: StudentFormData) => {
    try {
      setIsSubmitting(true);
      
      // Get token from local storage
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        setIsSubmitting(false);
        return;
      }

      // Prepare data for API
      const studentData = {
        full_name: data.full_name,
        email: data.email,
        phone_numbers: data.phone_numbers,
        password: data.password,
        role: ["student"],
        meta: {
          date_of_birth: data.date_of_birth,
          gender: data.gender,
          language: data.language,
          education_level: data.education_level
        },
        agree_terms: data.agree_terms
      };
      
      // Call API to create student
      const response = await axios.post(`${apiBaseUrl}/auth/register`, studentData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.success) {
        toast.success('Student added successfully!');
        setSubmitSuccess(true);
        reset(); // Reset form
      } else {
        toast.error(response.data?.message || 'Failed to add student');
      }
    } catch (error: any) {
      console.error('Error adding student:', error);
      toast.error(error.response?.data?.message || 'Failed to add student. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="max-w-3xl mx-auto">
      {submitSuccess ? (
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-lg font-medium text-green-700 dark:text-green-400 mb-2">
            Student added successfully!
          </h3>
          <p className="text-green-600 dark:text-green-300 mb-4">
            The student can now log in using the provided email and password.
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={() => setSubmitSuccess(false)}
              variant="primary"
            >
              Add Another Student
            </Button>
            <Button 
              onClick={() => window.location.href = '/dashboards/admin/students'}
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
            <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Basic Information</h2>
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
          </div>
          
          {/* Account Information */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Account Information</h2>
            
            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  {...register('password')}
                  className={`pl-10 block w-full rounded-md py-2 px-3 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-primary focus:border-primary`}
                  placeholder="Enter password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            
            {/* Confirm Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  {...register('confirm_password')}
                  className={`pl-10 block w-full rounded-md py-2 px-3 border ${
                    errors.confirm_password ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-primary focus:border-primary`}
                  placeholder="Confirm password"
                />
              </div>
              {errors.confirm_password && (
                <p className="mt-1 text-sm text-red-600">{errors.confirm_password.message}</p>
              )}
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
          
          {/* Terms and Conditions */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agree_terms"
                  type="checkbox"
                  {...register('agree_terms')}
                  className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="agree_terms" className="text-sm text-gray-700 dark:text-gray-300">
                  I agree to the <a href="#" className="text-primary hover:underline">Terms and Conditions</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </label>
                {errors.agree_terms && (
                  <p className="mt-1 text-sm text-red-600">{errors.agree_terms.message}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.location.href = '/dashboards/admin/students'}
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
              {isSubmitting ? 'Adding Student...' : 'Add Student'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddStudent; 