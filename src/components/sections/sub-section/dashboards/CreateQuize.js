"use client";
import React, { useState, useEffect } from "react";
import CreateQuizModal from "@/components/shared/quiz-modal";
// import DateIcon from "@/assets/images/icon/Date";
// import TimeIcon from "@/assets/images/icon/TimeIcon";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { toast } from "react-toastify";

// const quizzes = [
//   {
//     id: 1,
//     title: "Articulate structure of C++ and Java in Semester 1",
//     course: "B.Tech Specialization in Health Informatics",
//     subject: "Network Engineering",
//     date: "3-01-2023",
//     time: "12:30 AM - 01:40 PM",
//     questions: 50,
//     passingPercentage: 70,
//   },
//   {
//     id: 2,
//     title: "Articulate structure of C++ and Java in Semester 1",
//     course: "B.Tech Specialization in Health Informatics",
//     subject: "Network Engineering",
//     date: "3-01-2023",
//     time: "12:30 AM - 01:40 PM",
//     questions: 50,
//     passingPercentage: 70,
//   },
// ];

const QuizCard = ({ quiz }) => (
  <div className="bg-white dark:bg-inherit shadow-md rounded-lg p-4 border border-gray-200">
    <h3 className="text-lg font-semibold text-[#3C3C3C] dark:text-white">
     Class: {quiz?.class_name}
    </h3>
    <p className="text-sm text-[#9A9A9A] w-4/5">Quiz Name: {quiz?.quiz_title}</p>
    {/* <p className="text-sm text-[#9A9A9A]">Subject: {quiz.subject}</p> */}
    {/* <div className="flex items-center text-sm text-gray-600 mt-2">
      <div className="flex items-center mr-4 gap-2">
        <DateIcon />
        {quiz.date}
      </div>
      <div className="flex items-center gap-2">
        <TimeIcon />
        {quiz.time}
      </div>
    </div> */}
    <p className="text-sm text-[#9A9A9A] mt-2">Questions: {quiz.questions?.length}</p>
    <div className="mt-4">
      <p className="text-sm flex justify-between mx-2 text-gray-600">
        Passing Percentage:
        <span className="font-semibold text-[#7ECA9D] ml-1">
          {Number(quiz?.passing_percentage)}%
        </span>
      </p>
      <div className="relative mt-1 w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-[#7ECA9D] h-1.5 rounded-full"
          style={{ width: `${Number(quiz?.passing_percentage)}%` }}
        ></div>
      </div>
    </div>
    <button className="mt-4 w-full px-4 py-2 bg-white dark:bg-inherit dark:hover:bg-[#7ECA9D] border-[#7ECA9D] border hover:text-white text-[#7ECA9D] text-sm font-semibold rounded hover:bg-green-600 transition">
      View Questions
    </button>
  </div>
);

const CreateQuize = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const { getQuery, loading } = useGetQuery();
  const [data, setData] = useState();



  const fetchData = () => {
    getQuery({
      url: apiUrls?.quzies?.getQuizes,
      onSuccess: (res) => setData(res),
      onFail:(err) => {
       toast.error("Something went wrong")
      }
    });

  }

  useEffect(() => {
    fetchData()
  }, []);

  console.log(data, "NEWBALL DATA");

  return (
    <div className="px-6 pb-12 m-4 dark:bg-inherit bg-white rounded-lg">
      <div className="flex justify-between items-center pt-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Create Quiz
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
        <div
          className="flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-4 text-green-500 cursor-pointer hover:bg-green-50 transition"
          onClick={() => setIsPopupOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <p className="mt-2 font-semibold">Create New Quiz</p>
        </div>
      </div>
      {isPopupOpen && (
        <CreateQuizModal
          open={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          onUpload={fetchData}
        />
      )}
    </div>
  );
};

export default CreateQuize;
