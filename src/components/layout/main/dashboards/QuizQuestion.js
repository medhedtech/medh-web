"use client";
import React, { useState } from "react";

const QuizQuestion = ({
  question,
  options,
  questionNumber,
  totalQuestions,
  time,
  onNext,
  onBack,
  isLastQuestion,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-size-32 text-gray-700">
          &larr; Quizzes
        </button>
        <div className="text-gray-800 text-lg font-semibold">
          {questionNumber}/{totalQuestions}
        </div>
        <div className="font-semibold">
          Time <br />
          <span>{time}</span>
        </div>
      </div>

      {/* Question */}
      <h2 className="text-lg font-medium mb-4">{question}</h2>

      {/* Options */}
      <div className="space-y-2 text-[#615F5F]">
        {options.map((option, index) => (
          <label
            key={index}
            className={`block p-3 border rounded-lg cursor-pointer ${
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
          className="px-8 py-3.5 border rounded-full text-primaryColor border-primaryColor text-size-15 hover:bg-primaryColor hover:text-white"
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
