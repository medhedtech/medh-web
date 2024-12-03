"use client";
import { apiUrls } from "@/apis";
import Preloader from "@/components/shared/others/Preloader";
import usePostQuery from "@/hooks/postQuery.hook";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function CoursePreview() {
  const router = useRouter();
  const [courseData, setCourseData] = useState(null);
  const { postQuery, loading } = usePostQuery();

  useEffect(() => {
    const storedData = localStorage.getItem("courseData");
    if (storedData) {
      setCourseData(JSON.parse(storedData));
    }
  }, []);

  const handleSubmit = async () => {
    try {
      const postData = {
        ...courseData,
        course_videos: courseData?.course_videos || [],
        brochures: courseData?.brochures || [],
        course_image: courseData?.course_image,
        curriculum: courseData?.curriculum,
      };
      await postQuery({
        url: apiUrls?.courses?.createCourse,
        postData,
        onSuccess: () => {
          try {
            localStorage.removeItem("courseData");
            router.push("/dashboards/admin-listofcourse");
            toast.success("Course added successfully!");
          } catch (error) {
            console.error("Error in onSuccess callback:", error);
            toast.error("Error during success callback.");
          }
        },
        onFail: (error) => {
          try {
            toast.error("Adding course failed. Please try again.");
            console.log("Adding course failed:", error);
          } catch (error) {
            console.error("Error in onFail callback:", error);
          }
        },
      });
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  if (loading) return <Preloader />;

  const handleRemoveVideo = (index) => {
    const updatedCourseVideos = courseData.course_videos.filter(
      (_, idx) => idx !== index
    );
    const updatedCourseData = {
      ...courseData,
      course_videos: updatedCourseVideos,
    };
    setCourseData(updatedCourseData);
    localStorage.setItem("courseData", JSON.stringify(updatedCourseData));
  };

  console.log("Course Data", courseData);
  console.log("Course Video", courseData?.course_videos);
  console.log("Course Image:", courseData?.course_image);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-9">
      <div className="w-full max-w-6xl bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Preview Course Details
        </h2>

        {courseData ? (
          <form className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-gray-600 mb-2">Category</label>
                <input
                  type="text"
                  value={courseData.course_category || ""}
                  readOnly
                  className="w-full p-3 border rounded-lg bg-gray-50 border-gray-300"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-2">
                  Course Category
                </label>
                <input
                  type="text"
                  value={courseData.category || ""}
                  readOnly
                  className="w-full p-3 border rounded-lg bg-gray-50 border-gray-300"
                />
              </div>

            <div>
              <label className="block text-gray-600 mb-2">Course Title</label>
              <input
                type="text"
                value={courseData.course_title || ""}
                readOnly
                className="w-full p-3 border rounded-lg bg-gray-50 border-gray-300"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-2">
                Category Type (Live/ Hybrid/ Pre-Recorded)
              </label>
              <input
                type="text"
                value={courseData.course_tag || ""}
                readOnly
                className="w-full p-3 border rounded-lg bg-gray-50 border-gray-300"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-2">
                No. of Sessions
              </label>
              <input
                type="text"
                value={courseData.no_of_Sessions || ""}
                readOnly
                className="w-full p-3 border rounded-lg bg-gray-50 border-gray-300"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-2">
                Duration (In months/ weeks)
              </label>
              <input
                type="text"
                value={courseData.course_duration || ""}
                readOnly
                className="w-full p-3 border rounded-lg bg-gray-50 border-gray-300"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-2">
                Session Duration
              </label>
              <input
                type="text"
                value={courseData.session_duration || ""}
                readOnly
                className="w-full p-3 border rounded-lg bg-gray-50 border-gray-300"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-2">
                Course Description
              </label>
              <input
                type="text"
                value={courseData.course_description || ""}
                readOnly
                className="w-full p-3 border rounded-lg bg-gray-50 border-gray-300"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-2">Course Fee</label>
              <input
                type="text"
                value={courseData.course_fee || "0"}
                readOnly
                className="w-full p-3 border rounded-lg bg-gray-50 border-gray-300"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-2">Course Grade</label>
              <input
                type="text"
                value={courseData.course_grade || ""}
                readOnly
                className="w-full p-3 border rounded-lg bg-gray-50 border-gray-300"
              />
            </div>
          </form>
        ) : (
          <p className="text-red-500 mt-4">No course data available</p>
        )}

        <h3 className="mt-10 text-xl font-semibold text-gray-800 mb-4">
          All Videos/Images Uploaded
        </h3>
        {courseData?.course_image ||
        (courseData?.course_videos && courseData.course_videos.length > 0) ? (
          <div className="grid grid-cols-6 gap-4 mb-4">
            {courseData?.course_image && (
              <div className="relative">
                <img
                  src={courseData.course_image}
                  alt="Course Thumbnail"
                  className="w-[150px] h-[150px] object-cover rounded-lg"
                />
              </div>
            )}
            {courseData?.course_videos &&
              courseData.course_videos.map((video, index) => (
                <div key={index} className="relative">
                  <video
                    width={150}
                    height={150}
                    controls
                    src={video}
                    className="w-full h-[150px] object-cover rounded-lg"
                  >
                    Your browser does not support the video tag.
                  </video>
                  <button
                    onClick={() => handleRemoveVideo(index)}
                    className="absolute -top-1 -right-2 text-white bg-red-600 rounded-full w-8 h-8"
                  >
                    X
                  </button>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-600">No image or videos uploaded</p>
        )}

        {/* Progress bar */}
        <div className="w-full h-2 rounded-lg bg-gray-200 mt-4">
          <div
            className="h-2 bg-green-400 rounded-lg"
            style={{ width: "100%" }}
          ></div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-8 space-x-4">
          <button
            onClick={() => {
              router.back();
              // localStorage.removeItem("courseData");
            }}
            className="px-6 py-3 font-semibold text-gray-700 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 font-semibold text-white bg-green-600 rounded-lg"
          >
            Publish
          </button>
        </div>
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
