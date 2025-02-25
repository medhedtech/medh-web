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
import { HelpCircle, DollarSign } from "lucide-react";
import ResourceUploadModal from "./ResourceUploadModal";
import CurriculumModal from "./CurriculumModal";
import CategorySelect from "./CategorySelect";
import SelectMultipleCourses from "./SelectMultipleCourses";
import Tooltip from "@/components/shared/others/Tooltip";
import Cookies from "js-cookie";

// Optimized validation schema (removed validations for online_sessions and course_mode)
const schema = yup.object({
  course_category: yup.string().required("Course category is required"),
  category_type: yup
    .string()
    .oneOf(["Live", "Hybrid", "Pre-Recorded", "Free"])
    .required("Category type is required"),
  course_title: yup
    .string()
    .required("Course title is required")
    .trim()
    .max(100, "Title too long"),
  no_of_Sessions: yup
    .number()
    .required("Number of sessions is required")
    .typeError("Must be a number")
    .positive("Must be positive")
    .integer("Must be whole number"),
  course_duration: yup
    .string()
    .required("Course duration is required")
    .matches(/^\d+ months \d+ weeks$/, "Invalid duration format"),
  session_duration: yup
    .string()
    .required("Session duration is required")
    .matches(/^\d+ hours \d+ minutes$/, "Invalid duration format"),
  course_description: yup
    .string()
    .required("Course description is required")
    .max(500, "Description too long"),
  course_fee: yup.number().when("category_type", {
    is: (val) => val === "Free",
    then: () =>
      yup
        .number()
        .transform((value) => (isNaN(value) ? 0 : value))
        .test("is-zero", "Course fee must be 0 for free courses", (val) => val === 0),
    otherwise: () =>
      yup
        .number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .typeError("Course fee must be a valid number")
        .required("Course fee is required")
        .min(0, "Course fee cannot be negative"),
  }),
  course_grade: yup.string().required("Course grade is required"),
  is_Certification: yup
    .string()
    .oneOf(["Yes", "No"])
    .required("This field is required"),
  is_Assignments: yup
    .string()
    .oneOf(["Yes", "No"])
    .required("This field is required"),
  is_Projects: yup
    .string()
    .oneOf(["Yes", "No"])
    .required("This field is required"),
  class_type: yup
    .string()
    .oneOf(["Live Courses", "Blended Courses", "Corporate Training Courses"])
    .required("This field is required"),
  min_hours_per_week: yup
    .number()
    .required("Minimum hours is required")
    .typeError("Must be a number")
    .positive("Must be positive")
    .integer("Must be whole number"),
  max_hours_per_week: yup
    .number()
    .required("Maximum hours is required")
    .typeError("Must be a number")
    .positive("Must be positive")
    .integer("Must be whole number")
    .min(yup.ref('min_hours_per_week'), "Maximum hours must be greater than minimum hours"),
  is_Quizes: yup
    .string()
    .oneOf(["Yes", "No"])
    .required("This field is required"),
  related_courses: yup.array().of(yup.string()).default([]),
});

