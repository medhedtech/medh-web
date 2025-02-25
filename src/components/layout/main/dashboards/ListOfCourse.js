"use client";

import { apiUrls } from "@/apis";
import React, { useEffect, useState } from "react";
import MyTable from "@/components/shared/common-table/page";
import useGetQuery from "@/hooks/getQuery.hook";
import Preloader from "@/components/shared/others/Preloader";
import { useRouter } from "next/navigation";
import { FaPlus, FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import useDeleteQuery from "@/hooks/deleteQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import { toast } from "react-toastify";

export default function Home() {
  const router = useRouter();
  const { deleteQuery } = useDeleteQuery();
  const { postQuery, loading: postLoading } = usePostQuery();
  const { getQuery, loading } = useGetQuery();

  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [instructorNames, setInstructorNames] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [updateStatus, setUpdateStatus] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      await getQuery({
        url: apiUrls?.courses?.getAllCourses,
        onSuccess: async (data) => {
          const coursesData = Array.isArray(data) ? data : data?.data || [];
          setCourses(coursesData);
          await fetchInstructors(coursesData);
        },
        onFail: (err) => console.error("Failed to fetch courses:", err),
      });
    };

    const fetchInstructors = async (courses) => {
      const instructorsMap = {};
      await Promise.all(
        courses.map(async (course) => {
          if (course.assigned_instructor) {
            await getQuery({
              url: `${apiUrls?.assignedInstructors?.getAssignedInstructorById}/${course.assigned_instructor}`,
              onSuccess: (data) => {
                instructorsMap[course.assigned_instructor] = data?.assignment?.full_name || "Instructor not available";
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
  }, [updateStatus]);

  const handleDelete = (id) => {
    deleteQuery({
      url: `${apiUrls?.courses?.deleteCourse}/${id}`,
      onSuccess: () => {
        toast.success("Course deleted successfully");
        setUpdateStatus(Date.now());
      },
      onFail: () => toast.error("Failed to delete course"),
    });
  };

  const handleMultipleDelete = () => {
    if (selectedCourses.length === 0) return;
    const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedCourses.length} selected courses?`);
    if (!confirmDelete) return;
    selectedCourses.forEach((id) => handleDelete(id));
    setSelectedCourses([]);
  };

  const editCourse = (id) => {
    router.push(`admin-updateCourse/${id}`);
  };

  const columns = [
    {
      Header: (
        <input
          type="checkbox"
          checked={selectedCourses.length === courses.length && courses.length > 0}
          onChange={(e) => {
            setSelectedCourses(e.target.checked ? courses.map((c) => c._id) : []);
          }}
        />
      ),
      accessor: "selection",
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedCourses.includes(row._id)}
          onChange={(e) => {
            setSelectedCourses((prev) =>
              e.target.checked ? [...prev, row._id] : prev.filter((id) => id !== row._id)
            );
          }}
        />
      ),
    },
    { Header: "No.", accessor: "no" },
    { Header: "Category", accessor: "category" },
    { Header: "Course Name", accessor: "course_title" },
    { Header: "Instructor", accessor: "instructor" },
    { Header: "Status", accessor: "status" },
    { Header: "Price", accessor: "course_fee", render: (row) => `$${row.course_fee}` },
    {
      Header: "Actions",
      accessor: "actions",
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button onClick={() => editCourse(row?._id)} className="text-green-600 hover:text-green-800 p-2">
            <MdEdit size={24} />
          </button>
          <button onClick={() => handleDelete(row?._id)} className="text-red-600 hover:text-red-800 p-2">
            <FaTrash size={18} />
          </button>
        </div>
      ),
    },
  ];

  const filteredData = courses
    .filter((course) => course.course_title.toLowerCase().includes(searchQuery.toLowerCase()))
    .map((course, index) => ({
      ...course,
      no: index + 1,
      instructor: instructorNames[course.assigned_instructor] || "-",
    }));

  if (loading || postLoading) return <Preloader />;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-lg p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Course List</h1>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search courses..."
              className="border px-4 py-2 rounded-lg"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleMultipleDelete} className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center">
              <FaTrash className="mr-2" /> Delete Selected
            </button>
            <button
              onClick={() => router.push("/dashboards/admin-addcourse")}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FaPlus className="mr-2" /> Add Course
            </button>
          </div>
        </header>
        <MyTable columns={columns} data={filteredData} entryText="Total courses: " />
      </div>
    </div>
  );
}
