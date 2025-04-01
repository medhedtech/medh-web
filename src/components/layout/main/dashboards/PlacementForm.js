"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Send, Loader2, Building2, GraduationCap, MapPin, Mail, Phone, User, MessageSquare } from "lucide-react";

const schema = yup.object({
  full_name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone_number: yup
    .string()
    .matches(/^\d{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  city: yup.string().required("City is required"),
  completed_course: yup.string().required("Completed course is required"),
  course_completed_year: yup
    .number()
    .typeError("Year must be a number")
    .min(1900, "Year must be valid")
    .max(new Date().getFullYear(), "Year cannot be in the future")
    .required("Course completed year is required"),
  area_of_interest: yup.string().required("Area of interest is required"),
  message: yup.string().required("Message is required"),
});

const FormInput = ({ label, icon: Icon, error, ...props }) => (
  <div className="relative">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
          error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary-500'
        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200`}
        {...props}
      />
    </div>
    <AnimatePresence mode="wait">
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-red-500 text-xs mt-1"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

const PlacementForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const { postQuery } = usePostQuery();
  const { getQuery } = useGetQuery();
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      setStudentId(storedUserId);
    }
  }, []);

  const fetchUserDetailsById = async () => {
    if (!studentId) return;
    await getQuery({
      url: `${apiUrls?.user?.getDetailsbyId}/${studentId}`,
      onSuccess: (res) => {
        if (res?.data) {
          reset({
            full_name: res.data.full_name || "",
            email: res.data.email || "",
            phone_number: res.data.phone_number || "",
            city: res.data.city || "",
            completed_course: res.data.completed_course || "",
            course_completed_year: res.data.course_completed_year || "",
            area_of_interest: res.data.area_of_interest || "",
            message: res.data.message || "",
          });
        }
      },
      onFail: (err) => {
        console.error("Error fetching user details:", err);
        toast.error("Failed to fetch user details.");
      },
    });
  };

  useEffect(() => {
    fetchUserDetailsById();
  }, [studentId]);

  const onSubmit = async (data) => {
    if (!studentId) {
      toast.error("Student ID is missing. Please log in again.");
      return;
    }

    setLoading(true);

    postQuery({
      url: apiUrls?.placements?.addPlacements,
      postData: {
        studentId,
        ...data,
      },
      onSuccess: () => {
        toast.success("Placement details submitted successfully!");
        reset();
      },
      onFail: (error) => {
        console.error("Error submitting form:", error);
        toast.error("Failed to submit form. Please try again.");
      },
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center w-full p-4"
    >
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
            <Briefcase className="w-6 h-6 text-primary-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Placement Details
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Full Name"
              icon={User}
              type="text"
              error={errors.full_name?.message}
              {...register("full_name")}
            />

            <FormInput
              label="Email"
              icon={Mail}
              type="email"
              error={errors.email?.message}
              {...register("email")}
            />

            <FormInput
              label="Phone Number"
              icon={Phone}
              type="tel"
              error={errors.phone_number?.message}
              {...register("phone_number")}
            />

            <FormInput
              label="City"
              icon={MapPin}
              type="text"
              error={errors.city?.message}
              {...register("city")}
            />

            <FormInput
              label="Completed Course"
              icon={GraduationCap}
              type="text"
              error={errors.completed_course?.message}
              {...register("completed_course")}
            />

            <div className="relative">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                Course Completed Year
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                    errors.course_completed_year ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200`}
                  {...register("course_completed_year")}
                >
                  <option value="">Select Year</option>
                  {[...Array(5)].map((_, index) => {
                    const year = new Date().getFullYear() - index;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
                <AnimatePresence mode="wait">
                  {errors.course_completed_year && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.course_completed_year.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <FormInput
              label="Area of Interest"
              icon={Building2}
              type="text"
              error={errors.area_of_interest?.message}
              {...register("area_of_interest")}
            />
          </div>

          <div className="relative">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
              Message
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <MessageSquare className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                  errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 min-h-[100px]`}
                {...register("message")}
              />
              <AnimatePresence mode="wait">
                {errors.message && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.message.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <motion.div 
            className="flex justify-end"
            initial={false}
            animate={{ opacity: isDirty ? 1 : 0.5 }}
          >
            <motion.button
              type="submit"
              disabled={loading || !isDirty}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200
                ${isDirty 
                  ? 'bg-primary-500 hover:bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'}`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Details
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
};

export default PlacementForm;
