"use client";
import { apiUrls } from "@/apis";
import Preloader from "@/components/shared/others/Preloader";
import usePostQuery from "@/hooks/postQuery.hook";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { 
  HelpCircle, 
  DollarSign, 
  BookOpen, 
  Clock, 
  Calendar, 
  Users, 
  Award, 
  FileText, 
  Video, 
  Image as ImageIcon,
  ArrowLeft,
  Send,
  CheckCircle,
  X,
  List,
  Gift,
  HelpingHand,
  MessageCircle
} from "lucide-react";
import Tooltip from "@/components/shared/others/Tooltip";

export default function CoursePreview() {
  const router = useRouter();
  const [courseData, setCourseData] = useState(null);
  const { postQuery, loading } = usePostQuery();

  useEffect(() => {
    // Get both courseData and courseFormData
    const storedData = localStorage.getItem("courseData");
    const formData = localStorage.getItem("courseFormData");
    
    try {
      if (formData) {
        const parsedFormData = JSON.parse(formData);
        // Merge form values with other data
        const combinedData = {
          ...parsedFormData.formValues,
          course_videos: parsedFormData.courseVideos || [],
          course_image: parsedFormData.thumbnailImage || "",
          resource_videos: parsedFormData.resourceVideos || [],
          resource_pdfs: parsedFormData.resourcePdfs || [],
          curriculum_weeks: parsedFormData.curriculumWeeks || [],
          tools_technologies: parsedFormData.toolsTechnologies || [],
          bonus_modules: parsedFormData.bonusModules || [],
          faqs: parsedFormData.faqs || [],
          prices: parsedFormData.prices || [],
          course_category: parsedFormData.selected || parsedFormData.formValues?.course_category,
          category_type: parsedFormData.courseTag || parsedFormData.formValues?.category_type,
          class_type: parsedFormData.classType || parsedFormData.formValues?.class_type,
          course_grade: parsedFormData.courseGrade || parsedFormData.formValues?.course_grade,
          is_Certification: parsedFormData.certification || parsedFormData.formValues?.is_Certification,
          is_Assignments: parsedFormData.assignments || parsedFormData.formValues?.is_Assignments,
          is_Projects: parsedFormData.projects || parsedFormData.formValues?.is_Projects,
          is_Quizes: parsedFormData.quizzes || parsedFormData.formValues?.is_Quizes,
          course_mode: parsedFormData.category_type || parsedFormData.formValues?.category_type,
          session_duration: parsedFormData.formValues?.session_duration,
          efforts_per_Week: parsedFormData.formValues?.efforts_per_Week,
          course_description: parsedFormData.formValues?.course_description,
          course_title: parsedFormData.formValues?.course_title,
          no_of_Sessions: parsedFormData.formValues?.no_of_Sessions,
          online_sessions: {
            count: parsedFormData.formValues?.no_of_Sessions || "",
            duration: parsedFormData.formValues?.session_duration || "60-90 min"
          }
        };

        setCourseData(combinedData);
        console.log("Combined preview data:", combinedData);
      } else if (storedData) {
        // Fallback to stored course data if form data isn't available
        const parsedData = JSON.parse(storedData);
        if (parsedData && Object.keys(parsedData).length > 0) {
          // Update course_mode to use category_type
          parsedData.course_mode = parsedData.category_type;
          // Update online_sessions to use no_of_Sessions and session_duration
          parsedData.online_sessions = {
            count: parsedData.no_of_Sessions || "",
            duration: parsedData.session_duration || "60-90 min"
          };
          setCourseData(parsedData);
          console.log("Using stored course data:", parsedData);
        }
      }
    } catch (error) {
      console.error("Error parsing course data:", error);
      toast.error("Error loading course data");
    }
  }, []);

  const handleSubmit = async () => {
    try {
      // Show loading toast
      const loadingToastId = toast.loading("Publishing course...");

      // Ensure online_sessions is properly formatted
      const formattedOnlineSessions = {
        count: courseData?.online_sessions?.count || "",
        duration: courseData?.online_sessions?.duration || "60-90 min"
      };

      const postData = {
        ...courseData,
        course_videos: courseData?.course_videos || [],
        brochures: courseData?.brochures || [],
        course_image: courseData?.course_image || "",
        curriculum: courseData?.curriculum_weeks || [], // Use curriculum_weeks instead
        resource_videos: courseData?.resource_videos || [],
        resource_pdfs: courseData?.resource_pdfs || [],
        tools_technologies: courseData?.tools_technologies || [],
        bonus_modules: courseData?.bonus_modules || [],
        faqs: courseData?.faqs || [],
        category_type: courseData?.category_type,
        course_category: courseData?.class_type,
        class_type: courseData?.class_type,
        course_mode: courseData?.course_mode,
        online_sessions: formattedOnlineSessions,
        prices: courseData?.prices || []
      };

      // Validate required fields
      const requiredFields = [
        'course_title',
        'course_category',
        'category_type',
        'course_mode',
        'course_grade',
        'no_of_Sessions',
        'course_duration',
        'session_duration',
        'course_description'
      ];

      const missingFields = requiredFields.filter(field => !postData[field]);
      
      if (missingFields.length > 0) {
        toast.update(loadingToastId, {
          render: `Please fill in all required fields: ${missingFields.join(', ')}`,
          type: "error",
          isLoading: false,
          autoClose: 5000
        });
        return;
      }

      // Validate course_category enum
      const validCategories = ['Live Courses', 'Blended Courses', 'Corporate Training Courses'];
      if (!validCategories.includes(postData.course_category)) {
        toast.update(loadingToastId, {
          render: "Please select a valid course category",
          type: "error",
          isLoading: false,
          autoClose: 5000
        });
        return;
      }

      await postQuery({
        url: `${apiUrls?.courses?.createCourse}`,
        postData,
        onSuccess: () => {
          // Clear all stored data
          localStorage.removeItem("courseData");
          localStorage.removeItem("courseFormData");
          
          toast.update(loadingToastId, {
            render: "Course published successfully!",
            type: "success",
            isLoading: false,
            autoClose: 3000
          });
          
          router.push("/dashboards/admin-listofcourse");
        },
        onFail: (error) => {
          const errorMessage = error?.response?.data?.error?.message || 
                             error?.response?.data?.message || 
                             "Failed to publish course. Please try again.";
          
          toast.update(loadingToastId, {
            render: errorMessage,
            type: "error",
            isLoading: false,
            autoClose: 5000
          });
          console.error("Publishing course failed:", error);
        },
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleRemoveVideo = (index) => {
    const updatedCourseVideos = courseData.course_videos.filter((_, idx) => idx !== index);
    const updatedCourseData = {
      ...courseData,
      course_videos: updatedCourseVideos,
    };
    setCourseData(updatedCourseData);
    localStorage.setItem("courseData", JSON.stringify(updatedCourseData));
  };

  const handleRemoveImage = () => {
    const updatedCourseData = {
      ...courseData,
      course_image: null,
    };
    setCourseData(updatedCourseData);
    localStorage.setItem("courseData", JSON.stringify(updatedCourseData));
  };

  if (loading) return <Preloader />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">Course Preview</h1>
              {courseData?.course_title && (
                <span className="text-gray-500">|</span>
              )}
              <p className="text-gray-500 text-lg">{courseData?.course_title}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Edit
              </button>
              {courseData && (
                <button
                  onClick={handleSubmit}
                  className="flex items-center px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Publish Course
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {courseData && Object.keys(courseData).length > 0 ? (
          <div className="space-y-8">
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Side */}
              <div className="lg:col-span-2 space-y-8">
                {/* Course Image */}
                {courseData.course_image && (
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center">
                        <ImageIcon className="w-5 h-5 mr-2 text-gray-500" />
                        Course Thumbnail
                      </h3>
                      <button
                        onClick={handleRemoveImage}
                        className="text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="relative rounded-lg overflow-hidden">
                      <img
                        src={courseData.course_image}
                        alt="Course Thumbnail"
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Course Description */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold flex items-center mb-4">
                    <FileText className="w-5 h-5 mr-2 text-gray-500" />
                    Course Description
                  </h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {courseData.course_description || "No description provided"}
                    </p>
                  </div>
                </div>

                {/* Course Features */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold flex items-center mb-6">
                    <List className="w-5 h-5 mr-2 text-gray-500" />
                    Course Features
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className={`w-5 h-5 ${courseData.is_Certification === 'Yes' ? 'text-green-500' : 'text-gray-400'}`} />
                      <span>Certification</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className={`w-5 h-5 ${courseData.is_Assignments === 'Yes' ? 'text-green-500' : 'text-gray-400'}`} />
                      <span>Assignments</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className={`w-5 h-5 ${courseData.is_Projects === 'Yes' ? 'text-green-500' : 'text-gray-400'}`} />
                      <span>Projects</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className={`w-5 h-5 ${courseData.is_Quizes === 'Yes' ? 'text-green-500' : 'text-gray-400'}`} />
                      <span>Quizzes</span>
                    </div>
                  </div>
                </div>

                {/* Course Videos */}
                {courseData.course_videos?.length > 0 && (
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold flex items-center mb-4">
                      <Video className="w-5 h-5 mr-2 text-gray-500" />
                      Course Videos
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {courseData.course_videos.map((video, index) => (
                        <div key={index} className="relative">
                          <video
                            controls
                            className="w-full h-48 object-cover rounded-lg"
                            src={video}
                          >
                            Your browser does not support the video tag.
                          </video>
                          <button
                            onClick={() => handleRemoveVideo(index)}
                            className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Curriculum Section */}
                {courseData.curriculum_weeks?.length > 0 && (
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold flex items-center mb-6">
                      <BookOpen className="w-5 h-5 mr-2 text-gray-500" />
                      Course Curriculum
                    </h3>
                    <div className="space-y-6">
                      {courseData.curriculum_weeks.map((week, index) => (
                        <div key={index} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                          <h4 className="font-medium text-lg mb-3">{week.title}</h4>
                          <ul className="space-y-2 text-gray-600">
                            {week.topics.map((topic, topicIndex) => (
                              <li key={topicIndex} className="flex items-start">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2"></span>
                                <span>{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tools & Technologies Section */}
                {(courseData.tools_technologies?.length > 0 || courseData.bonus_modules?.length > 0) && (
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    {courseData.tools_technologies?.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold flex items-center mb-4">
                          <HelpingHand className="w-5 h-5 mr-2 text-gray-500" />
                          Tools & Technologies
                        </h3>
                        <ul className="grid grid-cols-2 gap-3">
                          {courseData.tools_technologies.map((tool, index) => (
                            <li key={index} className="flex items-center bg-gray-50 p-3 rounded-lg">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                              <span>{tool}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {courseData.bonus_modules?.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold flex items-center mb-4">
                          <Gift className="w-5 h-5 mr-2 text-gray-500" />
                          Bonus Modules
                        </h3>
                        <ul className="space-y-3">
                          {courseData.bonus_modules.map((module, index) => (
                            <li key={index} className="flex items-center bg-gray-50 p-3 rounded-lg">
                              <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 text-sm">
                                {index + 1}
                              </span>
                              <span>{module}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* FAQs Section */}
                {courseData.faqs?.length > 0 && (
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold flex items-center mb-6">
                      <MessageCircle className="w-5 h-5 mr-2 text-gray-500" />
                      Frequently Asked Questions
                    </h3>
                    <div className="space-y-6">
                      {courseData.faqs.map((faq, index) => (
                        <div key={index} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                          <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Course Mode Card - Remove duplicate */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold flex items-center mb-4">
                    <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                    Course Mode & Schedule
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">Mode</label>
                      <p className="font-medium">{courseData.category_type || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Session Duration</label>
                      <p className="font-medium">{courseData.session_duration || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Number of Sessions</label>
                      <p className="font-medium">{courseData.no_of_Sessions || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Efforts Required</label>
                      <p className="font-medium">{courseData.efforts_per_Week || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Sidebar */}
              <div className="space-y-8">
                {/* Basic Information Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold flex items-center mb-4">
                    <BookOpen className="w-5 h-5 mr-2 text-gray-500" />
                    Course Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">Category</label>
                      <p className="font-medium">{courseData.course_category || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Category Type</label>
                      <p className="font-medium">{courseData.category_type || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Course Grade</label>
                      <p className="font-medium">{courseData.course_grade || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Course Schedule Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold flex items-center mb-4">
                    <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                    Schedule
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <label className="text-sm text-gray-500">Session Duration</label>
                        <p className="font-medium">{courseData.session_duration || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <label className="text-sm text-gray-500">Number of Sessions</label>
                        <p className="font-medium">{courseData.no_of_Sessions || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Award className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <label className="text-sm text-gray-500">Course Duration</label>
                        <p className="font-medium">{courseData.online_sessions?.duration || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing Card */}
                {courseData.prices && (
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold flex items-center mb-4">
                      <DollarSign className="w-5 h-5 mr-2 text-gray-500" />
                      Pricing
                      <Tooltip content="Course pricing details">
                        <HelpCircle className="w-4 h-4 ml-2 text-gray-400 cursor-help" />
                      </Tooltip>
                    </h3>
                    {courseData.prices.map((price, index) => (
                      <div key={index} className="mb-4 last:mb-0">
                        <div className="text-sm font-medium text-gray-500 mb-2">
                          {price.currency}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <label className="text-sm text-gray-500">Individual</label>
                            <p className="text-lg font-semibold text-gray-900">
                              {price.individual || "0"}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <label className="text-sm text-gray-500">Batch</label>
                            <p className="text-lg font-semibold text-gray-900">
                              {price.batch || "0"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-blue-50 rounded-full">
                  <BookOpen className="w-12 h-12 text-blue-500" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Course Data Available</h3>
              <p className="text-gray-600 mb-8">To create a course, please ensure you have the following required information:</p>
              
              <div className="grid md:grid-cols-2 gap-6 text-left mb-8 max-w-xl mx-auto">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Course Category
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Course Title
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Category Type
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Course Mode
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Course Details</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Number of Sessions
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Session Duration
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Course Description
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Course Grade
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <button
                  onClick={() => router.push("/dashboards/admin-add-course")}
                  className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Create New Course
                </button>
                <p className="text-sm text-gray-500">
                  Need help? Check out our{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                    course creation guide
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// // pages/course-preview.js
// import React from "react";

// export default function CoursePreview() {
//   return (
//     <div className="flex items-center justify-center min-h-screen pt-9 bg-gray-100">
//       <div className="w-full max-w-6xl p-6 bg-white rounded-lg shadow-lg">
//         <h2 className="mb-6 text-2xl font-semibold text-gray-800">
//           Preview Course Details
//         </h2>

//         <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
//           {/* Full-width Category Field */}
//           <div className="col-span-2">
//             <label className="block mb-1 text-gray-600">Category</label>
//             <input
//               type="text"
//               value="Live"
//               readOnly
//               className="w-full p-2 border rounded-lg bg-gray-50 border-gray-300"
//             />
//           </div>

//           {/* Course Title and Category Type in the same row */}
//           <div>
//             <label className="block mb-1 text-gray-600">Course Title</label>
//             <input
//               type="text"
//               value="ABC"
//               readOnly
//               className="w-full p-2 border rounded-lg bg-gray-50 border-gray-300"
//             />
//           </div>
//           <div>
//             <label className="block mb-1 text-gray-600">
//               Category Type (Live/ Hybrid/ Pre-Recorded)
//             </label>
//             <input
//               type="text"
//               value="XYZ"
//               readOnly
//               className="w-full p-2 border rounded-lg bg-gray-50 border-gray-300"
//             />
//           </div>

//           {/* No. of Sessions and Duration in the same row */}
//           <div>
//             <label className="block mb-1 text-gray-600">No. of Sessions</label>
//             <input
//               type="text"
//               value="25"
//               readOnly
//               className="w-full p-2 border rounded-lg bg-gray-50 border-gray-300"
//             />
//           </div>
//           <div>
//             <label className="block mb-1 text-gray-600">
//               Duration (In months/ weeks)
//             </label>
//             <input
//               type="text"
//               value="4 weeks"
//               readOnly
//               className="w-full p-2 border rounded-lg bg-gray-50 border-gray-300"
//             />
//           </div>

//           {/* Session Duration and Course Description in the same row */}
//           <div>
//             <label className="block mb-1 text-gray-600">Session Duration</label>
//             <input
//               type="text"
//               value="50 minutes"
//               readOnly
//               className="w-full p-2 border rounded-lg bg-gray-50 border-gray-300"
//             />
//           </div>
//           <div>
//             <label className="block mb-1 text-gray-600">
//               Course Description
//             </label>
//             <input
//               type="text"
//               value="write description"
//               readOnly
//               className="w-full p-2 border rounded-lg bg-gray-50 border-gray-300"
//             />
//           </div>
//         </form>

//         <h3 className="mt-8 mb-4 text-xl font-semibold text-gray-800">
//           All Videos Uploaded
//         </h3>

//         <div className="p-4 border rounded-lg bg-gray-50 border-gray-300">
//           <div className="flex items-center gap-2">
//             {Array.from({ length: 6 }).map((_, index) => (
//               <div
//                 key={index}
//                 className="relative w-32 h-32 bg-gray-200 rounded-md overflow-hidden"
//               >
//                 <img
//                   src="/images/certificate.png"
//                   alt="Video thumbnail"
//                   className="object-cover w-full h-full"
//                 />
//                 <button className="absolute top-[-5px] right-[-2px] p-1 rounded-lg">
//                   <span className="text-red-500 font-bold">×</span>
//                 </button>
//               </div>
//             ))}
//           </div>
//           <div className="mt-4 flex items-center gap-2">
//             <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-customGreen"
//                 style={{ width: "100%" }}
//               ></div>
//             </div>
//             <span className="text-customGreen">✓</span>
//           </div>
//         </div>

//         <div className="flex justify-end mt-6 space-x-4">
//           <button className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg">
//             Cancel
//           </button>
//           <button className="px-4 py-2 font-semibold text-white bg-customGreen rounded-lg">
//             Publish
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
