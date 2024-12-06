"use client";
import { apiUrls } from "@/apis";
import React, { useEffect, useState } from "react";
import MyTable from "@/components/shared/common-table/page";
import useGetQuery from "@/hooks/getQuery.hook";
import Preloader from "@/components/shared/others/Preloader";
import { useRouter } from "next/navigation";
import { FaPlus, FaChevronDown } from "react-icons/fa";
import useDeleteQuery from "@/hooks/deleteQuery.hook";
import { toast } from "react-toastify";
import usePostQuery from "@/hooks/postQuery.hook";
import { MdEdit } from "react-icons/md";

export default function Home() {
  const router = useRouter();
  const { deleteQuery } = useDeleteQuery();
  const { postQuery, loading: PostLoading } = usePostQuery();
  const [courses, setCourses] = useState([]);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    category: "",
    status: "",
  });
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const { getQuery, loading } = useGetQuery();
  const [deletedCourse, setDeletedCourse] = useState(null);
  const [instructorNames, setInstructorNames] = useState({});
  const [updateStatus, setUpdateStatus] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseVideos, setCourseVideos] = useState([]);

  // Fetch courses and instructor details
  useEffect(() => {
    const fetchCourses = async () => {
      await getQuery({
        url: apiUrls?.courses?.getAllCourses,
        onSuccess: async (data) => {
          console.log("Courses fetched successfully:", data);
          setCourses(data || []);
          await fetchInstructors(data);
        },
        onFail: (err) => {
          console.error("Failed to fetch courses:", err);
        },
      });
    };

    const fetchInstructors = async (courses) => {
      const instructorsMap = {};
      await Promise.all(
        courses.map(async (course) => {
          if (course.assigned_instructor) {
            await getQuery({
              url: `${apiUrls?.assignedInstructors?.getAssignedInstructorById}/${course.assigned_instructor}`,
              onSuccess: (instructorData) => {
                instructorsMap[course.assigned_instructor] =
                  instructorData?.full_name || "-";
              },
              onFail: () => {
                instructorsMap[course.assigned_instructor] = "-";
              },
            });
          }
        })
      );
      setInstructorNames(instructorsMap);
    };

    fetchCourses();
  }, [deletedCourse, updateStatus]);

  const handleSortChange = (order) => {
    setSortOrder(order);
    setIsSortDropdownOpen(false);
  };

  const handleFilterDropdownToggle = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  const handleFilterSelect = (filterType, value) => {
    setFilterOptions((prev) => ({ ...prev, [filterType]: value }));
    setIsFilterDropdownOpen(false);
  };

  const toggleStatus = async (id) => {
    try {
      await postQuery({
        url: `${apiUrls?.courses?.toggleCourseStatus}/${id}`,
        postData: {},
        onSuccess: (response) => {
          const updatedStatus = response?.course?.status;
          if (updatedStatus) {
            toast.success(`Status changed to ${updatedStatus}`);
            setUpdateStatus((prev) => (prev === id ? `${id}-updated` : id));
          } else {
            toast.error("Failed to retrieve updated status.");
          }
        },
        onFail: (error) => {
          console.error("Toggle Status API Error:", error);
          toast.error(error?.message || "Course status cannot be changed!");
        },
      });
    } catch (error) {
      console.error("Something went wrong:", error);
      toast.error("Something went wrong!");
    }
  };

  const columns = [
    { Header: "No.", accessor: "no" },
    { Header: "Category", accessor: "category" },
    { Header: "Course Name", accessor: "course_title" },
    { Header: "Instructor", accessor: "instructor" },
    // { Header: "Price", accessor: "course_fee" },
    {
      Header: "Price",
      accessor: "course_fee",
      render: (row) => `$${row.course_fee}`,
    },
    { Header: "Sessions", accessor: "no_of_Sessions" },
    { Header: "Time", accessor: "session_duration" },
    {
      Header: "Status",
      accessor: "status",
      render: (row) => {
        const isPublished = row?.status === "Published";
        return (
          <div className="flex gap-2 items-center">
            <button
              onClick={() => toggleStatus(row?._id)}
              className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                isPublished ? "bg-green-500" : "bg-gray-400"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ${
                  isPublished ? "translate-x-5" : "translate-x-0"
                }`}
              ></div>
            </button>
            <span
              className={`ml-2 text-sm ${
                isPublished ? "text-green-700" : "text-red-700"
              }`}
            >
              {isPublished ? "Published" : "Upcoming"}
            </span>
          </div>
        );
      },
    },
    {
      Header: "Action",
      accessor: "actions",
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => {
              editCourse(row?._id);
            }}
            className="text-green-600 hover:text-green-800 p-2 rounded-full"
          >
            <MdEdit size={24} />
          </button>
          <button
            onClick={() => handleOpenModal(row)}
            className="text-orange bg-orange-600 border border-red-600 rounded-md px-[10px] py-1"
          >
            Add Recorded Videos
          </button>
          <button
            onClick={() => {
              deleteCourse(row?._id);
            }}
            className="text-white bg-red-600 border border-red-600 rounded-md px-[10px] py-1"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const filteredData = courses.filter((course) => {
    const matchesCategory = filterOptions.category
      ? (course.course_category || "")
          .toLowerCase()
          .includes(filterOptions.category.toLowerCase())
      : true;

    const matchesStatus = filterOptions.status
      ? (course.status || "")
          .toLowerCase()
          .includes(filterOptions.status.toLowerCase())
      : true;

    // Search filter for course_title, course_category, and instructor
    const matchesSearchQuery =
      (course.course_title || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (course.course_category || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (instructorNames[course.assigned_instructor] || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    (course.instructor || "").toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesStatus && matchesSearchQuery;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const aDate = new Date(a.createdAt);
    const bDate = new Date(b.createdAt);

    if (sortOrder === "newest" && !isNaN(aDate) && !isNaN(bDate)) {
      return bDate - aDate;
    } else if (sortOrder === "oldest" && !isNaN(aDate) && !isNaN(bDate)) {
      return aDate - bDate;
    }
    return 0;
  });

  const formattedData = sortedData.map((course, index) => ({
    ...course,
    no: index + 1,
    instructor: instructorNames[course.assigned_instructor] || "-",
    createdAt: course.createdAt
      ? new Date(course.createdAt).toLocaleDateString("en-GB")
      : "N/A",
  }));

  const deleteCourse = (id) => {
    deleteQuery({
      url: `${apiUrls?.courses?.deleteCourse}/${id}`,
      onSuccess: (res) => {
        toast.success(res?.message);
        setDeletedCourse(id);
      },
      onFail: (res) => {
        console.log(res, "FAILED");
      },
    });
  };

  if (loading || PostLoading) {
    return <Preloader />;
  }

  const editCourse = (id) => {
    console.log("Edit course: ", id);
    router.push(`admin-updateCourse/${id}`);
  };

  // Open Modal
  const handleOpenModal = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
    setCourseVideos([]); // Reset videos when opening modal
  };

  // Close Modal
  const handleCloseModal = () => {
    setSelectedCourse(null);
    setIsModalOpen(false);
    setCourseVideos([]); // Reset uploaded videos
  };

  // Handle Video Upload
  const handleVideoUpload = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const updatedVideos = [...courseVideos];
      try {
        for (const file of files) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = async () => {
            const base64 = reader.result.split(",")[1];

            console.log("sbjhsdd", base64);
            const postData = { base64String: base64, fileType: "video" };

            await postQuery({
              url: apiUrls?.upload?.uploadMedia,
              postData,
              onSuccess: (data) => {
                console.log("Video uploaded:", data?.data);
                updatedVideos.push(data?.data);
                setCourseVideos([...updatedVideos]);
              },
              onError: () => {
                toast.error("Failed to upload video.");
              },
            });
          };
        }
      } catch (error) {
        console.error("Error during video upload:", error);
        toast.error("Error occurred while uploading videos.");
      }
    }
  };

  console.log("cdksjhbfasd:", courseVideos);

  const addRecordedVideos = () => {
    const { _id: courseId } = selectedCourse;
    const recordedVideos = courseVideos;
    postQuery({
      url: `${apiUrls?.courses?.addRecordedVideos}/${courseId}`,
      postData: { recorded_videos: recordedVideos },
      onSuccess: () => {
        toast.success("Videos added successfully!");
        handleCloseModal();
      },
      onFail: (error) => {
        console.error("Failed to add videos:", error);
        toast.error("Failed to add videos. Please try again.");
      },
    });
  };

  const renderModal = () => {
    if (!selectedCourse) return null;

    const { course_title } = selectedCourse;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 max-w-lg relative">
          {/* Close Button */}
          <button
            onClick={handleCloseModal}
            className="absolute top-3 right-3 text-gray-500 hover:text-black dark:hover:text-white text-lg font-bold"
          >
            ✕
          </button>

          {/* Modal Content */}
          <h2 className="text-lg text-gray-600 font-semibold mb-4">
            Add Recorded Videos for: {course_title}
          </h2>
          <div className="flex flex-col gap-6">
            {/* Video Upload Section */}
            <div>
              <p className="font-semibold mb-2">Upload Recorded Videos:</p>
              <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  className="hidden"
                  id="videoUpload"
                  onChange={handleVideoUpload}
                />
                <label
                  htmlFor="videoUpload"
                  className="cursor-pointer text-blue-500"
                >
                  Click to upload or drag & drop videos
                </label>
              </div>
            </div>

            {/* Display Uploaded Videos */}
            {courseVideos.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Uploaded Videos:</h3>
                <ul className="list-disc pl-6">
                  {courseVideos.map((video, index) => (
                    <li key={index}>
                      <a
                        href={video}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {`Video-${index + 1}`}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={addRecordedVideos}
              className="bg-customGreen text-white px-4 py-2 rounded-lg flex items-center"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 dark:bg-darkblack font-Poppins min-h-screen">
      <div className="max-w-6xl mx-auto dark:bg-inherit dark:text-whitegrey3 dark:border bg-white shadow-lg p-6">
        <header className="flex items-center justify-between px-6 mb-4">
          <h1 className="text-xl font-semibold">Course List</h1>
          <div className="flex items-center space-x-2">
            <div className="relative flex-grow flex justify-center">
              <input
                type="text"
                placeholder="Search here"
                className="border dark:bg-inherit dark:text-whitegrey3 dark:border border-gray-300 rounded-full p-2 pl-4 w-full max-w-md"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <button
                onClick={handleFilterDropdownToggle}
                className="border-2 px-4 py-1 rounded-lg flex items-center"
              >
                Filters
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              {isFilterDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <button
                    onClick={() => handleFilterSelect("status", "Published")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Published
                  </button>
                  <button
                    onClick={() => handleFilterSelect("status", "Upcoming")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Upcoming
                  </button>
                </div>
              )}
            </div>
            {/* Sort Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md dark:bg-inherit dark:text-whitegrey3 dark:border hover:bg-gray-300 flex items-center space-x-1"
              >
                <span>
                  {sortOrder === "newest" ? "New to Oldest" : "Oldest to New"}
                </span>
                <FaChevronDown />
              </button>
              {isSortDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <a
                    href="#"
                    onClick={() => handleSortChange("oldest")}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Oldest to New
                  </a>
                  <a
                    href="#"
                    onClick={() => handleSortChange("newest")}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Newest to Old
                  </a>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                router.push("/dashboards/admin-addcourse");
              }}
              className="bg-customGreen text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FaPlus className="mr-2" /> Add Course
            </button>
          </div>
        </header>

        {/* Integrate MyTable Component */}
        <MyTable
          columns={columns}
          data={formattedData}
          entryText="Total no. of courses: "
        />

        {isModalOpen && renderModal()}
      </div>
    </div>
  );
}
