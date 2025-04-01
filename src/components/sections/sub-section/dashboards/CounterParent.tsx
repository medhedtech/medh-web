"use client";

import React from "react";
import { Check, Calendar, Clock, Award, Bookmark, BookOpen } from "lucide-react";

interface CounterItemProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}

const CounterItem: React.FC<CounterItemProps> = ({ icon, value, label, color }) => {
  return (
    <div className={`bg-${color}-50 dark:bg-${color}-900/20 rounded-xl p-4 flex items-center`}>
      <div className={`bg-${color}-100 dark:bg-${color}-800/30 p-3 rounded-lg mr-4`}>
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  );
};

const CounterParent: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">At a Glance</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CounterItem
          icon={<Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
          value="92%"
          label="Attendance Rate"
          color="blue"
        />
        <CounterItem
          icon={<BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />}
          value="8"
          label="Subjects"
          color="green"
        />
        <CounterItem
          icon={<Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
          value="B+"
          label="Average Grade"
          color="purple"
        />
        <CounterItem
          icon={<Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
          value="4"
          label="Upcoming Events"
          color="amber"
        />
      </div>
    </div>
  );
};

export default CounterParent; 