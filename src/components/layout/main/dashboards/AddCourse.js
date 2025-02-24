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
  is_Quizes: yup.string(),
  batch_price: yup.number().typeError("Must be a number").positive("Must be positive"),
  individual_price: yup.number().typeError("Must be a number").positive("Must be positive"),
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
  const [courseDurationValue, setCourseDurationValue] = useState({ months: '', weeks: '' });
  const [courseDurationUnit, setCourseDurationUnit] = useState("");
  const [sessionDurationValue, setSessionDurationValue] = useState({ hours: '', minutes: '' });
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
  const [batchPrice, setBatchPrice] = useState("");
  const [individualPrice, setIndividualPrice] = useState("");
  const [prices, setPrices] = useState([
    { id: 1, currency: 'USD', individual: '', batch: '' }
  ]);
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

  const currencyOptions = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' }
  ];

  const getCurrencySymbol = (currencyCode) => {
    const currency = currencyOptions.find(c => c.code === currencyCode);
    return currency ? currency.symbol : '';
  };

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
        createdAt: new Date().toISOString(),
        prices: prices.filter(price => price.currency && (price.individual || price.batch))
      };

      localStorage.setItem("courseData", JSON.stringify(postData));
      router.push("/dashboards/admin-add-data");

    } catch (error) {
      handleError(error);
    }
  };

  const handleCourseDuration = (unit) => {
    setCourseDurationUnit(unit);
    setValue("course_duration", `${courseDurationValue.months} ${unit} ${courseDurationValue.weeks} weeks`);
  };

  const handleSessionDuration = (unit) => {
    setSessionDurationUnit(unit);
    setValue("session_duration", `${sessionDurationValue.hours} ${unit} ${sessionDurationValue.minutes} minutes`);
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

  const addNewCurrency = () => {
    setPrices(prev => [...prev, { 
      id: prev.length + 1, 
      currency: '', 
      individual: '', 
      batch: '' 
    }]);
  };

  const removeCurrency = (id) => {
    setPrices(prev => prev.filter(price => price.id !== id));
  };

  const updatePrice = (id, field, value) => {
    setPrices(prev => prev.map(price => 
      price.id === id ? { ...price, [field]: value } : price
    ));
  };

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
                Duration<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="p-3 border rounded-lg w-full dark:bg-inherit text-gray-600"
                  placeholder="e.g., 2 months 3 weeks"
                  value={`${courseDurationValue.months || ''} ${courseDurationValue.months ? 'months' : ''} ${courseDurationValue.weeks || ''} ${courseDurationValue.weeks ? 'weeks' : ''}`.trim()}
                  onChange={(e) => {
                    const value = e.target.value;
                    const matches = value.match(/(\d+)\s*months?\s*(\d+)\s*weeks?/i);
                    if (matches) {
                      setCourseDurationValue({
                        months: matches[1],
                        weeks: matches[2]
                      });
                    } else {
                      setCourseDurationValue({
                        months: '',
                        weeks: ''
                      });
                    }
                  }}
                />
                <div className="text-xs text-gray-500 mt-1">Format: "X months Y weeks" (e.g., "2 months 3 weeks")</div>
              </div>
              {errors.course_duration && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.course_duration.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-normal mb-1">
                Session Duration<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g., 1 hour 30 minutes"
                  className="p-3 border rounded-lg w-full text-gray-600 dark:bg-inherit"
                  value={`${sessionDurationValue.hours || ''} ${sessionDurationValue.hours ? 'hours' : ''} ${sessionDurationValue.minutes || ''} ${sessionDurationValue.minutes ? 'minutes' : ''}`.trim()}
                  onChange={(e) => {
                    const value = e.target.value;
                    const matches = value.match(/(\d+)\s*hours?\s*(\d+)\s*minutes?/i);
                    if (matches) {
                      setSessionDurationValue({
                        hours: matches[1],
                        minutes: matches[2]
                      });
                    } else {
                      setSessionDurationValue({
                        hours: '',
                        minutes: ''
                      });
                    }
                  }}
                />
                <div className="text-xs text-gray-500 mt-1">Format: "X hours Y minutes" (e.g., "1 hour 30 minutes")</div>
              </div>
              {errors.session_duration && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.session_duration.message}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-normal mb-3">
                Course Fee<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="space-y-4">
                {prices.map((price) => (
                  <div key={price.id} className="flex flex-col space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">Currency</label>
                        <select
                          className="p-3 border rounded-lg w-full dark:bg-inherit text-gray-600"
                          value={price.currency}
                          onChange={(e) => updatePrice(price.id, 'currency', e.target.value)}
                          disabled={courseIsFree}
                        >
                          <option value="">Select Currency</option>
                          {currencyOptions.map(currency => (
                            <option key={currency.code} value={currency.code}>
                              {currency.code} - {currency.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {prices.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCurrency(price.id)}
                          className="ml-4 text-red-500 hover:text-red-700 self-end"
                        >
                          Remove Currency
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Individual Price</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            {price.currency ? getCurrencySymbol(price.currency) : ''}
                          </span>
                          <input
                            type="number"
                            placeholder="Enter amount for Individual"
                            className={`p-3 pl-7 border rounded-lg w-full ${
                              courseIsFree || !price.currency
                                ? "bg-gray-200 cursor-not-allowed"
                                : "text-gray-600 dark:bg-inherit"
                            } placeholder-gray-400`}
                            disabled={courseIsFree || !price.currency}
                            value={price.individual}
                            onChange={(e) => updatePrice(price.id, 'individual', e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Batch Price</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            {price.currency ? getCurrencySymbol(price.currency) : ''}
                          </span>
                          <input
                            type="number"
                            placeholder="Enter amount for Batch"
                            className={`p-3 pl-7 border rounded-lg w-full ${
                              courseIsFree || !price.currency
                                ? "bg-gray-200 cursor-not-allowed"
                                : "text-gray-600 dark:bg-inherit"
                            } placeholder-gray-400`}
                            disabled={courseIsFree || !price.currency}
                            value={price.batch}
                            onChange={(e) => updatePrice(price.id, 'batch', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {!courseIsFree && (
                  <button
                    type="button"
                    onClick={addNewCurrency}
                    className="flex items-center gap-2 text-blue-500 hover:text-blue-700 text-sm mt-4"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Add Another Currency
                  </button>
                )}
                {errors.course_fee && (
                  <p className="text-red-500 text-xs">
                    {errors.course_fee.message}
                  </p>
                )}
              </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6 font-Poppins">
            {/* Course Video Upload */}
            <div className="w-full">
              <label className="block text-sm font-normal mb-2 flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 10L21 7V17L14 14M14 10V14M14 10L3 7V17L14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Add Course Videos<span className="text-red-500">*</span>
              </label>
              <div className={`border-2 ${courseVideos.length > 0 ? 'border-green-500 bg-green-50' : 'border-dashed border-gray-300'} rounded-lg p-4 transition-all duration-300 relative ${errorVideo ? 'border-red-500 bg-red-50' : ''}`}>
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m0 0v4a4 4 0 004 4h20a4 4 0 004-4V28m-4-4l5-5m0 0l-5-5m5 5H28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="mt-4 flex text-sm justify-center">
                    <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload videos</span>
                      <input
                        type="file"
                        multiple
                        accept="video/*"
                        className="sr-only"
                        onChange={handleVideoUpload}
                      />
                    </label>
                    <p className="pl-1 text-gray-500">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">MP4, WebM, Ogg up to 100MB</p>
                </div>
                {courseVideos.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Uploaded Videos:</p>
                    {courseVideos.map((video, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm">
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                          </svg>
                          <span className="text-sm text-gray-600 truncate max-w-[150px]">Video {index + 1}</span>
                        </div>
                        <button
                          onClick={() => removeVideo(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {errorVideo && (
                  <p className="text-red-500 text-xs mt-2 text-center">Please upload course videos</p>
                )}
              </div>
            </div>

            {/* PDF Brochure Upload */}
            <div className="w-full">
              <label className="block text-sm font-normal mb-2 flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 21H17C19.2091 21 21 19.2091 21 17V7C21 4.79086 19.2091 3 17 3H7C4.79086 3 3 4.79086 3 7V17C3 19.2091 4.79086 21 7 21Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 16.8L9.5 14.3L11.999 16.799L16.5 12.3L17.5 13.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Add PDF Brochure<span className="text-red-500">*</span>
              </label>
              <div className={`border-2 ${pdfBrochures.length > 0 ? 'border-green-500 bg-green-50' : 'border-dashed border-gray-300'} rounded-lg p-4 transition-all duration-300 relative ${errorPdf ? 'border-red-500 bg-red-50' : ''}`}>
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m0 0v4a4 4 0 004 4h20a4 4 0 004-4V28m-4-4l5-5m0 0l-5-5m5 5H28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="mt-4 flex text-sm justify-center">
                    <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload PDF</span>
                      <input
                        type="file"
                        multiple
                        accept=".pdf"
                        className="sr-only"
                        onChange={handlePdfUpload}
                      />
                    </label>
                    <p className="pl-1 text-gray-500">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">PDF files up to 10MB</p>
                </div>
                {pdfBrochures.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Uploaded PDFs:</p>
                    {pdfBrochures.map((pdf, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm">
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                          </svg>
                          <span className="text-sm text-gray-600 truncate max-w-[150px]">PDF {index + 1}</span>
                        </div>
                        <button
                          onClick={() => removePdf(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {errorPdf && (
                  <p className="text-red-500 text-xs mt-2 text-center">Please upload PDF brochure</p>
                )}
              </div>
            </div>

            {/* Thumbnail Image Upload */}
            <div className="w-full">
              <label className="block text-sm font-normal mb-2 flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 16L8.586 11.414C9.367 10.633 10.633 10.633 11.414 11.414L16 16M14 14L15.586 12.414C16.367 11.633 17.633 11.633 18.414 12.414L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Add Thumbnail Image<span className="text-red-500">*</span>
              </label>
              <div className={`border-2 ${thumbnailImage ? 'border-green-500 bg-green-50' : 'border-dashed border-gray-300'} rounded-lg p-4 transition-all duration-300 relative ${error ? 'border-red-500 bg-red-50' : ''}`}>
                <div className="text-center">
                  {thumbnailImage ? (
                    <div className="relative">
                      <img
                        src={thumbnailImage}
                        alt="Thumbnail"
                        className="mx-auto h-32 w-auto rounded-lg object-cover"
                      />
                      <button
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m0 0v4a4 4 0 004 4h20a4 4 0 004-4V28m-4-4l5-5m0 0l-5-5m5 5H28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div className="mt-4 flex text-sm justify-center">
                        <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <span>Upload image</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageUpload}
                          />
                        </label>
                        <p className="pl-1 text-gray-500">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 5MB</p>
                    </>
                  )}
                </div>
                {error && (
                  <p className="text-red-500 text-xs mt-2 text-center">Please upload a thumbnail image</p>
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
