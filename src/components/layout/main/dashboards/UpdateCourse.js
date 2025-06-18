"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { Upload, HelpCircle, DollarSign } from "lucide-react";

// Custom hooks and configs
import usePostQuery from "@/hooks/postQuery.hook";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";

// Components
import Preloader from "@/components/shared/others/Preloader";
import ResourceUploadModal from "./ResourceUploadModal";
import CurriculumModal from "./CurriculumModal";
import CategorySelect from "./CategorySelect";
import SelectMultipleCourses from "./SelectMultipleCourses";
import Tooltip from "@/components/shared/others/Tooltip";
import Cookies from "js-cookie";
import { getCourseById } from "@/apis/course/course";

// Optimized validation schema with all fields optional
const schema = yup.object({
  course_category: yup.string(),
  category_type: yup
    .string()
    .oneOf(["Live", "Hybrid", "Pre-Recorded", "Free"]),
  course_title: yup
    .string()
    .trim()
    .max(100, "Title too long"),
  no_of_Sessions: yup
    .number()
    .typeError("Must be a number")
    .positive("Must be positive")
    .integer("Must be whole number"),
  course_duration: yup
    .string()
    .matches(/^\d+ months \d+ weeks$/, "Invalid duration format"),
  session_duration: yup
    .string()
    .matches(/^\d+ hours \d+ minutes$/, "Invalid duration format"),
  course_description: yup
    .string(),
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
        .min(0, "Course fee cannot be negative"),
  }),
  course_grade: yup.string(),
  is_Certification: yup
    .string()
    .oneOf(["Yes", "No"]),
  is_Assignments: yup
    .string()
    .oneOf(["Yes", "No"]),
  is_Projects: yup
    .string()
    .oneOf(["Yes", "No"]),
  class_type: yup
    .string()
    .oneOf(["Live Courses", "Blended Courses", "Corporate Training Courses"]),
  min_hours_per_week: yup
    .number()
    .typeError("Must be a number")
    .positive("Must be positive")
    .integer("Must be whole number"),
  max_hours_per_week: yup
    .number()
    .typeError("Must be a number")
    .positive("Must be positive")
    .integer("Must be whole number")
    .min(yup.ref('min_hours_per_week'), "Maximum hours must be greater than minimum hours"),
  is_Quizes: yup
    .string()
    .oneOf(["Yes", "No"]),
  related_courses: yup.array().of(yup.string()).default([]),
});

