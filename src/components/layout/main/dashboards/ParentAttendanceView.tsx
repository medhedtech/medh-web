import React from 'react';

interface ChildData {
  id: string;
  name: string;
  grade: string;
  image?: string;
}

interface ParentAttendanceViewProps {
  selectedChild?: ChildData | null;
}

const ParentAttendanceView: React.FC<ParentAttendanceViewProps> = ({ selectedChild }) => {
  // Use selected child data or default values
  const childName = selectedChild?.name || "Your Child";
  const childGrade = selectedChild?.grade || "Class";
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{childName}'s Attendance Overview</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Track attendance records for {childGrade}
      </p>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <p>Child attendance tracking coming soon...</p>
      </div>
    </div>
  );
};

export default ParentAttendanceView; 