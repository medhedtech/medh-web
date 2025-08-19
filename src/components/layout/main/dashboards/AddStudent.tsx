"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import usePostQuery from "@/hooks/postQuery.hook";
import { useForm } from "react-hook-form";
import { apiUrls } from "@/apis";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useGetQuery from "@/hooks/getQuery.hook";
import Preloader from "@/components/shared/others/Preloader";
import Image from "next/image";
import { showToast } from "@/utils/toastManager";
import { 
  FaEye, 
  FaEyeSlash, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaCalendarAlt, 
  FaVenusMars,
  FaUpload,
  FaTimes,
  FaCheck,
  FaUserGraduate,
  FaGlobe,
  FaBook,
  FaShieldAlt
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Prop types for AddStudent
interface AddStudentProps {
  onCancel: () => void;
  onSuccess: () => void;
}

// Props for form components
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ComponentType<any>;
  error?: string;
  type?: string;
}

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  showPassword: boolean;
  toggleVisibility: () => void;
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  icon: React.ComponentType<any>;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

interface PhoneInputProps {
  label: string;
  error?: string;
  countryValue: string;
  numberValue: string;
  onCountryChange: React.ChangeEventHandler<HTMLSelectElement>;
  onNumberChange: React.ChangeEventHandler<HTMLInputElement>;
  countryCodes: { code: string; name: string }[];
}

// Validation Schema (simplified)
const schema = yup.object({
  full_name: yup.string().required("Student name is required"),
  email: yup
    .string()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|in)$/,
      "Please enter a valid email"
    ),
          password: yup
          .string()
          .min(6, "At least 6 characters required")
          .required("Password is required"),
});

// Modern Form Input Component
const FormInput: React.FC<FormInputProps> = ({ label, icon: Icon, error, type = "text", ...props }) => (
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
const PasswordInput: React.FC<PasswordInputProps> = ({ label, error, showPassword, toggleVisibility, ...props }) => (
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
        <FaShieldAlt className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200" />
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

// Modern Select Component
const FormSelect: React.FC<FormSelectProps> = ({ label, icon: Icon, error, options, placeholder, ...props }) => (
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
      <select
        {...props}
        className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 appearance-none ${
          error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
            : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500/20'
        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2`}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
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

// Phone Input Component
const PhoneInput: React.FC<PhoneInputProps> = ({ label, error, countryValue, numberValue, onCountryChange, onNumberChange, countryCodes }) => (
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
    <div className="flex gap-3">
      <div className="w-2/5">
        <select
          value={countryValue}
          onChange={onCountryChange}
          className={`w-full px-3 py-3 rounded-xl border transition-all duration-200 ${
            error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500/20'
          } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 text-sm`}
        >
          {countryCodes.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>
      <div className="w-3/5 relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaPhone className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200" />
        </div>
        <input
          type="text"
          value={numberValue}
          onChange={onNumberChange}
          placeholder="Enter phone number"
          className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${
            error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500/20'
          } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 placeholder:text-gray-500 dark:placeholder:text-gray-400`}
        />
      </div>
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

const AddStudent: React.FC<AddStudentProps> = ({ onCancel, onSuccess }) => {
  const router = useRouter();
  const { postQuery, loading } = usePostQuery();
  const { getQuery } = useGetQuery();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      await postQuery({
        url: apiUrls?.Students?.createStudent || "/students/create",
        postData: {
          full_name: data.full_name,
          email: data.email,
          password: data.password,
          role: ["student"],
        },
        onSuccess: () => {
          showToast.success("Student added successfully!");
          reset();
          
          // Call onSuccess callback if provided
          if (onSuccess) {
            onSuccess();
          }
          
          // Redirect to student management page after a short delay
          setTimeout(() => {
            router.push('/dashboards/admin/students/manage');
          }, 1500);
        },
        onFail: (error) => {
          showToast.error(error?.message || "Student already exists with same email or mobile.");
        },
      });
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  if (loading) {
    return <Preloader />;
  }

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
    { value: "prefer_not_to_say", label: "Prefer not to say" }
  ];

  const languageOptions = [
    { value: "english", label: "English" },
    { value: "hindi", label: "Hindi" },
    { value: "spanish", label: "Spanish" },
    { value: "french", label: "French" },
    { value: "german", label: "German" },
    { value: "chinese", label: "Chinese" },
    { value: "japanese", label: "Japanese" },
    { value: "arabic", label: "Arabic" }
  ];

  const educationOptions = [
    { value: "high_school", label: "High School" },
    { value: "diploma", label: "Diploma" },
    { value: "bachelors", label: "Bachelor's Degree" },
    { value: "masters", label: "Master's Degree" },
    { value: "doctorate", label: "Doctorate" },
    { value: "other", label: "Other" }
  ];

  const countryCodes = [
    { code: 'IN', name: 'India (+91)' },
    { code: 'US', name: 'United States (+1)' },
    { code: 'GB', name: 'United Kingdom (+44)' },
    { code: 'CA', name: 'Canada (+1)' },
    { code: 'AU', name: 'Australia (+61)' },
    { code: 'SG', name: 'Singapore (+65)' },
    { code: 'AE', name: 'UAE (+971)' },
    { code: 'SA', name: 'Saudi Arabia (+966)' }
  ];

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
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <FaUserGraduate className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Add New Student
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Create a new student profile with all necessary details
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
            {/* Personal Information Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FaUser className="w-5 h-5 text-green-600 dark:text-green-400" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Full Name"
                  icon={FaUser}
                  placeholder="Enter student's full name"
                  error={errors.full_name?.message}
                  {...register("full_name")}
                />
                
                <FormInput
                  label="Email Address"
                  icon={FaEnvelope}
                  type="email"
                  placeholder="student@example.com"
                  error={errors.email?.message}
                  {...register("email")}
                />
              </div>
            </motion.div>

            {/* Security Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FaShieldAlt className="w-5 h-5 text-green-600 dark:text-green-400" />
                Security Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PasswordInput
                  label="Password"
                  placeholder="Enter password"
                  showPassword={showPassword}
                  toggleVisibility={() => setShowPassword(!showPassword)}
                  error={errors.password?.message}
                  {...register("password")}
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
                onClick={() => onCancel ? onCancel() : router.push('/dashboards/admin/students')}
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
                className={`flex-1 sm:flex-none px-8 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 ${
                  loading
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                    : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    Adding Student...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <FaCheck className="w-5 h-5" />
                    Add Student
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

export default AddStudent; 