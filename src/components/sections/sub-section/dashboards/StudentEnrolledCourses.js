// "use client";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { apiUrls } from "@/apis";
// import useGetQuery from "@/hooks/getQuery.hook";
// import img3 from "@/assets/images/resources/img3.png";
// import img5 from "@/assets/images/resources/img5.png";
// import PDFImage from "@/assets/images/dashbord/bxs_file-pdf.png";
// import Preloader from "@/components/shared/others/Preloader";

// const StudentEnrolledCourses = () => {
//   const [currentTab, setCurrentTab] = useState(0);
//   const [enrolledCourses, setEnrolledCourses] = useState([]);
//   const [liveCourses, setLiveCourses] = useState([]);
//   const [selfPacedCourses, setSelfPacedCourses] = useState([]);
//   const { getQuery, loading } = useGetQuery();

//   useEffect(() => {
//     const storedUserId = localStorage.getItem("userId");
//     if (storedUserId) {
//       fetchEnrolledCourses(storedUserId);
//       fetchSelfPacedCourses(storedUserId);
//     }
//   }, []);

//   const fetchEnrolledCourses = (studentId) => {
//     getQuery({
//       url: `${apiUrls?.EnrollCourse?.getEnrolledCoursesByStudentId}/${studentId}`,
//       onSuccess: (data) => {
//         const allCourses = data.map((enrollment) => enrollment.course_id);
//         setEnrolledCourses(allCourses);

//         // Filter live courses based on category
//         const liveCoursesFiltered = allCourses.filter(
//           (course) => course.course_category === "Live Courses"
//         );
//         setLiveCourses(liveCoursesFiltered);
//       },
//       onFail: (error) => {
//         console.error("Failed to fetch enrolled courses:", error);
//       },
//     });
//   };

//   const fetchSelfPacedCourses = (studentId) => {
//     getQuery({
//       url: `${apiUrls?.Membership?.getMembershipBbyStudentId}/${studentId}`,
//       onSuccess: (data) => {
//         const courses = data?.memberships?.flatMap((membership) =>
//           membership.courses.map((course) => ({
//             course_title: course.course_title,
//             assigned_instructor: course.assigned_instructor?.full_name || "N/A",
//             brochures: course.brochures || [],
//           }))
//         );
//         setSelfPacedCourses(courses || []);
//       },
//       onFail: (error) => {
//         console.error("Failed to fetch self-paced courses:", error);
//       },
//     });
//   };

//   const tabs = [
//     { name: "Enrolled Courses", content: enrolledCourses },
//     { name: "Live Courses", content: liveCourses },
//     { name: "Self-Paced Courses", content: selfPacedCourses },
//   ];

//   if (loading) {
//     return <Preloader />;
//   }

//   return (
//     <div className="p-12 rounded-lg max-w-full mx-auto font-Open">
//       <h2 className="text-3xl font-semibold mb-8 font-Open dark:text-white">
//         Course Resources
//       </h2>

//       {/* Tab Buttons */}
//       <div className="flex mb-6">
//         {tabs.map((tab, idx) => (
//           <button
//             key={idx}
//             onClick={() => setCurrentTab(idx)}
//             className={`px-4 py-2 font-medium text-lg ${
//               currentTab === idx
//                 ? "text-[#7ECA9D] border-2 border-[#7ECA9D] rounded-[36px]"
//                 : "text-gray-500"
//             }`}
//           >
//             {tab.name}
//           </button>
//         ))}
//       </div>

