"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import registrationImage1 from "@/assets/images/register/register__1.png";
import registrationImage2 from "@/assets/images/register/register__2.png";
import registrationImage3 from "@/assets/images/register/register__3.png";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import Preloader from "@/components/shared/others/Preloader";
import { FaTimes, FaCheck, FaExclamationTriangle } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import countriesData from "@/utils/countrycode.json";
import { motion, AnimatePresence } from "framer-motion";

// Validation schema using yup
const schema = yup.object({
  full_name: yup
    .string()
    .required("Name is required.")
    .min(3, "Name must be at least 3 characters long."),
  email: yup
    .string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address."
    )
    .required("Email is required."),
  country: yup.string().nullable().required("Please select a country."),
  phone_number: yup
    .string()
    .required("Please enter your mobile number")
    .test("is-valid-phone", "Invalid phone number.", function (value) {
      const { country } = this.parent;

      if (!value || !country) return false;

      // Ensure the phone number has exactly 10 digits
      const isValidLength = /^\d{10}$/.test(value);
      if (!isValidLength) return false;

      // Validate full phone number with country code
      const selectedCountry = countriesData.find((c) => c.name === country);
      if (!selectedCountry) return false;

      const phoneWithCountryCode = selectedCountry.dial_code + value;
      const phoneRegex = /^\+[1-9]\d{1,14}$/;

      return phoneRegex.test(phoneWithCountryCode);
    }),
  course_category: yup.string().required("Please select category."),
  course_type: yup.string().required("Please select course type."),
  message: yup
    .string()
    .required("Please enter the message.")
    .min(10, "Message must be at least 10 characters long."),
  accept: yup
    .boolean()
    .oneOf([true], "You must accept the terms and privacy policy.")
    .required("You must accept the terms and privacy policy."),
});

/**
 * Reusable input field component with error handling and animations
 * @param {Object} props - Component props
 * @param {Function} props.register - React Hook Form register function
 * @param {string} props.name - Field name
 * @param {string} props.placeholder - Input placeholder
 * @param {string} props.type - Input type
 * @param {Object} props.errors - Form errors object
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.accentColor - Theme accent color
 * @returns {JSX.Element}
 */
const InputField = ({ register, name, placeholder, type = "text", errors, className = "", accentColor = "#7ECA9D" }) => (
  <div className="flex-col w-full relative">
    <input
      {...register(name)}
      type={type}
      placeholder={placeholder}
      aria-label={placeholder}
      className={`w-full px-4 py-3 transition-all duration-300 dark:bg-inherit bg-lightGrey8 text-base border ${
        errors[name] ? "border-red-400 focus:border-red-500" : `border-gray-300 focus:border-[${accentColor}]`
      } rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-20 ${className}`}
      style={{ '--tw-ring-color': accentColor }}
    />
    {errors[name] && (
      <motion.span
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-500 text-[12px] mt-1 flex items-center gap-1 absolute -bottom-5 left-0"
      >
        <FaExclamationTriangle size={12} /> {errors[name].message}
      </motion.span>
    )}
  </div>
);

InputField.propTypes = {
  register: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string,
  errors: PropTypes.object.isRequired,
  className: PropTypes.string,
  accentColor: PropTypes.string
};

