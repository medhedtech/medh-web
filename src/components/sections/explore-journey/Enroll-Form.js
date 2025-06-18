"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import Link from "next/link";
import registrationImage1 from "@/assets/images/register/register__1.png";
import registrationImage2 from "@/assets/images/register/register__2.png";
import registrationImage3 from "@/assets/images/register/register__3.png";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Preloader from "@/components/shared/others/Preloader";
import ReCAPTCHA from "react-google-recaptcha";
import countriesData from "@/utils/countrycode.json";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Globe, MessageSquare, CheckCircle, Info, X, Loader2, Check, ArrowRight } from "lucide-react";
import DOMPurify from 'isomorphic-dompurify';

// Validation schema using yup
const schema = yup.object({
  full_name: yup
    .string()
    .trim()
    .matches(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain alphabets, spaces, hyphens, and apostrophes."
    )
    .required("Full name is required")
    .min(3, "Name must be at least 3 characters"),
  email: yup
    .string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  country: yup
    .string()
    .nullable()
    .required("Please select your country"),
  phone_number: yup
    .string()
    .required("Phone number is required")
    .matches(/^\d+$/, "Phone number can only contain digits")
    .test("is-valid-phone", "Phone number must be 10 digits", function (value) {
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

      // Validate full phone number with country code
      const selectedCountry = countriesData.find((c) => c.name === country);
      if (!selectedCountry) return false;

      const phoneWithCountryCode = selectedCountry.dial_code + cleanNumber;
      const phoneRegex = /^\+[1-9]\d{1,14}$/;

      return phoneRegex.test(phoneWithCountryCode);
    }),
  course_category: yup.string().required("Please select a course category"),
  course_type: yup.string().required("Please select a course type"),
  message: yup
    .string()
    .trim()
    .required("Please tell us about your learning goals")
    .min(10, "Message must be at least 10 characters"),
  accept: yup
    .boolean()
    .oneOf([true], "You must accept the terms and privacy policy")
    .required(),
});

/**
 * Modern input field component with icon, validation, and animations
 */
