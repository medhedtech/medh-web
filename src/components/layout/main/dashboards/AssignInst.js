"use client";

import React, { useEffect, useState } from "react";
import MyTable from "@/components/shared/common-table/page";
import { apiUrls } from "@/apis";
import usePostQuery from "@/hooks/postQuery.hook";
import useGetQuery from "@/hooks/getQuery.hook";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Preloader from "@/components/shared/others/Preloader";

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
  course_type: yup.string().required("Course type is required"),
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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    // Fetch instructor data
    const fetchInstructors = async () => {
      try {
        await getQuery({
          url: apiUrls?.Instructor?.getAllInstructors,
          onSuccess: (data) => {
            setInstructors(data);
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
        console.error("Error fetching instructors:", error);
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

  const onSubmit = async (data) => {
    try {
      await postQuery({
        url: apiUrls?.assignedInstructors?.createAssignedInstructor,
        postData: {
          full_name: data.full_name,
          email: data.email,
          course_title: data.course_title,
          course_type: data.course_type,
        },
        onSuccess: () => {
          toast.success("Instructor assigned successfully!");
          reset();
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
          setInstructorDetails(data);
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

  const handleUpdateAssignedInstructor = async () => {
    if (!instructorDetails) return;

    try {
      await postQuery({
        url: `${apiUrls?.assignedInstructors?.updateAssignedInstructor}/${selectedInstructor}`,
        postData: {
          full_name: instructorDetails.full_name,
          email: instructorDetails.email,
          course_title: instructorDetails.course_title,
          course_type: instructorDetails.course_type,
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
    { Header: "Type", accessor: "course_type" },
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
              <div>
                <label className="block text-[#808080] text-xs px-2 font-medium mb-1">
                  Full Name
                </label>
                <select
                  className="w-full px-4 py-2 border rounded-lg dark:bg-inherit dark:text-white text-gray-700 focus:outline-none"
                  {...register("full_name")}
                >
                  <option value="">Select Instructor</option>
                  {instructors.map((instructor) => (
                    <option key={instructor.id} value={instructor.full_name}>
                      {instructor.full_name}
                    </option>
                  ))}
                </select>
                {errors.full_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.full_name.message}
                  </p>
                )}
              </div>

              {/* Instructor Email */}
              <div>
                <label className="block text-[#808080] text-xs px-2 font-medium mb-1">
                  Email
                </label>
                <select
                  className="w-full px-4 py-2 border rounded-lg dark:bg-inherit dark:text-white text-gray-700 focus:outline-none"
                  {...register("email")}
                >
                  <option value="">Select Email</option>
                  {instructors.map((instructor) => (
                    <option key={instructor.id} value={instructor.email}>
                      {instructor.email}
                    </option>
                  ))}
                </select>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Course Title */}
              <div>
                <label className="block text-[#808080] text-xs px-2 font-medium mb-1">
                  Course Title
                </label>
                <select
                  className="w-full px-4 py-2 border rounded-lg dark:bg-inherit dark:text-white text-gray-700 focus:outline-none"
                  {...register("course_title")}
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.course_title}>
                      {course.course_title}
                    </option>
                  ))}
                </select>
                {errors.course_title && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.course_title.message}
                  </p>
                )}
              </div>

              {/* Course Type */}
              <div>
                <label className="block text-[#808080] text-xs px-2 font-medium mb-1">
                  Course Type
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
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg mr-2 hover:bg-gray-300"
                onClick={() => reset()}
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
                  onChange={(e) =>
                    setInstructorDetails({
                      ...instructorDetails,
                      full_name: e.target.value,
                    })
                  }
                  disabled
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
                  onChange={(e) =>
                    setInstructorDetails({
                      ...instructorDetails,
                      email: e.target.value,
                    })
                  }
                  disabled
                  placeholder="Instructor Email"
                  className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div>
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
              </div>
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
