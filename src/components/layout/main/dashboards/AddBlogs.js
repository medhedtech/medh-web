"use client";
import React, { useEffect, useState } from "react";
import usePostQuery from "@/hooks/postQuery.hook";
import { useForm } from "react-hook-form";
import { apiUrls } from "@/apis";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import useGetQuery from "@/hooks/getQuery.hook";
import Preloader from "@/components/shared/others/Preloader";
import AdminBlogs from "./AdminBlogs";

// Validation Schema
const schema = yup.object({
  title: yup.string().required("Blog title is required"),
  description: yup.string().required("Description is required"),
  upload_image: yup.string().required("Please upload image"),
});

const AddBlog = () => {
  const { postQuery, loading } = usePostQuery();
  const { getQuery } = useGetQuery();
  const [blogs, setBlogs] = useState([]);
  const [blogImage, setBlogImage] = useState(null);
  const [showAddBlogListing, setShowAddBlogListing] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchCourseNames = async () => {
      try {
        await getQuery({
          url: apiUrls?.courses?.getCourseNames,
          onSuccess: (data) => {
            setBlogs(data || []);
          },
          onFail: (err) => {
            console.error(
              "API error:",
              err instanceof Error ? err.message : err
            );
          },
        });
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      }
    };

    fetchCourseNames();
  }, []);

  // const handleImageUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     try {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file);
  //       reader.onload = async () => {
  //         const base64 = reader.result.split(",")[1];
  //         const postData = { base64String: base64, fileType: "image" };

  //         await postQuery({
  //           url: apiUrls?.upload?.uploadImage,
  //           postData,
  //           onSuccess: (data) => {
  //             setBlogImage(data?.data);
  //             setValue("upload_image", data?.data);
  //             console.log("Image uploaded successfully:", data?.data);
  //           },
  //           onError: (error) => {
  //             toast.error("Image upload failed. Please try again.");
  //             console.error("Upload error:", error);
  //           },
  //         });
  //       };
  //     } catch (error) {
  //       console.error("Error uploading Image:", error);
  //     }
  //   }
  // };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const requiredWidth = 500;
    const requiredHeight = 300;

    if (file) {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const image = new Image();
          image.src = reader.result;
          image.onload = async () => {
            // Check image dimensions
            if (
              image.width === requiredWidth &&
              image.height === requiredHeight
            ) {
              const base64 = reader.result.split(",")[1];
              const postData = { base64String: base64, fileType: "image" };

              await postQuery({
                url: apiUrls?.upload?.uploadImage,
                postData,
                onSuccess: (data) => {
                  setBlogImage(data?.data);
                  setValue("upload_image", data?.data);
                  console.log("Image uploaded successfully:", data?.data);
                },
                onError: (error) => {
                  toast.error("Image upload failed. Please try again.");
                  console.error("Upload error:", error);
                },
              });
            } else {
              toast.error(
                `Invalid image dimensions! Required: ${requiredWidth}x${requiredHeight}px.`
              );
            }
          };
        };
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("An unexpected error occurred while uploading the image.");
      }
    }
  };

  const onSubmit = async (data) => {
    console.log("Data before submitting:", data);
    try {
      await postQuery({
        url: apiUrls?.Blogs?.createBlog,
        postData: {
          title: data.title,
          description: data.description,
          upload_image: blogImage || data.upload_image,
        },
        onSuccess: () => {
          toast.success("Blog added successfully!");
          reset();
          setShowAddBlogListing(true);
        },
        onFail: () => {
          toast.error("Error adding blog.");
        },
      });
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  if (showAddBlogListing) {
    return <AdminBlogs onCancel={() => setShowAddBlogListing(false)} />;
  }

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="flex items-start dark:bg-inherit dark:text-white justify-center w-full bg-gray-100 p-4 pt-9">
      <div className="w-[95%] mx-auto dark:bg-inherit dark:text-white p-6 bg-white rounded-lg shadow-md dark:shadow-white font-Poppins">
        <h2 className="text-2xl font-semibold mb-6">Add Blog</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* Title Field */}
          <div className="flex flex-col">
            <label
              htmlFor="title"
              className="text-xs px-2 text-[#808080] font-medium mb-1"
            >
              Blog Title
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter Title"
              className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              {...register("title")}
            />
            {errors.title && (
              <span className="text-red-500 text-xs">
                {errors.title.message}
              </span>
            )}
          </div>

          {/* Description Field */}
          <div className="flex flex-col">
            <label
              htmlFor="description"
              className="text-xs px-2 text-[#808080] font-medium mb-1"
            >
              Description
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              id="description"
              placeholder="Enter Description"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              {...register("description")}
            />
            {errors.description && (
              <span className="text-red-500 text-xs">
                {errors.description.message}
              </span>
            )}
          </div>

          {/* Image Upload Field */}
          <div>
            <p className="text-xs px-2 text-[#808080] font-medium mb-1">
              Upload Blog Image
              <span className="text-red-500 ml-1">*</span>{" "}
              <span className="text-gray-500">
                (Recommended: 500x300 pixels)
              </span>
            </p>
            <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 w-[300px] h-[180px] flex flex-col justify-center items-center relative bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-50 hover:to-gray-100 transition duration-300 shadow-md hover:shadow-lg">
              {/* Icon */}
              <div className="bg-primaryColor bg-opacity-10 p-3 rounded-full">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-primaryColor mx-auto"
                >
                  <path
                    d="M8 40C6.9 40 5.95867 39.6087 5.176 38.826C4.39333 38.0433 4.00133 37.1013 4 36V22C4.86667 22.6667 5.81667 23.1667 6.85 23.5C7.88333 23.8333 8.93333 24 10 24C12.7667 24 15.1253 23.0247 17.076 21.074C19.0267 19.1233 20.0013 16.7653 20 14C20 12.9333 19.8333 11.8833 19.5 10.85C19.1667 9.81667 18.6667 8.86667 18 8H32C33.1 8 34.042 8.392 34.826 9.176C35.61 9.96 36.0013 10.9013 36 12V21L44 13V35L36 27V36C36 37.1 35.6087 38.042 34.826 38.826C34.0433 39.61 33.1013 40.0013 32 40H8ZM8 20V16H4V12H8V8H12V12H16V16H12V20H8ZM10 32H30L23.25 23L18 30L14.75 25.65L10 32Z"
                    fill="#4CAF50"
                  />
                </svg>
              </div>

              {/* Text */}
              <div className="mt-4 text-center">
                <p className="text-lg font-semibold text-gray-700 cursor-pointer hover:text-primaryColor">
                  Click to upload
                </p>
                <p className="text-sm text-gray-500">or drag & drop</p>
                <p className="text-sm text-gray-400 mt-1">
                  Accepted size:{" "}
                  <span className="font-normal text-gray-500">500x300</span>
                </p>
              </div>

              {/* File Input */}
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
              onClick={() => setShowAddBlogListing(true)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-200 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-green-500 focus:outline-none"
            >
              Add Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;
