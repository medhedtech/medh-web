"use client";
import { useEffect, useState } from "react";
import Qize from "@/assets/images/dashbord/quize.png";
import Image from "next/image";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import { FiFileText } from "react-icons/fi";
import { FaCertificate } from "react-icons/fa";

const CertificateCoursesEnroll = ({ onViewCertificate, setCertificateUrl }) => {
  const [certificateCourses, setCertificateCourses] = useState([]);
  const { getQuery, loading } = useGetQuery();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      fetchCertificateCourses(storedUserId);
    }
  }, []);

  const fetchCertificateCourses = (studentId) => {
    getQuery({
      url: `${apiUrls?.certificate?.getCertificatesByStudentId(studentId)}`,
      onSuccess: (data) => {
        const formattedData = data.map((item) => ({
          id: item._id,
          courseImage: item.course_id?.course_image || Qize,
          courseTitle: item.course_id?.course_title || "No Title Available",
          instructor: item.course_id?.assigned_instructor?.full_name || "N/A",
          completionDate: new Date(item.completion_date).toLocaleDateString(),
          certificateUrl: item.certificateUrl, // Add certificateUrl to data
        }));
        setCertificateCourses(formattedData);
      },
      onFail: (error) => {
        console.error("Failed to fetch certificate courses:", error);
      },
    });
  };

  const handleViewCertificate = (certificateUrl) => {
    if (certificateUrl) {
      setCertificateUrl(certificateUrl);
      onViewCertificate();
    } else {
      console.warn("No certificate available for this course.");
    }
  };

  if (loading) {
    return <p>Loading...</p>; // Add a proper loader if required.
  }

  return (
    <div className="px-7 rounded-lg max-w-full mx-auto">
      <h2 className="text-size-32 font-semibold mb-2 dark:text-white">
        Certificate Courses
      </h2>

      <div>
        {certificateCourses.length > 0 ? (
          <div className="space-y-4">
            {certificateCourses.map((course) => (
              <div
                key={course.id}
                className="p-5 shadow rounded-lg flex gap-4 items-start"
              >
                <Image
                  src={course.courseImage}
                  height={300}
                  width={200}
                  alt={course.courseTitle}
                  className="rounded-md w-[200px] h-full object-cover"
                />
                <div className="flex w-full justify-between">
                  <div>
                    <h3 className="text-xl text-[#171A1F] dark:text-white font-normal">
                      {course.courseTitle}
                    </h3>
                    <p className="text-[#9095A0]">
                      Instructor: {course.instructor}
                    </p>
                    <p className="text-[#9095A0]">
                      Completion Date: {course.completionDate}
                    </p>
                  </div>
                  <div
                    onClick={() => handleViewCertificate(course.certificateUrl)}
                    className="flex mt-20 gap-2 cursor-pointer text-primaryColor"
                  >
                    <span>
                      <svg
                        width="33"
                        height="32"
                        viewBox="0 0 33 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.8457 8.28613C9.2997 8.28613 3.3457 16.0001 3.3457 16.0001C3.3457 16.0001 9.2997 23.7151 16.8457 23.7151C22.6157 23.7151 30.3457 16.0001 30.3457 16.0001C30.3457 16.0001 22.6157 8.28613 16.8457 8.28613ZM16.8457 20.8061C14.1957 20.8061 12.0387 18.6501 12.0387 16.0001C12.0387 13.3501 14.1957 11.1931 16.8457 11.1931C19.4957 11.1931 21.6527 13.3501 21.6527 16.0001C21.6527 18.6501 19.4957 20.8061 16.8457 20.8061ZM16.8457 13.1941C16.4728 13.1871 16.1023 13.2545 15.7557 13.3923C15.4092 13.5301 15.0936 13.7356 14.8274 13.9969C14.5612 14.2581 14.3498 14.5697 14.2054 14.9136C14.0611 15.2575 13.9867 15.6267 13.9867 15.9996C13.9867 16.3726 14.0611 16.7418 14.2054 17.0857C14.3498 17.4295 14.5612 17.7412 14.8274 18.0024C15.0936 18.2636 15.4092 18.4692 15.7557 18.607C16.1023 18.7448 16.4728 18.8122 16.8457 18.8051C17.5806 18.7913 18.2807 18.4896 18.7955 17.965C19.3103 17.4403 19.5987 16.7347 19.5987 15.9996C19.5987 15.2646 19.3103 14.5589 18.7955 14.0343C18.2807 13.5097 17.5806 13.208 16.8457 13.1941Z"
                          fill="#7ECA9D"
                        />
                      </svg>
                    </span>
                    View Certificate
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col h-[50vh] items-center justify-center p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
            <FaCertificate
              className="text-gray-400 dark:text-gray-500 mb-4"
              size={80}
            />
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              No certificate available.
            </p>
            <p className="text-sm text-gray-500 pb-4 dark:text-gray-400 mt-2 text-center">
              It looks like there are no certificate available at the moment.
              Please check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateCoursesEnroll;
