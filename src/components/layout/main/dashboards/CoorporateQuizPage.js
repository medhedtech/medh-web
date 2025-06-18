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
import { FiFileText } from "react-icons/fi";
import Preloader from "@/components/shared/others/Preloader";
import CoorporateQuizQuestion from "./CoorporateQuizQuestions";

export default function CoorporateQuizPage({ closeQuiz }) {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [processedQuestions, setProcessedQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const totalQuestions = processedQuestions?.length;
  const [quizTime, setQuizTime] = useState();
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

  //   useEffect(() => {
  //     if (studentId) {
  //       const fetchUpcomingClasses = () => {
  //         getQuery({
  //           url: apiUrls?.onlineMeeting?.getAllMeetingsForAllEmployeees,
  //           onSuccess: (res) => {
  //             const sortedClasses = res || [];

  //             const ongoingClasses = sortedClasses.filter((classItem) => {
  //               const classDateTime = moment(
  //                 `${classItem.date} ${classItem.time}`,
  //                 "YYYY-MM-DD HH:mm"
  //               );
  //               const currentTime = moment();
  //               const classEndTime = classDateTime.add(1, "hour");

  //               return currentTime.isBetween(classDateTime, classEndTime);
  //             });

  //             const upcomingClasses = sortedClasses.filter(
  //               (classItem) => !ongoingClasses.includes(classItem)
  //             );

  //             const sortedUpcomingClasses = upcomingClasses.sort((a, b) => {
  //               const aDateTime = moment(
  //                 `${a.date} ${a.time}`,
  //                 "YYYY-MM-DD HH:mm"
  //               );
  //               const bDateTime = moment(
  //                 `${b.date} ${b.time}`,
  //                 "YYYY-MM-DD HH:mm"
  //               );
  //               return aDateTime - bDateTime;
  //             });

  //             setClasses([...ongoingClasses, ...sortedUpcomingClasses]);
  //           },
  //           onFail: (err) => {
  //             console.error("Error fetching upcoming classes:", err);
  //           },
  //         });
  //       };

  //       fetchUpcomingClasses();
  //     }
  //   }, [studentId]);

  useEffect(() => {
    if (studentId) {
      const fetchUpcomingClasses = async () => {
        try {
          const response = await getQuery({
            url: `${apiUrls?.onlineMeeting?.getAllMeetingsForAllEmployeees}?student_id=${studentId}`,
          });

          if (response?.meetings) {
            const sortedClasses = response.meetings || [];

            // Separate ongoing classes
            const ongoingClasses = sortedClasses.filter((classItem) => {
              const classDateTime = moment(
                `${classItem.date} ${classItem.time}`,
                "YYYY-MM-DD HH:mm"
              );
              const currentTime = moment();
              const classEndTime = classDateTime.add(1, "hour");

              // Class is ongoing if current time is between start and end time
              return currentTime.isBetween(classDateTime, classEndTime);
            });

            // Sort the remaining classes by date/time
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

            // Combine ongoing classes with sorted upcoming classes
            setClasses(
              [...ongoingClasses, ...sortedUpcomingClasses].slice(0, 4)
            );
          } else {
            console.error("No meetings data found in response");
          }
        } catch (error) {
          console.error("Error fetching upcoming classes:", error);
          showToast.error("Failed to fetch upcoming classes.");
        }
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
          if (selectedQuiz?.quiz_time) {
            setQuizTime(selectedQuiz.quiz_time);
          }

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

    const responses = processedQuestions.map((question) => ({
      question: question.question,
      selectedAnswer: selectedAnswers[question.questionId] || null,
    }));

    postQuery({
      url: apiUrls?.quzies?.quizResponses,
      postData: {
        quizId: quizData[0]?._id,
        studentId,
        responses,
      },
      onSuccess: () => {
        showToast.success("Response submitted successfully");
        console.log("Quiz response submitted successfully.");
        closePopup();
        router.push("/dashboards/student");
      },
      onFail: (error) => {
        console.error("Error submitting quiz response:", error);
      },
    });
  };

  const handleGoBack = () => {
    closeQuiz();
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="w-full bg-gray-100 dark:bg-inherit dark:border rounded-5px flex items-center justify-center">
      <div className="w-full p-4">
        <button
          onClick={handleGoBack}
          className="text-size-26 text-gray-700 dark:text-white"
        >
          &larr; Back
        </button>
        <label
          htmlFor="class-select"
          className="block text-[16px] font-semibold text-gray-700 dark:text-gray-200"
        >
          Please select class to start the quiz
        </label>
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
        {processedQuestions?.length > 0 ? (
          <CoorporateQuizQuestion
            question={processedQuestions[currentQuestion]?.question}
            options={processedQuestions[currentQuestion]?.options}
            questionId={processedQuestions[currentQuestion]?.questionId}
            questionNumber={currentQuestion + 1}
            totalQuestions={totalQuestions}
            time={quizTime || 500}
            onNext={handleNext}
            onBack={handleBack}
            closeQuiz={closeQuiz}
            isLastQuestion={currentQuestion === totalQuestions - 1}
            selectedAnswer={
              selectedAnswers[processedQuestions[currentQuestion]?.questionId]
            }
            onAnswerSelect={handleAnswerSelect}
          />
        ) : (
          <div className="flex flex-col h-[50vh] items-center justify-center p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
            <FiFileText
              className="text-gray-400 dark:text-gray-500 mb-4"
              size={80}
            />
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              No Quizzes Available for {selectedFilter} class coorporate
            </p>
            <p className="text-sm text-gray-500 pb-4 dark:text-gray-400 mt-2 text-center">
              It looks like there are no quizzes available for the selected
              class at the moment. Please check back later.
            </p>
          </div>
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
