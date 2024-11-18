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
import CategoriesManage from "./CateogiresManage";

// Validation Schema
const schema = yup.object({
  full_name: yup.string().required("Instructor name is required"),
  age: yup.number(),
  phone_number: yup.string().required("Mobile number is required"),
  email: yup.string().email().required("Email is required"),
  course_name: yup.string(),
  domain: yup.string().required("Domain is required"),
});

const AddCategories = () => {
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
    return (
      <CategoriesManage onCancel={() => setShowInstructorListing(false)} />
    );
  }

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="flex items-start justify-center w-full dark:bg-inherit dark:text-white bg-gray-100 p-4 pt-9">
      <div className="w-[95%] mx-auto p-6 dark:bg-inherit dark:text-white dark:border bg-white rounded-lg shadow-md font-Poppins">
        <h2 className="text-2xl font-semibold mb-6">Add Category</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* Category Name Field */}
          <div className="flex flex-col">
            <label
              htmlFor="category_name"
              className="text-xs px-2 text-[#808080] font-medium mb-1"
            >
              Category Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="category_name"
                placeholder="Category Name"
                className="w-full border border-gray-300 dark:bg-inherit rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                {...register("category_name")}
              />
            </div>
            {errors.category_name && (
              <span className="text-red-500 text-xs">
                {errors.category_name.message}
              </span>
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
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategories;
