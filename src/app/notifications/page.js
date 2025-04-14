"use client";

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Filter, 
  Search, 
  Check, 
  X, 
  Trash2, 
  Clock,
  MoreVertical,
  Mail,
  AlertCircle,
  Info,
  User,
  GraduationCap,
  CreditCard,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';
import Image from 'next/image';
import Link from 'next/link';

// Demo Images
import profileNotifImage from "@/assets/images/dashbord/profile.png";
import lockNotifImage from "@/assets/images/dashbord/lock.png";
import verifyNotifImage from "@/assets/images/dashbord/verify.png";
import successNotifImage from "@/assets/images/dashbord/success.png";
import videoNotifImage from "@/assets/images/dashbord/video.png";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data - This would be replaced with an actual API call
  useEffect(() => {
    const mockNotifications = [
      {
        id: '1',
        type: 'profile',
        title: 'Your profile has been updated',
        message: 'Your latest resume and profile information has been successfully updated.',
        timestamp: new Date().toISOString(),
        read: false,
        image: profileNotifImage,
      },
      {
        id: '2',
        type: 'security',
        title: 'Password has been changed',
        message: 'Your account password was changed 3 times in the last month.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: true,
        image: lockNotifImage,
      },
      {
        id: '3',
        type: 'application',
        title: 'Job application submitted',
        message: 'You have successfully applied for the Developer position.',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: false,
        image: verifyNotifImage,
      },
      {
        id: '4',
        type: 'course',
        title: 'New course available',
        message: 'A new course "Advanced React Development" is now available.',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        read: false,
        image: successNotifImage,
      },
      {
        id: '5',
        type: 'content',
        title: 'New video content added',
        message: 'New video lessons have been added to your "Data Science" course.',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        read: true,
        image: videoNotifImage,
      },
      {
        id: '6',
        type: 'event',
        title: 'Upcoming webinar: AI in Healthcare',
        message: 'Don\'t miss our live webinar on AI applications in healthcare, starting tomorrow at 3 PM.',
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        read: false,
        image: successNotifImage,
      },
      {
        id: '7',
        type: 'course',
        title: 'Course completion certificate',
        message: 'Congratulations! Your certificate for "Python Basics" is ready for download.',
        timestamp: new Date(Date.now() - 345600000).toISOString(),
        read: true,
        image: verifyNotifImage,
      }
    ];

    setNotifications(mockNotifications);
    setFilteredNotifications(mockNotifications);
    setLoading(false);
  }, []);

  // Filter notifications based on search query and selected filters
  useEffect(() => {
    let filtered = notifications;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(notification => 
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(notification => 
        selectedTypes.includes(notification.type)
      );
    }

    setFilteredNotifications(filtered);
  }, [searchQuery, selectedTypes, notifications]);

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'profile':
        return <User className="w-5 h-5 text-blue-500" />;
      case 'security':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'application':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'course':
        return <GraduationCap className="w-5 h-5 text-purple-500" />;
      case 'content':
        return <MessageSquare className="w-5 h-5 text-pink-500" />;
      case 'event':
        return <Calendar className="w-5 h-5 text-indigo-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    }
  };

  return (
    <PageWrapper >
      <div className="bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-950 py-24 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
              Notifications
            </h1>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800/30 transition-colors"
              >
                <Check className="w-4 h-4 mr-2" />
                Mark all as read
              </button>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-colors"
              />
            </div>

            {showFilters && (
              <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Filter by type</h3>
                <div className="flex flex-wrap gap-2">
                  {['profile', 'security', 'application', 'course', 'content', 'event'].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedTypes(prev =>
                          prev.includes(type)
                            ? prev.filter(t => t !== type)
                            : [...prev, type]
                        );
                      }}
                      className={`px-3 py-1 text-sm rounded-full capitalize transition-colors ${
                        selectedTypes.includes(type)
                          ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <Mail className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No notifications</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  {searchQuery || selectedTypes.length > 0 
                    ? "No notifications match your current filters."
                    : "You don't have any notifications at the moment."}
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {filteredNotifications.map((notification, index) => (
                  <div 
                    key={notification.id}
                    className={`relative flex p-4 sm:p-6 
                      ${!notification.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''} 
                      ${index !== filteredNotifications.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}
                      hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors`}
                  >
                    {/* Indicator for unread */}
                    {!notification.read && (
                      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-1 h-12 bg-primary-500 rounded-r-full"></div>
                    )}

                    {/* Notification icon/image */}
                    <div className="flex-shrink-0 mr-4">
                      <Image 
                        src={notification.image}
                        alt=""
                        width={50}
                        height={50}
                        className="rounded-full h-12 w-12 object-cover"
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className={`text-base sm:text-lg font-semibold
                          ${!notification.read 
                            ? 'text-gray-900 dark:text-white' 
                            : 'text-gray-700 dark:text-gray-300'}`}
                        >
                          {notification.title}
                        </h4>
                        <div className="flex items-center ml-4 flex-shrink-0">
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTimestamp(notification.timestamp)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {notification.message}
                      </p>
                      
                      {/* Actions */}
                      <div className="mt-2 flex gap-3">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="text-xs text-gray-500 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default NotificationsPage; 