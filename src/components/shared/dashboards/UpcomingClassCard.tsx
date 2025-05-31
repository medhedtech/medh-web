"use client";

import React from 'react';
import {
  Calendar,
  Clock,
  Video,
  Users,
  CalendarClock,
  Play,
  Eye,
  BookOpen,
  Timer,
  CheckCircle,
  XCircle
} from 'lucide-react';
import moment from 'moment';

// TypeScript interfaces
interface IUpcomingClass {
  id: number;
  title: string;
  course: string;
  instructor: string;
  date: string;
  time: string;
  duration: number; // in minutes
  status: "upcoming" | "live" | "ended" | "cancelled";
  meetLink: string;
  description: string;
  participants: number;
  maxParticipants: number;
  courseImage: string;
  type: "Live Session" | "Workshop" | "Webinar" | "Lab Session";
}

interface IUpcomingClassCardProps {
  classItem: IUpcomingClass;
  onViewDetails?: (classItem: IUpcomingClass) => void;
  onJoinClass?: (classItem: IUpcomingClass) => void;
  onViewRecording?: (classItem: IUpcomingClass) => void;
}

/**
 * UpcomingClassCard - A reusable card component for displaying upcoming class information
 */
const UpcomingClassCard: React.FC<IUpcomingClassCardProps> = ({ 
  classItem,
  onViewDetails,
  onJoinClass,
  onViewRecording
}) => {
  // Get status color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "upcoming":
        return {
          color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
          icon: <Clock className="w-4 h-4" />,
          label: "Upcoming"
        };
      case "live":
        return {
          color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
          icon: <Play className="w-4 h-4" />,
          label: "Live"
        };
      case "ended":
        return {
          color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
          icon: <CheckCircle className="w-4 h-4" />,
          label: "Ended"
        };
      case "cancelled":
        return {
          color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
          icon: <XCircle className="w-4 h-4" />,
          label: "Cancelled"
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
          icon: <Calendar className="w-4 h-4" />,
          label: "Unknown"
        };
    }
  };

  // Get type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Live Session":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "Workshop":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "Webinar":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Lab Session":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  // Get time until class or status
  const getTimeInfo = (classItem: IUpcomingClass) => {
    const classDateTime = moment(`${classItem.date} ${classItem.time}`, "YYYY-MM-DD HH:mm");
    const now = moment();
    
    if (classItem.status === "live") {
      return { text: "Live Now", color: "text-red-600 dark:text-red-400" };
    }
    
    if (classItem.status === "ended") {
      return { text: "Ended", color: "text-gray-500 dark:text-gray-500" };
    }
    
    const diffMinutes = classDateTime.diff(now, "minutes");
    
    if (diffMinutes < 0) {
      return { text: "Started", color: "text-gray-500 dark:text-gray-500" };
    }
    
    if (diffMinutes < 60) {
      return { text: `Starts in ${diffMinutes}m`, color: "text-amber-600 dark:text-amber-400" };
    }
    
    const diffHours = Math.floor(diffMinutes / 60);
    const remainingMinutes = diffMinutes % 60;
    
    if (diffHours < 24) {
      return { text: `Starts in ${diffHours}h ${remainingMinutes}m`, color: "text-blue-600 dark:text-blue-400" };
    }
    
    const diffDays = Math.floor(diffHours / 24);
    return { text: `Starts in ${diffDays} day${diffDays > 1 ? 's' : ''}`, color: "text-gray-600 dark:text-gray-400" };
  };

  const statusInfo = getStatusInfo(classItem.status);
  const timeInfo = getTimeInfo(classItem);
  const isLive = classItem.status === "live";
  const isUpcoming = classItem.status === "upcoming";

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(classItem);
    }
  };

  const handleJoinClass = () => {
    if (onJoinClass) {
      onJoinClass(classItem);
    }
  };

  const handleViewRecording = () => {
    if (onViewRecording) {
      onViewRecording(classItem);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border ${isLive ? 'border-red-200 dark:border-red-800' : 'border-gray-200 dark:border-gray-700'} hover:shadow-lg transition-all duration-300`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
              {statusInfo.icon}
              <span className="ml-1">{statusInfo.label}</span>
              {isLive && (
                <span className="relative flex h-2 w-2 ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(classItem.type)}`}>
              {classItem.type}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {classItem.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {classItem.course} • {classItem.instructor}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
            {classItem.description}
          </p>
        </div>
      </div>

      {/* Class Info */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          {moment(classItem.date).format("MMM D, YYYY")}
        </div>
        <div className="flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {classItem.time}
        </div>
        <div className="flex items-center">
          <Timer className="w-3 h-3 mr-1" />
          {classItem.duration} minutes
        </div>
        <div className="flex items-center">
          <Users className="w-3 h-3 mr-1" />
          {classItem.participants}/{classItem.maxParticipants}
        </div>
      </div>

      {/* Time Info */}
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
        <div className="flex items-center">
          <CalendarClock className="w-4 h-4 text-gray-400 mr-2" />
          <span className={`text-sm font-medium ${timeInfo.color}`}>
            {timeInfo.text}
          </span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {moment(classItem.date).format("ddd")}
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button 
          onClick={handleViewDetails}
          className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </button>
        {isLive && (
          <button 
            onClick={handleJoinClass}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            <Video className="w-4 h-4 mr-2" />
            Join Live
          </button>
        )}
        {isUpcoming && (
          <button 
            onClick={handleJoinClass}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
          >
            <Video className="w-4 h-4 mr-2" />
            Join Class
          </button>
        )}
        {classItem.status === "ended" && (
          <button 
            onClick={handleViewRecording}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Recording
          </button>
        )}
      </div>
    </div>
  );
};

export { UpcomingClassCard };
export type { IUpcomingClass, IUpcomingClassCardProps }; 