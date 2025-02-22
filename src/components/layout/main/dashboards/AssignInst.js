"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import MyTable from "@/components/shared/common-table/page";
import { apiUrls } from "@/apis";
import usePostQuery from "@/hooks/postQuery.hook";
import useGetQuery from "@/hooks/getQuery.hook";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Preloader from "@/components/shared/others/Preloader";
import Image from "next/image";

const formatDateTime = (dateTime) => {
  const dateObj = new Date(dateTime);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year}  ${hours}:${minutes}`;
};

// Validation Schema
const schema = yup.object({
  full_name: yup.string().required("Instructor name is required"),
  email: yup.string().email().required("Instructor Email is required"),
  course_title: yup.string().required("Course name is required"),
  // course_type: yup.string().required("Course type is required"),
});

const AssignInstructor = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { postQuery, loading: postLoading } = usePostQuery();
  const { getQuery, loading: getLoading } = useGetQuery();
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState(null);

  // State Management
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assignedInstructors, setAssignedInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [instructorDetails, setInstructorDetails] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Dropdown States
  const courseDropdownRef = useRef(null);
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const fullNameDropdownRef = useRef(null);
  const [fullNameDropdownOpen, setFullNameDropdownOpen] = useState(false);
  const [selectedFullName, setSelectedFullName] = useState("");
  const [searchTermFullName, setSearchTermFullName] = useState("");
  const emailDropdownRef = useRef(null);
  const [emailDropdownOpen, setEmailDropdownOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [searchTermEmail, setSearchTermEmail] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Enhanced fetch instructors with retry mechanism
  const fetchInstructors = useCallback(async (retryCount = 0) => {
    try {
      setPageLoading(true);
      setPageError(null);
      
      await getQuery({
        url: apiUrls.Instructor.getAllInstructors,
        onSuccess: (response) => {
          let data = [];
          if (Array.isArray(response)) {
            data = response;
          } else if (response?.data && Array.isArray(response.data)) {
            data = response.data;
          }
          setInstructors(data);
        },
        onFail: (error) => {
          if (retryCount < 3) {
            setTimeout(() => fetchInstructors(retryCount + 1), 1000 * (retryCount + 1));
          } else {
            setPageError("Failed to fetch instructors. Please try again.");
            toast.error("Failed to load instructors");
          }
        },
      });
    } catch (error) {
      setPageError("An unexpected error occurred");
    } finally {
      setPageLoading(false);
    }
  }, [getQuery]);

  // Enhanced fetch courses with retry mechanism
  const fetchCourses = useCallback(async (retryCount = 0) => {
    try {
      setPageLoading(true);
      await getQuery({
        url: apiUrls?.courses?.getAllCourses,
        onSuccess: (response) => {
          let data = [];
          if (Array.isArray(response)) {
            data = response;
          } else if (response?.data && Array.isArray(response.data)) {
            data = response.data;
          }
          setCourses(data);
        },
        onFail: (error) => {
          if (retryCount < 3) {
            setTimeout(() => fetchCourses(retryCount + 1), 1000 * (retryCount + 1));
          } else {
            toast.error("Failed to load courses");
          }
        },
      });
    } finally {
      setPageLoading(false);
    }
  }, [getQuery]);

  // Enhanced fetch assigned instructors
  const fetchAssignedInstructors = useCallback(async (retryCount = 0) => {
    try {
      setPageLoading(true);
      await getQuery({
        url: apiUrls?.assignedInstructors?.getAllAssignedInstructors,
        onSuccess: (response) => {
          let data = [];
          if (Array.isArray(response)) {
            data = response;
          } else if (response?.data && Array.isArray(response.data)) {
            data = response.data;
          }
          setAssignedInstructors(data);
        },
        onFail: (error) => {
          if (retryCount < 3) {
            setTimeout(() => fetchAssignedInstructors(retryCount + 1), 1000 * (retryCount + 1));
          } else {
            toast.error("Failed to load assigned instructors");
          }
        },
      });
    } finally {
      setPageLoading(false);
    }
  }, [getQuery]);

  useEffect(() => {
    fetchInstructors();
    fetchCourses();
    fetchAssignedInstructors();
  }, [refreshKey]);

  // Enhanced form submission
  const onSubmit = async (data) => {
    try {
      setPageLoading(true);
      await postQuery({
        url: apiUrls?.assignedInstructors?.createAssignedInstructor,
        postData: {
          full_name: data.full_name,
          email: data.email,
          course_title: data.course_title,
          user_id: data.user_id,
        },
        onSuccess: () => {
          toast.success("Instructor assigned successfully!");
          reset();
          resetStates();
          setRefreshKey(prev => prev + 1);
        },
        onFail: (error) => {
          toast.error(error?.message || "Error assigning instructor");
        },
      });
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setPageLoading(false);
    }
  };

  // Enhanced update handler
  const handleUpdateAssignedInstructor = async () => {
    if (!selectedInstructor || !instructorDetails) return;

    try {
      setPageLoading(true);
      await postQuery({
        url: `${apiUrls?.assignedInstructors?.updateAssignedInstructor}/${selectedInstructor}`,
        postData: {
          full_name: instructorDetails.full_name,
          email: instructorDetails.email,
          course_title: instructorDetails.course_title,
        },
        onSuccess: () => {
          toast.success("Instructor updated successfully!");
          closeModal();
          setRefreshKey(prev => prev + 1);
        },
        onFail: (error) => {
          toast.error(error?.message || "Error updating instructor");
        },
      });
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        courseDropdownRef.current &&
        !courseDropdownRef.current.contains(event.target)
      ) {
        setCourseDropdownOpen(false);
      }
      if (
        fullNameDropdownRef.current &&
        !fullNameDropdownRef.current.contains(event.target)
      ) {
        setFullNameDropdownOpen(false);
      }
      if (
        emailDropdownRef.current &&
        !emailDropdownRef.current.contains(event.target)
      ) {
        setEmailDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleCourseDropdown = (e) => {
    e.preventDefault();
    setCourseDropdownOpen((prev) => !prev);
  };

  const selectCourse = (courseName) => {
    setSelectedCourse(courseName);
    setValue("course_title", courseName);
    setCourseDropdownOpen(false);
    setSearchTerm("");
  };

  const filteredCourses = (Array.isArray(courses) ? courses : []).filter((course) => 
    (course.course_title || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  const toggleFullNameDropdown = (e) => {
    e.preventDefault();
    setFullNameDropdownOpen((prev) => !prev);
  };

  // const selectInstructor = (fullName) => {
  //   setSelectedFullName(fullName);
  //   setValue("full_name", fullName);
  //   setFullNameDropdownOpen(false);
  //   setSearchTermFullName("");
  // };

  const selectInstructor = (fullName) => {
    setSelectedFullName(fullName);
    setValue("full_name", fullName);
    // Find the instructor by full name
    const instructor = instructors.find((ins) => ins.full_name === fullName);
    if (instructor) {
      setValue("email", instructor.email);
      setValue("user_id", instructor._id);
      setSelectedEmail(instructor.email);
    }
    setFullNameDropdownOpen(false);
    setSearchTermFullName("");
  };

  const filteredInstructors = instructors?.filter((ins) =>
    ins.full_name.toLowerCase().includes(searchTermFullName.toLowerCase())
  );

  const toggleEmailDropdown = (e) => {
    e.preventDefault();
    setEmailDropdownOpen((prev) => !prev);
  };

  const selectInstructorEmail = (email) => {
    setSelectedEmail(email);
    setValue("email", email);
    const selectedInstructor = instructors.find((ins) => ins.email === email);
    if (selectedInstructor) {
      setValue("user_id", selectedInstructor._id);
    }

    setEmailDropdownOpen(false);
    setSearchTermEmail("");
  };

  const filteredInstructorsEmail = instructors?.filter((ins) =>
    ins.email.toLowerCase().includes(searchTermEmail.toLowerCase())
  );

  const resetStates = () => {
    setIsModalOpen(false);
    setInstructorDetails(null);
    setSelectedInstructor(null);
    setCourseDropdownOpen(false);
    setSelectedCourse("");
    setSearchTerm("");
    setFullNameDropdownOpen(false);
    setSelectedFullName("");
    setSearchTermFullName("");
    setEmailDropdownOpen(false);
    setSelectedEmail("");
    setSearchTermEmail("");
  };

  const openModal = (row) => {
    setSelectedInstructor(row._id);
    fetchUpdatedInstructorDetails(row._id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setInstructorDetails(null);
    setSelectedInstructor(null);
  };

  const fetchUpdatedInstructorDetails = async (instructorId) => {
    try {
      await getQuery({
        url: `${apiUrls?.assignedInstructors?.getAssignedInstructorById}/${instructorId}`,
        onSuccess: (data) => {
          // setInstructorDetails(data);
          setInstructorDetails(data.assignment);
        },
        onFail: (err) => {
          toast.error(
            `Failed to fetch instructor details: ${
              err instanceof Error ? err.message : err
            }`
          );
        },
      });
    } catch (error) {
      console.error("Error fetching instructor details:", error);
    }
  };

  console.log("instructorDetails:", instructorDetails);
  console.log("selectedInstructor:", selectedInstructor);

  const columns = [
    {
      Header: "No.",
      accessor: "count",
    },
    { Header: "Name", accessor: "full_name" },
    { Header: "Course", accessor: "course_title" },
    {
      Header: "Date & Time",
      accessor: "createdAt",
      render: (row) => formatDateTime(row?.createdAt),
    },
    // { Header: "Type", accessor: "course_type" },
    {
      Header: "Action",
      accessor: "actions",
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => openModal(row)}
            className="text-[#7ECA9D] border border-[#7ECA9D] rounded-md px-[10px] py-1"
          >
            Edit
          </button>
        </div>
      ),
    },
  ];

  if (pageLoading || postLoading || getLoading) {
    return <Preloader />;
  }

  return (
    <div className="min-h-screen font-Poppins dark:bg-inherit bg-gray-100 p-4 md:p-6 pt-16 md:pt-24">
      <div className="container max-w-6xl w-full mx-auto space-y-6">
        {pageError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{pageError}</p>
            <button
              onClick={() => {
                setPageError(null);
                setRefreshKey(prev => prev + 1);
              }}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try Again
            </button>
          </div>
        )}
        
        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white dark:bg-inherit dark:border dark:text-white rounded-xl shadow-lg">
            {/* Form Header */}
            <div className="p-6 border-b dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold">Assign Instructor</h2>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span>{instructors.length} Instructors</span>
                  </div>
                  <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span>{courses.length} Courses</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Instructor Full Name */}
                <div className="relative" ref={fullNameDropdownRef}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full border border-gray-300 dark:bg-inherit rounded-md py-2 px-3 pr-3 focus:outline-none focus:ring-2 focus:ring-green-400">
                    <button
                      className="w-full text-left"
                      onClick={toggleFullNameDropdown}
                    >
                      {selectedFullName || "Select Instructor"}
                    </button>
                    {fullNameDropdownOpen && (
                      <div className="absolute z-10 left-0 top-20 bg-white border border-gray-400 rounded-lg w-full shadow-xl">
                        <input
                          type="text"
                          className="w-full p-2 border-b focus:outline-none rounded-lg"
                          placeholder="Search..."
                          value={searchTermFullName}
                          onChange={(e) => setSearchTermFullName(e.target.value)}
                        />
                        <ul className="max-h-56 overflow-auto">
                          {filteredInstructors.length > 0 ? (
                            filteredInstructors.map((ins) => (
                              <li
                                key={ins._id}
                                className="hover:bg-gray-100 rounded-lg cursor-pointer flex items-center gap-3 px-3 py-3"
                                onClick={() => {
                                  selectInstructor(ins.full_name);
                                }}
                              >
                                {ins.instructor_image ? (
                                  <Image
                                    src={ins.instructor_image}
                                    alt={ins.full_name || "Instructor Full Name"}
                                    width={32}
                                    height={32}
                                    className="rounded-full min-h-8 max-h-8 min-w-8 max-w-8"
                                  />
                                ) : (
                                  <div className="rounded-full w-8 h-8 bg-customGreen flex items-center justify-center font-bold">
                                    {ins.full_name?.substring(0, 1).toUpperCase()}
                                  </div>
                                )}
                                <span>
                                  {ins.full_name || "No name available"}
                                </span>
                              </li>
                            ))
                          ) : (
                            <li className="p-2 text-gray-500">
                              No instructors found
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  {errors.full_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.full_name.message}
                    </p>
                  )}
                </div>

                <div className="relative" ref={emailDropdownRef}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full border border-gray-300 dark:bg-inherit rounded-md py-2 px-3 pr-3 focus:outline-none focus:ring-2 focus:ring-green-400">
                    <button
                      className="w-full text-left"
                      onClick={toggleEmailDropdown}
                    >
                      {selectedEmail || "Select Email"}
                    </button>
                    {emailDropdownOpen && (
                      <div className="absolute z-10 left-0 top-20 bg-white border border-gray-400 rounded-lg w-full shadow-xl">
                        <input
                          type="text"
                          className="w-full p-2 border-b focus:outline-none rounded-lg"
                          placeholder="Search..."
                          value={searchTermEmail}
                          onChange={(e) => setSearchTermEmail(e.target.value)}
                        />
                        <ul className="max-h-56 overflow-auto">
                          {filteredInstructorsEmail.length > 0 ? (
                            filteredInstructorsEmail.map((ins) => (
                              <li
                                key={ins._id}
                                className="hover:bg-gray-100 rounded-lg cursor-pointer flex items-center gap-3 px-3 py-3"
                                onClick={() => {
                                  selectInstructorEmail(ins.email);
                                }}
                              >
                                {ins.instructor_image ? (
                                  <Image
                                    src={ins.instructor_image}
                                    alt={ins.email || "Instructor Email"}
                                    width={32}
                                    height={32}
                                    className="rounded-full min-h-8 max-h-8 min-w-8 max-w-8"
                                  />
                                ) : (
                                  <div className="rounded-full w-8 h-8 bg-customGreen flex items-center justify-center font-bold">
                                    {ins.email?.substring(0, 1).toUpperCase()}
                                  </div>
                                )}
                                <span>{ins.email || "No email available"}</span>
                              </li>
                            ))
                          ) : (
                            <li className="p-2 text-gray-500">No email found</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="relative" ref={courseDropdownRef}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course Name <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full border border-gray-300 dark:bg-inherit rounded-md py-2 px-3 pr-3 focus:outline-none focus:ring-2 focus:ring-green-400">
                    <button
                      className="w-full text-left"
                      onClick={toggleCourseDropdown}
                    >
                      {selectedCourse || "Select Course"}
                    </button>
                    {courseDropdownOpen && (
                      <div className="absolute z-10 left-0 top-20 bg-white border border-gray-400 rounded-lg w-full shadow-xl">
                        <input
                          type="text"
                          className="w-full p-2 border-b focus:outline-none rounded-lg"
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <ul className="max-h-56 overflow-auto">
                          {filteredCourses.length > 0 ? (
                            filteredCourses.map((course) => (
                              <li
                                key={course._id}
                                className="hover:bg-gray-100 rounded-lg cursor-pointer flex items-center gap-3 px-3 py-3"
                                onClick={() => {
                                  selectCourse(course.course_title);
                                }}
                              >
                                {course.course_image ? (
                                  <Image
                                    src={course.course_image}
                                    alt={course.course_title || "Course Image"}
                                    width={32}
                                    height={32}
                                    className="rounded-full min-h-8 max-h-8 min-w-8 max-w-8"
                                  />
                                ) : (
                                  <div className="rounded-full w-8 h-8 bg-customGreen"></div>
                                )}
                                <span>
                                  {course.course_title || "No title available"}
                                </span>
                              </li>
                            ))
                          ) : (
                            <li className="p-2 text-gray-500">
                              No courses found
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  {errors.course_title && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.course_title.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    resetStates();
                  }}
                  className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 min-w-[140px] justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Assigning...</span>
                    </>
                  ) : (
                    <span>Assign Instructor</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Table Section */}
        <div className="bg-white dark:bg-inherit dark:border dark:text-white rounded-xl shadow-lg">
          <div className="p-6 border-b dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Assigned Instructors</h2>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {assignedInstructors.length} Total Assignments
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="overflow-hidden rounded-lg border dark:border-gray-700">
              <MyTable 
                columns={columns} 
                data={assignedInstructors}
                isLoading={pageLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal with adjusted padding */}
      {isModalOpen && instructorDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl transform transition-all duration-200">
            <div className="p-6 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold">
                Edit Assigned Instructor
              </h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Full Name
                  </label>
                  <select
                    value={instructorDetails.full_name || ""}
                    disabled
                    onChange={(e) =>
                      setInstructorDetails({
                        ...instructorDetails,
                        full_name: e.target.value,
                      })
                    }
                    // disabled
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
                  >
                    <option value="">Select Instructor</option>
                    {instructors.map((instructor) => (
                      <option key={instructor.id} value={instructor.full_name}>
                        {instructor.full_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Course Name
                  </label>
                  <select
                    value={instructorDetails.course_title || ""}
                    onChange={(e) =>
                      setInstructorDetails({
                        ...instructorDetails,
                        course_title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.course_title}>
                        {course.course_title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={instructorDetails.email || ""}
                    disabled
                    onChange={(e) =>
                      setInstructorDetails({
                        ...instructorDetails,
                        email: e.target.value,
                      })
                    }
                    // disabled
                    placeholder="Instructor Email"
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                {/* <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Course Type
                  </label>
                  <select
                    value={instructorDetails.course_type || ""}
                    onChange={(e) =>
                      setInstructorDetails({
                        ...instructorDetails,
                        course_type: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
                  >
                    <option value="">Select Course Type</option>
                    <option value="Live">Live</option>
                    <option value="Demo">Demo</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Institute">Institute</option>
                  </select>
                </div> */}
              </div>

              <div className="flex justify-end gap-4 mt-8 pt-6 border-t dark:border-gray-700">
                <button
                  onClick={closeModal}
                  className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateAssignedInstructor}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignInstructor;
