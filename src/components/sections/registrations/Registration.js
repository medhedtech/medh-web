"use client";
import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FileText, CheckCircle, X, ArrowRight, Info, Loader2, Phone, Mail, User, Upload, Globe, MessageSquare } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import countriesData from "@/utils/countrycode.json";
import { useTheme } from "next-themes";
import DOMPurify from 'isomorphic-dompurify';
import { debounce } from 'lodash';

// Validation schema using yup
const schema = yup.object({
  full_name: yup
    .string()
    .trim()
    .matches(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain alphabets, spaces, hyphens, and apostrophes."
    )
    .required("Name is required."),
  email: yup
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .required("Email is required."),
  country: yup
    .string()
    .required("Please select your country."),
  phone_number: yup
    .string()
    .required("Please enter your mobile number")
    .matches(/^\d+$/, "Phone number can only contain digits")
    .test("is-valid-phone", "Invalid phone number.", function (value) {
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
  message: yup
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .required("Please enter the message"),
  accept: yup
    .boolean()
    .oneOf([true], "You must accept the terms and privacy policy")
    .required(),
  resume_image: yup.string(),
});

const Registration = ({ showUploadField = false, pageTitle }) => {
  const { postQuery, loading } = usePostQuery();
  const [fileName, setFileName] = useState("No file chosen");
  const [pdfBrochure, setPdfBrochure] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [recaptchaError, setRecaptchaError] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDarkMode = theme === "dark";

  // Debounced file upload handler
  const debouncedUpload = useCallback(
    debounce(async (file) => {
      if (!file) return;
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File size should be less than 5MB");
        setFileName("No file chosen");
        return;
      }

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
              toast.success("File uploaded successfully!");
              setPdfBrochure(data?.data);
            },
            onError: (error) => {
              toast.error(error?.message || "Error uploading file");
              setFileName("No file chosen");
            },
          });
        };
      } catch (error) {
        toast.error("Error processing file");
        setFileName("No file chosen");
      }
    }, 500),
    [postQuery]
  );

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setFormVisible(true), 300);
    
    // Cleanup function
    return () => {
      clearTimeout(timer);
      debouncedUpload.cancel();
    };
  }, [debouncedUpload]);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
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
      showUploadField,
    },
    mode: 'onChange',
  });

  // Watch form values for validation
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

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      debouncedUpload(file);
    } else {
      setFileName("No file chosen");
    }
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
    if (!recaptchaValue) {
      setRecaptchaError(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const sanitizedData = sanitizeData(data);
      const selectedCountry = countriesData.find(
        (country) => country.name === sanitizedData.country
      );

      const postData = {
        full_name: sanitizedData.full_name,
        country: sanitizedData.country,
        email: sanitizedData.email,
        phone_number: selectedCountry.dial_code + sanitizedData.phone_number,
        message: sanitizedData.message,
        accept: sanitizedData.accept,
        page_title: pageTitle,
        ...(pdfBrochure && { resume_image: pdfBrochure }),
      };

      await postQuery({
        url: apiUrls?.Contacts?.createContact,
        postData,
        onSuccess: () => {
          setShowModal(true);
          setRecaptchaError(false);
          setRecaptchaValue(null);
          setPdfBrochure(null);
          setFileName("No file chosen");
          reset();
          toast.success("Form submitted successfully!");
        },
        onError: (error) => {
          toast.error(error?.message || "Error submitting form");
        },
      });
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If not mounted yet, prevent theme-specific UI flash
  if (!mounted) {
    return (
      <section className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12 h-full">
          <div className="flex justify-center items-center">
            <div className="w-full max-w-6xl bg-gray-200 dark:bg-gray-800 h-96 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 py-12 relative">
          {/* Floating background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-400/10 dark:bg-primary-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/5 w-96 h-96 bg-secondary-400/10 dark:bg-secondary-600/10 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden backdrop-blur-sm transition-all relative z-10">
            <div className="grid md:grid-cols-2 h-full">
              {/* Left side - Feature Section */}
              <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 p-8 lg:p-12 flex flex-col justify-center">
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
                </div>
                
                <div className="relative z-10">
                  <span className="inline-block px-4 py-1.5 mb-6 bg-white/20 text-white text-sm font-medium rounded-full">
                    Welcome to our community
                  </span>
                  
                  <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                    Transform your career with our expert-led courses
                  </h2>
                  
                  <ul className="space-y-4 mb-8">
                    {[
                      "Industry-recognized certifications",
                      "Expert instructors with real-world experience",
                      "Flexible learning schedules",
                      "Job placement assistance"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start text-white">
                        <CheckCircle className="mt-0.5 mr-3 flex-shrink-0 text-white" size={18} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex flex-wrap gap-4 mt-8">
                    <Link href="/courses" className="inline-flex items-center px-6 py-3 bg-white text-primary-700 font-medium rounded-lg transition-all shadow-lg hover:shadow-xl hover:bg-gray-50 transform hover:-translate-y-1">
                      Explore Courses
                      <ArrowRight size={18} className="ml-2" />
                    </Link>
                    <Link href="/about-us" className="inline-flex items-center px-6 py-3 bg-primary-700/30 hover:bg-primary-700/50 text-white font-medium rounded-lg transition-all backdrop-blur-sm">
                      <Info size={18} className="mr-2" />
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Right side - Form Section */}
              <div className={`bg-white dark:bg-gray-800 p-8 lg:p-12 transition-all duration-700 transform ${formVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div className="mb-10">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    Get in Touch
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Fill out the form below and our team will get back to you shortly.
                  </p>
                </div>
                
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-7"
                  data-aos="fade-up"
                  aria-label="Contact form"
                  noValidate
                >
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <User className={`${errors.full_name ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`} size={18} />
                      </div>
                      <input
                        {...register("full_name")}
                        id="full_name"
                        type="text"
                        placeholder="Your Full Name"
                        className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-2 ${
                          errors.full_name 
                            ? 'border-red-500 focus:ring-red-500 dark:border-red-500' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 focus:ring-primary-500 focus:border-primary-500'
                        } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 shadow-sm hover:bg-white dark:hover:bg-gray-700/70`}
                      />
                    </div>
                    {errors.full_name && (
                      <span className="text-red-500 text-sm mt-1.5 flex items-center pl-1" role="alert">
                        <Info size={14} className="mr-1.5" />
                        {errors.full_name.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <Mail className={`${errors.email ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`} size={18} />
                      </div>
                      <input
                        {...register("email")}
                        id="email"
                        type="email"
                        placeholder="Email Address"
                        className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-2 ${
                          errors.email 
                            ? 'border-red-500 focus:ring-red-500 dark:border-red-500' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 focus:ring-primary-500 focus:border-primary-500'
                        } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 shadow-sm hover:bg-white dark:hover:bg-gray-700/70`}
                      />
                    </div>
                    {errors.email && (
                      <span className="text-red-500 text-sm mt-1.5 flex items-center pl-1" role="alert">
                        <Info size={14} className="mr-1.5" />
                        {errors.email.message}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                    <div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                          <Globe className={`${errors.country ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`} size={18} />
                        </div>
                        <select
                          id="country"
                          onChange={handleCountryChange}
                          value={watchedFields.country}
                          className={`w-full pl-12 pr-10 py-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-2 ${
                            errors.country 
                              ? 'border-red-500 focus:ring-red-500 dark:border-red-500' 
                              : 'border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 focus:ring-primary-500 focus:border-primary-500'
                          } text-gray-900 dark:text-white focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 shadow-sm appearance-none cursor-pointer hover:bg-white dark:hover:bg-gray-700/70`}
                          aria-invalid={errors.country ? "true" : "false"}
                        >
                          <option value="">Select Your Country</option>
                          {countriesData.map((country) => (
                            <option key={country.code} value={country.name}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <ArrowRight className="transform rotate-90 text-gray-400" size={16} />
                        </div>
                      </div>
                      {errors.country && (
                        <span className="text-red-500 text-sm mt-1.5 flex items-center pl-1" role="alert">
                          <Info size={14} className="mr-1.5" />
                          {errors.country.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                          <Phone className={`${errors.phone_number ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`} size={18} />
                        </div>
                        <input
                          id="phone_number"
                          type="tel"
                          inputMode="numeric"
                          onChange={handlePhoneInput}
                          value={watchedFields.phone_number}
                          placeholder="10-digit phone number"
                          className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-2 ${
                            errors.phone_number 
                              ? 'border-red-500 focus:ring-red-500 dark:border-red-500' 
                              : 'border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 focus:ring-primary-500 focus:border-primary-500'
                          } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 shadow-sm hover:bg-white dark:hover:bg-gray-700/70`}
                        />
                        {watchedFields.country && (
                          <span className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 text-sm">
                            {countriesData.find(c => c.name === watchedFields.country)?.dial_code}
                          </span>
                        )}
                      </div>
                      {errors.phone_number && (
                        <span className="text-red-500 text-sm mt-1.5 flex items-center pl-1" role="alert">
                          <Info size={14} className="mr-1.5" />
                          {errors.phone_number.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="relative">
                      <div className="absolute top-4 left-4 pointer-events-none">
                        <MessageSquare className={`${errors.message ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`} size={18} />
                      </div>
                      <textarea
                        {...register("message")}
                        id="message"
                        placeholder="How can we help you? Tell us about your requirements..."
                        className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-2 ${
                          errors.message 
                            ? 'border-red-500 focus:ring-red-500 dark:border-red-500' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 focus:ring-primary-500 focus:border-primary-500'
                        } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 shadow-sm h-32 resize-none hover:bg-white dark:hover:bg-gray-700/70`}
                      />
                    </div>
                    {errors.message && (
                      <span className="text-red-500 text-sm mt-1.5 flex items-center pl-1" role="alert">
                        <Info size={14} className="mr-1.5" />
                        {errors.message.message}
                      </span>
                    )}
                  </div>

                  {showUploadField && (
                    <div className="p-6 bg-gray-50 dark:bg-gray-700/30 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 transition-all duration-200 hover:border-primary-400 dark:hover:border-primary-500 group">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                          <Upload className="text-primary-600 dark:text-primary-400" size={24} />
                        </div>
                        <div className="text-center">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {fileName === "No file chosen" ? "Upload your document" : fileName}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            PDF files only (max 5MB)
                          </p>
                        </div>
                        <label
                          htmlFor="fileInput"
                          className="cursor-pointer py-2 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-primary-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                        >
                          Select File
                        </label>
                        <input
                          {...register("resume_image")}
                          id="fileInput"
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={handlePdfUpload}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center mt-8">
                    <ReCAPTCHA
                      sitekey="6LdHwxUqAAAAANjZ5-6I5-UYrL8owEGEi_QyJBX9"
                      onChange={handleRecaptchaChange}
                      theme={isDarkMode ? "dark" : "light"}
                      key={isDarkMode ? "dark" : "light"}
                    />
                  </div>
                  
                  {recaptchaError && (
                    <div className="text-center -mt-4">
                      <span className="text-red-500 text-sm flex items-center justify-center">
                        <Info size={14} className="mr-1.5" />
                        Please complete the ReCAPTCHA verification.
                      </span>
                    </div>
                  )}

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
                      <span className="text-red-500 text-sm flex items-center">
                        <Info size={14} className="mr-1.5 flex-shrink-0" />
                        {errors.accept.message}
                      </span>
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/20 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
                      disabled={loading || isSubmitting || (!isDirty || !isValid)}
                      aria-busy={loading || isSubmitting}
                    >
                      {(loading || isSubmitting) ? (
                        <>
                          <Loader2 size={20} className="mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Submit Request"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Success Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity animation-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-modal-title"
        >
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 relative transform transition-all animation-scale-in">
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
                Request Submitted!
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Thank you for reaching out to us. Our team will review your request and contact you shortly.
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
          </div>
        </div>
      )}
    </>
  );
};

export default Registration;