const AddCourse = () => {
  const router = useRouter();
  const { postQuery, loading } = usePostQuery();
  const { getQuery } = useGetQuery();
  const dropdownRef = useRef(null);

  // State variables for form data and uploads
  const [selectedCategory, setSelectedCategory] = useState("");
  const [courseVideos, setCourseVideos] = useState([]);
  const [pdfBrochures, setPdfBrochures] = useState([]);
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [categories, setCategories] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseDurationValue, setCourseDurationValue] = useState({ months: "", weeks: "" });
  const [sessionDurationValue, setSessionDurationValue] = useState({ hours: "", minutes: "" });
  const [isResourceModalOpen, setResourceModalOpen] = useState(false);
  const [resourceVideos, setResourceVideos] = useState([]);
  const [resourcePdfs, setResourcePdfs] = useState([]);
  const [isCurriculumModalOpen, setCurriculumModalOpen] = useState(false);
  const [curriculum, setCurriculum] = useState([]);
  const [courseTag, setCourseTag] = useState();
  const [courseIsFree, setCourseIsFree] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [prices, setPrices] = useState([{ 
    id: 1, 
    currency: "USD", 
    individual: "", 
    batch: "", 
    min_batch_size: 2,
    max_batch_size: 10,
    early_bird_discount: 0,
    group_discount: 0
  }]);
  const [courseGrade, setCourseGrade] = useState("");
  const [certification, setCertification] = useState("");
  const [assignments, setAssignments] = useState("");
  const [projects, setProjects] = useState("");
  const [quizzes, setQuizzes] = useState("");
  // Removed separate courseMode state since category_type now serves that purpose
  const [curriculumWeeks, setCurriculumWeeks] = useState([]);
  const [toolsTechnologies, setToolsTechnologies] = useState([]);
  const [bonusModules, setBonusModules] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [classType, setClassType] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    trigger,
    getValues,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      related_courses: [],
    },
    mode: "onChange",
  });

  // Currency options for pricing
  const currencyOptions = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  ];

  const getCurrencySymbol = (currencyCode) => {
    const currency = currencyOptions.find((c) => c.code === currencyCode);
    return currency ? currency.symbol : "";
  };

  // Load saved form data from cookies on mount
  useEffect(() => {
    const savedFormData = Cookies.get("courseFormData");
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      Object.entries(parsedData.formValues || {}).forEach(([key, value]) => {
        setValue(key, value);
      });
      setSelectedCategory(parsedData.selectedCategory || "");
      setCourseVideos(parsedData.courseVideos || []);
      setPdfBrochures(parsedData.pdfBrochures || []);
      setThumbnailImage(parsedData.thumbnailImage || null);
      setResourceVideos(parsedData.resourceVideos || []);
      setResourcePdfs(parsedData.resourcePdfs || []);
      setCurriculum(parsedData.curriculum || []);
      setCourseTag(parsedData.courseTag);
      setCourseIsFree(parsedData.courseIsFree || false);
      setSelectedCourses(parsedData.selectedCourses || []);
      setPrices(parsedData.prices || [{ id: 1, currency: "USD", individual: "", batch: "", min_batch_size: 2, max_batch_size: 10, early_bird_discount: 0, group_discount: 0 }]);
      setCourseDurationValue(parsedData.courseDurationValue || { months: "", weeks: "" });
      setSessionDurationValue(parsedData.sessionDurationValue || { hours: "", minutes: "" });
      setCurriculumWeeks(parsedData.curriculumWeeks || []);
      setToolsTechnologies(parsedData.toolsTechnologies || []);
      setBonusModules(parsedData.bonusModules || []);
      setFaqs(parsedData.faqs || []);
      setClassType(parsedData.classType || "");
      setCourseGrade(parsedData.courseGrade || "");
      setCertification(parsedData.certification || "");
      setAssignments(parsedData.assignments || "");
      setProjects(parsedData.projects || "");
      setQuizzes(parsedData.quizzes || "");
      // Note: We no longer have a separate course_mode; category_type now covers that.
      setSelectedType(parsedData.selectedType || "");
    }
    fetchAllCategories();
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setValue]);

  // Persist form data in cookies (debounced)
  const formValues = watch();
  useEffect(() => {
    const saveFormData = () => {
      const dataToSave = {
        formValues,
        selectedCategory,
        courseVideos,
        pdfBrochures,
        thumbnailImage,
        resourceVideos,
        resourcePdfs,
        curriculum,
        courseTag,
        courseIsFree,
        selectedCourses,
        prices,
        courseDurationValue,
        sessionDurationValue,
        curriculumWeeks,
        toolsTechnologies,
        bonusModules,
        faqs,
        classType,
        courseGrade,
        certification,
        assignments,
        projects,
        quizzes,
        // category_type is already captured in selectedType
        selectedType,
      };
      Cookies.set("courseFormData", JSON.stringify(dataToSave), {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
      });
    };
    const timeoutId = setTimeout(saveFormData, 500);
    return () => clearTimeout(timeoutId);
  }, [
    formValues,
    selectedCategory,
    courseVideos,
    pdfBrochures,
    thumbnailImage,
    resourceVideos,
    resourcePdfs,
    curriculum,
    courseTag,
    courseIsFree,
    selectedCourses,
    prices,
    courseDurationValue,
    sessionDurationValue,
    curriculumWeeks,
    toolsTechnologies,
    bonusModules,
    faqs,
    classType,
    courseGrade,
    certification,
    assignments,
    projects,
    quizzes,
    selectedType,
  ]);

  // Cleanup cookie on unmount
  useEffect(() => {
    return () => Cookies.remove("courseFormData");
  }, []);

  // Fetch categories from the API
  const fetchAllCategories = async () => {
    try {
      await getQuery({
        url: apiUrls?.categories?.getAllCategories,
        onSuccess: (data) => {
          const fetchedCategories = data.data;
          if (Array.isArray(fetchedCategories)) {
            const normalizedData = fetchedCategories.map((item) => ({
              id: item._id,
              name: item.name || item.category_name || "Unnamed Category",
              image: item.category_image || null,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
            }));
            setCategories(normalizedData);
          } else {
            setCategories([]);
            toast.error("Failed to load categories");
          }
        },
        onFail: (error) => {
          setCategories([]);
          toast.error("Failed to load categories");
        },
      });
    } catch (error) {
      setCategories([]);
      toast.error("Failed to load categories");
    }
  };

  // Handlers for category, file uploads, and state updates
  const handleChange = async (category) => {
    setSelectedCategory(category);
    setValue("course_category", category);
    setValue("category", category);
    if (category) {
      try {
        await trigger("course_category");
        await trigger("category");
      } catch (error) {
        console.error("Validation error:", error);
      }
    }
    setDropdownOpen(false);
  };

  const handleCourse = (course) => {
    setSelectedCourses(course);
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
                updatedVideos.push(data?.data);
                setCourseVideos([...updatedVideos]);
              },
              onError: (error) => {
                toast.error("Video upload failed. Please try again.");
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
                updatedPdfs.push(data?.data);
                setPdfBrochures([...updatedPdfs]);
              },
              onError: (error) => {
                toast.error("PDF upload failed. Please try again.");
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
            },
            onError: (error) => {
              toast.error("Image upload failed. Please try again.");
            },
          });
        };
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      // Format the efforts per week
      const formattedEffortsPerWeek = `${data.min_hours_per_week} - ${data.max_hours_per_week} hours / week`;

      // Format prices for API - remove id which is only for UI
      const formattedPrices = prices.map(({ id, ...priceData }) => priceData);

      // Derive online sessions details from the "No. of Sessions" and "Session Duration" fields.
      const derivedOnlineSessions = {
        count: data.no_of_Sessions,
        duration: data.session_duration,
      };
      
      // Validate curriculum weeks
      if (curriculumWeeks.length > 0) {
        const invalidWeeks = curriculumWeeks.filter(
          week => !week.weekTitle.trim() || !week.weekDescription.trim()
        );
        
        if (invalidWeeks.length > 0) {
          const emptyFields = [];
          if (invalidWeeks.some(week => !week.weekTitle.trim())) emptyFields.push("title");
          if (invalidWeeks.some(week => !week.weekDescription.trim())) emptyFields.push("description");
          
          toast.error(
            `Please fill in all curriculum week ${emptyFields.join(" and ")}s. All fields are required.`, 
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
          return;
        }
      }

      // Format curriculum to match the schema structure
      const formattedCurriculum = curriculumWeeks.map(week => ({
        weekTitle: week.weekTitle.trim(),
        weekDescription: week.weekDescription.trim(),
        topics: [week.weekDescription.trim()], // Convert description to topics array
        resources: [] // Initialize empty resources array
      }));

      // Format FAQs to ensure they match the schema structure
      const formattedFaqs = faqs.map(faq => ({
        question: faq.question.trim(),
        answer: faq.answer.trim()
      }));

      // Note: toolsTechnologies and bonusModules are already formatted in their respective handlers

      const postData = {
        ...data,
        efforts_per_Week: formattedEffortsPerWeek,
        course_videos: courseVideos || [],
        brochures: pdfBrochures || [],
        course_image: thumbnailImage || "",
        resource_videos: resourceVideos || [],
        resource_pdfs: resourcePdfs || [],
        curriculum: formattedCurriculum,
        related_courses: selectedCourses || [],
        tools_technologies: toolsTechnologies,
        bonus_modules: bonusModules,
        faqs: formattedFaqs,
        prices: formattedPrices,
        createdAt: new Date().toISOString(),
        category_type: data.category_type,
        course_category: data.class_type,
        class_type: data.class_type,
        course_mode: data.category_type,
        online_sessions: derivedOnlineSessions,
        isFree: data.category_type === "Free"
      };

      const validCategories = ["Live Courses", "Blended Courses", "Corporate Training Courses"];
      if (!validCategories.includes(postData.course_category)) {
        toast.error("Please select a valid course category");
        return;
      }

      const loadingToastId = toast.loading("Submitting course...");
      try {
        localStorage.setItem("courseData", JSON.stringify(postData));
        await postQuery({
          url: `${apiUrls?.courses?.createCourse}`,
          postData,
          onSuccess: (response) => {
            localStorage.removeItem("courseData");
            reset();
            // Clear file upload states
            setCourseVideos([]);
            setPdfBrochures([]);
            setThumbnailImage(null);
            toast.update(loadingToastId, {
              render: `Course "${data.course_title}" added successfully!`,
              type: "success",
              isLoading: false,
              autoClose: 3000,
            });
            
            // Add a second toast with more details
            setTimeout(() => {
              toast.success("You can view and edit the course in the courses list.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
            }, 500);
            
            router.push("/dashboards/admin-add-data");
          },
          onError: (error) => {
            // Log detailed error information for debugging
            console.error("API Error:", error?.response?.data);
            
            // Extract error information
            const errorData = error?.response?.data;
            let errorMessage = "Failed to add course. Please try again.";
            
            // Handle specific error cases with user-friendly messages
            if (errorData?.error) {
              if (typeof errorData.error === 'object') {
                // Handle validation errors
                const validationErrors = Object.entries(errorData.error);
                if (validationErrors.length > 0) {
                  const [field, message] = validationErrors[0];
                  errorMessage = `${message} (${field})`;
                  
                  // Special handling for common errors
                  if (field.includes('curriculum_weeks')) {
                    errorMessage = `Curriculum error: ${message}`;
                  } else if (field.includes('course_fee')) {
                    errorMessage = `Course fee error: ${message}`;
                  } else if (field.includes('course_title')) {
                    errorMessage = `Course title error: ${message}`;
                  }
                }
              } else if (typeof errorData.error === 'string') {
                errorMessage = errorData.error;
              }
            } else if (errorData?.message) {
              errorMessage = errorData.message;
            }
            
            toast.update(loadingToastId, {
              render: errorMessage,
              type: "error",
              isLoading: false,
              autoClose: 5000,
            });
          },
        });
      } catch (error) {
        toast.update(loadingToastId, {
          render: "Failed to submit course. Please try again.",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      
      // Provide more specific error messages based on the error type
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error?.message) {
        if (error.message.includes("network")) {
          errorMessage = "Network error. Please check your internet connection.";
        } else if (error.message.includes("timeout")) {
          errorMessage = "Request timed out. Please try again later.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Handlers for removing files and updating duration values
  const removeVideo = (index) => {
    const updatedVideos = [...courseVideos];
    updatedVideos.splice(index, 1);
    setCourseVideos(updatedVideos);
  };

  const removePdf = (index) => {
    setPdfBrochures((prev) => prev.filter((_, i) => i !== index));
  };

  const removeImage = () => {
    setThumbnailImage(null);
  };

  const handleSessionDurationChange = async (field, value) => {
    const newSessionDuration = { ...sessionDurationValue, [field]: value };
    setSessionDurationValue(newSessionDuration);
    if (newSessionDuration.hours || newSessionDuration.minutes) {
      const formattedDuration = `${newSessionDuration.hours || "0"} hours ${newSessionDuration.minutes || "0"} minutes`;
      try {
        setValue("session_duration", formattedDuration);
        await trigger("session_duration");
      } catch (error) {
        console.error("Validation error:", error);
      }
    }
  };

  const handleDurationChange = async (type, value) => {
    if (type === "course") {
      setCourseDurationValue(value);
      if (value.months && value.weeks) {
        const duration = `${value.months} months ${value.weeks} weeks`;
        try {
          setValue("course_duration", duration);
          await trigger("course_duration");
        } catch (error) {
          console.error("Validation error:", error);
        }
      }
    } else {
      setSessionDurationValue(value);
      if (value.hours && value.minutes) {
        const duration = `${value.hours} hours ${value.minutes} minutes`;
        try {
          setValue("session_duration", duration);
          await trigger("session_duration");
        } catch (error) {
          console.error("Validation error:", error);
        }
      }
    }
  };

  // Category Type now serves as the course mode selector
  const handleCategoryTypeChange = (e) => {
    const value = e.target.value;
    setCourseTag(value);
    setValue("category_type", value);
    if (value === "Free") {
      setCourseIsFree(true);
      setValue("course_fee", 0);
    } else {
      setCourseIsFree(false);
      setValue("course_fee", "");
      trigger("course_fee");
    }
    trigger("category_type").catch(console.error);
  };

  const handleToolsTechnologiesChange = (e) => {
    const toolsInput = e.target.value.split("\n").filter((tool) => tool.trim());
    // Convert simple strings to structured objects matching schema
    const formattedTools = toolsInput.map(tool => ({
      name: tool,
      category: 'other',
      description: '',
      logo_url: ''
    }));
    setToolsTechnologies(formattedTools);
  };

  const handleBonusModulesChange = (e) => {
    const modulesInput = e.target.value.split("\n").filter((module) => module.trim());
    // Convert simple strings to structured objects matching schema
    const formattedModules = modulesInput.map(module => ({
      title: module,
      description: '',
      resources: []
    }));
    setBonusModules(formattedModules);
  };

  // Cleanup: remove temporary storage on unmount
  useEffect(() => {
    return () => localStorage.removeItem("courseData");
  }, []);

  const addNewCurrency = () => {
    setPrices((prev) => [...prev, { id: prev.length + 1, currency: "", individual: "", batch: "", min_batch_size: 2, max_batch_size: 10, early_bird_discount: 0, group_discount: 0 }]);
  };

  const removeCurrency = (id) => {
    setPrices((prev) => prev.filter((price) => price.id !== id));
  };

  const updatePrice = (id, field, value) => {
    let numericValue = value;
    
    // Convert to number for numeric fields
    if (field !== 'currency') {
      numericValue = value === "" ? undefined : Number(value);
    }
    
    setPrices((prev) =>
      prev.map((price) => (price.id === id ? { ...price, [field]: numericValue } : price))
    );
    
    // If updating batch price, use it as the course_fee value
    if (field === "batch") {
      setValue("course_fee", numericValue);
      trigger("course_fee").catch(console.error);
    }
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="min-h-screen font-Poppins flex items-center justify-center pt-8 dark:bg-inherit dark:text-whitegrey3 bg-gray-50">
      <div className="bg-white p-8 rounded-xl dark:bg-inherit dark:text-whitegrey3 dark:border shadow-lg w-full max-w-6xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">Add Course Details</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
          {/* Basic Information Section */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Course Title */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Course Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter title"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-customGreen ${
                    errors.course_title ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("course_title")}
                />
                {errors.course_title && <p className="text-red-500 text-xs mt-1">{errors.course_title.message}</p>}
              </div>
              {/* Course Category */}
              <div className="relative">
                <label className="block text-sm font-medium mb-2">Course Category</label>
                <div className="relative" ref={dropdownRef}>
                  <div
                    className={`w-full p-3 border rounded-lg flex justify-between items-center cursor-pointer ${
                      errors?.course_category || errors?.category ? "border-red-500" : "border-gray-300"
                    } hover:border-gray-400 transition-colors`}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <span className={selectedCategory ? "text-gray-900 dark:text-gray-100" : "text-gray-500"}>
                      {selectedCategory || "Select category"}
                    </span>
                    <svg
                      className={`w-5 h-5 transition-transform ${dropdownOpen ? "transform rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {dropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                      <div className="sticky top-0 p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <input
                          type="text"
                          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                          placeholder="Search categories..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      {categories && Array.isArray(categories) ? (
                        categories
                          .filter((category) =>
                            category.name.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map((category) => (
                            <div
                              key={category.id}
                              className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${
                                selectedCategory === category.name
                                  ? "bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-400"
                                  : ""
                              }`}
                              onClick={() => {
                                handleChange(category.name);
                                setDropdownOpen(false);
                                setSearchTerm("");
                              }}
                            >
                              <div
                                className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                                  selectedCategory === category.name ? "border-customGreen" : "border-gray-400"
                                }`}
                              >
                                {selectedCategory === category.name && (
                                  <div className="w-2 h-2 rounded-full bg-customGreen" />
                                )}
                              </div>
                              <span className="text-sm font-medium">{category.name}</span>
                            </div>
                          ))
                      ) : (
                        <div className="p-3 text-gray-500 text-center">No categories available</div>
                      )}
                    </div>
                  )}
                </div>
                {(errors?.course_category || errors?.category) && (
                  <p className="text-red-500 text-xs mt-1">Category is required</p>
                )}
              </div>
              {/* Category Type now doubles as Select Course Mode */}
              <div className="relative">
                <label className="block text-sm font-medium mb-2">Category Type</label>
                <select
                  className={`w-full p-3 border rounded-lg ${errors.category_type ? "border-red-500" : "border-gray-300"}`}
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    handleCategoryTypeChange(e);
                  }}
                >
                  <option value="">Select Type</option>
                  <option value="Live">Live</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Pre-Recorded">Pre-Recorded</option>
                  <option value="Free">Free</option>
                </select>
                {errors.category_type && <p className="text-red-500 text-xs mt-1">{errors.category_type.message}</p>}
              </div>
              
            </div>
            {/* Course Duration and Sessions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  No. of Sessions <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter sessions"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-customGreen ${
                    errors.no_of_Sessions ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("no_of_Sessions")}
                />
                {errors.no_of_Sessions && (
                  <p className="text-red-500 text-xs mt-1">{errors.no_of_Sessions.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Course Duration <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Months"
                    className="w-full p-3 border rounded-lg"
                    value={courseDurationValue.months}
                    onChange={(e) =>
                      handleDurationChange("course", { ...courseDurationValue, months: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Weeks"
                    className="w-full p-3 border rounded-lg"
                    value={courseDurationValue.weeks}
                    onChange={(e) =>
                      handleDurationChange("course", { ...courseDurationValue, weeks: e.target.value })
                    }
                  />
                </div>
                {errors.course_duration && (
                  <p className="text-red-500 text-xs mt-1">{errors.course_duration.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Session Duration <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Hours"
                    className={`w-full p-3 border rounded-lg ${
                      errors.session_duration ? "border-red-500" : "border-gray-300"
                    }`}
                    value={sessionDurationValue.hours}
                    onChange={(e) => handleSessionDurationChange("hours", e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Minutes"
                    className={`w-full p-3 border rounded-lg ${
                      errors.session_duration ? "border-red-500" : "border-gray-300"
                    }`}
                    value={sessionDurationValue.minutes}
                    onChange={(e) => handleSessionDurationChange("minutes", e.target.value)}
                  />
                </div>
                {errors.session_duration && (
                  <p className="text-red-500 text-xs mt-1">{errors.session_duration.message}</p>
                )}
              </div>
            </div>
          </div>
          {/* Course Details Section */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Course Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Course Grade <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-customGreen ${
                    errors.course_grade ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("course_grade")}
                  onChange={(e) => setCourseGrade(e.target.value)}
                  value={courseGrade}
                >
                  <option value="">Select Grade</option>
                  <option value="Preschool">Preschool</option>
                  <option value="Grade 1-2">Grade 1-2</option>
                  <option value="Grade 3-4">Grade 3-4</option>
                  <option value="Grade 5-6">Grade 5-6</option>
                  <option value="Grade 7-8">Grade 7-8</option>
                  <option value="Grade 9-10">Grade 9-10</option>
                  <option value="Grade 11-12">Grade 11-12</option>
                  <option value="UG - Graduate - Professionals">UG - Graduate - Professionals</option>
                </select>
                {errors.course_grade && (
                  <p className="text-red-500 text-xs mt-1">{errors.course_grade.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Certificate <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-customGreen ${
                    errors.is_Certification ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("is_Certification")}
                  onChange={(e) => setCertification(e.target.value)}
                  value={certification}
                >
                  <option value="">Select...</option>
                  {["Yes", "No"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.is_Certification && (
                  <p className="text-red-500 text-xs mt-1">{errors.is_Certification.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Class Type <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-customGreen ${
                    errors.class_type ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("class_type")}
                  onChange={(e) => setClassType(e.target.value)}
                  value={classType}
                >
                  <option value="">Select...</option>
                  <option value="Live Courses">Live Courses</option>
                  <option value="Blended Courses">Blended Courses</option>
                  <option value="Corporate Training Courses">Corporate Training Courses</option>
                </select>
                {errors.class_type && (
                  <p className="text-red-500 text-xs mt-1">{errors.class_type.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Assignments <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-customGreen ${
                    errors.is_Assignments ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("is_Assignments")}
                  onChange={(e) => setAssignments(e.target.value)}
                  value={assignments}
                >
                  <option value="">Select...</option>
                  {["Yes", "No"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.is_Assignments && (
                  <p className="text-red-500 text-xs mt-1">{errors.is_Assignments.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Projects <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-customGreen ${
                    errors.is_Projects ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("is_Projects")}
                  onChange={(e) => setProjects(e.target.value)}
                  value={projects}
                >
                  <option value="">Select...</option>
                  {["Yes", "No"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.is_Projects && (
                  <p className="text-red-500 text-xs mt-1">{errors.is_Projects.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Quizzes <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-customGreen ${
                    errors.is_Quizes ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("is_Quizes")}
                  onChange={(e) => setQuizzes(e.target.value)}
                  value={quizzes}
                >
                  <option value="">Select...</option>
                  {["Yes", "No"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.is_Quizes && (
                  <p className="text-red-500 text-xs mt-1">{errors.is_Quizes.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Efforts Per Week <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Minimum Hours</label>
                    <input
                      type="number"
                      placeholder="Min hours"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-customGreen ${
                        errors.min_hours_per_week ? "border-red-500" : "border-gray-300"
                      }`}
                      {...register("min_hours_per_week")}
                    />
                    {errors.min_hours_per_week && (
                      <p className="text-red-500 text-xs mt-1">{errors.min_hours_per_week.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Maximum Hours</label>
                    <input
                      type="number"
                      placeholder="Max hours"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-customGreen ${
                        errors.max_hours_per_week ? "border-red-500" : "border-gray-300"
                      }`}
                      {...register("max_hours_per_week")}
                    />
                    {errors.max_hours_per_week && (
                      <p className="text-red-500 text-xs mt-1">{errors.max_hours_per_week.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">
                Course Description <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Write description..."
                rows="4"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-customGreen ${
                  errors.course_description ? "border-red-500" : "border-gray-300"
                }`}
                {...register("course_description")}
              ></textarea>
              {errors.course_description && (
                <p className="text-red-500 text-xs mt-1">{errors.course_description.message}</p>
              )}
            </div>
          </div>
          {/* Pricing Section */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              Pricing Information
              <Tooltip content="Set up your course pricing structure">
                <HelpCircle className="w-4 h-4 ml-2 text-gray-400 cursor-help" />
              </Tooltip>
            </h3>
            <div className="space-y-6">
              {prices.map((price) => (
                <div key={price.id} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex-1">
                      <select
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-customGreen dark:bg-gray-600 dark:border-gray-500"
                        value={price.currency}
                        onChange={(e) => updatePrice(price.id, "currency", e.target.value)}
                        disabled={courseIsFree}
                      >
                        <option value="">Select Currency</option>
                        {currencyOptions.map((currency) => (
                          <option key={currency.code} value={currency.code}>
                            {currency.symbol} {currency.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {prices.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCurrency(price.id)}
                        className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="relative">
                      <label className="block text-sm font-medium mb-2">Individual Price (Per Person)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">
                          {price.currency ? getCurrencySymbol(price.currency) : <DollarSign className="w-4 h-4 text-gray-400" />}
                        </span>
                        <input
                          type="number"
                          placeholder="0.00"
                          className={`w-full pl-8 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-customGreen transition-all ${
                            courseIsFree || !price.currency ? "bg-gray-100 cursor-not-allowed" : ""
                          }`}
                          disabled={courseIsFree || !price.currency}
                          value={price.individual ?? ""}
                          onChange={(e) => updatePrice(price.id, "individual", e.target.value)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Individual enrollment price</p>
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium mb-2">Batch Price (Per Person)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">
                          {price.currency ? getCurrencySymbol(price.currency) : <DollarSign className="w-4 h-4 text-gray-400" />}
                        </span>
                        <input
                          type="number"
                          placeholder="0.00"
                          className={`w-full pl-8 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-customGreen transition-all ${
                            courseIsFree || !price.currency ? "bg-gray-100 cursor-not-allowed" : ""
                          }`}
                          disabled={courseIsFree || !price.currency}
                          value={price.batch ?? ""}
                          onChange={(e) => updatePrice(price.id, "batch", e.target.value)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Price per person in a batch enrollment</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Batch Size</label>
                      <div className="flex space-x-2">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1">Min</label>
                          <input
                            type="number"
                            placeholder="2"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-customGreen"
                            value={price.min_batch_size}
                            onChange={(e) => updatePrice(price.id, "min_batch_size", e.target.value)}
                            min="2"
                            disabled={courseIsFree}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1">Max</label>
                          <input
                            type="number"
                            placeholder="10"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-customGreen"
                            value={price.max_batch_size}
                            onChange={(e) => updatePrice(price.id, "max_batch_size", e.target.value)}
                            min={price.min_batch_size || 2}
                            disabled={courseIsFree}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Discounts (%)</label>
                      <div className="flex space-x-2">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1">Early Bird</label>
                          <input
                            type="number"
                            placeholder="0"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-customGreen"
                            value={price.early_bird_discount}
                            onChange={(e) => updatePrice(price.id, "early_bird_discount", e.target.value)}
                            min="0"
                            max="100"
                            disabled={courseIsFree}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1">Group</label>
                          <input
                            type="number"
                            placeholder="0"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-customGreen"
                            value={price.group_discount}
                            onChange={(e) => updatePrice(price.id, "group_discount", e.target.value)}
                            min="0"
                            max="100"
                            disabled={courseIsFree}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {!courseIsFree && (
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Individual Price:</span>
                        <span className="font-medium">
                          {price.currency && price.individual ? `${getCurrencySymbol(price.currency)}${price.individual}` : '-'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600">Batch Price (per person):</span>
                        <span className="font-medium text-customGreen">
                          {price.currency && price.batch ? `${getCurrencySymbol(price.currency)}${price.batch}` : '-'}
                        </span>
                      </div>
                      {price.early_bird_discount > 0 && (
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-gray-600">With Early Bird Discount:</span>
                          <span className="font-medium text-customGreen">
                            {price.currency && price.batch ? 
                              `${getCurrencySymbol(price.currency)}${(price.batch * (1 - price.early_bird_discount/100)).toFixed(2)}` : '-'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {!courseIsFree && (
                <button
                  type="button"
                  onClick={addNewCurrency}
                  className="flex items-center gap-2 text-customGreen hover:text-green-700 transition-colors mt-4"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Another Currency
                </button>
              )}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 text-sm text-blue-800">
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Note:</span> The batch price will be used as the course fee value.
                </p>
              </div>
            </div>
          </div>
          {/* Upload Section */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              Course Media
              <Tooltip content="Upload course videos, brochures, and thumbnail">
                <HelpCircle className="w-4 h-4 ml-2 text-gray-400 cursor-help" />
              </Tooltip>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Course Video Upload */}
              <div className="w-full">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 10L21 7V17L14 14M14 10V14M14 10L3 7V17L14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Add Course Videos
                </label>
                <div className={`border-2 rounded-lg p-4 transition-all duration-300 relative ${courseVideos.length > 0 ? "border-green-500 bg-green-50" : "border-dashed border-gray-300 hover:border-gray-400"}`}>
                  <div className="text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m0 0v4a4 4 0 004 4h20a4 4 0 004-4V28m-4-4l5-5m0 0l-5-5m5 5H28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500">
                          <span>Upload videos</span>
                          <input type="file" multiple accept="video/*" className="sr-only" onChange={handleVideoUpload} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">MP4, WebM, Ogg</p>
                    </div>
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
                          <button type="button" onClick={() => removeVideo(index)} className="text-red-500 hover:text-red-700 p-1">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* PDF Brochure Upload */}
              <div className="w-full">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 21H17C19.2091 21 21 19.2091 21 17V7C21 4.79086 19.2091 3 17 3H7C4.79086 3 3 4.79086 3 7V17C3 19.2091 4.79086 21 7 21Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M7 16.8L9.5 14.3L11.999 16.799L16.5 12.3L17.5 13.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Add PDF Brochure
                </label>
                <div className={`border-2 rounded-lg p-4 transition-all duration-300 relative ${pdfBrochures.length > 0 ? "border-green-500 bg-green-50" : "border-dashed border-gray-300 hover:border-gray-400"}`}>
                  <div className="text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m0 0v4a4 4 0 004 4h20a4 4 0 004-4V28m-4-4l5-5m0 0l-5-5m5 5H28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500">
                          <span>Upload PDF</span>
                          <input type="file" multiple accept=".pdf" className="sr-only" onChange={handlePdfUpload} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">PDF files</p>
                    </div>
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
                          <button type="button" onClick={() => removePdf(index)} className="text-red-500 hover:text-red-700 p-1">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* Thumbnail Image Upload */}
              <div className="w-full">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 16L8.586 11.414C9.367 10.633 10.633 10.633 11.414 11.414L16 16M14 14L15.586 12.414C16.367 11.633 17.633 11.633 18.414 12.414L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6 4V18C4 19.1046 4.89543 20 6 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Add Thumbnail Image
                </label>
                <div className={`border-2 rounded-lg p-4 transition-all duration-300 relative ${thumbnailImage ? "border-green-500 bg-green-50" : "border-dashed border-gray-300 hover:border-gray-400"}`}>
                  <div className="text-center">
                    {thumbnailImage ? (
                      <div className="relative">
                        <img src={thumbnailImage} alt="Thumbnail" className="mx-auto h-32 w-auto rounded-lg object-cover" />
                        <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m0 0v4a4 4 0 004 4h20a4 4 0 004-4V28m-4-4l5-5m0 0l-5-5m5 5H28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                          <label className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500">
                            <span>Upload image</span>
                            <input type="file" accept="image/*" className="sr-only" onChange={handleImageUpload} />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Curriculum Section */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm mt-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Course Curriculum</h3>
              <button
                type="button"
                onClick={() => {
                  setCurriculumWeeks([...curriculumWeeks, { weekTitle: "", weekDescription: "" }]);
                }}
                className="flex items-center gap-2 text-customGreen hover:text-green-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Week
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Add the curriculum structure week by week. Each week should have a title and a detailed description of what will be covered.
            </p>
            <div className="space-y-4">
              {curriculumWeeks.map((week, index) => (
                <div key={index} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 mr-4">
                      <label className="block text-sm font-medium mb-2">Week Title</label>
                      <input
                        type="text"
                        placeholder="Week Title (e.g., Weeks 1-2: Introduction)"
                        className="w-full p-2 border rounded-lg"
                        value={week.weekTitle}
                        onChange={(e) => {
                          const updated = [...curriculumWeeks];
                          updated[index].weekTitle = e.target.value;
                          setCurriculumWeeks(updated);
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = curriculumWeeks.filter((_, i) => i !== index);
                        setCurriculumWeeks(updated);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <label className="block text-sm font-medium mb-2">Week Description</label>
                  <textarea
                    placeholder="Enter week description (detailed content of what will be covered)"
                    rows="4"
                    className="w-full p-2 border rounded-lg"
                    value={week.weekDescription}
                    onChange={(e) => {
                      const updated = [...curriculumWeeks];
                      updated[index].weekDescription = e.target.value;
                      setCurriculumWeeks(updated);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Tools & Technologies Section */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm mt-6">
            <h3 className="text-xl font-semibold mb-6">Tools & Technologies</h3>
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                <label className="block text-sm font-medium mb-2">
                  Tools & Technologies <span className="text-gray-500">(one per line)</span>
                </label>
                <textarea
                  placeholder="Enter tools and technologies..."
                  rows="4"
                  className="w-full p-2 border rounded-lg"
                  value={toolsTechnologies.map(tool => tool.name).join("\n")}
                  onChange={handleToolsTechnologiesChange}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Each tool will be categorized as 'other' by default. Categories will be assigned by the system or can be updated later.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                <label className="block text-sm font-medium mb-2">
                  Bonus Modules <span className="text-gray-500">(one per line)</span>
                </label>
                <textarea
                  placeholder="Enter bonus modules..."
                  rows="4"
                  className="w-full p-2 border rounded-lg"
                  value={bonusModules.map(module => module.title).join("\n")}
                  onChange={handleBonusModulesChange}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Descriptions and resources for each module can be added later.
                </p>
              </div>
            </div>
          </div>
          {/* FAQs Section */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm mt-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>
              <button
                type="button"
                onClick={() => setFaqs([...faqs, { question: "", answer: "" }])}
                className="flex items-center gap-2 text-customGreen hover:text-green-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add FAQ
              </button>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="w-full space-y-2">
                      <input
                        type="text"
                        placeholder="Question..."
                        className="w-full p-2 border rounded-lg"
                        value={faq.question}
                        onChange={(e) => {
                          const updated = [...faqs];
                          updated[index].question = e.target.value;
                          setFaqs(updated);
                        }}
                      />
                      <textarea
                        placeholder="Answer..."
                        rows="3"
                        className="w-full p-2 border rounded-lg"
                        value={faq.answer}
                        onChange={(e) => {
                          const updated = [...faqs];
                          updated[index].answer = e.target.value;
                          setFaqs(updated);
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = faqs.filter((_, i) => i !== index);
                        setFaqs(updated);
                      }}
                      className="ml-4 text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Note: For additional queries, please contact our support team.
            </p>
          </div>
          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button type="submit" className="px-6 py-3 bg-customGreen text-white rounded-lg hover:bg-green-600 transition-colors">
              Submit Course
            </button>
          </div>
        </form>
      </div>
      {isResourceModalOpen && (
        <ResourceUploadModal
          onClose={() => setResourceModalOpen(false)}
          resourceVideos={resourceVideos}
          setResourceVideos={setResourceVideos}
          resourcePdfs={resourcePdfs}
          setResourcePdfs={setResourcePdfs}
        />
      )}
      {isCurriculumModalOpen && (
        <CurriculumModal onClose={() => setCurriculumModalOpen(false)} curriculum={curriculum} setCurriculum={setCurriculum} />
      )}
    </div>
  );
};

export default AddCourse;