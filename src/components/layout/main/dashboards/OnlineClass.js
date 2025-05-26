"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaCalendarAlt, FaClock, FaRegCalendarAlt, FaPlay, FaVideo, FaUsers, FaGraduationCap, FaPlus, FaSearch } from "react-icons/fa";
import { HiSparkles, HiLightningBolt, HiCollection } from "react-icons/hi";
import DatePicker from "react-datepicker";
import "@/styles/vendor.css";
import "@/assets/css/popup.css";
import usePostQuery from "@/hooks/postQuery.hook";
import useGetQuery from "@/hooks/getQuery.hook";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import Preloader from "@/components/shared/others/Preloader";
import { apiUrls } from "@/apis";
import moment from "moment";
import { FaShare } from "react-icons/fa";
import Image from "next/image";
import PaginationComponent from "@/components/shared/pagination-latest";
import dynamic from 'next/dynamic';

// Client-side only TimePicker component using MUI
const MUITimePicker = dynamic(
  () => import('@mui/x-date-pickers').then((mod) => {
    const { LocalizationProvider, TimePicker } = mod;
    const { AdapterMoment } = require('@mui/x-date-pickers/AdapterMoment');
    
    return function TimePickerWrapper({ value, onChange }) {
      return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <TimePicker
            value={value}
            onChange={onChange}
            slotProps={{ 
              textField: { 
                placeholder: "Select Time",
                className: "w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100",
                style: { height: "50px", fontSize: "16px" }
              } 
            }}
            format="hh:mm a"
          />
        </LocalizationProvider>
      );
    };
  }),
  { ssr: false, loading: () => <div className="h-[50px] w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl"></div> }
);

// Validation Schema
const schema = yup.object({
  category: yup.string().required("Course Category is required"),
  course_name: yup.string().required("Course name is required"),
  meet_link: yup.string().url("Invalid URL").required("Meet link is required"),
  meet_title: yup.string().required("Meet title is required"),
  time: yup.string().required("Please select the time."),
  date: yup.date().required("Date is required"),
});

