"use client";
import React, { useState, useEffect } from "react";

const QuizQuestion = ({
  question,
  options = [],
  questionId,
  questionNumber,
  totalQuestions,
  time, // time in seconds (e.g., 600)
  onNext,
  onBack,
  closeQuiz,
  isLastQuestion,
  selectedAnswer, // Receive the actual selected answer
  onAnswerSelect, // Callback to handle answer selection
}) => {
  const [timeRemaining, setTimeRemaining] = useState(time); // Set initial time as the received `time` value
  const [timer, setTimer] = useState(null); // State to store the interval

  // Function to handle answer selection
  const handleOptionSelect = (optionValue) => {
    onAnswerSelect(questionId, optionValue); // Pass questionId and the actual value
  };

  // Function to navigate back to quizzes
  const handleGoBack = () => {
    closeQuiz();
  };

  // Format time in MM:SS format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Set up the timer on component mount
  useEffect(() => {
    if (timeRemaining <= 0) return; // Don't start the timer if time is already 0

    const interval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval); // Stop the timer when time reaches 0
          return 0;
        }
        return prevTime - 1; // Decrement the time by 1 second
      });
    }, 1000); // Update every second

    setTimer(interval); // Store the interval to clear it later

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [timeRemaining]);

  return (
    <div className="p-6 bg-white dark:bg-inherit rounded-lg shadow-md w-full mx-auto">
      {/* Header */}
      <div className="flex justify-between md:flex-row md:items-center mb-6 flex-col items-start">
        <button
          onClick={handleGoBack}
          className="text-size-32 text-gray-700 dark:text-white"
        >
          &larr; Quizzes
        </button>
        <div className="md:flex-none md:w-1/2 flex justify-between w-full items-center">
          <div className="text-gray-800 text-lg font-semibold dark:text-white">
            {questionNumber}/{totalQuestions}
          </div>
          <div className="font-semibold dark:text-white">
            Time: &nbsp;
            <span>{formatTime(timeRemaining)}</span>{" "}
            {/* Display formatted time */}
          </div>
        </div>
      </div>

      {/* Question */}
      <h2 className="text-lg font-medium mb-4 dark:text-white">
        {question || "No question available"}
      </h2>

      {/* Options */}
      <div className="space-y-2 text-[#615F5F] dark:text-white">
        {options?.length > 0 ? (
          options.map((option, index) => (
            <label
              key={index}
              className={`block p-3 border rounded-lg cursor-pointer dark:bg-inherit dark:text-white ${
                selectedAnswer === option
                  ? "bg-[#F6F7F9] border-green-500"
                  : "bg-gray-100 border-gray-200"
              }`}
            >
              <input
                type="radio"
                name={`quiz-option-${questionId}`} // Ensure unique name per questionId
                value={option} // Use option value
                checked={selectedAnswer === option} // Compare actual value
                onChange={() => handleOptionSelect(option)} // Pass the actual value
                className="hidden"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))
        ) : (
          <p>No options available</p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={onBack}
          disabled={questionNumber === 1}
          className={`px-8 py-3.5 border rounded-full text-primaryColor border-primaryColor text-size-15 ${
            questionNumber === 1
              ? "cursor-not-allowed"
              : "hover:bg-primaryColor hover:text-white"
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
