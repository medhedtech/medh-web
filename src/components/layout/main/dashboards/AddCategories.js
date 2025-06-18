"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import usePostQuery from "@/hooks/postQuery.hook";
import { useForm } from "react-hook-form";
import { apiUrls } from "@/apis";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useGetQuery from "@/hooks/getQuery.hook";
import Preloader from "@/components/shared/others/Preloader";
import CategoriesManage from "./CateogiresManage";

// Validation Schema
const schema = yup.object({
  name: yup.string().required("Category name is required"),
});

const AddCategories = ({ selectedCategory }) => {
  const router = useRouter();
  const { postQuery, loading } = usePostQuery();
  const { getQuery } = useGetQuery();
  const [categories, setCategories] = useState([]);
  const [categoryImage, setCategoryImage] = useState(null);
  const [showCategoryListing, setShowCategoryListing] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(()=>{
    if(selectedCategory){
      setValue('name', selectedCategory.name);
      setCategoryImage(selectedCategory.image)
    }
  })

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const base64 = reader.result;
          const postData = { base64String: base64, fileType: "image" };

          await postQuery({
            url: apiUrls?.upload?.uploadImage,
            postData,
            onSuccess: (data) => {
              setCategoryImage(data?.data);
              setValue("upload_image", data?.data);
              console.log("Image uploaded successfully:", data?.data);
            },
            onError: (error) => {
              showToast.error("Image upload failed. Please try again.");
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
    if (selectedCategory) {
      try {
        await postQuery({
          url: `${apiUrls?.categories?.updateCategories}/${selectedCategory.id}`,
          postData: {
            category_name: data.name,
            category_image: categoryImage || selectedCategory.image,
          },
          headers: {
            "Content-Type": "application/json",
          },
          onSuccess: () => {
            setShowCategoryListing(true);
            showToast.success("Category updated successfully!");
            reset();
          },
          onFail: (error) => {
            console.error("Update error:", error);
            showToast.error(error?.message || "Category update error.");
          },
        });
      } catch (error) {
        console.error("An unexpected error occurred:", error);
        showToast.error("An unexpected error occurred. Please try again.");
      }
    } else {
      console.log("Submitting:", data);
      try {
        await postQuery({
          url: apiUrls?.categories?.createCategories,
          postData: {
            category_name: data.name,
            category_image: categoryImage,
          },
          headers: {
            "Content-Type": "application/json",
          },
          onSuccess: () => {
            setShowCategoryListing(true);
            showToast.success("Category added successfully!");
            reset();
          },
          onFail: (error) => {
            console.error("Post error:", error);
            showToast.error(error?.message || "Category already exists.");
          },
        });
      } catch (error) {
        console.error("An unexpected error occurred:", error);
        showToast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  if (showCategoryListing) {
    return <CategoriesManage onCancel={() => setShowCategoryListing(false)} />;
  }

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="flex items-start justify-center w-full dark:bg-inherit dark:text-white bg-gray-100 p-4 pt-9">
      <div className="w-[95%] mx-auto p-6 dark:bg-inherit dark:text-white dark:border bg-white rounded-lg shadow-md font-Poppins">
        <h2 className="text-2xl font-semibold mb-6">{selectedCategory?'Update':'Add'} Category</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          {/* Category Name Field */}
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="text-xs px-2 text-[#808080] font-medium mb-1"
            >
              Category Name
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative w-1/2">
              <input
                type="text"
                id="name"
                placeholder="Category Name"
                className="w-full border border-gray-300 dark:bg-inherit rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                {...register("name")}
              />
            </div>
            {errors.name && (
              <span className="text-red-500 text-xs">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Upload Image Section */}
          <div className="flex items-center gap-8 flex-col sm:flex-row">
            <div>
              <p className="text-xs px-2 text-[#808080] font-medium mb-1">
                Upload Category Image
                {/* <span className="text-red-500 ml-1">*</span> */}
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
            {/* Image Preview */}
            {categoryImage && (
              <div className="">
                <p className="text-xs px-2 text-[#808080] font-medium mb-1">
                  Image Preview
                </p>
                <img
                  src={categoryImage}
                  alt="Uploaded Category"
                  className=" rounded-lg border w-[210px] h-[140px] object-cover"
                />
              </div>
            )}
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end items-center space-x-4 sm:col-span-2 mt-4">
            <button
              type="button"
              onClick={() => setShowCategoryListing(true)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-200 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-green-500 focus:outline-none"
              disabled={loading}
            >
              {selectedCategory?'Update':'Add'} Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategories;
