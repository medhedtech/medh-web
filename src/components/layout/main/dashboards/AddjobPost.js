"use client";
import React, { useState, useEffect } from "react";
import usePostQuery from "@/hooks/postQuery.hook";
import { useForm } from "react-hook-form";
import { apiUrls } from "@/apis";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import Preloader from "@/components/shared/others/Preloader";
import AdminJobAplicants from "./AdminJobApplicants";

// Validation Schema
const schema = yup.object({
  title: yup.string().required("Post title is required"),
  description: yup.string().required("Post description is required"),
});

const AddJobPost = () => {
  const { postQuery, loading } = usePostQuery();
  const [showAddPostListing, setShowAddPostListing] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await postQuery({
        url: apiUrls?.jobForm?.addNewJobPost,
        postData: {
          title: data.title,
          description: data.description,
        },
        onSuccess: () => {
          showToast.success("Post added successfully!");
          reset(); // Reset the form
          setShowAddPostListing(true); // Update state to navigate to listing page
        },
        onFail: () => {
          toast.error("Error adding post.");
        },
      });
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  useEffect(() => {
    // Automatically navigate to the listing page when the state changes
    if (showAddPostListing) {
      // Add any logic if needed before navigation
    }
  }, [showAddPostListing]);

  if (showAddPostListing) {
    return <AdminJobAplicants onCancel={() => setShowAddPostListing(false)} />;
  }

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="flex items-start dark:bg-inherit dark:text-white justify-center w-full bg-gray-100 p-4 pt-9">
      <div className="w-[95%] mx-auto dark:bg-inherit dark:text-white p-6 bg-white rounded-lg shadow-md dark:shadow-white font-Poppins">
        <h2 className="text-2xl font-semibold mb-6">Create New Job Post</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Title Field */}
          <div className="flex flex-col w-[50%]">
            <label
              htmlFor="title"
              className="text-xs text-[#808080] font-medium mb-1"
            >
              Title
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter Job Title"
              className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              {...register("title")}
            />
            {errors.title && (
              <span className="text-red-500 text-xs">
                {errors.title.message}
              </span>
            )}
          </div>

          {/* Description Field */}
          <div className="flex mt-8 flex-col w-[50%]">
            <label
              htmlFor="description"
              className="text-xs text-[#808080] font-medium mb-1"
            >
              Description
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              id="description"
              placeholder="Enter Job Description"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              {...register("description")}
              rows={10}
            />
            {errors.description && (
              <span className="text-red-500 text-xs">
                {errors.description.message}
              </span>
            )}
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-start items-center space-x-4 sm:col-span-2 mt-8">
            <button
              type="button"
              onClick={() => setShowAddPostListing(true)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-200 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-green-500 focus:outline-none"
            >
              Publish Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobPost;