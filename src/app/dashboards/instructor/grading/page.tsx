"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Award,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Download,
  Filter,
  Star,
  FileText,
  User,
  Calendar
} from 'lucide-react';

interface Assignment {
  id: string;
  studentName: string;
  studentAvatar?: string;
  title: string;
  course: string;
  type: 'assignment' | 'quiz' | 'project';
  submittedAt: string;
  dueDate: string;
  status: 'pending' | 'graded' | 'late' | 'feedback_given';
  score?: number;
  maxScore: number;
  difficulty: 'easy' | 'medium' | 'hard';
  hasAttachment: boolean;
}

export default function GradingPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'graded' | 'late'>('pending');
  const [selectedType, setSelectedType] = useState<'all' | 'assignment' | 'quiz' | 'project'>('all');

  // Mock data for assignments
  const assignments: Assignment[] = [
    {
      id: '1',
      studentName: 'Alice Johnson',
      studentAvatar: 'https://i.pravatar.cc/150?img=1',
      title: 'Quantum Algorithm Implementation',
      course: 'Quantum Computing',
      type: 'assignment',
      submittedAt: '2025-06-02T14:30:00Z',
      dueDate: '2025-06-02T23:59:00Z',
      status: 'pending',
      maxScore: 100,
      difficulty: 'hard',
      hasAttachment: true
    },
    {
      id: '2',
      studentName: 'Bob Smith',
      studentAvatar: 'https://i.pravatar.cc/150?img=2',
      title: 'Mid-term Quiz',
      course: 'Advanced Physics',
      type: 'quiz',
      submittedAt: '2025-06-01T16:45:00Z',
      dueDate: '2025-06-01T18:00:00Z',
      status: 'graded',
      score: 87,
      maxScore: 100,
      difficulty: 'medium',
      hasAttachment: false
    },
    {
      id: '3',
      studentName: 'Carol Davis',
      studentAvatar: 'https://i.pravatar.cc/150?img=3',
      title: 'Final Project Proposal',
      course: 'Computer Science',
      type: 'project',
      submittedAt: '2025-05-30T10:20:00Z',
      dueDate: '2025-05-29T23:59:00Z',
      status: 'late',
      maxScore: 50,
      difficulty: 'hard',
      hasAttachment: true
    },
    {
      id: '4',
      studentName: 'David Wilson',
      studentAvatar: 'https://i.pravatar.cc/150?img=4',
      title: 'Lab Report #3',
      course: 'Chemistry',
      type: 'assignment',
      submittedAt: '2025-06-01T09:15:00Z',
      dueDate: '2025-06-01T23:59:00Z',
      status: 'feedback_given',
      score: 92,
      maxScore: 100,
      difficulty: 'medium',
      hasAttachment: true
    }
  ];

  const filteredAssignments = assignments.filter(assignment => {
    const statusMatch = filter === 'all' || assignment.status === filter;
    const typeMatch = selectedType === 'all' || assignment.type === selectedType;
    return statusMatch && typeMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'graded': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'late': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'feedback_given': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'assignment': return <FileText className="w-4 h-4" />;
      case 'quiz': return <CheckCircle className="w-4 h-4" />;
      case 'project': return <Award className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pendingCount = assignments.filter(a => a.status === 'pending').length;
  const gradedCount = assignments.filter(a => a.status === 'graded').length;
  const lateCount = assignments.filter(a => a.status === 'late').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboards/instructor" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Grade Assignments
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Review and provide feedback on student submissions
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center gap-4">
              {/* Filters */}
              <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
                {(['all', 'pending', 'graded', 'late'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      filter === status 
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>

              {/* Type Filter */}
              <select 
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
              >
                <option value="all">All Types</option>
                <option value="assignment">Assignments</option>
                <option value="quiz">Quizzes</option>
                <option value="project">Projects</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingCount}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Review</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{gradedCount}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Graded</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{lateCount}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Late Submissions</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <Star className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">4.6</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Grade</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl border dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Student Submissions ({filteredAssignments.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Student & Assignment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Course & Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAssignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                          <img
                            src={assignment.studentAvatar || `https://i.pravatar.cc/150?img=${assignment.id}`}
                            alt={assignment.studentName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {assignment.studentName}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {assignment.title}
                          </div>
                          {assignment.hasAttachment && (
                            <div className="flex items-center mt-1">
                              <Download className="w-3 h-3 text-gray-400 mr-1" />
                              <span className="text-xs text-gray-400">Has attachment</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-blue-50 dark:bg-blue-900/30 rounded">
                          {getTypeIcon(assignment.type)}
                        </div>
                        <div>
                          <div className="text-sm text-gray-900 dark:text-white">{assignment.course}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(assignment.difficulty)}`}>
                              {assignment.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatDate(assignment.submittedAt)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Due: {formatDate(assignment.dueDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {assignment.score !== undefined ? (
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {assignment.score}/{assignment.maxScore}
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {Math.round((assignment.score / assignment.maxScore) * 100)}%
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          /{assignment.maxScore}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(assignment.status)}`}>
                        {assignment.status.replace('_', ' ').charAt(0).toUpperCase() + assignment.status.replace('_', ' ').slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="p-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Review Submission"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="Add Grade"
                        >
                          <Award className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1 text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                          title="Provide Feedback"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        {assignment.hasAttachment && (
                          <button 
                            className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                            title="Download Attachment"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/dashboards/instructor/grading/rubrics"
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                Grading Rubrics
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Create and manage grading rubrics for consistent evaluation
            </p>
          </Link>

          <Link
            href="/dashboards/instructor/grading/bulk"
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                Bulk Grading
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Grade multiple submissions at once for efficiency
            </p>
          </Link>

          <Link
            href="/dashboards/instructor/grading/analytics"
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <Star className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                Grade Analytics
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Analyze grade distributions and student performance trends
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
} 