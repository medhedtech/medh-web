"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StudentProgress } from '@/apis/instructor.api';
import { 
  LucideX,
  LucideUser,
  LucideBarChart3,
  LucideMessageCircle,
  LucideClock,
  LucideTarget,
  LucideAward,
  LucideCalendar,
  LucideTrendingUp,
  LucideTrendingDown,
  LucideCheckCircle,
  LucideAlertCircle,
  LucideBook,
  LucideFileText,
  LucideUsers,
  LucideHelpCircle,
  LucideEdit3,
  LucideSend
} from 'lucide-react';

interface StudentProgressComponentProps {
  student: StudentProgress;
  onClose: () => void;
}

interface TabType {
  id: string;
  label: string;
  icon: React.ElementType;
}

const tabs: TabType[] = [
  { id: 'overview', label: 'Overview', icon: LucideBarChart3 },
  { id: 'performance', label: 'Performance', icon: LucideTarget },
  { id: 'engagement', label: 'Engagement', icon: LucideUsers },
  { id: 'timeline', label: 'Timeline', icon: LucideClock }
];

// Progress Bar Component
const ProgressBar: React.FC<{ 
  progress: number; 
  className?: string; 
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}> = ({ progress, className = '', showPercentage = true, size = 'md', label }) => {
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className={`${className}`}>
      {label && (
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-300">{label}</span>
          {showPercentage && (
            <span className="font-medium text-gray-900 dark:text-white">{Math.round(progress)}%</span>
          )}
        </div>
      )}
      <div className={`bg-gray-200 dark:bg-gray-700 rounded-full ${sizeClasses[size]}`}>
        <motion.div
          className={`${sizeClasses[size]} rounded-full ${getProgressColor(progress)}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab: React.FC<{ student: StudentProgress }> = ({ student }) => {
  const getPerformanceLevel = (progress: number) => {
    if (progress >= 80) return { label: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/20' };
    if (progress >= 60) return { label: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/20' };
    if (progress >= 40) return { label: 'Average', color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' };
    return { label: 'Needs Help', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/20' };
  };

  const performance = getPerformanceLevel(student.overallProgress);

  return (
    <div className="space-y-6">
      {/* Performance Summary */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Summary</h3>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${performance.color} ${performance.bgColor}`}>
            {performance.label}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ProgressBar 
              progress={student.overallProgress} 
              label="Overall Progress" 
              size="lg"
            />
          </div>
          <div>
            <ProgressBar 
              progress={student.courseProgress.completion_percentage} 
              label="Course Completion" 
              size="lg"
            />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <LucideBook className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white">Course Progress</h4>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {student.courseProgress.completed_lessons}/{student.courseProgress.total_lessons}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Lessons Completed</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <LucideCheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white">Attendance</h4>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {student.performanceMetrics.attendance_rate}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Class Attendance</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <LucideMessageCircle className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white">Engagement</h4>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {student.engagementMetrics.forum_posts + student.engagementMetrics.questions_asked}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Total Interactions</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
            <LucideSend className="w-4 h-4" />
            Send Message
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
            <LucideEdit3 className="w-4 h-4" />
            Add Note
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">
            <LucideCalendar className="w-4 h-4" />
            Schedule Meeting
          </button>
        </div>
      </div>
    </div>
  );
};

