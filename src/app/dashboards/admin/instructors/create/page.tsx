"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { showToast } from '@/utils/toastManager';
import { apiUrls } from "@/apis";
import { usePostQuery } from "@/hooks/postQuery.hook";

// Simplified form data for instructor creation
type InstructorFormData = {
  full_name: string;
  email: string;
  password: string;
};

// Validation schema (full_name, email, password only)
const schema = yup.object().shape({
  full_name: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
      password: yup.string().min(6, 'At least 6 characters').required('Password is required'),
});

export default function CreateInstructorPage() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const { postQuery } = usePostQuery();
  
  // Reference to track if the form was submitted successfully
  const formSubmittedSuccessfully = useRef(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<InstructorFormData>({
    resolver: yupResolver(schema),
    defaultValues: { full_name: '', email: '', password: '' }
  });

  const onSubmit = async (data: InstructorFormData) => {
    try {
      setIsSubmitting(true);
      const response = await postQuery({
        url: apiUrls.instructors?.createInstructor || '/auth/create',
        postData: {
          full_name: data.full_name,
          email: data.email,
          password: data.password
        },
        requireAuth: true,
        onSuccess: () => {
          showToast.success(`Instructor "${data.full_name}" created successfully!`);
          reset();
        },
        onFail: (error) => {
          const message = error?.response?.data?.message || 'Failed to create instructor';
          showToast.error(message);
          throw new Error(message);
        }
      });
    } catch (error) {
      console.error("Form submission error:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create instructor';
      showToast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update the base input class name used throughout the file
  const baseInputClass = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 placeholder-gray-400";
  const baseLabelClass = "block mb-2 font-medium text-gray-700";
  const baseSelectClass = `${baseInputClass} bg-white cursor-pointer`;

  const formValues = register;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/dashboards/admin" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Admin Dashboard
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
          <div className="bg-indigo-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Add New Instructor</h1>
            <p className="mt-1 text-indigo-100">
              Create a new instructor profile for the platform
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
            {/* Simplified Instructor Form */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Instructor Information</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="full_name" className={baseLabelClass}>Full Name*</label>
                  <input type="text" id="full_name" {...register('full_name')} className={baseInputClass} required />
                  {errors.full_name && <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>}
                </div>
                <div>
                  <label htmlFor="email" className={baseLabelClass}>Email*</label>
                  <input type="email" id="email" {...register('email')} className={baseInputClass} required />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>
                <div>
                  <label htmlFor="password" className={baseLabelClass}>Password*</label>
                  <input type="password" id="password" {...register('password')} className={baseInputClass} required />
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                </div>
              </div>
            </div>
            {/* Submit Button */}
            <div className="flex justify-end">
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                {isSubmitting ? 'Creating...' : 'Create Instructor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 