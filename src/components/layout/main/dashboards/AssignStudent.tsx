"use client";
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { apiBaseUrl } from '@/apis';
import { showToast } from '@/utils/toastManager';
import Button from '@/components/shared/buttons/Button';
import LoadingIndicator from '@/components/shared/loaders/LoadingIndicator';
import { ChevronDown, User, BookOpen, CalendarDays, Users, Search, X, ClipboardList, PenLine } from 'lucide-react';

interface StudentFormData {
  students: string[];
  course_id: string;
  batch_id?: string;
  assignment_date: string;
  notes?: string;
}

const schema = yup.object().shape({
  students: yup.array().of(yup.string()).min(1, 'Please select at least one student'),
  course_id: yup.string().required('Please select a course'),
  batch_id: yup.string().optional(),
  assignment_date: yup.string().required('Assignment date is required'),
  notes: yup.string().optional()
});

const AssignStudent: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset
  } = useForm<StudentFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      students: [],
      course_id: '',
      batch_id: '',
      assignment_date: new Date().toISOString().split('T')[0],
      notes: ''
    }
  });

  const onSubmit = async (data: StudentFormData) => {
    showToast.info("Feature coming soon");
    console.log(data);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-blue-700 flex items-center mb-2">
          <CalendarDays className="mr-2 h-5 w-5" />
          Coming Soon
        </h2>
        <p className="text-blue-600">
          This feature is currently under development. You'll be able to assign students to courses and batches here.
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Select Students
          </h2>
          
          {/* Students Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Students <span className="text-red-500">*</span>
            </label>
            <select
              className="block w-full rounded-md p-2 border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary"
              {...register('students')}
              multiple
            >
              <option value="placeholder" disabled>Select students...</option>
            </select>
            {errors.students && (
              <p className="mt-1 text-sm text-red-600">{errors.students.message}</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Course Information
          </h2>
          
          {/* Course Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Course <span className="text-red-500">*</span>
            </label>
            <select
              className="block w-full rounded-md p-2 border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary"
              {...register('course_id')}
            >
              <option value="" disabled selected>Select a course...</option>
            </select>
            {errors.course_id && (
              <p className="mt-1 text-sm text-red-600">{errors.course_id.message}</p>
            )}
          </div>
          
          {/* Batch Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Batch (Optional)
            </label>
            <select
              className="block w-full rounded-md p-2 border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary"
              {...register('batch_id')}
            >
              <option value="" disabled selected>Select a batch...</option>
            </select>
          </div>
          
          {/* Date Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Assignment Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register('assignment_date')}
              className="block w-full rounded-md p-2 border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary"
            />
            {errors.assignment_date && (
              <p className="mt-1 text-sm text-red-600">{errors.assignment_date.message}</p>
            )}
          </div>
          
          {/* Notes Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes (Optional)
            </label>
            <textarea
              rows={3}
              {...register('notes')}
              className="block w-full rounded-md p-2 border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Add any notes about this assignment..."
            ></textarea>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.location.href = '/dashboards/admin/students'}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
          >
            Assign Students
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AssignStudent; 