const OnlineMeeting = () => {
  const { postQuery, loading } = usePostQuery();
  const { getQuery } = useGetQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState();
  const [meeting, setMeeting] = useState([]);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState();
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState("demo");
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const courseDropdownRef = useRef(null);
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit] = useState(6);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Filter meetings by type
  const demoMeetings = meeting.filter(m => m.meeting_tag === 'demo');
  const liveMeetings = meeting.filter(m => m.meeting_tag === 'live');
  const recordedMeetings = meeting.filter(m => m.meeting_tag === 'recorded');

  // Get current meetings based on active section
  const getCurrentMeetings = () => {
    switch(activeSection) {
      case 'demo': return demoMeetings;
      case 'live': return liveMeetings;
      case 'recorded': return recordedMeetings;
      default: return demoMeetings;
    }
  };

  // Section configurations with better contrast colors
  const sectionConfig = {
    demo: {
      title: "demo classes",
      subtitle: "free trial vibes ✨",
      icon: HiSparkles,
      gradient: "from-indigo-500/20 via-purple-500/20 to-pink-500/20",
      borderGradient: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-500/10 to-purple-500/10",
      lightBg: "from-indigo-100 to-purple-100",
      darkBg: "from-indigo-900/30 to-purple-900/30",
      emoji: "🎯"
    },
    live: {
      title: "live sessions",
      subtitle: "real-time energy ⚡",
      icon: HiLightningBolt,
      gradient: "from-blue-500/20 via-cyan-500/20 to-teal-500/20",
      borderGradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      lightBg: "from-blue-100 to-cyan-100",
      darkBg: "from-blue-900/30 to-cyan-900/30",
      emoji: "🔥"
    },
    recorded: {
      title: "on-demand",
      subtitle: "learn at your pace 🌙",
      icon: HiCollection,
      gradient: "from-emerald-500/20 via-green-500/20 to-teal-500/20",
      borderGradient: "from-emerald-500 to-green-500",
      bgGradient: "from-emerald-500/10 to-green-500/10",
      lightBg: "from-emerald-100 to-green-100",
      darkBg: "from-emerald-900/30 to-green-900/30",
      emoji: "💫"
    }
  };

  // Format date to DD-MM-YYYY
  const formatDate = (date) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(date).toLocaleDateString("en-GB", options);
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    setDropdownOpen((prev) => !prev);
  };

  const selectCategory = (categoryName) => {
    setSelected(categoryName);
    setValue("category", categoryName);
    setDropdownOpen(false);
    setSearchTerm("");
  };

  const toggleCourseDropdown = (e) => {
    e.preventDefault();
    setCourseDropdownOpen((prev) => !prev);
  };

  const selectCourse = (courseName) => {
    setSelectedCourse(courseName);
    setValue("course_name", courseName);
    setCourseDropdownOpen(false);
  };

  const filteredCategories = categories?.filter((category) =>
    category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await getQuery({
          url: apiUrls?.categories?.getAllCategories,
          onSuccess: (data) => {
            setCategories(data.data);
          },
          onFail: (err) => {
            console.error("Error fetching categories", err);
          },
        });

        await getQuery({
          url: apiUrls?.courses?.getAllCourses,
          onSuccess: (data) => {
            setCourses(data);
          },
          onFail: (err) => {
            console.error("API error:", err instanceof Error ? err.message : err);
          },
        });
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };

    fetchInitialData();
    setFetchAgain(false);
  }, [fetchAgain]);

  useEffect(() => {
    if (!selectedCategory) {
      setFilteredCourses([]);
      setEnrolledStudents([]);
      setSelectedCourseId();
      return;
    }

    setFilteredCourses([]);
    setEnrolledStudents([]);
    setSelectedCourseId();

    const filteredCourses = courses.filter(
      (course) => course.category === selectedCategory
    );
    setFilteredCourses(filteredCourses);
  }, [selectedCategory, courses]);

  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      try {
        await getQuery({
          url: `${apiUrls?.EnrollCourse?.getEnrolledStudentsByCourseId}/${selectedCourseId}`,
          onSuccess: (data) => {
            const enrolledStudents = data.map((s) => s.student_id);
            setEnrolledStudents(enrolledStudents);
          },
          onFail: (err) => {
            console.error("Error fetching enrolled students: ", err);
          },
        });
      } catch (err) {
        console.error("Error fetching enrolled students: ", err);
      }
    };

    if (selectedCourseId) {
      setEnrolledStudents([]);
      fetchEnrolledStudents();
    }
  }, [selectedCourseId]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        await getQuery({
          url: `${apiUrls?.onlineMeeting?.getAllMeetings}?page=${currentPage}&limit=${limit}`,
          onSuccess: (data) => {
            setMeeting(data.meetings);
            setTotalPages(Math.ceil(data?.totalMeetings / limit));
          },
          onFail: (err) => {
            console.error("API error:", err instanceof Error ? err.message : err);
          },
        });
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchMeetings();
  }, [currentPage, limit]);

  const onSubmit = async (data) => {
    try {
      await postQuery({
        url: apiUrls?.onlineMeeting?.createMeeting,
        postData: {
          category: data.category,
          course_name: filteredCourses.find(
            (course) => course._id === selectedCourseId
          ).course_title,
          students: selectedStudents || [],
          meet_link: data.meet_link,
          meet_title: data.meet_title,
          meeting_tag: data.meeting_tag,
          time: selectedTime ? selectedTime.format("HH:mm") : null,
          date: selectedDate ? moment(selectedDate).format("YYYY-MM-DD") : null,
          course_id: selectedCourseId,
        },
        onSuccess: () => {
          toast.success("Session created! ✨");
          reset();
          setSelectedDate(null);
          setSelectedTime(null);
          closeModal();
          resetStates();
          setFetchAgain(true);
        },
        onFail: () => {
          toast.error("Oops! Something went wrong 😅");
        },
      });
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const resetStates = () => {
    setCategories([]);
    setSelectedCategory();
    setFilteredCourses([]);
    setSelectedCourseId();
    setEnrolledStudents([]);
    setSelectedStudents([]);
    setSelected("");
    setSelectedCourse("");
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    resetStates();
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setValue("date", date);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    setValue("time", time ? time.format("HH:mm") : "");
  };

  const handleCopy = async (cardId, link) => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied! 📋");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleShare = async (meetingLink) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join the vibe! 🎉",
          text: "Here's the link to join the session:",
          url: meetingLink,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(meetingLink);
        toast.success("Link copied! 📋");
      } catch (error) {
        console.error("Error copying link:", error);
      }
    }
  };

  if (loading) return <Preloader />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-96 h-96 bg-emerald-200/30 dark:bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 text-center py-20">
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
          <span className="text-indigo-600 dark:text-indigo-400 text-sm font-medium tracking-wider uppercase">personality development</span>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping delay-300"></div>
        </div>
        <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-gray-900 via-indigo-700 to-blue-700 dark:from-gray-100 dark:via-indigo-300 dark:to-blue-300 bg-clip-text text-transparent mb-4">
          learn. grow. vibe.
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto">
          choose your learning style and start your journey ✨
        </p>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        {/* Section Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {Object.entries(sectionConfig).map(([key, config]) => {
            const IconComponent = config.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`group relative px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                  activeSection === key
                    ? `bg-gradient-to-r ${config.lightBg} dark:${config.darkBg} border border-gray-300 dark:border-gray-600 shadow-lg`
                    : 'bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`text-xl ${
                    activeSection === key 
                      ? 'text-gray-800 dark:text-gray-200' 
                      : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200'
                  }`} />
                  <span className={`${
                    activeSection === key 
                      ? 'text-gray-800 dark:text-gray-200' 
                      : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200'
                  }`}>
                    {config.title}
                  </span>
                  <span className="text-lg">{config.emoji}</span>
                </div>
                {activeSection === key && (
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${config.borderGradient} opacity-10 dark:opacity-20 blur-xl`}></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Section Content */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl border border-gray-200 dark:border-gray-700 p-8 shadow-xl">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                {sectionConfig[activeSection].title} {sectionConfig[activeSection].emoji}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{sectionConfig[activeSection].subtitle}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="search sessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                />
              </div>
              <button
                onClick={openModal}
                className="group relative px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <FaPlus className="text-sm" />
                  <span>create session</span>
                </div>
              </button>
            </div>
          </div>

          {/* Sessions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getCurrentMeetings().length > 0 ? (
              getCurrentMeetings()
                .filter(meeting => 
                  meeting.meet_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  meeting.course_name?.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((meeting, index) => (
                <div
                  key={index}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  {/* Card gradient overlay */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${sectionConfig[activeSection].lightBg} dark:${sectionConfig[activeSection].darkBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  
                  <div className="relative z-10">
                    {/* Session header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1 line-clamp-2 text-gray-900 dark:text-gray-100">{meeting.meet_title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{meeting.course_name}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${sectionConfig[activeSection].borderGradient} p-0.5`}>
                        <div className="w-full h-full bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center">
                          <span className="text-lg">{sectionConfig[activeSection].emoji}</span>
                        </div>
                      </div>
                    </div>

                    {/* Session details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${sectionConfig[activeSection].borderGradient} p-0.5`}>
                          <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center">
                            <FaCalendarAlt className="text-xs text-gray-600 dark:text-gray-400" />
                          </div>
                        </div>
                        <span className="text-sm">{formatDate(meeting.date)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${sectionConfig[activeSection].borderGradient} p-0.5`}>
                          <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center">
                            <FaClock className="text-xs text-gray-600 dark:text-gray-400" />
                          </div>
                        </div>
                        <span className="text-sm">{meeting.time}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopy(meeting._id, meeting.meet_link)}
                        className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                      >
                        copy link
                      </button>
                      <button
                        onClick={() => handleShare(meeting.meet_link)}
                        className={`flex-1 py-2 px-4 bg-gradient-to-r ${sectionConfig[activeSection].borderGradient} text-white rounded-xl text-sm font-medium hover:scale-105 transition-all duration-200`}
                      >
                        share
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
                  <FaRegCalendarAlt className="text-2xl text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  no {activeSection} sessions yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  create your first session to get started ✨
                </p>
                <button
                  onClick={openModal}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300"
                >
                  create session
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {getCurrentMeetings().length > 0 && (
            <div className="mt-12 flex justify-center">
              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* Create Session Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">create new session ✨</h3>
                <p className="text-gray-600 dark:text-gray-400">set up your learning experience</p>
              </div>
              <button
                onClick={closeModal}
                className="w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl flex items-center justify-center transition-colors duration-200"
              >
                <span className="text-xl text-gray-600 dark:text-gray-400">×</span>
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Course Category */}
              <div className="relative" ref={dropdownRef}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  course category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={toggleDropdown}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-left text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    {selected || "select category"}
                  </button>
                  {dropdownOpen && (
                    <div className="absolute z-20 top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl">
                      <input
                        type="text"
                        className="w-full p-3 bg-transparent border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
                        placeholder="search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <ul className="max-h-48 overflow-auto">
                        {filteredCategories.length > 0 ? (
                          filteredCategories.map((category) => (
                            <li
                              key={category._id}
                              className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3 px-4 py-3 transition-colors duration-200"
                              onClick={() => {
                                selectCategory(category.category_name);
                                setSelectedCategory(category.category_name);
                              }}
                            >
                              <Image
                                src={category.category_image}
                                alt={category.category_title}
                                width={32}
                                height={32}
                                className="rounded-lg"
                              />
                              <span className="text-gray-900 dark:text-gray-100">{category.category_name}</span>
                            </li>
                          ))
                        ) : (
                          <li className="p-4 text-gray-500 dark:text-gray-400 text-center">no results found</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-2">{errors.category.message}</p>
                )}
              </div>

              {/* Course Name */}
              <div className="relative" ref={courseDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  course name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={toggleCourseDropdown}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-left text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    {selectedCourse || "select course"}
                  </button>
                  {courseDropdownOpen && (
                    <div className="absolute z-20 top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl">
                      <ul className="max-h-48 overflow-auto">
                        {filteredCourses.length > 0 ? (
                          filteredCourses.map((course) => (
                            <li
                              key={course._id}
                              className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3 px-4 py-3 transition-colors duration-200"
                              onClick={() => {
                                selectCourse(course.course_title);
                                setSelectedCourseId(course._id);
                              }}
                            >
                              {course.course_image ? (
                                <Image
                                  src={course.course_image}
                                  alt={course.course_title || "Course Image"}
                                  width={32}
                                  height={32}
                                  className="rounded-lg"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg"></div>
                              )}
                              <span className="text-gray-900 dark:text-gray-100">{course.course_title || "no title available"}</span>
                            </li>
                          ))
                        ) : (
                          <li className="p-4 text-gray-500 dark:text-gray-400 text-center">no courses found</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                {errors.course_name && (
                  <p className="text-red-500 text-sm mt-2">{errors.course_name.message}</p>
                )}
              </div>

              {/* Session Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  session type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("meeting_tag", { required: "Session type is required" })}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                  defaultValue=""
                >
                  <option value="" disabled>select session type</option>
                  <option value="demo">demo class ✨</option>
                  <option value="live">live session ⚡</option>
                  <option value="recorded">on-demand 🌙</option>
                </select>
                {errors.meeting_tag && (
                  <p className="text-red-500 text-sm mt-2">{errors.meeting_tag.message}</p>
                )}
              </div>

              {/* Session Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  session title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("meet_title")}
                  type="text"
                  className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                  placeholder="enter session title"
                />
                {errors.meet_title && (
                  <p className="text-red-500 text-sm mt-2">{errors.meet_title.message}</p>
                )}
              </div>

              {/* Meeting Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  meeting link <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("meet_link")}
                  type="url"
                  className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                  placeholder="paste your meeting link"
                />
                {errors.meet_link && (
                  <p className="text-red-500 text-sm mt-2">{errors.meet_link.message}</p>
                )}
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    date <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy/MM/dd"
                    className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                    placeholderText="select date"
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-2">{errors.date.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    time <span className="text-red-500">*</span>
                  </label>
                  <MUITimePicker
                    value={selectedTime}
                    onChange={handleTimeChange}
                  />
                  {errors.time && (
                    <p className="text-red-500 text-sm mt-2">{errors.time.message}</p>
                  )}
                </div>
              </div>

              {/* Enrolled Students */}
              {enrolledStudents.length > 0 && (
                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    <span>enrolled students</span>
                    <span className="text-indigo-600 dark:text-indigo-400">
                      {selectedStudents.length} / {enrolledStudents.length} selected
                    </span>
                  </label>

                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id="selectAll"
                      checked={selectedStudents.length === enrolledStudents.length && enrolledStudents.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudents(enrolledStudents.map((student) => student._id));
                        } else {
                          setSelectedStudents([]);
                        }
                      }}
                      className="mr-3 w-4 h-4 text-indigo-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="selectAll" className="text-gray-700 dark:text-gray-300">
                      select all students
                    </label>
                  </div>

                  <div className="max-h-40 overflow-y-auto bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-3 space-y-2">
                    {enrolledStudents.map((student) => (
                      <div key={student._id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`student-${student._id}`}
                          checked={selectedStudents.includes(student._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudents([...selectedStudents, student._id]);
                            } else {
                              setSelectedStudents(selectedStudents.filter((id) => id !== student._id));
                            }
                          }}
                          className="mr-3 w-4 h-4 text-indigo-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor={`student-${student._id}`} className="text-gray-700 dark:text-gray-300">
                          {student.full_name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300 hover:shadow-lg"
              >
                create session ✨
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineMeeting;
