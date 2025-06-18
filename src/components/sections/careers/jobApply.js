'use client'
import React, { useState } from "react";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaCamera, FaTimes, FaCheckCircle, FaUpload, FaBriefcase, FaMapMarkerAlt, FaClock, FaDollarSign, FaChevronRight } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import countriesData from "@/utils/countrycode.json";
import CustomReCaptcha from '../../shared/ReCaptcha';
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Globe, MessageSquare, Upload, ArrowRight, Info, Loader2 } from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

// Validation schema using yup
const schema = yup.object({
  full_name: yup
    .string()
    .matches(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain alphabets, spaces, hyphens, and apostrophes."
    )
    .required("Name is required."),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required."),
  country: yup.string().required("Please select your country."),
  phone_number: yup
    .string()
    .required("Please enter your mobile number")
    .test("is-valid-phone", "Phone number must be 10 digits.", function (value) {
      const { country } = this.parent;
      if (!value || !country) return false;
      // Remove any non-digit characters
      const cleanNumber = value.replace(/\D/g, '');
      
      // Ensure the phone number has exactly 10 digits
      if (cleanNumber.length !== 10) {
        return this.createError({
          message: "Phone number must be exactly 10 digits"
        });
      }
      
      const selectedCountry = countriesData.find((c) => c.name === country);
      if (!selectedCountry) return false;
      const phoneWithCountryCode = selectedCountry.dial_code + cleanNumber;
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      return phoneRegex.test(phoneWithCountryCode);
    }),
  message: yup.string(),
  accept: yup
    .boolean()
    .oneOf([true], "You must accept the terms and privacy policy")
    .required(),
});

// Form Input Component
const FormInput = ({ id, type, placeholder, register, error, icon }) => (
  <div>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 pointer-events-none">
        {icon}
      </div>
      <label 
        htmlFor={id} 
        className="absolute -top-2.5 left-9 sm:left-10 px-2 text-xs font-medium bg-white dark:bg-gray-800 text-primary-500 dark:text-primary-400 z-10"
      >
        {placeholder}
      </label>
      <input
        {...register}
        id={id}
        type={type}
        placeholder=""
        className={`w-full h-[52px] pl-10 sm:pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-2 ${
          error 
            ? 'border-red-500 focus:ring-red-500 dark:border-red-500' 
            : 'border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 focus:ring-primary-500 focus:border-primary-500'
        } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 shadow-sm hover:bg-white dark:hover:bg-gray-700/70 text-sm sm:text-base`}
      />
    </div>
    {error && (
      <span className="text-red-500 text-sm mt-1.5 flex items-center pl-1 animate-pulse" role="alert">
        <Info size={14} className="mr-1.5" />
        {error.message}
      </span>
    )}
  </div>
);

