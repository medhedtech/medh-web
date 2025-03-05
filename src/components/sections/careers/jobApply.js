import React, { useState } from "react";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { FaCamera, FaTimes, FaCheckCircle, FaUpload, FaBriefcase, FaMapMarkerAlt, FaClock, FaDollarSign, FaChevronRight } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import countriesData from "@/utils/countrycode.json";
import CustomReCaptcha from '../../shared/ReCaptcha';
import { motion, AnimatePresence } from "framer-motion";

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
  message: yup.string(),
  accept: yup
    .boolean()
    .oneOf([true], "You must accept the terms and privacy policy")
    .required(),
});

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
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [pdfBrochure, setPdfBrochure] = useState(null);
  const watchedFields = watch();

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
    setRecaptchaError(false);
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File size should not exceed 5MB");
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
              toast.success("Resume uploaded successfully!");
              setPdfBrochure(data?.data);
            },
            onError: () => {
              toast.error("Resume upload failed. Please try again.");
            },
          });
        };
      } catch (error) {
        toast.error("Error uploading resume. Please try again.");
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
      toast.error("Please upload your resume");
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
          toast.error("Error submitting application. Please try again.");
        },
      });
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <span>Careers</span>
          <FaChevronRight className="h-3 w-3" />
          <span>Job Application</span>
        </div>

        <div className="bg-white dark:bg-screen-dark rounded-xl shadow-lg overflow-hidden">
          {/* Job Position Header */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400 opacity-90" />
            <div className="relative px-8 py-10 text-white">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h1 className="text-3xl md:text-4xl font-bold">
                  {jobDetails?.title || activeJob || "Position"}
                </h1>
                
                <div className="flex flex-wrap gap-6 text-base">
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
            <div className="md:col-span-5 px-8 py-6 border-r border-gray-200 dark:border-gray-700">
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
            <div className="md:col-span-7 px-8 py-6">
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-primary-500 mb-6">
                  Submit Your Application
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-4">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <input
                        {...register("full_name")}
                        type="text"
                        placeholder="Your Name*"
                        className={`w-full px-4 py-3 border ${
                          errors.full_name ? 'border-red-500' : 'border-gray-300'
                        } dark:bg-inherit rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200`}
                      />
                      {errors.full_name && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm"
                        >
                          {errors.full_name.message}
                        </motion.p>
                      )}

                      <input
                        {...register("email")}
                        type="email"
                        placeholder="Your Email*"
                        className={`w-full px-4 py-3 border ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        } dark:bg-inherit rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200`}
                      />
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm"
                        >
                          {errors.email.message}
                        </motion.p>
                      )}
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <select
                          {...register("country")}
                          className={`w-full px-4 py-3 border ${
                            errors.country ? 'border-red-500' : 'border-gray-300'
                          } dark:bg-inherit rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200`}
                        >
                          <option value="">Select Country</option>
                          {countriesData.map((country) => (
                            <option key={country.code} value={country.name}>
                              {country.name} ({country.dial_code})
                            </option>
                          ))}
                        </select>
                        {errors.country && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1"
                          >
                            {errors.country.message}
                          </motion.p>
                        )}
                      </div>
                      <div>
                        <input
                          {...register("phone_number")}
                          type="tel"
                          placeholder="Phone Number*"
                          className={`w-full px-4 py-3 border ${
                            errors.phone_number ? 'border-red-500' : 'border-gray-300'
                          } dark:bg-inherit rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200`}
                        />
                        {errors.phone_number && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1"
                          >
                            {errors.phone_number.message}
                          </motion.p>
                        )}
                      </div>
                    </div>

                    {/* Cover Letter */}
                    <div>
                      <textarea
                        {...register("message")}
                        placeholder="Write your cover letter (optional)"
                        className="w-full px-4 py-3 border border-gray-300 dark:bg-inherit rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 min-h-[120px] resize-y"
                        rows="4"
                      />
                    </div>

                    {/* Resume Upload */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Upload Your Resume*
                      </h3>
                      <div className="relative">
                        <label
                          htmlFor="fileInput"
                          className={`flex items-center gap-3 border ${
                            pdfBrochure ? 'border-green-500' : 'border-gray-300'
                          } rounded-lg p-4 cursor-pointer w-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200`}
                        >
                          {isUploading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500" />
                          ) : pdfBrochure ? (
                            <FaCheckCircle className="text-green-500 text-xl" />
                          ) : (
                            <FaUpload className="text-gray-500 text-xl" />
                          )}
                          <span className="text-gray-700 dark:text-gray-300 truncate">
                            {fileName}
                          </span>
                        </label>
                        <input
                          id="fileInput"
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={handlePdfUpload}
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        Maximum file size: 5MB (PDF only)
                      </p>
                    </div>

                    {/* reCAPTCHA */}
                    <div className="pt-2">
                      <CustomReCaptcha
                        onChange={handleRecaptchaChange}
                        error={recaptchaError}
                      />
                      {recaptchaError && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1"
                        >
                          Please complete the reCAPTCHA
                        </motion.p>
                      )}
                    </div>

                    {/* Terms and Privacy */}
                    <div className="flex items-start space-x-3 pt-2">
                      <input
                        {...register("accept")}
                        type="checkbox"
                        id="accept"
                        className="w-5 h-5 text-primary-500 border-gray-300 rounded mt-1 focus:ring-primary-500"
                      />
                      <label
                        htmlFor="accept"
                        className="text-sm text-gray-700 dark:text-gray-300"
                      >
                        By submitting this form, I accept the
                        <a href="/terms-and-services" className="text-primary-500 hover:text-primary-600 ml-1">
                          Terms of Service
                        </a>
                        {" "}and{" "}
                        <a href="/privacy-policy" className="text-primary-500 hover:text-primary-600">
                          Privacy Policy
                        </a>
                        .
                      </label>
                    </div>
                    {errors.accept && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm"
                      >
                        {errors.accept.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className={`w-full px-6 py-3 text-white bg-primary-500 rounded-lg font-medium ${
                      isSubmitting || loading
                        ? 'opacity-70 cursor-not-allowed'
                        : 'hover:bg-primary-600 transform hover:-translate-y-0.5'
                    } transition-all duration-200 flex items-center justify-center space-x-2`}
                  >
                    {(isSubmitting || loading) && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    )}
                    <span>{isSubmitting || loading ? 'Submitting...' : 'Submit Application'}</span>
                  </button>
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
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 m-4 relative"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
              >
                <FaTimes size={20} />
              </button>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <FaCheckCircle className="text-green-500 text-3xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Application Submitted!
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Thank you for your interest. We'll review your application and get back to you soon.
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
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
