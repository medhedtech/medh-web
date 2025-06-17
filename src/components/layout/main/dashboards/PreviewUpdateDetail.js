"use client";
import { apiUrls } from "@/apis";
import Preloader from "@/components/shared/others/Preloader";
import usePostQuery from "@/hooks/postQuery.hook";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function UpdateCoursePreview() {
  const router = useRouter();
  const courseId = useParams().courseId;
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
      };
      await postQuery({
        url: `${apiUrls?.courses?.updateCourse}/${courseId}`,
        postData,
        onSuccess: () => {
          try {
            localStorage.removeItem("courseData");
            router.push("/dashboards/admin-listofcourse");
            showToast.success("Course Updated successfully!");
          } catch (error) {
            console.error("Error in onSuccess callback:", error);
            toast.error("Error during success callback.");
          }
        },
        onFail: (error) => {
          try {
            toast.error("Updating course failed. Please try again.");
            console.log("Updating course failed:", error);
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

  const handleRemoveImage = (index) => {
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
          Update Course Details
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
                value={courseData.course_fee || ""}
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
                {/* <button
                  onClick={handleRemoveImage}
                  className="absolute -top-1 -right-2 text-white bg-red-600 rounded-full w-8 h-8"
                >
                  X
                </button> */}
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
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
