"use client";
import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
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

// Validation Schema
const schema = yup.object({
  category: yup.string().required("Course Category is required"),
  course_name: yup.string().required("Course name is required"),
  meet_link: yup.string().required("Meet link is required"),
  meet_title: yup.string().required("Meet title is required"),
  time: yup.string().required("Please select the time."),
  date: yup.date().required("Date is required"),
});

const getTimeDifference = (meetingDate, meetingTime) => {
  const now = moment();
  const meetingMoment = moment(
    `${meetingDate} ${meetingTime}`,
    "YYYY-MM-DD HH:mm"
  );
  const diffMinutes = meetingMoment.diff(now, "minutes");

  if (diffMinutes > 1440) {
    // More than 24 hours, calculate in days
    const diffDays = Math.ceil(diffMinutes / 1440);
    return `Starts in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
  } else if (diffMinutes > 0) {
    // Less than 24 hours, calculate in minutes
    return `Starts in ${diffMinutes} minutes`;
  } else if (diffMinutes === 0) {
    return "Meeting is starting now!";
  } else {
    return "Meeting has already started.";
  }
};

const OnlineMeeting = () => {
  const { postQuery, loading } = usePostQuery();
  const { getQuery } = useGetQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState();
  const [meeting, setMeeting] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [copiedCardId, setCopiedCardId] = useState(null);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState();
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Format date to DD-MM-YYYY
  const formatDate = (date) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(date).toLocaleDateString("en-GB", options);
  };

  useEffect(() => {
    // Fetch course categories and course names when the component mounts
    const fetchInitialData = async () => {
      try {
        // Fetch categories
        await getQuery({
          url: apiUrls?.categories?.getAllCategories,
          onSuccess: (data) => {
            setCategories(data.data);
            console.log("Categories: ", data.data);
          },
          onFail: (err) => {
            console.error("Error fetching categories", err);
          },
        });

        // Fetch courses
        await getQuery({
          url: apiUrls?.courses?.getAllCourses,
          onSuccess: (data) => {
            setCourses(data);
            console.log("Courses: ", data);
          },
          onFail: (err) => {
            console.error(
              "API error:",
              err instanceof Error ? err.message : err
            );
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
      // Clear everything if no category is selected
      setFilteredCourses([]);
      setEnrolledStudents([]);
      setSelectedCourseId();
      console.log("No category selected, clearing states.");
      return; // Exit early
    }

    console.log("Selected Category: ", selectedCategory);

    // Reset dependent states
    setFilteredCourses([]);
    setEnrolledStudents([]);
    setSelectedCourseId();

    // Filter courses based on the selected category
    const filteredCourses = courses.filter(
      (course) => course.category === selectedCategory
    );
    setFilteredCourses(filteredCourses);

    console.log("Filtered Courses: ", filteredCourses);
  }, [selectedCategory, courses]);

  useEffect(() => {
    // Fetch enrolled students when a course is selected
    const fetchEnrolledStudents = async () => {
      try {
        await getQuery({
          url: `${apiUrls?.EnrollCourse?.getEnrolledStudentsByCourseId}/${selectedCourseId}`,
          onSuccess: (data) => {
            const enrolledStudents = data.map((s) => s.student_id);
            console.log("Enrolled Students: ", enrolledStudents);
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
      console.log("Selected Course ID: ", selectedCourseId);

      // Reset enrolled students before fetching
      setEnrolledStudents([]);
      fetchEnrolledStudents();
    }
  }, [selectedCourseId]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        await getQuery({
          url: apiUrls?.onlineMeeting?.getAllMeetings,
          onSuccess: (data) => {
            setMeeting(data);
          },
          onFail: (err) => {
            console.error(
              "API error:",
              err instanceof Error ? err.message : err
            );
          },
        });
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchMeetings();
  }, [updateStatus]);

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
          time: selectedTime ? selectedTime.format("HH:mm") : null,
          date: selectedDate ? moment(selectedDate).format("YYYY-MM-DD") : null,
        },
        onSuccess: () => {
          toast.success("Meeting scheduled successfully!");
          reset();
          setSelectedDate(null);
          setSelectedTime(null);
          closeModal();
          setUpdateStatus((prev) => !prev);
          resetStates();
          setFetchAgain(true);
        },
        onFail: () => {
          toast.error("Error scheduling meeting.");
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
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
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
      setCopiedCardId(cardId);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
        setCopiedCardId(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleShare = async (meetingLink) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join the Meeting",
          text: "Here's the link to join the meeting:",
          url: meetingLink,
        });
        console.log("Successfully shared!");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(meetingLink);
        alert("Link copied to clipboard!");
      } catch (error) {
        console.error("Error copying link:", error);
      }
    }
  };

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter meetings based on the search query
  const filteredMeetings = meeting.filter((m) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      m.meet_title?.toLowerCase().includes(lowerCaseQuery) ||
      m.course_name?.toLowerCase().includes(lowerCaseQuery) ||
      moment(m.date).format("DD-MM-YYYY").includes(lowerCaseQuery)
    );
  });

  if (loading) return <Preloader />;

  return (
    <div className="min-h-screen dark:bg-inherit bg-gray-100 flex flex-col justify-start font-Poppins pt-8">
      <div className="bg-white dark:bg-inherit dark:text-white dark:border shadow-lg rounded-lg w-full max-w-6xl p-6 sm:p-8 md:p-10 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Online Meeting</h2>
          <div className="flex justify-end space-x-4">
            <input
              type="text"
              placeholder="Search meetings..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="border border-gray-300 dark:bg-inherit dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none"
            />
            <button
              className="bg-customGreen text-white px-4 py-2 rounded-lg hover:bg-customGreen"
              onClick={openModal}
            >
              + Create Meeting
            </button>
          </div>
        </div>

        {/* Meetings List */}
        <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-3 gap-8">
          {filteredMeetings.length > 0 ? (
            filteredMeetings.map((meeting, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-inherit p-4 rounded-lg shadow-md border border-gray-200 w-[298.2px] h-[281.8px] flex flex-col"
              >
                <h3 className="text-lg font-semibold mb-2">
                  Meeting Title: {meeting.meet_title}
                </h3>
                {meeting.time && (
                  <p className="text-customGreen text-sm mb-2 flex items-center">
                    <svg
                      width="13"
                      height="14"
                      viewBox="0 0 13 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1"
                    >
                      <path
                        d="M6.30078 11.3016C8.61078 11.3016 10.5008 9.41156 10.5008 7.10156C10.5008 4.79156 8.61078 2.90156 6.30078 2.90156C3.99078 2.90156 2.10078 4.79156 2.10078 7.10156C2.10078 9.41156 3.99078 11.3016 6.30078 11.3016ZM6.30078 1.85156C9.18828 1.85156 11.5508 4.21406 11.5508 7.10156C11.5508 9.98906 9.18828 12.3516 6.30078 12.3516C3.41328 12.3516 1.05078 9.98906 1.05078 7.10156C1.05078 4.21406 3.41328 1.85156 6.30078 1.85156ZM8.92578 8.09906L8.55828 8.78156L5.77578 7.25906V4.47656H6.56328V6.78656L8.92578 8.09906Z"
                        fill="#7ECA9D"
                      />
                    </svg>
                    <div className="ml-2">
                      {getTimeDifference(meeting.date, meeting.time)}
                    </div>
                  </p>
                )}
                <div className="flex items-center text-gray-600 text-sm mt-6 mb-2">
                  <FaCalendarAlt className="mr-2" />
                  <span>{formatDate(meeting.date)}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm mb-4">
                  <FaClock className="mr-2" />
                  <span>
                    <span>
                      {meeting.time} -{" "}
                      {moment(meeting.time, "HH:mm")
                        .clone()
                        .add(1, "hour")
                        .format("HH:mm")}
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-center gap-4 text-customGreen text-sm mt-auto">
                  <button
                    className="flex items-center gap-1 hover:text-customGreen"
                    onClick={() => handleCopy(meeting._id, meeting.meet_link)}
                  >
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 21 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={
                        copiedCardId === meeting._id
                          ? "text-gray-400"
                          : "text-customGreen"
                      }
                    >
                      <g clipPath="url(#clip0_269_7570)">
                        <path
                          d="M16.7666 7.37109H8.43327C7.51279 7.37109 6.7666 8.11729 6.7666 9.03776V17.3711C6.7666 18.2916 7.51279 19.0378 8.43327 19.0378H16.7666C17.6871 19.0378 18.4333 18.2916 18.4333 17.3711V9.03776C18.4333 8.11729 17.6871 7.37109 16.7666 7.37109Z"
                          stroke={
                            copiedCardId === meeting._id ? "#D3D3D3" : "#7ECA9D"
                          }
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15.8008 5.80469L18.4333 9.03719M18.4333 9.03719L14.7008 9.03719M18.4333 9.03719L14.7008 9.03719"
                          stroke={
                            copiedCardId === meeting._id ? "#D3D3D3" : "#7ECA9D"
                          }
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </svg>
                    Copy
                  </button>
                  <button
                    className="flex items-center gap-1 hover:text-customGreen"
                    onClick={() => handleShare(meeting.meet_link)}
                  >
                    <FaShare className="text-customGreen" size={17} />
                    Share
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center w-full">
              No meetings found
            </p>
          )}{" "}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50 z-50">
            <div className="bg-white dark:bg-black p-4 max-h-[90vh] overflow-auto rounded-lg w-[400px] md:w-[550px]">
              {/* <div className="flex justify-between items-center mb-2"> */}
              <div className="bg-white dark:bg-black p-4  rounded-lg w-full relative">
                <h3 className="text-2xl font-semibold mb-4">Create Meeting</h3>
                <button
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                  onClick={closeModal}
                >
                  X
                </button>
              </div>
              <p className="text-sm mb-4">
                <strong>Create the Link</strong>
                <br />
                1. Go to{" "}
                <a
                  href="https://meet.google.com"
                  target="_blank"
                  className="text-green-500 hover:underline"
                >
                  Google Meet
                </a>{" "}
                and generate a link.
                <br />
                2. Copy the Link and Paste below
              </p>
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Course Name Dropdown */}
                <div className="mb-4">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium  text-gray-600 mb-2"
                  >
                    Course Category
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    {...register("category")}
                    className="w-full p-2 border rounded-lg text-gray-600"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {categories &&
                      categories.map((category, index) => (
                        <option key={index} value={category.category_name}>
                          {category.category_name}
                        </option>
                      ))}
                  </select>

                  {errors.category && (
                    <p className="text-red-500 text-xs">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="course_name"
                    className="block text-sm font-medium  text-gray-600 mb-2"
                  >
                    Course Name
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    {...register("course_name")}
                    className="w-full p-2 border rounded-lg text-gray-600"
                    value={selectedCourseId || ""}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                  >
                    <option value="">Select Course</option>
                    {filteredCourses &&
                      filteredCourses.map((course, index) => (
                        <option key={index} value={course._id}>
                          {course.course_title}
                        </option>
                      ))}
                  </select>

                  {errors.course_name && (
                    <p className="text-red-500 text-xs">
                      {errors.course_name.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="students"
                    className="flex justify-between text-sm font-medium text-gray-600 mb-2"
                  >
                    <p>
                      Enrolled Students
                      <span className="text-red-500 ml-1">*</span>
                    </p>
                    <p className="text-green-500">
                      Selected: {selectedStudents.length} /{" "}
                      {enrolledStudents.length}
                    </p>
                  </label>

                  {/* Check if students are available */}
                  {enrolledStudents.length > 0 ? (
                    <>
                      {/* Select All Option */}
                      <div className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id="selectAll"
                          checked={
                            selectedStudents.length ===
                              enrolledStudents.length &&
                            enrolledStudents.length > 0
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              // Select all students
                              setSelectedStudents(
                                enrolledStudents.map((student) => student._id)
                              );
                            } else {
                              // Deselect all students
                              setSelectedStudents([]);
                            }
                          }}
                          className="mr-2"
                        />
                        <label htmlFor="selectAll" className="text-gray-600">
                          Select All
                        </label>
                      </div>

                      {/* List of Students */}
                      <div className="max-h-40 overflow-y-auto border p-2 rounded-lg">
                        {enrolledStudents.map((student) => (
                          <div
                            key={student._id}
                            className="flex items-center mb-2"
                          >
                            <input
                              type="checkbox"
                              id={`student-${student._id}`}
                              checked={selectedStudents.includes(student._id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  // Add the student to selected list
                                  setSelectedStudents([
                                    ...selectedStudents,
                                    student._id,
                                  ]);
                                } else {
                                  // Remove the student from selected list
                                  setSelectedStudents(
                                    selectedStudents.filter(
                                      (id) => id !== student._id
                                    )
                                  );
                                }
                              }}
                              className="mr-2"
                            />
                            <label
                              htmlFor={`student-${student._id}`}
                              className="text-gray-600"
                            >
                              {student.full_name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    // Show this message if no students are enrolled
                    <p className="text-gray-500 text-sm">
                      No students available.
                    </p>
                  )}
                </div>

                {/* Meeting Tag */}
                <div className="mb-4">
                  <label
                    htmlFor="meeting_tag"
                    className="block text-sm font-medium text-gray-600 mb-2"
                  >
                    Meeting Tag
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    {...register("meeting_tag", {
                      required: "Meeting tag is required",
                    })}
                    id="meeting_tag"
                    className="w-full p-2 border rounded-lg text-gray-600"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select meeting tag
                    </option>
                    <option value="live">Live</option>
                    <option value="demo">Demo</option>
                    <option value="recorded">Recorded</option>
                    <option value="main">Main</option>
                  </select>
                  {errors.meeting_tag && (
                    <p className="text-red-500 text-xs">
                      {errors.meeting_tag.message}
                    </p>
                  )}
                </div>

                {/* Meet Link */}
                <div className="mb-4">
                  <label
                    htmlFor="meet_link"
                    className="block text-sm font-medium text-gray-600 mb-2"
                  >
                    Meet Link
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    {...register("meet_link")}
                    type="text"
                    className="w-full p-2 border rounded-lg text-gray-600"
                    placeholder="Enter meet link"
                  />
                  {errors.meet_link && (
                    <p className="text-red-500 text-xs">
                      {errors.meet_link.message}
                    </p>
                  )}
                </div>

                {/* Meet Title */}
                <div className="mb-4">
                  <label
                    htmlFor="meet_title"
                    className="block text-sm font-medium text-gray-600 mb-2"
                  >
                    Meet Title
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    {...register("meet_title")}
                    type="text"
                    className="w-full p-2 border rounded-lg text-gray-600"
                    placeholder="Enter meet title"
                  />
                  {errors.meet_title && (
                    <p className="text-red-500 text-xs">
                      {errors.meet_title.message}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div className="flex">
                  <div className="mb-4 mr-4">
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-gray-600 mb-2"
                    >
                      Date
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <DatePicker
                      name="date"
                      selected={selectedDate}
                      onChange={handleDateChange}
                      placeholder="Select Date"
                      dateFormat="yyyy/MM/dd"
                      className="w-full p-2 border rounded-lg"
                    />
                    {errors.date && (
                      <p className="text-red-500 text-xs">
                        {errors.date.message}
                      </p>
                    )}
                  </div>

                  {/* Time */}
                  <div className="mb-4">
                    <label
                      htmlFor="time"
                      className="block text-sm font-medium text-gray-600 mb-2"
                    >
                      Time
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <TimePicker
                      value={selectedTime}
                      onChange={handleTimeChange}
                      showSecond={false}
                      use12Hours
                      format="h:mm a"
                      placeholder="Select Time"
                      className="w-full p-2 rounded-lg custom-timepicker"
                      style={{ height: "50px", fontSize: "16px" }}
                    />
                    {errors?.time && (
                      <p className="text-red-500 text-xs">
                        {errors.time.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="mt-6 w-full bg-customGreen text-white py-2 rounded-lg hover:bg-customGreen"
                    // onClick={closeModal}
                  >
                    Create New Meeting
                  </button>
                </div>
              </form>

              <button
                className="absolute top-2 right-2 text-xl text-gray-600"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineMeeting;
