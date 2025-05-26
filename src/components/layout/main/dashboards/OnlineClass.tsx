"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaCalendarAlt, FaClock, FaRegCalendarAlt, FaPlay, FaVideo, FaUsers, FaGraduationCap, FaPlus, FaSearch, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { HiSparkles, HiLightningBolt, HiCollection, HiAcademicCap } from "react-icons/hi";
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
import moment, { Moment } from "moment";
import { FaShare } from "react-icons/fa";
import Image from "next/image";
import PaginationComponent from "@/components/shared/pagination-latest";
import dynamic from 'next/dynamic';

// TypeScript Interfaces
interface ICategory {
  _id: string;
  category_name: string;
  category_title: string;
  category_image: string;
}

interface ICourse {
  _id: string;
  course_title: string;
  course_image?: string;
  category: string;
}

interface IStudent {
  _id: string;
  full_name: string;
  student_id: string;
}

interface IMeeting {
  _id: string;
  category: string;
  course_name: string;
  meet_link: string;
  meet_title: string;
  meeting_tag: 'demo' | 'live' | 'recorded';
  time: string;
  date: string;
  course_id: string;
  students: string[];
}

interface ISessionType {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  emoji: string;
  gradient: string;
  bgGradient: string;
  darkBgGradient: string;
  count: number;
  illustration: string;
}

interface IFormData {
  category: string;
  course_name: string;
  meet_link: string;
  meet_title: string;
  meeting_tag: string;
  time: string;
  date: Date;
}

interface IOnlineClassProps {
  categoryFilter?: string;
  sessionTypeFilter?: 'demo' | 'live' | 'recorded';
  pageTitle?: string;
}

interface ITimePickerProps {
  value: Moment | null;
  onChange: (time: Moment | null) => void;
}

