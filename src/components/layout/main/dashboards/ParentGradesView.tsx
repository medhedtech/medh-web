import React from 'react';

interface ParentGradesViewProps {
  childName?: string;
  childGrade?: string;
}

const ParentGradesView: React.FC<ParentGradesViewProps> = ({ childName = "Your Child", childGrade = "Class" }) => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {childName}'s Academic Performance
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View your child's grades and assignment performance
        </p>
      </div>

      {/* Grade Summary Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Current Term Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Overall Grade</p>
            <p className="text-2xl font-bold">A</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400 mb-1">Assignments Completed</p>
            <p className="text-2xl font-bold">24/30</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Class Rank</p>
            <p className="text-2xl font-bold">5th</p>
          </div>
        </div>
      </div>

      {/* Subject Grades */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Subject Grades</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Grade</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Progress</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Instructor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Mathematics</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">A</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">Mrs. Johnson</td>
              </tr>
              <tr>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Science</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">B+</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">Mr. Smith</td>
              </tr>
              <tr>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">English</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">A-</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">Ms. Davis</td>
              </tr>
              <tr>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">History</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">B</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">Mr. Wilson</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Assignments */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Assignments</h2>
        
        <div className="space-y-4">
          <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Mathematics Quiz</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Algebra Fundamentals</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                Completed
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Grade: 95%</span>
              <span className="text-gray-500 dark:text-gray-400">Due: Oct 15, 2023</span>
            </div>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Science Project</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ecosystem Study</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                In Progress
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Progress: 60%</span>
              <span className="text-gray-500 dark:text-gray-400">Due: Oct 30, 2023</span>
            </div>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">English Essay</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Literary Analysis</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                Pending
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Not Started</span>
              <span className="text-gray-500 dark:text-gray-400">Due: Nov 5, 2023</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentGradesView; 