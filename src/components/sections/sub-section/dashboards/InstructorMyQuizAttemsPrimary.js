"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AssignmentModal from "@/components/shared/assignmenet-modal";

const activities = [
  {
    id: 1,
    title: "Create Quiz",
    link: "/dashboards/instructor-my-quiz-attempts/create-quiz",
    icon: (
      <svg
        width="17"
        height="20"
        viewBox="0 0 17 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.96156 14.7994H3.00156V15.9994H3.96156C4.32156 15.9994 4.56156 15.7594 4.56156 15.3994C4.56156 15.0394 4.32156 14.7994 3.96156 14.7994ZM10.2016 0.399414H0.601562V19.5994H16.2016V6.39941L10.2016 0.399414ZM5.64156 15.5194C5.64156 16.4794 4.92156 17.1994 3.96156 17.1994H3.00156V18.3994H1.80156V13.5994H3.96156C4.92156 13.5994 5.64156 14.3194 5.64156 15.2794V15.5194ZM10.5616 16.1194C10.5616 17.3194 9.60156 18.3994 8.28156 18.3994H6.60156V13.5994H8.28156C9.48156 13.5994 10.5616 14.5594 10.5616 15.8794V16.1194ZM15.0016 14.7994H12.6016V15.9994H14.4016V17.1994H12.6016V18.3994H11.4016V13.5994H15.0016V14.7994ZM15.0016 12.3994H1.80156V1.59941H10.2016V6.39941H15.0016V12.3994ZM8.28156 14.7994H7.80156V17.1994H8.28156C9.00156 17.1994 9.48156 16.7194 9.48156 15.9994C9.48156 15.2794 8.88156 14.7994 8.28156 14.7994Z"
          fill="#7ECA9D"
        />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Create Assignment",
    link: "", // Keep link empty to open the modal
    icon: (
      <svg
        width="25"
        height="24"
        viewBox="0 0 25 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.5 1.00098H17.5V3.00098H21.5V23.001H3.5V3.00098H7.5V1.00098ZM7.5 5.00098H5.5V21.001H19.5V5.00098H17.5V7.00098H7.5V5.00098ZM15.5 3.00098H9.5V5.00098H15.5V3.00098ZM9.5 11.001H15.5V13.001H9.5V11.001ZM9.5 15.001H15.5V17.001H9.5V15.001Z"
          fill="#7ECA9D"
        />
      </svg>
    ),
  },
  {
    id: 3,
    title: "View Submitted Assignment",
    link: "/dashboards/instructor-view-assignments",
    icon: (
      <svg
        width="25"
        height="24"
        viewBox="0 0 25 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.5 1.00098H17.5V3.00098H21.5V23.001H3.5V3.00098H7.5V1.00098ZM7.5 5.00098H5.5V21.001H19.5V5.00098H17.5V7.00098H7.5V5.00098ZM15.5 3.00098H9.5V5.00098H15.5V3.00098ZM9.5 11.001H15.5V13.001H9.5V11.001ZM9.5 15.001H15.5V17.001H9.5V15.001Z"
          fill="#7ECA9D"
        />
      </svg>
    ),
  },
];

const ActivityCard = ({ activity, onClick }) => (
  <div
    onClick={onClick}
    className="flex flex-col items-center justify-center bg-white shadow-md rounded-lg py-6  border border-gray-200 hover:shadow-lg transition cursor-pointer"
  >
    {activity.icon}
    <p className="mt-4 text-[#7ECA9D] font-bold text-center text-size-15">
      {activity.title}
    </p>
  </div>
);

const InstructorMyQuizAttemsPrimary = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (link, id) => {
    if (id === 2) {
      setIsModalOpen(true); // Open modal for Create Assignment
    } else if (link) {
      router.push(link);
    }
  };

  return (
    <div className="px-6 pb-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Assign Activity
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onClick={() => handleClick(activity.link, activity.id)}
          />
        ))}
      </div>
      <AssignmentModal
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default InstructorMyQuizAttemsPrimary;