//       {/* Tab Content */}
//       <div>
//         {tabs.map((tab, idx) => (
//           <div key={idx} className={idx === currentTab ? "block" : "hidden"}>
//             {tab.content.length > 0 ? (
//               <div className="space-y-4">
//                 {tab.content.map((course, index) => (
//                   <div
//                     key={index}
//                     className="p-5 bg-white dark:bg-inherit dark:border shadow rounded-lg flex gap-4 items-start font-Open"
//                   >
//                     <Image
//                       src={course?.course_image || img5} // Fallback to img5 if course_image is undefined
//                       alt={course?.course_title || "Course Image"} // Fallback for alt text
//                       width={100}
//                       height={100}
//                       className="rounded-md object-cover"
//                     />
//                     <div>
//                       <h3 className="text-xl text-[#171A1F] font-normal font-Open dark:text-white">
//                         {course?.course_title || "No Title Available"}
//                       </h3>
//                       <p className="text-[#9095A0]">
//                         Instructor:{" "}
//                         {course?.assigned_instructor?.full_name || "N/A"}
//                       </p>
//                       <p className="text-[#9095A0]">
//                         Categories:{" "}
//                         {course?.category_ids
//                           ?.map((category) => category.category_name)
//                           .join(", ") || "N/A"}
//                       </p>
//                       <a
//                         href={course?.brochures?.[0] || PDFImage}
//                         className="text-[#7ECA9D] font-medium flex items-center mt-2 hover:underline font-Open"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         <Image
//                           src={img3}
//                           width={20}
//                           height={20}
//                           alt="Download"
//                           className="rounded-md object-cover mr-2"
//                         />
//                         Download Course Materials
//                       </a>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-500">No courses available in this tab.</p>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default StudentEnrolledCourses;

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

const StudentEnrolledCourses = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [liveCourses, setLiveCourses] = useState([]);
  const [selfPacedCourses, setSelfPacedCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { getQuery, loading } = useGetQuery();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      fetchEnrolledCourses(storedUserId);
      fetchSelfPacedCourses(storedUserId);
    }
  }, []);

  const fetchEnrolledCourses = (studentId) => {
    getQuery({
      url: `${apiUrls?.EnrollCourse?.getEnrolledCoursesByStudentId}/${studentId}`,
      onSuccess: (data) => {
        const allCourses = data.map((enrollment) => enrollment.course_id);
        setEnrolledCourses(allCourses);

        // Filter live courses based on category
        const liveCoursesFiltered = allCourses.filter(
          (course) => course.course_tag === "Live"
        );

        console.log("Live courses only:", liveCoursesFiltered);
        setLiveCourses(liveCoursesFiltered);
      },
      onFail: (error) => {
        console.error("Failed to fetch enrolled courses:", error);
      },
    });
  };

  // const fetchSelfPacedCourses = (studentId) => {
  //   getQuery({
  //     url: `${apiUrls?.Membership?.getMembershipBbyStudentId}/${studentId}`,
  //     onSuccess: (response) => {
  //       console.log("Self-paced courses response:", response);
  //       const courses = response?.data;
  //       console.log("Flattened courses:", courses);
  //       setSelfPacedCourses(courses || []);
  //     },
  //     onFail: (error) => {
  //       console.error("Failed to fetch self-paced courses:", error);
  //     },
  //   });
  // };

  const fetchSelfPacedCourses = (studentId) => {
    getQuery({
      url: `${apiUrls?.Membership?.getMembershipBbyStudentId}/${studentId}`,
      onSuccess: (response) => {
        console.log("Self-paced courses response:", response);

        // Extract the enrolled courses
        const enrolledCourses = response?.enrolled_courses || [];

        // Filter courses where is_self_paced is true
        const selfPacedCourses = enrolledCourses
          .filter((course) => course.is_self_paced === true)
          .map((course) => ({
            course_title: course.course_id?.course_title || "N/A",
            assigned_instructor:
              course.course_id?.assigned_instructor?.full_name ||
              "No instructor",
            category:
              response?.data
                ?.find((membership) =>
                  membership.category_ids.some(
                    (category) =>
                      category.category_name === course.course_id?.category
                  )
                )
                ?.category_ids.map((cat) => cat.category_name)
                .join(", ") || "N/A",
            resource_pdfs: course.course_id?.resource_pdfs || [],
            resource_videos: course.course_id?.resource_videos || [],
          }));

        console.log("Processed self-paced courses:", selfPacedCourses);

        // Set the processed self-paced courses
        setSelfPacedCourses(selfPacedCourses);
      },
      onFail: (error) => {
        console.error("Failed to fetch self-paced courses:", error);
      },
    });
  };

  const tabs = [
    { name: "Enrolled Courses", content: enrolledCourses },
    { name: "Live Courses", content: liveCourses },
    { name: "Self-Paced Courses", content: selfPacedCourses },
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
                        height={100}
                        className="rounded-md object-cover"
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

export default StudentEnrolledCourses;
