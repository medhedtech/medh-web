"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import LessonAccordion from '@/components/shared/lessons/LessonAccordion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useGetQuery from '@/hooks/getQuery.hook';
import { apiUrls } from '@/apis';
import Preloader from '@/components/shared/others/Preloader';
import { getCourseById } from '@/apis/course/course';

const IntegratedLessonPage = () => {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id;
  const lessonId = params.lessonId;
  
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getQuery } = useGetQuery();

  // Fetch course data
  useEffect(() => {
    if (!courseId) return;

    setLoading(true);
    getQuery({
      url: getCourseById(courseId),
      onSuccess: (response) => {
        if (response?.success) {
          setCourseData(response.data);
        } else {
          setError('Failed to fetch course data');
        }
        setLoading(false);
      },
      onFail: (error) => {
        console.error('Error fetching course:', error);
        setError('Failed to fetch course data');
        setLoading(false);
      },
    });
  }, [courseId]);

  // Find current, previous and next lessons
  const findAdjacentLessons = (curriculum, currentLessonId) => {
    let prevLesson = null;
    let currentLesson = null;
    let nextLesson = null;
    let foundCurrent = false;

    // Flatten the curriculum structure into a single array of lessons
    const allLessons = curriculum?.flatMap(week => 
      week.sections?.flatMap(section => 
        section.lessons || []
      ) || []
    ) || [];

    // Find the current lesson index
    const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLessonId);

    if (currentIndex !== -1) {
      currentLesson = allLessons[currentIndex];
      if (currentIndex > 0) {
        prevLesson = allLessons[currentIndex - 1];
      }
      if (currentIndex < allLessons.length - 1) {
        nextLesson = allLessons[currentIndex + 1];
      }
    }

    return { prevLesson, currentLesson, nextLesson };
  };

  const { prevLesson, currentLesson, nextLesson } = courseData ? 
    findAdjacentLessons(courseData.curriculum, lessonId) : 
    { prevLesson: null, currentLesson: null, nextLesson: null };

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Course Not Found</h2>
          <p className="text-gray-600">The requested course could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left Column: Video Player and Content (60-70% width) */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            {/* Video Player Section */}
            <div className="aspect-video bg-gray-900 rounded-t-lg">
              {currentLesson?.video_url ? (
                <video
                  src={currentLesson.video_url}
                  controls
                  className="w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No video available
                </div>
              )}
            </div>

            {/* Lesson Content */}
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {currentLesson?.title || 'Lesson Title'}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {currentLesson?.description || 'No description available'}
              </p>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                {prevLesson ? (
                  <button
                    onClick={() => router.push(`/integrated-lessons/${courseId}/lecture/${prevLesson.id}`)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous Lesson
                  </button>
                ) : (
                  <div />
                )}

                {nextLesson && (
                  <button
                    onClick={() => router.push(`/integrated-lessons/${courseId}/lecture/${nextLesson.id}`)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium bg-primaryColor text-white rounded-md hover:bg-primaryColor/90 transition-colors"
                  >
                    Next Lesson
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Course Curriculum (30-40% width) */}
      <div className="w-[400px] border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <LessonAccordion
          currentLessonId={lessonId}
          courseData={courseData}
          onLessonSelect={(lesson) => {
            if (!lesson?.id) {
              console.error('Invalid lesson selected:', lesson);
              return;
            }

            // Validate the lesson exists in the curriculum
            const isValidLesson = courseData?.curriculum?.some(week => 
              week?.sections?.some(section =>
                section?.lessons?.some(l => l?.id === lesson.id)
              )
            );

            if (!isValidLesson) {
              console.error('Selected lesson not found in curriculum:', lesson.id);
              return;
            }

            // Only navigate if it's a different lesson
            if (lesson.id !== lessonId) {
              router.push(`/integrated-lessons/${courseId}/lecture/${lesson.id}`);
            }
          }}
          className="h-full"
        />
      </div>
    </div>
  );
};

export default IntegratedLessonPage; 