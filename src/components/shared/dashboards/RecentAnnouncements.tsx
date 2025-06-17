/**
 * RecentAnnouncements Component
 * 
 * Handles displaying recent announcements with comprehensive empty state management.
 * 
 * API Response Handling:
 * - When API returns empty announcements array: Shows contextual empty state
 * - Logs warning for debugging when no announcements found
 * - Shows appropriate messaging based on filters (unread-only, type-specific, etc.)
 * - Provides refresh functionality for empty states
 * 
 * Example API Response (empty):
 * {
 *   "success": true,
 *   "message": "Recent announcements retrieved successfully",
 *   "data": {
 *     "announcements": [],
 *     "pagination": { "currentPage": 1, "totalPages": 0, "totalCount": 0, ... }
 *   }
 * }
 */

"use client";
import React, { useEffect, useState } from "react";
import { Bell, ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { 
  getRecentAnnouncements,
  markAnnouncementAsRead,
  getUnreadAnnouncementsCount,
  formatAnnouncementDate,
  getPriorityColorClass,
  getTypeIconClass,
  IAnnouncement,
  TAnnouncementType,
  TTargetAudience,
  TAnnouncementPriority
} from "@/apis/announcements";
import { toast } from "sonner";

interface RecentAnnouncementsProps {
  limit?: number;
  showViewAll?: boolean;
  onViewAllClick?: () => void;
  filterByType?: TAnnouncementType;
  targetAudience?: TTargetAudience;
  showUnreadOnly?: boolean;
  userRole?: string;
  enableMarkAsRead?: boolean;
}

const RecentAnnouncements: React.FC<RecentAnnouncementsProps> = ({
  limit = 5,
  showViewAll = true,
  onViewAllClick,
  filterByType,
  targetAudience = 'all',
  showUnreadOnly = false,
  userRole = 'student',
  enableMarkAsRead = true
}) => {
  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [visibleAnnouncements, setVisibleAnnouncements] = useState<IAnnouncement[]>([]);

  // Animation variants for list items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Fetch announcements data
  const fetchAnnouncements = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = {
        limit: showUnreadOnly ? undefined : limit,
        targetAudience,
        type: filterByType,
        status: 'published' as const,
        sortBy: 'createdAt' as const,
        sortOrder: 'desc' as const
      };

      const response = await getRecentAnnouncements(params);
      
      if (response && response.status === 'success' && response.data) {
        // Handle nested data structure from API client
        const apiData = (response.data as any).data || response.data;
        
        // Ensure announcements is always an array - handle different API response structures
        let fetchedAnnouncements = [];
        
        if (Array.isArray(apiData.announcements)) {
          fetchedAnnouncements = apiData.announcements;
        } else if (Array.isArray(apiData)) {
          fetchedAnnouncements = apiData;
        } else {
          console.warn('Unexpected API response structure:', response);
          fetchedAnnouncements = [];
        }
        
        // Log warning if no announcements found
        if (fetchedAnnouncements.length === 0) {
          console.warn('📢 Announcements API returned empty data:', {
            message: response.message,
            totalCount: apiData.pagination?.totalCount || 0,
            filters: { filterByType, targetAudience, showUnreadOnly },
            timestamp: new Date().toISOString()
          });
          
          // Show toast for debugging/admin awareness (optional - can be removed in production)
          if (userRole === 'admin' && !showUnreadOnly) {
            toast.info('No announcements found in the system', {
              description: 'The announcements API is working but returned no data.',
              duration: 3000
            });
          }
        }
        
        // Filter unread if needed
        if (showUnreadOnly) {
          fetchedAnnouncements = fetchedAnnouncements.filter(ann => !ann.isRead);
        }
        
        // Ensure we always have valid arrays
        const validAnnouncements = Array.isArray(fetchedAnnouncements) ? fetchedAnnouncements : [];
        setAnnouncements(validAnnouncements);
        setVisibleAnnouncements(validAnnouncements.slice(0, limit));
      } else {
        throw new Error(response.error || 'Failed to fetch announcements');
      }
      
      // Fetch unread count
      try {
        const unreadResponse = await getUnreadAnnouncementsCount();
        if (unreadResponse.status === 'success' && unreadResponse.data) {
          setUnreadCount(unreadResponse.data.count);
        }
      } catch (unreadError) {
        console.warn('Failed to fetch unread count:', unreadError);
      }
      
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError(err instanceof Error ? err.message : "Failed to load announcements");
      
      // Ensure arrays are reset to empty on error to prevent undefined errors
      setAnnouncements([]);
      setVisibleAnnouncements([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [limit, filterByType, targetAudience, showUnreadOnly]);

  // Handle marking announcement as read
  const handleMarkAsRead = async (announcementId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!enableMarkAsRead) return;
    
    try {
      const response = await markAnnouncementAsRead(announcementId);
      
      if (response.status === 'success') {
        // Update local state
        setAnnouncements(prev => 
          prev.map(ann => 
            ann._id === announcementId 
              ? { ...ann, isRead: true }
              : ann
          )
        );
        
        setVisibleAnnouncements(prev => 
          prev.map(ann => 
            ann._id === announcementId 
              ? { ...ann, isRead: true }
              : ann
          )
        );
        
        // Update unread count
        setUnreadCount(prev => Math.max(0, prev - 1));
        
        toast.success('Announcement marked as read');
      } else {
        throw new Error(response.error || 'Failed to mark as read');
      }
    } catch (error) {
      console.error('Error marking announcement as read:', error);
      toast.error('Failed to mark announcement as read');
    }
  };

  // Handle announcement click
  const handleAnnouncementClick = (announcement: IAnnouncement) => {
    console.log(`Announcement ${announcement._id} clicked`);
    
    // Auto-mark as read if enabled and not already read
    if (enableMarkAsRead && !announcement.isRead) {
      markAnnouncementAsRead(announcement._id).then(() => {
        setAnnouncements(prev => 
          prev.map(ann => 
            ann._id === announcement._id 
              ? { ...ann, isRead: true }
              : ann
          )
        );
        setVisibleAnnouncements(prev => 
          prev.map(ann => 
            ann._id === announcement._id 
              ? { ...ann, isRead: true }
              : ann
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
        toast.success('Announcement marked as read');
      }).catch(error => {
        console.error('Error auto-marking as read:', error);
      });
    }
    
    // Navigate if action button exists
    if (announcement.actionButton && announcement.actionButton.url) {
      if (announcement.actionButton.type === 'external' || announcement.actionButton.type === 'link') {
        window.open(announcement.actionButton.url, '_blank', 'noopener,noreferrer');
      } else {
        // For internal links, you might want to use Next.js router
        window.location.href = announcement.actionButton.url;
      }
    } else {
      // If no action button, show announcement details in a toast or modal
      toast.info(announcement.title, {
        description: announcement.content.length > 100 
          ? announcement.content.substring(0, 100) + '...' 
          : announcement.content,
        duration: 5000
      });
    }
  };

  const handleViewAll = () => {
    if (onViewAllClick) {
      onViewAllClick();
    } else {
      console.log("View all announcements clicked");
      const safeAnnouncements = Array.isArray(announcements) ? announcements : [];
      setVisibleAnnouncements(safeAnnouncements);
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: TAnnouncementPriority) => {
    if (priority === 'low') return null;
    
    const priorityConfig = {
      urgent: { 
        bg: 'bg-red-100 dark:bg-red-900/30', 
        text: 'text-red-700 dark:text-red-300',
        icon: '🚨'
      },
      high: { 
        bg: 'bg-orange-100 dark:bg-orange-900/30', 
        text: 'text-orange-700 dark:text-orange-300',
        icon: '⚡'
      },
      medium: { 
        bg: 'bg-yellow-100 dark:bg-yellow-900/30', 
        text: 'text-yellow-700 dark:text-yellow-300',
        icon: '📌'
      }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig];
    if (!config) return null;
    
    const priorityText = priority.charAt(0).toUpperCase() + priority.slice(1);
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${config.bg} ${config.text} border-current/20`}>
        <span>{config.icon}</span>
        {priorityText}
      </span>
    );
  };

  // Get type icon
  const getTypeIcon = (type: TAnnouncementType) => {
    switch (type) {
      case 'course':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'system':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'event':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'maintenance':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'feature':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h5v-5H4v5zM13 13h5l-5 5v-5zM4 13h5V8H4v5zM13 7h5l-5 5V7zM4 7h5V2H4v5z" />
          </svg>
        );
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/20">
              <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Announcements</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
          <span className="ml-2 text-gray-600 dark:text-gray-300">Loading announcements...</span>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/20">
              <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Announcements</h2>
          </div>
        </div>
        
        <div className="text-center py-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
          <p className="text-red-500 dark:text-red-400 mb-2">{error}</p>
          <button 
            onClick={fetchAnnouncements}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Render empty state with enhanced messaging
  if (!Array.isArray(visibleAnnouncements) || visibleAnnouncements.length === 0) {
    const getEmptyStateMessage = () => {
      if (showUnreadOnly) {
        return {
          title: 'All caught up!',
          message: 'You have no unread announcements.',
          subtitle: 'Check back later for new updates.',
          icon: 'success'
        };
      }
      
      if (filterByType) {
        return {
          title: 'No announcements found',
          message: `No ${filterByType} announcements available at this time.`,
          subtitle: 'Try checking a different category or come back later.',
          icon: 'info'
        };
      }
      
      return {
        title: 'Stay tuned!',
        message: 'No announcements available at this time.',
        subtitle: 'We\'ll notify you when there are important updates.',
        icon: 'info'
      };
    };

    const emptyState = getEmptyStateMessage();
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/20">
              <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Announcements</h2>
          </div>
        </div>
        
        <div className="text-center py-8 px-4">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            emptyState.icon === 'success' 
              ? 'bg-green-100 dark:bg-green-900/20' 
              : 'bg-blue-100 dark:bg-blue-900/20'
          }`}>
            {emptyState.icon === 'success' ? (
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <Bell className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {emptyState.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-1 max-w-sm mx-auto">
            {emptyState.message}
          </p>
          
          <p className="text-sm text-gray-500 dark:text-gray-500 max-w-sm mx-auto">
            {emptyState.subtitle}
          </p>
          
          {/* Show refresh button if not unread-only filter */}
          {!showUnreadOnly && (
            <button 
              onClick={fetchAnnouncements}
              className="mt-4 px-4 py-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 border border-primary-200 dark:border-primary-700 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors"
            >
              Refresh announcements
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/20">
            <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Announcements</h2>
          {unreadCount > 0 && (
            <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        
        {showViewAll && Array.isArray(announcements) && announcements.length > limit && (
          <button 
            onClick={handleViewAll}
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        )}
      </div>
      
            <div className="space-y-3">
        {Array.isArray(visibleAnnouncements) && visibleAnnouncements.map((announcement, idx) => (
          <motion.div
            key={announcement._id}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: idx * 0.05 }}
            className={`group relative rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md ${
              announcement.isRead 
                ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                : 'border-primary-200 dark:border-primary-600 bg-primary-50/30 dark:bg-primary-900/10 hover:border-primary-300 dark:hover:border-primary-500'
            } ${
              announcement.isSticky ? 'ring-1 ring-amber-400 dark:ring-amber-500' : ''
            }`}
            onClick={() => handleAnnouncementClick(announcement)}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                {/* Type icon - more compact */}
                <div className={`p-2 rounded-lg flex-shrink-0 ${
                  announcement.type === 'course' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' :
                  announcement.type === 'system' ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400' :
                  announcement.type === 'event' ? 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400' :
                  'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {getTypeIcon(announcement.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* Header - more compact */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold text-base leading-tight mb-1 ${
                        announcement.isRead 
                          ? 'text-gray-700 dark:text-gray-300' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {announcement.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatAnnouncementDate(announcement.createdAt)}</span>
                        {announcement.author && (
                          <>
                            <span>•</span>
                            <span>{announcement.author.full_name}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {/* Sticky indicator - compact */}
                      {announcement.isSticky && (
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      )}
                      
                      {/* Priority badge - compact */}
                      {announcement.priority !== 'low' && (
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          announcement.priority === 'urgent' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                          announcement.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                          'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                        }`}>
                          {announcement.priority === 'urgent' ? '🚨' : announcement.priority === 'high' ? '⚡' : '📌'}
                        </span>
                      )}
                      
                      {/* Read/Unread status */}
                      <div className={`w-2 h-2 rounded-full ${announcement.isRead ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                      
                      {/* Mark as read button - compact */}
                      {enableMarkAsRead && (
                        <button
                          onClick={(e) => handleMarkAsRead(announcement._id, e)}
                          className={`p-1 rounded transition-colors ${
                            announcement.isRead
                              ? 'text-gray-400 hover:text-gray-600'
                              : 'text-primary-500 hover:text-primary-700'
                          }`}
                          title={announcement.isRead ? 'Mark as unread' : 'Mark as read'}
                        >
                          {announcement.isRead ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Content - more compact */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3 line-clamp-2">
                    {announcement.content}
                  </p>
                  
                  {/* Bottom row - compact info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="capitalize">{announcement.type}</span>
                      <span>•</span>
                      <span>{announcement.viewCount} views</span>
                      {announcement.tags && announcement.tags.length > 0 && (
                        <>
                          <span>•</span>
                          <span>{announcement.tags.length} tags</span>
                        </>
                      )}
                    </div>
                    
                    {/* Action indicator */}
                    {announcement.actionButton && announcement.actionButton.text && (
                      <div className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400">
                        <span>Action available</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentAnnouncements; 