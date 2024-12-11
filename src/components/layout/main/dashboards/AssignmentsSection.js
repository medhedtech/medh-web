import React, { useEffect, useState } from "react";
import AssignmentCard from "./AssignmentCard";
import Qize from "@/assets/images/dashbord/quize.png";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import Preloader from "@/components/shared/others/Preloader";

const AssignmentsSection = ({ onQuizClick }) => {
  const { getQuery, loading } = useGetQuery();
  const [assignments, setAssignments] = useState();

  useEffect(() => {
    getQuery({
      url: apiUrls?.assignments?.getAssignments,
      onSuccess: (data) => {
        setAssignments(data);
        console.log(data, "Svhfdh");
      },
    });
  }, []);

  if (loading) return <Preloader />;

  const calculateDaysLeft = (deadline) => {
    const deadlineDate = new Date(deadline); // Convert to Date object
    const currentDate = new Date(); // Get the current date
    const timeDifference = deadlineDate - currentDate;
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Convert ms to days
  };

  return (
    <div className="p-8 font-Open">
      <h2 className="text-size-32 mb-4 font-Open dark:text-white">
        Assignment and Quizzes
      </h2>
      <div className="flex gap-4 mb-6">
        <div className="p-5 w-64 bg-orange-100 rounded-lg px-6 h-48 bg-[#FFF5E5]">
          <div className="bg-white w-9 rounded-full mb-11">
            <svg
              width="34"
              height="35"
              viewBox="0 0 34 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M19.1102 8.81169C19.2022 8.57547 19.2527 8.31848 19.2527 8.04971C19.2527 6.88991 18.3125 5.94971 17.1527 5.94971C15.9929 5.94971 15.0527 6.88991 15.0527 8.04971C15.0527 8.31787 15.103 8.5743 15.1946 8.81008L8.90575 14.729C8.56481 14.49 8.14957 14.3497 7.70156 14.3497C6.54176 14.3497 5.60156 15.2899 5.60156 16.4497C5.60156 17.6095 6.54176 18.5497 7.70156 18.5497C8.86136 18.5497 9.80156 17.6095 9.80156 16.4497C9.80156 16.3233 9.7904 16.1996 9.76902 16.0794L16.2736 9.9574C16.5411 10.0808 16.8389 10.1497 17.1527 10.1497C17.466 10.1497 17.7632 10.0811 18.0303 9.95813L23.7596 15.3504C23.5627 15.6702 23.4492 16.0467 23.4492 16.4497C23.4492 17.6095 24.3894 18.5497 25.5492 18.5497C26.709 18.5497 27.6492 17.6095 27.6492 16.4497C27.6492 15.2899 26.709 14.3497 25.5492 14.3497C25.3794 14.3497 25.2143 14.3698 25.0562 14.4079L19.1102 8.81169Z"
                fill="#FF9053"
              />
              <path
                d="M14.484 24.7952C11.5992 21.0875 12.3101 19.1482 17.1516 15.9248C22.4397 19.5179 22.4086 21.4559 19.7766 24.8498L14.484 24.7952Z"
                fill="#FFD5BE"
              />
              <path
                d="M14.5266 24.8498C11.5924 21.1065 12.2864 19.164 17.1516 15.9248C22.4397 19.5179 22.4086 21.4559 19.7766 24.8498L14.484 24.7952"
                stroke="#FFD5BE"
                stroke-width="1.05"
                stroke-linecap="round"
              />
              <path
                d="M14 24.8496H20.3V27.9996C20.3 28.5795 19.8299 29.0496 19.25 29.0496H15.05C14.4701 29.0496 14 28.5795 14 27.9996V24.8496Z"
                fill="#FF9053"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-base">Assignments</h3>
        </div>
        {/* Quize card  */}
        <div
          className="p-4 w-64 bg-[#EFFFF6] rounded-lg cursor-pointer"
          onClick={onQuizClick}
        >
          <div className="mb-9">
            <svg
              width="54"
              height="53"
              viewBox="0 0 54 53"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="27.1523" cy="26.4502" r="26.25" fill="white" />
              <rect
                x="15.6055"
                y="14.9004"
                width="23.1"
                height="23.1"
                rx="6.3"
                fill="#EDEDFB"
              />
              <path
                d="M15.6055 21.2004C15.6055 17.721 18.4261 14.9004 21.9055 14.9004H32.4055C35.8849 14.9004 38.7055 17.721 38.7055 21.2004V22.2504H15.6055V21.2004Z"
                fill="#7ECA9D"
              />
              <path
                d="M24.0055 26.4502C24.0055 26.4502 20.8555 28.4694 20.8555 28.8733C20.8555 29.2771 24.0055 31.7002 24.0055 31.7002"
                stroke="#7ECA9D"
                stroke-width="1.05"
                stroke-linecap="round"
              />
              <path
                d="M30.3031 26.4507C30.3031 26.4507 33.4531 28.4699 33.4531 28.8738C33.4531 29.2776 30.3031 31.7007 30.3031 31.7007"
                stroke="#7ECA9D"
                stroke-width="1.05"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <h3 className="font-semibold">Quiz</h3>
        </div>
      </div>
      <div className="space-y-4">
        {assignments?.map((assignment, index) => {
          const daysLeft = calculateDaysLeft(assignment.deadline);
          return (
            <AssignmentCard
              key={index}
              title={assignment?.title}
              instructor={assignment?.instructor}
              deadline={assignment?.deadline}
              daysLeft={daysLeft}
              image={Qize}
              assignment={assignment}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AssignmentsSection;
