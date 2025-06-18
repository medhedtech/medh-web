"use client";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AssignmentCard = ({
  title,
  courseTitle,
  deadline,
  daysLeft,
  image,
  instructor,
  assignment,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [instructorId, setInstructorId] = useState("");
  const [courseName, setCourseName] = useState("");
  const [pdfBrochures, setPdfBrochures] = useState([]);
  const [assignmentId, setAssignmentId] = useState("");
  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [submissionDate, setSubmissionDate] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      setStudentId(storedUserId);
    }
  }, []);

  useEffect(() => {
    const checkSubmissionStatus = async () => {
      try {
        const response = await getQuery({
          url: `${apiUrls?.assignments?.assignmentsStatus}/${assignment._id}`,
        });
        if (response?.submissions?.length > 0) {
          setHasSubmitted(true);
          setSubmissionDate(response.submissions[0]?.submittedAt);
        } else {
          setHasSubmitted(false);
        }
      } catch (error) {
        console.error("Error fetching submission status:", error);
      }
    };

    checkSubmissionStatus();
  }, [assignment._id]);

  const statusStyles = {
    dueSoon: "text-[#F50909]",
    dueTomorrow: "text-[#2E9800]",
    pending: "text-[#FFA927]",
  };

  let statusText;
  let statusColor;

  if (hasSubmitted) {
    const formattedSubmissionDate = new Date(
      submissionDate
    ).toLocaleDateString();
    statusText = `Assignment Submitted on ${formattedSubmissionDate}`;
    statusColor = "text-[#2E9800]";
  } else if (daysLeft <= 1) {
    statusText = `Assignment Due in ${daysLeft} Day`;
    statusColor = statusStyles.dueTomorrow;
  } else if (daysLeft <= 3) {
    statusText = `Assignment Due in ${daysLeft} Days`;
    statusColor = statusStyles.dueSoon;
  } else {
    statusText = "Assignment Pending";
    statusColor = statusStyles.pending;
  }

  const openModal = (assignmentId) => {
    setIsModalOpen(true);
    setAssignmentId(assignmentId);
    setCourseName(assignment.courseId.course_title);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setInstructorId(storedUserId);
      }
    }
  }, []);

  const handlePdfUpload = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      try {
        const uploadedPdfs = [...pdfBrochures];
        for (const file of files) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = async () => {
            const base64 = reader.result;
            const postData = { base64String: base64 };

            await postQuery({
              url: apiUrls?.upload?.uploadDocument,
              postData,
              onSuccess: (data) => {
                uploadedPdfs.push(data?.data);
                setPdfBrochures(uploadedPdfs);
              },
              onError: (error) => {
                showToast.error("PDF upload failed. Please try again.");
                console.error("Upload error:", error);
              },
            });
          };
        }
      } catch (error) {
        console.error("Error uploading PDF:", error);
      }
    }
  };

  const handleSubmitAssignment = async (event) => {
    event.preventDefault();

    // Ensure pdfBrochures has uploaded PDFs before submitting
    if (pdfBrochures.length === 0) {
      alert("Please upload a PDF file before submitting.");
      return;
    }

    const submissionData = {
      assignmentId: assignment._id,
      studentId: studentId,
      submissionFile: pdfBrochures,
    };

    try {
      await postQuery({
        url: apiUrls?.assignments?.submitAssignments,
        postData: submissionData,
        onSuccess: () => {
          closeModal();
          showToast.success("Assignment Submitted Successfully!");
        },
        onError: (error) => {
          console.error("Error submitting assignment:", error);
          showToast.error("Error submitting assignment.");
        },
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Unexpected error occurred while submitting.");
    }
  };

  const formattedDeadline = new Date(deadline).toLocaleDateString();

  return (
    <div className="p-5 font-Open border rounded-lg shadow-sm">
      <div className="flex items-center">
        <Image
          src={image}
          alt="assignment thumbnail"
          className="w-27 h-27 rounded-md mr-4"
        />
        <div className="w-full">
          <h3 className="text-sm text-[#171A1F] font-Open dark:text-white">
            {title}
          </h3>
          <p className="text-size-11 text-[#9095A0]">
            Course Name: {courseTitle}
          </p>
          <p className="text-size-11 text-[#9095A0]">
            Instructor: {instructor}
          </p>
          <p className="text-size-11 text-[#9095A0]">
            Deadline: {formattedDeadline}
          </p>
          {assignment.assignment_resources?.map((resource, index) => (
            <div key={index} className="text-size-11 text-blue">
              <a
                href={resource}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Download Assignments
              </a>
            </div>
          ))}
          <div className="flex flex-col md:flex-row md:justify-between items-center mt-5">
            <p
              className={`text-sm font-medium rounded-full px-4 py-1 ${
                hasSubmitted
                  ? "bg-green-100 text-green-600"
                  : daysLeft <= 1
                  ? "bg-yellow-100 text-yellow-600"
                  : daysLeft <= 3
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {statusText}
            </p>

            {/* Submit Button */}
            <button
              className={`mt-3 md:mt-0 px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                hasSubmitted
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-[#7ECA9D] text-white"
              }`}
              onClick={() =>
                !hasSubmitted &&
                openModal(assignment.courseId._id, assignment.courseId)
              }
              disabled={hasSubmitted}
            >
              {hasSubmitted ? "✔️ Submitted" : "Submit Now"}
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg px-10 py-5 w-[705px] dark:bg-black shadow-lg relative">
            <button
              className="absolute top-5 right-4 font-bold hover:text-gray-700 dark:text-white"
              onClick={closeModal}
            >
              ✕
            </button>
            <h2 className="text-xl text-center font-semibold mb-4 dark:text-white">
              Submit Assignment
            </h2>
            <form onSubmit={handleSubmitAssignment}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-xl font-semibold text-[#434343] dark:text-whitegrey1"
                >
                  Course Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={courseName}
                  className="mt-6 block w-full p-2 border dark:bg-inherit border-gray-300 rounded-md"
                  placeholder="Enter your course name"
                  readOnly
                  required
                />
              </div>
              {/* PDF Brochure Upload */}
              <div className="w-full py-4">
                {/* Upload Box */}
                <div className="border-dashed border-2 bg-purple border-gray-300 rounded-lg p-3 w-full h-[140px] text-center relative mx-auto">
                  {/* Upload Icon */}
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-2 mx-auto"
                  >
                    <path
                      d="M8 40C6.9 40 5.95867 39.6087 5.176 38.826C4.39333 38.0433 4.00133 37.1013 4 36V22C4.86667 22.6667 5.81667 23.1667 6.85 23.5C7.88333 23.8333 8.93333 24 10 24C12.7667 24 15.1253 23.0247 17.076 21.074C19.0267 19.1233 20.0013 16.7653 20 14C20 12.9333 19.8333 11.8833 19.5 10.85C19.1667 9.81667 18.6667 8.86667 18 8H32C33.1 8 34.042 8.392 34.826 9.176C35.61 9.96 36.0013 10.9013 36 12V21L44 13V35L36 27V36C36 37.1 35.6087 38.042 34.826 38.826C34.0433 39.61 33.1013 40.0013 32 40H8ZM8 20V16H4V12H8V8H12V12H16V16H12V20H8ZM10 32H30L23.25 23L18 30L14.75 25.65L10 32Z"
                      fill="#808080"
                    />
                  </svg>
                  {/* Upload Text */}
                  <p className="text-customGreen cursor-pointer text-sm mt-2">
                    Click to upload
                  </p>
                  <p className="text-gray-400 text-xs">
                    or drag & drop the files
                  </p>
                  {/* Hidden Input Field */}
                  <input
                    type="file"
                    multiple
                    accept=".pdf"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handlePdfUpload}
                  />
                </div>

                {/* Uploaded Files */}
                {pdfBrochures.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {pdfBrochures.map((fileUrl, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-[#e9e9e9] p-2 rounded-md text-sm w-full md:w-auto"
                      >
                        <span className="truncate text-[#5C5C5C] max-w-[150px]">
                          {fileUrl.split("/").pop()}
                        </span>
                        <button
                          onClick={() => removePdf(index)}
                          className="ml-2 text-[20px] text-[#5C5C5C] hover:text-red-700"
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white bg-primaryColor py-2 rounded-full hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentCard;
