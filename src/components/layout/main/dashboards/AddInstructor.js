"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import usePostQuery from "@/hooks/postQuery.hook";
import { useForm } from "react-hook-form";
import { apiUrls } from "@/apis";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Preloader from "@/components/shared/others/Preloader";
import InstructorTable from "./InstructorManage";
import { 
  FaEye, 
  FaEyeSlash, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaTimes,
  FaCheck,
  FaGraduationCap
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Validation Schema
const schema = yup.object({
  full_name: yup.string().required("Full name is required"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email"),
      password: yup
      .string()
      .min(6, "At least 6 characters required")
      .required("Password is required"),
  phone_number: yup
    .string()
    .required("Phone number is required")
    .matches(/^[+]?[\d\s-()]+$/, "Please enter a valid phone number"),
  domain: yup.string().optional(),
  experience: yup.string().optional(),
  qualification: yup.string().optional(),
});

// Modern Form Input Component
const FormInput = ({ label, icon: Icon, error, type = "text", ...props }) => (
  <motion.div 
    className="relative"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
      {label}
      <span className="text-red-500 ml-1">*</span>
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200" />
      </div>
      <input
        type={type}
        className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${
          error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
            : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500/20'
        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 placeholder:text-gray-500 dark:placeholder:text-gray-400`}
        {...props}
      />
    </div>
    <AnimatePresence mode="wait">
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-red-500 text-xs mt-1 flex items-center gap-1"
        >
          <FaTimes className="w-3 h-3" />
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </motion.div>
);

// Modern Password Input Component
const PasswordInput = ({ label, error, showPassword, toggleVisibility, ...props }) => (
  <motion.div 
    className="relative"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
      {label}
      <span className="text-red-500 ml-1">*</span>
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaUser className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200" />
      </div>
      <input
        type={showPassword ? "text" : "password"}
        className={`w-full pl-10 pr-12 py-3 rounded-xl border transition-all duration-200 ${
          error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
            : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500/20'
        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 placeholder:text-gray-500 dark:placeholder:text-gray-400`}
        {...props}
      />
      <button
        type="button"
        onClick={toggleVisibility}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none transition-colors duration-200"
      >
        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
      </button>
    </div>
    <AnimatePresence mode="wait">
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-red-500 text-xs mt-1 flex items-center gap-1"
        >
          <FaTimes className="w-3 h-3" />
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </motion.div>
);


const AddInstructor = ({ onCancel, onSuccess }) => {
  const router = useRouter();
  const { postQuery, loading } = usePostQuery();
  const [showInstructorListing, setShowInstructorListing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
  });


  const onSubmit = async (data) => {
    try {
      await postQuery({
        url: apiUrls?.Instructor?.createInstructor,
        postData: {
          full_name: data.full_name,
          email: data.email,
          password: data.password,
          phone_number: data.phone_number,
          domain: data.domain || undefined,
          meta: {
            experience: data.experience || undefined,
            qualification: data.qualification || undefined,
          },
        },
        onSuccess: () => {
          showToast.success("Instructor added successfully!");
          reset();
          // Call onSuccess callback if provided, otherwise fall back to internal state
          if (onSuccess) {
            onSuccess();
          } else {
            setShowInstructorListing(true);
          }
        },
        onFail: () => {
          showToast.error("Instructor already exists with same email or mobile.");
        },
      });
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  // Only show InstructorTable if no onSuccess callback is provided (backward compatibility)
  if (showInstructorListing && !onSuccess) {
    return <InstructorTable onCancel={() => setShowInstructorListing(false)} />;
  }

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 pt-9">
      <motion.div 
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <FaGraduationCap className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Add New Instructor
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Create a new instructor profile with all necessary details
              </p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FaUser className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                Instructor Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Full Name"
                  icon={FaUser}
                  placeholder="Enter instructor's full name"
                  error={errors.full_name?.message}
                  {...register("full_name")}
                />
                
                <FormInput
                  label="Email Address"
                  icon={FaEnvelope}
                  type="email"
                  placeholder="instructor@example.com"
                  error={errors.email?.message}
                  {...register("email")}
                />
                
                <FormInput
                  label="Phone Number"
                  icon={FaPhone}
                  placeholder="+1234567890"
                  error={errors.phone_number?.message}
                  {...register("phone_number")}
                />
                
                <PasswordInput
                  label="Password"
                  placeholder="Enter password"
                  showPassword={showPassword}
                  toggleVisibility={() => setShowPassword(!showPassword)}
                  error={errors.password?.message}
                  {...register("password")}
                />
                
                <FormInput
                  label="Domain/Subject Expertise"
                  icon={FaGraduationCap}
                  placeholder="e.g., Mathematics, Science, Programming"
                  error={errors.domain?.message}
                  {...register("domain")}
                />
                
                <FormInput
                  label="Experience"
                  icon={FaUser}
                  placeholder="e.g., 5 years"
                  error={errors.experience?.message}
                  {...register("experience")}
                />
                
                <FormInput
                  label="Qualification"
                  icon={FaGraduationCap}
                  placeholder="e.g., PhD, Masters, Bachelor's"
                  error={errors.qualification?.message}
                  {...register("qualification")}
                />
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
                              <motion.button
                type="button"
                  onClick={() => onCancel ? onCancel() : setShowInstructorListing(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 sm:flex-none px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-all duration-200 font-medium"
                >
                  Cancel
                </motion.button>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={`flex-1 sm:flex-none px-8 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                  loading
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                    : 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-600/20'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    Adding Instructor...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <FaCheck className="w-5 h-5" />
                    Add Instructor
                  </div>
                )}
              </motion.button>
            </motion.div>
        </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AddInstructor;
