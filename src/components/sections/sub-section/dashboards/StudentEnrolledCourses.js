"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import img3 from "@/assets/images/resources/img3.png";
import img5 from "@/assets/images/resources/img5.png";
import PDFImage from "@/assets/images/dashbord/bxs_file-pdf.png";
import Preloader from "@/components/shared/others/Preloader";

const StudentEnrolledCourses = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [liveCourses, setLiveCourses] = useState([]);
  const [selfPacedCourses, setSelfPacedCourses] = useState([]);
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
          (course) => course.course_category === "Live Courses"
        );
        setLiveCourses(liveCoursesFiltered);
      },
      onFail: (error) => {
        console.error("Failed to fetch enrolled courses:", error);
      },
    });
  };

  const fetchSelfPacedCourses = (studentId) => {
    getQuery({
      url: `${apiUrls?.Membership?.getMembershipBbyStudentId}/${studentId}`,
      onSuccess: (data) => {
        const courses = data?.memberships?.flatMap((membership) =>
          membership.courses.map((course) => ({
            course_title: course.course_title,
            assigned_instructor: course.assigned_instructor?.full_name || "N/A",
            brochures: course.brochures || [],
          }))
        );
        setSelfPacedCourses(courses || []);
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
                {tab.content.map((course, index) => (
                  <div
                    key={index}
                    className="p-5 bg-white dark:bg-inherit dark:border shadow rounded-lg flex gap-4 items-start font-Open"
                  >
                    <Image
                      src={course.course_image || img5}
                      alt={course.course_title}
                      width={100}
                      height={100}
                      className="rounded-md object-cover"
                    />
                    <div>
                      <h3 className="text-xl text-[#171A1F] font-normal font-Open dark:text-white">
                        {course.course_title}
                      </h3>
                      <p className="text-[#9095A0]">
                        Instructor:{" "}
                        {course.assigned_instructor?.full_name || "N/A"}
                      </p>
                      <a
                        href={course.brochures?.[0] || PDFImage}
                        className="text-[#7ECA9D] font-medium flex items-center mt-2 hover:underline font-Open"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          src={img3}
                          width={20}
                          height={20}
                          alt="Download"
                          className="rounded-md object-cover mr-2"
                        />
                        Download Course Materials
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No courses available in this tab.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentEnrolledCourses;
