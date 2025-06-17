"use client";

import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import { toast } from "react-toastify";
import {
  MessageSquare,
  Star,
  Send,
  User,
  AlertCircle,
  Loader2,
  ThumbsUp,
  MessageCircle,
  HelpCircle,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  FileText,
  Heart
} from 'lucide-react';

// Define schemas for form validation
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

// Define types for form data
interface IFeedbackFormData {
  feedbackType: string;
  feedbackText: string;
  feedbackTitle: string;
}

interface IComplaintFormData {
  complaintName: string;
  complaintText: string;
}

interface IFeedbackStats {
  totalSubmitted: number;
  resolved: number;
  pending: number;
  averageResponse: string;
}

/**
 * FeedbackMain - Component that displays the feedback content
 * within the student dashboard layout
 */
const FeedbackMain: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<"feedback" | "complaint" | "support">("feedback");
  const { postQuery, loading } = usePostQuery();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  }), []);

  // Mock feedback stats
  const feedbackStats = useMemo<IFeedbackStats>(() => ({
    totalSubmitted: 12,
    resolved: 10,
    pending: 2,
    averageResponse: "24 hours"
  }), []);

  // Feedback form setup
  const {
    register: registerFeedback,
    handleSubmit: handleFeedbackSubmit,
    reset: resetFeedback,
    formState: { errors: feedbackErrors },
    watch,
  } = useForm<IFeedbackFormData>({
    resolver: yupResolver(feedbackSchema),
    defaultValues: {
      feedbackType: "course",
      feedbackText: "",
      feedbackTitle: "",
    },
  });

  // Watch feedback type for conditional rendering
  const feedbackType = watch("feedbackType");

  // Complaint form setup
  const {
    register: registerComplaint,
    handleSubmit: handleComplaintSubmit,
    reset: resetComplaint,
    formState: { errors: complaintErrors },
  } = useForm<IComplaintFormData>({
    resolver: yupResolver(complaintSchema),
    defaultValues: {
      complaintName: "",
      complaintText: "",
    },
  });

  // Handle feedback submission
  const onFeedbackSubmit = (data: IFeedbackFormData) => {
    postQuery({
      url: apiUrls?.feedbacks?.createFeedback,
      postData: {
        feedback_text: data?.feedbackText,
        feedback_for: data?.feedbackType,
        feedback_title: data?.feedbackTitle,
      },
      onSuccess: () => {
        showToast.success("Feedback submitted successfully");
        resetFeedback();
      },
      onFail: (error: any) => {
        toast.error("Failed to submit feedback. Please try again.");
        console.error("Error submitting feedback:", error);
      },
    });
  };

  // Handle complaint submission
  const onComplaintSubmit = (data: IComplaintFormData) => {
    postQuery({
      url: apiUrls?.feedbacks?.createComplaint,
      postData: {
        name: data?.complaintName,
        description: data?.complaintText,
      },
      onSuccess: () => {
        showToast.success("Complaint submitted successfully");
        resetComplaint();
      },
      onFail: (error: any) => {
        toast.error("Failed to submit complaint. Please try again.");
        console.error("Error submitting complaint:", error);
      },
    });
  };

  // Stats Component
  const FeedbackStats = () => (
    <div className="bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-800 dark:to-primary-900 rounded-2xl p-4 sm:p-6 text-white shadow-lg">
      <div className="flex flex-nowrap items-center justify-between gap-4 sm:gap-6 overflow-x-auto">
        {/* Total Submitted */}
        <div className="text-center flex-1 min-w-[100px]">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{feedbackStats.totalSubmitted}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium whitespace-nowrap">Total Submitted</div>
        </div>

        {/* Resolved */}
        <div className="text-center flex-1 min-w-[80px]">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{feedbackStats.resolved}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium">Resolved</div>
        </div>

        {/* Average Response */}
        <div className="text-center flex-1 min-w-[100px]">
          <div className="text-2xl sm:text-3xl font-bold mb-1 text-green-200">{feedbackStats.averageResponse}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium uppercase tracking-wide whitespace-nowrap">Avg Response</div>
        </div>

        {/* Pending */}
        <div className="text-center flex-1 min-w-[80px]">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{feedbackStats.pending}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium">Pending</div>
        </div>
      </div>
    </div>
  );

  // Form Input Component
  const FormInput = ({ label, icon: Icon, error, ...props }: any) => (
    <div className="relative">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
        {label}
        <span className="text-red-500 ml-1">*</span>
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
            error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary-500'
          } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200`}
          {...props}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs mt-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );

  // Feedback Form Component
  const FeedbackForm = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
          <ThumbsUp className="w-6 h-6 text-blue-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Share Your Feedback
        </h3>
      </div>

      <form onSubmit={handleFeedbackSubmit(onFeedbackSubmit)} className="space-y-6">
        <div className="flex flex-col space-y-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            What would you like to review?
          </label>
          <div className="flex gap-4">
            <motion.label
              className={`flex items-center gap-2 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                feedbackType === "course"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-2 border-blue-200 dark:border-blue-800"
                  : "bg-gray-50 text-gray-500 dark:bg-gray-700/50 dark:text-gray-400 border-2 border-gray-200 dark:border-gray-600"
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
              className={`flex items-center gap-2 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                feedbackType === "instructor"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-2 border-blue-200 dark:border-blue-800"
                  : "bg-gray-50 text-gray-500 dark:bg-gray-700/50 dark:text-gray-400 border-2 border-gray-200 dark:border-gray-600"
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
          label="Feedback Title"
          icon={MessageCircle}
          type="text"
          placeholder="Brief title for your feedback"
          error={feedbackErrors.feedbackTitle?.message}
          {...registerFeedback("feedbackTitle")}
        />

        <div className="relative">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Your Feedback
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <MessageSquare className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              rows={4}
              placeholder="Share your thoughts and suggestions..."
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                feedbackErrors.feedbackText ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200`}
              {...registerFeedback("feedbackText")}
            />
            {feedbackErrors.feedbackText && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs mt-1"
              >
                {feedbackErrors.feedbackText.message}
              </motion.p>
            )}
          </div>
        </div>

        <motion.div className="flex justify-end">
          <motion.button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            Submit Feedback
          </motion.button>
        </motion.div>
      </form>
    </div>
  );

  // Complaint Form Component
  const ComplaintForm = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20">
          <AlertCircle className="w-6 h-6 text-amber-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Submit a Complaint
        </h3>
      </div>

      <form onSubmit={handleComplaintSubmit(onComplaintSubmit)} className="space-y-6">
        <FormInput
          label="Your Name"
          icon={User}
          type="text"
          placeholder="Enter your full name"
          error={complaintErrors.complaintName?.message}
          {...registerComplaint("complaintName")}
        />

        <div className="relative">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Describe your complaint
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <MessageSquare className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              rows={4}
              placeholder="Please provide detailed information about your complaint..."
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                complaintErrors.complaintText ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200`}
              {...registerComplaint("complaintText")}
            />
            {complaintErrors.complaintText && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs mt-1"
              >
                {complaintErrors.complaintText.message}
              </motion.p>
            )}
          </div>
        </div>

        <motion.div className="flex justify-end">
          <motion.button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            Submit Complaint
          </motion.button>
        </motion.div>
      </form>
    </div>
  );

  // Support Resources Component
  const SupportResources = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
          <HelpCircle className="w-6 h-6 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Support Resources
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-blue-500" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              FAQ
            </h4>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Find answers to common questions about courses, platform features, and more.
          </p>
          <a
            href="/faq"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1"
          >
            View FAQs <span className="text-xl">→</span>
          </a>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-6 h-6 text-green-500" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              Email Support
            </h4>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Get direct assistance from our support team via email.
          </p>
          <a
            href="mailto:support@medh.com"
            className="text-green-600 dark:text-green-400 hover:underline font-medium flex items-center gap-1"
          >
            Email Us <span className="text-xl">→</span>
          </a>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <Phone className="w-6 h-6 text-purple-500" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              Phone Support
            </h4>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Call our support hotline for immediate assistance.
          </p>
          <a
            href="tel:+1234567890"
            className="text-purple-600 dark:text-purple-400 hover:underline font-medium flex items-center gap-1"
          >
            Call Now <span className="text-xl">→</span>
          </a>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-orange-500" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              Support Hours
            </h4>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Monday - Friday: 9:00 AM - 6:00 PM<br />
            Saturday: 10:00 AM - 4:00 PM
          </p>
          <span className="text-orange-600 dark:text-orange-400 font-medium">
            Response within 24 hours
          </span>
        </div>
      </div>
    </div>
  );

  // Preloader
  const FeedbackPreloader = () => (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse border border-gray-200 dark:border-gray-700">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );

  if (!isClient) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <FeedbackPreloader />
      </div>
    );
  }

  return (
    <div className="w-full">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8 lg:space-y-12 pt-8 lg:pt-12"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants} className="text-center pt-6 pb-4">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-primary-500 mr-3" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Feedback & Support
            </h1>
          </div>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            Share your thoughts, report issues, and get the support you need
          </p>
        </motion.div>



        {/* Tab Navigation */}
        <motion.div variants={itemVariants} className="px-4 sm:px-6 lg:px-8">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6">
            {[
              { key: "feedback", label: "Feedback", icon: ThumbsUp },
              { key: "complaint", label: "Complaint", icon: AlertCircle },
              { key: "support", label: "Support", icon: HelpCircle }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors flex-1 justify-center ${
                  activeTab === key
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div variants={itemVariants} className="px-4 sm:px-6 lg:px-8">
          {activeTab === "feedback" && <FeedbackForm />}
          {activeTab === "complaint" && <ComplaintForm />}
          {activeTab === "support" && <SupportResources />}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FeedbackMain; 