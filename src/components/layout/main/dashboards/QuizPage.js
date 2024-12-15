"use client";
import React, { useState, useEffect } from "react";
import QuizQuestion from "./QuizQuestion";
import Pana from "@/assets/images/dashbord/pana.svg";
import Image from "next/image";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import moment from "moment";
import usePostQuery from "@/hooks/postQuery.hook";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function QuizPage({ closeQuiz }) {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [processedQuestions, setProcessedQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const totalQuestions = processedQuestions?.length;
  const time = "3:23";
  const { postQuery, loading } = usePostQuery();
  const router = useRouter();

  const [classes, setClasses] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const { getQuery } = useGetQuery();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setStudentId(storedUserId);
      } else {
        console.error("No student ID found in localStorage");
      }
    }
  }, []);

  useEffect(() => {
    if (studentId) {
      const fetchUpcomingClasses = () => {
        getQuery({
          url: `${apiUrls?.onlineMeeting?.getMeetingByStudentId}/${studentId}`,
          onSuccess: (res) => {
            const sortedClasses = res || [];

            const ongoingClasses = sortedClasses.filter((classItem) => {
              const classDateTime = moment(
                `${classItem.date} ${classItem.time}`,
                "YYYY-MM-DD HH:mm"
              );
              const currentTime = moment();
              const classEndTime = classDateTime.add(1, "hour");

              return currentTime.isBetween(classDateTime, classEndTime);
            });

            const upcomingClasses = sortedClasses.filter(
              (classItem) => !ongoingClasses.includes(classItem)
            );

            const sortedUpcomingClasses = upcomingClasses.sort((a, b) => {
              const aDateTime = moment(
                `${a.date} ${a.time}`,
                "YYYY-MM-DD HH:mm"
              );
              const bDateTime = moment(
                `${b.date} ${b.time}`,
                "YYYY-MM-DD HH:mm"
              );
              return aDateTime - bDateTime;
            });

            setClasses([...ongoingClasses, ...sortedUpcomingClasses]);
          },
          onFail: (err) => {
            console.error("Error fetching upcoming classes:", err);
          },
        });
      };

      fetchUpcomingClasses();
    }
  }, [studentId]);

  useEffect(() => {
    if (classes.length > 0) {
      setSelectedFilter(classes[0]?.meet_title);
    }
  }, [classes]);

  useEffect(() => {
    if (selectedFilter) {
      console.log("Fetching quiz for:", selectedFilter);
      getQuery({
        url: `${apiUrls?.quzies?.getQuizes}?meet_link=${selectedFilter}`,
        onSuccess: (data) => {
          console.log("Fetched Quiz Data:", data);
          setQuizData(data);

          // Filter quizzes by class name or meet_link
          const selectedQuiz = data.find(
            (quiz) => quiz.class_name === selectedFilter
          );

          if (selectedQuiz?.questions) {
            const flattenedQuestions = selectedQuiz.questions.map((item) => ({
              question: item?.question,
              options: item?.options,
              questionId: item?._id,
            }));

            setProcessedQuestions(flattenedQuestions);
          } else {
            console.warn("No quiz found for the selected filter.");
            setProcessedQuestions([]);
          }
        },
        onFail: (error) => {
          console.error("Error fetching quizzes:", error);
          setProcessedQuestions([]);
        },
      });
    }
  }, [selectedFilter]);

  const handleFilterChange = (value) => {
    setSelectedFilter(value);
  };

  const handleAnswerSelect = (questionId, selectedAnswer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: selectedAnswer,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowPopup(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setCurrentQuestion(0);
  };

  const submitResponse = () => {
    if (!studentId || !quizData[0]?._id) {
      console.error("Student ID or Quiz ID is missing.");
      return;
    }

    const responses = Object.entries(selectedAnswers).map(
      ([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer,
      })
    );

    postQuery({
      url: apiUrls?.quzies?.quizResponses,
      postData: {
        quizId: quizData[0]?._id,
        studentId,
        responses,
      },
      onSuccess: () => {
        toast.success("Response submitted successfully");
        console.log("Quiz response submitted successfully.");
        closePopup();
        router.push("/dashboards/student-dashboard");
      },
      onFail: (error) => {
        console.error("Error submitting quiz response:", error);
      },
    });
  };

  return (
    <div className="w-full bg-gray-100 dark:bg-inherit dark:border rounded-5px flex items-center justify-center">
      <div className="w-full">
        <select
          value={selectedFilter}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="min-w-[440px] border mb-2 border-gray-300 bg-white text-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {classes?.map((option) => (
            <option key={option?.meet_title} value={option?.meet_title}>
              {option?.meet_title}
            </option>
          ))}
        </select>
        {processedQuestions?.length > 0 && (
          <QuizQuestion
            question={processedQuestions[currentQuestion]?.question}
            options={processedQuestions[currentQuestion]?.options}
            questionId={processedQuestions[currentQuestion]?.questionId}
            questionNumber={currentQuestion + 1}
            totalQuestions={totalQuestions}
            time={time}
            onNext={handleNext}
            onBack={handleBack}
            closeQuiz={closeQuiz}
            isLastQuestion={currentQuestion === totalQuestions - 1}
            selectedAnswer={
              selectedAnswers[processedQuestions[currentQuestion]?.questionId]
            }
            onAnswerSelect={handleAnswerSelect}
          />
        )}
      </div>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-black px-6 pb-4 rounded-lg shadow-lg text-center w-[765px]">
            <div className="mx-auto">
              <Image src={Pana} alt="pana" className="mx-auto" />
            </div>

            <p className="dark:text-white">
              Congratulations! You have successfully completed the quiz.
            </p>
            <button
              onClick={submitResponse}
              className="mt-4 px-6 py-2 bg-primaryColor text-white rounded-full hover:bg-green-600 w-80"
            >
              Submit Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
