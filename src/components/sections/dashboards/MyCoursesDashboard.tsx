"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useStudentEnrollments from '@/hooks/useStudentEnrollments';
import { IEnrollment } from '@/apis/enrollment';
import Link from 'next/link';
import Image from 'next/image';

interface MyCoursesDashboardProps {
  studentId?: string;
}

/**
 * MyCoursesDashboard - Component that displays the student's my courses page
 * within the student dashboard layout
 */
const MyCoursesDashboard: React.FC<MyCoursesDashboardProps> = ({ studentId }) => {
  const router = useRouter();
  // In a real implementation, you would get the studentId from auth context or session
  const mockStudentId = studentId || '123456789'; // This would be replaced with actual auth
  
  const { enrollments, loading, error, refetch } = useStudentEnrollments({
    studentId: mockStudentId
  });

  const [activeTab, setActiveTab] = useState<'all' | 'inProgress' | 'completed'>('all');

  const filteredEnrollments = React.useMemo(() => {
    if (activeTab === 'all') return enrollments;
    if (activeTab === 'inProgress') return enrollments.filter(e => e.status === 'in_progress');
    if (activeTab === 'completed') return enrollments.filter(e => e.status === 'completed');
    return enrollments;
  }, [enrollments, activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold text-red-600">Error Loading Courses</h2>
        <p className="text-gray-600 mt-2">{error.message}</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={() => refetch()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">My Courses</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'all' 
            ? 'border-b-2 border-blue-600 text-blue-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('all')}
        >
          All Courses
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'inProgress' 
            ? 'border-b-2 border-blue-600 text-blue-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('inProgress')}
        >
          In Progress
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'completed' 
            ? 'border-b-2 border-blue-600 text-blue-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
      </div>

      {/* Course List */}
      {filteredEnrollments.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-xl font-medium text-gray-700">No courses found</h3>
          <p className="text-gray-500 mt-2">
            {activeTab === 'all' 
              ? "You haven't enrolled in any courses yet." 
              : activeTab === 'inProgress'
                ? "You don't have any courses in progress."
                : "You haven't completed any courses yet."}
          </p>
          <Link 
            href="/courses" 
            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrollments.map((enrollment) => (
            <CourseCard 
              key={enrollment._id} 
              enrollment={enrollment} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface CourseCardProps {
  enrollment: IEnrollment;
}

const CourseCard: React.FC<CourseCardProps> = ({ enrollment }) => {
  // In a real implementation, you would fetch course details using the enrollment.course ID
  const coursePlaceholder = {
    title: `Course #${enrollment.course}`,
    image: '/images/courses/placeholder.jpg',
    instructorName: 'Instructor Name',
    totalLessons: 10,
    completedLessons: enrollment.progress?.filter(p => p.status === 'completed').length || 0
  };
  
  // Calculate progress percentage
  const progressPercentage = coursePlaceholder.totalLessons > 0
    ? (coursePlaceholder.completedLessons / coursePlaceholder.totalLessons) * 100
    : 0;

  // Format batch dates if available
  const batchInfo = typeof enrollment.batch === 'object' ? enrollment.batch : null;
  const batchDates = batchInfo ? 
    `${new Date(batchInfo.start_date).toLocaleDateString()} - ${new Date(batchInfo.end_date).toLocaleDateString()}` : 
    'Batch dates unavailable';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative h-48 bg-gray-200">
        <Image 
          src={coursePlaceholder.image}
          alt={coursePlaceholder.title}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{coursePlaceholder.title}</h3>
        <p className="text-sm text-gray-600 mb-2">Instructor: {coursePlaceholder.instructorName}</p>
        
        {/* Batch Info */}
        {batchInfo && (
          <div className="mb-3">
            <p className="text-xs text-gray-500">Batch: {batchInfo.batch_name}</p>
            <p className="text-xs text-gray-500">{batchDates}</p>
          </div>
        )}
        
        {/* Progress bar */}
        <div className="mb-2">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {coursePlaceholder.completedLessons} of {coursePlaceholder.totalLessons} lessons completed
          </p>
        </div>
        
        {/* Status badge */}
        <div className="flex justify-between items-center mt-3">
          <span className={`text-xs px-2 py-1 rounded-full ${
            enrollment.status === 'completed' ? 'bg-green-100 text-green-800' :
            enrollment.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {enrollment.status === 'completed' ? 'Completed' : 
             enrollment.status === 'in_progress' ? 'In Progress' : 'Enrolled'}
          </span>
          
          <Link 
            href={`/lessons/${enrollment.course}`} 
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyCoursesDashboard; 