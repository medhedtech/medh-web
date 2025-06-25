import React from 'react';

interface StudentProgressData {
  studentId: string;
  studentName: string;
  studentEmail: string;
  profilePicture?: string;
  enrollmentDate: string;
  lastActivity: string;
  batchName: string;
  courseName: string;
  overallProgress: number;
  courseProgress: {
    completed_lessons: number;
    total_lessons: number;
    completion_percentage: number;
  };
  performanceMetrics: {
    quiz_average: number;
    assignment_average: number;
    attendance_rate: number;
  };
  engagementMetrics: {
    forum_posts: number;
    questions_asked: number;
    peer_interactions: number;
  };
}

interface StudentProgressComponentProps {
  student: StudentProgressData;
}

const StudentProgressComponent: React.FC<StudentProgressComponentProps> = ({ student }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
          {student.studentName.charAt(0)}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{student.studentName}</h3>
          <p className="text-gray-600 dark:text-gray-400">{student.studentEmail}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">{student.batchName}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{student.overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${student.overallProgress}%` }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Quiz Average</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{student.performanceMetrics.quiz_average}%</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Assignment Average</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{student.performanceMetrics.assignment_average}%</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Attendance Rate</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{student.performanceMetrics.attendance_rate}%</p>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course Progress</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {student.courseProgress.completed_lessons} of {student.courseProgress.total_lessons} lessons completed
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentProgressComponent;