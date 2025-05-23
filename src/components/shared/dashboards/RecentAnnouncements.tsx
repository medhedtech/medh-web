"use client";
import React, { useEffect, useState } from "react";
import { Bell, ArrowRight, Loader2 } from "lucide-react";
import AnnouncementCard, { Announcement } from "./AnnouncementCard";
import { getAnnouncements } from "@/services/announcement-service";
import { motion } from "framer-motion";

interface RecentAnnouncementsProps {
  limit?: number;
  showViewAll?: boolean;
  onViewAllClick?: () => void;
  filterByType?: string;
}

const RecentAnnouncements: React.FC<RecentAnnouncementsProps> = ({
  limit = 3,
  showViewAll = true,
  onViewAllClick,
  filterByType
}) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleAnnouncements, setVisibleAnnouncements] = useState<Announcement[]>([]);

  // Animation variants for list items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let data: Announcement[];
        
        // Fetch data based on filter
        if (filterByType) {
          data = await getAnnouncements();
          data = data.filter(item => item.type === filterByType);
        } else {
          data = await getAnnouncements();
        }
        
        setAnnouncements(data);
        // Set visible announcements based on limit
        setVisibleAnnouncements(data.slice(0, limit));
        setError(null);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setError("Failed to load announcements. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [limit, filterByType]);

  const handleAnnouncementClick = (id: number) => {
    console.log(`Announcement ${id} clicked`);
    // You could navigate to a detailed view or show a modal with more information
  };

  const handleViewAll = () => {
    if (onViewAllClick) {
      onViewAllClick();
    } else {
      console.log("View all announcements clicked");
      // Default behavior could be to show all announcements
      setVisibleAnnouncements(announcements);
    }
  };

  // Render loading, error, or content
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
          <span className="ml-2 text-gray-600 dark:text-gray-300">Loading announcements...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-6">
          <p className="text-red-500 dark:text-red-400">{error}</p>
          <button 
            onClick={() => getAnnouncements().then(setAnnouncements).catch(() => {})}
            className="mt-2 text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            Try again
          </button>
        </div>
      );
    }

    if (visibleAnnouncements.length === 0) {
      return (
        <div className="text-center py-6">
          <p className="text-gray-500 dark:text-gray-400">No announcements at this time.</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {visibleAnnouncements.map((announcement, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: idx * 0.1 }}
          >
            <AnnouncementCard 
              announcement={{
                ...announcement,
                onClick: () => handleAnnouncementClick(idx)
              }}
            />
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/20">
            <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Announcements</h2>
        </div>
        
        {!isLoading && !error && showViewAll && announcements.length > limit && (
          <button 
            onClick={handleViewAll}
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1"
          >
            View all <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        )}
      </div>
      
      {renderContent()}
    </>
  );
};

export default RecentAnnouncements; 