/**
 * ExploreJourney Component - Course enrollment form with animations and theme support
 * @param {Object} props - Component props
 * @param {string} props.mainText - Main heading text
 * @param {string} props.subText - Form heading text
 * @param {string} props.courseType - Type of course (e.g., 'ai-data-science', 'digital-marketing')
 * @param {Object} props.theme - Theme configuration
 * @param {string} props.theme.accentColor - Primary theme color
 * @param {string} props.theme.hoverAccentColor - Hover state color
 * @param {Array} props.theme.ctaGradientColors - Gradient colors for CTA elements
 * @param {Object} props.theme.springAnimation - Custom spring animation config
 * @returns {JSX.Element}
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
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // Watch all form values to calculate progress
  const formValues = watch();

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

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    if (!recaptchaValue) {
      setRecaptchaError(true);
      setIsSubmitting(false);
      return;
    }
    try {
      const selectedCountry = countriesData.find(
        (country) => country.name === data.country
      );
      await postQuery({
        url: apiUrls?.enrollWebsiteform?.createEnrollWebsiteForm,
        postData: {
          full_name: data?.full_name,
          country: data?.country,
          email: data?.email,
          phone_number: selectedCountry.dial_code + data?.phone_number,
          course_category: data?.course_category,
          course_type: data?.course_type,
          message: data?.message,
          accept: data?.accept,
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
        onFail: () => {
          toast.error("Error submitting form. Please try again.");
          setIsSubmitting(false);
        },
      });
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again.");
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

  // Custom styles based on theme
  const themeStyles = {
    primary: theme.accentColor,
    hover: theme.hoverAccentColor,
    gradientFrom: `from-${theme.ctaGradientColors[0]}`,
    gradientVia: `via-${theme.ctaGradientColors[1]}`,
    gradientTo: `to-${theme.ctaGradientColors[2]}`,
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

  return (
    <>
      <section
        id="enroll-section"
        className="bg-register bg-cover bg-center bg-no-repeat mt-8 sm:mt-0"
      >
        <div className="bg-gray-600 bg-opacity-70 py-4 lg:pb-0 relative z-10">
          <div>
            <Image
              className="absolute top-40 left-0 lg:left-[8%] 2xl:top-20 animate-move-hor block z--1"
              src={registrationImage1}
              alt="Decorative background element"
              priority
            />
            <Image
              className="absolute top-1/2 left-3/4 md:left-2/3 lg:left-1/2 2xl:left-[8%] md:top animate-spin-slow block z--1"
              src={registrationImage2}
              alt="Decorative background element"
              priority
            />
            <Image
              className="absolute top-20 lg:top-3/4 md:top-14 right-20 md:right-20 lg:right-[90%] animate-move-var block z--1"
              src={registrationImage3}
              alt="Decorative background element"
              priority
            />
          </div>
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-14 gap-x-30px justify-items-center">
              <motion.div
                className="mb-30px lg:mb-0 pb-0 md:pb-30px xl:pb-0 lg:col-start-1 lg:col-span-7"
                variants={formAnimations}
                initial="hidden"
                animate="visible"
                data-aos="fade-up"
              >
                <div className="relative lg:my-36">
                  <motion.h3 
                    className="text-4xl md:text-[35px] 2xl:text-size-42 leading-[45px] 2xl:leading-2xl font-bold text-whiteColor pb-25px font-Poppins"
                    style={{ 
                      background: `linear-gradient(to right, ${themeStyles.primary}, ${themeStyles.hover})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {mainText}
                  </motion.h3>
                </div>
              </motion.div>
              {/* Form Section */}
              <motion.div 
                variants={formAnimations}
                initial="hidden"
                animate="visible"
                className="overflow-hidden w-[100%] sm:w-[600px] lg:col-start-8 lg:col-span-5 relative z-20 mb-4 rounded-lg shadow-xl bg-white dark:bg-gray-800"
                style={{ 
                  '--form-accent-color': themeStyles.primary,
                  '--form-hover-color': themeStyles.hover
                }}
              >
                <h3 
                  className="text-3xl text-[#FFFFFF] dark:text-blackColor-dark py-6 text-center font-semibold font-inter rounded-t-lg"
                  style={{ backgroundColor: themeStyles.primary }}
                >
                  {subText}
                </h3>
                
                {/* Form Progress Bar */}
                <div className="h-1 w-full bg-gray-200">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${formProgress}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full"
                    style={{ backgroundColor: themeStyles.primary }}
                  />
                </div>
                
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="sm:p-[35px] p-[24px] bg-white dark:bg-gray-800 shadow-experience rounded-b-lg relative"
                  data-aos="fade-up"
                >
                  {/* Form Progress Indicator */}
                  <div className="absolute right-5 top-4 bg-[#7ECA9D] text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {formProgress}% Complete
                  </div>
                  
                  <div className="flex gap-6 flex-col md:flex-row mt-8 mb-8">
                    <InputField 
                      register={register}
                      name="full_name"
                      placeholder="Your Name*"
                      errors={errors}
                    />
                    
                    <InputField 
                      register={register}
                      name="email"
                      placeholder="Your Email*"
                      type="email"
                      errors={errors}
                    />
                  </div>

                  {/* Phone Number Input with Country Dropdown */}
                  <div className="flex flex-col lg:flex-row mb-8 gap-4">
                    <div className="w-full lg:w-2/4 relative">
                      <select
                        {...register("country")}
                        className={`w-full text-sm px-4 py-3 dark:bg-inherit bg-lightGrey8 border ${
                          errors.country ? "border-red-400" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-[#7ECA9D] focus:ring-opacity-20 text-[#5C6574] appearance-none`}
                        aria-label="Select your country"
                      >
                        <option value="">Select Country</option>
                        {countriesData.map((country) => {
                          const countryName =
                            country.name.length > 20
                              ? country.name.slice(0, 20) + "..."
                              : country.name;
                          return (
                            <option key={country.code} value={country.name}>
                              {countryName} ({country.dial_code})
                            </option>
                          );
                        })}
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                    </div>

                    <div className="w-full lg:w-2/4 relative">
                      <InputField 
                        register={register}
                        name="phone_number"
                        placeholder="Your Phone Number*"
                        type="tel"
                        errors={errors}
                      />
                    </div>
                  </div>
                  
                  {/* Error Message for Country/Phone */}
                  {(errors.country || errors.phone_number) && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-[12px] -mt-6 mb-4 flex items-center gap-1"
                    >
                      <FaExclamationTriangle size={12} />
                      {errors.country?.message || errors.phone_number?.message}
                    </motion.div>
                  )}

                  <div className="flex gap-6 flex-col lg:flex-row mb-8">
                    {/* First Select - Course Category */}
                    <div className="w-full relative">
                      <select
                        {...register("course_category")}
                        className={`w-full px-4 py-3 dark:bg-inherit bg-lightGrey8 text-base border ${
                          errors.course_category ? "border-red-400" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-[#7ECA9D] focus:ring-opacity-20 appearance-none`}
                        aria-label="Select course category"
                      >
                        <option value="">Select Category</option>
                        <option value="AI & Data Science">
                          AI & Data Science
                        </option>
                        <option value="Personality Development">
                          Personality Development
                        </option>
                        <option value="Vedic Mathematics">
                          Vedic Mathematics
                        </option>
                        <option value="Digital Marketing & Data Analytics">
                          Digital Marketing & Data Analytics
                        </option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                      {errors.course_category && (
                        <motion.span 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-[12px] mt-1 flex items-center gap-1 absolute -bottom-5 left-0"
                        >
                          <FaExclamationTriangle size={12} /> {errors.course_category.message}
                        </motion.span>
                      )}
                    </div>

                    {/* Second Select - Course Type */}
                    <div className="w-full relative">
                      <select
                        {...register("course_type")}
                        className={`w-full px-4 py-3 dark:bg-inherit bg-lightGrey8 text-base border ${
                          errors.course_type ? "border-red-400" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-[#7ECA9D] focus:ring-opacity-20 appearance-none`}
                        aria-label="Select course type"
                      >
                        <option value="">Select Type</option>
                        <option value="option1">Foundation Certificate</option>
                        <option value="option2">Advanced Certificate</option>
                        <option value="option3">Executive Certificate</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                      {errors.course_type && (
                        <motion.span 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-[12px] mt-1 flex items-center gap-1 absolute -bottom-5 left-0"
                        >
                          <FaExclamationTriangle size={12} /> {errors.course_type.message}
                        </motion.span>
                      )}
                    </div>
                  </div>
                  
                  <div className="w-full mb-8 relative">
                    <textarea
                      {...register("message")}
                      placeholder="Please tell us about your learning goals and expectations..."
                      className={`w-full px-4 py-3 dark:bg-inherit bg-lightGrey8 text-base rounded-md ${
                        errors.message ? "border-red-400" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-[#7ECA9D] focus:ring-opacity-20 focus:border-[#7ECA9D] resize-none transition-all duration-300`}
                      rows="5"
                      aria-label="Your message"
                    ></textarea>

                    {/* Character Counter */}
                    <div className="text-xs text-gray-400 absolute right-3 bottom-3">
                      {watch("message")?.length || 0}/10+ characters
                    </div>

                    {/* Error Message for Message */}
                    {errors.message && (
                      <motion.span 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-[12px] mt-1 flex items-center gap-1"
                      >
                        <FaExclamationTriangle size={12} /> {errors.message.message}
                      </motion.span>
                    )}
                  </div>

                  <div className="flex flex-col items-center justify-center mb-4">
                    <ReCAPTCHA
                      sitekey="6LdHwxUqAAAAANjZ5-6I5-UYrL8owEGEi_QyJBX9"
                      onChange={handleRecaptchaChange}
                    />
                    {/* ReCAPTCHA Error Message */}
                    {recaptchaError && (
                      <motion.span 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-[12px] mt-2 flex items-center gap-1"
                      >
                        <FaExclamationTriangle size={12} /> Please complete the ReCAPTCHA verification.
                      </motion.span>
                    )}
                  </div>

                  <div className="flex items-start mb-4 space-x-3">
                    <div className="relative flex items-start">
                      <input
                        {...register("accept")}
                        type="checkbox"
                        id="accept"
                        className="w-5 h-5 text-[#7ECA9D] border-gray-300 rounded mt-0.5 focus:ring-[#7ECA9D]"
                      />
                      <label
                        htmlFor="accept"
                        className="ml-2 text-[15px] text-gray-700 dark:text-gray-300"
                      >
                        By submitting this form, I accept
                        <a href="/terms-and-services" className="text-[#7ECA9D] hover:underline ml-1">
                          Terms of Service
                        </a>{" "}
                        &{" "}
                        <a href="/privacy-policy" className="text-[#7ECA9D] hover:underline">
                          Privacy Policy
                        </a>.
                      </label>
                    </div>
                  </div>
                  
                  {errors.accept && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-[12px] -mt-2 mb-4 flex items-center gap-1"
                    >
                      <FaExclamationTriangle size={12} /> {errors.accept.message}
                    </motion.div>
                  )}

                  <div className="py-4">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full bg-[#7ECA9D] rounded-md text-white px-6 py-3.5 transition-all duration-300 ease-in-out hover:bg-[#5fb786] hover:shadow-lg font-medium text-base flex items-center justify-center ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
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
      
      {/* Success Modal with theme styles */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={theme.springAnimation}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 p-6 relative"
            >
              {/* Close Icon */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                aria-label="Close modal"
              >
                <FaTimes size={20} />
              </button>

              {/* Modal Content */}
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <FaCheck className="h-8 w-8 text-green-500" />
                </div>
                <h2 className="text-lg md:text-[28px] font-semibold text-green-500 dark:text-green-400">
                  Application Submitted!
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  Thank you for your interest! We'll review your application and get back to you soon.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(false)}
                  className="mt-6 px-5 py-2.5 bg-[#7ECA9D] text-white rounded-md hover:bg-[#5fb786] transition-all duration-300 font-medium"
                  aria-label="Close success modal"
                >
                  Got it, thanks!
                </motion.button>
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
