"use client";
import React, { useState } from "react";
import QuizQuestion from "./QuizQuestion";
import Pana from "@/assets/images/dashbord/pana.svg";
import Image from "next/image";

const quizData = [
  {
    question: "What is the full form of CPU?",
    options: [
      "A. Central Processing Unit",
      "B. Central Processing Unit",
      "C. Central Processing Unit",
      "D. Central Processing Unit",
    ],
  },
  {
    question: "What is the full form of UPS?",
    options: [
      "A. Uninterruptible Power Supply",
      "B. Universal Power System",
      "C. Utility Power Supply",
      "D. United Parcel Service",
    ],
  },
  {
    question: "What is the full form of RAM?",
    options: [
      "A. Random Access Memory",
      "B. Read Access Memory",
      "C. Rapid Access Memory",
      "D. Read And Maintain",
    ],
  },
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const totalQuestions = quizData.length;
  const time = "3:23";

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowPopup(true); // Show popup on last question's "Submit"
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setCurrentQuestion(0); // Optionally reset quiz to first question after submission
  };

  return (
    <div className="w-full bg-gray-100 dark:bg-inherit dark:border rounded-5px flex items-center justify-center">
      <QuizQuestion
        question={quizData[currentQuestion].question}
        options={quizData[currentQuestion].options}
        questionNumber={currentQuestion + 1}
        totalQuestions={totalQuestions}
        time={time}
        onNext={handleNext}
        onBack={handleBack}
        isLastQuestion={currentQuestion === totalQuestions - 1}
      />

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-black px-6 pb-4 rounded-lg shadow-lg text-center w-[765px]">
            <div className="mx-auto">
              <Image src={Pana} alt="pana" className="mx-auto" />
            </div>

            <p className="dark:text-white">
              Congratulations! You are successfully completed the quiz{" "}
            </p>
            <button
              onClick={closePopup}
              className="mt-4 px-6 py-2 bg-primaryColor text-white rounded-full hover:bg-green-600 w-80"
            >
              Go Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
