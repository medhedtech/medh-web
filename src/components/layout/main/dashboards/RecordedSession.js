// import Image from "next/image";
// import React from "react";
// import AiMl from "@/assets/images/courses/Ai&Ml.jpeg";
// import Reactimg from "@/assets/images/courses/React.jpeg";
// import Os from "@/assets/images/courses/os.jpeg";
// import JavaScript from "@/assets/images/courses/javaScript.jpeg";

// const classes = [
//   {
//     id: 1,
//     course_image: AiMl,
//     meet_title: "AI & ML Masterclasses",
//     date: "21th October 2024",
//     time: "2:50 PM",
//   },
//   {
//     id: 2,
//     course_image: Reactimg,
//     meet_title: "React Masterclasses",
//     date: "21th October 2024",
//     time: "2:50 PM",
//   },
//   {
//     id: 3,
//     course_image: Os,
//     meet_title: "OS Masterclasses",
//     date: "21th October 2024",
//     time: "2:50 PM",
//   },
//   {
//     id: 4,
//     course_image: JavaScript,
//     meet_title: "JavaScript Masterclasses",
//     date: "21th October 2024",
//     time: "2:50 PM",
//   },
// ];
// const RecordedSession = () => {
//   return (
//     <div className="px-10 pb-12">
//       <div className="flex justify-between items-center  pt-4 mb-4">
//         <h2 className="text-2xl font-Open font-semibold dark:text-white text-gray-900">
//           Access Recorded Sessions Instructor
//         </h2>
//         <a href="#" className="text-green-500 hover:underline">
//           View All
//         </a>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {classes.map((classItem) => (
//           <div
//             key={classItem.id}
//             className="bg-white dark:border dark:text-white dark:bg-inherit shadow rounded-lg p-4"
//           >
//             <div className="rounded overflow-hidden">
//               <Image
//                 src={classItem.course_image}
//                 alt={classItem.meet_title}
//                 className="w-full h-40 object-cover"
//                 width={300}
//                 height={150}
//               />
//             </div>
//             <h3 className="mt-2 font-semibold dark:text-white text-gray-800">
//               {classItem.meet_title}
//             </h3>
//             <p className="text-gray-600 text-sm">Date: {classItem.date}</p>
//             <div className="flex items-center text-sm text-orange-500 mt-1">
//               <svg
//                 width="15"
//                 height="15"
//                 viewBox="0 0 15 15"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="mr-1"
//               >
//                 <circle cx="7.5" cy="7.5" r="7" stroke="orange" />
//                 <path d="M7.5 3v5h3" stroke="orange" />
//               </svg>
//               {classItem.time}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
// export default RecordedSession;

"use client"
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import Image from "next/image";
import React, { useState, useEffect } from "react";

const RecordedSession = () => {
  const [instructorId, setInstructorId] = useState("6757cb3c8071784d1d67c28f");
  const [preRecordedClasses, setPreRecordedClasses] = useState([]);

  const { getQuery, loading } = useGetQuery();

  // Fetch instructor ID from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setInstructorId(storedUserId);
      } else {
        console.error("No instructor ID found in localStorage");
      }
    }
  }, []);

  // Fetch pre-recorded classes
  useEffect(() => {
    if (instructorId) {
      const fetchPreRecordedClasses = () => {
        getQuery({
          url: `${apiUrls?.onlineMeeting?.getMeetingsByInstructorId}/${instructorId}`,
          onSuccess: (res) => {
            const preRecorded = res.meetings?.filter(
              (classItem) => classItem.courseDetails?.course_tag === "Pre-Recorded"
            );
            setPreRecordedClasses(preRecorded || []);
          },
          onFail: (err) => {
            console.error("Error fetching pre-recorded classes:", err);
          },
        });
      };

      fetchPreRecordedClasses();
    }
  }, [instructorId]);

  // Utility function to format the date
  const formatDateWithOrdinal = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();

    // Add ordinal suffix to the day
    const ordinal =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";

    return `${day}${ordinal} ${month} ${year}`;
  };

  // Utility function to format the time to 12-hour format with AM/PM
  const formatTimeWithAmPm = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours, minutes);

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="px-10 pb-12">
      <div className="flex justify-between items-center pt-4 mb-4">
        <h2 className="text-2xl font-Open font-semibold dark:text-white text-gray-900">
          Access Recorded Sessions Instructor
        </h2>
        <a href="/dashboards/instructor-class/access-recorded-sessions" className="text-green-500 hover:underline">
          View All
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {preRecordedClasses.map((classItem) => (
          <div
            key={classItem._id}
            className="bg-white dark:border dark:text-white dark:bg-inherit shadow rounded-lg p-4"
          >
            {/* Class Image */}
            <div className="rounded overflow-hidden">
              <Image
                src={classItem.courseDetails?.course_image || "/default-image.jpg"}
                alt={classItem.meet_title || "Pre-Recorded Class"}
                className="w-full h-40 object-cover"
                width={300}
                height={150}
              />
            </div>
            {/* Class Details */}
            <h3 className="mt-2 font-semibold dark:text-white text-gray-800">
              {classItem.meet_title || "Untitled Class"}
            </h3>
            <p className="text-gray-600 text-sm">
              Date: {formatDateWithOrdinal(classItem.date) || "Not specified"}
            </p>
            <div className="flex items-center text-sm text-orange-500 mt-1">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1"
              >
                <circle cx="7.5" cy="7.5" r="7" stroke="orange" />
                <path d="M7.5 3v5h3" stroke="orange" />
              </svg>
              {/* Format time */}
              {formatTimeWithAmPm(classItem.time) || "Not specified"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecordedSession;