#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Extract instructor menu items from the sidebar
const instructorRoutes = [
  // Main routes
  { name: "Dashboard", path: "/dashboards", hasSubItems: false },
  
  // Demo Classes
  { name: "My Demo Classes", hasSubItems: true, subItems: [
    { name: "View Assigned Demo Classes", path: "demo-classes" },
    { name: "Accept/Reject Demo Class", path: "demo-requests" },
    { name: "View Demo Presentations", path: "demo-presentations" },
    { name: "Start/Join Live Demo", path: "demo-live" },
    { name: "Submit Feedback", path: "demo-feedback" },
    { name: "Recorded Demo Sessions", path: "demo-recordings" }
  ]},
  
  // Main Classes
  { name: "My Main Classes", hasSubItems: true, subItems: [
    { name: "View Assigned Courses/Batches", path: "assigned-courses" },
    { name: "Manage Class Schedules", path: "class-schedules" },
    { name: "Live Classes Presentations", path: "live-presentations" },
    { name: "Start/Join Live Classes", path: "live-classes" },
    { name: "Recorded Live Sessions", path: "live-recordings" }
  ]},
  
  // Student Management
  { name: "Student Management", hasSubItems: true, subItems: [
    { name: "View Student Lists", path: "student-lists" },
    { name: "Track Student Progress", path: "student-progress" },
    { name: "Communicate with Students", path: "student-communication" }
  ]},
  
  // Content Management
  { name: "Content Management", hasSubItems: true, subItems: [
    { name: "Upload Course Materials", path: "upload-materials" },
    { name: "Create/Edit Lesson Plans", path: "lesson-plans" },
    { name: "Manage Resource Visibility", path: "resource-visibility" }
  ]},
  
  // Assessments
  { name: "Assessments", hasSubItems: true, subItems: [
    { name: "Create Quizzes/Assignments", path: "create-assessments" },
    { name: "Check Submitted Work", path: "submitted-work" },
    { name: "Provide/Reply Feedback", path: "assessment-feedback" },
    { name: "Performance Reports", path: "performance-reports" }
  ]},
  
  // Attendance
  { name: "Attendance", hasSubItems: true, subItems: [
    { name: "Mark Class Attendance", path: "mark-attendance" },
    { name: "View Attendance Reports", path: "attendance-reports" }
  ]},
  
  // Revenue
  { name: "My Revenue", hasSubItems: true, subItems: [
    { name: "My Receivables (Receipts/Dues)", path: "receivables" },
    { name: "Total Demo Classes Revenue", path: "demo-revenue" },
    { name: "Total Live Classes Revenue", path: "live-revenue" }
  ]},
  
  // Reports
  { name: "Reports", hasSubItems: true, subItems: [
    { name: "Class Performance Reports", path: "class-reports" },
    { name: "Student Engagement Reports", path: "engagement-reports" },
    { name: "Learning Outcome Analysis", path: "learning-outcomes" }
  ]},
  
  // Single pages
  { name: "Settings", path: "settings", hasSubItems: false },
  { name: "Profile", path: "profile", hasSubItems: false }
];

// API method mapping
const apiMethodMap = {
  "demo-classes": "getDemoClasses",
  "demo-requests": "updateDemoStatus", 
  "demo-presentations": "getDemoClasses",
  "demo-live": "getDemoClasses",
  "demo-feedback": "getDemoFeedbackStats",
  "demo-recordings": "getDemoClasses",
  "assigned-courses": "getAssignedBatches",
  "class-schedules": "getAssignedBatches",
  "live-presentations": "getAssignedBatches",
  "live-classes": "getAssignedBatches", 
  "live-recordings": "getAssignedBatches",
  "student-lists": "getStudentsByBatch",
  "student-progress": "getStudentProgress",
  "student-communication": "getStudentsByBatch",
  "upload-materials": "uploadCourseMaterial",
  "lesson-plans": "createVideoLesson",
  "resource-visibility": "getAssignedBatches",
  "create-assessments": "createAssignment",
  "submitted-work": "getAssignmentSubmissions",
  "assessment-feedback": "gradeSubmission",
  "performance-reports": "getAttendanceAnalytics",
  "mark-attendance": "markAttendance",
  "attendance-reports": "getAttendanceAnalytics",
  "receivables": "getInstructorRevenue",
  "demo-revenue": "getInstructorRevenue",
  "live-revenue": "getInstructorRevenue",
  "class-reports": "getAttendanceAnalytics",
  "engagement-reports": "getAttendanceAnalytics",
  "learning-outcomes": "getAttendanceAnalytics",
  "settings": "getInstructorProfile",
  "profile": "getInstructorProfile"
};

