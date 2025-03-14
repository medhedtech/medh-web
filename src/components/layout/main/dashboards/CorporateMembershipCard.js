"use client";
import React, { useState, useEffect } from "react";
import StudentMainMembership from "./studentMainMembership";
import Image from "next/image";
import MembershipModal from "./MembershipModal";
import SubscriptionLogo from "@/assets/images/student-dashboard/subscription.svg";
import ClockLogo from "@/assets/images/student-dashboard/clock.svg";
import VideoClass from "@/assets/images/student-dashboard/video-class.svg";
import FallBackUrl from "@/assets/images/courses/image1.png";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";

const CorporateMembershipCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [courses, setCourses] = useState([]);
  const { getQuery } = useGetQuery();
  const [memberships, setMemberships] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [membershipDetails, setMembershipDetails] = useState();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      setStudentId(storedUserId);
    }

    const fetchCourses = () => {
      try {
        getQuery({
          url: apiUrls?.courses?.getAllCourses,
          onSuccess: (res) => {
            setCourses(res || []);
          },
          onFail: (err) => {
            console.error("Error fetching courses:", err);
          },
        });
      } catch (err) {
        console.error(err);
        
      } 
    };

    fetchCourses();
  }, []);

  // Fetch memberships using useGetQuery
  useEffect(() => {
    const fetchMemberships = () => {
      if (hasFetched) return;

      getQuery({
        url: `${apiUrls?.Membership?.getMembershipBbyStudentId}/${studentId}`,
        onSuccess: (res) => {
          // Ensure memberships are extracted from the response structure
          setMemberships(res?.data || []);
          setHasFetched(true);
          console.log("Membership data: ", res?.data);

          const memberships = res?.data || [];
          const membershipDetails = memberships.map((membership) => {
            const categoryNames =
              membership.category_ids?.map(
                (category) => category.category_name
              ) || [];
            console.log("All Categories: ", categoryNames);

            const groupedCourses = categoryNames.map((category) =>
              courses.filter((course) => course.category === category)
            );
            console.log("grouped Courses: ", groupedCourses);

            const enrolledCourses = groupedCourses.flat();
            console.log("Enrolled Courses: ", enrolledCourses);

            return {
              ...membership,
              courses: enrolledCourses,
            };
          });

          console.log("Membership Details: ", membershipDetails);
          setMembershipDetails(membershipDetails);
        },
        onFail: (err) => {
          console.error("Error fetching memberships:", err);
        },
      });
    };

    // if (studentId && !hasFetched && courses.length > 0) {
      fetchMemberships();
    // }
  }, [studentId, courses]);


  return (
    <section className="py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-8 font-Open">
          <h2 className="text-3xl font-bold text-gray-800 font-Open dark:text-white">
            Membership
          </h2>
          <button
            className="flex items-center bg-[#FCA400] gap-x-2 text-white font-bold py-2 px-4 rounded-3xl hover:bg-orange-600 transition font-Open"
            onClick={() => setIsModalOpen(true)}
          >
            <Image src={SubscriptionLogo} width={30} alt="Subscription Logo" />
            <p>Upgrade Membership</p>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {membershipDetails?.map((membership) =>
            membership.courses.map((course) => (
              <StudentMainMembership
                key={
                  course.course_id || `${membership._id}-${course.course_title}`
                }
                courseCategory={course.category}
                courseImage={course.course_image}
                title={course.course_title}
                typeLabel={
                  course.course_category === "Live Courses"
                    ? "Certificate"
                    : "Diploma"
                }
                sessions={course.no_of_Sessions}
                duration={course.course_duration}
                sessionDuration={course.session_duration}
                membershipName={
                  membership.plan_type.charAt(0).toUpperCase() +
                  membership.plan_type.slice(1).toLowerCase()
                }
                expiryDate={membership.expiry_date}
                iconVideo={VideoClass}
                iconClock={ClockLogo}
                fallbackImage={FallBackUrl}
              />
            ))
          )}
        </div>
      </div>

      {/* Membership Modal */}
      <MembershipModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default CorporateMembershipCard;
