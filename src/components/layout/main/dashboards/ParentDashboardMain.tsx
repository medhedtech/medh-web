import React from 'react';
import { Calendar, Clock, Award, Book, MessageCircle, CreditCard, AlertCircle, BarChart2, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface ChildData {
  name: string;
  grade: string;
  recentPerformance: string;
  attendancePercentage: number;
  upcomingClass: {
    subject: string;
    time: string;
    date: string;
  }
}

interface ParentDashboardMainProps {
  children?: React.ReactNode;
}

const ParentDashboardMain: React.FC<ParentDashboardMainProps> = () => {
  // Mock data - in real implementation this would come from API/props
  const childData: ChildData = {
    name: "Alex Smith",
    grade: "Grade 7",
    recentPerformance: "Excellent",
    attendancePercentage: 92,
    upcomingClass: {
      subject: "Mathematics",
      time: "10:00 AM",
      date: "Monday, Nov 7"
    }
  };

  // Quick access items for parents
  const quickAccess = [
    { 
      title: 'Class Schedule', 
      icon: <Calendar className="w-5 h-5" />, 
      link: '/dashboards/parent-timetable', 
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    { 
      title: 'Grades & Assignments', 
      icon: <Award className="w-5 h-5" />, 
      link: '/dashboards/parent-grades', 
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    { 
      title: 'View Attendance', 
      icon: <CheckCircle className="w-5 h-5" />, 
      link: '/dashboards/parent-attendance', 
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    { 
      title: 'Message Instructors', 
      icon: <MessageCircle className="w-5 h-5" />, 
      link: '/dashboards/parent-message-instructors', 
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      textColor: 'text-amber-600 dark:text-amber-400'
    },
    { 
      title: 'Make Payments', 
      icon: <CreditCard className="w-5 h-5" />, 
      link: '/dashboards/parent-make-payments', 
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-600 dark:text-red-400'
    },
    { 
      title: 'Report Concern', 
      icon: <AlertCircle className="w-5 h-5" />, 
      link: '/dashboards/parent-raise-concerns', 
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
      textColor: 'text-teal-600 dark:text-teal-400'
    }
  ];

  // Mock announcements
  const announcements = [
    {
      title: 'Parent-Teacher Meeting',
      date: 'November 15',
      description: 'Scheduled parent-teacher meetings to discuss student progress.'
    },
    {
      title: 'End of Term Exams',
      date: 'December 10-15',
      description: 'Final assessments for this term will begin next month.'
    },
    {
      title: 'Holiday Break',
      date: 'December 22 - January 5',
      description: 'School will be closed for the winter holidays.'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Welcome to Parent Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor your child's academic progress and school activities
        </p>
      </div>

      {/* Child's Upcoming Class Card */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl shadow-sm p-6 mb-6 border border-blue-100 dark:border-blue-800/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-1 text-gray-800 dark:text-white">
              {childData.name}'s Upcoming Class
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {childData.grade} • {childData.upcomingClass.subject}
            </p>
            <div className="flex items-center text-blue-600 dark:text-blue-400 mb-2">
              <Clock className="w-4 h-4 mr-2" />
              <span>{childData.upcomingClass.time} • {childData.upcomingClass.date}</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col items-center">
            <div className="flex space-x-2 mb-2">
              <div className="flex items-center bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-sm">
                <div className={`w-2 h-2 ${childData.attendancePercentage > 90 ? 'bg-green-500' : 'bg-amber-500'} rounded-full mr-2`}></div>
                <span className="text-sm font-medium">
                  {childData.attendancePercentage}% Attendance
                </span>
              </div>
              <div className="flex items-center bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium">
                  {childData.recentPerformance}
                </span>
              </div>
            </div>
            <Link href="/dashboards/parent-track-performance" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
              <BarChart2 className="w-3.5 h-3.5 mr-1" />
              View detailed performance
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Quick Access</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {quickAccess.map((item, index) => (
          <Link
            href={item.link}
            key={index}
            className={`${item.bgColor} rounded-xl p-4 flex flex-col items-center justify-center text-center transition-transform hover:scale-105 hover:shadow-md`}
          >
            <div className={`${item.textColor} mb-2`}>
              {item.icon}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {item.title}
            </span>
          </Link>
        ))}
      </div>

      {/* Announcements & Recent Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Announcements */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
            <Book className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            School Announcements
          </h2>
          <div className="space-y-4">
            {announcements.map((announcement, index) => (
              <div key={index} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0 pb-4 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">{announcement.title}</h3>
                  <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                    {announcement.date}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {announcement.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/dashboards/parent-announcements" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all announcements →
            </Link>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
            <BarChart2 className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
            Recent Academic Activities
          </h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-9 w-9 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                <Award className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Science Quiz Completed</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Alex scored 92% on the Biology test</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Yesterday</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                <Book className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">English Assignment Submitted</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Literary analysis essay completed</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">2 days ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-9 w-9 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-3">
                <CheckCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Math Assignment Graded</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Algebra homework received an A grade</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">3 days ago</p>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Link href="/dashboards/parent-performance-updates" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all activities →
            </Link>
          </div>
        </div>
      </div>

      {/* Need Assistance Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-800/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
              Need Assistance?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0 max-w-xl">
              Contact our support team for any queries related to your child's education or account management.
            </p>
          </div>
          <div className="flex space-x-3">
            <Link href="/dashboards/parent-submit-feedback" className="px-4 py-2 bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 rounded-lg border border-purple-200 dark:border-purple-800/30 shadow-sm hover:bg-purple-50 dark:hover:bg-gray-600 transition-colors">
              Submit Feedback
            </Link>
            <Link href="/dashboards/parent-raise-concerns" className="px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg shadow-sm hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboardMain; 