"use client";

import React, { useState, useEffect } from "react";
import ProtectedPage from "@/app/protectedRoutes";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import { useParams } from "next/navigation";
import { IStudent } from "@/types/student.types";
import { Loader2, UserRound, Mail, Phone, Calendar, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

/**
 * AdminStudentDetailPage - Displays detailed information about a student for admin users
 */
const AdminStudentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<IStudent | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch student data on component mount
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        // Fetch student details
        const response = await fetch(`/api/students/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch student: ${response.status}`);
        }
        const data = await response.json();
        setStudent(data.data);

        // Fetch enrolled courses for this student
        const coursesResponse = await fetch(`/api/enrolled/student/${id}`);
        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json();
          setEnrolledCourses(coursesData.enrollments || []);
        }
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError("Failed to load student information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudentData();
    }
  }, [id]);

  if (loading) {
    return (
      <ProtectedPage>
        
          <HeadingDashboard />
          <div className="p-8 flex justify-center items-center min-h-[400px]">
            <div className="flex flex-col items-center">
              <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Loading student information...</p>
            </div>
          </div>
        
      </ProtectedPage>
    );
  }

  if (error || !student) {
    return (
      <ProtectedPage>
        
          <HeadingDashboard />
          <div className="p-8 flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {error || "Student not found"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                We couldn't find the student information you're looking for.
              </p>
              <Link
                href="/dashboards/admin-studentmange"
                className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Student Management
              </Link>
            </div>
          </div>
        
      </ProtectedPage>
    );
  }

  return (
    <ProtectedPage>
      
        <HeadingDashboard />
        <div className="p-6">
          {/* Back button */}
          <div className="mb-6">
            <Link
              href="/dashboards/admin-studentmange"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Student Management
            </Link>
          </div>

          {/* Student Profile Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Student Profile</h2>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                student.status === 'Active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {student.status}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Avatar */}
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 text-4xl font-semibold mb-3">
                    {student.profile_image ? (
                      <img 
                        src={student.profile_image} 
                        alt={student.full_name} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <UserRound className="w-12 h-12" />
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{student.full_name}</h3>
                    <div className="flex items-center mt-1">
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        student.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{student.status}</span>
                    </div>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <p className="text-gray-800 dark:text-gray-200">{student.email}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <p className="text-gray-800 dark:text-gray-200">
                          {student.phone_number || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Joined On</p>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <p className="text-gray-800 dark:text-gray-200">
                          {new Date(student.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Student ID</p>
                      <p className="text-gray-800 dark:text-gray-200">{student._id}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Role</p>
                      <div className="flex flex-wrap gap-2">
                        {student.role?.map((role, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          >
                            {role.replace("-", " ")}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Location</p>
                      <p className="text-gray-800 dark:text-gray-200">
                        {student.city && student.country
                          ? `${student.city}, ${student.country}`
                          : "Location not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Profile Info */}
              {(student.bio || student.education || student.skills?.length > 0) && (
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  {student.bio && (
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-800 dark:text-white mb-2">Bio</h4>
                      <p className="text-gray-600 dark:text-gray-300">{student.bio}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {student.education && (
                      <div>
                        <h4 className="text-md font-medium text-gray-800 dark:text-white mb-2">Education</h4>
                        <p className="text-gray-600 dark:text-gray-300">{student.education}</p>
                      </div>
                    )}

                    {student.skills && student.skills.length > 0 && (
                      <div>
                        <h4 className="text-md font-medium text-gray-800 dark:text-white mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {student.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enrolled Courses */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Enrolled Courses</h2>
            </div>
            
            <div className="p-4">
              {enrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {enrolledCourses.map((course, index) => (
                    <div 
                      key={index} 
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 rounded-md bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{course.course.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Enrolled: {new Date(course.enrollment_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  This student is not enrolled in any courses.
                </div>
              )}
            </div>
          </div>

          {/* Student Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Actions</h2>
            </div>
            
            <div className="p-6 flex flex-wrap gap-4">
              <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                Edit Student
              </button>
              <button className={`px-4 py-2 rounded border transition-colors ${
                student.status === 'Active'
                  ? 'border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                  : 'border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
              }`}>
                {student.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                Enroll in Course
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                View Progress
              </button>
            </div>
          </div>
        </div>
      
    </ProtectedPage>
  );
};

export default AdminStudentDetailPage; 