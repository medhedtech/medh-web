"use client";

import React, { useEffect, useRef, useState } from "react";
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
  const { postQuery, loading } = usePostQuery();
  const { getQuery } = useGetQuery();

  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assignedInstructors, setAssignedInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [instructorDetails, setInstructorDetails] = useState(null);
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
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        await getQuery({
          url: apiUrls.Instructor.getAllInstructors,
          onSuccess: (response) => {
            if (Array.isArray(response)) {
              setInstructors(response);
            } else if (response?.data && Array.isArray(response.data)) {
              setInstructors(response.data);
            } else {
              setInstructors([]);
              console.error("Invalid API response:", response);
            }
          },
          onFail: () => {
            setInstructors([]);
          },
        });
      } catch (error) {
        console.error("Failed to fetch instructors:", error);
        setInstructors([]);
      }
    };

    // Fetch course data
    const fetchCourses = async () => {
      try {
        await getQuery({
          url: apiUrls?.courses?.getAllCourses,
          onSuccess: (data) => {
            setCourses(data);
          },
          onFail: (err) => {
            toast.error(
              `Failed to fetch courses: ${
                err instanceof Error ? err.message : err
              }`
            );
          },
        });
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchInstructors();
    fetchCourses();
  }, []);

  const fetchAssignedInstructors = async () => {
    try {
      await getQuery({
        url: apiUrls?.assignedInstructors?.getAllAssignedInstructors,
        onSuccess: (data) => {
          setAssignedInstructors(data);
        },
        onFail: (err) => {
          toast.error(
            `Failed to fetch instructors: ${
              err instanceof Error ? err.message : err
            }`
          );
        },
      });
    } catch (error) {
      console.error("Error fetching assigned instructors:", error);
    }
  };

  useEffect(() => {
    fetchAssignedInstructors();
  }, []);

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

  const filteredCourses = courses?.filter((course) =>
    course.course_title.toLowerCase().includes(searchTerm.toLowerCase())
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

  const onSubmit = async (data) => {
    try {
      await postQuery({
        url: apiUrls?.assignedInstructors?.createAssignedInstructor,
        postData: {
          full_name: data.full_name,
          email: data.email,
          course_title: data.course_title,
          // course_type: data.course_type,
          user_id: data.user_id,
        },
        onSuccess: () => {
          toast.success("Instructor assigned successfully!");
          reset();
          resetStates();
          fetchAssignedInstructors();
        },
        onFail: () => {
          toast.error("Error assigning instructor.");
        },
      });
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

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

  const handleUpdateAssignedInstructor = async () => {
    try {
      await postQuery({
        url: `${apiUrls?.assignedInstructors?.updateAssignedInstructor}/${selectedInstructor}`,
        postData: {
          full_name: instructorDetails.full_name,
          email: instructorDetails.email,
          course_title: instructorDetails.course_title,
          // course_type: instructorDetails.course_type,
        },
        onSuccess: () => {
          toast.success("Instructor updated successfully!");
          closeModal();
          fetchAssignedInstructors();
        },
        onFail: () => {
          toast.error("Error updating instructor.");
        },
      });
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

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

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="min-h-screen font-Poppins dark:bg-inherit bg-gray-100 p-6 flex items-center pt-9 justify-center">
      <div className="container max-w-6xl w-full mx-auto">
        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white dark:bg-inherit dark:border dark:text-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Assign Instructor</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Instructor Full Name */}
              <div className="relative -mt-2" ref={fullNameDropdownRef}>
                <label
                  htmlFor="full_name"
                  className="text-xs px-2 text-[#808080] font-medium mb-1"
                >
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

              <div className="relative -mt-2" ref={emailDropdownRef}>
                <label
                  htmlFor="email"
                  className="text-xs px-2 text-[#808080] font-medium mb-1"
                >
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

              <div className="relative -mt-2" ref={courseDropdownRef}>
                <label
                  htmlFor="course_name"
                  className="text-xs px-2 text-[#808080] font-medium mb-1"
                >
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

              {/* Course Type */}
              {/* <div>
                <label className="block text-[#808080] text-xs px-2 font-medium mb-1">
                  Course Type
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  className="w-full px-4 py-2 border rounded-lg dark:bg-inherit dark:text-white text-gray-700 focus:outline-none"
                  {...register("course_type")}
                >
                  <option value="">Select Type</option>
                  <option value="Live">Live</option>
                  <option value="Demo">Demo</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Institute">Institute</option>
                </select>
                {errors.course_type && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.course_type.message}
                  </p>
                )}
              </div> */}
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg mr-2 hover:bg-gray-300"
                onClick={() => {
                  reset();
                  resetStates();
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-customGreen text-white px-4 py-2 rounded-lg flex items-center"
              >
                Assign Instructor
              </button>
            </div>
          </div>
        </form>

        {/* Table Section */}
        <div className="bg-white dark:bg-inherit dark:text-white dark:border font-Poppins rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Assigned Instructor</h2>
          <MyTable columns={columns} data={assignedInstructors} />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && instructorDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-black dark:text-white rounded-lg shadow-lg p-8 w-full max-w-3xl">
            <h2 className="text-xl font-semibold mb-4">
              Edit Assigned Instructor
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={closeModal}
                className="text-gray-600 border border-gray-300 rounded-md px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateAssignedInstructor}
                className="bg-[#7ECA9D] text-white border border-[#7ECA9D] rounded-md px-4 py-2"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignInstructor;
