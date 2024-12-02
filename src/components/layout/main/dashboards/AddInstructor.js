"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import usePostQuery from "@/hooks/postQuery.hook";
import { useForm } from "react-hook-form";
import { apiUrls } from "@/apis";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-toastify";
import useGetQuery from "@/hooks/getQuery.hook";
import Preloader from "@/components/shared/others/Preloader";
import InstructorTable from "./InstructoreManage";

// Validation Schema
const schema = yup.object({
  full_name: yup.string().required("Instructor name is required"),
  // age: yup.number(),
  age: yup
    .number()
    .typeError("Age must be a number")
    .required("Age is required")
    .min(18, "Age must be above 18 years"),
  phone_number: yup.string().required("Mobile number is required"),
  email: yup.string().email().required("Email is required"),
  course_name: yup.string(),
  domain: yup.string().required("Domain is required"),
});

const AddInstructor = () => {
  const router = useRouter();
  const { postQuery, loading } = usePostQuery();
  const { getQuery } = useGetQuery();
  const [courses, setCourses] = useState([]);
  const [showInstructorListing, setShowInstructorListing] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchCourseNames = async () => {
      try {
        await getQuery({
          url: apiUrls?.courses?.getCourseNames,
          onSuccess: (data) => {
            setCourses(data);
          },
          onFail: (err) => {
            console.error(
              "API error:",
              err instanceof Error ? err.message : err
            );
          },
        });
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchCourseNames();
  }, []);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      await postQuery({
        url: apiUrls?.Instructor?.createInstructor,
        postData: {
          full_name: data.full_name,
          email: data.email,
          phone_number: data.phone_number,
          domain: data.domain,
          meta: {
            course_name: data.course_name,
            age: data.age,
          },
        },
        onSuccess: () => {
          setShowInstructorListing(true);
          toast.success("Instructor added successfully!");
          reset();
        },
        onFail: () => {
          toast.error("Instructor already exists with same email or mobile.");
        },
      });
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  if (showInstructorListing) {
    return <InstructorTable onCancel={() => setShowInstructorListing(false)} />;
  }

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="flex items-start justify-center w-full dark:bg-inherit dark:text-white bg-gray-100 p-4 pt-9">
      <div className="w-[95%] mx-auto p-6 dark:bg-inherit dark:text-white dark:border bg-white rounded-lg shadow-md font-Poppins">
        <h2 className="text-2xl font-semibold mb-6">Add Instructor</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* Full Name Field */}
          <div className="flex flex-col">
            <label
              htmlFor="full_name"
              className="text-xs px-2 text-[#808080]  font-medium mb-1"
            >
              Full Name
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="full_name"
                placeholder="Instructor Name"
                className="w-full border border-gray-300 dark:bg-inherit rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                {...register("full_name")}
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_259_4315)">
                      <path
                        d="M12 5.9C13.16 5.9 14.1 6.84 14.1 8C14.1 9.16 13.16 10.1 12 10.1C10.84 10.1 9.9 9.16 9.9 8C9.9 6.84 10.84 5.9 12 5.9ZM12 14.9C14.97 14.9 18.1 16.36 18.1 17V18.1H5.9V17C5.9 16.36 9.03 14.9 12 14.9ZM12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4ZM12 13C9.33 13 4 14.34 4 17V20H20V17C20 14.34 14.67 13 12 13Z"
                        fill="#808080"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_259_4315">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
              </span>
            </div>
            {errors.full_name && (
              <span className="text-red-500 text-xs">
                {errors.full_name.message}
              </span>
            )}
          </div>

          {/* phone_number */}
          <div className="flex flex-col">
            <label
              htmlFor=" phone_number"
              className="text-xs px-2 text-[#808080] font-medium mb-1"
            >
              Phone Number
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="Phone"
                id="phone_number"
                placeholder="999999999"
                className="w-full border border-gray-300 dark:bg-inherit rounded-md py-2 px-3 pr-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                {...register("phone_number")}
              />
            </div>
            {errors.phone_number && (
              <span className="text-red-500 text-xs">
                {errors.phone_number.message}
              </span>
            )}
          </div>

          {/* Email Field */}

          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-xs px-2 text-[#808080] font-medium mb-1"
            >
              Email
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 dark:bg-inherit rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                {...register("email")}
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z"
                      fill="#808080"
                    />
                  </svg>
                </span>
              </span>
            </div>
            {errors.email && (
              <span className="text-red-500 text-xs">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="domain"
              className="text-xs px-2 text-[#808080] font-medium mb-1"
            >
              Domain
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type=""
                id="domain"
                placeholder="Domain Name"
                className="w-full border border-gray-300 dark:bg-inherit rounded-md py-2 px-3 pr-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                {...register("domain")}
              />
            </div>
            {errors.domain && (
              <span className="text-red-500 text-xs">
                {errors.domain.message}
              </span>
            )}
          </div>

          {/* Course Name Field */}
          <div className="flex flex-col">
            <label
              htmlFor="course_name"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Course Name
            </label>
            <select
              {...register("course_name")}
              className="w-full p-2 border rounded-lg dark:bg-inherit text-gray-600"
            >
              <option value="">Select Course</option>
              {courses.map((course, index) => (
                <option key={index} value={course.course_title}>
                  {course.course_title}
                </option>
              ))}
            </select>
          </div>

          {/* Age Field */}
          <div className="flex flex-col">
            <label
              htmlFor="age"
              className="text-xs px-2 text-[#808080] font-medium mb-1"
            >
              Age
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="number"
              id="age"
              placeholder="Age"
              className="w-full border border-gray-300 dark:bg-inherit rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              {...register("age")}
            />
            {errors.age && (
              <span className="text-red-500 text-xs">{errors.age.message}</span>
            )}
          </div>
          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end items-center space-x-4 sm:col-span-2 mt-4">
            <button
              type="button"
              onClick={() => setShowInstructorListing(true)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-200 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-green-500 focus:outline-none"
              disabled={loading}
            >
              Add Instructor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInstructor;
