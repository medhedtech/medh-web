'use client'
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import ZoomMeetings from "@/components/sections/zoom-meetings/ZoomMeetings";
import React, { useState } from "react";
import { Search, Calendar, LayoutGrid, List, Filter } from "lucide-react";
import getAllMeetings from "@/libs/getAllMeetings";

const ZoomMeetingsMain = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  
  const allMeetings = getAllMeetings();
  
  // Filter meetings based on search term and status
  const filteredMeetings = allMeetings?.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          meeting.speakerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          meeting.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || meeting.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <HeroPrimary
        path={"Zoom Meetings and Webinars"}
        title={"Zoom Meetings"}
      />
      
      {/* Search and Filter Section */}
      <div className="bg-gray-50 dark:bg-gray-900 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Search */}
            <div className="relative w-full md:w-2/5">
              <input
                type="text"
                placeholder="Search meetings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            
            {/* Filters */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2">
                <Filter size={16} className="text-gray-500 dark:text-gray-400" />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent border-none text-gray-900 dark:text-gray-100 text-sm focus:outline-none"
                >
                  <option value="all">All Meetings</option>
                  <option value="live">Live Now</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              {/* View toggle */}
              <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" 
                    ? "bg-primary-600 text-white" 
                    : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400"}`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button 
                  onClick={() => setViewMode("calendar")}
                  className={`p-2 ${viewMode === "calendar" 
                    ? "bg-primary-600 text-white" 
                    : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400"}`}
                >
                  <Calendar size={16} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Filters info */}
          <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span>Showing {filteredMeetings?.length || 0} meetings</span>
            {statusFilter !== "all" && (
              <span className="ml-2">• Status: <span className="font-medium capitalize">{statusFilter}</span></span>
            )}
            {searchTerm && (
              <span className="ml-2">• Search: <span className="font-medium">"{searchTerm}"</span></span>
            )}
          </div>
        </div>
      </div>
      
      <ZoomMeetings meetings={filteredMeetings} viewMode={viewMode} />
    </>
  );
};

export default ZoomMeetingsMain;