// Generate page templates
const generatePageTemplate = (routeName, apiMethod, isClientComponent = false) => {
  const componentType = isClientComponent ? '"use client";\n\n' : '';
  const imports = isClientComponent ? 
    `import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { instructorApi } from '@/apis/instructor.api';
import { showToast } from '@/utils/toast';
import { 
  LucideLoader2, 
  LucideAlertCircle,
  LucideCheckCircle,
  LucideInfo,
  LucideRefreshCw
} from 'lucide-react';` :
    `import React from 'react';
import { instructorApi } from '@/apis/instructor.api';`;

  const interfaceName = `${routeName.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('')}Data`;

  return `${componentType}${imports}

// Types and Interfaces
interface ${interfaceName} {
  // TODO: Define proper interface based on API response
  data: any[];
  loading: boolean;
  error: string | null;
}

interface ${routeName.split('-').map(word => 
  word.charAt(0).toUpperCase() + word.slice(1)
).join('')}Props {
  searchParams?: { [key: string]: string | string[] | undefined };
}

${isClientComponent ? `
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

// Loading Component
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <LucideLoader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
      <p className="text-gray-600 dark:text-gray-300">Loading...</p>
    </div>
  </div>
);

// Error Component
const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center max-w-md">
      <LucideAlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          <LucideRefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  </div>
);` : ''}

/**
 * ${routeName.split('-').map(word => 
   word.charAt(0).toUpperCase() + word.slice(1)
 ).join('')}Page - ${routeName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} management
 */
const ${routeName.split('-').map(word => 
  word.charAt(0).toUpperCase() + word.slice(1)
).join('')}Page: React.FC<${routeName.split('-').map(word => 
  word.charAt(0).toUpperCase() + word.slice(1)
).join('')}Props> = ({ searchParams }) => {
  ${isClientComponent ? `
  // State management
  const [data, setData] = useState<${interfaceName}>({
    data: [],
    loading: true,
    error: null
  });
  const [refreshing, setRefreshing] = useState(false);

  // Fetch data
  const fetchData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));
      
      // TODO: Replace with actual API call
      const response = await instructorApi.${apiMethod}();
      
      if (response.success) {
        setData({
          data: response.data || [],
          loading: false,
          error: null
        });
      } else {
        throw new Error(response.error?.message || 'Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setData({
        data: [],
        loading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
      showToast('error', 'Failed to load data. Please try again.');
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // Effect to fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Loading state
  if (data.loading) {
    return <LoadingSpinner />;
  }

  // Error state
  if (data.error) {
    return <ErrorMessage message={data.error} onRetry={handleRefresh} />;
  }` : `
  // TODO: Implement server-side data fetching
  // const data = await instructorApi.${apiMethod}();`}

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                ${routeName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Manage your ${routeName.replace(/-/g, ' ').toLowerCase()} efficiently
              </p>
            </div>
            ${isClientComponent ? `
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              <LucideRefreshCw className={\`w-4 h-4 \${refreshing ? 'animate-spin' : ''}\`} />
              Refresh
            </button>` : ''}
          </div>
        </div>

        {/* Main Content */}
        ${isClientComponent ? `
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Stats Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* TODO: Add relevant stats cards */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.data.length}</p>
                </div>
                <LucideInfo className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                ${routeName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} List
              </h2>
              
              {/* TODO: Implement actual content based on page type */}
              {data.data.length > 0 ? (
                <div className="space-y-4">
                  {data.data.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <p className="text-gray-900 dark:text-white">
                        Item {index + 1}: {JSON.stringify(item)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <LucideInfo className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No data available
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    There are no items to display at this time.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>` : `
        <div className="space-y-6">
          {/* TODO: Implement server-side rendered content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              ${routeName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              This page is under development. Please implement the required functionality.
            </p>
          </div>
        </div>`}
      </div>
    </div>
  );
};

export default ${routeName.split('-').map(word => 
  word.charAt(0).toUpperCase() + word.slice(1)
).join('')}Page;`;
};

// Main execution
async function generateInstructorPages() {
  const baseDir = path.join(process.cwd(), 'src/app/instructor');
  const generatedPages = [];
  const skippedPages = [];

  console.log('🚀 Starting Instructor Dashboard Pages Generation...\n');

  // Ensure base directory exists
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
    console.log(`✅ Created base directory: ${baseDir}`);
  }

  // Collect all routes to generate
  const allRoutes = [];
  
  instructorRoutes.forEach(route => {
    if (route.hasSubItems && route.subItems) {
      route.subItems.forEach(subItem => {
        allRoutes.push({
          name: subItem.name,
          path: subItem.path,
          apiMethod: apiMethodMap[subItem.path] || 'getInstructorProfile'
        });
      });
    } else if (route.path && route.path !== '/dashboards') {
      allRoutes.push({
        name: route.name,
        path: route.path,
        apiMethod: apiMethodMap[route.path] || 'getInstructorProfile'
      });
    }
  });

  console.log(`📋 Found ${allRoutes.length} routes to generate:\n`);

  // Generate pages
  for (const route of allRoutes) {
    try {
      const pageDir = path.join(baseDir, route.path);
      const pagePath = path.join(pageDir, 'page.tsx');

      // Check if page already exists
      if (fs.existsSync(pagePath)) {
        console.log(`⏭️  Skipping ${route.path} - already exists`);
        skippedPages.push(route.path);
        continue;
      }

      // Create directory
      if (!fs.existsSync(pageDir)) {
        fs.mkdirSync(pageDir, { recursive: true });
      }

      // Determine if it should be a client component
      const clientComponents = [
        'demo-requests', 'demo-live', 'live-classes', 'student-progress',
        'student-communication', 'upload-materials', 'create-assessments',
        'submitted-work', 'assessment-feedback', 'mark-attendance'
      ];
      const isClientComponent = clientComponents.includes(route.path);

      // Generate page content
      const pageContent = generatePageTemplate(route.path, route.apiMethod, isClientComponent);

      // Write page file
      fs.writeFileSync(pagePath, pageContent);

      console.log(`✅ Generated: ${route.path}/page.tsx ${isClientComponent ? '(client)' : '(server)'}`);
      generatedPages.push(route.path);

      // Create components directory for complex pages
      const complexPages = ['student-progress', 'performance-reports', 'class-reports'];
      if (complexPages.includes(route.path)) {
        const componentsDir = path.join(pageDir, 'components');
        if (!fs.existsSync(componentsDir)) {
          fs.mkdirSync(componentsDir, { recursive: true });
          console.log(`📁 Created components directory for ${route.path}`);
        }
      }

    } catch (error) {
      console.error(`❌ Error generating ${route.path}:`, error.message);
    }
  }

  // Generate summary
  console.log(`\n📊 Generation Summary:`);
  console.log(`✅ Generated: ${generatedPages.length} pages`);
  console.log(`⏭️  Skipped: ${skippedPages.length} pages`);
  console.log(`\n📝 Generated Pages:`);
  generatedPages.forEach(page => console.log(`   - ${page}`));
  
  if (skippedPages.length > 0) {
    console.log(`\n⏭️  Skipped Pages:`);
    skippedPages.forEach(page => console.log(`   - ${page}`));
  }

  // Create summary file
  const summaryContent = `# Instructor Dashboard Pages Generation Summary

Generated on: ${new Date().toISOString()}

## Statistics
- **Total Routes Found**: ${allRoutes.length}
- **Pages Generated**: ${generatedPages.length}
- **Pages Skipped**: ${skippedPages.length}

## Generated Pages
${generatedPages.map(page => `- \`/app/instructor/${page}/page.tsx\``).join('\n')}

## Skipped Pages (Already Exist)
${skippedPages.map(page => `- \`/app/instructor/${page}/page.tsx\``).join('\n')}

## Next Steps
1. Review generated pages and implement specific functionality
2. Update API method calls with proper parameters
3. Implement proper TypeScript interfaces
4. Add proper error handling and loading states
5. Implement responsive design patterns
6. Add proper authentication and authorization checks

## API Methods Used
${Object.entries(apiMethodMap).map(([route, method]) => `- \`${route}\`: \`${method}\``).join('\n')}
`;

  fs.writeFileSync(path.join(baseDir, 'GENERATION_SUMMARY.md'), summaryContent);
  console.log(`\n📄 Summary saved to: /app/instructor/GENERATION_SUMMARY.md`);
  console.log('\n🎉 Instructor Dashboard Pages Generation Complete!');
}

// Run the generator
generateInstructorPages().catch(console.error); 