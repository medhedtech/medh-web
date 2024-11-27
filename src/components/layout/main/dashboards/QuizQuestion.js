"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const QuizQuestion = ({
  question,
  options,
  questionNumber,
  totalQuestions,
  time,
  onNext,
  onBack,
  closeQuiz,
  isLastQuestion,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const router = useRouter();

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
  };

  const handleGoBack = () => {
    closeQuiz();
  };

  return (
    <div className="p-6 bg-white dark:bg-inherit rounded-lg shadow-md w-full mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleGoBack}
          className="text-size-32 text-gray-700 dark:text-white"
        >
          &larr; Quizzes
        </button>
        <div className="text-gray-800 text-lg font-semibold dark:text-white">
          {questionNumber}/{totalQuestions}
        </div>
        <div className="font-semibold dark:text-white">
          Time <br />
          <span>{time}</span>
        </div>
      </div>

      {/* Question */}
      <h2 className="text-lg font-medium mb-4 dark:text-white">{question}</h2>

      {/* Options */}
      <div className="space-y-2 text-[#615F5F] dark:text-white">
        {options.map((option, index) => (
          <label
            key={index}
            className={`block p-3 border rounded-lg cursor-pointer dark:bg-inherit dark:text-white ${
              selectedOption === index
                ? "bg-[#F6F7F9] border-green-500"
                : "bg-gray-100 border-gray-200"
            }`}
          >
            <input
              type="radio"
              name="quiz-option"
              value={option}
              checked={selectedOption === index}
              onChange={() => handleOptionSelect(index)}
              className="hidden"
            />
            <span className="text-gray-700">{option}</span>
          </label>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={onBack}
          disabled={questionNumber == 1}
          className={`px-8 py-3.5 border rounded-full text-primaryColor border-primaryColor text-size-15   ${
            questionNumber == 1 ? "cursor-not-allowed" : "hover:bg-primaryColor hover:text-white"
          }`}
        >
          Go Back
        </button>

        <button
          onClick={onNext}
          className="px-8 py-3.5 border rounded-full bg-primaryColor text-white text-size-15 hover:bg-green-600"
        >
          {isLastQuestion ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default QuizQuestion;
