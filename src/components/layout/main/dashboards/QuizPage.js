"use client";
import React, { useState, useEffect } from "react";
import QuizQuestion from "./QuizQuestion";
import Pana from "@/assets/images/dashbord/pana.svg";
import Image from "next/image";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import moment from "moment";

export default function QuizPage({ closeQuiz }) {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [processedQuestions, setProcessedQuestions] = useState([]);
  const totalQuestions = processedQuestions?.length;
  const time = "3:23";

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
      getQuery({
        url: `${apiUrls?.quzies?.getQuizes}?meet_link=${selectedFilter}`,
        onSuccess: (data) => {
          setQuizData(data);
  
          // Access the questions array from the first object in the data array
          const questionsArray = data?.[0]?.questions;
  
          if (questionsArray) {
            const flattenedQuestions = questionsArray.map((item) => ({
              question: item?.question,
              options: item?.options,
            }));
  
            console.log(flattenedQuestions, "Flattened Questions");
            setProcessedQuestions(flattenedQuestions);
          } else {
            console.error("Questions array is not found in the received data.");
          }
        },
        onFail: (error) => {
          console.error("Error fetching quizzes:", error);
        },
      });
    }
  }, [selectedFilter]);

  
  const handleFilterChange = (value) => {
    setSelectedFilter(value);
  };

  return (
    <div className="w-full bg-gray-100 dark:bg-inherit dark:border rounded-5px flex items-center justify-center">
      <div className="w-full">
        <select
          value={selectedFilter}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="border mb-2 border-gray-300 bg-white text-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {classes?.map((option) => (
            <option key={option?.meet_title} value={option?.meet_title}>
              {option?.meet_title}
            </option>
          ))}
        </select>

        {/* Pass processedQuestions to QuizQuestion */}
        {processedQuestions?.length > 0 && (
          <QuizQuestion
            question={processedQuestions[currentQuestion]?.question}
            options={processedQuestions[currentQuestion]?.options}
            questionNumber={currentQuestion + 1}
            totalQuestions={totalQuestions}
            time={time}
            onNext={handleNext}
            onBack={handleBack}
            closeQuiz={closeQuiz}
            isLastQuestion={currentQuestion === totalQuestions - 1}
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
