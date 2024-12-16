"use client";

import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import React, { useEffect, useState } from "react";
import {
  FaFileDownload,
  FaRegSadCry,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";
import { Modal } from "@mui/material";
import Preloader from "@/components/shared/others/Preloader";
import PaginationComponent from "@/components/shared/pagination-latest";

// Function to format date as DD-MM-YYYY HH:MM
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

const SubmittedQuiz = () => {
  const { getQuery, loading } = useGetQuery();
  const [data, setData] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit] = useState(5);

  useEffect(() => {
    fetchSubmittedQuizzes();
  }, [limit, currentPage]);

  const fetchSubmittedQuizzes = () => {
    getQuery({
      url: `${apiUrls?.quzies?.getQuizResponses}?page=${currentPage}&limit=${limit}`,
      onSuccess: (res) => {
        setData(res?.responses || []);
        setCurrentPage(Number(res?.currentPage) || 1);
        setTotalPages(Math.ceil(res?.totalResponses / limit));
      },
      onFail: (err) => {
        console.error("Error fetching submitted quizzes:", err);
      },
    });
  };

  const handleViewDetails = (submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSubmission(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Submitted Quizzes
      </h2>
      <div>
        {data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((submission) => (
              <div
                key={submission._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
              >
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                  {submission.quizDetails?.quiz_title || "Untitled Quiz"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Class Name: {submission.quizDetails?.class_name || "Unknown"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Submitted: {formatDate(submission.submittedAt)}
                </p>
                <div className="flex items-center mb-2">
                  {submission.studentDetails?.user_image ? (
                    <img
                      src={submission.studentDetails.user_image}
                      alt={submission.studentDetails.full_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle size={40} color="#78C14E" />
                  )}
                  <div className="ml-4">
                    <p className="font-medium text-gray-800 dark:text-white">
                      {submission.studentDetails?.full_name || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {submission.studentDetails?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleViewDetails(submission)}
                  className="bg-[#7eca9d] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#7eca9d]"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
            <FaRegSadCry
              size={40}
              className="text-gray-400 animate-pulse mx-auto"
            />
            <span>No Submitted Quizzes Found</span>
          </p>
        )}
      </div>
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      {/* Modal */}
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        aria-labelledby="submission-details-modal"
        aria-describedby="submission-details"
      >
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg mx-auto mt-20 relative">
          <FaTimes
            size={20}
            className="absolute top-4 right-4 cursor-pointer text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
            onClick={closeModal}
          />
          {selectedSubmission ? (
            <div className="h-full">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Submission Details
              </h3>
              <div className="mb-4">
                <p className="font-medium text-gray-800 dark:text-white">
                  Quiz Title: {selectedSubmission.quizDetails?.quiz_title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Submitted At: {formatDate(selectedSubmission.submittedAt)}
                </p>
              </div>
              <div
                className="mb-4 overflow-y-auto"
                style={{
                  maxHeight: "60vh", // Limit the modal content height to 60% of the viewport height
                  paddingRight: "0.5rem", // Add padding for scrollbar
                }}
              >
                <p className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
                  Responses:
                </p>
                {selectedSubmission.responses.map((response, index) => (
                  <div
                    key={response._id}
                    className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2"
                  >
                    <p className="font-medium text-gray-800 dark:text-white">
                      Q{index + 1}: {response.question}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Selected Answer:{" "}
                      {response.selectedAnswer || "Not Answered"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400">
              No details available.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default SubmittedQuiz;
