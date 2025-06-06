"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Grid3X3,
  List,
  Clock,
  Users,
  Video,
  MapPin,
  Search,
  Download,
  Settings,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface ScheduledClass {
  id: string;
  title: string;
  course: string;
  date: string;
  time: string;
  duration: string;
  enrolledStudents: number;
  maxStudents: number;
  platform: string;
  meetingLink: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  isRecurring: boolean;
  color: string;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const scheduledClasses: ScheduledClass[] = [
    {
      id: '1',
      title: 'Quantum Computing Lab',
      course: 'Quantum Computing Fundamentals',
      date: '2024-01-29',
      time: '14:00',
      duration: '2 hours',
      enrolledStudents: 18,
      maxStudents: 20,
      platform: 'zoom',
      meetingLink: 'https://zoom.us/j/123456789',
      status: 'scheduled',
      isRecurring: true,
      color: 'bg-blue-500'
    },
    {
      id: '2',
      title: 'Physics Problem Session',
      course: 'Advanced Physics',
      date: '2024-01-29',
      time: '16:00',
      duration: '1.5 hours',
      enrolledStudents: 22,
      maxStudents: 25,
      platform: 'teams',
      meetingLink: 'https://teams.microsoft.com/l/meetup-join/19%3a...',
      status: 'scheduled',
      isRecurring: true,
      color: 'bg-green-500'
    },
    {
      id: '3',
      title: 'Data Science Workshop',
      course: 'Data Science Introduction',
      date: '2024-01-30',
      time: '10:00',
      duration: '3 hours',
      enrolledStudents: 15,
      maxStudents: 20,
      platform: 'zoom',
      meetingLink: 'https://zoom.us/j/987654321',
      status: 'scheduled',
      isRecurring: false,
      color: 'bg-purple-500'
    },
    {
      id: '4',
      title: 'Office Hours',
      course: 'General',
      date: '2024-01-30',
      time: '14:00',
      duration: '1 hour',
      enrolledStudents: 5,
      maxStudents: 10,
      platform: 'meet',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      status: 'scheduled',
      isRecurring: true,
      color: 'bg-yellow-500'
    },
    {
      id: '5',
      title: 'Math Review',
      course: 'Mathematics Review',
      date: '2024-01-31',
      time: '11:00',
      duration: '1 hour',
      enrolledStudents: 12,
      maxStudents: 15,
      platform: 'zoom',
      meetingLink: 'https://zoom.us/j/456789123',
      status: 'scheduled',
      isRecurring: false,
      color: 'bg-red-500'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'in-progress':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getClassesForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return scheduledClasses.filter(cls => cls.date === dateString);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const filteredClasses = scheduledClasses.filter(cls => {
    const matchesFilter = filter === 'all' || cls.status === filter;
    const matchesSearch = cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.course.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    const currentMonth = currentDate.getMonth();

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Calendar Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="grid grid-cols-7 gap-1">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-700 dark:text-gray-300 py-2">
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const isCurrentMonth = day.getMonth() === currentMonth;
              const isToday = day.toDateString() === new Date().toDateString();
              const classesForDay = getClassesForDate(day);

              return (
                <div
                  key={index}
                  className={`min-h-24 p-2 border border-gray-100 dark:border-gray-700 rounded-lg ${
                    isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'
                  } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                  } ${isToday ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                    {day.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {classesForDay.slice(0, 3).map(cls => (
                      <div
                        key={cls.id}
                        className={`text-xs p-1 rounded text-white truncate cursor-pointer hover:opacity-80 ${cls.color}`}
                        title={`${cls.title} - ${cls.time}`}
                      >
                        {cls.time} {cls.title}
                      </div>
                    ))}
                    {classesForDay.length > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        +{classesForDay.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    // Get week start (Sunday) for current date
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      weekDays.push(day);
    }

    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Week Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="grid grid-cols-8 gap-4">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Time</div>
            {weekDays.map((day, index) => {
              const isToday = day.toDateString() === new Date().toDateString();
              return (
                <div key={index} className="text-center">
                  <div className={`text-sm font-medium ${
                    isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {dayNames[day.getDay()]}
                  </div>
                  <div className={`text-lg font-bold ${
                    isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                  }`}>
                    {day.getDate()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Week Grid */}
        <div className="p-4">
          <div className="grid grid-cols-8 gap-4">
            <div className="space-y-12">
              {hours.map(hour => (
                <div key={hour} className="text-sm text-gray-500 dark:text-gray-400 h-12 flex items-center">
                  {hour}:00
                </div>
              ))}
            </div>
            
            {weekDays.map((day, dayIndex) => {
              const classesForDay = getClassesForDate(day);
              return (
                <div key={dayIndex} className="space-y-12">
                  {hours.map(hour => {
                    const hourClasses = classesForDay.filter(cls => {
                      const classHour = parseInt(cls.time.split(':')[0]);
                      return classHour === hour;
                    });

                    return (
                      <div key={hour} className="h-12 border-t border-gray-100 dark:border-gray-700 relative">
                        {hourClasses.map(cls => (
                          <div
                            key={cls.id}
                            className={`absolute inset-x-0 top-0 p-1 rounded text-white text-xs cursor-pointer hover:opacity-80 ${cls.color}`}
                            style={{ height: '48px' }}
                            title={`${cls.title} - ${cls.time} (${cls.duration})`}
                          >
                            <div className="font-medium truncate">{cls.title}</div>
                            <div className="text-xs opacity-90">{cls.time}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderListView = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Upcoming Classes ({filteredClasses.length})
        </h2>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredClasses.map(cls => (
          <div key={cls.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-3 h-3 rounded-full ${cls.color}`} />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {cls.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(cls.status)}`}>
                    {cls.status.charAt(0).toUpperCase() + cls.status.slice(1)}
                  </span>
                  {cls.isRecurring && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 rounded-full">
                      Recurring
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-3">{cls.course}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(cls.date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{cls.time} ({cls.duration})</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{cls.enrolledStudents}/{cls.maxStudents} students</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Video className="h-4 w-4 mr-2" />
                    <span className="capitalize">{cls.platform}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
                
                <button className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                
                <button className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

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
                Calendar View
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Visual calendar for your scheduled classes
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Link
                href="/dashboards/instructor/schedule/create"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Schedule Class
              </Link>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Date Navigation */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white min-w-48 text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Today
              </button>
            </div>

            {/* View Controls */}
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

              <select
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-3 py-2 text-sm ${
                    viewMode === 'month'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } transition-colors`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-2 text-sm ${
                    viewMode === 'week'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } transition-colors`}
                >
                  <Calendar className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('day')}
                  className={`px-3 py-2 text-sm ${
                    viewMode === 'day'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } transition-colors`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              <button className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Content */}
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'day' && renderListView()}
      </div>
    </div>
  );
} 