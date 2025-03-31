'use client'
import ZoomMeeting from "@/components/shared/zoom-meetings/ZoomMeeting";
import { Calendar, Clock, Users } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const ZoomMeetings = ({ meetings = [], viewMode = "grid" }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Group meetings by date for calendar view
  const meetingsByDate = meetings.reduce((acc, meeting) => {
    const date = meeting.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(meeting);
    return acc;
  }, {});
  
  // Get unique dates sorted
  const sortedDates = Object.keys(meetingsByDate).sort((a, b) => new Date(a) - new Date(b));
  
  // If no meetings available
  if (meetings.length === 0) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Meetings Found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              There are no meetings matching your current filters. Try adjusting your search or check back later.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      {viewMode === "grid" ? (
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {meetings.map((meeting, idx) => (
              <ZoomMeeting key={idx} meeting={meeting} />
            ))}
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4">
          {/* Calendar View */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            {/* Calendar Navigation */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Meeting Calendar
              </h3>
              
              <div className="flex space-x-2">
                {sortedDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date === selectedDate ? null : date)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      date === selectedDate
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </button>
                ))}
                
                {selectedDate && (
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Show All
                  </button>
                )}
              </div>
            </div>
            
            {/* Meeting List */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {(selectedDate ? meetingsByDate[selectedDate] : meetings).map((meeting, idx) => (
                <div key={idx} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors">
                  <Link href={`/zoom/meetings/${meeting.id}`} className="block">
                    <div className="flex flex-col md:flex-row md:items-center">
                      {/* Status Badge */}
                      <div className="mb-2 md:mb-0 md:mr-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          meeting.status === 'live' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : meeting.status === 'upcoming'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {meeting.status === 'live' ? 'Live Now' : meeting.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                        </span>
                      </div>
                      
                      {/* Meeting Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {meeting.title}
                        </h3>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Users size={16} />
                            <span>{meeting.speakerName}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span>{new Date(meeting.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Clock size={16} />
                            <span>{meeting.startingTime}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action */}
                      <div className="mt-3 md:mt-0">
                        <button 
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            meeting.status === 'live'
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : meeting.status === 'upcoming'
                                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                                : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 cursor-not-allowed'
                          }`}
                          disabled={meeting.status === 'completed'}
                        >
                          {meeting.status === 'live' ? 'Join Now' : meeting.status === 'upcoming' ? 'View Details' : 'Meeting Ended'}
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ZoomMeetings;
