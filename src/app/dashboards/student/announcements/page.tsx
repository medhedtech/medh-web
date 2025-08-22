"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Bell, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Eye, 
  EyeOff, 
  BookOpen,
  AlertTriangle,
  Info,
  Star,
  Clock,
  ArrowLeft,
  RefreshCw,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  getRecentAnnouncements,
  markAnnouncementAsRead,
  getUnreadAnnouncementsCount,
  formatAnnouncementDate,
  getPriorityColorClass,
  getTypeIconClass,
  IAnnouncement,
  TAnnouncementType,
  TAnnouncementPriority,
  IAnnouncementQueryParams
} from "@/apis/announcements";
import { toast } from "sonner";
import { buildAdvancedComponent, getResponsive, getEnhancedSemanticColor } from "@/utils/designSystem";

const StudentAnnouncementsPage: React.FC = () => {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [hasPrevPage, setHasPrevPage] = useState<boolean>(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedType, setSelectedType] = useState<TAnnouncementType | "all">("all");
  const [selectedPriority, setSelectedPriority] = useState<TAnnouncementPriority | "all">("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"createdAt" | "publishDate" | "title" | "priority">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Fetch announcements
  const fetchAnnouncements = async (page: number = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const params: IAnnouncementQueryParams = {
        page,
        limit: 10,
        targetAudience: 'students',
        status: 'published',
        sortBy,
        sortOrder,
        search: searchTerm || undefined,
        type: selectedType === "all" ? undefined : selectedType,
        priority: selectedPriority === "all" ? undefined : selectedPriority
      };

      const response = await getRecentAnnouncements(params);
      
      if (response && response.status === 'success' && response.data) {
        const apiData = (response.data as any).data || response.data;
        
        let fetchedAnnouncements = [];
        if (apiData.announcements && Array.isArray(apiData.announcements)) {
          fetchedAnnouncements = apiData.announcements;
        } else if (Array.isArray(apiData)) {
          fetchedAnnouncements = apiData;
        }

        setAnnouncements(fetchedAnnouncements);
        
        // Set pagination data
        if (apiData.pagination) {
          setTotalCount(apiData.pagination.totalCount || 0);
          setCurrentPage(apiData.pagination.currentPage || 1);
          setTotalPages(apiData.pagination.totalPages || 1);
          setHasNextPage(apiData.pagination.hasNextPage || false);
          setHasPrevPage(apiData.pagination.hasPrevPage || false);
        }
      } else {
        setAnnouncements([]);
        setTotalCount(0);
        setCurrentPage(1);
        setTotalPages(1);
        setHasNextPage(false);
        setHasPrevPage(false);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setError('Failed to load announcements. Please try again.');
      setAnnouncements([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await getUnreadAnnouncementsCount();
      if (response && response.status === 'success' && response.data) {
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Mark announcement as read
  const handleMarkAsRead = async (announcementId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      await markAnnouncementAsRead(announcementId);
      
      // Update local state
      setAnnouncements(prev => prev.map(announcement => 
        announcement._id === announcementId 
          ? { ...announcement, isRead: true }
          : announcement
      ));
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      toast.success('Marked as read');
    } catch (error) {
      console.error('Error marking announcement as read:', error);
      toast.error('Failed to mark as read');
    }
  };

  // Handle announcement click
  const handleAnnouncementClick = (announcement: IAnnouncement) => {
    // Mark as read if not already read
    if (!announcement.isRead) {
      handleMarkAsRead(announcement._id, {} as React.MouseEvent);
    }
    
    // TODO: Navigate to announcement detail page or show modal
    console.log('Announcement clicked:', announcement);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchAnnouncements(1);
  };

  // Handle filter changes
  const handleFilterChange = () => {
    setCurrentPage(1);
    fetchAnnouncements(1);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchAnnouncements(page);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchAnnouncements(currentPage);
    fetchUnreadCount();
  };

  // Initial load
  useEffect(() => {
    fetchAnnouncements(1);
    fetchUnreadCount();
  }, []);

  // Handle filter changes
  useEffect(() => {
    if (!isLoading) {
      handleFilterChange();
    }
  }, [selectedType, selectedPriority, sortBy, sortOrder]);

  // Get priority badge
  const getPriorityBadge = (priority: TAnnouncementPriority) => {
    const colors = {
      low: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
      medium: "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-300",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-700 dark:text-orange-300",
      urgent: "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-300"
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  // Get type icon
  const getTypeIcon = (type: TAnnouncementType) => {
    const icons = {
      course: <BookOpen className="w-4 h-4" />,
      system: <AlertTriangle className="w-4 h-4" />,
      maintenance: <RefreshCw className="w-4 h-4" />,
      feature: <Star className="w-4 h-4" />,
      event: <Calendar className="w-4 h-4" />,
      general: <Info className="w-4 h-4" />
    };

    return icons[type] || <Info className="w-4 h-4" />;
  };

     return (
     <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
       <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-12">
         {/* Header */}
         <div className="mb-8">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
               <button
                 onClick={() => router.back()}
                 className="p-2 rounded-lg bg-white/90 backdrop-blur-xl shadow-sm hover:bg-white/95 dark:bg-slate-800/90 dark:hover:bg-slate-800/95 transition-colors"
               >
                 <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
               </button>
               <div className="flex items-center gap-3">
                 <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/20">
                   <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                 </div>
                 <div>
                   <h1 className={getResponsive.fluidText('heading')}>
                     Announcements
                   </h1>
                   <p className="text-slate-600 dark:text-slate-400">
                     Stay updated with the latest news and updates
                   </p>
                 </div>
               </div>
             </div>
            
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <div className="px-3 py-1 bg-red-100 dark:bg-red-900/20 rounded-full">
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">
                    {unreadCount} unread
                  </span>
                </div>
              )}
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

                 {/* Filters and Search */}
         <motion.div 
           className={buildAdvancedComponent.glassCard({ variant: 'primary', hover: false })}
           variants={itemVariants}
           initial="hidden"
           animate="visible"
         >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search announcements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </form>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as TAnnouncementType | "all")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="course">Course</option>
                <option value="system">System</option>
                <option value="maintenance">Maintenance</option>
                <option value="feature">Feature</option>
                <option value="event">Event</option>
                <option value="general">General</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value as TAnnouncementPriority | "all")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Additional Filters */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showUnreadOnly}
                  onChange={(e) => setShowUnreadOnly(e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Show unread only</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="createdAt">Date Created</option>
                <option value="publishDate">Publish Date</option>
                <option value="title">Title</option>
                <option value="priority">Priority</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
              <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
                Error Loading Announcements
              </h3>
              <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : announcements.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Announcements Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || selectedType !== "all" || selectedPriority !== "all"
                  ? "Try adjusting your filters or search terms."
                  : "There are no announcements available at the moment."}
              </p>
              {(searchTerm || selectedType !== "all" || selectedPriority !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedType("all");
                    setSelectedPriority("all");
                    setShowUnreadOnly(false);
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Announcements List */}
              <div className="space-y-4 mb-6">
                {announcements.map((announcement) => (
                                     <motion.div
                     key={announcement._id}
                     variants={itemVariants}
                     className={buildAdvancedComponent.glassCard({ variant: 'primary', hover: true })}
                     onClick={() => handleAnnouncementClick(announcement)}
                   >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-lg ${getTypeIconClass(announcement.type)}`}>
                            {getTypeIcon(announcement.type)}
                          </div>
                          <div className="flex items-center gap-2">
                            {getPriorityBadge(announcement.priority)}
                            {announcement.isSticky && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                                Pinned
                              </span>
                            )}
                            {!announcement.isRead && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                                New
                              </span>
                            )}
                          </div>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {announcement.title || 'Untitled Announcement'}
                        </h3>

                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {announcement.content || 'No content available'}
                        </p>

                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {announcement.author?.full_name || announcement.author?.name || 'Admin'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatAnnouncementDate(announcement.publishDate)}
                            </span>
                            {announcement.viewCount && announcement.viewCount > 0 && (
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {announcement.viewCount} views
                              </span>
                            )}
                          </div>

                          {!announcement.isRead && (
                            <button
                              onClick={(e) => handleMarkAsRead(announcement._id, e)}
                              className="flex items-center gap-1 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                            >
                              <EyeOff className="w-4 h-4" />
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalCount)} of {totalCount} announcements
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!hasPrevPage}
                      className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 text-sm rounded-lg ${
                              page === currentPage
                                ? 'bg-primary-600 text-white'
                                : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!hasNextPage}
                      className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StudentAnnouncementsPage;
