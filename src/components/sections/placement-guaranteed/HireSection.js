"use client";
import { useState, useEffect } from "react";
import { apiBaseUrl } from "@/apis";
import CourseCard from "../courses/CourseCard";
import Preloader2 from "@/components/shared/others/Preloader2";

const HireSectionPlacement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${apiBaseUrl}/courses/search?page=1&limit=8&status=Published&course_duration=18 months%2072%20weeks`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        // Add class_type and other live course specific properties
        const liveCourses = (data.courses || []).map(course => ({
          ...course,
          class_type: "live",
          is_live: true,
          schedule: "Flexible Schedule",
          effort_hours: "4-6",
          course_duration: "18 Months (Including Corporate Internship)", // Updated duration
          features: [
            ...(course.features || []),
            "3 Months Corporate Internship Included"
          ]
        }));
        setCourses(liveCourses);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <section className="pb-20 relative">


      {/* Professional Edge Section */}
      <div className="bg-gray-100 dark:bg-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-[#7ECA9D] font-bold text-2xl md:text-3xl mb-4">
              Live Interactive Professional Diploma Courses
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              These comprehensive programs feature live interactive sessions with industry experts,
              combining 15 months of theoretical knowledge with 3 months of practical application 
              through corporate internships. Our live courses ensure personalized attention and 
              real-time interaction, leading to guaranteed corporate sector employment.
            </p>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="container mx-auto px-4 mt-8">
        {loading ? (
          <div className="w-full flex justify-center py-12">
            <Preloader2 />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">
            {error}
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8 max-w-[900px]">
              {courses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  classType="live"
                  variant="standard"
                  showRelatedButton={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Duration Breakdown */}
      <div className="container mx-auto px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Program Duration Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-semibold text-[#7ECA9D] mb-2">15 Months</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Intensive Live Interactive Learning
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-semibold text-[#7ECA9D] mb-2">3 Months</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Corporate Internship
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Description */}
      <div className="container mx-auto px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-700 dark:text-gray-300">
            Our live interactive curriculum spans 18 months, with 15 months of intensive 
            learning followed by a 3-month corporate internship. Students engage in live 
            sessions, hands-on projects, case studies, and simulations, gaining practical 
            experience through direct interaction. The program includes industry certifications 
            and job readiness modules to enhance marketability and ensure successful career placement.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HireSectionPlacement;
