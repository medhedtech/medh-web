"use client";
import React from "react";
import { Bell, BookOpen, Calendar } from "lucide-react";

// Define announcement types
export type AnnouncementType = 'course' | 'event' | 'system';

// Define the announcement interface
export interface Announcement {
  title: string;
  date: string;
  content: string;
  type: AnnouncementType;
  onClick?: () => void;
}

interface AnnouncementCardProps {
  announcement: Announcement;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement }) => {
  // Determine background color based on type
  const getBgColor = (type: AnnouncementType): string => {
    switch (type) {
      case 'course':
        return 'bg-blue-100 dark:bg-blue-900/20';
      case 'event':
        return 'bg-green-100 dark:bg-green-900/20';
      default:
        return 'bg-gray-100 dark:bg-gray-700/50';
    }
  };

  // Determine icon based on type
  const getIcon = (type: AnnouncementType) => {
    switch (type) {
      case 'course':
        return <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  return (
    <div 
      className="p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
      onClick={announcement.onClick}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${getBgColor(announcement.type)}`}>
          {getIcon(announcement.type)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium text-gray-900 dark:text-white text-sm">{announcement.title}</h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">{announcement.date}</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">{announcement.content}</p>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard; 