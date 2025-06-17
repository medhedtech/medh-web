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

const InstructorFeedbackComponents = () => {
  const { postQuery } = usePostQuery();
  const {
    register: registerFeedback,
    handleSubmit: handleFeedbackSubmit,
    reset: resetFeedback,
    formState: { errors: feedbackErrors },
    watch,
  } = useForm({
    resolver: yupResolver(feedbackSchema),
    defaultValues: {
      feedbackType: "student",
      feedbackText: "",
      feedbackTitle: "",
    },
  });

  const feedbackType = watch("feedbackType");

  const onFeedbackSubmit = (data) => {
    postQuery({
      url: apiUrls?.feedbacks?.instructorFeedback,
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

  return (
    <div className="p-6 w-full mx-auto">
      <div className="mb-8 px-8 pb-16 pt-4 bg-white rounded-md">
        <h1 className="text-size-32 dark:text-white"> Raise a Feedback</h1>

        <form onSubmit={handleFeedbackSubmit(onFeedbackSubmit)}>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex gap-3 mb-2.5">
              {/* Course radio button */}
              <label
                className={`flex items-center text-lg ${
                  feedbackType === "student"
                    ? "text-[#7ECA9D] font-semibold"
                    : "text-[#B4BDC4]"
                }`}
              >
                <input
                  type="radio"
                  value="student"
                  {...registerFeedback("feedbackType")}
                  className="mr-2 peer"
                />
                Student
              </label>

              {/* Instructor radio button */}
              <label
                className={`flex items-center text-lg ${
                  feedbackType === "admin"
                    ? "text-[#7ECA9D] font-semibold"
                    : "text-[#B4BDC4]"
                }`}
              >
                <input
                  type="radio"
                  value="admin"
                  {...registerFeedback("feedbackType")}
                  className="mr-2 custom-radio"
                />
                Admin
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
              placeholder="Title ...."
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
            <label className="block text-gray-700 mb-2 dark:text-white">
              Write Feedback
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              placeholder="Write................"
              rows="4"
              {...registerFeedback("feedbackText")}
              className="w-full p-3 border dark:bg-inherit dark:text-white rounded-lg text-[#434343BF] focus:outline-none focus:ring-1 focus:ring-green-300"
            />
            {feedbackErrors.feedbackText && (
              <p className="text-red-500 text-sm">
                {feedbackErrors.feedbackText.message}
              </p>
            )}
          </div>
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

export default InstructorFeedbackComponents;
