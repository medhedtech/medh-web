"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Star, Send, User, AlertCircle, Loader2, ThumbsUp, MessageCircle } from "lucide-react";

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

const FormInput = ({ label, icon: Icon, error, ...props }) => (
  <div className="relative">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
      {label}
      <span className="text-red-500 ml-1">*</span>
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
          error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary-500'
        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200`}
        {...props}
      />
    </div>
    <AnimatePresence mode="wait">
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-red-500 text-xs mt-1"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

const FeedbackandSupport = () => {
  const { postQuery, loading } = usePostQuery();
  const {
    register: registerFeedback,
    handleSubmit: handleFeedbackSubmit,
    reset: resetFeedback,
    formState: { errors: feedbackErrors, isDirty: isFeedbackDirty },
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
    formState: { errors: complaintErrors, isDirty: isComplaintDirty },
  } = useForm({
    resolver: yupResolver(complaintSchema),
    defaultValues: {
      complaintName: "",
      complaintText: "",
    },
  });

  const onFeedbackSubmit = (data) => {
    postQuery({
      url: apiUrls?.feedbacks?.createFeedback,
      postData: {
        feedback_text: data?.feedbackText,
        feedback_for: data?.feedbackType,
        feedback_title: data?.feedbackTitle,
      },
      onSuccess: () => {
        toast.success("Feedback submitted successfully");
        resetFeedback();
      },
      onFail: (error) => {
        toast.error("Failed to submit feedback. Please try again.");
        console.error("Error submitting feedback:", error);
      },
    });
  };

  const onComplaintSubmit = (data) => {
    postQuery({
      url: apiUrls?.feedbacks?.createComplaint,
      postData: {
        name: data?.complaintName,
        description: data?.complaintText,
      },
      onSuccess: () => {
        toast.success("Complaint submitted successfully");
        resetComplaint();
      },
      onFail: (error) => {
        toast.error("Failed to submit complaint. Please try again.");
        console.error("Error submitting complaint:", error);
      },
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 w-full max-w-6xl mx-auto space-y-8"
    >
      {/* Feedback Section */}
      <motion.div 
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
            <ThumbsUp className="w-6 h-6 text-primary-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Share Your Feedback
          </h2>
        </div>

        <form onSubmit={handleFeedbackSubmit(onFeedbackSubmit)} className="space-y-6">
          <div className="flex flex-col space-y-4">
            <label className="text-lg font-medium text-gray-700 dark:text-gray-300">
              What would you like to review?
            </label>
            <div className="flex gap-6">
              <motion.label
                className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  feedbackType === "course"
                    ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                    : "bg-gray-50 text-gray-500 dark:bg-gray-700/50 dark:text-gray-400"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  type="radio"
                  value="course"
                  {...registerFeedback("feedbackType")}
                  className="hidden"
                />
                <Star className="w-5 h-5" />
                Course
              </motion.label>

              <motion.label
                className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  feedbackType === "instructor"
                    ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                    : "bg-gray-50 text-gray-500 dark:bg-gray-700/50 dark:text-gray-400"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  type="radio"
                  value="instructor"
                  {...registerFeedback("feedbackType")}
                  className="hidden"
                />
                <User className="w-5 h-5" />
                Instructor
              </motion.label>
            </div>
            {feedbackErrors.feedbackType && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm"
              >
                {feedbackErrors.feedbackType.message}
              </motion.p>
            )}
          </div>

          <FormInput
            label="Title"
            icon={MessageCircle}
            type="text"
            error={feedbackErrors.feedbackTitle?.message}
            {...registerFeedback("feedbackTitle")}
          />

          <div className="relative">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
              Your Feedback
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <MessageSquare className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                rows="4"
                placeholder="Share your thoughts..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                  feedbackErrors.feedbackText ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200`}
                {...registerFeedback("feedbackText")}
              />
              <AnimatePresence mode="wait">
                {feedbackErrors.feedbackText && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {feedbackErrors.feedbackText.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <motion.div 
            className="flex justify-end"
            initial={false}
            animate={{ opacity: isFeedbackDirty ? 1 : 0.5 }}
          >
            <motion.button
              type="submit"
              disabled={loading || !isFeedbackDirty}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200
                ${isFeedbackDirty 
                  ? 'bg-primary-500 hover:bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'}`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Feedback
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>

      {/* Complaints Section */}
      <motion.div 
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Submit a Complaint
          </h2>
        </div>

        <form onSubmit={handleComplaintSubmit(onComplaintSubmit)} className="space-y-6">
          <FormInput
            label="Title"
            icon={MessageCircle}
            type="text"
            error={complaintErrors.complaintName?.message}
            {...registerComplaint("complaintName")}
          />

          <div className="relative">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
              Complaint Details
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <AlertCircle className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                rows="4"
                placeholder="Describe your complaint..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                  complaintErrors.complaintText ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200`}
                {...registerComplaint("complaintText")}
              />
              <AnimatePresence mode="wait">
                {complaintErrors.complaintText && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {complaintErrors.complaintText.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <motion.div 
            className="flex justify-end"
            initial={false}
            animate={{ opacity: isComplaintDirty ? 1 : 0.5 }}
          >
            <motion.button
              type="submit"
              disabled={loading || !isComplaintDirty}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200
                ${isComplaintDirty 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'}`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Complaint
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default FeedbackandSupport;
