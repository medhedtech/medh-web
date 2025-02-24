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
import { BookOpen, CircleCheckBig, Upload, HelpCircle, DollarSign } from "lucide-react";
import ResourceUploadModal from "./ResourceUploadModal";
import CurriculumModal from "./CurriculumModal";
import CategorySelect from "./CategorySelect";
import SelectMultipleCourses from "./SelectMultipleCourses";
import Tooltip from "@/components/shared/others/Tooltip";

// Optimized validation schema
const schema = yup.object({
  course_category: yup.string()
    .required("Course category is required")
    .oneOf(["Live Courses", "Blended Courses", "Corporate Training Courses"]),
  category_type: yup.string()
    .required("Category type is required")
    .oneOf(["Live", "Hybrid", "Pre-Recorded", "Free"]),
  course_title: yup.string()
    .required("Course title is required")
    .trim()
    .max(100, "Title too long"),
  category: yup.string()
    .required("Category is required")
    .oneOf([
      "Web Development",
      "Mobile Development",
      "Data Science",
      "Machine Learning",
      "Cloud Computing",
      "DevOps",
      "Cybersecurity",
      "Artificial Intelligence",
      "Blockchain",
      "UI/UX Design"
    ], "Please select a valid category"),
  no_of_Sessions: yup.number()
    .required("Number of sessions is required")
    .typeError("Must be a number")
    .positive("Must be positive")
    .integer("Must be whole number"),
  course_duration: yup.string()
    .required("Course duration is required")
    .matches(/^\d+ months \d+ weeks$/, "Invalid duration format"),
  session_duration: yup.string()
    .required("Session duration is required")
    .matches(/^\d+ hours \d+ minutes$/, "Invalid duration format"),
  course_grade: yup.string()
    .required("Course grade is required"),
  is_Certification: yup.string()
    .required("Certification selection is required"),
  is_Assignments: yup.string()
    .required("Assignments selection is required"),
  class_type: yup.string()
    .required("Class type is required"),
  is_Projects: yup.string()
    .required("Projects selection is required"),
  is_Quizes: yup.string()
    .required("Quizzes selection is required"),
  efforts_per_Week: yup.string()
    .required("Weekly effort is required")
    .matches(/^\d+ - \d+ hours \/ week$/, "Invalid format (e.g., '3 - 4 hours / week')"),
  course_description: yup.string()
    .required("Course description is required")
    .max(500, "Description too long"),
  related_courses: yup.array().of(yup.string()),
  prices: yup.array().of(
    yup.object().shape({
      currency: yup.string().required("Currency is required"),
      individual: yup.number()
        .typeError("Must be a number")
        .positive("Must be positive")
        .required("Individual price is required"),
      batch: yup.number()
        .typeError("Must be a number")
        .positive("Must be positive")
        .required("Batch price is required")
    })
  ).min(1, "At least one currency is required"),
  course_mode: yup.string()
    .required("Course mode is required")
    .oneOf(["Live Online", "Offline", "Hybrid"]),
  online_sessions: yup.object().shape({
    count: yup.number()
      .required("Number of sessions is required")
      .positive("Must be positive")
      .integer("Must be whole number"),
    duration: yup.string()
      .required("Session duration is required")
      .matches(/^\d+-\d+ min$/, "Invalid duration format (e.g., '60-90 min')")
  }),
  curriculum_weeks: yup.array().of(
    yup.object().shape({
      title: yup.string().required("Week title is required"),
      topics: yup.array().of(yup.string()).required("Topics are required")
    })
  ).min(1, "At least one curriculum week is required"),
  tools_technologies: yup.array().of(yup.string()),
  bonus_modules: yup.array().of(yup.string()),
  faqs: yup.array().of(
    yup.object().shape({
      question: yup.string().required("FAQ question is required"),
      answer: yup.string().required("FAQ answer is required")
    })
  )
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
  const [currentStep, setCurrentStep] = useState(1);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [courseGrade, setCourseGrade] = useState("");
  const [certification, setCertification] = useState("");
  const [assignments, setAssignments] = useState("");
  const [classType, setClassType] = useState("");
  const [projects, setProjects] = useState("");
  const [quizzes, setQuizzes] = useState("");
  const [courseMode, setCourseMode] = useState("");
  const [onlineSessions, setOnlineSessions] = useState({
    count: "",
    duration: "60-90 min"
  });
  const [curriculumWeeks, setCurriculumWeeks] = useState([]);
  const [toolsTechnologies, setToolsTechnologies] = useState([]);
  const [bonusModules, setBonusModules] = useState([]);
  const [faqs, setFaqs] = useState([]);
  
  const formSteps = [
    { number: 1, title: "Basic Info" },
    { number: 2, title: "Course Details" },
    { number: 3, title: "Pricing" },
    { number: 4, title: "Media Upload" }
  ];

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
    setSelected(category);
    setValue("category", category);
    trigger("category");
  };

  const handleChange = (category) => {
    setSelectedCategory(category);
    setValue("course_category", category);
    trigger("course_category");
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
        prices: prices.filter(price => price.currency && (price.individual || price.batch)),
        selected: selected,
        courseTag: courseTag,
        classType: classType,
        courseGrade: courseGrade,
        certification: certification,
        assignments: assignments,
        projects: projects,
        quizzes: quizzes,
        category_type: selectedType,
        curriculum_weeks: curriculumWeeks,
        tools_technologies: toolsTechnologies,
        bonus_modules: bonusModules,
        faqs: faqs
      };

      // Save to localStorage with proper error handling
      try {
        localStorage.setItem("courseData", JSON.stringify(postData));
        console.log("Course data saved successfully:", postData);
      } catch (storageError) {
        console.error("Error saving to localStorage:", storageError);
        toast.error("Error saving course data. Please try again.");
        return;
      }

      router.push("/dashboards/admin-add-data");
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("Error submitting form. Please try again.");
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

  const handleCategoryType = (type) => {
    setSelectedType(type);
    setValue("category_type", type);
    if (type === "Free") {
      setCourseIsFree(true);
      setPrices([{ id: 1, currency: 'USD', individual: '0', batch: '0' }]);
    } else {
      setCourseIsFree(false);
    }
  };

  const handleDurationChange = (field, value) => {
    if (field === 'course') {
      setCourseDurationValue(value);
      setValue("course_duration", `${value.months} months ${value.weeks} weeks`);
    } else {
      setSessionDurationValue(value);
      setValue("session_duration", `${value.hours} hours ${value.minutes} minutes`);
    }
  };

  const handleCurriculumWeekAdd = () => {
    setCurriculumWeeks([
      ...curriculumWeeks,
      { title: "", topics: [] }
    ]);
  };

  const handleCurriculumWeekUpdate = (index, field, value) => {
    const updatedWeeks = [...curriculumWeeks];
    updatedWeeks[index][field] = value;
    setCurriculumWeeks(updatedWeeks);
    setValue("curriculum_weeks", updatedWeeks);
  };

  const handleFaqAdd = () => {
    setFaqs([
      ...faqs,
      { question: "", answer: "" }
    ]);
  };

  const handleFaqUpdate = (index, field, value) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index][field] = value;
    setFaqs(updatedFaqs);
    setValue("faqs", updatedFaqs);
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Info Section */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Basic Information</h3>
            
            {/* Course Category Radio Buttons */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Course Category <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["Live Courses", "Blended Courses", "Corporate Training Courses"].map((category) => (
                  <label
                    key={category} 
                    className={`
                      flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${selectedCategory === category 
                        ? 'border-customGreen bg-green-50 dark:bg-green-900' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="course_category"
                      value={category}
                      checked={selectedCategory === category}
                      onChange={(e) => handleChange(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center w-full">
                      <div className={`
                        w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center
                        ${selectedCategory === category ? 'border-customGreen' : 'border-gray-400'}
                      `}>
                        {selectedCategory === category && (
                          <div className="w-2 h-2 rounded-full bg-customGreen" />
                        )}
                      </div>
                      <span className="text-sm font-medium">{category}</span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.course_category && (
                <p className="text-red-500 text-xs mt-1">{errors.course_category.message}</p>
              )}
            </div>

            {/* Course Title and Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium mb-2">
                  Course Title <span className="text-red-500">*</span>
                </label>
              <input
                type="text"
                placeholder="Enter title"
                  className={`
                    w-full p-3 border rounded-lg focus:ring-2 focus:ring-customGreen
                    ${errors.course_title ? 'border-red-500' : 'border-gray-300'}
                  `}
                {...register("course_title")}
              />
              {errors.course_title && (
                  <p className="text-red-500 text-xs mt-1">{errors.course_title.message}</p>
              )}
            </div>

            <CategorySelect
              handleCategory={handleCategory}
                handleCategoryType={handleCategoryType}
              errors={errors}
              selected={selected}
                selectedType={selectedType}
              setSelected={setSelected}
                setSelectedType={setSelectedType}
            />
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
                  className={`
                    w-full p-3 border rounded-lg focus:ring-2 focus:ring-customGreen
                    ${errors.no_of_Sessions ? 'border-red-500' : 'border-gray-300'}
                  `}
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
                    onChange={(e) => handleDurationChange('course', {
                      ...courseDurationValue,
                      months: e.target.value
                    })}
                  />
                  <input
                    type="number"
                    placeholder="Weeks"
                    className="w-full p-3 border rounded-lg"
                    value={courseDurationValue.weeks}
                    onChange={(e) => handleDurationChange('course', {
                      ...courseDurationValue,
                      weeks: e.target.value
                    })}
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
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Start (e.g., 60)"
                    className="w-full p-3 border rounded-lg"
                    value={onlineSessions.duration.split('-')[0]}
                    onChange={(e) => {
                      const end = onlineSessions.duration.split('-')[1] || '90 min';
                      setOnlineSessions({
                        ...onlineSessions,
                        duration: `${e.target.value}-${end}`
                      });
                      setValue("session_duration", `${e.target.value}-${end}`);
                    }}
                  />
                  <input
                    type="text"
                    placeholder="End (e.g., 90)"
                    className="w-full p-3 border rounded-lg"
                    value={onlineSessions.duration.split('-')[1]?.replace(' min', '')}
                    onChange={(e) => {
                      const start = onlineSessions.duration.split('-')[0] || '60';
                      setOnlineSessions({
                        ...onlineSessions,
                        duration: `${start}-${e.target.value} min`
                      });
                      setValue("session_duration", `${start}-${e.target.value} min`);
                    }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">{onlineSessions.duration} each</p>
            </div>
              </div>
            </div>

          {/* Course Details Section */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Course Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Course Grade */}
            <div>
                <label className="block text-sm font-medium mb-2">
                  Course Grade <span className="text-red-500">*</span>
              </label>
              <select
                  className={`
                    w-full p-3 border rounded-lg focus:ring-2 focus:ring-customGreen
                    ${errors.course_grade ? 'border-red-500' : 'border-gray-300'}
                  `}
                {...register("course_grade")}
                  onChange={(e) => setCourseGrade(e.target.value)}
                  value={courseGrade}
              >
                <option value="">Select Grade</option>
                  {["Beginner", "Intermediate", "Advanced", "All Levels"].map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
              </select>
              {errors.course_grade && (
                  <p className="text-red-500 text-xs mt-1">{errors.course_grade.message}</p>
              )}
            </div>

              {/* Certification */}
            <div>
                <label className="block text-sm font-medium mb-2">
                  Certificate <span className="text-red-500">*</span>
              </label>
              <select
                  className={`
                    w-full p-3 border rounded-lg focus:ring-2 focus:ring-customGreen
                    ${errors.is_Certification ? 'border-red-500' : 'border-gray-300'}
                  `}
                {...register("is_Certification")}
                  onChange={(e) => setCertification(e.target.value)}
                  value={certification}
              >
                <option value="">Select...</option>
                  {["Yes", "No"].map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
              </select>
              {errors.is_Certification && (
                  <p className="text-red-500 text-xs mt-1">{errors.is_Certification.message}</p>
              )}
            </div>

              {/* Class Type */}
            <div>
                <label className="block text-sm font-medium mb-2">
                  Class Type <span className="text-red-500">*</span>
              </label>
              <select
                  className={`
                    w-full p-3 border rounded-lg focus:ring-2 focus:ring-customGreen
                    ${errors.class_type ? 'border-red-500' : 'border-gray-300'}
                  `}
                  {...register("class_type")}
                  onChange={(e) => setClassType(e.target.value)}
                  value={classType}
              >
                <option value="">Select...</option>
                  {["Online", "Offline", "Hybrid"].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
              </select>
                {errors.class_type && (
                  <p className="text-red-500 text-xs mt-1">{errors.class_type.message}</p>
              )}
            </div>

              {/* Assignments */}
            <div>
                <label className="block text-sm font-medium mb-2">
                  Assignments <span className="text-red-500">*</span>
              </label>
              <select
                  className={`
                    w-full p-3 border rounded-lg focus:ring-2 focus:ring-customGreen
                    ${errors.is_Assignments ? 'border-red-500' : 'border-gray-300'}
                  `}
                  {...register("is_Assignments")}
                  onChange={(e) => setAssignments(e.target.value)}
                  value={assignments}
              >
                <option value="">Select...</option>
                  {["Yes", "No"].map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
              </select>
                {errors.is_Assignments && (
                  <p className="text-red-500 text-xs mt-1">{errors.is_Assignments.message}</p>
              )}
            </div>

              {/* Projects */}
            <div>
                <label className="block text-sm font-medium mb-2">
                  Projects <span className="text-red-500">*</span>
              </label>
              <select
                  className={`
                    w-full p-3 border rounded-lg focus:ring-2 focus:ring-customGreen
                    ${errors.is_Projects ? 'border-red-500' : 'border-gray-300'}
                  `}
                {...register("is_Projects")}
                  onChange={(e) => setProjects(e.target.value)}
                  value={projects}
              >
                <option value="">Select...</option>
                  {["Yes", "No"].map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
              </select>
              {errors.is_Projects && (
                  <p className="text-red-500 text-xs mt-1">{errors.is_Projects.message}</p>
              )}
            </div>

              {/* Quizzes */}
            <div>
                <label className="block text-sm font-medium mb-2">
                  Quizzes <span className="text-red-500">*</span>
              </label>
              <select
                  className={`
                    w-full p-3 border rounded-lg focus:ring-2 focus:ring-customGreen
                    ${errors.is_Quizes ? 'border-red-500' : 'border-gray-300'}
                  `}
                {...register("is_Quizes")}
                  onChange={(e) => setQuizzes(e.target.value)}
                  value={quizzes}
              >
                <option value="">Select...</option>
                  {["Yes", "No"].map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
              </select>
              {errors.is_Quizes && (
                  <p className="text-red-500 text-xs mt-1">{errors.is_Quizes.message}</p>
              )}
            </div>

              {/* Efforts per Week */}
            <div>
                <label className="block text-sm font-medium mb-2">
                  Efforts Per Week <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                  placeholder="e.g., 3 - 4 hours / week"
                  className={`
                    w-full p-3 border rounded-lg focus:ring-2 focus:ring-customGreen
                    ${errors.efforts_per_Week ? 'border-red-500' : 'border-gray-300'}
                  `}
                {...register("efforts_per_Week")}
              />
              {errors.efforts_per_Week && (
                  <p className="text-red-500 text-xs mt-1">{errors.efforts_per_Week.message}</p>
              )}
            </div>
            </div>

            {/* Course Description */}
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">
                Course Description <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Write description........."
                rows="4"
                className={`
                  w-full p-3 border rounded-lg focus:ring-2 focus:ring-customGreen
                  ${errors.course_description ? 'border-red-500' : 'border-gray-300'}
                `}
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
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-customGreen
                          transition-all dark:bg-gray-600 dark:border-gray-500"
                        value={price.currency}
                        onChange={(e) => updatePrice(price.id, 'currency', e.target.value)}
                        disabled={courseIsFree}
                      >
                        <option value="">Select Currency</option>
                        {currencyOptions.map(currency => (
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-sm font-medium mb-2">Individual Price</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">
                          {price.currency ? getCurrencySymbol(price.currency) : <DollarSign className="w-4 h-4 text-gray-400" />}
                        </span>
                        <input
                          type="number"
                          placeholder="0.00"
                          className={`w-full pl-8 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-customGreen
                            transition-all ${courseIsFree || !price.currency ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                          disabled={courseIsFree || !price.currency}
                          value={price.individual}
                          onChange={(e) => updatePrice(price.id, 'individual', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium mb-2">Batch Price</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">
                          {price.currency ? getCurrencySymbol(price.currency) : <DollarSign className="w-4 h-4 text-gray-400" />}
                        </span>
                        <input
                          type="number"
                          placeholder="0.00"
                          className={`w-full pl-8 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-customGreen
                            transition-all ${courseIsFree || !price.currency ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
                  className="flex items-center gap-2 text-customGreen hover:text-green-700 transition-colors mt-4"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Another Currency
              </button>
              )}
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
                <div className={`
                  border-2 rounded-lg p-4 transition-all duration-300 relative
                  ${courseVideos.length > 0 ? 'border-green-500 bg-green-50' : 'border-dashed border-gray-300 hover:border-gray-400'}
                `}>
                  <div className="text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m0 0v4a4 4 0 004 4h20a4 4 0 004-4V28m-4-4l5-5m0 0l-5-5m5 5H28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500">
                          <span>Upload videos</span>
                          <input
                            type="file"
                            multiple
                            accept="video/*"
                            className="sr-only"
                            onChange={handleVideoUpload}
                          />
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
                          <button
                            type="button"
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
                <div className={`
                  border-2 rounded-lg p-4 transition-all duration-300 relative
                  ${pdfBrochures.length > 0 ? 'border-green-500 bg-green-50' : 'border-dashed border-gray-300 hover:border-gray-400'}
                `}>
                  <div className="text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m0 0v4a4 4 0 004 4h20a4 4 0 004-4V28m-4-4l5-5m0 0l-5-5m5 5H28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500">
                          <span>Upload PDF</span>
                          <input
                            type="file"
                            multiple
                            accept=".pdf"
                            className="sr-only"
                            onChange={handlePdfUpload}
                          />
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
                          <button
                            type="button"
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
                </div>
              </div>

              {/* Thumbnail Image Upload */}
              <div className="w-full">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 16L8.586 11.414C9.367 10.633 10.633 10.633 11.414 11.414L16 16M14 14L15.586 12.414C16.367 11.633 17.633 11.633 18.414 12.414L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Add Thumbnail Image
                </label>
                <div className={`
                  border-2 rounded-lg p-4 transition-all duration-300 relative
                  ${thumbnailImage ? 'border-green-500 bg-green-50' : 'border-dashed border-gray-300 hover:border-gray-400'}
                `}>
                  <div className="text-center">
                    {thumbnailImage ? (
                      <div className="relative">
                        <img
                          src={thumbnailImage}
                          alt="Thumbnail"
                          className="mx-auto h-32 w-auto rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
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
                            <input
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleImageUpload}
                            />
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
                onClick={handleCurriculumWeekAdd}
                className="flex items-center gap-2 text-customGreen hover:text-green-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Week
            </button>
            </div>

            <div className="space-y-4">
              {curriculumWeeks.map((week, index) => (
                <div key={index} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 mr-4">
                      <input
                        type="text"
                        placeholder="Week Title (e.g., Weeks 1-2: Introduction to AI and Data Science)"
                        className="w-full p-2 border rounded-lg"
                        value={week.title}
                        onChange={(e) => handleCurriculumWeekUpdate(index, 'title', e.target.value)}
                      />
                    </div>
            <button
                      type="button"
                      onClick={() => {
                        const updatedWeeks = curriculumWeeks.filter((_, i) => i !== index);
                        setCurriculumWeeks(updatedWeeks);
                        setValue("curriculum_weeks", updatedWeeks);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <textarea
                    placeholder="Enter topics (one per line)"
                    rows="4"
                    className="w-full p-2 border rounded-lg"
                    value={week.topics.join('\n')}
                    onChange={(e) => handleCurriculumWeekUpdate(index, 'topics', e.target.value.split('\n'))}
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
                  placeholder="Enter tools and technologies that will be covered"
                  rows="4"
                  className="w-full p-2 border rounded-lg"
                  value={toolsTechnologies.join('\n')}
                  onChange={(e) => {
                    const tools = e.target.value.split('\n').filter(tool => tool.trim());
                    setToolsTechnologies(tools);
                    setValue("tools_technologies", tools);
                  }}
                />
              </div>

              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                <label className="block text-sm font-medium mb-2">
                  Bonus Modules <span className="text-gray-500">(one per line)</span>
                </label>
                <textarea
                  placeholder="Enter bonus modules or additional content"
                  rows="4"
                  className="w-full p-2 border rounded-lg"
                  value={bonusModules.join('\n')}
                  onChange={(e) => {
                    const modules = e.target.value.split('\n').filter(module => module.trim());
                    setBonusModules(modules);
                    setValue("bonus_modules", modules);
                  }}
                />
              </div>
            </div>
          </div>

          {/* FAQs Section */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm mt-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>
              <button
                type="button"
                onClick={handleFaqAdd}
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
                        placeholder="Question (e.g., What are the prerequisites for enrolling in the course?)"
                        className="w-full p-2 border rounded-lg"
                        value={faq.question}
                        onChange={(e) => handleFaqUpdate(index, 'question', e.target.value)}
                      />
                      <textarea
                        placeholder="Answer"
                        rows="3"
                        className="w-full p-2 border rounded-lg"
                        value={faq.answer}
                        onChange={(e) => handleFaqUpdate(index, 'answer', e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updatedFaqs = faqs.filter((_, i) => i !== index);
                        setFaqs(updatedFaqs);
                        setValue("faqs", updatedFaqs);
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
              Note: If you have any other questions or concerns not covered in the FAQs, please feel free to contact our support team, and we'll be happy to assist you!
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="px-6 py-3 bg-customGreen text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Submit Course
            </button>
          </div>
        </form>
      </div>

      {/* Existing modals */}
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
