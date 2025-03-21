"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import CustomReCaptcha from '../../shared/ReCaptcha';

// Icons
import { 
  FileText, 
  CheckCircle, 
  X, 
  ArrowRight, 
  Info, 
  Loader2 
} from "lucide-react";

// Images
import registrationImage1 from "@/assets/images/register/register__1.png";
import registrationImage2 from "@/assets/images/register/register__2.png";
import registrationImage3 from "@/assets/images/register/register__3.png";

// Hooks and Utilities
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import countriesData from "@/utils/countrycode.json";

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
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address."
    )
    .required("Email is required."),
  country: yup.string().nullable(),
  phone_number: yup
    .string()
    .required("Please enter your mobile number")
    .test("is-valid-phone", "Invalid phone number.", function (value) {
      const { country } = this.parent;

      if (!value || !country) return false;

      const isValidLength = /^\d{10}$/.test(value);
      if (!isValidLength) return false;

      const selectedCountry = countriesData.find((c) => c.name === country);
      if (!selectedCountry) return false;

      const phoneWithCountryCode = selectedCountry.dial_code + value;
      const phoneRegex = /^\+[1-9]\d{1,14}$/;

      return phoneRegex.test(phoneWithCountryCode);
    }),
  designation: yup.string().required("Designation is required"),
  company_name: yup.string().required("Company name is required"),
  company_website: yup
    .string()
    .matches(
      /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[a-zA-Z0-9-]*)*$/,
      "Invalid website URL"
    )
    .required("Website is required"),
  message: yup.string().required("Please enter the message"),
  accept: yup
    .boolean()
    .oneOf([true], "You must accept the terms and privacy policy")
    .required(),
});

