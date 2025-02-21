"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { BookOpen, CircleCheckBig, Upload } from "lucide-react";
import ResourceUploadModal from "./ResourceUploadModal";
import CurriculumModal from "./CurriculumModal";
import CategorySelect from "./CategorySelect";
import SelectMultipleCourses from "./SelectMultipleCourses";

// Optimized validation schema
const schema = yup.object({
  course_category: yup.string().oneOf([
    "Live Courses", 
    "Blended Courses", 
    "Corporate Training Courses"
  ]),
  course_title: yup.string().trim().max(100, "Title too long"),
  category: yup.string().max(50),
  course_tag: yup.string(),
  no_of_Sessions: yup.number()
    .typeError("Must be a number")
    .positive("Must be positive")
    .integer("Must be whole number"),
  course_duration: yup.string().max(20),
  related_courses: yup.array().of(yup.string()),
  session_duration: yup.string().max(20),
  course_description: yup.string().max(500, "Description too long"),
  course_fee: yup.number().typeError("Must be a number"),
  course_grade: yup.string(),
  is_Certification: yup.string(),
  is_Assignments: yup.string(),
  is_Projects: yup.string(),
  class_type: yup.string(),
  efforts_per_Week: yup.string().max(50),
  is_Quizes: yup.string()
});

