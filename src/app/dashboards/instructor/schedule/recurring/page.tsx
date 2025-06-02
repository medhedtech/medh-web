"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar,
  Clock,
  Repeat,
  Edit,
  Trash2,
  Play,
  Pause,
  Settings,
  Users,
  Plus,
  Filter,
  Search,
  CheckCircle,
  AlertCircle,
  MoreVertical
} from 'lucide-react';

interface RecurringClass {
  id: string;
  title: string;
  course: string;
  pattern: 'daily' | 'weekly' | 'monthly';
  interval: number;
  startDate: string;
  endDate: string;
  time: string;
  duration: string;
  maxStudents: number;
  enrolledStudents: number;
  status: 'active' | 'paused' | 'completed';
  nextSession: string;
  totalSessions: number;
  completedSessions: number;
  platform: string;
}

export default function RecurringSchedulePage() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const recurringClasses: RecurringClass[] = [
    {
      id: '1',
      title: 'Quantum Computing Weekly Lab',
      course: 'Quantum Computing Fundamentals',
      pattern: 'weekly',
      interval: 1,
      startDate: '2024-01-15',
      endDate: '2024-04-15',
      time: '14:00',
      duration: '2 hours',
      maxStudents: 20,
      enrolledStudents: 18,
      status: 'active',
      nextSession: '2024-01-29',
      totalSessions: 12,
      completedSessions: 3,
      platform: 'zoom'
    },
    {
      id: '2',
      title: 'Physics Problem Solving',
      course: 'Advanced Physics',
      pattern: 'weekly',
      interval: 2,
      startDate: '2024-01-10',
      endDate: '2024-05-10',
      time: '16:00',
      duration: '1.5 hours',
      maxStudents: 25,
      enrolledStudents: 22,
      status: 'active',
      nextSession: '2024-01-31',
      totalSessions: 8,
      completedSessions: 2,
      platform: 'teams'
    },
    {
      id: '3',
      title: 'Math Review Sessions',
      course: 'Mathematics Review',
      pattern: 'daily',
      interval: 1,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      time: '10:00',
      duration: '1 hour',
      maxStudents: 30,
      enrolledStudents: 15,
      status: 'completed',
      nextSession: '',
      totalSessions: 20,
      completedSessions: 20,
      platform: 'meet'
    },
    {
      id: '4',
      title: 'Data Science Office Hours',
      course: 'Data Science Introduction',
      pattern: 'weekly',
      interval: 1,
      startDate: '2024-01-08',
      endDate: '2024-03-08',
      time: '11:00',
      duration: '1 hour',
      maxStudents: 15,
      enrolledStudents: 12,
      status: 'paused',
      nextSession: '2024-02-01',
      totalSessions: 8,
      completedSessions: 4,
      platform: 'zoom'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getPatternText = (pattern: string, interval: number) => {
    if (interval === 1) {
      return pattern.charAt(0).toUpperCase() + pattern.slice(1);
    }
    return `Every ${interval} ${pattern === 'daily' ? 'days' : pattern === 'weekly' ? 'weeks' : 'months'}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getProgressPercentage = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const filteredClasses = recurringClasses.filter(cls => {
    const matchesFilter = filter === 'all' || cls.status === filter;
    const matchesSearch = cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.course.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboards/instructor/schedule" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Schedule
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Recurring Classes
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Manage your recurring class schedules and patterns
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Link
                href="/dashboards/instructor/schedule/create"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Recurring Class
              </Link>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search classes..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Repeat className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Recurring</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{recurringClasses.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Play className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {recurringClasses.filter(c => c.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Pause className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Paused</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {recurringClasses.filter(c => c.status === 'paused').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {recurringClasses.filter(c => c.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recurring Classes List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recurring Classes ({filteredClasses.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredClasses.map((recurringClass) => (
              <div key={recurringClass.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {recurringClass.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(recurringClass.status)}`}>
                        {recurringClass.status.charAt(0).toUpperCase() + recurringClass.status.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{recurringClass.course}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Pattern</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {getPatternText(recurringClass.pattern, recurringClass.interval)}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Time</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {recurringClass.time} ({recurringClass.duration})
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Next Session</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatDate(recurringClass.nextSession)}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Enrollment</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {recurringClass.enrolledStudents}/{recurringClass.maxStudents}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Progress</p>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${getProgressPercentage(recurringClass.completedSessions, recurringClass.totalSessions)}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-900 dark:text-white">
                            {recurringClass.completedSessions}/{recurringClass.totalSessions}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {recurringClass.status === 'active' && (
                      <button className="p-2 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 rounded-lg transition-colors">
                        <Pause className="h-4 w-4" />
                      </button>
                    )}
                    
                    {recurringClass.status === 'paused' && (
                      <button className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                        <Play className="h-4 w-4" />
                      </button>
                    )}
                    
                    <button className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    
                    <button className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Settings className="h-4 w-4" />
                    </button>
                    
                    <div className="relative">
                      <button className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredClasses.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No recurring classes found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first recurring class to get started'}
            </p>
            <Link
              href="/dashboards/instructor/schedule/create"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Recurring Class
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 