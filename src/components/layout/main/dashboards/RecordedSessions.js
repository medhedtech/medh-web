"use client";

import React from "react";
import { CalendarDays, Clock, User, Video } from "lucide-react";

const RecordedSessions = () => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Recorded Sessions</h3>
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <div className="flex items-center justify-center text-gray-500 py-8">
          <div className="text-center">
            <Video className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No recorded sessions available</p>
            <p className="text-sm mt-1">Recordings will appear here after sessions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordedSessions; 