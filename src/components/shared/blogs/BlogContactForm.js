import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Mail, User, MessageSquare, Send, Loader2, CheckCircle } from "lucide-react";
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
  message: yup
    .string()
    .required("Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must not exceed 1000 characters"),
});

const BlogContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      full_name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      const contactData = {
        full_name: data.full_name,
        email: data.email,
        phone: "", // Optional field
        company: "", // Optional field
        subject: "Blog Contact Form Inquiry",
        message: data.message,
        inquiry_type: "general",
        preferred_contact_method: "email",
        consent_marketing: false,
        consent_terms: true,
      };

      const response = await submitContactForm(contactData);
      
      if (response.status === "success") {
        setIsSubmitted(true);
        reset();
        showToast.success("Thank you for your message! We'll get back to you soon.");
        
        // Reset success state after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
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

  if (isSubmitted) {
    return (
      <div
        className="p-5 md:p-30px lg:p-5 2xl:p-30px mb-30px border border-borderColor2 dark:border-borderColor2-dark"
        data-aos="fade-up"
      >
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h4 className="text-size-22 text-blackColor dark:text-blackColor-dark font-bold mb-2">
            Message Sent Successfully!
          </h4>
          <p className="text-contentColor dark:text-contentColor-dark">
            Thank you for reaching out. We'll get back to you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-5 md:p-30px lg:p-5 2xl:p-30px mb-30px border border-borderColor2 dark:border-borderColor2-dark"
      data-aos="fade-up"
    >
      <h4 className="text-size-22 text-blackColor dark:text-blackColor-dark font-bold pl-2 before:w-0.5 relative before:h-[21px] before:bg-primaryColor before:absolute before:bottom-[5px] before:left-0 leading-30px mb-25px">
        Get in Touch
      </h4>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name Field */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <User className="w-4 h-4 text-placeholder" />
          </div>
          <input
            type="text"
            placeholder="Enter Name*"
            {...register("full_name")}
            className={`w-full pl-10 text-contentColor leading-7 pb-10px bg-transparent focus:outline-none placeholder:text-placeholder placeholder:opacity-80 border-b ${
              errors.full_name 
                ? "border-red-500 dark:border-red-400" 
                : "border-borderColor2 dark:border-borderColor2-dark focus:border-primaryColor dark:focus:border-primaryColor"
            } dark:text-contentColor-dark transition-colors duration-200`}
          />
          {errors.full_name && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
              {errors.full_name.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <Mail className="w-4 h-4 text-placeholder" />
          </div>
          <input
            type="email"
            placeholder="Enter your mail*"
            {...register("email")}
            className={`w-full pl-10 text-contentColor leading-7 pb-10px bg-transparent focus:outline-none placeholder:text-placeholder placeholder:opacity-80 border-b ${
              errors.email 
                ? "border-red-500 dark:border-red-400" 
                : "border-borderColor2 dark:border-borderColor2-dark focus:border-primaryColor dark:focus:border-primaryColor"
            } dark:text-contentColor-dark transition-colors duration-200`}
          />
          {errors.email && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div className="relative">
          <div className="absolute left-3 top-4 pointer-events-none">
            <MessageSquare className="w-4 h-4 text-placeholder" />
          </div>
          <textarea
            placeholder="Your Message*"
            rows="4"
            {...register("message")}
            className={`w-full pl-10 text-contentColor leading-7 pt-3 pb-10px bg-transparent focus:outline-none placeholder:text-placeholder placeholder:opacity-80 border-b ${
              errors.message 
                ? "border-red-500 dark:border-red-400" 
                : "border-borderColor2 dark:border-borderColor2-dark focus:border-primaryColor dark:focus:border-primaryColor"
            } dark:text-contentColor-dark transition-colors duration-200 resize-none`}
          />
          {errors.message && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="text-size-15 text-whiteColor uppercase bg-primaryColor border border-primaryColor px-55px py-13px hover:text-primaryColor hover:bg-whiteColor rounded inline-block dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BlogContactForm;
