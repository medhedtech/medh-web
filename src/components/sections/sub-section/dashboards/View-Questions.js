"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { toast } from "react-toastify";
import Preloader from "@/components/shared/others/Preloader";

const QuizQuestionsDetails = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [quizData, setQuizData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const { getQuery, loading } = useGetQuery();

  // Fetch quiz data
  const fetchData = () => {
    getQuery({
      url: `${apiUrls?.quzies?.getQuizesById}/${id}`,
      onSuccess: (res) => setQuizData(res),
      onFail: (err) => {
        showToast.error("Something went wrong");
      },
    });
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  // Handle option toggle
  const handleToggle = (questionId, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option === selectedAnswers[questionId] ? null : option,
    }));
  };

  // Set the default selected answer (for correct answer)
  const getDefaultSelectedAnswer = (questionId, correctAnswer) => {
    return selectedAnswers[questionId] || correctAnswer;
  };

  if (loading || !quizData) {
    return <Preloader />;
  }

  return (
    <div className="p-6 bg-white mx-8">
      <h1 className="text-2xl font-semibold text-gray-800">
        Quiz: {quizData.quiz_title}
      </h1>
      <p className="text-gray-500">Class: {quizData.class_name}</p>
      <div className="mt-6 space-y-6">
        {quizData.questions.map((question, index) => (
          <div key={question._id} className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="font-semibold text-lg mb-4">
              Q{index + 1}: {question.question}
            </h2>
            <div className="space-y-2">
              {question.options.map((option, idx) => {
                const isSelected = selectedAnswers[question._id] === option;
                const isCorrect =
                  getDefaultSelectedAnswer(
                    question._id,
                    question.correctAnswer
                  ) === option;
                const isDisabled = isSelected || isCorrect;

                return (
                  <div
                    key={idx}
                    className={`w-[30%] p-2 mx-2 text-lg rounded-lg transition-all duration-300 ease-in-out 
                      ${
                        isCorrect
                          ? "bg-[#7ECA9D] text-white" // Highlight correct answer
                          : isSelected
                          ? "bg-[#7ECA9D] text-white" // Highlight selected answer
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    onClick={() =>
                      !isDisabled && handleToggle(question._id, option)
                    } // Prevent click if disabled
                  >
                    {option}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestionsDetails;
