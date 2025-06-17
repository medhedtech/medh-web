"use client";

import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";
import { apiUrls } from "@/apis";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import usePostQuery from "@/hooks/postQuery.hook";
import Image from "next/image";
import useGetQuery from "@/hooks/getQuery.hook";
import Icon2 from "@/assets/images/dashbord/icon2.svg";
import { toast } from "react-toastify";
import Preloader from "../others/Preloader";

// Validation schema using yup
const schema = yup.object({
  title: yup.string().required("Assignment title is required."),
  deadline: yup
    .date()
    .required("Deadline is required.")
    .typeError("Invalid type"),
  assignment_resources: yup.array().of(yup.string()),
});

const AssignmentModal = ({ open, handleClose }) => {
  const [pdfBrochures, setPdfBrochures] = useState([]);
  const { postQuery, loading } = usePostQuery();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState("");
  const [categories, setCategories] = useState([]);
  const dropdownRef = useRef(null);
  const { getQuery, loading: getLoading } = useGetQuery();
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setInstructorId(storedUserId);
      } else {
        console.error("No instructor ID found in localStorage");
      }
    }
  }, []);

  useEffect(() => {
    const fetchAllCategories = () => {
      getQuery({
        url: apiUrls?.courses?.getAllCourses,
        onSuccess: (res) => {
          setCategories(res || []);
        },
        onFail: (err) => {
          setCategories([]);
        },
      });
    };
    fetchAllCategories();
  }, []);

  const handlePdfUpload = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      try {
        const uploadedPdfs = [...pdfBrochures];
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
                uploadedPdfs.push(data?.data);
                setPdfBrochures(uploadedPdfs);
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

  const onSubmit = async (data) => {
    console.log("data before submission", data);
    if (!selectedCourseId) {
      // toast.error("Please select a category (course).");
      return;
    }
    try {
      const postData = {
        title: data.title,
        deadline: data.deadline,
        assignment_resources: pdfBrochures,
        courseId: selectedCourseId,
        instructor_id: instructorId,
      };

      await postQuery({
        url: apiUrls?.assignments?.addAssignments,
        postData,
        onSuccess: () => {
          reset();
          setPdfBrochures([]);
          setSelectedCourseId(null);
          handleClose();
          showToast.success("Assignment added successfully");
        },
        onError: (error) => {
          console.error("Error submitting assignment:", error);
        },
      });
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const removePdf = (index) => {
    setPdfBrochures((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    setDropdownOpen((prev) => !prev);
  };

  const selectCategory = (category) => {
    if (!category) {
      console.error("Selected category is undefined or null.");
      return;
    }
    setSelected(category.course_title || "");
    setSelectedCourseId(category._id);
    setValue("category", category.course_title);
    setDropdownOpen(false);
    setSearchTerm("");
  };

  const filteredCategories = categories?.filter((category) =>
    searchTerm
      ? category?.course_title?.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  if (getLoading) {
    return <Preloader />;
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
        <DialogTitle className="text-lg font-semibold m-0">
          Create Assignment
        </DialogTitle>
        <IconButton onClick={handleClose}>
          <AiOutlineClose size={20} />
        </IconButton>
      </div>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Assignment Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Assignment Title
            </label>
            <input
              type="text"
              {...register("title")}
              className="w-full border rounded px-3 py-2"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-normal mb-1">
              Course <span className="text-red-500">*</span>
            </label>
            <div className="p-3 border rounded-lg w-full dark:bg-inherit text-gray-600">
              <button className="w-full text-left" onClick={toggleDropdown}>
                {selected || "Select Category"}
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
                          className="hover:bg-gray-100 rounded-lg cursor-pointer flex gap-3 px-3 py-3"
                          onClick={() => selectCategory(category)}
                        >
                          <Image
                            src={category.course_image || Icon2}
                            alt={category.course_title}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                          {category.course_title}
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

          {/* Today's Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Today&#39;s Date
            </label>
            <div className="relative">
              <input
                type="date"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#7ECA9D] focus:border-[#7ECA9D]"
                defaultValue={new Date().toISOString().split("T")[0]}
              />
              <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                📅
              </span>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label>Due Date</label>
            <input
              type="date"
              {...register("deadline")}
              className="w-full border rounded px-3 py-2"
            />
            {errors.deadline && (
              <p className="text-red-500 text-sm">{errors.deadline.message}</p>
            )}
          </div>

          {/* PDF Brochure Upload */}
          <div className="w-full">
            {/* Upload Box */}
            <div className="border-dashed border-2 bg-purple border-gray-300 rounded-lg p-3 w-full h-[140px] text-center relative mx-auto">
              {/* Upload Icon */}
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
              {/* Upload Text */}
              <p className="text-customGreen cursor-pointer text-sm mt-2">
                Click to upload
              </p>
              <p className="text-gray-400 text-xs">or drag & drop the files</p>
              {/* Hidden Input Field */}
              <input
                type="file"
                multiple
                accept=".pdf, .doc, .docx"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handlePdfUpload}
              />
            </div>

            {/* Uploaded Files */}
            {pdfBrochures.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {pdfBrochures.map((fileUrl, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[#e9e9e9] p-2 rounded-md text-sm w-full md:w-auto"
                  >
                    <span className="truncate text-[#5C5C5C] max-w-[150px]">
                      {fileUrl.split("/").pop()}
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

          {/* Upload Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#7ECA9D] text-white font-semibold rounded-lg shadow-md hover:bg-[#68B58B] focus:outline-none"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Create Assignment"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentModal;
