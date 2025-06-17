"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import { toast } from "react-toastify";

const feedbackSchema = yup.object().shape({
  feedbackType: yup.string().required("Feedback type is required"),
  feedbackText: yup
    .string()
    .min(10, "Feedback must be at least 10 characters")
    .required("Feedback is required"),
  feedbackTitle: yup.string().required("Feedback title is required"),
});

const complaintSchema = yup.object().shape({
  complaintName: yup.string().required("Name is required"),
  complaintText: yup
    .string()
    .min(10, "Complaint must be at least 10 characters")
    .required("Complaint text is required"),
});

const CoorporateEmpFeedbackAndSupport = () => {
  const { postQuery, loading } = usePostQuery();
  const {
    register: registerFeedback,
    handleSubmit: handleFeedbackSubmit,
    reset: resetFeedback,
    formState: { errors: feedbackErrors },
    watch,
  } = useForm({
    resolver: yupResolver(feedbackSchema),
    defaultValues: {
      feedbackType: "course",
      feedbackText: "",
      feedbackTitle: "",
    },
  });

  const feedbackType = watch("feedbackType");

  const {
    register: registerComplaint,
    handleSubmit: handleComplaintSubmit,
    reset: resetComplaint,
    formState: { errors: complaintErrors },
  } = useForm({
    resolver: yupResolver(complaintSchema),
    defaultValues: {
      complaintName: "",
      complaintText: "",
    },
  });

  const onFeedbackSubmit = (data) => {
    postQuery({
      url: apiUrls?.feedbacks?.createCoorporateFeedback,
      postData: {
        feedback_text: data?.feedbackText,
        feedback_for: data?.feedbackType,
        feedback_title: data?.feedbackTitle,
      },
      onSuccess: () => {
        showToast.success("Feedback submitted successfully");
        resetFeedback();
      },
      onFail: (error) => {
        console.log(error, "SETERROR");
      },
    });
  };

  const onComplaintSubmit = (data) => {
    postQuery({
      url: apiUrls?.feedbacks?.createEmployeeComplaint,
      postData: {
        name: data?.complaintName,
        description: data?.complaintText,
      },
      onSuccess: () => {
        showToast.success("Complaint submitted successfully");
        resetComplaint();
      },
      onFail: (error) => {
        console.log(error, "SETERROR");
      },
    });
  };

  return (
    <div className="p-6 w-full mx-auto">
      <div className="mb-8">
        <h1 className="text-size-32 dark:text-white">Feedback</h1>

        <form onSubmit={handleFeedbackSubmit(onFeedbackSubmit)}>
          <div className="flex items-center space-x-4 mb-4">
            <p className="mb-4 text-size-22 dark:text-white">
              Write Review about Course/Instructor
              <span className="text-red-500 ml-1">*</span>
            </p>
            <div className="flex gap-3 mb-2.5">
              {/* Course radio button */}
              <label
                className={`flex items-center text-lg ${
                  feedbackType === "course"
                    ? "text-[#7ECA9D] font-semibold"
                    : "text-[#B4BDC4]"
                }`}
              >
                <input
                  type="radio"
                  value="course"
                  {...registerFeedback("feedbackType")}
                  className="mr-2 peer"
                />
                Course
              </label>

              {/* Instructor radio button */}
              <label
                className={`flex items-center text-lg ${
                  feedbackType === "instructor"
                    ? "text-[#7ECA9D] font-semibold"
                    : "text-[#B4BDC4]"
                }`}
              >
                <input
                  type="radio"
                  value="instructor"
                  {...registerFeedback("feedbackType")}
                  className="mr-2 custom-radio"
                />
                Instructor
              </label>
            </div>

            {/* Display error message if no radio button is selected */}
            {feedbackErrors.feedbackType && (
              <p className="text-red-500 text-sm">
                {feedbackErrors.feedbackType.message}
              </p>
            )}
          </div>

          {/* Title Input */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 dark:text-white">
              Title
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              {...registerFeedback("feedbackTitle")}
              className="w-1/2 p-3 border rounded-lg dark:bg-inherit dark:text-white text-[#434343BF] focus:outline-none focus:ring-1 focus:ring-green-300"
            />
            {feedbackErrors.feedbackTitle && (
              <p className="text-red-500 text-sm">
                {feedbackErrors.feedbackTitle.message}
              </p>
            )}
          </div>

          <div className="relative w-full mb-4">
            <textarea
              placeholder="Type Review * ................"
              rows="4"
              {...registerFeedback("feedbackText")}
              className="w-full p-3 border dark:bg-inherit dark:text-white rounded-lg text-[#434343BF] focus:outline-none focus:ring-1 focus:ring-green-300"
            />
            {feedbackErrors.feedbackText && (
              <p className="text-red-500 text-sm">
                {feedbackErrors.feedbackText.message}
              </p>
            )}
            <button
              type="submit"
              className="absolute top-44 right-4 px-6 py-2 bg-primaryColor text-white rounded-full hover:bg-green-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Complaints Section */}
      <div>
        <h1 className="text-size-32 dark:text-white mb-2">
          Complaints & Grievances
        </h1>

        <form onSubmit={handleComplaintSubmit(onComplaintSubmit)}>
          {/* Title Input */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 dark:text-white">
              Title
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              {...registerComplaint("complaintName")}
              className="w-1/2 p-3 border rounded-lg dark:bg-inherit dark:text-white text-[#434343BF] focus:outline-none focus:ring-1 focus:ring-green-300"
            />
            {complaintErrors.complaintName && (
              <p className="text-red-500 text-sm">
                {complaintErrors.complaintName.message}
              </p>
            )}
          </div>

          {/* Complaint Text Area */}
          <div className="mb-11">
            <label className="block dark:text-white text-gray-700 mb-2">
              Write Complaint
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              placeholder="Write....."
              rows="4"
              {...registerComplaint("complaintText")}
              className="w-full p-3 border dark:bg-inherit dark:text-white rounded-lg text-[#434343BF] focus:outline-none focus:ring-1 focus:ring-green-300"
            />
            {complaintErrors.complaintText && (
              <p className="text-red-500 text-sm">
                {complaintErrors.complaintText.message}
              </p>
            )}
          </div>

          {/* Complaint Submit Button */}
          <button
            type="submit"
            className="px-6 py-2 bg-primaryColor text-white rounded-full hover:bg-green-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CoorporateEmpFeedbackAndSupport;