const CorporateJourneyForm = ({ mainText, subText }) => {
  const router = useRouter();
  const { postQuery, loading } = usePostQuery();
  const [showModal, setShowModal] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [recaptchaError, setRecaptchaError] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const { theme, isDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setFormVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
    setRecaptchaError(false);
  };

  const onSubmit = async (data) => {
    if (!recaptchaValue) {
      setRecaptchaError(true);
      return;
    }
    try {
      const selectedCountry = countriesData.find(
        (country) => country.name === data.country
      );
      await postQuery({
        url: apiUrls?.CorporateTraining?.addCorporate,
        postData: {
          full_name: data?.full_name,
          country: data?.country,
          email: data?.email,
          phone_number: selectedCountry.dial_code + data?.phone_number,
          company_name: data?.company_name,
          designation: data?.designation,
          company_website: data?.company_website,
          message: data?.message,
          accept: data?.accept,
        },
        onSuccess: () => {
          setShowModal(true);
          setRecaptchaError(false);
          setRecaptchaValue(null);
          reset();
        },
        onFail: () => {
          toast.error("Error submitting form.");
        },
      });
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  // If not mounted yet, prevent theme-specific UI flash
  if (!mounted) {
    return (
      <section className="bg-register bg-cover bg-center bg-no-repeat">
        <div className="overlay bg-gradient-to-br from-gray-800 to-gray-900 py-8 lg:py-16 relative z-0 overflow-hidden">
          <div className="container mx-auto px-4 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-6 lg:pr-8">
                <div className="relative lg:my-12 h-40"></div>
              </div>
              <div className="lg:col-span-6 relative z-10">
                <div className="bg-gray-200 rounded-2xl h-96 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        id="enroll-section"
        className="bg-register bg-cover bg-center bg-no-repeat"
      >
        <div className="overlay bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-900 dark:to-gray-950 py-8 lg:py-16 relative z-0 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-pattern opacity-5"></div>
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-secondary-500/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/4"></div>
          
          <div>
            <Image
              className="absolute top-40 left-0 lg:left-[8%] 2xl:top-20 animate-move-hor block z-0 opacity-70"
              src={registrationImage1}
              alt="Decorative element"
            />
            <Image
              className="absolute top-1/2 left-3/4 md:left-2/3 lg:left-1/2 2xl:left-[8%] md:top animate-spin-slow block z-0 opacity-70"
              src={registrationImage2}
              alt="Decorative element"
            />
            <Image
              className="absolute top-20 lg:top-3/4 md:top-14 right-20 md:right-20 lg:right-[90%] animate-move-var block z-0 opacity-70"
              src={registrationImage3}
              alt="Decorative element"
            />
          </div>
          
          <div className="container mx-auto px-4 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div
                className="lg:col-span-6 lg:pr-8"
                data-aos="fade-up"
              >
                <div className="relative lg:my-12">
                  <span className="inline-block px-4 py-1.5 mb-4 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full">
                    Corporate Training Inquiry
                  </span>
                  
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                    {mainText || "Transform Your Corporate Learning Journey"}
                  </h2>
                  
                  <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-8">
                    <div>
                      <p className="text-lg md:text-xl font-medium text-gray-200">
                        {subText || "Elevate your team's skills with our comprehensive corporate training solutions"}
                      </p>
                      <div className="flex items-center mt-3 text-gray-300 text-sm">
                        <CheckCircle size={16} className="text-primary-400 mr-2" />
                        <span>Tailored Training Programs</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-8">
                    <button 
                      onClick={() => router.push("/corporate-training")} 
                      className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50"
                    >
                      Learn More
                      <ArrowRight size={18} className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Form Section */}
              <div className={`lg:col-span-6 relative z-10 transition-all duration-700 transform ${formVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4">
                    <h3 className="text-2xl text-white text-center font-semibold font-inter">
                      Corporate Training Inquiry
                    </h3>
                  </div>
                  
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-6 md:p-8 space-y-4"
                    data-aos="fade-up"
                  >
                    {/* Full Name Input */}
                    <div>
                      <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
                      <input
                        {...register("full_name")}
                        id="full_name"
                        type="text"
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors"
                      />
                      {errors.full_name && (
                        <span className="text-red-500 text-sm mt-1 flex items-center">
                          <Info size={14} className="mr-1" />
                          {errors.full_name.message}
                        </span>
                      )}
                    </div>

                    {/* Email Input */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                      <input
                        {...register("email")}
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors"
                      />
                      {errors.email && (
                        <span className="text-red-500 text-sm mt-1 flex items-center">
                          <Info size={14} className="mr-1" />
                          {errors.email.message}
                        </span>
                      )}
                    </div>

                    {/* Phone Number with Country Dropdown */}
                    <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                        <select
                          {...register("country")}
                          id="country"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors"
                        >
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
                      </div>

                      <div>
                        <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                        <input
                          {...register("phone_number")}
                          id="phone_number"
                          type="tel"
                          placeholder="10-digit number"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors"
                        />
                      </div>
                    </div>

                    {/* Error Message for Phone/Country */}
                    {(errors.country || errors.phone_number) && (
                      <div className="text-red-500 text-sm flex items-center">
                        <Info size={14} className="mr-1" />
                        {errors.country?.message || errors.phone_number?.message}
                      </div>
                    )}

                    {/* Designation and Company Name */}
                    <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
                      <div>
                        <label htmlFor="designation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Designation</label>
                        <input
                          {...register("designation")}
                          id="designation"
                          type="text"
                          placeholder="Your job title"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors"
                        />
                        {errors.designation && (
                          <span className="text-red-500 text-sm mt-1 flex items-center">
                            <Info size={14} className="mr-1" />
                            {errors.designation.message}
                          </span>
                        )}
                      </div>

                      <div>
                        <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                        <input
                          {...register("company_name")}
                          id="company_name"
                          type="text"
                          placeholder="Your company"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors"
                        />
                        {errors.company_name && (
                          <span className="text-red-500 text-sm mt-1 flex items-center">
                            <Info size={14} className="mr-1" />
                            {errors.company_name.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Company Website */}
                    <div>
                      <label htmlFor="company_website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Website</label>
                      <input
                        {...register("company_website")}
                        id="company_website"
                        type="text"
                        placeholder="https://www.yourcompany.com"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors"
                      />
                      {errors.company_website && (
                        <span className="text-red-500 text-sm mt-1 flex items-center">
                          <Info size={14} className="mr-1" />
                          {errors.company_website.message}
                        </span>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Message</label>
                      <textarea
                        {...register("message")}
                        id="message"
                        placeholder="Tell us about your training needs"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors h-32"
                      />
                      {errors.message && (
                        <span className="text-red-500 text-sm mt-1 flex items-center">
                          <Info size={14} className="mr-1" />
                          {errors.message.message}
                        </span>
                      )}
                    </div>

                    {/* ReCAPTCHA */}
                    <div className="flex justify-center">
                      {mounted && (
                        <CustomReCaptcha
                          onChange={handleRecaptchaChange}
                          error={recaptchaError}
                        />
                      )}
                    </div>
                    
                    {/* Terms and Conditions */}
                    <div className="flex items-start space-x-3">
                      <div className="flex items-center h-5">
                        <input
                          {...register("accept")}
                          type="checkbox"
                          id="accept"
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                      </div>
                      <label
                        htmlFor="accept"
                        className="text-sm text-gray-700 dark:text-gray-300"
                      >
                        By submitting this form, I accept
                        <Link href="/terms-and-services">
                          <span className="text-primary-600 dark:text-primary-400 hover:underline ml-1">
                            Terms of Service
                          </span>
                        </Link>{" "}
                        &{" "}
                        <Link href="/privacy-policy">
                          <span className="text-primary-600 dark:text-primary-400 hover:underline">
                            Privacy Policy
                          </span>
                        </Link>
                      </label>
                    </div>
                    {errors.accept && (
                      <span className="text-red-500 text-sm block">
                        {errors.accept.message}
                      </span>
                    )}

                    {/* Submit Button */}
                    <div className="pt-3">
                      <button
                        type="submit"
                        className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-lg shadow-lg shadow-primary-500/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 size={20} className="mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Submit Inquiry"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity animation-fade-in">
          <div className={`max-w-md w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl p-6 md:p-8 relative transform transition-all animation-scale-in`}>
            {/* Close Icon */}
            <button
              onClick={() => setShowModal(false)}
              className={`absolute top-4 right-4 ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-gray-200' 
                  : 'text-gray-500 hover:text-gray-700'
              } focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full p-1`}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Modal Content */}
            <div className="text-center py-4">
              <div className={`w-16 h-16 ${
                isDarkMode 
                  ? 'bg-green-900/30' 
                  : 'bg-green-100'
              } rounded-full flex items-center justify-center mx-auto mb-4`}>
                <CheckCircle className={`${
                  isDarkMode ? 'text-green-400' : 'text-green-500'
                }`} size={32} />
              </div>
              
              <h2 className={`text-2xl md:text-3xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              } mb-2`}>
                Success!
              </h2>
              
              <p className={`${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              } mb-6`}>
                Your corporate training inquiry has been submitted successfully! We'll get back to you shortly.
              </p>
              
              <button
                onClick={() => setShowModal(false)}
                className="inline-flex items-center justify-center px-5 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors shadow-lg shadow-primary-500/20"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CorporateJourneyForm;
