"use client";

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Filter, 
  Search, 
  Check, 
  X, 
  Trash2, 
  Archive,
  MoreVertical,
  Mail,
  AlertCircle,
  Info
} from 'lucide-react';
import { format } from 'date-fns';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: 'system' | 'user' | 'course' | 'payment';
  priority: 'low' | 'medium' | 'high';
}

const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data - Replace with actual API call
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'info',
        title: 'New Course Published',
        message: 'Course "Advanced Web Development" has been published successfully.',
        timestamp: new Date().toISOString(),
        read: false,
        category: 'course',
        priority: 'medium'
      },
      {
        id: '2',
        type: 'warning',
        title: 'Low Storage Space',
        message: 'Server storage space is running low. Please take action.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: true,
        category: 'system',
        priority: 'high'
      },
      {
        id: '3',
        type: 'success',
        title: 'Payment Processed',
        message: 'Payment for Course ID: 12345 has been processed successfully.',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: false,
        category: 'payment',
        priority: 'low'
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

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(notification => 
        selectedCategories.includes(notification.category)
      );
    }

    // Apply priority filter
    if (selectedPriorities.length > 0) {
      filtered = filtered.filter(notification => 
        selectedPriorities.includes(notification.priority)
      );
    }

    setFilteredNotifications(filtered);
  }, [searchQuery, selectedCategories, selectedPriorities, notifications]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'success':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'error':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Notifications
        </h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {['system', 'user', 'course', 'payment'].map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategories(prev =>
                        prev.includes(category)
                          ? prev.filter(c => c !== category)
                          : [...prev, category]
                      );
                    }}
                    className={`px-3 py-1 text-sm rounded-full ${
                      selectedCategories.includes(category)
                        ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</h3>
              <div className="flex flex-wrap gap-2">
                {['low', 'medium', 'high'].map((priority) => (
                  <button
                    key={priority}
                    onClick={() => {
                      setSelectedPriorities(prev =>
                        prev.includes(priority)
                          ? prev.filter(p => p !== priority)
                          : [...prev, priority]
                      );
                    }}
                    className={`px-3 py-1 text-sm rounded-full ${
                      selectedPriorities.includes(priority)
                        ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No notifications</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              No notifications match your current filters.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 bg-white rounded-lg shadow-sm border ${
                notification.read
                  ? 'border-gray-200 dark:border-gray-700'
                  : 'border-primary-200 dark:border-primary-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getNotificationIcon(notification.type)}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {notification.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {notification.message}
                    </p>
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {format(new Date(notification.timestamp), 'MMM d, yyyy h:mm a')}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(notification.priority)}`}>
                        {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminNotifications; 