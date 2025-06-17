"use client";
import React, { useEffect, useState } from "react";
import usePostQuery from "@/hooks/postQuery.hook";
import { useForm } from "react-hook-form";
import { apiUrls } from "@/apis";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import Preloader from "@/components/shared/others/Preloader";
import CoorporateTableStudent from "./CoorporateStudentManagement";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// Validation Schema
const schema = yup.object({
  full_name: yup.string().required("Student name is required"),
  // email: yup.string().email().required("Email is required"),
  email: yup
    .string()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|in)$/,
      "Please enter a valid email"
    ),
  phone_number: yup
    .string()
    .required("Mobile number is required")
    .matches(/^[6-9]\d{9}$/, "Mobile number must be a valid 10-digit number"),
  gender: yup.string().required("Gender is required"),
  password: yup
    .string()
    .min(8, "At least 8 characters required")
    .required("Password is required"),
  confirm_password: yup
    .string()
    .oneOf(
      [yup.ref("password"), null],
      "Password and confirm password must match"
    )
    .required("Confirm password is required"),
});

const AddCoorporateStudentForm = () => {
  const { postQuery, loading } = usePostQuery();
  const [showCoorporateStudentListing, setShowCoorporateStudentListing] =
    useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [coorporateId, setCoorporateId] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setCoorporateId(storedUserId);
      } else {
        console.error("No instructor ID found in localStorage");
      }
    }
  }, []);

  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      await postQuery({
        url: apiUrls?.CoorporateStudent?.createCoorporateStudent,
        postData: {
          full_name: data.full_name,
          email: data.email,
          phone_number: data.phone_number,
          password: data.password,
          meta: {
            gender: data.gender,
            age: 24,
            corporate_id: coorporateId,
          },
        },
        onSuccess: () => {
          setShowCoorporateStudentListing(true);
          showToast.success("Student added successfully!");
          reset();
        },
        onFail: (error) => {
          console.error("Error adding student:", error);
          toast.error("An unexpected error occurred.");
        },
      });
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  if (showCoorporateStudentListing) {
    return (
      <CoorporateTableStudent
        onCancel={() => setShowCoorporateStudentListing(false)}
      />
    );
  }

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="flex items-start justify-center w-full bg-gray-100 p-4 pt-9">
      <div className="w-[95%] mx-auto p-6 bg-white rounded-lg shadow-md font-Poppins">
        <h2 className="text-2xl font-semibold mb-6">Add Employee</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* Full Name Field */}
          <div className="flex flex-col">
            <label
              htmlFor="full_name"
              className="text-xs px-2 text-[#808080] font-medium mb-1"
            >
              Full Name
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="full_name"
                placeholder="Student Name"
                className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-green-400"
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
                    <g clipPath="url(#clip0_259_4315)">
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
              htmlFor="phone_number"
              className="text-xs px-2 text-[#808080] font-medium mb-1"
            >
              Mobile Number
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

          {/* Age Field */}
          {/* <div className="flex flex-col">
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
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              {...register("age")}
            />
            {errors.age && (
              <span className="text-red-500 text-xs">{errors.age.message}</span>
            )}
          </div> */}

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
                placeholder="example@gmail.com"
                className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-green-400"
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

          <div className="relative mt-[-7px]">
            <label className="text-xs px-2 text-[#808080] font-medium mb-1">
              Select Gender
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              {...register("gender")}
              name="gender"
              className=" block w-full h-12 mt-[-2px] border dark:text-whitegrey1 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 dark:bg-inherit focus:ring-green-500"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
            {errors.gender && (
              <p className="text-xs text-red-500 font-normal mt-[2px] ml-2">
                {errors.gender?.message}
              </p>
            )}
          </div>

          <div className="gap-4 mb-4">
            <label
              htmlFor="password"
              className="text-xs px-2 text-[#808080] font-medium mb-1"
            >
              Password
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full border border-gray-300 dark:bg-inherit rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 font-normal mt-[2px] ml-2">
                {errors.password?.message}
              </p>
            )}
          </div>

          <div className="gap-4 mb-4">
            <label
              htmlFor="confirm_password"
              className="text-xs px-2 text-[#808080] font-medium mb-1"
            >
              Confirm Password
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                {...register("confirm_password")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full border border-gray-300 dark:bg-inherit rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showConfirmPassword ? (
                  <FaEyeSlash size={20} />
                ) : (
                  <FaEye size={20} />
                )}
              </button>
            </div>
            {errors.confirm_password && (
              <p className="text-xs text-red-500 font-normal mt-[2px] ml-2">
                {errors.confirm_password?.message}
              </p>
            )}
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end items-center space-x-4 sm:col-span-2 mt-4">
            <button
              type="button"
              onClick={() => setShowCoorporateStudentListing(true)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-200 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-green-500 focus:outline-none"
              disabled={loading}
            >
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCoorporateStudentForm;