const InputField = ({ 
  register, 
  name, 
  placeholder, 
  type = "text", 
  errors, 
  icon: Icon, 
  value,
  onChange,
  className = "",
  disabled = false,
  prefix = null
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
      <Icon className={`${errors[name] ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`} size={18} />
    </div>
    
    {prefix && (
      <span className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 text-sm">
        {prefix}
      </span>
    )}
    
    <input
      {...(register ? register(name) : { name })}
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      aria-label={placeholder}
      className={`w-full ${prefix ? 'pl-20' : 'pl-12'} pr-4 py-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-2 ${
        errors[name] 
          ? 'border-red-500 focus:ring-red-500 dark:border-red-500' 
          : 'border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 focus:ring-primary-500 focus:border-primary-500'
      } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 shadow-sm hover:bg-white dark:hover:bg-gray-700/70 ${className}`}
    />
    
    {errors[name] && (
      <motion.span
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-500 text-sm mt-1.5 flex items-center gap-1.5 pl-1"
        role="alert"
      >
        <Info size={14} /> {errors[name].message}
      </motion.span>
    )}
  </div>
);

InputField.propTypes = {
  register: PropTypes.func,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string,
  errors: PropTypes.object.isRequired,
  icon: PropTypes.elementType.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  prefix: PropTypes.node
};

/**
 * Select field component with icon, validation, and animations
 */
const SelectField = ({ 
  register, 
  name, 
  placeholder, 
  options, 
  errors, 
  icon: Icon, 
  value,
  onChange,
  className = "",
  disabled = false
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
      <Icon className={`${errors[name] ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`} size={18} />
    </div>
    
    <select
      {...(register ? register(name) : { name })}
      value={value}
      onChange={onChange}
      disabled={disabled}
      aria-label={placeholder}
      className={`w-full pl-12 pr-10 py-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-2 ${
        errors[name] 
          ? 'border-red-500 focus:ring-red-500 dark:border-red-500' 
          : 'border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 focus:ring-primary-500 focus:border-primary-500'
      } text-gray-900 dark:text-white focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 shadow-sm appearance-none cursor-pointer hover:bg-white dark:hover:bg-gray-700/70 ${className}`}
      aria-invalid={errors[name] ? "true" : "false"}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    
    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <ArrowRight className="transform rotate-90 text-gray-400" size={16} />
    </div>
    
    {errors[name] && (
      <motion.span
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-500 text-sm mt-1.5 flex items-center gap-1.5 pl-1"
        role="alert"
      >
        <Info size={14} /> {errors[name].message}
      </motion.span>
    )}
  </div>
);

SelectField.propTypes = {
  register: PropTypes.func,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  errors: PropTypes.object.isRequired,
  icon: PropTypes.elementType.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool
};

/**
 * ExploreJourney Component - Course enrollment form with animations and theme support
 */
const ExploreJourney = ({ 
  mainText = "Start Your Learning Journey Today", 
  subText = "Enroll Now!", 
  courseType = 'default',
  theme = {
    accentColor: '#7ECA9D',
    hoverAccentColor: '#5fb786',
    ctaGradientColors: ['green-500/10', 'emerald-500/10', 'teal-500/10'],
    springAnimation: {
      type: "spring",
      stiffness: 400,
      damping: 20
    }
  }
}) => {
  const { postQuery, loading } = usePostQuery();
  const [showModal, setShowModal] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [recaptchaError, setRecaptchaError] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
    reset,
    watch,
    setValue,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      country: 'India', // Set default country
    }
  });

  // Watch all form values to calculate progress
  const formValues = watch();

  // Initialize form visibility with animation
  useEffect(() => {
    const timer = setTimeout(() => setFormVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Calculate form progress based on filled fields
  useEffect(() => {
    const totalFields = 7; // Total number of required fields
    const filledFields = Object.keys(dirtyFields).length;
    setFormProgress(Math.min(100, Math.round((filledFields / totalFields) * 100)));
  }, [dirtyFields]);

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
    setRecaptchaError(false);
  };

  // Handle country change
  const handleCountryChange = async (e) => {
    const country = e.target.value;
    setValue('country', country, { shouldValidate: true });
    // Trigger phone validation when country changes
    if (formValues.phone_number) {
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

  // Sanitize form data
  const sanitizeData = (data) => {
    return {
      ...data,
      full_name: DOMPurify.sanitize(data.full_name),
      email: DOMPurify.sanitize(data.email),
      message: DOMPurify.sanitize(data.message),
    };
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    if (!recaptchaValue) {
      setRecaptchaError(true);
      setIsSubmitting(false);
      return;
    }
    try {
      const sanitizedData = sanitizeData(data);
      const selectedCountry = countriesData.find(
        (country) => country.name === sanitizedData.country
      );
      
      await postQuery({
        url: apiUrls?.enrollWebsiteform?.createEnrollWebsiteForm,
        postData: {
          full_name: sanitizedData.full_name,
          country: sanitizedData.country,
          email: sanitizedData.email,
          phone_number: selectedCountry.dial_code + sanitizedData.phone_number,
          course_category: sanitizedData.course_category,
          course_type: sanitizedData.course_type,
          message: sanitizedData.message,
          accept: sanitizedData.accept,
        },
        onSuccess: () => {
          setShowModal(true);
          setRecaptchaError(false);
          setRecaptchaValue(null);
          setFormProgress(0);
          setIsSubmitting(false);

          // Reset the form fields after a successful submission
          reset();
        },
        onFail: (error) => {
          showToast.error(error?.message || "Error submitting form. Please try again.");
          setIsSubmitting(false);
        },
      });
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      showToast.error("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Preloader />;
  }

  // Animation variants for form elements
  const formAnimations = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: theme.springAnimation
    }
  };

  // For AI & Data Science course
  if (courseType === 'ai-data-science') {
    theme.accentColor = "primary-500";
    theme.hoverAccentColor = "primary-600";
    theme.ctaGradientColors = ["blue-500/10", "indigo-500/10", "purple-500/10"];
  }

  // For Digital Marketing course
  if (courseType === 'digital-marketing') {
    theme.accentColor = "cyan-500";
    theme.hoverAccentColor = "cyan-600";
    theme.ctaGradientColors = ["cyan-500/10", "blue-500/10", "purple-500/10"];
  }

  // Course category options
  const courseCategories = [
    { value: "AI & Data Science", label: "AI & Data Science" },
    { value: "Personality Development", label: "Personality Development" },
    { value: "Vedic Mathematics", label: "Vedic Mathematics" },
    { value: "Digital Marketing & Data Analytics", label: "Digital Marketing & Data Analytics" }
  ];

  // Course type options
  const courseTypes = [
    { value: "option1", label: "Foundation Certificate" },
    { value: "option2", label: "Advanced Certificate" },
    { value: "option3", label: "Executive Certificate" }
  ];

  return (
    <>
      <section
        id="enroll-section"
        className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 py-12"
      >
        <div className="container mx-auto px-4 relative">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <Image
              className="absolute top-40 left-0 lg:left-[8%] 2xl:top-20 z-0 opacity-30"
              src={registrationImage1}
              alt="Decorative background element"
              priority
            />
            <Image
              className="absolute top-1/2 left-3/4 md:left-2/3 lg:left-1/2 2xl:left-[8%] md:top z-0 opacity-30"
              src={registrationImage2}
              alt="Decorative background element"
              priority
            />
            <Image
              className="absolute top-20 lg:top-3/4 md:top-14 right-20 md:right-20 lg:right-[90%] z-0 opacity-30"
              src={registrationImage3}
              alt="Decorative background element"
              priority
            />
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-400/10 dark:bg-primary-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/5 w-96 h-96 bg-secondary-400/10 dark:bg-secondary-600/10 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left side - Feature Section */}
              <motion.div
                className="relative z-10"
                variants={formAnimations}
                initial="hidden"
                animate="visible"
              >
                <span className="inline-block px-4 py-1.5 mb-6 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full">
                  Start your career transformation
                </span>
                
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  {mainText}
                </h2>
                
                <ul className="space-y-4 mb-8">
                  {[
                    "Expert-led curriculum designed for industry relevance",
                    "Flexible learning options to fit your schedule",
                    "Personalized feedback and career guidance",
                    "Industry-recognized certification upon completion"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start text-gray-700 dark:text-gray-300">
                      <CheckCircle className="mt-0.5 mr-3 flex-shrink-0 text-primary-600 dark:text-primary-400" size={18} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-wrap gap-4 mt-8">
                  <Link href="/courses" className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl hover:bg-primary-700 transform hover:-translate-y-1">
                    Explore Courses
                    <ArrowRight size={18} className="ml-2" />
                  </Link>
                  <Link href="/about-us" className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                    <Info size={18} className="mr-2" />
                    Learn More
                  </Link>
                </div>
              </motion.div>
              
              {/* Right side - Form Section */}
              <motion.div 
                variants={formAnimations}
                initial="hidden"
                animate="visible"
                className={`relative z-10 bg-white dark:bg-gray-800 rounded-2xl shadow-xl transition-all duration-700 transform ${formVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
              >
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-6 px-8 rounded-t-2xl">
                  <h3 className="text-2xl font-bold">
                    {subText}
                  </h3>
                  <p className="text-primary-100 mt-1 text-sm">
                    Complete the form below to get started on your learning journey
                  </p>
                </div>
                
                {/* Form Progress Bar */}
                <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${formProgress}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-primary-500"
                  />
                </div>
                
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="p-8 relative"
                  noValidate
                >
                  {/* Form Progress Indicator */}
                  <div className="absolute right-8 top-4 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium px-2.5 py-1.5 rounded-full flex items-center">
                    <span className="block h-2 w-2 rounded-full bg-primary-500 dark:bg-primary-400 mr-1.5"></span>
                    {formProgress}% Complete
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                    <InputField 
                      register={register}
                      name="full_name"
                      placeholder="Your Full Name"
                      errors={errors}
                      icon={User}
                    />
                    
                    <InputField 
                      register={register}
                      name="email"
                      placeholder="Your Email Address"
                      type="email"
                      errors={errors}
                      icon={Mail}
                    />
                  </div>

                  {/* Country and Phone Number */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <SelectField
                      name="country"
                      placeholder="Select Your Country"
                      options={countriesData.map(country => ({ 
                        value: country.name, 
                        label: country.name 
                      }))}
                      value={formValues.country || ''}
                      onChange={handleCountryChange}
                      errors={errors}
                      icon={Globe}
                    />

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <Phone className={`${errors.phone_number ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`} size={18} />
                      </div>
                      
                      <input
                        id="phone_number"
                        type="tel"
                        inputMode="numeric"
                        onChange={handlePhoneInput}
                        value={formValues.phone_number || ''}
                        placeholder="10-digit Phone Number"
                        className={`w-full pl-20 pr-4 py-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-2 ${
                          errors.phone_number 
                            ? 'border-red-500 focus:ring-red-500 dark:border-red-500' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 focus:ring-primary-500 focus:border-primary-500'
                        } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 shadow-sm hover:bg-white dark:hover:bg-gray-700/70`}
                      />
                      
                      {formValues.country && (
                        <span className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 text-sm">
                          {countriesData.find(c => c.name === formValues.country)?.dial_code}
                        </span>
                      )}
                      
                      {errors.phone_number && (
                        <motion.span
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1.5 flex items-center gap-1.5 pl-1"
                          role="alert"
                        >
                          <Info size={14} /> {errors.phone_number.message}
                        </motion.span>
                      )}
                    </div>
                  </div>
                  
                  {/* Course Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <SelectField
                      register={register}
                      name="course_category"
                      placeholder="Select Course Category"
                      options={courseCategories}
                      errors={errors}
                      icon={Globe}
                    />
                    
                    <SelectField
                      register={register}
                      name="course_type"
                      placeholder="Select Course Type"
                      options={courseTypes}
                      errors={errors}
                      icon={Globe}
                    />
                  </div>
                  
                  {/* Message Field */}
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute top-4 left-4 pointer-events-none">
                        <MessageSquare className={`${errors.message ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`} size={18} />
                      </div>
                      <textarea
                        {...register("message")}
                        id="message"
                        placeholder="Tell us about your learning goals and expectations..."
                        className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-2 ${
                          errors.message 
                            ? 'border-red-500 focus:ring-red-500 dark:border-red-500' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 focus:ring-primary-500 focus:border-primary-500'
                        } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 shadow-sm h-32 resize-none hover:bg-white dark:hover:bg-gray-700/70`}
                      />
                      
                      {/* Character Counter */}
                      <div className="text-xs text-gray-400 absolute right-3 bottom-3">
                        {(formValues.message?.length || 0)}/10+ characters
                      </div>
                    </div>
                    
                    {errors.message && (
                      <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1.5 flex items-center gap-1.5 pl-1"
                        role="alert"
                      >
                        <Info size={14} /> {errors.message.message}
                      </motion.span>
                    )}
                  </div>

                  {/* ReCAPTCHA */}
                  <div className="flex justify-center mt-6">
                    <ReCAPTCHA
                      sitekey="6LdHwxUqAAAAANjZ5-6I5-UYrL8owEGEi_QyJBX9"
                      onChange={handleRecaptchaChange}
                    />
                  </div>
                  
                  {recaptchaError && (
                    <motion.span 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1.5 flex items-center justify-center gap-1.5"
                      role="alert"
                    >
                      <Info size={14} /> Please complete the ReCAPTCHA verification
                    </motion.span>
                  )}

                  {/* Terms Checkbox */}
                  <div className="flex items-start mt-6">
                    <div className="flex items-center h-5">
                      <input
                        {...register("accept")}
                        type="checkbox"
                        id="accept"
                        className="h-5 w-5 text-primary-600 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors cursor-pointer hover:border-primary-400 dark:hover:border-primary-500"
                      />
                    </div>
                    <label
                      htmlFor="accept"
                      className="ml-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
                    >
                      I agree to the 
                      <Link href="/terms-and-services">
                        <span className="text-primary-600 dark:text-primary-400 hover:underline ml-1 font-medium">
                          Terms of Service
                        </span>
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy-policy">
                        <span className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                          Privacy Policy
                        </span>
                      </Link>
                    </label>
                  </div>
                  
                  {errors.accept && (
                    <div className="ml-8">
                      <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm flex items-center"
                        role="alert"
                      >
                        <Info size={14} className="mr-1.5 flex-shrink-0" /> 
                        {errors.accept.message}
                      </motion.span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="mt-8">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/20 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={20} className="mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Success Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-modal-title"
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={theme.springAnimation}
              className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 relative"
            >
              {/* Close Icon */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full p-1"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              {/* Modal Content */}
              <div className="text-center py-6">
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                  <CheckCircle className="text-primary-600 dark:text-primary-400" size={40} />
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3" id="success-modal-title">
                  Application Submitted!
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Thank you for your interest! We'll review your application and get back to you soon with the next steps.
                </p>
                
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setShowModal(false)}
                    className="py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-primary-500/20"
                  >
                    Close
                  </button>
                  <Link href="/courses">
                    <button className="py-3 px-6 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                      Explore Courses
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

ExploreJourney.propTypes = {
  mainText: PropTypes.string,
  subText: PropTypes.string,
  courseType: PropTypes.oneOf(['default', 'ai-data-science', 'digital-marketing', 'vedic-mathematics', 'personality-development']),
  theme: PropTypes.shape({
    accentColor: PropTypes.string,
    hoverAccentColor: PropTypes.string,
    ctaGradientColors: PropTypes.arrayOf(PropTypes.string),
    springAnimation: PropTypes.object
  })
};

export default ExploreJourney;
