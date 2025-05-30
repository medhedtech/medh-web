import React from "react";
import ProgressCourse from "./ProgressCourse";

/**
 * Example usage of the ProgressCourse component
 * This file demonstrates different states and configurations
 */
const ProgressCourseExample: React.FC = () => {
  // Example course data
  const sampleCourses = [
    {
      courseId: "course-1",
      title: "Advanced React Development with TypeScript",
      instructor: "John Doe",
      progress: 75,
      status: 'in_progress' as const,
      lastAccessed: "2024-01-15T10:30:00Z",
      category: "Web Development",
      rating: 4.8,
      skills: ["React", "TypeScript", "Hooks"],
      enrollmentType: "Live",
      completedLessons: ["lesson-1", "lesson-2", "lesson-3"],
      totalLessons: 12,
      expiryDate: "2024-06-15T23:59:59Z"
    },
    {
      courseId: "course-2",
      title: "Machine Learning Fundamentals",
      instructor: "Dr. Sarah Wilson",
      progress: 100,
      status: 'completed' as const,
      lastAccessed: "2024-01-10T14:20:00Z",
      category: "Data Science",
      rating: 4.9,
      skills: ["Python", "ML", "Data Analysis"],
      enrollmentType: "Self-Paced",
      isCertified: true,
      completedLessons: ["lesson-1", "lesson-2", "lesson-3", "lesson-4", "lesson-5"],
      totalLessons: 5
    },
    {
      courseId: "course-3",
      title: "Digital Marketing Strategy",
      instructor: "Mike Johnson",
      progress: 0,
      status: 'not_started' as const,
      category: "Marketing",
      rating: 4.6,
      skills: ["SEO", "Social Media", "Analytics"],
      enrollmentType: "Blended",
      paymentStatus: 'pending' as const,
      totalLessons: 8
    }
  ];

  // Example event handlers
  const handleCourseClick = (courseId: string) => {
    console.log(`Navigating to course: ${courseId}`);
  };

  const handleViewMaterials = (courseId: string) => {
    console.log(`Viewing materials for course: ${courseId}`);
  };

  const handlePayment = (courseId: string) => {
    console.log(`Processing payment for course: ${courseId}`);
  };

  const handleCertificate = (courseId: string) => {
    console.log(`Downloading certificate for course: ${courseId}`);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        ProgressCourse Component Examples
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleCourses.map((course) => (
          <ProgressCourse
            key={course.courseId}
            courseId={course.courseId}
            title={course.title}
            instructor={course.instructor}
            progress={course.progress}
            status={course.status}
            lastAccessed={course.lastAccessed}
            category={course.category}
            rating={course.rating}
            skills={course.skills}
            enrollmentType={course.enrollmentType}
            paymentStatus={course.paymentStatus}
            isCertified={course.isCertified}
            expiryDate={course.expiryDate}
            completedLessons={course.completedLessons}
            totalLessons={course.totalLessons}
            onClick={() => handleCourseClick(course.courseId)}
            onViewMaterials={() => handleViewMaterials(course.courseId)}
            onPayment={() => handlePayment(course.courseId)}
            onCertificate={() => handleCertificate(course.courseId)}
          />
        ))}
      </div>

      {/* Usage Documentation */}
      <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Usage Examples
        </h2>
        
        <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Basic Usage:</h3>
            <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-x-auto">
{`<ProgressCourse
  courseId="course-1"
  title="Course Title"
  instructor="Instructor Name"
  status="in_progress"
  progress={75}
/>`}
            </pre>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">With Custom Handlers:</h3>
            <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-x-auto">
{`<ProgressCourse
  courseId="course-1"
  title="Course Title"
  onClick={() => handleCourseClick(courseId)}
  onViewMaterials={() => handleViewMaterials(courseId)}
  onPayment={() => handlePayment(courseId)}
  onCertificate={() => handleCertificate(courseId)}
/>`}
            </pre>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Required Props:</h3>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li><code>courseId</code> - Unique identifier for the course</li>
              <li><code>title</code> - Course title</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Optional Props:</h3>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li><code>instructor</code> - Instructor name (default: "Instructor")</li>
              <li><code>progress</code> - Progress percentage (0-100)</li>
              <li><code>status</code> - 'completed' | 'in_progress' | 'not_started'</li>
              <li><code>paymentStatus</code> - 'pending' | 'completed' | 'failed' | 'refunded'</li>
              <li><code>isCertified</code> - Whether the course offers certification</li>
              <li><code>skills</code> - Array of skill tags</li>
              <li><code>enrollmentType</code> - 'Live' | 'Blended' | 'Self-Paced' | 'Individual'</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCourseExample; 