// Performance Tab Component
const PerformanceTab: React.FC<{ student: StudentProgress }> = ({ student }) => {
  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">Quiz Performance</h4>
          <ProgressBar 
            progress={student.performanceMetrics.quiz_average} 
            label="Average Score" 
            size="lg"
          />
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Best Score</span>
              <span className="font-medium text-green-600">95%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Lowest Score</span>
              <span className="font-medium text-red-600">45%</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">Assignment Performance</h4>
          <ProgressBar 
            progress={student.performanceMetrics.assignment_average} 
            label="Average Score" 
            size="lg"
          />
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Submitted</span>
              <span className="font-medium text-gray-900 dark:text-white">8/10</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">On Time</span>
              <span className="font-medium text-green-600">7/8</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">Attendance Rate</h4>
          <ProgressBar 
            progress={student.performanceMetrics.attendance_rate} 
            label="Overall Attendance" 
            size="lg"
          />
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Classes Attended</span>
              <span className="font-medium text-gray-900 dark:text-white">24/30</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Late Arrivals</span>
              <span className="font-medium text-yellow-600">3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Trends */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Strengths</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <LucideCheckCircle className="w-4 h-4" />
                <span>Consistent quiz performance</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <LucideCheckCircle className="w-4 h-4" />
                <span>High engagement in discussions</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <LucideCheckCircle className="w-4 h-4" />
                <span>Timely assignment submissions</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Areas for Improvement</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-yellow-600">
                <LucideAlertCircle className="w-4 h-4" />
                <span>Assignment quality could be better</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-yellow-600">
                <LucideAlertCircle className="w-4 h-4" />
                <span>Occasional late arrivals</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Engagement Tab Component
const EngagementTab: React.FC<{ student: StudentProgress }> = ({ student }) => {
  return (
    <div className="space-y-6">
      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <LucideMessageCircle className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white">Forum Posts</h4>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {student.engagementMetrics.forum_posts}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Total Posts</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <LucideHelpCircle className="w-5 h-5 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white">Questions Asked</h4>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {student.engagementMetrics.questions_asked}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Total Questions</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <LucideUsers className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white">Peer Interactions</h4>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {student.engagementMetrics.peer_interactions}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Total Interactions</p>
        </div>
      </div>

      {/* Engagement Level */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Engagement Level</h3>
        <div className="space-y-4">
          <ProgressBar 
            progress={(student.engagementMetrics.forum_posts / 20) * 100} 
            label="Forum Participation" 
          />
          <ProgressBar 
            progress={(student.engagementMetrics.questions_asked / 15) * 100} 
            label="Question Activity" 
          />
          <ProgressBar 
            progress={(student.engagementMetrics.peer_interactions / 25) * 100} 
            label="Peer Collaboration" 
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <LucideMessageCircle className="w-4 h-4 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm text-gray-900 dark:text-white">Posted in "Data Structures Discussion"</p>
              <p className="text-xs text-gray-600 dark:text-gray-300">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <LucideHelpCircle className="w-4 h-4 text-green-500 mt-0.5" />
            <div>
              <p className="text-sm text-gray-900 dark:text-white">Asked about "Binary Tree Implementation"</p>
              <p className="text-xs text-gray-600 dark:text-gray-300">1 day ago</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <LucideUsers className="w-4 h-4 text-purple-500 mt-0.5" />
            <div>
              <p className="text-sm text-gray-900 dark:text-white">Helped peer with algorithm problem</p>
              <p className="text-xs text-gray-600 dark:text-gray-300">2 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Timeline Tab Component
const TimelineTab: React.FC<{ student: StudentProgress }> = ({ student }) => {
  const timelineEvents = [
    { date: '2024-01-15', event: 'Course enrollment', type: 'enrollment' },
    { date: '2024-01-20', event: 'First quiz completed (85%)', type: 'assessment' },
    { date: '2024-01-25', event: 'Assignment 1 submitted', type: 'assignment' },
    { date: '2024-02-01', event: 'Midterm exam (78%)', type: 'assessment' },
    { date: '2024-02-10', event: 'Project milestone 1 completed', type: 'project' },
    { date: '2024-02-15', event: 'Peer collaboration session', type: 'collaboration' }
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'enrollment': return LucideCheckCircle;
      case 'assessment': return LucideTarget;
      case 'assignment': return LucideFileText;
      case 'project': return LucideAward;
      case 'collaboration': return LucideUsers;
      default: return LucideCalendar;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'enrollment': return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      case 'assessment': return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20';
      case 'assignment': return 'text-purple-500 bg-purple-100 dark:bg-purple-900/20';
      case 'project': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
      case 'collaboration': return 'text-pink-500 bg-pink-100 dark:bg-pink-900/20';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Learning Timeline</h3>
        <div className="space-y-4">
          {timelineEvents.map((event, index) => {
            const Icon = getEventIcon(event.type);
            const colorClass = getEventColor(event.type);
            
            return (
              <div key={index} className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{event.event}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">{event.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const StudentProgressComponent: React.FC<StudentProgressComponentProps> = ({ student, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab student={student} />;
      case 'performance':
        return <PerformanceTab student={student} />;
      case 'engagement':
        return <EngagementTab student={student} />;
      case 'timeline':
        return <TimelineTab student={student} />;
      default:
        return <OverviewTab student={student} />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <LucideUser className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Student {student.studentId}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Overall Progress: {Math.round(student.overallProgress)}%
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <LucideX className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
            {renderTabContent()}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StudentProgressComponent; 