// Client-side only TimePicker component using MUI
const MUITimePicker = dynamic(
  () => import('@mui/x-date-pickers').then((mod) => {
    const { LocalizationProvider, TimePicker } = mod;
    const { AdapterMoment } = require('@mui/x-date-pickers/AdapterMoment');
    
    return function TimePickerWrapper({ value, onChange }: ITimePickerProps) {
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

const OnlineMeeting: React.FC<IOnlineClassProps> = ({ categoryFilter, sessionTypeFilter, pageTitle }) => {
  const { postQuery, loading } = usePostQuery();
  const { getQuery } = useGetQuery();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Moment | null>(null);
  const [meeting, setMeeting] = useState<IMeeting[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [filteredCourses, setFilteredCourses] = useState<ICourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(undefined);
  const [enrolledStudents, setEnrolledStudents] = useState<IStudent[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [fetchAgain, setFetchAgain] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeSection, setActiveSection] = useState<string>("demo");
  const [selectedSessionType, setSelectedSessionType] = useState<string | null>(sessionTypeFilter || null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>("");
  const courseDropdownRef = useRef<HTMLDivElement>(null);
  const [courseDropdownOpen, setCourseDropdownOpen] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [limit] = useState<number>(6);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<IFormData>({
    resolver: yupResolver(schema),
  });

  // Filter meetings by type and category
  const filterMeetingsByCategory = (meetings: IMeeting[]): IMeeting[] => {
    if (!categoryFilter) return meetings;
    return meetings.filter(m => m.category === categoryFilter);
  };

  const demoMeetings = filterMeetingsByCategory(meeting.filter(m => m.meeting_tag === 'demo'));
  const liveMeetings = filterMeetingsByCategory(meeting.filter(m => m.meeting_tag === 'live'));
  const recordedMeetings = filterMeetingsByCategory(meeting.filter(m => m.meeting_tag === 'recorded'));

  // Session type configurations
  const sessionTypes: ISessionType[] = [
    {
      id: 'demo',
      title: 'Demo Classes',
      subtitle: 'free trial sessions',
      description: 'Experience our teaching style with complimentary demo sessions',
      icon: HiAcademicCap,
      emoji: '🎓',
      gradient: 'from-emerald-400 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
      darkBgGradient: 'from-emerald-900/20 to-teal-900/20',
      count: demoMeetings.length,
      illustration: '👨‍🎓📚💡'
    },
    {
      id: 'live',
      title: 'Live Classes',
      subtitle: 'real-time interactive sessions',
      description: 'Join live sessions with real-time interaction and Q&A',
      icon: HiLightningBolt,
      emoji: '📹',
      gradient: 'from-emerald-400 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
      darkBgGradient: 'from-emerald-900/20 to-teal-900/20',
      count: liveMeetings.length,
      illustration: '👨‍💻🖥️⏰'
    },
    {
      id: 'recorded',
      title: 'Pre Recorded Classes',
      subtitle: 'learn at your own pace',
      description: 'Access pre-recorded sessions anytime, anywhere',
      icon: HiCollection,
      emoji: '📼',
      gradient: 'from-emerald-400 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
      darkBgGradient: 'from-emerald-900/20 to-teal-900/20',
      count: recordedMeetings.length,
      illustration: '🎬📱💾'
    }
  ];

  // Get current meetings based on selected session type
  const getCurrentMeetings = (): IMeeting[] => {
    const currentType = selectedSessionType || sessionTypeFilter;
    if (!currentType) return [];
    switch(currentType) {
      case 'demo': return demoMeetings;
      case 'live': return liveMeetings;
      case 'recorded': return recordedMeetings;
      default: return [];
    }
  };

  // Format date to DD-MM-YYYY
  const formatDate = (date: string): string => {
    const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(date).toLocaleDateString("en-GB", options);
  };

  const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    setDropdownOpen((prev) => !prev);
  };

  const selectCategory = (categoryName: string): void => {
    setSelected(categoryName);
    setValue("category", categoryName);
    setDropdownOpen(false);
    setSearchTerm("");
  };

  const toggleCourseDropdown = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    setCourseDropdownOpen((prev) => !prev);
  };

  const selectCourse = (courseName: string): void => {
    setSelectedCourse(courseName);
    setValue("course_name", courseName);
    setCourseDropdownOpen(false);
  };

  const filteredCategories = categories?.filter((category) => {
    // If categoryFilter is provided, only show that category
    if (categoryFilter) {
      return category.category_name === categoryFilter;
    }
    // Otherwise, filter by search term
    return category.category_name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    const fetchInitialData = async (): Promise<void> => {
      try {
        await getQuery({
          url: apiUrls?.categories?.getAllCategories,
          onSuccess: (data: { data: ICategory[] }) => {
            setCategories(data.data);
          },
          onFail: (err: any) => {
            console.error("Error fetching categories", err);
          },
        });

        await getQuery({
          url: apiUrls?.courses?.getAllCourses,
          onSuccess: (data: ICourse[]) => {
            setCourses(data);
          },
          onFail: (err: any) => {
            console.error("API error:", err instanceof Error ? err.message : err);
          },
        });
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };

    fetchInitialData();
    setFetchAgain(false);
  }, [fetchAgain, getQuery]);

  // Auto-select category when categoryFilter is provided
  useEffect(() => {
    if (categoryFilter && categories.length > 0) {
      const matchingCategory = categories.find(cat => cat.category_name === categoryFilter);
      if (matchingCategory) {
        setSelectedCategory(categoryFilter);
        setSelected(categoryFilter);
        setValue("category", categoryFilter);
      }
    }
  }, [categoryFilter, categories, setValue]);

  useEffect(() => {
    if (!selectedCategory) {
      setFilteredCourses([]);
      setEnrolledStudents([]);
      setSelectedCourseId(undefined);
      return;
    }

    setFilteredCourses([]);
    setEnrolledStudents([]);
    setSelectedCourseId(undefined);

    // Add safety check to ensure courses is an array before filtering
    if (!Array.isArray(courses)) {
      return;
    }

    const filteredCourses = courses.filter(
      (course) => course.category === selectedCategory
    );
    setFilteredCourses(filteredCourses);
  }, [selectedCategory, courses]);

  useEffect(() => {
    const fetchEnrolledStudents = async (): Promise<void> => {
      try {
        await getQuery({
          url: `${apiUrls?.EnrollCourse?.getEnrolledStudentsByCourseId}/${selectedCourseId}`,
          onSuccess: (data: { student_id: IStudent }[]) => {
            const enrolledStudents = data.map((s) => s.student_id);
            setEnrolledStudents(enrolledStudents);
          },
          onFail: (err: any) => {
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
  }, [selectedCourseId, getQuery]);

  useEffect(() => {
    const fetchMeetings = async (): Promise<void> => {
      try {
        await getQuery({
          url: `${apiUrls?.onlineMeeting?.getAllMeetings}?page=${currentPage}&limit=${limit}`,
          onSuccess: (data: { meetings: IMeeting[]; totalMeetings: number }) => {
            setMeeting(data.meetings);
            setTotalPages(Math.ceil(data?.totalMeetings / limit));
          },
          onFail: (err: any) => {
            console.error("API error:", err instanceof Error ? err.message : err);
          },
        });
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchMeetings();
  }, [currentPage, limit, getQuery]);

  const onSubmit = async (data: IFormData): Promise<void> => {
    try {
      await postQuery({
        url: apiUrls?.onlineMeeting?.createMeeting,
        postData: {
          category: data.category,
          course_name: filteredCourses.find(
            (course) => course._id === selectedCourseId
          )?.course_title || '',
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

  const resetStates = (): void => {
    setCategories([]);
    setSelectedCategory(undefined);
    setFilteredCourses([]);
    setSelectedCourseId(undefined);
    setEnrolledStudents([]);
    setSelectedStudents([]);
    setSelected("");
    setSelectedCourse("");
  };

  const openModal = (sessionType: string): void => {
    setSelectedSessionType(sessionType);
    setIsModalOpen(true);
    setValue("meeting_tag", sessionType);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setSelectedSessionType(null);
    resetStates();
  };

  const handleDateChange = (date: Date | null): void => {
    setSelectedDate(date);
    setValue("date", date as Date);
  };

  const handleTimeChange = (time: Moment | null): void => {
    setSelectedTime(time);
    setValue("time", time ? time.format("HH:mm") : "");
  };

  const handleCopy = async (cardId: string, link: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied! 📋");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleShare = async (meetingLink: string): Promise<void> => {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header - only show when not in filtered mode */}
      {!sessionTypeFilter && (
        <div className="text-center py-16 px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded-full mb-6">
            <span className="text-sm text-gray-700 dark:text-gray-300">online classes</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50 mb-4">
            {pageTitle || categoryFilter || "Choose Your Format"}
          </h1>
          
          <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto">
            Select your preferred learning format
          </p>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        {!selectedSessionType && !sessionTypeFilter ? (
          // Session Type Selection - only show when no sessionTypeFilter is provided
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sessionTypes.map((sessionType) => {
              const IconComponent = sessionType.icon;
              
              return (
                <div
                  key={sessionType.id}
                  onClick={() => setSelectedSessionType(sessionType.id)}
                  className="group cursor-pointer"
                >
                  <div className="bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl p-6 transition-all duration-200 hover:shadow-md h-full flex flex-col min-h-[200px]">
                    {/* Icon and Title */}
                    <div className="flex items-start gap-4 mb-4 flex-1">
                      <div className="flex-shrink-0">
                        <IconComponent className="text-2xl text-emerald-700 dark:text-emerald-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-1 line-clamp-2">
                          {sessionType.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                          {sessionType.subtitle}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
                          {sessionType.description}
                        </p>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {sessionType.count} sessions
                      </span>
                      <FaArrowRight className="text-sm text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Session Management View
          <div>
            {/* Back Button and Header - only show back button when not in filtered mode */}
            <div className="flex items-center gap-6 mb-8">
              {!sessionTypeFilter && (
                <button
                  onClick={() => setSelectedSessionType(null)}
                  className="w-12 h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
                </button>
              )}
              
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {pageTitle || sessionTypes.find(s => s.id === (selectedSessionType || sessionTypeFilter))?.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {sessionTypes.find(s => s.id === (selectedSessionType || sessionTypeFilter))?.description}
                </p>
              </div>
              
              <button
                onClick={() => openModal(selectedSessionType || sessionTypeFilter || '')}
                className="ml-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <FaPlus className="text-sm" />
                  <span>create session</span>
                </div>
              </button>
            </div>

            {/* Sessions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getCurrentMeetings().length > 0 ? (
                getCurrentMeetings().map((meeting, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl p-6 transition-all duration-200 hover:shadow-md h-full flex flex-col min-h-[200px]"
                  >
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                          <span className="text-lg">{sessionTypes.find(s => s.id === (selectedSessionType || sessionTypeFilter))?.emoji}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-1 line-clamp-2">
                          {meeting.meet_title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                          {meeting.course_name}
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <FaCalendarAlt className="text-xs text-emerald-600 dark:text-emerald-400" />
                            <span className="text-xs">{formatDate(meeting.date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <FaClock className="text-xs text-emerald-600 dark:text-emerald-400" />
                            <span className="text-xs">{meeting.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
                      <button
                        onClick={() => handleCopy(meeting._id, meeting.meet_link)}
                        className="flex-1 py-2 px-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                      >
                        copy
                      </button>
                      <button
                        onClick={() => handleShare(meeting.meet_link)}
                        className="flex-1 py-2 px-3 bg-emerald-600 dark:bg-emerald-700 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-all duration-200"
                      >
                        share
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
                    <FaRegCalendarAlt className="text-2xl text-gray-500 dark:text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    No sessions yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Create your first session to get started
                  </p>
                  <button
                    onClick={() => openModal(selectedSessionType || sessionTypeFilter || '')}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all duration-200"
                  >
                    Create Session
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
        )}
      </div>

      {/* Create Session Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">create new session ✨</h3>
                <p className="text-gray-600 dark:text-gray-400">set up your {sessionTypes.find(s => s.id === (selectedSessionType || sessionTypeFilter))?.title.toLowerCase()}</p>
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
                    disabled={!!categoryFilter}
                  >
                    {selected || categoryFilter || "select category"}
                  </button>
                  {dropdownOpen && !categoryFilter && (
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
                                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg"></div>
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

              {/* Session Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  session title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("meet_title")}
                  type="text"
                  className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
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
                  className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
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
                    className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
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
                    <span className="text-emerald-600 dark:text-emerald-400">
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
                      className="mr-3 w-4 h-4 text-emerald-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-emerald-500"
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
                          className="mr-3 w-4 h-4 text-emerald-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-emerald-500"
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
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300 hover:shadow-lg"
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