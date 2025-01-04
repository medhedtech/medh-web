"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import img3 from "@/assets/images/resources/img3.png";
import img5 from "@/assets/images/resources/img5.png";
import PDFImage from "@/assets/images/dashbord/bxs_file-pdf.png";
import Preloader from "@/components/shared/others/Preloader";
import { AiOutlineDownload, AiOutlineClose } from "react-icons/ai";

const CorporateEnrolledCourses = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [liveCourses, setLiveCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { getQuery, loading } = useGetQuery();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      fetchEnrolledCourses(storedUserId);
    }
  }, []);

  const fetchEnrolledCourses = (studentId) => {
    getQuery({
      url: `${apiUrls?.CoorporateEnrollCourse?.getEnrolledCoursesByEmployeeId}/${studentId}`,
      onSuccess: (data) => {
        if (data.success) {
          const allCourses = data.courses;
          setEnrolledCourses(allCourses);

          // Filter live courses based on category
          const liveCoursesFiltered = allCourses.filter(
            (course) => course.course_category === "Live Courses"
          );
          setLiveCourses(liveCoursesFiltered);
        } else {
          console.error("API returned an error:", data.message);
        }
      },
      onFail: (error) => {
        console.error("Failed to fetch enrolled courses:", error);
      },
    });
  };

  const tabs = [
    { name: "Enrolled Courses", content: enrolledCourses },
    { name: "Live Courses", content: liveCourses },
  ];

  const handleDownload = (course) => {
    setSelectedCourse(course);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
  };

  const renderMaterialDownloadLinks = (course) => {
    // Function to download the file
    const handleDownload = (fileUrl, fileName) => {
      // Create an invisible anchor tag to trigger the download
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName;

      // Append the link to the body and trigger a click on it
      document.body.appendChild(link);
      link.click();

      // Clean up and remove the link after download trigger
      document.body.removeChild(link);
    };

    return (
      <div className="space-y-4">
        {/* Loop through video resources */}
        {course?.resource_videos?.map((video, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center space-x-2"
          >
            <div className="flex items-center space-x-2">
              <Image
                src={img3}
                width={20}
                height={20}
                alt="Download Video"
                className="object-cover"
              />
              <span>Download Video {idx + 1}</span>
            </div>
            <button
              onClick={() => handleDownload(video, `video_${idx + 1}.mp4`)}
              className="text-[#7ECA9D] hover:underline"
            >
              <AiOutlineDownload size={20} className="text-[#7ECA9D]" />
            </button>
          </div>
        ))}

        {/* Loop through PDF resources */}
        {course?.resource_pdfs?.map((pdf, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center space-x-2"
          >
            <div className="flex items-center space-x-2">
              <Image
                src={PDFImage}
                width={20}
                height={20}
                alt="Download PDF"
                className="object-cover"
              />
              <span>Download PDF {idx + 1}</span>
            </div>
            <button
              onClick={() => handleDownload(pdf, `document_${idx + 1}.pdf`)}
              className="text-[#7ECA9D] hover:underline"
            >
              <AiOutlineDownload size={20} className="text-[#7ECA9D]" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="p-12 rounded-lg max-w-full mx-auto font-Open">
      <h2 className="text-3xl font-semibold mb-8 font-Open dark:text-white">
        Course Resources
      </h2>

      {/* Tab Buttons */}
      <div className="flex mb-6">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentTab(idx)}
            className={`px-4 py-2 font-medium text-lg ${
              currentTab === idx
                ? "text-[#7ECA9D] border-2 border-[#7ECA9D] rounded-[36px]"
                : "text-gray-500"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {tabs.map((tab, idx) => (
          <div key={idx} className={idx === currentTab ? "block" : "hidden"}>
            {tab.content.length > 0 ? (
              <div className="space-y-4">
                {tab.content.map((course, index) => {
                  console.log("course title data:", course);
                  return (
                    <div
                      key={index}
                      className="p-5 bg-white dark:bg-inherit dark:border shadow rounded-lg flex gap-4 items-start font-Open"
                    >
                      <Image
                        src={course?.course_image || img5}
                        alt={course?.course_title || "Course Image"}
                        width={100}
                        height={120}
                        className="rounded-md h-[120px] object-cover"
                      />
                      <div>
                        <h3 className="text-xl text-[#171A1F] font-normal font-Open dark:text-white">
                          {course?.course_title || "No Title Available"}
                        </h3>
                        <p className="text-[#9095A0]">
                          Instructor:{" "}
                          {course?.assigned_instructor?.full_name || "N/A"}
                        </p>
                        <p className="text-[#9095A0]">
                          Category: {course?.category || "N/A"}
                        </p>
                        <button
                          className="text-[#7ECA9D] font-medium mt-2"
                          onClick={() => handleDownload(course)}
                        >
                          Course Materials
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">No courses available in this tab.</p>
            )}
          </div>
        ))}
      </div>

      {/* Modal for Downloading Materials */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <h3 className="text-xl font-semibold mb-4">
              Course Materials - {selectedCourse?.course_title}
            </h3>

            {/* Render the download links */}
            {renderMaterialDownloadLinks(selectedCourse)}

            {/* Close button with the X icon */}
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 text-xl text-gray-700 hover:text-gray-800"
            >
              <AiOutlineClose />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorporateEnrolledCourses;
