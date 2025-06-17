"use client";
import React, { useState } from "react";
import usePostQuery from "@/hooks/postQuery.hook";
import { useForm } from "react-hook-form";
import { apiUrls } from "@/apis";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import Preloader from "@/components/shared/others/Preloader";
import CoorporateAdminTable from "./CoorporateAdmin_Table";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// Validation Schema
const schema = yup.object({
  full_name: yup.string().required("Full name is required"),
  email: yup
    .string()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|in)$/,
      "Please enter a valid email"
    ),
  phone_number: yup
    .string()
    .required("Phone number is required")
    .matches(/^[6-9]\d{9}$/, "Phone number must be a valid 10-digit number"),
  password: yup
    .string()
    .min(8, "At least 8 characters required")
    .required("Password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  company_type: yup.string().required("Company type is required"),
  country: yup.string().required("Country is required"),
  company_website: yup
    .string()
    .url("Must be a valid URL")
    .required("Company website is required"),
});

const AddCoorporate_Admin = () => {
  const { postQuery, loading } = usePostQuery();
  const [pdfBrochures, setPdfBrochures] = useState([]);
  const [showCoorporateListing, setShowCoorporateListing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorPdf, setErrorPdf] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const removePdf = (index) => {
    setPdfBrochures((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handlePdfUpload = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      try {
        const updatedPdfs = [...pdfBrochures];
        for (const file of files) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = async () => {
            const base64 = reader.result;
            const postData = { base64String: base64 };

            await postQuery({
              url: apiUrls?.upload?.uploadDocument,
              postData,
              onSuccess: (data) => {
                console.log("PDF uploaded successfully:", data?.data);
                updatedPdfs.push(data?.data);
                setPdfBrochures([...updatedPdfs]);
                setErrorPdf(false);
              },
              onError: (error) => {
                toast.error("PDF upload failed. Please try again.");
                console.error("Upload error:", error);
              },
            });
          };
        }
      } catch (error) {
        console.error("Error uploading PDF:", error);
      }
    }
  };

  const handleChange = (value) => {
    setSelectedCategory(value);
  };

  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const onSubmit = async (data) => {
    try {
      await postQuery({
        url: apiUrls.Coorporate.createCoorporate,
        postData: {
          full_name: data.full_name,
          email: data.email,
          phone_number: data.phone_number,
          password: data.password,
          company_type: data.company_type,
          country: data.country,
          company_website: data.company_website,
          meta: {
            upload_resume: pdfBrochures.length > 0 ? pdfBrochures : [],
          },
        },
        onSuccess: () => {
          setShowCoorporateListing(true);
          showToast.success("Corporate user added successfully!");
          reset();
        },
        onError: () => {
          toast.error(
            "Corporate user already exists with the same email or phone."
          );
        },
      });
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  if (showCoorporateListing) {
    return (
      <CoorporateAdminTable onCancel={() => setShowCoorporateListing(false)} />
    );
  }

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="flex items-start justify-center w-full dark:bg-inherit dark:text-white bg-gray-100 p-4 pt-9">
      <div className="w-[95%] mx-auto p-6 dark:bg-inherit dark:text-white dark:border bg-white rounded-lg shadow-md font-Poppins">
        <h2 className="text-2xl font-semibold mb-6">Add Corporate</h2>
        {/* Select Category */}
        <div className="mb-6">
          <div className="flex items-center gap-7 mb-2">
            <label className="block text-[#323232] font-semibold text-sm dark:text-white">
              Select Company Type
              <span className="text-red-500 ml-1">*</span>
            </label>
            <label
              className={`flex text-lg font-medium items-center space-x-2 ${
                selectedCategory === "Institute"
                  ? "text-green-500"
                  : "text-[#808080]"
              }`}
            >
              <input
                type="radio"
                name="company_type"
                value="Institute"
                onChange={() => handleChange("Institute")}
                {...register("company_type")}
              />
              <span className="block text-sm font-normal">Institue</span>
            </label>
            <label
              className={`flex text-lg font-medium items-center space-x-2 ${
                selectedCategory === "University"
                  ? "text-green-500"
                  : "text-[#808080]"
              }`}
            >
              <input
                type="radio"
                name="company_type"
                value="University"
                onChange={() => handleChange("Corporate Training Courses")}
                {...register("company_type")}
              />
              <span className="block text-sm font-normal">University</span>
            </label>
          </div>
          {errors.company_type && (
            <p className="text-red-500 text-xs">
              {errors.company_type.message}
            </p>
          )}
        </div>
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
              {selectedCategory || "Company"} Name
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="full_name"
                placeholder="Enter your company name"
                className="w-full border border-gray-300 dark:bg-inherit rounded-md py-2 pl-2 pr-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                {...register("full_name")}
              />
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
              Official Mobile Number
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
              Official Email
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 dark:bg-inherit rounded-md py-2 pl-2 pr-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <span className="text-red-500 text-xs">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="full_name"
              className="text-xs px-2 text-[#808080]  font-medium mb-1"
            >
              Country
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="country"
                placeholder="Country"
                className="w-full border border-gray-300 dark:bg-inherit rounded-md py-2 pl-2 pr-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                {...register("country")}
              />
            </div>
            {errors.country && (
              <span className="text-red-500 text-xs">
                {errors.country.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="full_name"
              className="text-xs px-2 text-[#808080]  font-medium mb-1"
            >
              Company Website
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="company_website"
                placeholder="Company Website"
                className="w-full border border-gray-300 dark:bg-inherit rounded-md py-2 pl-2 pr-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                {...register("company_website")}
              />
            </div>
            {errors.company_website && (
              <span className="text-red-500 text-xs">
                {errors.company_website.message}
              </span>
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

          <br />

          {/* PDF Brochure Upload */}
          <div>
            <p className="font-semibold mb-2 text-left text-2xl">Upload Valid Document (Optional)</p>
            <div className="border-dashed border-2 dark:bg-inherit bg-purple border-gray-300 rounded-lg p-3 w-[300px] h-[140px] text-center relative">
              <svg
                width="36"
                height="36"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mt-2 mx-auto"
              >
                <path
                  d="M8 40C6.9 40 5.95867 39.6087 5.176 38.826C4.39333 38.0433 4.00133 37.1013 4 36V22C4.86667 22.6667 5.81667 23.1667 6.85 23.5C7.88333 23.8333 8.93333 24 10 24C12.7667 24 15.1253 23.0247 17.076 21.074C19.0267 19.1233 20.0013 16.7653 20 14C20 12.9333 19.8333 11.8833 19.5 10.85C19.1667 9.81667 18.6667 8.86667 18 8H32C33.1 8 34.042 8.392 34.826 9.176C35.61 9.96 36.0013 10.9013 36 12V21L44 13V35L36 27V36C36 37.1 35.6087 38.042 34.826 38.826C34.0433 39.61 33.1013 40.0013 32 40H8ZM8 20V16H4V12H8V8H12V12H16V16H12V20H8ZM10 32H30L23.25 23L18 30L14.75 25.65L10 32Z"
                  fill="#808080"
                />
              </svg>
              <p className="text-customGreen cursor-pointer text-sm">
                Click to upload
              </p>
              <p className="text-gray-400 text-xs">or drag & drop the files (optional)</p>
              <input
                type="file"
                multiple
                accept=".pdf"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handlePdfUpload}
              />
              <div className="w-[210px] text-center relative">
                {pdfBrochures.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {pdfBrochures.map((fileUrl, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-[#e9e9e9] p-2 rounded-md text-sm w-full md:w-auto"
                      >
                        <span className="truncate text-[#5C5C5C] max-w-[150px]">
                          Document Uploaded Successfully
                        </span>
                        <button
                          onClick={() => removePdf(index)}
                          className="ml-2 text-[20px] text-[#5C5C5C] hover:text-red-700"
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end items-center space-x-4 sm:col-span-2 mt-4">
            <button
              type="button"
              onClick={() => setShowCoorporateListing(true)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-200 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-green-500 focus:outline-none"
              disabled={loading}
            >
              Add Corporate Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCoorporate_Admin;
