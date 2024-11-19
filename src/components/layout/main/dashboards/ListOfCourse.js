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

export default function Home() {
  const router = useRouter();
  const { deleteQuery } = useDeleteQuery();
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

  // Fetch courses from API
  // useEffect(() => {
  //   const fetchCourses = async () => {
  //     await getQuery({
  //       url: apiUrls?.courses?.getAllCourses,
  //       onSuccess: (data) => {
  //         console.log("Courses fetched successfully:", data);
  //         setCourses(data || []);
  //       },
  //       onFail: (err) => {
  //         console.error("Failed to fetch courses:", err);
  //       },
  //     });
  //   };

  //   fetchCourses();
  // }, [deletedCourse]);

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
  }, [deletedCourse]);

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

  const columns = [
    { Header: "No.", accessor: "no" },
    { Header: "Category", accessor: "course_category" },
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
      render: (row) => (
        <div className="flex gap-2 items-center">
          <div
            className={`rounded-md font-normal px-[10px] py-1 ${
              row.status === "Published"
                ? "bg-[#D9F2D9] text-[#3AA438]"
                : "bg-[#FFF0D9] text-[#FFA927]"
            }`}
          >
            {row.status}
          </div>
        </div>
      ),
    },
    {
      Header: "Action",
      accessor: "actions",
      render: (row) => (
        <div className="flex gap-2 items-center">
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

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="bg-gray-100 dark:bg-darkblack font-Poppins min-h-screen pt-8 p-6">
      <div className="max-w-6xl mx-auto dark:bg-inherit dark:text-whitegrey3 dark:border bg-white rounded-lg shadow-lg p-6">
        <header className="flex items-center justify-between mb-4">
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
      </div>
    </div>
  );
}
