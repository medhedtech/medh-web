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
import InstructorTable from "./InstructorManage";
import Image from "next/image";
import { 
  FaEye, 
  FaEyeSlash, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaCalendarAlt, 
  FaDollarSign,
  FaVenusMars,
  FaUpload,
  FaTimes,
  FaCheck,
  FaGraduationCap,
  FaTag
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Validation Schema
const schema = yup.object({
  full_name: yup.string().required("Instructor name is required"),
  age: yup
    .number()
    .typeError("Age must be a number")
    .required("Age is required")
    .min(18, "Age must be above 18 years"),
  phone_number: yup
    .string()
    .required("Mobile number is required")
    .matches(/^[6-9]\d{9}$/, "Mobile number must be a valid 10-digit number"),
  email: yup
    .string()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|in)$/,
      "Please enter a valid email"
    ),
  course_name: yup.string(),
  amount_per_session: yup
    .number()
    .typeError("Amount per session must be a number")
    .required("Amount per session is required"),
  category: yup.string().required("This field is required"),
  confirm_password: yup
    .string()
    .oneOf(
      [yup.ref("password"), null],
      "Password and confirm password must match"
    )
    .required("Confirm password is required"),
  password: yup
    .string()
    .min(8, "At least 8 characters required")
    .required("Password is required"),
  gender: yup.string().required("Gender is required"),
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

// Modern Select Component
const FormSelect = ({ label, icon: Icon, error, options, value, onChange, placeholder, ...props }) => (
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
        value={value}
        onChange={onChange}
        className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 appearance-none ${
          error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
            : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500/20'
        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2`}
        {...props}
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

// Modern Dropdown Component
const ModernDropdown = ({ label, icon: Icon, error, options, value, onSelect, placeholder, searchable = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options?.filter(option =>
    option.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <motion.div 
      className="relative"
      ref={dropdownRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
        {label}
        <span className="text-red-500 ml-1">*</span>
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400 transition-colors duration-200" />
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full pl-10 pr-10 py-3 rounded-xl border transition-all duration-200 text-left ${
            error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500/20'
          } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2`}
        >
          {value || placeholder}
        </button>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <motion.svg 
            className="h-5 w-5 text-gray-400"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </motion.svg>
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-xl max-h-60 overflow-hidden"
          >
            {searchable && (
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <motion.button
                    key={option._id || option.id}
                    type="button"
                    whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors duration-200"
                    onClick={() => {
                      onSelect(option.name);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                  >
                    {option.image && (
                      <Image
                        src={option.image}
                        alt={option.name}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                    )}
                    <span className="text-gray-900 dark:text-white">{option.name}</span>
                  </motion.button>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                  No results found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
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
};

// File Upload Component
const FileUpload = ({ onUpload, files, onRemove }) => (
  <motion.div 
    className="space-y-3"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
      Upload Valid Document
      <span className="text-gray-500 text-xs ml-2">(Optional)</span>
    </label>
    <div className="relative">
      <input
        type="file"
        multiple
        accept=".pdf"
        onChange={onUpload}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <motion.div 
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-primary-500 dark:hover:border-primary-400 transition-colors duration-200 bg-gray-50 dark:bg-gray-800/50"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <FaUpload className="mx-auto h-8 w-8 text-gray-400 mb-3" />
        <p className="text-primary-600 dark:text-primary-400 font-medium mb-1">
          Click to upload documents
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          PDF files only
        </p>
      </motion.div>
    </div>
    
    {files && files.length > 0 && (
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {files.map((file, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <FaCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm text-green-800 dark:text-green-200">
                Document {index + 1} uploaded
              </span>
            </div>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </motion.div>
    )}
  </motion.div>
);

const AddInstructor = ({ onCancel, onSuccess }) => {
  const router = useRouter();
  const { postQuery, loading } = usePostQuery();
  const { getQuery } = useGetQuery();
  const [courses, setCourses] = useState([]);
  const [pdfBrochures, setPdfBrochures] = useState([]);
  const [showInstructorListing, setShowInstructorListing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  useEffect(() => {
    fetchAllCategories();
    fetchCourseNames();
  }, []);

  const fetchAllCategories = () => {
    try {
      getQuery({
        url: apiUrls?.categories?.getAllCategories,
        onSuccess: (res) => {
          const formattedCategories = res.data?.map(cat => ({
            _id: cat._id,
            name: cat.category_name,
            image: cat.category_image
          })) || [];
          setCategories(formattedCategories);
        },
        onFail: (err) => {
          console.error("Failed to fetch categories: ", err);
        },
      });
    } catch (err) {
      console.error("Error fetching categories: ", err);
    }
  };

    const fetchCourseNames = async () => {
      try {
        await getQuery({
          url: apiUrls?.courses?.getAllCourses,
          onSuccess: (data) => {
          let courseList = [];
            if (Array.isArray(data)) {
            courseList = data;
            } else if (data && Array.isArray(data.courses)) {
            courseList = data.courses;
            } else if (data && data.data && Array.isArray(data.data)) {
            courseList = data.data;
          }
          
          const formattedCourses = courseList.map(course => ({
            _id: course._id,
            name: course.course_title,
            image: course.course_image
          }));
          setCourses(formattedCourses);
          },
          onFail: (err) => {
          console.error("API error:", err instanceof Error ? err.message : err);
            setCourses([]);
          },
        });
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setCourses([]);
      }
    };

  const handlePdfUpload = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      try {
        const updatedPdfs = [...pdfBrochures];
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
                updatedPdfs.push(data?.data);
                setPdfBrochures([...updatedPdfs]);
                showToast.success("Document uploaded successfully!");
              },
              onError: (error) => {
                showToast.error("Document upload failed. Please try again.");
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

  const removePdf = (index) => {
    setPdfBrochures((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    try {
      await postQuery({
        url: apiUrls?.Instructor?.createInstructor,
        postData: {
          full_name: data.full_name,
          email: data.email,
          phone_number: data.phone_number,
          password: data?.password,
          meta: {
            course_name: data.course_name,
            age: data.age,
            category: data.category,
            gender: data.gender,
            upload_resume: pdfBrochures.length > 0 ? pdfBrochures : [],
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

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Others", label: "Others" }
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
            {/* Personal Information Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FaUser className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                Personal Information
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
                  placeholder="9999999999"
                  error={errors.phone_number?.message}
                  {...register("phone_number")}
                />
                
                <FormInput
                  label="Age"
                  icon={FaCalendarAlt}
              type="number"
                  placeholder="Enter age"
                  error={errors.age?.message}
              {...register("age")}
            />
                
                <FormSelect
                  label="Gender"
                  icon={FaVenusMars}
                  placeholder="Select gender"
                  options={genderOptions}
                  error={errors.gender?.message}
                  {...register("gender")}
              />
            </div>
            </motion.div>

            {/* Professional Information Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FaGraduationCap className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                Professional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ModernDropdown
                  label="Course Category"
                  icon={FaTag}
                  placeholder="Select category"
                  options={categories}
                  value={selectedCategory}
                  onSelect={(value) => {
                    setSelectedCategory(value);
                    setValue("category", value);
                            trigger("category");
                          }}
                  error={errors.category?.message}
                />
                
                <ModernDropdown
                  label="Course Name"
                  icon={FaGraduationCap}
                  placeholder="Select course"
                  options={courses}
                  value={selectedCourse}
                  onSelect={(value) => {
                    setSelectedCourse(value);
                    setValue("course_name", value);
                  }}
                />
                
                <FormInput
                  label="Amount Per Session (USD)"
                  icon={FaDollarSign}
                  type="number"
              placeholder="Enter amount in USD"
                  error={errors.amount_per_session?.message}
              {...register("amount_per_session")}
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
                <FaUser className="w-5 h-5 text-primary-600 dark:text-primary-400" />
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
                
                <PasswordInput
                  label="Confirm Password"
                  placeholder="Confirm password"
                  showPassword={showConfirmPassword}
                  toggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
                  error={errors.confirm_password?.message}
                  {...register("confirm_password")}
                />
            </div>
            </motion.div>

            {/* Document Upload Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FaUpload className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                Documents
              </h3>
              <FileUpload
                onUpload={handlePdfUpload}
                files={pdfBrochures}
                onRemove={removePdf}
              />
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
