import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Edit3, Phone, MessageSquare, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import { submitContactForm } from "@/apis/form.api";

// Validation schema
const schema = yup.object().shape({
  full_name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .matches(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required")
    .lowercase()
    .trim(),
  phone: yup
    .string()
    .matches(/^[0-9+\-\s\(\)]*$/, "Please enter a valid phone number")
    .min(10, "Phone number must be at least 10 digits"),
  company: yup
    .string()
    .max(100, "Company name must not exceed 100 characters"),
  subject: yup
    .string()
    .required("Service type is required")
    .min(3, "Service type must be at least 3 characters")
    .max(100, "Service type must not exceed 100 characters"),
  message: yup
    .string()
    .required("Message is required")
    .min(20, "Message must be at least 20 characters")
    .max(2000, "Message must not exceed 2000 characters"),
});

const ContactFrom = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      company: "",
      subject: "",
      message: "",
    },
  });

  // Watch form values for progress calculation
  const watchedFields = watch();
  const filledFields = Object.values(watchedFields).filter(value => value && value.toString().trim().length > 0).length;
  const totalFields = 6;
  const formProgress = Math.round((filledFields / totalFields) * 100);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      const contactData = {
        full_name: data.full_name,
        email: data.email,
        phone: data.phone || "",
        company: data.company || "",
        subject: data.subject,
        message: data.message,
        inquiry_type: "general",
        preferred_contact_method: data.phone ? "both" : "email",
        consent_marketing: false,
        consent_terms: true,
      };

      const response = await submitContactForm(contactData);
      
      if (response.status === "success") {
        setIsSubmitted(true);
        reset();
        showToast.success("Thank you for your message! We'll get back to you within 24 hours.");
        
        // Reset success state after 8 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 8000);
      } else {
        throw new Error(response.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      showToast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state component
  if (isSubmitted) {
    return (
      <section>
        <div className="container pb-100px">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 md:p-70px md:pt-90px border border-borderColor2 dark:border-transparent dark:shadow-container"
            data-aos="fade-up"
          >
            <div className="text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full mb-6"
              >
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-size-32 md:text-size-44 font-bold text-blackColor dark:text-blackColor-dark mb-4"
              >
                Message Sent Successfully!
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-size-16 md:text-lg text-contentColor dark:text-contentColor-dark mb-6 max-w-md mx-auto"
              >
                Thank you for reaching out to us. Our team will review your message and get back to you within 24 hours.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-primaryColor hover:text-primaryColor/80 font-medium underline"
                >
                  Send Another Message
                </button>
                <span className="text-contentColor dark:text-contentColor-dark">|</span>
                <a
                  href="/"
                  className="text-primaryColor hover:text-primaryColor/80 font-medium underline"
                >
                  Return to Home
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="container pb-100px">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-5 md:p-70px md:pt-90px border border-borderColor2 dark:border-transparent dark:shadow-container relative"
          data-aos="fade-up"
          noValidate
        >
          {/* Progress Indicator */}
          <div className="absolute top-4 right-4 md:top-8 md:right-8">
            <div className="flex items-center gap-2 bg-primaryColor/10 dark:bg-primaryColor/20 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-primaryColor rounded-full"></div>
              <span className="text-xs font-medium text-primaryColor">
                {formProgress}% Complete
              </span>
            </div>
          </div>

          {/* heading */}
          <div className="mb-10">
            <h4
              className="text-size-23 md:text-size-44 font-bold leading-10 md:leading-70px text-blackColor dark:text-blackColor-dark"
              data-aos="fade-up"
            >
              Drop Us a Line
            </h4>
            <p
              data-aos="fade-up"
              className="text-size-13 md:text-base leading-5 md:leading-30px text-contentColor dark:text-contentColor-dark"
            >
              Your email address will not be published. Required fields are
              marked *
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 mb-30px gap-30px">
            {/* Name Field */}
            <div data-aos="fade-up" className="relative">
              <input
                type="text"
                placeholder="Enter your name*"
                {...register("full_name")}
                className={`w-full pl-26px bg-transparent focus:outline-none text-contentColor dark:text-contentColor-dark border ${
                  errors.full_name
                    ? "border-red-500 dark:border-red-400"
                    : "border-borderColor2 dark:border-borderColor2-dark focus:border-primaryColor dark:focus:border-primaryColor"
                } placeholder:text-placeholder placeholder:opacity-80 h-15 leading-15 font-medium rounded transition-colors duration-200`}
              />
              <div className={`text-xl leading-23px absolute right-6 top-1/2 -translate-y-1/2 ${
                errors.full_name ? "text-red-500" : "text-primaryColor"
              }`}>
                <User className="w-5 h-5" />
              </div>
              <AnimatePresence>
                {errors.full_name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.full_name.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Email Field */}
            <div data-aos="fade-up" className="relative">
              <input
                type="email"
                placeholder="Enter Email Address*"
                {...register("email")}
                className={`w-full pl-26px bg-transparent focus:outline-none text-contentColor dark:text-contentColor-dark border ${
                  errors.email
                    ? "border-red-500 dark:border-red-400"
                    : "border-borderColor2 dark:border-borderColor2-dark focus:border-primaryColor dark:focus:border-primaryColor"
                } placeholder:text-placeholder placeholder:opacity-80 h-15 leading-15 font-medium rounded transition-colors duration-200`}
              />
              <div className={`text-xl leading-23px absolute right-6 top-1/2 -translate-y-1/2 ${
                errors.email ? "text-red-500" : "text-primaryColor"
              }`}>
                <Mail className="w-5 h-5" />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Service Type Field */}
            <div data-aos="fade-up" className="relative">
              <input
                type="text"
                placeholder="Write Service Type*"
                {...register("subject")}
                className={`w-full pl-26px bg-transparent focus:outline-none text-contentColor dark:text-contentColor-dark border ${
                  errors.subject
                    ? "border-red-500 dark:border-red-400"
                    : "border-borderColor2 dark:border-borderColor2-dark focus:border-primaryColor dark:focus:border-primaryColor"
                } placeholder:text-placeholder placeholder:opacity-80 h-15 leading-15 font-medium rounded transition-colors duration-200`}
              />
              <div className={`text-xl leading-23px absolute right-6 top-1/2 -translate-y-1/2 ${
                errors.subject ? "text-red-500" : "text-primaryColor"
              }`}>
                <Edit3 className="w-5 h-5" />
              </div>
              <AnimatePresence>
                {errors.subject && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.subject.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Phone Field */}
            <div data-aos="fade-up" className="relative">
              <input
                type="tel"
                placeholder="Enter Your Phone"
                {...register("phone")}
                className={`w-full pl-26px bg-transparent focus:outline-none text-contentColor dark:text-contentColor-dark border ${
                  errors.phone
                    ? "border-red-500 dark:border-red-400"
                    : "border-borderColor2 dark:border-borderColor2-dark focus:border-primaryColor dark:focus:border-primaryColor"
                } placeholder:text-placeholder placeholder:opacity-80 h-15 leading-15 font-medium rounded transition-colors duration-200`}
              />
              <div className={`text-xl leading-23px absolute right-6 top-1/2 -translate-y-1/2 ${
                errors.phone ? "text-red-500" : "text-primaryColor"
              }`}>
                <Phone className="w-5 h-5" />
              </div>
              <AnimatePresence>
                {errors.phone && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.phone.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Company Field (Optional) */}
          <div className="mb-30px" data-aos="fade-up">
            <div className="relative">
              <input
                type="text"
                placeholder="Company Name (Optional)"
                {...register("company")}
                className={`w-full pl-26px bg-transparent focus:outline-none text-contentColor dark:text-contentColor-dark border ${
                  errors.company
                    ? "border-red-500 dark:border-red-400"
                    : "border-borderColor2 dark:border-borderColor2-dark focus:border-primaryColor dark:focus:border-primaryColor"
                } placeholder:text-placeholder placeholder:opacity-80 h-15 leading-15 font-medium rounded transition-colors duration-200`}
              />
              <div className="text-xl leading-23px text-primaryColor absolute right-6 top-1/2 -translate-y-1/2">
                <Edit3 className="w-5 h-5" />
              </div>
              <AnimatePresence>
                {errors.company && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.company.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Message Field */}
          <div className="relative mb-30px" data-aos="fade-up">
            <textarea
              placeholder="Enter your Message here*"
              rows="6"
              {...register("message")}
              className={`w-full pl-26px pt-4 bg-transparent text-contentColor dark:text-contentColor-dark border ${
                errors.message
                  ? "border-red-500 dark:border-red-400"
                  : "border-borderColor2 dark:border-borderColor2-dark focus:border-primaryColor dark:focus:border-primaryColor"
              } placeholder:text-placeholder placeholder:opacity-80 rounded focus:outline-none transition-colors duration-200 resize-none`}
            />
            <div className={`text-xl leading-23px absolute right-6 top-[17px] ${
              errors.message ? "text-red-500" : "text-primaryColor"
            }`}>
              <MessageSquare className="w-5 h-5" />
            </div>
            <AnimatePresence>
              {errors.message && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.message.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Submit Button */}
          <div className="mt-30px" data-aos="fade-up">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="text-size-15 text-whiteColor uppercase bg-primaryColor border border-primaryColor px-55px py-13px hover:text-primaryColor hover:bg-whiteColor rounded inline-block dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending Message...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactFrom;
