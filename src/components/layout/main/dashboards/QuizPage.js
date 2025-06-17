"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiFileText, FiInfo } from "react-icons/fi";
import { FileQuestion, BookOpen, ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import Preloader from "@/components/shared/others/Preloader";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import QuizComponent from "@/components/shared/lessons/QuizComponent";
import Pana from "@/assets/images/dashbord/pana.svg";
import { getCourseById } from "@/apis/course/course";

export default function QuizPage({ closeQuiz }) {
  const [studentId, setStudentId] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();
  const router = useRouter();

  // Get student ID from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      
      if (!storedUserId || !token) {
        toast.error("Please log in to access your quizzes");
        router.push("/auth/login");
        return;
      }
      
      setStudentId(storedUserId);
    }
  }, [router]);

  // Fetch enrolled courses when studentId is available
  useEffect(() => {
    if (!studentId) return;
    
    setLoading(true);
    
    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          toast.error("Authentication token not found. Please log in again.");
          setLoading(false);
          return;
        }
        
        const headers = {
          'x-access-token': token,
          'Content-Type': 'application/json'
        };
        
        const paymentApiUrl = apiUrls.payment.getStudentPayments(studentId, { 
          page: 1, 
          limit: 100
        });
        
        await getQuery({
          url: paymentApiUrl,
          headers,
          onSuccess: async (response) => {
            let courses = [];
            
            if (response?.success && response?.data?.enrollments) {
              const enrollments = response.data.enrollments || [];
              
              // Process enrollments and fetch course details
              const processedEnrollments = await Promise.all(
                enrollments.map(async (enrollment) => {
                  if (!enrollment.course_id) return null;
                  
                  try {
                    // Fetch course details
                    const courseResponse = await getQuery({
                      url: getCourseById(enrollment.course_id),
                      headers,
                    });
                    
                    const courseData = courseResponse?.course || courseResponse?.data || courseResponse;
                    
                    if (!courseData || !courseData._id) return null;
                    
                    // Check if course has quizzes
                    const hasQuizzes = courseData.curriculum?.some(week => 
                      week.sections?.some(section => 
                        section.lessons?.some(lesson => 
                          lesson.type?.toLowerCase() === 'quiz'
                        )
                      )
                    );
                    
                    if (!hasQuizzes) return null;
                    
                    return {
                      _id: courseData._id,
                      course_title: courseData.course_title,
                      course_image: courseData.course_image,
                      curriculum: courseData.curriculum || [],
                      completed_quizzes: enrollment.completed_quizzes || [],
                      progress: enrollment.progress || 0,
                      enrollment_id: enrollment._id
                    };
                  } catch (error) {
                    console.error(`Error fetching course details for enrollment ${enrollment._id}:`, error);
                    return null;
                  }
                })
              );
              
              courses = processedEnrollments.filter(Boolean);
            }
            
            setEnrolledCourses(courses);
            
            if (courses.length > 0) {
              setSelectedCourseId(courses[0]._id);
            }
            
            setLoading(false);
          },
          onError: (error) => {
            console.error("Error fetching enrolled courses:", error);
            toast.error("Failed to load enrolled courses. Please try again later.");
            setLoading(false);
          },
        });
      } catch (error) {
        console.error("Error in fetchEnrolledCourses:", error);
        toast.error("An unexpected error occurred. Please try again.");
        setLoading(false);
      }
    };
    
    fetchEnrolledCourses();
  }, [studentId, getQuery]);

  // Extract quizzes from selected course
  useEffect(() => {
    if (!selectedCourseId) {
      setAvailableQuizzes([]);
      return;
    }
    
    const selectedCourse = enrolledCourses.find(course => course._id === selectedCourseId);
    
    if (!selectedCourse) {
      setAvailableQuizzes([]);
      return;
    }
    
    const extractQuizzes = (curriculum) => {
      const quizzes = [];
      
      curriculum.forEach(week => {
        week.sections?.forEach(section => {
          section.lessons?.forEach(lesson => {
            if (lesson.type?.toLowerCase() === 'quiz') {
              const isCompleted = selectedCourse.completed_quizzes.includes(lesson._id || lesson.id);
              
              quizzes.push({
                id: lesson._id || lesson.id,
                title: lesson.title,
                description: lesson.description || "",
                weekTitle: week.weekTitle,
                sectionTitle: section.title,
                duration: lesson.duration,
                isCompleted,
                meta: lesson.meta || {}
              });
            }
          });
        });
      });
      
      return quizzes;
    };
    
    setAvailableQuizzes(extractQuizzes(selectedCourse.curriculum));
  }, [selectedCourseId, enrolledCourses]);

  const handleCourseChange = (courseId) => {
    setSelectedCourseId(courseId);
    setSelectedQuiz(null);
  };

  const handleStartQuiz = (quiz) => {
    setSelectedQuiz(quiz);
  };

  const handleQuizComplete = (results) => {
    setQuizCompleted(true);
    setQuizResults(results);
    
    // Submit quiz results to the server
    if (studentId && selectedQuiz?.id) {
      setSubmitting(true);
      
      postQuery({
        url: apiUrls?.quzies?.quizResponses,
        postData: {
          quizId: selectedQuiz.id,
          studentId,
          courseId: selectedCourseId,
          results,
          timestamp: new Date().toISOString()
        },
        onSuccess: () => {
          showToast.success("Quiz completed successfully!");
          setSubmitting(false);
        },
        onFail: (error) => {
          console.error("Error submitting quiz results:", error);
          toast.error("Quiz completed, but there was an issue saving your results.");
          setSubmitting(false);
        },
      });
    }
  };

  const handleBackToQuizzes = () => {
    setSelectedQuiz(null);
    setQuizCompleted(false);
    setQuizResults(null);
  };

  const handleGoBack = () => {
    closeQuiz();
  };

  if (loading) {
    return <Preloader />;
  }

  // Render the main quiz list interface
  if (!selectedQuiz) {
    return (
      <div className="w-full bg-gray-100 dark:bg-inherit dark:border rounded-5px">
        <div className="w-full p-6">
          <button
            onClick={handleGoBack}
            className="text-size-26 text-gray-700 dark:text-white mb-6"
          >
            &larr; Back
          </button>
          
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20">
              <FileQuestion className="w-6 h-6 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Course Quizzes
            </h2>
          </div>
          
          {enrolledCourses.length === 0 ? (
            <div className="flex flex-col h-[50vh] items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <BookOpen className="text-gray-400 dark:text-gray-500 mb-4" size={80} />
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                No Courses with Quizzes Found
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center max-w-md">
                You don't have any enrolled courses with quizzes. Enroll in courses with quizzes to see them here.
              </p>
              <button 
                onClick={() => router.push('/courses')}
                className="mt-6 px-6 py-2 bg-primaryColor text-white rounded-full hover:bg-green-600"
              >
                Browse Courses
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <label
                  htmlFor="course-select"
                  className="block text-[16px] font-semibold text-gray-700 dark:text-gray-200 mb-2"
                >
                  Select a course to view available quizzes
                </label>
                <select
                  id="course-select"
                  value={selectedCourseId}
                  onChange={(e) => handleCourseChange(e.target.value)}
                  className="min-w-[440px] border mb-2 border-gray-300 bg-white text-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primaryColor dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  {enrolledCourses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.course_title}
                    </option>
                  ))}
                </select>
              </div>
              
              {availableQuizzes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableQuizzes.map((quiz) => (
                    <motion.div
                      key={quiz.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <FileQuestion className="w-5 h-5 text-yellow-500" />
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{quiz.title}</h3>
                          </div>
                          {quiz.isCompleted && (
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                              Completed
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                          {quiz.description || "Test your knowledge and understanding of the course material."}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-3 mb-6">
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Tag className="w-4 h-4 mr-1.5" />
                            <span className="truncate">{quiz.sectionTitle}</span>
                          </div>
                          
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4 mr-1.5" />
                            <span className="truncate">{quiz.weekTitle}</span>
                          </div>
                          
                          {quiz.duration && (
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="w-4 h-4 mr-1.5" />
                              <span>{quiz.duration} min</span>
                            </div>
                          )}
                          
                          {quiz.meta?.passing_score && (
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <FiInfo className="w-4 h-4 mr-1.5" />
                              <span>Pass: {quiz.meta.passing_score}%</span>
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={() => handleStartQuiz(quiz)}
                          className="w-full px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-green-600 flex items-center justify-center"
                        >
                          {quiz.isCompleted ? "Retake Quiz" : "Start Quiz"}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <FiFileText className="text-gray-400 dark:text-gray-500 mb-4" size={60} />
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    No Quizzes Available
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                    This course doesn't have any quizzes available yet. Please check back later or select another course.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // Render quiz taking interface
  if (selectedQuiz && !quizCompleted) {
    return (
      <div className="w-full bg-gray-100 dark:bg-inherit dark:border rounded-5px">
        <div className="w-full p-6">
          <button
            onClick={handleBackToQuizzes}
            className="text-size-26 text-gray-700 dark:text-white mb-6"
          >
            &larr; Back to Quizzes
          </button>
          
          <QuizComponent
            quizId={selectedQuiz.id}
            lessonId={selectedQuiz.id}
            courseId={selectedCourseId}
            meta={selectedQuiz.meta}
            onComplete={handleQuizComplete}
          />
        </div>
      </div>
    );
  }

  // Render quiz completion screen
  return (
    <div className="w-full bg-gray-100 dark:bg-inherit dark:border rounded-5px">
      <div className="w-full p-6">
        <button
          onClick={handleBackToQuizzes}
          className="text-size-26 text-gray-700 dark:text-white mb-6"
        >
          &larr; Back to Quizzes
        </button>
        
        <div className="bg-white dark:bg-black px-6 py-8 rounded-lg shadow-sm text-center">
          <div className="mx-auto">
            <Image src={Pana} alt="Quiz completed" className="mx-auto" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Quiz Completed!
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Congratulations! You have successfully completed the quiz.
            {quizResults?.score && ` Your score: ${quizResults.score}%`}
            {quizResults?.passed !== undefined && (
              quizResults.passed 
                ? " You passed the quiz!" 
                : " Keep practicing to improve your score."
            )}
          </p>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={handleBackToQuizzes}
              className="px-6 py-2 bg-primaryColor text-white rounded-full hover:bg-green-600"
            >
              View All Quizzes
            </button>
            
            {quizResults?.passed === false && (
              <button
                onClick={() => {
                  setQuizCompleted(false);
                  setQuizResults(null);
                }}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
