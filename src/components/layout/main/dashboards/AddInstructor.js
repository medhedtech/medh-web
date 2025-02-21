"use client";
import React, { useEffect, useRef, useState } from "react";
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
import Image from "next/image";
import lock from "@/assets/images/log-sign/lock.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Upload } from "lucide-react";

// Validation Schema
const schema = yup.object({
  full_name: yup.string().required("Instructor name is required"),
  // age: yup.number(),
  age: yup
    .number()
    .typeError("Age must be a number")
    .required("Age is required")
    .min(18, "Age must be above 18 years"),
  phone_number: yup
    .string()
    .required("Mobile number is required")
    .matches(/^[6-9]\d{9}$/, "Mobile number must be a valid 10-digit number"),
  email: yup
    .string()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|in)$/,
      "Please enter a valid email"
    ),
  course_name: yup.string(),
  // domain: yup.string().required("Domain is required"),
  amount_per_session: yup
    .number()
    .typeError("Amount per session must be a number")
    .required("Amount per session is required"),
  category: yup.string().required("This field is required"),
  confirm_password: yup
    .string()
    .oneOf(
      [yup.ref("password"), null],
      "Password and confirm password must match"
    )
    .required("Confirm password is required"),
  password: yup
    .string()
    .min(8, "At least 8 characters required")
    .required("Password is required"),
  gender: yup.string().required("Gender is required"),
});

