"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import Preloader from "@/components/shared/others/Preloader";
import useGetQuery from "@/hooks/getQuery.hook";
import Image from "next/image";

// Validation Schema
const schema = yup.object({
  course_category: yup
    .string()
    .oneOf(["Live Courses", "Blended Courses", "Corporate Training Courses"])
    .required("Course category is required"),
  course_title: yup.string().trim().required("Course title is required"),
  category: yup.string(),
  course_tag: yup
    .string()
    .oneOf(["Live", "Hybrid", "Pre-Recorded"])
    .required("Course tag is required"),
  no_of_Sessions: yup
    .number()
    .typeError("Number of sessions must be a number")
    .positive("Number of sessions must be a positive number")
    .required("Number of sessions is required"),
  course_duration: yup.string().required("Course duration is required"),
  // course_duration_value: yup
  //   .number()
  //   .required("Course duration value is required"),
  // course_duration_unit: yup
  //   .string()
  //   .required("Course duration unit is required"),
  // session_duration: yup.string().required("Session duration is required"),
  // session_duration_value: yup.number().required("Session duration value is required"),
  // session_duration_unit: yup.string().required("Session duration unit is required"),
  session_duration: yup
    .string()
    .test(
      "valid-session-duration",
      "Session duration must be a positive number or a valid time format (e.g., 5 Months or 2 Hours)",
      (value) => {
        // Check if it's a positive number
        const isValidNumber = value && !isNaN(value) && Number(value) > 0;

        // Regex to match "X Hours", "X Months", or "X Hours/Month"
        const validTimeFormat =
          /^(\d+(\.\d+)?\s*(Hours?|Months?)|(\d+(\.\d+)?\s*Hours?\/Months?))$/i;

        return isValidNumber || validTimeFormat.test(value);
      }
    )
    .required("Session duration is required"),
  course_description: yup.string().required("Course description is required"),
  course_fee: yup
    .number()
    .typeError("Course fee must be a number")
    .positive("Course fee must be a positive number")
    .required("Course fee is required"),
  course_grade: yup.string().required("Grade is required"),
});