export default function UpdateCourse() {
  const router = useRouter();
  const { courseId } = useParams();

  // API hooks
  const { postQuery, loading: postLoading } = usePostQuery();
  const { getQuery, loading: getLoading } = useGetQuery();
  const dropdownRef = useRef(null);

  // Local states for form data, uploads, and additional details
  const [selectedCategory, setSelectedCategory] = useState("");
  const [courseVideos, setCourseVideos] = useState([]);
  const [pdfBrochures, setPdfBrochures] = useState([]);
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [courseDurationValue, setCourseDurationValue] = useState({ months: "", weeks: "" });
  const [sessionDurationValue, setSessionDurationValue] = useState({ hours: "", minutes: "" });
  const [isResourceModalOpen, setResourceModalOpen] = useState(false);
  const [resourceVideos, setResourceVideos] = useState([]);
  const [resourcePdfs, setResourcePdfs] = useState([]);
  const [isCurriculumModalOpen, setCurriculumModalOpen] = useState(false);
  const [curriculumWeeks, setCurriculumWeeks] = useState([]);
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
  const [toolsTechnologies, setToolsTechnologies] = useState([]);
  const [bonusModules, setBonusModules] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [classType, setClassType] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    trigger,
    watch,
    formState: { errors, touchedFields, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      related_courses: [],
    },
    mode: "onBlur",
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

  /**
   * Fetch all categories for the category dropdown.
   */
  const fetchAllCategories = async () => {
    try {
      await getQuery({
        url: apiUrls.categories.getAllCategories,
        onSuccess: (res) => {
          setCategories(res?.data || []);
        },
        onFail: (err) => {
          showToast.error("Failed to fetch categories");
          console.error("Fetch categories error:", err);
        },
      });
    } catch (err) {
      console.error("Error fetching categories:", err);
      showToast.error("Could not fetch categories");
    }
  };

  /**
   * Fetch course details by ID and populate the form.
   */
  const fetchCourseDetails = async () => {
    try {
      await getQuery({
        url: getCourseById(courseId),
        onSuccess: (res) => {
          const courseData = res.data;
          if (!courseData) return;
          
          // Set form values
          setValue("course_title", courseData.course_title || "");
          setValue("course_category", courseData.course_category || "");
          setValue("category_type", courseData.category_type || "");
          setValue("no_of_Sessions", courseData.no_of_Sessions || 0);
          setValue("course_duration", courseData.course_duration || "");
          setValue("session_duration", courseData.session_duration || "");
          setValue("course_description", courseData.course_description || "");
          setValue("course_fee", courseData.course_fee || 0);
          setValue("course_grade", courseData.course_grade || "");
          setValue("is_Certification", courseData.is_Certification || "No");
          setValue("is_Assignments", courseData.is_Assignments || "No");
          setValue("is_Projects", courseData.is_Projects || "No");
          setValue("is_Quizes", courseData.is_Quizes || "No");
          setValue("min_hours_per_week", courseData.min_hours_per_week || 0);
          setValue("max_hours_per_week", courseData.max_hours_per_week || 0);
          setValue("related_courses", courseData.related_courses || []);
          
          // Update local states if needed
          setSelectedCategory(courseData.course_category || "");
          setCourseVideos(courseData.course_videos || []);
          setPdfBrochures(courseData.brochures || []);
          setThumbnailImage(courseData.course_image || null);
          setResourceVideos(courseData.resource_videos || []);
          setResourcePdfs(courseData.resource_pdfs || []);
          setCurriculumWeeks(courseData.curriculum || []);
          setFaqs(courseData.faqs || []);
        },
        onFail: (err) => {
          console.error("Error Fetching Course details:", err);
          showToast.error("Could not load course details");
        },
      });
    } catch (err) {
      console.error("Error fetching course details:", err);
      showToast.error("Could not load course details");
    }
  };

  // On mount, fetch categories and course details and handle click outside dropdown
  useEffect(() => {
    fetchAllCategories();
    fetchCourseDetails();
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [courseId]);

  // Add a useEffect to log selectedCategory changes
  useEffect(() => {
    console.log('Selected category updated:', selectedCategory);
  }, [selectedCategory]);

  /**
   * On form submit, format data and update course.
   */
  const onSubmit = async (formData) => {
    try {
      console.log('Form data to submit:', formData);
      console.log('Form touched fields:', touchedFields);
      console.log('Current prices state:', prices);
      console.log('Current curriculum state:', curriculumWeeks);
      console.log('Current tools state:', toolsTechnologies);
      console.log('Current bonus modules state:', bonusModules);
      console.log('Current FAQs state:', faqs);
      
      // Only include fields with values in the payload
      const payloadData = {};
      
      // Process basic form fields - only include fields with values
      Object.keys(formData).forEach(key => {
        if (formData[key] !== undefined && formData[key] !== null && formData[key] !== '') {
          payloadData[key] = formData[key];
        }
      });
      
      // Ensure course_category is set
      console.log('Form course_category:', formData.course_category);
      console.log('Selected category state:', selectedCategory);
      
      // Always include course_category from either form data or state
      if (selectedCategory) {
        payloadData.course_category = selectedCategory;
        console.log('Setting course_category in payload to:', selectedCategory);
      }
      
      // Format the efforts per week if both values are provided
      if (formData.min_hours_per_week && formData.max_hours_per_week) {
        payloadData.efforts_per_Week = `${formData.min_hours_per_week} - ${formData.max_hours_per_week} hours / week`;
      }
      
      // Format prices for API - remove id which is only for UI
      const formattedPrices = prices.map(({ id, ...priceData }) => {
        // Only include price fields that have values
        const cleanPriceData = {};
        Object.keys(priceData).forEach(key => {
          if (priceData[key] !== undefined && priceData[key] !== null && priceData[key] !== '') {
            cleanPriceData[key] = priceData[key];
          }
        });
        return cleanPriceData;
      });
      
      // Only add prices if we have any valid price data
      if (formattedPrices.length > 0) {
        payloadData.prices = formattedPrices;
      }

      // Derive online sessions details from the "No. of Sessions" and "Session Duration" fields.
      if (formData.no_of_Sessions && formData.session_duration) {
        payloadData.online_sessions = {
          count: formData.no_of_Sessions,
          duration: formData.session_duration,
        };
      }

      // Format curriculum if we have curriculum weeks
      if (curriculumWeeks.length > 0) {
        // Validate curriculum weeks - only those with both title and description
        const validWeeks = curriculumWeeks.filter(
          week => week.weekTitle.trim() && week.weekDescription.trim()
        );
        
        if (validWeeks.length > 0) {
          // Format curriculum to match the schema structure
          const formattedCurriculum = validWeeks.map(week => ({
            weekTitle: week.weekTitle.trim(),
            weekDescription: week.weekDescription.trim(),
            topics: [week.weekDescription.trim()], // Convert description to topics array
            resources: [] // Initialize empty resources array
          }));
          
          payloadData.curriculum = formattedCurriculum;
        }
      }

      // Add FAQs only if we have valid ones
      if (faqs.length > 0) {
        const validFaqs = faqs.filter(faq => faq.question.trim() && faq.answer.trim());
        if (validFaqs.length > 0) {
          payloadData.faqs = validFaqs.map(faq => ({
            question: faq.question.trim(),
            answer: faq.answer.trim()
          }));
        }
      }

      // Add course duration if both values are present
      if (courseDurationValue.months && courseDurationValue.weeks) {
        const finalCourseDuration = `${courseDurationValue.months} months ${courseDurationValue.weeks} weeks`;
        payloadData.course_duration = finalCourseDuration;
      }
      
      // Add session duration if both values are present
      if (sessionDurationValue.hours && sessionDurationValue.minutes) {
        const finalSessionDuration = `${sessionDurationValue.hours} hours ${sessionDurationValue.minutes} minutes`;
        payloadData.session_duration = finalSessionDuration;
      }

      // Add tools, modules, and media only if they exist
      if (toolsTechnologies.length > 0) {
        payloadData.tools_technologies = toolsTechnologies;
      }
      
      if (bonusModules.length > 0) {
        payloadData.bonus_modules = bonusModules;
      }
      
      if (courseVideos.length > 0) {
        payloadData.course_videos = courseVideos;
      }
      
      if (pdfBrochures.length > 0) {
        payloadData.brochures = pdfBrochures;
      }
      
      if (thumbnailImage) {
        payloadData.course_image = thumbnailImage;
      }
      
      if (resourceVideos.length > 0) {
        payloadData.resource_videos = resourceVideos;
      }
      
      if (resourcePdfs.length > 0) {
        payloadData.resource_pdfs = resourcePdfs;
      }
      
      if (selectedCourses.length > 0) {
        payloadData.related_courses = selectedCourses;
      }
      
      // Always include updatedAt
      payloadData.updatedAt = new Date().toISOString();
      
      // Set category_type, class_type, and course_mode if available
      if (formData.category_type) {
        payloadData.category_type = formData.category_type;
        payloadData.course_mode = formData.category_type;
        payloadData.isFree = formData.category_type === "Free";
      }
      
      if (formData.class_type) {
        payloadData.class_type = formData.class_type;
      }

      // Make sure we still set course_category from either form data or state
      if (formData.course_category || selectedCategory) {
        payloadData.course_category = formData.course_category || selectedCategory;
      }

      const loadingToastId = showToast.loading("Updating course...");
      try {
        await postQuery({
          url: `${apiUrls?.courses?.updateCourse}/${courseId}`,
          postData: payloadData,
          onSuccess: () => {
            toast.update(loadingToastId, {
              render: `Course updated successfully!`,
              type: "success",
              isLoading: false,
              autoClose: 3000,
            });
            setTimeout(() => {
              showToast.success("You can view the updated course in the courses list.", { position: "top-right", autoClose: 5000 });
            }, 500);
            router.push("/dashboards/admin-listofcourse");
          },
          onError: (error) => {
            console.error("API Error:", error?.response?.data);
            const errorData = error?.response?.data;
            let errorMessage = "Failed to update course. Please try again.";
            
            if (errorData?.error) {
              if (typeof errorData.error === 'object') {
                const validationErrors = Object.entries(errorData.error);
                if (validationErrors.length > 0) {
                  const [field, message] = validationErrors[0];
                  errorMessage = `${message} (${field})`;
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
          render: "Failed to update course. Please try again.",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
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
      
      showToast.error(errorMessage, { position: "top-right", autoClose: 5000 });
    }
  };

  // File upload handlers
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
                showToast.error("Video upload failed. Please try again.");
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
                showToast.error("PDF upload failed. Please try again.");
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
          // Use the complete data URL instead of splitting it
          const base64 = reader.result;
          const postData = { base64String: base64, fileType: "image" };
          await postQuery({
            url: apiUrls?.upload?.uploadImage,
            postData,
            onSuccess: (data) => {
              setThumbnailImage(data?.data);
              setValue("upload_image", data?.data);
            },
            onError: (error) => {
              showToast.error("Image upload failed. Please try again.");
            },
          });
        };
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  // Duration handlers
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

  // Category type (course mode) handler
  const handleCategoryTypeChange = (e) => {
    const value = e.target.value;
    console.log('Category Type changed to:', value);
    setCourseTag(value);
    setSelectedType(value); // Ensure we set this again for redundancy
    setValue("category_type", value);
    
    // Also set course_mode for compatibility
    setValue("course_mode", value);
    
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
    const formattedModules = modulesInput.map(module => ({
      title: module,
      description: '',
      resources: []
    }));
    setBonusModules(formattedModules);
  };

  const handleCourse = (course) => {
    setSelectedCourses(course);
    setValue("related_courses", course);
  };

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

  const addNewCurrency = () => {
    setPrices((prev) => [
      ...prev,
      { id: prev.length + 1, currency: "", individual: "", batch: "", min_batch_size: 2, max_batch_size: 10, early_bird_discount: 0, group_discount: 0 }
    ]);
  };

  const removeCurrency = (id) => {
    setPrices((prev) => prev.filter((price) => price.id !== id));
  };

  const updatePrice = (id, field, value) => {
    let numericValue = value;
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

  // Add a handleChange function to match AddCourse.js
  const handleChange = async (category) => {
    console.log('Setting course category to:', category);
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

  // Handle direct API submission
  const submitCourseData = async (formData) => {
    const loadingToastId = showToast.loading("Updating course...");
    
    // Prepare the direct payload manually
    const directPayload = {
      ...formData,
      // Key category and type fields
      category_type: formData.category_type || selectedType,
      course_mode: formData.category_type || selectedType,
      class_type: formData.class_type || classType,
      course_category: formData.course_category || selectedCategory, // Changed from class_type to selectedCategory
      
      // Add tools, bonus modules and FAQs directly
      tools_technologies: toolsTechnologies,
      bonus_modules: bonusModules,
      faqs: faqs.filter(faq => faq.question && faq.answer).map(faq => ({
        question: faq.question,
        answer: faq.answer
      })),
      
      // Add curriculum directly
      curriculum: curriculumWeeks.filter(week => week.weekTitle && week.weekDescription).map(week => ({
        weekTitle: week.weekTitle,
        weekDescription: week.weekDescription,
        topics: [week.weekDescription],
        resources: []
      })),
      
      // Add course media and resources
      prices: prices.map(({ id, ...price }) => price),
      course_videos: courseVideos || [],
      brochures: pdfBrochures || [],
      course_image: thumbnailImage || "",
      resource_videos: resourceVideos || [],
      resource_pdfs: resourcePdfs || [],
      related_courses: selectedCourses || [],
      
      // Add course duration and efforts
      course_duration: `${courseDurationValue.months || 0} months ${courseDurationValue.weeks || 0} weeks`,
      session_duration: `${sessionDurationValue.hours || 0} hours ${sessionDurationValue.minutes || 0} minutes`,
      efforts_per_Week: `${formData.min_hours_per_week || 0} - ${formData.max_hours_per_week || 0} hours / week`,
      
      // Always include updated timestamp
      updatedAt: new Date().toISOString()
    };
    
    console.log("Submitting direct payload:", directPayload);
    console.log("Course category being submitted:", directPayload.course_category);
    
    try {
      await postQuery({
        url: `${apiUrls?.courses?.updateCourse}/${courseId}`,
        postData: directPayload,
        onSuccess: () => {
          toast.update(loadingToastId, {
            render: "Course updated successfully!",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
          router.push("/dashboards/admin-courses-list");
        },
        onError: (error) => {
          console.error("Update API Error:", error);
          toast.update(loadingToastId, {
            render: "Failed to update course. Please try again.",
            type: "error",
            isLoading: false,
            autoClose: 5000,
          });
        }
      });
    } catch (error) {
      console.error("Update submission error:", error);
      toast.update(loadingToastId, {
        render: "An error occurred during update. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  if (getLoading || postLoading) {
    return <Preloader />;
  }

  return (
    <div className="min-h-screen font-Poppins flex items-center justify-center pt-8 dark:bg-inherit dark:text-whitegrey3 bg-gray-50">
      <div className="bg-white p-8 rounded-xl dark:bg-inherit dark:text-whitegrey3 dark:border shadow-lg w-full max-w-6xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">Update Course Details</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
            <p className="text-blue-800 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Note:</span> All fields are optional when updating a course. Only fields with values will be updated.
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
          {/* Basic Information */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Course Title</label>
                <input
                  type="text"
                  placeholder="Enter title"
                  className={`w-full p-3 border rounded-lg ${errors.course_title && touchedFields.course_title ? "border-red-500" : "border-gray-300"}`}
                  {...register("course_title")}
                />
                {errors.course_title && touchedFields.course_title && <p className="text-red-500 text-xs mt-1">{errors.course_title.message}</p>}
              </div>
              <div className="relative" ref={dropdownRef}>
                <label className="block text-sm font-medium mb-2">Course Category</label>
                <div
                  className={`w-full p-3 border rounded-lg flex justify-between items-center cursor-pointer ${
                    errors?.course_category && touchedFields.course_category ? "border-red-500" : "border-gray-300"
                  } hover:border-gray-400 transition-colors`}
                  onClick={() => {
                    console.log('Opening category dropdown, current selection:', selectedCategory);
                    setDropdownOpen(!dropdownOpen);
                  }}
                >
                  <span className={selectedCategory ? "text-gray-900 dark:text-gray-100" : "text-gray-500"}>
                    {selectedCategory || "Select category"}
                  </span>
                  {/* Add debug comment */}
                  {/* Current selected category: {selectedCategory} */}
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
                  <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    <div className="sticky top-0 p-2 bg-white dark:bg-gray-800 border-b border-gray-200">
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    {categories && categories.length > 0 ? (
                      categories.filter((cat) => cat.category_name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((catObj) => (
                          <div
                            key={catObj._id}
                            className={`p-3 cursor-pointer hover:bg-gray-50 flex items-center ${selectedCategory === catObj.category_name ? "bg-green-50 text-green-600" : ""}`}
                            onClick={() => { handleChange(catObj.category_name); }}
                          >
                            {catObj.category_image && (
                              <Image src={catObj.category_image} alt={catObj.category_name} width={32} height={32} className="rounded-full mr-3" />
                            )}
                            <span className="text-sm font-medium">{catObj.category_name}</span>
                          </div>
                        ))
                    ) : (
                      <div className="p-3 text-gray-500 text-center">No categories available</div>
                    )}
                  </div>
                )}
                {errors.course_category && touchedFields.course_category && <p className="text-red-500 text-xs mt-1">Category is required</p>}
              </div>
              <div className="relative">
                <label className="block text-sm font-medium mb-2">Category Type</label>
                <select
                  className={`w-full p-3 border rounded-lg ${errors.category_type && touchedFields.category_type ? "border-red-500" : "border-gray-300"}`}
                  value={selectedType}
                  onChange={(e) => { setSelectedType(e.target.value); handleCategoryTypeChange(e); }}
                >
                  <option value="">Select Type</option>
                  <option value="Live">Live</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Pre-Recorded">Pre-Recorded</option>
                  <option value="Free">Free</option>
                </select>
                {errors.category_type && touchedFields.category_type && <p className="text-red-500 text-xs mt-1">{errors.category_type.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  No. of Sessions
                </label>
                <input
                  type="number"
                  placeholder="Enter sessions"
                  className={`w-full p-3 border rounded-lg ${errors.no_of_Sessions ? "border-red-500" : "border-gray-300"}`}
                  {...register("no_of_Sessions")}
                />
                {errors.no_of_Sessions && <p className="text-red-500 text-xs mt-1">{errors.no_of_Sessions.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Course Duration
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Months"
                    className="w-full p-3 border rounded-lg"
                    value={courseDurationValue.months}
                    onChange={(e) => handleDurationChange("course", { ...courseDurationValue, months: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Weeks"
                    className="w-full p-3 border rounded-lg"
                    value={courseDurationValue.weeks}
                    onChange={(e) => handleDurationChange("course", { ...courseDurationValue, weeks: e.target.value })}
                  />
                </div>
                {errors.course_duration && <p className="text-red-500 text-xs mt-1">{errors.course_duration.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Session Duration
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Hours"
                    className={`w-full p-3 border rounded-lg ${errors.session_duration ? "border-red-500" : "border-gray-300"}`}
                    value={sessionDurationValue.hours}
                    onChange={(e) => handleSessionDurationChange("hours", e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Minutes"
                    className={`w-full p-3 border rounded-lg ${errors.session_duration ? "border-red-500" : "border-gray-300"}`}
                    value={sessionDurationValue.minutes}
                    onChange={(e) => handleSessionDurationChange("minutes", e.target.value)}
                  />
                </div>
                {errors.session_duration && <p className="text-red-500 text-xs mt-1">{errors.session_duration.message}</p>}
              </div>
            </div>
          </div>
          {/* Course Details */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Course Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Course Grade
                </label>
                <select
                  className={`w-full p-3 border rounded-lg ${errors.course_grade ? "border-red-500" : "border-gray-300"}`}
                  {...register("course_grade")}
                  onChange={(e) => setCourseGrade(e.target.value)}
                  value={courseGrade}
                >
                  <option value="">Select Grade</option>
                  <option value={"All Grade"}>All Grade</option>
                  <option value="Preschool">Preschool</option>
                  <option value="Grade 1-2">Grade 1-2</option>
                  <option value="Grade 3-4">Grade 3-4</option>
                  <option value="Grade 5-6">Grade 5-6</option>
                  <option value="Grade 7-8">Grade 7-8</option>
                  <option value="Grade 9-10">Grade 9-10</option>
                  <option value="Grade 11-12">Grade 11-12</option>
                  <option value="UG/Grad/Pro">UG/Grad/Pro</option>
                </select>
                {errors.course_grade && <p className="text-red-500 text-xs mt-1">{errors.course_grade.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Certificate
                </label>
                <select
                  className={`w-full p-3 border rounded-lg ${errors.is_Certification ? "border-red-500" : "border-gray-300"}`}
                  {...register("is_Certification")}
                  onChange={(e) => setCertification(e.target.value)}
                  value={certification}
                >
                  <option value="">Select...</option>
                  {["Yes", "No"].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.is_Certification && <p className="text-red-500 text-xs mt-1">{errors.is_Certification.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Class Type
                </label>
                <select
                  className={`w-full p-3 border rounded-lg ${errors.class_type ? "border-red-500" : "border-gray-300"}`}
                  {...register("class_type")}
                  onChange={(e) => setClassType(e.target.value)}
                  value={classType}
                >
                  <option value="">Select...</option>
                  <option value="Live Courses">Live Courses</option>
                  <option value="Blended Courses">Blended Courses</option>
                  <option value="Corporate Training Courses">Corporate Training Courses</option>
                </select>
                {errors.class_type && <p className="text-red-500 text-xs mt-1">{errors.class_type.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Assignments
                </label>
                <select
                  className={`w-full p-3 border rounded-lg ${errors.is_Assignments ? "border-red-500" : "border-gray-300"}`}
                  {...register("is_Assignments")}
                  onChange={(e) => setAssignments(e.target.value)}
                  value={assignments}
                >
                  <option value="">Select...</option>
                  {["Yes", "No"].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.is_Assignments && <p className="text-red-500 text-xs mt-1">{errors.is_Assignments.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Projects
                </label>
                <select
                  className={`w-full p-3 border rounded-lg ${errors.is_Projects ? "border-red-500" : "border-gray-300"}`}
                  {...register("is_Projects")}
                  onChange={(e) => setProjects(e.target.value)}
                  value={projects}
                >
                  <option value="">Select...</option>
                  {["Yes", "No"].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.is_Projects && <p className="text-red-500 text-xs mt-1">{errors.is_Projects.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Quizzes
                </label>
                <select
                  className={`w-full p-3 border rounded-lg ${errors.is_Quizes ? "border-red-500" : "border-gray-300"}`}
                  {...register("is_Quizes")}
                  onChange={(e) => setQuizzes(e.target.value)}
                  value={quizzes}
                >
                  <option value="">Select...</option>
                  {["Yes", "No"].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.is_Quizes && <p className="text-red-500 text-xs mt-1">{errors.is_Quizes.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Efforts Per Week
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Minimum Hours</label>
                    <input
                      type="number"
                      placeholder="Min hours"
                      className={`w-full p-3 border rounded-lg ${errors.min_hours_per_week ? "border-red-500" : "border-gray-300"}`}
                      {...register("min_hours_per_week")}
                    />
                    {errors.min_hours_per_week && <p className="text-red-500 text-xs mt-1">{errors.min_hours_per_week.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Maximum Hours</label>
                    <input
                      type="number"
                      placeholder="Max hours"
                      className={`w-full p-3 border rounded-lg ${errors.max_hours_per_week ? "border-red-500" : "border-gray-300"}`}
                      {...register("max_hours_per_week")}
                    />
                    {errors.max_hours_per_week && <p className="text-red-500 text-xs mt-1">{errors.max_hours_per_week.message}</p>}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">
                Course Description
              </label>
              <textarea
                placeholder="Write description..."
                rows="4"
                className={`w-full p-3 border rounded-lg ${errors.course_description ? "border-red-500" : "border-gray-300"}`}
                {...register("course_description")}
              ></textarea>
              {errors.course_description && <p className="text-red-500 text-xs mt-1">{errors.course_description.message}</p>}
            </div>
          </div>
          {/* Pricing Information */}
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
                        className="w-full p-3 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
                  <Upload className="w-6 h-6" />
                  Add Course Videos
                </label>
                <div className={`border-2 rounded-lg p-4 transition-all duration-300 relative ${courseVideos.length > 0 ? "border-green-500 bg-green-50" : "border-dashed border-gray-300 hover:border-gray-400"}`}>
                  <div className="text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m0 0v4a4 4 0 004 4h20a4 4 0 004-4V28m-4-4l5-5m0 0l-5-5m5 5H28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 hover:text-blue-500">
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
                            <svg className="h-5 w-5 text-green-500 mr-2" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            <span className="text-sm text-gray-600 truncate max-w-[150px]">Video {index + 1}</span>
                          </div>
                          <button type="button" onClick={() => removeVideo(index)} className="text-red-500 hover:text-red-700 p-1">
                            <svg className="h-5 w-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
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
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M7 21H17C19.2091 21 21 19.2091 21 17V7C21 4.79086 19.2091 3 17 3H7C4.79086 3 3 4.79086 3 7V17C3 19.2091 4.79086 21 7 21Z" strokeWidth="2"/>
                    <path d="M7 16.8L9.5 14.3L11.999 16.799L16.5 12.3L17.5 13.3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                        <label className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 hover:text-blue-500">
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
                            <svg className="h-5 w-5 text-green-500 mr-2" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            <span className="text-sm text-gray-600 truncate max-w-[150px]">PDF {index + 1}</span>
                          </div>
                          <button type="button" onClick={() => removePdf(index)} className="text-red-500 hover:text-red-700 p-1">
                            <svg className="h-5 w-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
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
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4 16L8.586 11.414C9.367 10.633 10.633 10.633 11.414 11.414L16 16M14 14L15.586 12.414C16.367 11.633 17.633 11.633 18.414 12.414L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Add Thumbnail Image
                </label>
                <div className={`border-2 rounded-lg p-4 transition-all duration-300 relative ${thumbnailImage ? "border-green-500 bg-green-50" : "border-dashed border-gray-300 hover:border-gray-400"}`}>
                  <div className="text-center">
                    {thumbnailImage ? (
                      <div className="relative">
                        <img src={thumbnailImage} alt="Thumbnail" className="mx-auto h-32 w-auto rounded-lg object-cover" />
                        <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                          <svg className="h-4 w-4" stroke="currentColor" fill="none" viewBox="0 0 24 24">
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
                          <label className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 hover:text-blue-500">
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
                onClick={() => setCurriculumWeeks([...curriculumWeeks, { weekTitle: "", weekDescription: "" }])}
                className="flex items-center gap-2 text-customGreen hover:text-green-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Week
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Add the curriculum structure week by week. Each week should have a title and a detailed description.
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
                      onClick={() => setCurriculumWeeks(curriculumWeeks.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <label className="block text-sm font-medium mb-2">Week Description</label>
                  <textarea
                    placeholder="Enter week description"
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
          {/* Tools & Technologies / Bonus Modules */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm mt-6 space-y-6">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
              <label className="block text-sm font-medium mb-2">
                Tools & Technologies (one per line)
              </label>
              <textarea
                placeholder="Enter tools and technologies..."
                rows="4"
                className="w-full p-2 border rounded-lg"
                value={toolsTechnologies.map(tool => tool.name).join("\n")}
                onChange={handleToolsTechnologiesChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                Each tool will be categorized as 'other' by default.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
              <label className="block text-sm font-medium mb-2">
                Bonus Modules (one per line)
              </label>
              <textarea
                placeholder="Enter bonus modules..."
                rows="4"
                className="w-full p-2 border rounded-lg"
                value={bonusModules.map(module => module.title).join("\n")}
                onChange={handleBonusModulesChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                Descriptions and resources can be added later.
              </p>
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
                      onClick={() => setFaqs(faqs.filter((_, i) => i !== index))}
                      className="ml-4 text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
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
              Save Changes
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
        <CurriculumModal onClose={() => setCurriculumModalOpen(false)} curriculum={curriculumWeeks} setCurriculum={setCurriculumWeeks} />
      )}
    </div>
  );
}