const AddInstructor = () => {
  const router = useRouter();
  const { postQuery, loading } = usePostQuery();
  const { getQuery } = useGetQuery();
  const [courses, setCourses] = useState([]);
  const [pdfBrochures, setPdfBrochures] = useState([]);
  const [showInstructorListing, setShowInstructorListing] = useState(false);
  const courseDropdownRef = useRef(null);
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [categories, setCategories] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selected, setSelected] = useState("");
  const dropdownRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        courseDropdownRef.current &&
        !courseDropdownRef.current.contains(event.target)
      ) {
        setCourseDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const removePdf = (index) => {
    setPdfBrochures((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    setDropdownOpen((prev) => !prev);
  };

  const selectCategory = (categoryName) => {
    setSelected(categoryName);
    setValue("category", categoryName);
    setDropdownOpen(false);
    setSearchTerm("");
  };

  useEffect(() => {
    if (courseData) {
      reset(courseData);
    }
  }, [courseData, reset]);

  const filteredCategories = categories?.filter((category) =>
    category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCourseDropdown = (e) => {
    e.preventDefault();
    setCourseDropdownOpen((prev) => !prev);
  };

  const selectCourse = (courseName) => {
    setSelectedCourse(courseName);
    setValue("course_name", courseName);
    setCourseDropdownOpen(false);
    setSearchTerm("");
  };

  const filteredCourses = courses?.filter((course) => 
    (course.course_title || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  useEffect(() => {
    const fetchCourseNames = async () => {
      try {
        await getQuery({
          url: apiUrls?.courses?.getAllCourses,
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
                updatedPdfs.push(data?.data); // Append to the array
                setPdfBrochures([...updatedPdfs]); // Update the state
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

  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);
  // Handle form submission
  const onSubmit = async (data) => {
    try {
      await postQuery({
        url: apiUrls?.Instructor?.createInstructor,
        postData: {
          full_name: data.full_name,
          email: data.email,
          phone_number: data.phone_number,
          password: data?.password,
          // domain: data.domain,
          meta: {
            course_name: data.course_name,
            age: data.age,
            category: data.category,
            gender: data.gender,
            upload_resume: pdfBrochures.length > 0 ? pdfBrochures : [],
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

          {/* <div className="flex flex-col">
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
          </div> */}

          <div className="relative mt-[-8px]" ref={dropdownRef}>
            <label
              htmlFor="category"
              className="text-xs px-2 text-[#808080]  font-medium mb-1"
            >
              Course Category <span className="text-red-500">*</span>
            </label>

            {/* <div className="p-3 border rounded-lg w-full dark:bg-inherit text-gray-600"> */}
            <div className="w-full border border-gray-300 dark:bg-inherit rounded-md py-2 px-3 pr-3 focus:outline-none focus:ring-2 focus:ring-green-400">
              <button className="w-full text-left" onClick={toggleDropdown}>
                {selected || "Select Category"}
              </button>
              {dropdownOpen && (
                <div className="absolute z-10 left-0 top-20 bg-white border border-gray-400 rounded-lg w-full shadow-xl">
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
                          className="hover:bg-gray-100 rounded-lg cursor-pointer flex gap-3 px-3 py-3"
                          onClick={() => {
                            selectCategory(category.category_name);
                            trigger("category");
                          }}
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
            {errors.category && (
              <p className="text-red-500 text-xs">{errors.category.message}</p>
            )}
          </div>

          <div className="relative -mt-2" ref={courseDropdownRef}>
            <label
              htmlFor="course_name"
              className="text-xs px-2 text-[#808080] font-medium mb-1"
            >
              Course Name <span className="text-red-500">*</span>
            </label>
            <div className="w-full border border-gray-300 dark:bg-inherit rounded-md py-2 px-3 pr-3 focus:outline-none focus:ring-2 focus:ring-green-400">
              <button
                className="w-full text-left"
                onClick={toggleCourseDropdown}
              >
                {selectedCourse || "Select Course"}
              </button>
              {courseDropdownOpen && (
                <div className="absolute z-10 left-0 top-20 bg-white border border-gray-400 rounded-lg w-full shadow-xl">
                  <input
                    type="text"
                    className="w-full p-2 border-b focus:outline-none rounded-lg"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <ul className="max-h-56 overflow-auto">
                    {filteredCourses.length > 0 ? (
                      filteredCourses.map((course) => (
                        <li
                          key={course._id}
                          className="hover:bg-gray-100 rounded-lg cursor-pointer flex items-center gap-3 px-3 py-3"
                          onClick={() => {
                            selectCourse(course.course_title);
                          }}
                        >
                          {course.course_image ? (
                            <Image
                              src={course.course_image}
                              alt={course.course_title || "Course Image"}
                              width={32}
                              height={32}
                              className="rounded-full min-h-8 max-h-8 min-w-8 max-w-8"
                            />
                          ) : (
                            <div className="rounded-full w-8 h-8 bg-customGreen"></div>
                          )}
                          <span>
                            {course.course_title || "No title available"}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="p-2 text-gray-500">No courses found</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs px-2 text-[#808080] font-medium mb-1">
              Amount Per Session
              <span className="text-red-500 ml-1">*</span> (USD)
            </label>
            <input
              type="text"
              placeholder="Enter amount in USD"
              className="w-full border border-gray-300 dark:bg-inherit rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              {...register("amount_per_session")}
            />
            {errors.amount_per_session && (
              <p className="text-red-500 text-xs">
                {errors.amount_per_session.message}
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

          <div className="relative">
            <label className="text-xs px-2 text-[#808080]  font-medium mb-1">
              Select Gender
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              {...register("gender")}
              name="gender"
              className="mt-1 block w-full mt-[-2px] border dark:text-whitegrey1 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 dark:bg-inherit focus:ring-indigo-500"
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

          {/* PDF Brochure Upload */}
          <div className="space-y-2">
            <p className="text-sm text-gray-700 font-medium">Upload Valid Document</p>
            <div className="border-dashed border-2 dark:bg-inherit bg-purple border-gray-300 rounded-lg p-3 w-[210px] h-[140px] text-center relative">
              <svg
                width="36"
                height="36"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mt-2 mx-auto"
              >
                {/* ... existing svg path ... */}
              </svg>
              <p className="text-customGreen cursor-pointer text-sm">
                Click to upload
              </p>
              <p className="text-gray-400 text-xs">PDF only (optional)</p>
              <input
                type="file"
                multiple
                accept=".pdf"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handlePdfUpload}
              />
              {pdfBrochures && pdfBrochures.length > 0 && (
                <p className="mt-1 text-xs text-gray-500">✔ Uploaded</p>
              )}
            </div>
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
