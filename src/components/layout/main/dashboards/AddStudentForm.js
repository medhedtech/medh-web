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
import UsersTableStudent from "./StudentManagement";

// Validation Schema
const schema = yup.object({
  full_name: yup.string().required("Student name is required"),
  // age: yup.number().required("Age is required"),
  age: yup
    .number()
    .typeError("Age must be a number")
    .required("Age is required")
    .min(13, "Age must be above 13 years"),
  email: yup.string().email().required("Email is required"),
  course_name: yup.string().required("Course name is required"),
});

const AddStudentForm = () => {
  const { postQuery, loading } = usePostQuery();
  const [showStudentListing, setShowStudentListing] = useState(false);
  const { getQuery } = useGetQuery();
  const [studentImage, setStudentImage] = useState(null);
  const [courses, setCourses] = useState([]);
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
              setStudentImage(data?.data);
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

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      await postQuery({
        url: apiUrls?.Students?.createStudent,
        postData: {
          full_name: data.full_name,
          age: data.age,
          email: data.email,
          course_name: data.course_name,
          upload_image: studentImage || data.upload_image,
        },
        onSuccess: () => {
          setShowStudentListing(true);
          toast.success("Student added successfully!");
          reset();
        },
        onFail: () => {
          toast.error("Error adding student.");
        },
      });
    } catch (error) {
      toast.error("User Alredy exists with same email.");
    }
  };

  if (showStudentListing) {
    return <UsersTableStudent onCancel={() => setShowStudentListing(false)} />;
  }

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="flex items-start justify-center w-full bg-gray-100 p-4 pt-9">
      <div className="w-[95%] mx-auto p-6 bg-white rounded-lg shadow-md font-Poppins">
        <h2 className="text-2xl font-semibold mb-6">Add Student</h2>
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

          {/* Age Field */}
          <div className="flex flex-col">
            <label
              htmlFor="age"
              className="text-xs px-2 text-[#808080] font-medium mb-1"
            >
              Age
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
          </div>

          {/* Email Field */}
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-xs px-2 text-[#808080] font-medium mb-1"
            >
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder="enteremail@gmail.com"
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
              className="w-full p-2 border rounded-lg text-gray-600"
            >
              <option value="">Select Course</option>
              {courses.map((course, index) => (
                <option key={index} value={course.course_title}>
                  {course.course_title}
                </option>
              ))}
            </select>

            {errors.course_name && (
              <p className="text-red-500 text-xs">
                {errors.course_name.message}
              </p>
            )}
          </div>

          <div>
            <p className="text-xs px-2 text-[#808080] font-medium mb-1">
              Add Image
            </p>
            <div className="border-dashed border-2 bg-purple border-gray-300 rounded-lg p-3 w-[210px] h-[140px] text-center relative">
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
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end items-center space-x-4 sm:col-span-2 mt-4">
            <button
              type="button"
              onClick={() => setShowStudentListing(true)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-200 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-green-500 focus:outline-none"
              disabled={loading}
            >
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentForm;
