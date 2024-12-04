import React from "react";

const quizzes = [
  {
    id: 1,
    title: "Articulate structure of C++ and Java in Semester 1",
    course: "B.Tech Specialization in Health Informatics",
    subject: "Network Engineering",
    date: "3-01-2023",
    time: "12:30 AM - 01:40 PM",
    questions: 50,
    passingPercentage: 70,
  },
  {
    id: 2,
    title: "Articulate structure of C++ and Java in Semester 1",
    course: "B.Tech Specialization in Health Informatics",
    subject: "Network Engineering",
    date: "3-01-2023",
    time: "12:30 AM - 01:40 PM",
    questions: 50,
    passingPercentage: 70,
  },
];

const QuizCard = ({ quiz }) => (
  <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-800">{quiz.title}</h3>
    <p className="text-sm text-gray-600">Course: {quiz.course}</p>
    <p className="text-sm text-gray-600">Subject: {quiz.subject}</p>
    <div className="flex items-center text-sm text-gray-600 mt-2">
      <div className="flex items-center mr-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mr-1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 15.75v-7.5M15.75 15.75v-7.5M9.75 8.25h4.5M12 3.75v3.75M6 21.75h12m-7.5 0h3"
          />
        </svg>
        {quiz.date}
      </div>
      <div className="flex items-center">
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mr-1"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l3 3" />
        </svg> */}
        {quiz.time}
      </div>
    </div>
    <p className="text-sm text-gray-600 mt-2">Questions: {quiz.questions}</p>
    <div className="mt-4">
      <p className="text-sm text-gray-600">
        Passing Percentage:
        <span className="font-semibold text-[#7ECA9D] ml-1">
          {quiz.passingPercentage}%
        </span>
      </p>
      <div className="relative mt-1 w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-[#7ECA9D] h-1.5 rounded-full"
          style={{ width: `${quiz.passingPercentage}%` }}
        ></div>
      </div>
    </div>
    <button className="mt-4 w-full px-4 py-2 bg-white border-[#7ECA9D] border hover:text-white text-[#7ECA9D] text-sm font-semibold rounded hover:bg-green-600 transition">
      View Questions
    </button>
  </div>
);

const CreateQuize = () => {
  return (
    <div className="px-6 pb-12">
      <div className="flex justify-between items-center pt-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Create Quiz</h2>
        <a href="#" className="text-green-500 hover:underline">
          View all
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
        <div className="flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-4 text-green-500 cursor-pointer hover:bg-green-50 transition">
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
    </div>
  );
};

export default CreateQuize;