// Form Select Component
const FormSelect = ({ id, value, onChange, options, error, icon }) => (
  <div>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 pointer-events-none z-10">
        {icon}
      </div>
      <label 
        htmlFor={id} 
        className="absolute -top-2.5 left-9 sm:left-10 px-2 text-xs font-medium bg-white dark:bg-gray-800 text-primary-500 dark:text-primary-400 z-10"
      >
        Select Your Country
      </label>
      <select
        id={id}
        onChange={onChange}
        value={value}
        className={`w-full h-[52px] pl-10 sm:pl-12 pr-10 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-2 ${
          error 
            ? 'border-red-500 focus:ring-red-500 dark:border-red-500' 
            : 'border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 focus:ring-primary-500 focus:border-primary-500'
        } text-gray-900 dark:text-white focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 shadow-sm appearance-none cursor-pointer hover:bg-white dark:hover:bg-gray-700/70 text-sm sm:text-base`}
        aria-invalid={error ? "true" : "false"}
      >
        <option value="" className="py-2">Select Your Country</option>
        {options.map((option) => (
          <option key={option.code} value={option.name} className="py-2">
            {option.name} ({option.dial_code})
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <div className="p-1.5 bg-primary-100 dark:bg-primary-900/50 rounded-full group-hover:bg-primary-200 dark:group-hover:bg-primary-800/50 transition-colors">
          <ArrowRight className="transform rotate-90 text-primary-500 dark:text-primary-400" size={16} />
        </div>
      </div>
    </div>
    {error && (
      <span className="text-red-500 text-sm mt-1.5 flex items-center pl-1 animate-pulse" role="alert">
        <Info size={14} className="mr-1.5" />
        {error.message}
      </span>
    )}
  </div>
);

// Phone Input Component with improved country code display
const PhoneInput = ({ id, value, onChange, error, countryCode }) => (
  <div>
    <div className="relative group">
      <label 
        htmlFor={id} 
        className="absolute -top-2.5 left-9 sm:left-10 px-2 text-xs font-medium bg-white dark:bg-gray-800 text-primary-500 dark:text-primary-400 z-10"
      >
        Mobile Number
      </label>
      <div className="flex w-full">
        <div className="flex-shrink-0 min-w-[70px] sm:min-w-[80px]">
          <div className="h-[52px] flex items-center justify-center px-2 sm:px-3 md:px-4 bg-primary-50 dark:bg-primary-900/30 border-2 border-r-0 border-gray-200 dark:border-gray-700 rounded-l-xl group-hover:border-primary-400 dark:group-hover:border-primary-500 group-hover:bg-primary-100 dark:group-hover:bg-primary-800/30 transition-all">
            <span className="text-primary-700 dark:text-primary-300 font-medium whitespace-nowrap text-sm sm:text-base">
              {countryCode}
            </span>
          </div>
        </div>
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Phone className={`${error ? 'text-red-500' : 'text-gray-400 dark:text-gray-500 group-hover:text-primary-500 dark:group-hover:text-primary-400'}`} size={18} />
          </div>
          <input
            id={id}
            type="tel"
            inputMode="numeric"
            onChange={onChange}
            value={value}
            placeholder="10-digit number"
            className={`w-full h-[52px] pl-10 pr-4 py-3 rounded-r-xl bg-gray-50 dark:bg-gray-700/50 border-2 border-l-0 ${
              error 
                ? 'border-red-500 focus:ring-red-500 dark:border-red-500' 
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 focus:ring-primary-500 focus:border-primary-500'
            } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 shadow-sm hover:bg-white dark:hover:bg-gray-700/70 text-sm sm:text-base`}
          />
          {value && value.length > 0 && (
            <div className="absolute top-1/2 right-3 -translate-y-1/2">
              <span className={`text-xs px-2 py-1 rounded-full ${value.length === 10 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'}`}>
                {value.length}/10
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
    {error && (
      <span className="text-red-500 text-sm mt-1.5 flex items-center pl-1 animate-pulse" role="alert">
        <Info size={14} className="mr-1.5" />
        {error.message}
      </span>
    )}
  </div>
);

// Form Textarea Component
const FormTextarea = ({ id, placeholder, register, error, icon, value }) => (
  <div>
    <div className="relative">
      <div className="absolute top-4 left-3 sm:left-4 pointer-events-none">
        {icon}
      </div>
      <textarea
        {...register}
        id={id}
        placeholder={placeholder}
        className={`w-full pl-10 sm:pl-12 pr-4 py-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-2 ${
          error 
            ? 'border-red-500 focus:ring-red-500 dark:border-red-500' 
            : 'border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 focus:ring-primary-500 focus:border-primary-500'
        } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 shadow-sm h-32 resize-none hover:bg-white dark:hover:bg-gray-700/70 text-sm sm:text-base`}
      />
    </div>
    {error && (
      <span className="text-red-500 text-sm mt-1.5 flex items-center pl-1" role="alert">
        <Info size={14} className="mr-1.5" />
        {error.message}
      </span>
    )}
  </div>
);

// File Upload Component
const FileUpload = ({ fileName, isUploading, pdfBrochure, handlePdfUpload }) => (
  <div className="p-6 bg-gray-50 dark:bg-gray-700/30 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 transition-all duration-200 hover:border-primary-400 dark:hover:border-primary-500 group">
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className={`p-3 rounded-full ${pdfBrochure ? 'bg-green-100 dark:bg-green-900/30' : 'bg-primary-100 dark:bg-primary-900/30'}`}>
        {isUploading ? (
          <Loader2 className="animate-spin text-primary-600 dark:text-primary-400" size={24} />
        ) : pdfBrochure ? (
          <FaCheckCircle className="text-green-600 dark:text-green-400" size={24} />
        ) : (
          <Upload className="text-primary-600 dark:text-primary-400" size={24} />
        )}
      </div>
      <div className="text-center">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
          {fileName === "No file chosen" ? "Upload your resume" : fileName}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          PDF files only (max 5MB)
        </p>
      </div>
      <label
        htmlFor="fileInput"
        className="cursor-pointer py-2 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-primary-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
      >
        {pdfBrochure ? "Change File" : "Select File"}
      </label>
      <input
        id="fileInput"
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handlePdfUpload}
      />
    </div>
  </div>
);

function JobApply({ activeJob, jobDetails }) {
  const { postQuery, loading } = usePostQuery();
  const [fileName, setFileName] = useState("No file chosen");
  const [showModal, setShowModal] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [recaptchaError, setRecaptchaError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    reset,
    watch,
    setValue,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      full_name: '',
      email: '',
      country: 'India', // Set default country
      phone_number: '',
      message: '',
      accept: false,
    },
    mode: 'onChange',
  });

  const [pdfBrochure, setPdfBrochure] = useState(null);
  const watchedFields = watch();

  // Handle country change
  const handleCountryChange = async (e) => {
    const country = e.target.value;
    setValue('country', country, { shouldValidate: true });
    // Trigger phone validation when country changes
    if (watchedFields.phone_number) {
      await trigger('phone_number');
    }
  };

  // Handle phone number input
  const handlePhoneInput = (e) => {
    let value = e.target.value;
    // Remove any non-digit characters
    value = value.replace(/\D/g, '');
    // Limit to 10 digits
    value = value.slice(0, 10);
    setValue('phone_number', value, { shouldValidate: true });
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
    setRecaptchaError(false);
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showToast.error("File size should not exceed 5MB");
        return;
      }
      setFileName(file.name);
      setIsUploading(true);
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const base64 = reader.result;
          const postData = { base64String: base64 };

          await postQuery({
            url: apiUrls?.upload?.uploadDocument,
            postData,
            onSuccess: (data) => {
              showToast.success("Resume uploaded successfully!");
              setPdfBrochure(data?.data);
            },
            onError: () => {
              showToast.error("Resume upload failed. Please try again.");
            },
          });
        };
      } catch (error) {
        showToast.error("Error uploading resume. Please try again.");
      } finally {
        setIsUploading(false);
      }
    } else {
      setFileName("No file chosen");
    }
  };

  const onSubmit = async (data) => {
    if (!recaptchaValue) {
      setRecaptchaError(true);
      return;
    }
    if (!pdfBrochure) {
      showToast.error("Please upload your resume");
      return;
    }
    try {
      const selectedCountry = countriesData.find(
        (country) => country.name === data.country
      );
      await postQuery({
        url: apiUrls?.jobForm?.addJobPost,
        postData: {
          full_name: data?.full_name,
          country: data?.country,
          email: data?.email,
          phone_number: selectedCountry.dial_code + data?.phone_number,
          message: data?.message,
          resume_image: pdfBrochure,
          accept: data?.accept,
          designation: activeJob,
        },
        onSuccess: () => {
          setShowModal(true);
          setPdfBrochure(null);
          setFileName("No file chosen");
          setRecaptchaError(false);
          setRecaptchaValue(null);
          reset();
        },
        onFail: () => {
          showToast.error("Error submitting application. Please try again.");
        },
      });
    } catch (error) {
      showToast.error("An unexpected error occurred. Please try again.");
    }
  };

  // Get selected country dial code
  const selectedCountryDialCode = watchedFields.country 
    ? (countriesData.find(c => c.name === watchedFields.country))?.dial_code 
    : '';

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <span>Careers</span>
          <FaChevronRight className="h-3 w-3" />
          <span>Job Application</span>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Job Position Header */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400 opacity-90" />
            <div className="relative px-6 sm:px-8 py-8 sm:py-10 text-white">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  {jobDetails?.title || activeJob || "Position"}
                </h1>
                
                <div className="flex flex-wrap gap-4 sm:gap-6 text-sm sm:text-base">
                  {jobDetails?.department && (
                    <div className="flex items-center gap-2">
                      <FaBriefcase className="text-white/80" />
                      <span>{jobDetails.department}</span>
                    </div>
                  )}
                  {jobDetails?.location && (
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-white/80" />
                      <span>{jobDetails.location}</span>
                    </div>
                  )}
                  {jobDetails?.type && (
                    <div className="flex items-center gap-2">
                      <FaClock className="text-white/80" />
                      <span>{jobDetails.type}</span>
                    </div>
                  )}
                  {jobDetails?.salary && (
                    <div className="flex items-center gap-2">
                      <FaDollarSign className="text-white/80" />
                      <span>{jobDetails.salary}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-12 gap-8">
            {/* Left Column - Job Details */}
            <div className="md:col-span-5 px-6 sm:px-8 py-6 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Job Description
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {jobDetails?.description || "Join our team and be part of something great!"}
                  </p>
                </div>

                {jobDetails?.requirements && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      Requirements
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                      {jobDetails.requirements.map((req, index) => (
                        <li key={index} className="leading-relaxed">{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Column - Application Form */}
            <div className="md:col-span-7 px-6 sm:px-8 py-6">
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  Submit Your Application
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <FormInput 
                    id="full_name"
                    type="text"
                    placeholder="Your Full Name"
                    register={register("full_name")}
                    error={errors.full_name}
                    icon={<User className={`${errors.full_name ? 'text-red-500' : 'text-gray-400 dark:text-gray-500 group-hover:text-primary-500 dark:group-hover:text-primary-400'}`} size={18} />}
                  />

                  <FormInput 
                    id="email"
                    type="email"
                    placeholder="Your Email Address"
                    register={register("email")}
                    error={errors.email}
                    icon={<Mail className={`${errors.email ? 'text-red-500' : 'text-gray-400 dark:text-gray-500 group-hover:text-primary-500 dark:group-hover:text-primary-400'}`} size={18} />}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <FormSelect 
                      id="country"
                      value={watchedFields.country || ''}
                      onChange={handleCountryChange}
                      options={countriesData}
                      error={errors.country}
                      icon={<Globe className={`${errors.country ? 'text-red-500' : 'text-gray-400 dark:text-gray-500 group-hover:text-primary-500 dark:group-hover:text-primary-400'}`} size={18} />}
                    />

                    <PhoneInput 
                      id="phone_number"
                      value={watchedFields.phone_number || ''}
                      onChange={handlePhoneInput}
                      error={errors.phone_number}
                      countryCode={selectedCountryDialCode}
                    />
                  </div>

                  <FormTextarea 
                    id="message"
                    placeholder="Write your cover letter (optional)"
                    register={register("message")}
                    error={errors.message}
                    icon={<MessageSquare className={`${errors.message ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`} size={18} />}
                    value={watchedFields.message || ''}
                  />

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Upload Your Resume*
                    </h3>
                    <FileUpload 
                      fileName={fileName}
                      isUploading={isUploading}
                      pdfBrochure={pdfBrochure}
                      handlePdfUpload={handlePdfUpload}
                    />
                  </div>

                  {/* reCAPTCHA */}
                  <div className="flex justify-center">
                    <CustomReCaptcha
                      onChange={handleRecaptchaChange}
                      error={recaptchaError}
                    />
                  </div>
                  
                  {/* Terms and Privacy */}
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center h-5 mt-1">
                      <input
                        {...register("accept")}
                        type="checkbox"
                        id="accept"
                        className="h-5 w-5 text-primary-600 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors cursor-pointer hover:border-primary-400 dark:hover:border-primary-500"
                      />
                    </div>
                    <label
                      htmlFor="accept"
                      className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
                    >
                      I agree to the 
                      <a href="/terms-and-services" className="text-primary-600 dark:text-primary-400 hover:underline ml-1 font-medium">
                        Terms of Service
                      </a>
                      {" "}and{" "}
                      <a href="/privacy-policy" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  {errors.accept && (
                    <div className="ml-8">
                      <span className="text-red-500 text-sm flex items-center">
                        <Info size={14} className="mr-1.5 flex-shrink-0" />
                        {errors.accept.message}
                      </span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <motion.div 
                    className="pt-4"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      type="submit"
                      disabled={isSubmitting || loading || !isDirty || !isValid}
                      className={`w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/20 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg`}
                    >
                      {(isSubmitting || loading) ? (
                        <motion.div
                          className="flex items-center"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Loader2 size={20} className="mr-2 animate-spin" />
                          Processing...
                        </motion.div>
                      ) : (
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center"
                        >
                          Submit Application
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </motion.span>
                      )}
                    </button>
                  </motion.div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-8 m-4 relative"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full p-1"
                aria-label="Close modal"
              >
                <FaTimes size={20} />
              </button>

              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                  <FaCheckCircle className="text-primary-600 dark:text-primary-400" size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Application Submitted!
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Thank you for your interest. We'll review your application and get back to you soon.
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-primary-500/20"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

JobApply.defaultProps = {
  jobDetails: {
    title: "",
    department: "",
    location: "",
    type: "",
    salary: "",
    description: "",
    requirements: [],
  },
};

export default JobApply;
