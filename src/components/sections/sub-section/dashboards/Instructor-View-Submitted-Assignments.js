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
import { Modal, Button } from "@mui/material";
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

const formatDateNew = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const SubmittedAssignments = () => {
  const { getQuery, loading } = useGetQuery();
  const [data, setData] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filterOption, setFilterOption] = useState("Today");
  const [limit] = useState(5);

  // Fetch submitted assignments
  useEffect(() => {
    fetchSubmittedAssignments();
  }, [limit, currentPage, filterOption]);

  const fetchSubmittedAssignments = () => {
    const filterQuery =
      filterOption === "History" ? `filter=History` : `filter=Today`;

    getQuery({
      url: `${apiUrls.assignments.submittedAssignments}?page=${currentPage}&limit=${limit}&${filterQuery}`,
      onSuccess: (res) => {
        setData(res?.submittedAssignments || []);
        console.log("Submitted Asgns: ", res?.submittedAssignments)
        setTotalPages(Math.ceil(res?.totalAssignments / limit));
      },
      onFail: (err) => {
        console.error("Error fetching submitted assignments:", err);
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

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="px-6 pb-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Submitted Assignments
      </h2>

      <div className="flex justify-between items-center mb-6 space-x-4">
        <div className="flex-grow">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Filter assignments based on Previous/Today
          </p>
        </div>

        <div className="flex justify-end">
          <select
            value={filterOption}
            onChange={handleFilterChange}
            className="border-2 border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white rounded-lg px-5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out shadow-lg transform hover:scale-105"
          >
            <option value="Live">Today</option>
            <option value="History">History</option>
          </select>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg">
        {data.length > 0 ? (
          data.map((assignment) => (
            <div
              key={assignment._id}
              className="border-b last:border-b-0 py-4 px-6"
            >
              <h3 className="text-lg font-bold text-gray-800">
                Assignment Name: {assignment.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Course Name: {assignment?.courseId?.course_title}
              </p>
              <p className="text-sm text-gray-600">
                Deadline: {formatDateNew(assignment.deadline)}
              </p>

              {assignment.submissions.length > 0 ? (
                <div className="mt-4">
                  {assignment.submissions.map((submission) => (
                    <div
                      key={submission._id}
                      className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg mb-2"
                    >
                      <div className="flex items-center">
                        {/* Profile Icon */}
                        {submission.studentId?.user_image ? (
                          <img
                            src={submission.studentId.user_image}
                            alt={submission.studentId.full_name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <FaUserCircle size={40} color="#7ECA9D" />
                        )}
                        <div className="ml-4">
                          <p className="font-medium text-gray-800">
                            {submission.studentId?.full_name || "Unknown"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(submission?.submittedAt)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleViewDetails(submission)}
                        className="bg-[#7ECA9D] text-white hover:bg-[#7ECA9D] active:bg-[#5a9a72] transition duration-300 ease-in-out px-6 py-2 rounded-md shadow-md"
                      >
                        View Assignments
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-6 px-8 text-center text-gray-600 bg-gray-100 rounded-lg shadow-md">
                  <span className="text-2xl font-semibold text-gray-800">
                    No Submitted Assignments
                  </span>
                  <br />
                  <span className="text-sm text-gray-500">
                    We couldn&#39;t find any submitted assignments yet.
                  </span>
                  <div className="mt-4">
                    <FaRegSadCry
                      size={40}
                      className="text-gray-400 animate-pulse mx-auto"
                    />
                  </div>
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="py-6 px-8 text-center text-gray-600 bg-gray-100 rounded-lg shadow-md">
            <span className="text-2xl font-semibold text-gray-800">
              No Submitted Assignments
            </span>
            <br />
            <span className="text-sm text-gray-500">
              We couldn&#39;t find any submitted assignments yet.
            </span>
            <div className="mt-4">
              <FaRegSadCry
                size={40}
                className="text-gray-400 animate-pulse mx-auto"
              />
            </div>
          </p>
        )}
      </div>
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Modal for assignment details */}
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        aria-labelledby="assignment-modal"
        aria-describedby="assignment-details"
      >
        <div className="p-6 max-w-lg mx-auto mt-20 bg-white rounded-lg shadow-lg relative">
          {/* Close "X" Icon */}
          <FaTimes
            size={24}
            className="absolute top-4 right-4 cursor-pointer text-gray-600 hover:text-gray-800"
            onClick={closeModal}
          />

          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Assignment Details
          </h3>
          {selectedSubmission && (
            <>
              <div className="mb-4">
                <div className="flex items-center mt-2">
                  {selectedSubmission.studentId?.user_image ? (
                    <img
                      src={selectedSubmission.studentId.user_image}
                      alt={selectedSubmission.studentId.full_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle size={40} color="#7ECA9D" />
                  )}
                  <div className="ml-4">
                    <p className="font-medium text-gray-800">
                      {selectedSubmission.studentId?.full_name || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedSubmission.studentId?.email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <div className="space-y-4">
                  {selectedSubmission.submissionFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300"
                    >
                      <FaFileDownload size={20} className="text-primaryColor" />
                      <a
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 w-full text-lg font-medium text-primaryColor hover:text-primaryColor-dark transition duration-300"
                      >
                        Download File {index + 1}
                        <div className="ml-auto text-sm text-gray-600">
                          {/* Display the file size or any additional info here if required */}
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default SubmittedAssignments;