const AddCourse = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [courseVideos, setCourseVideos] = useState([]);
  const [pdfBrochures, setPdfBrochures] = useState([]);
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const { postQuery, loading } = usePostQuery();
  const [courseData, setCourseData] = useState(null);
  const [categories, setCategories] = useState(null);
  const { getQuery } = useGetQuery();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const [courseDurationValue, setCourseDurationValue] = useState();
  const [courseDurationUnit, setCourseDurationUnit] = useState("");
  const [sessionDurationValue, setSessionDurationValue] = useState();
  const [sessionDurationUnit, setSessionDurationUnit] = useState("");
  const [isResourceModatOpen, setResourceModalOpen] = useState(false);
  const [resourceVideos, setResourceVideos] = useState([]);
  const [resourcePdfs, setResourcePdfs] = useState([]);
  const [isCurriculumModalOpen, setCurriculumModalOpen] = useState(false);
  const [curriculum, setCurriculum] = useState([]);
  const [courseTag, setCourseTag] = useState();
  const [courseIsFree, setCourseIsFree] = useState(false);
  const [error, setError] = useState(false);
  const [errorPdf, setErrorPdf] = useState(false);
  const [errorVideo, setErrorVideo] = useState(false);
  const [selected, setSelected] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    trigger,
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      related_courses: [],
    },
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

  useEffect(() => {
    if (courseTag === "Free") {
      setCourseIsFree(true);
      setValue("course_fee", 0);
    } else {
      setCourseIsFree(false);
      reset({ course_fee: "" });
    }
  }, [courseTag]);

  useEffect(() => {
    if (selected) {
      trigger("category");
    }
  }, [selected, trigger]);

  // useEffect(() => {
  //   if (selectedCourses) {
  //     trigger("related_courses");
  //   }
  // }, [selectedCourses, trigger]);

  const fetchAllCategories = () => {
    try {
      getQuery({
        url: apiUrls?.categories?.getAllCategories,
        onSuccess: (res) => {
          setCategories(res.data);
        },
        onFail: (err) => {
          console.error("Failed to fetch categories: ", err);
        },
      });
    } catch (err) {
      console.error("Error fetching categories: ", err);
    }
  };

  const handleCategory = (category) => {
    setValue("category", category);
  };

  const handleCourse = (course) => {
    setValue("related_courses", course);
  };

  const handleVideoUpload = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      try {
        const updatedVideos = [...courseVideos];
        for (const file of files) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = async () => {
            const base64 = reader.result.split(",")[1];
            const postData = { base64String: base64, fileType: "video" };

            await postQuery({
              url: apiUrls?.upload?.uploadMedia,
              postData,
              onSuccess: (data) => {
                console.log("Video uploaded successfully:", data?.data);
                updatedVideos.push(data?.data); // Append to the array
                setCourseVideos([...updatedVideos]); // Update the state
                setErrorVideo(false);
              },
              onError: (error) => {
                toast.error("Video upload failed. Please try again.");
                console.error("Upload error:", error);
              },
            });
          };
        }
      } catch (error) {
        console.error("Error uploading video:", error);
      }
    }
  };

  const handlePdfUpload = async (e) => {
    console.log(getValues("category"), "value cat");
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
                setErrorPdf(false);
                console.log(getValues("category"), "value cat");
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
              setError(false);
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

  const onSubmit = async (data) => {
    try {
      const postData = {
        ...data,
        course_videos: courseVideos,
        brochures: pdfBrochures,
        course_image: thumbnailImage,
        resource_videos: resourceVideos,
        resource_pdfs: resourcePdfs,
        curriculum,
        related_courses: selectedCourses,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem("courseData", JSON.stringify(postData));
      router.push("/dashboards/admin-add-data");

    } catch (error) {
      handleError(error);
    }
  };

  const handleCourseDuration = (unit) => {
    setCourseDurationUnit(unit);
    setValue("course_duration", `${courseDurationValue} ${unit}`);
  };

  const handleSessionDuration = (unit) => {
    setSessionDurationUnit(unit);
    setValue("session_duration", `${sessionDurationValue} ${unit}`);
  };

  const handleResourceModal = (e) => {
    e.preventDefault();
    setResourceModalOpen(true);
    console.log("opened");
  };

  const handleCurriculumModal = (e) => {
    e.preventDefault();
    setCurriculumModalOpen(true);
    setValue("curriculum", curriculum);
  };

  const removeVideo = (index) => {
    const updatedVideos = [...courseVideos];
    updatedVideos.splice(index, 1);
    setCourseVideos(updatedVideos);
  };

  const removePdf = (index) => {
    setPdfBrochures((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const removeImage = () => {
    setThumbnailImage(null);
  };

  useEffect(() => {
    if (courseData) {
      reset(courseData);
    }
  }, [courseData, reset]);

  const handleChange = (value) => {
    setSelectedCategory(value);
  };

  // Update label rendering to remove required asterisks
  const renderLabel = (text) => (
    <label className="block text-sm font-normal mb-1">
      {text}
    </label>
  );

  // Improved error handling
  const handleError = (error) => {
    console.error("Error:", error);
    toast.error(
      error.response?.data?.message || 
      "An error occurred. Please try again."
    );
  };

  // Optimized file upload handler
  const handleFileUpload = async (files, type) => {
    try {
      const uploadPromises = Array.from(files).map(file => {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
          reader.onload = async () => {
            try {
              const base64 = type === 'pdf' ? reader.result : reader.result.split(",")[1];
              const postData = type === 'pdf' ? 
                { base64String: base64 } : 
                { base64String: base64, fileType: type };

              const response = await postQuery({
                url: type === 'pdf' ? 
                  apiUrls.upload.uploadDocument : 
                  apiUrls.upload[`upload${type === 'image' ? 'Image' : 'Media'}`],
                postData
              });
              
              resolve(response.data);
            } catch (error) {
              reject(error);
            }
          };
          reader.onerror = error => reject(error);
          type === 'pdf' ? reader.readAsDataURL(file) : reader.readAsArrayBuffer(file);
        });
      });

      const results = await Promise.all(uploadPromises);
      return results.map(r => r.data);

    } catch (error) {
      handleError(error);
      return [];
    }
  };

  // Memoized form components
  const renderFormField = (label, children) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      {children}
    </div>
  );

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Clear temporary storage on unmount
      localStorage.removeItem("courseData");
    };
  }, []);

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="min-h-screen font-Poppins flex items-center justify-center pt-8 dark:bg-inherit dark:text-whitegrey3 bg-gray-100">
      <div className="bg-white p-8 rounded-lg dark:bg-inherit dark:text-whitegrey3 dark:border shadow-lg w-full max-w-6xl">
        <h2 className="text-2xl font-semibold mb-6">Add Course Details</h2>

        {/* Select Category */}
        <div className="mb-6">
          <div className="flex items-center gap-7 mb-2">
            {renderLabel("Select Category")}
            <label className={`flex text-lg font-medium items-center space-x-2 ${
              selectedCategory === "Live Courses" ? "text-green-500" : "text-[#808080]"
            }`}>
              <input
                type="radio"
                name="course_category"
                value="Live Courses"
                onChange={() => handleChange("Live Courses")}
                {...register("course_category")}
              />
              <span className="block text-sm font-normal">Live Courses</span>
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
              <span className="block text-sm font-normal">Blended Courses</span>
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
              <span className="block text-sm font-normal">
                Corporate Training Courses
              </span>
            </label>
          </div>
          {errors.course_category && (
            <p className="text-red-500 text-xs">
              {errors.course_category.message}
            </p>
          )}
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-[#808080]">
            <div>
              {renderLabel("Course Title")}
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

            {/* <CategorySelect handleCategory={handleCategory} errors={errors} /> */}
            <CategorySelect
              handleCategory={handleCategory}
              errors={errors}
              selected={selected}
              setSelected={setSelected}
            />

            <div>
              <label className="block text-sm font-normal mb-1">
                Category Type<span className="text-red-500 ml-1">*</span> (Live/
                Hybrid/ Pre-Recorded/ Free)
              </label>
              <select
                className="p-3 border rounded-lg w-full dark:bg-inherit text-gray-600"
                {...register("course_tag")}
                // onChange={(e) => setCourseTag(e.target.value)}
              >
                <option value="">Select type</option>
                <option value="Live">Live</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Pre-Recorded">Pre-Recorded</option>
                <option value="Free">Free</option>
              </select>
              {errors.course_tag && (
                <p className="text-red-500 text-xs">
                  {errors.course_tag.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-normal mb-1">
                No. of Sessions<span className="text-red-500 ml-1">*</span>
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
              <label className="block text-sm font-normal mb-1">
                Duration
                <span className="text-red-500 ml-1">*</span> (In Months/Weeks)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="p-3 border rounded-lg w-1/2 dark:bg-inherit text-gray-600"
                  placeholder="Enter duration"
                  value={courseDurationValue}
                  onChange={(e) => setCourseDurationValue(e.target.value)}
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
                      onClick={(e) => handleCourseDuration(e.target.value)}
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
                      onClick={(e) => handleCourseDuration(e.target.value)}
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
              <label className="block text-sm font-normal mb-1">
                Session Duration
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex items-center gap-2">
                {/* Numeric input for session duration */}
                <input
                  type="number"
                  placeholder="Enter duration"
                  className="p-3 border rounded-lg w-1/2 text-gray-600 dark:bg-inherit placeholder-gray-400"
                  value={sessionDurationValue}
                  onChange={(e) => setSessionDurationValue(e.target.value)}
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
                      onClick={(e) => handleSessionDuration(e.target.value)}
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
              <label className="block text-sm font-normal mb-1">
                Course Fee
                <span className="text-red-500 ml-1">*</span> (USD)
              </label>
              <input
                type="text"
                placeholder="Enter amount in USD"
                disabled={courseIsFree}
                // className="p-3 border rounded-lg w-full text-gray-600 dark:bg-inherit placeholder-gray-400"
                className={`p-3 border rounded-lg w-full ${
                  courseIsFree
                    ? "bg-gray-200 cursor-not-allowed"
                    : "text-gray-600 dark:bg-inherit"
                } placeholder-gray-400`}
                {...register("course_fee")}
              />
              {errors.course_fee && (
                <p className="text-red-500 text-xs">
                  {errors.course_fee.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-normal mb-1">
                Course Grade
                <span className="text-red-500 ml-1">*</span>
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

            <div>
              <label className="block text-sm font-normal mb-1">
                Certificate<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                className="p-3 border rounded-lg w-full dark:bg-inherit text-gray-600"
                {...register("is_Certification")}
              >
                <option value="">Select...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {errors.is_Certification && (
                <p className="text-red-500 text-xs">
                  {errors.is_Certification.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-normal mb-1">
                Assignments<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                className="p-3 border rounded-lg w-full dark:bg-inherit text-gray-600"
                {...register("is_Assignments")}
              >
                <option value="">Select...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {errors.is_Assignments && (
                <p className="text-red-500 text-xs">
                  {errors.is_Assignments.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-normal mb-1">
                Class Type
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                className="p-3 border rounded-lg w-full dark:bg-inherit text-gray-600"
                {...register("class_type")}
              >
                <option value="">Select...</option>
                <option value="Self-Paced">Self-Paced</option>
                <option value="Weekends / Weekdays">Weekends / Weekdays</option>
              </select>
              {errors.class_type && (
                <p className="text-red-500 text-xs">
                  {errors.class_type.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-normal mb-1">
                Projects
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                className="p-3 border rounded-lg w-full dark:bg-inherit text-gray-600"
                {...register("is_Projects")}
              >
                <option value="">Select...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {errors.is_Projects && (
                <p className="text-red-500 text-xs">
                  {errors.is_Projects.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-normal mb-1">
                Quizzes
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                className="p-3 border rounded-lg w-full dark:bg-inherit text-gray-600"
                {...register("is_Quizes")}
              >
                <option value="">Select...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {errors.is_Quizes && (
                <p className="text-red-500 text-xs">
                  {errors.is_Quizes.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-normal mb-1">
                Efforts (For Students) Per Week
                <span className="text-red-500 ml-1">*</span> (3 - 4 hours /
                week)
              </label>
              <input
                type="text"
                placeholder="e.g., 3 hours per week"
                className="p-3 border rounded-lg w-full text-[#808080] dark:bg-inherit placeholder-gray-400"
                {...register("efforts_per_Week")}
              />
              {errors.efforts_per_Week && (
                <p className="text-red-500 text-xs">
                  {errors.efforts_per_Week.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-normal mb-1">
                Course Description
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                placeholder="Write description........."
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
              <label className="block text-sm font-normal mb-1">
                Add Resources
              </label>
              <button
                onClick={handleResourceModal}
                className="flex items-center w-full justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
              >
                {resourceVideos.length > 0 || resourcePdfs.length > 0 ? (
                  <CircleCheckBig className="w-4 h-16 text-customGreen" />
                ) : (
                  <Upload className="w-4 h-16" />
                )}
                {resourceVideos.length > 0 || resourcePdfs.length > 0 ? (
                  <span className="text-customGreen">Files Uploaded</span>
                ) : (
                  <span>Upload Files</span>
                )}
              </button>
            </div>
            <div>
              <label className="block text-sm font-normal mb-1">
                Add Course Curriculum
              </label>
              <button
                onClick={handleCurriculumModal}
                className="flex items-center w-full justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
              >
                {curriculum.length > 0 ? (
                  <CircleCheckBig className="w-4 h-20 text-customGreen" />
                ) : (
                  <BookOpen className="w-4 h-20" />
                )}
                {curriculum.length > 0 ? (
                  <span className="text-customGreen">Curriculum Added</span>
                ) : (
                  <span>Add Curriculum</span>
                )}
              </button>
            </div>
            {/* Multi select courses */}
            <SelectMultipleCourses
              handleCourse={handleCourse}
              errors={errors}
              selectedCourses={selectedCourses}
              setSelectedCourses={setSelectedCourses}
              field={register("related_courses")}
            />
          </div>

          {/* Upload Section */}
          <div className="flex flex-wrap gap-24 mb-6 font-Poppins justify-start">
            {/* Course Video Upload */}
            <div>
              {renderLabel("Add Course Videos")}
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
                <p className="text-gray-400 text-xs">
                  or drag & drop the files
                </p>
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  className="absolute inset-0 opacity-0 dark:bg-inherit cursor-pointer"
                  onChange={handleVideoUpload}
                />
                {courseVideos && courseVideos.length > 0 && (
                  <p className="mt-1 text-xs text-gray-500">✔ Uploaded</p>
                )}
              </div>
              {/* Conditionally show the error message */}
              {errorVideo && (
                <p className="text-red-500 mt-2 text-xs">
                  Please upload course videos
                </p>
              )}

              {/* Uploaded Course Videos */}
              <div className="w-[210px] text-center relative">
                {courseVideos.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {courseVideos.map((fileUrl, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-[#e9e9e9] p-2 rounded-md text-sm w-full md:w-auto"
                      >
                        <span className="truncate text-[#5C5C5C] max-w-[150px]">
                          Video {index + 1}
                        </span>
                        <button
                          onClick={() => removeVideo(index)}
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

            {/* PDF Brochure Upload */}
            <div>
              {renderLabel("Add PDF Brochure")}
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
                <p className="text-gray-400 text-xs">
                  or drag & drop the files
                </p>
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
              {/* Conditionally show the error message */}
              {errorPdf && (
                <p className="text-red-500 text-xs mt-2">
                  Please upload pdf brochure
                </p>
              )}

              <div className="w-[210px] text-center relative">
                {pdfBrochures.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {pdfBrochures.map((fileUrl, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-[#e9e9e9] p-2 rounded-md text-sm w-full md:w-auto"
                      >
                        <span className="truncate text-[#5C5C5C] max-w-[150px]">
                          Pdf {index + 1}
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

            {/* Thumbnail Image Upload */}
            <div>
              {renderLabel("Add Image")}
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

              {/* Conditionally show the error message */}
              {error && (
                <p className="text-red-500 text-xs mt-2">
                  Please upload a thumbnail image
                </p>
              )}

              <div className="w-[210px] text-center relative">
                {thumbnailImage && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <div className="flex items-center justify-between bg-[#e9e9e9] p-2 rounded-md text-sm w-full md:w-auto">
                      <span className="truncate text-[#5C5C5C] max-w-[150px]">
                        Image Uploaded
                      </span>
                      <button
                        onClick={removeImage}
                        className="ml-2 text-[20px] text-[#5C5C5C] hover:text-red-700"
                      >
                        x
                      </button>
                    </div>
                  </div>
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
      {isResourceModatOpen && (
        <ResourceUploadModal
          onClose={() => setResourceModalOpen(false)}
          resourceVideos={resourceVideos}
          setResourceVideos={setResourceVideos}
          resourcePdfs={resourcePdfs}
          setResourcePdfs={setResourcePdfs}
        />
      )}
      {isCurriculumModalOpen && (
        <CurriculumModal
          onClose={() => setCurriculumModalOpen(false)}
          curriculum={curriculum}
          setCurriculum={setCurriculum}
        />
      )}
    </div>
  );
};

export default AddCourse;
