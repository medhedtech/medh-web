"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  mobile: yup
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
  apply_for_role: yup.string().required("Role to apply for is required"),
  message: yup.string().required("Message is required"),
});

const PlacementForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const { postQuery } = usePostQuery();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      postQuery({
        url: apiUrls?.placements?.addPlacements,
        postData: {
          studentId: "673842146e127d858bf73322",
          name: data?.name,
          area_of_interest: data?.area_of_interest,
          apply_for_role: data?.apply_for_role,
          message: data?.message,
          course_completed_year: data?.course_completed_year,
          completed_course: data?.completed_course,
          email_id: data?.email,
          city: data?.city,
          mobile_number: data?.mobile,
        },
        onSuccess: () => {
          toast.success("Placement details submitted successfully!");
          reset();
        },
        onFail: (error) => {
          console.error("Error submitting form:", error);
          toast.error("Failed to submit form. Please try again.");
        },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full p-4">
      <div className="w-[98%] bg-white dark:bg-inherit dark:text-white p-6 rounded-lg shadow-md font-Poppins">
        <h2 className="text-xl font-semibold mb-4">Add Placement Details</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Name */}
          <div>
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full border border-gray-300 rounded-md py-2 px-3"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email Id
            </label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 rounded-md py-2 px-3"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Mobile */}
          <div>
            <label htmlFor="mobile" className="text-sm font-medium">
              Mobile Number
            </label>
            <input
              type="text"
              id="mobile"
              className="w-full border border-gray-300 rounded-md py-2 px-3"
              {...register("mobile")}
            />
            {errors.mobile && (
              <p className="text-red-500 text-xs mt-1">
                {errors.mobile.message}
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="text-sm font-medium">
              City
            </label>
            <input
              type="text"
              id="city"
              className="w-full border border-gray-300 rounded-md py-2 px-3"
              {...register("city")}
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
            )}
          </div>

          {/* Completed Course */}
          <div>
            <label htmlFor="completed_course" className="text-sm font-medium">
              Completed Course
            </label>
            <input
              type="text"
              id="completed_course"
              className="w-full border border-gray-300 rounded-md py-2 px-3"
              {...register("completed_course")}
            />
            {errors.completed_course && (
              <p className="text-red-500 text-xs mt-1">
                {errors.completed_course.message}
              </p>
            )}
          </div>

          {/* Course Completed Year */}
          {/* <div>
            <label
              htmlFor="course_completed_year"
              className="text-sm font-medium"
            >
              Course Completed Year
            </label>
            <input
              type="number"
              id="course_completed_year"
              className="w-full border border-gray-300 rounded-md py-2 px-3"
              {...register("course_completed_year")}
            />
            {errors.course_completed_year && (
              <p className="text-red-500 text-xs mt-1">
                {errors.course_completed_year.message}
              </p>
            )}
          </div> */}
          <div>
            <label
              htmlFor="course_completed_year"
              className="text-sm font-medium"
            >
              Course Completed Year
            </label>
            <select
              id="course_completed_year"
              className="w-full border border-gray-300 rounded-md py-3 px-3"
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
            {errors.course_completed_year && (
              <p className="text-red-500 text-xs mt-1">
                {errors.course_completed_year.message}
              </p>
            )}
          </div>

          {/* Area of Interest */}
          <div>
            <label htmlFor="area_of_interest" className="text-sm font-medium">
              Area of Interest
            </label>
            <input
              type="text"
              id="area_of_interest"
              className="w-full border border-gray-300 rounded-md py-2 px-3"
              {...register("area_of_interest")}
            />
            {errors.area_of_interest && (
              <p className="text-red-500 text-xs mt-1">
                {errors.area_of_interest.message}
              </p>
            )}
          </div>

          {/* Apply for Role */}
          <div>
            <label htmlFor="apply_for_role" className="text-sm font-medium">
              Apply for Role
            </label>
            <input
              type="text"
              id="apply_for_role"
              className="w-full border border-gray-300 rounded-md py-2 px-3"
              {...register("apply_for_role")}
            />
            {errors.apply_for_role && (
              <p className="text-red-500 text-xs mt-1">
                {errors.apply_for_role.message}
              </p>
            )}
          </div>

          {/* Message */}
          <div className="md:col-span-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              className="w-full border border-gray-300 rounded-md py-2 px-3"
              {...register("message")}
            />
            {errors.message && (
              <p className="text-red-500 text-xs mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-green-500 focus:outline-none"
            >
              {loading ? "Submitting..." : "Add Placement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlacementForm;