const AddCourse = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [courseVideo, setCourseVideo] = useState(null);
  const [pdfBrochure, setPdfBrochure] = useState(null);
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const { postQuery, loading } = usePostQuery();
  const [courseData, setCourseData] = useState(null);
  const [categories, setCategories] = useState(null);
  const { getQuery } = useGetQuery();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const [courseDurationValue, setCourseDurationValue] = useState();
  const [courseDurationUnit, setCourseDurationUnit] = useState("");
  const [sessionDurationValue, setSessionDurationValue] = useState();
  const [sessionDurationUnit, setSessionDurationUnit] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const storedData = localStorage.getItem("courseData");
    if (storedData) {
      setCourseData(JSON.parse(storedData));
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    fetchAllCategories();
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchAllCategories = () => {
    try {
      getQuery({
        url: apiUrls?.categories?.getAllCategories,
        onSuccess: (res) => {
          setCategories(res.data);
          console.log("All categories", res);
        },
        onFail: (err) => {
          console.error("Failed to fetch categories: ", err);
        },
      });
    } catch (err) {
      console.error("Error fetching categories: ", err);
    }
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    setDropdownOpen((prev) => !prev);
  };

  const selectCategory = (categoryName) => {
    setSelected(categoryName);
    setValue("category", categoryName)
    setDropdownOpen(false);
    setSearchTerm("");
  };

  const filteredCategories = categories?.filter((category) =>
    category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const base64 = reader.result.split(",")[1];
          const postData = { base64String: base64, fileType: "video" };

          await postQuery({
            url: apiUrls?.upload?.uploadMedia,
            postData,
            onSuccess: (data) => {
              setCourseVideo(data?.data);
              setValue("video", data?.data);
              console.log("Video uploaded successfully:", data?.data);
            },
            onError: (error) => {
              toast.error("Video upload failed. Please try again.");
              console.error("Upload error:", error);
            },
          });
        };
      } catch (error) {
        console.error("Error uploading video:", error);
      }
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
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
              console.log("PDF uploaded successfully:", data?.data);
              setPdfBrochure(data?.data);
            },
            onError: (error) => {
              toast.error("PDF upload failed. Please try again.");
              console.error("Upload error:", error);
            },
          });
        };
      } catch (error) {
        console.error("Error uploading PDF:", error);
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const base64 = reader.result.split(",")[1];
          const postData = { base64String: base64, fileType: "image" };

          await postQuery({
            url: apiUrls?.upload?.uploadImage,
            postData,
            onSuccess: (data) => {
              setThumbnailImage(data?.data);
              setValue("upload_image", data?.data);
              console.log("Image uploaded successfully:", data?.data);
            },
            onError: (error) => {
              toast.error("Image upload failed. Please try again.");
              console.error("Upload error:", error);
            },
          });
        };
      } catch (error) {
        console.error("Error uploading Image:", error);
      }
    }
  };

  // // Handle form submission
  // const onSubmit = async (data) => {
  //   try {
  //     const postData = {
  //       ...data,
  //       course_videos: courseVideo ? [courseVideo] : [],
  //       brochures: pdfBrochure ? [pdfBrochure] : [],
  //     };

  //     await postQuery({
  //       url: apiUrls?.courses?.createCourse,
  //       postData,
  //       onSuccess: () => {
  //         router.push("/dashboards/admin-add-data");
  //         toast.success("Course added successfully!");
  //       },
  //       onFail: (error) => {
  //         toast.error("Adding course failed. Please try again.");
  //         console.log("Adding course failed:", error);
  //       },
  //     });
  //   } catch (error) {
  //     console.error("An unexpected error occurred:", error);
  //     toast.error("An unexpected error occurred. Please try again.");
  //   }
  // };

  const onSubmit = async (data) => {
    try {
      // Gather form data along with uploaded video and PDF brochure links
      const postData = {
        ...data,
        course_videos: courseVideo ? [courseVideo] : [],
        brochures: pdfBrochure ? [pdfBrochure] : [],
        course_image: thumbnailImage,
      };

      // Save data to localStorage
      localStorage.setItem("courseData", JSON.stringify(postData));

      // Navigate to the preview page
      router.push("/dashboards/admin-add-data");
      toast.success("Course details saved locally!");
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleCourseDuration = (unit) => {
    setCourseDurationUnit(unit)
    setValue("course_duration", `${courseDurationValue} ${unit}`)
  }

  const handleSessionDuration = (unit) => {
    setSessionDurationUnit(unit)
    setValue("session_duration", `${sessionDurationValue} ${unit}`)
  }

  useEffect(() => {
    if (courseData) {
      reset(courseData);
    }
  }, [courseData, reset]);

  const handleChange = (value) => {
    setSelectedCategory(value);
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="min-h-screen font-Poppins flex items-center justify-center pt-8  dark:bg-inherit dark:text-whitegrey3  bg-gray-100">
      <div className="bg-white p-8 rounded-lg  dark:bg-inherit dark:text-whitegrey3 dark:border shadow-lg w-full max-w-6xl">
        <h2 className="text-2xl font-semibold mb-6">Add Course Details</h2>

        {/* Select Category */}
        <div className="mb-6">
          <div className="flex items-center gap-7 mb-2">
            <label className="block text-[#323232] font-semibold text-xl dark:text-white">
              Select Category
            </label>
            <label
              className={`flex text-lg font-medium items-center space-x-2 ${
                selectedCategory === "Live Courses"
                  ? "text-green-500"
                  : "text-[#808080]"
              }`}
            >
              <input
                type="radio"
                name="course_category"
                value="Live Courses"
                onChange={() => handleChange("Live Courses")}
                {...register("course_category")}
              />
              <span>Live Courses</span>
            </label>
            <label
              className={`flex text-lg font-medium items-center space-x-2 ${
                selectedCategory === "Blended Courses"
                  ? "text-green-500"
                  : "text-[#808080]"
              }`}
            >
              <input
                type="radio"
                name="course_category"
                value="Blended Courses"
                onChange={() => handleChange("Blended Courses")}
                {...register("course_category")}
              />
              <span>Blended Courses</span>
            </label>
            <label
              className={`flex text-lg font-medium items-center space-x-2 ${
                selectedCategory === "Corporate Training Courses"
                  ? "text-green-500"
                  : "text-[#808080]"
              }`}
            >
              <input
                type="radio"
                name="course_category"
                value="Corporate Training Courses"
                onChange={() => handleChange("Corporate Training Courses")}
                {...register("course_category")}
              />
              <span>Corporate Training Courses</span>
            </label>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-[#808080]">
            <div>
              <label className="block text-sm px-2 font-semibold mb-1">
                Course Title
              </label>
              <input
                type="text"
                placeholder="Enter title"
                className="p-3 border rounded-lg w-full text-[#808080] dark:bg-inherit placeholder-gray-400"
                {...register("course_title")}
              />
              {errors.course_title && (
                <p className="text-red-500 text-xs">
                  {errors.course_title.message}
                </p>
              )}
            </div>
            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm px-2 font-semibold mb-1">
                Course Category
              </label>
              <div className="p-3 border rounded-lg w-full dark:bg-inherit text-gray-600">
                <button className="w-full text-left" onClick={toggleDropdown}>
                  {selected || "Select type"}
                </button>
                {dropdownOpen && (
                  <div className="absolute z-10 left-0 top-20 bg-white border border-gray-600 rounded-lg w-full shadow-xl">
                    <input
                      type="text"
                      className="w-full p-2 border-b focus:outline-none rounded-lg"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <ul className="max-h-56 overflow-auto">
                      {filteredCategories.length > 0 ? (
                        filteredCategories.map((category) => (
                          <li
                            key={category._id}
                            className=" hover:bg-gray-100 rounded-lg cursor-pointer flex gap-3 px-3 py-3"
                            onClick={() =>
                              selectCategory(category.category_name)
                            }
                          >
                            <Image
                              src={category.category_image}
                              alt={category.category_title}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                            {category.category_name}
                          </li>
                        ))
                      ) : (
                        <li className="p-2 text-gray-500">No results found</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm px-2  font-semibold mb-1">
                Category Type (Live/ Hybrid/ Pre-Recorded)
              </label>
              <select
                className="p-3 border rounded-lg w-full dark:bg-inherit text-gray-600"
                {...register("course_tag")}
              >
                <option value="">Select type</option>
                <option value="Live">Live</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Pre-Recorded">Pre-Recorded</option>
              </select>
              {errors.course_tag && (
                <p className="text-red-500 text-xs">
                  {errors.course_tag.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm px-2 font-semibold mb-1">
                No. of Sessions
              </label>
              <input
                type="number"
                placeholder="Enter sessions"
                className="p-3 border rounded-lg w-full text-gray-600 dark:bg-inherit placeholder-gray-400"
                {...register("no_of_Sessions")}
              />
              {errors.no_of_Sessions && (
                <p className="text-red-500 text-xs">
                  {errors.no_of_Sessions.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm px-2 font-semibold mb-1">
                Duration (In months/weeks)
              </label>
              <div className="flex items-center gap-2">
                
                <input
                  type="number"
                  className="p-3 border rounded-lg w-1/2 dark:bg-inherit text-gray-600"
                  placeholder="Enter duration"
                  value={courseDurationValue}
                  onChange={(e)=>setCourseDurationValue(e.target.value)}
                />
                
                <div className="flex gap-4 items-center">
                  <label
                    className={`flex items-center gap-1 cursor-pointer p-2 border rounded-lg ${
                      courseDurationUnit === "Weeks"
                        ? "bg-[#3B82F6] text-white"
                        : "hover:bg-gray-100 dark:bg-inherit dark:border-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      className="hidden"
                      value="Weeks"
                      onClick={(e)=>handleCourseDuration(e.target.value)}
                    />
                    Weeks
                  </label>
                  <label
                    className={`flex items-center gap-1 cursor-pointer p-2 border rounded-lg ${
                      courseDurationUnit === "Months"
                        ? "bg-[#3B82F6] text-white"
                        : "hover:bg-gray-100 dark:bg-inherit dark:border-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      value="Months"
                      className="hidden"
                      onClick={(e)=>handleCourseDuration(e.target.value)}
                    />
                    Months
                  </label>
                </div>
              </div> 
              {/* Error messages */}
              {errors.course_duration && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.course_duration.message}
                </p>
              )}
              
            </div>

            <div>
              <label className="block text-sm px-2 font-semibold mb-1">
                Session Duration
              </label>
              <div className="flex items-center gap-2">
                {/* Numeric input for session duration */}
                <input
                  type="number"
                  placeholder="Enter duration"
                  className="p-3 border rounded-lg w-1/2 text-gray-600 dark:bg-inherit placeholder-gray-400"
                  value={sessionDurationValue}
                  onChange={(e)=>setSessionDurationValue(e.target.value)}
                />
                {/* Radio buttons for selecting Hours or Minutes */}
                <div className="flex gap-4 items-center">
                  <label
                    className={`flex items-center gap-1 cursor-pointer p-2 border rounded-lg ${
                      sessionDurationUnit === "Minutes"
                        ? "bg-[#3B82F6] text-white"
                        : "hover:bg-gray-100 dark:bg-inherit dark:border-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      value="Minutes"
                      className="hidden"
                      onClick={(e)=>handleSessionDuration(e.target.value)}
                    />
                    Minutes
                  </label>
                  <label
                    className={`flex items-center gap-1 cursor-pointer p-2 border rounded-lg ${
                      sessionDurationUnit === "Hours"
                        ? "bg-[#3B82F6] text-white"
                        : "hover:bg-gray-100 dark:bg-inherit dark:border-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      value="Hours"
                      className="hidden"
                      onClick={(e) => handleSessionDuration(e.target.value)}
                    />
                    Hours
                  </label>
                </div>
              </div>
              {/* Error messages */}
              {errors.session_duration && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.session_duration.message}
                </p>
              )}
              
            </div>

            <div>
              <label className="block text-sm px-2 font-semibold mb-1">
                Course Description
              </label>
              <input
                type="text"
                placeholder="Write description"
                className="p-3 border rounded-lg w-full text-gray-600 dark:bg-inherit placeholder-gray-400"
                {...register("course_description")}
              />
              {errors.course_description && (
                <p className="text-red-500 text-xs">
                  {errors.course_description.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm px-2 font-semibold mb-1">
                Course Fee (USD)
              </label>
              <input
                type="text"
                placeholder="Enter amount in USD"
                className="p-3 border rounded-lg w-full text-gray-600 dark:bg-inherit placeholder-gray-400"
                {...register("course_fee")}
              />
              {errors.course_fee && (
                <p className="text-red-500 text-xs">
                  {errors.course_fee.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm px-2 font-semibold mb-1">
                Course Grade
              </label>
              <select
                className="p-3 border rounded-lg w-full dark:bg-inherit text-gray-600"
                {...register("course_grade")}
              >
                <option value="">Select Grade</option>
                <option value="Preschool">Preschool</option>
                <option value="Grade 1-2">Grade 1-2</option>
                <option value="Grade 3-4">Grade 3-4</option>
                <option value="Grade 5-6">Grade 5-6</option>
                <option value="Grade 7-8">Grade 7-8</option>
                <option value="Grade 9-10">Grade 9-10</option>
                <option value="Grade 11-12">Grade 11-12</option>
                <option value="UG - Graduate - Professionals">
                  UG - Graduate - Professionals
                </option>
                <option value="none">None of these</option>
              </select>
              {errors.course_grade && (
                <p className="text-red-500 text-xs">
                  {errors.course_grade.message}
                </p>
              )}
            </div>
          </div>

          {/* Upload Section */}
          <div className="flex flex-wrap gap-24 mb-6 font-Poppins justify-start">
            {/* Course Video Upload */}
            <div>
              <p className="font-semibold mb-2 text-center text-2xl">
                Add Course Videos
              </p>
              <div className="border-dashed border-2 dark:bg-inherit bg-purple border-gray-300 rounded-lg p-3 w-[210px] h-[140px] text-center relative">
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
                <p className="text-gray-400 text-xs">or drag & drop</p>
                <input
                  type="file"
                  accept="video/*"
                  className="absolute inset-0 opacity-0 dark:bg-inherit cursor-pointer"
                  onChange={handleVideoUpload}
                />
                {courseVideo && (
                  <p className="mt-1 text-xs text-gray-500">✔ Uploaded</p>
                )}
              </div>
            </div>

            {/* PDF Brochure Upload */}
            <div>
              <p className="font-semibold mb-2 text-center text-2xl">
                Add PDF Brochure
              </p>
              <div className="border-dashed border-2 dark:bg-inherit bg-purple border-gray-300 rounded-lg p-3 w-[210px] h-[140px] text-center relative">
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
                <p className="text-gray-400 text-xs">or drag & drop the file</p>
                <input
                  type="file"
                  accept=".pdf"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handlePdfUpload}
                />
                {pdfBrochure && (
                  <p className="mt-1 text-xs text-gray-500">✔ Uploaded</p>
                )}
              </div>
            </div>

            {/* Thumbnail Image Upload */}
            <div>
              <p className="font-semibold mb-2 text-left text-2xl">Add Image</p>
              <div className="border-dashed border-2 dark:bg-inherit bg-purple border-gray-300 rounded-lg p-3 w-[210px] h-[140px] text-center relative">
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
                  Click to upload thumbnail
                </p>
                <p className="text-gray-400 text-xs">or drag & drop the file</p>
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageUpload}
                />
                {thumbnailImage && (
                  <p className="mt-1 text-xs text-gray-500">✔ Uploaded</p>
                )}
              </div>
            </div>
          </div>

          {/* Cancel and Continue Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button className="bg-gray-200 text-black py-2 px-4 rounded-lg mt-6">
              Cancel
            </button>
            <button
              className="bg-customGreen text-white py-2 px-4 rounded-lg mt-6"
              // onClick={handleContinueClick}
              type="submit"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
