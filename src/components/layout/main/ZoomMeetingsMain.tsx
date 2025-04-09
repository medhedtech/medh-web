'use client';

import { useState, useMemo } from "react";
import { Search, Calendar, LayoutGrid, List, Filter, Plus } from "lucide-react";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import ZoomMeetings from "@/components/sections/zoom-meetings/ZoomMeetings";
import { Meeting, MeetingFilters, MeetingStats } from "@/types/meetings";
import getAllMeetings from "@/libs/getAllMeetings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import CreateMeetingModal from "./zoom/CreateMeetingModal";

const ZoomMeetingsMain = () => {
  const [filters, setFilters] = useState<MeetingFilters>({
    searchTerm: "",
    status: "all",
    viewMode: "grid"
  });
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const allMeetings = getAllMeetings();
  
  // Calculate meeting statistics
  const stats: MeetingStats = useMemo(() => {
    return allMeetings.reduce((acc, meeting) => {
      acc.total++;
      acc[meeting.status]++;
      return acc;
    }, { total: 0, live: 0, upcoming: 0, completed: 0 });
  }, [allMeetings]);
  
  // Filter meetings based on search term and status
  const filteredMeetings = useMemo(() => {
    return allMeetings?.filter(meeting => {
      const matchesSearch = 
        meeting.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) || 
        meeting.host.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        meeting.department.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        meeting.course.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      const matchesStatus = filters.status === "all" || meeting.status === filters.status;
      
      return matchesSearch && matchesStatus;
    });
  }, [allMeetings, filters]);

  const handleCreateMeeting = (meetingData: any) => {
    // TODO: Implement meeting creation with API
    console.log("Create new meeting:", meetingData);
  };

  return (
    <div className="space-y-6">
      <HeroPrimary
        path={"Zoom Meetings and Webinars"}
        title={"Zoom Meetings"}
      />
      
      {/* Stats Section */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold">Total Meetings</h3>
            <p className="text-2xl font-bold">{stats.total}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-lg font-semibold">Live Now</h3>
            <p className="text-2xl font-bold text-green-600">{stats.live}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-lg font-semibold">Upcoming</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-lg font-semibold">Completed</h3>
            <p className="text-2xl font-bold text-gray-600">{stats.completed}</p>
          </Card>
        </div>
      </div>
      
      {/* Search and Filter Section */}
      <div className="bg-gray-50 dark:bg-gray-900 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Search */}
            <div className="relative w-full md:w-2/5">
              <Input
                type="text"
                placeholder="Search meetings..."
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="w-full pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            
            {/* Filters */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as MeetingFilters['status'] }))}
              >
                <option value="all">All Meetings</option>
                <option value="live">Live Now</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </Select>
              
              {/* View toggle */}
              <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                <Button
                  variant={filters.viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setFilters(prev => ({ ...prev, viewMode: "grid" }))}
                >
                  <LayoutGrid size={16} />
                </Button>
                <Button
                  variant={filters.viewMode === "calendar" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setFilters(prev => ({ ...prev, viewMode: "calendar" }))}
                >
                  <Calendar size={16} />
                </Button>
              </div>

              {/* Create Meeting Button */}
              <Button
                onClick={handleCreateMeeting}
                className="ml-2"
              >
                <Plus size={16} className="mr-2" />
                Create Meeting
              </Button>
            </div>
          </div>
          
          {/* Filters info */}
          <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span>Showing {filteredMeetings?.length || 0} meetings</span>
            {filters.status !== "all" && (
              <span className="ml-2">• Status: <span className="font-medium capitalize">{filters.status}</span></span>
            )}
            {filters.searchTerm && (
              <span className="ml-2">• Search: <span className="font-medium">"{filters.searchTerm}"</span></span>
            )}
          </div>
        </div>
      </div>
      
      <ZoomMeetings meetings={filteredMeetings} viewMode={filters.viewMode} />
    </div>
  );
};

export default ZoomMeetingsMain; 