"use client";
import { apiUrls } from "@/apis";
import React, { useEffect, useState } from "react";
import MyTable from "@/components/shared/common-table/page";
import useGetQuery from "@/hooks/getQuery.hook";
import Preloader from "@/components/shared/others/Preloader";
import useDeleteQuery from "@/hooks/deleteQuery.hook";
import { toast } from "react-toastify";

const formatDate = (date) => {
  if (!date) return "";
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  const formattedDate = new Date(date).toLocaleDateString("en-GB", options);
  const [day, month, year] = formattedDate.split("/");
  return `${day}-${month}-${year}`;
};

export default function EnrollmentFormsAdmin() {
  const [enrollments, setEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const { getQuery, loading } = useGetQuery();
  const { deleteQuery } = useDeleteQuery();

  // Fetch enrollments from API
  const fetchEnrollments = async () => {
    await getQuery({
      url: apiUrls?.enrollWebsiteform?.getAllEnrollWebsiteForms,
      onSuccess: (response) => {
        if (response?.success && Array.isArray(response.data)) {
          setEnrollments(response.data);
          setFilteredEnrollments(response.data);
        } else {
          console.log(
            "Fetched data is not valid. Setting enrollments to empty array."
          );
          setEnrollments([]);
          setFilteredEnrollments([]);
        }
      },
      onFail: () => {
        console.log("Failed to fetch enrollments:");
        setEnrollments([]);
        setFilteredEnrollments([]);
      },
    });
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  // Delete the enrollment form
  const deleteGetInTouch = (id) => {
    deleteQuery({
      url: `${apiUrls?.enrollWebsiteform?.deleteEnrollWebsiteForm}/${id}`,
      onSuccess: (res) => {
        toast.success(res?.message);
        fetchEnrollments();
      },
      onFail: (res) => {
        console.log(res, "FAILED");
      },
    });
  };

  // Handle filter change
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);

    // Filter enrollments based on selected category
    if (category) {
      const filtered = enrollments.filter(
        (item) => item.course_category === category
      );
      setFilteredEnrollments(filtered);
    } else {
      setFilteredEnrollments(enrollments);
    }
  };

  const columns = [
    { Header: "Name", accessor: "full_name" },
    { Header: "Email", accessor: "email" },
    { Header: "Country", accessor: "country" },
    { Header: "Phone", accessor: "phone_number" },
    { Header: "Course Name", accessor: "course_category" },
    { Header: "Message", accessor: "message" },
    {
      Header: "Date",
      accessor: "createdAt",
      width: 150,
      render: (row) => formatDate(row?.createdAt),
    },
    {
      Header: "Action",
      accessor: "actions",
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => {
              deleteGetInTouch(row?._id);
            }}
            className="text-[#7ECA9D] border border-[#7ECA9D] rounded-md px-[10px] py-1"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const categories = [
    "AI & Data Science",
    "Personality Development",
    "Vedic Mathematics",
    "Digital Marketing & Data Analytics",
  ];

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="bg-gray-100 dark:bg-inherit dark:text-white font-Poppins min-h-screen">
      <div className="max-w-6xl dark:bg-inherit dark:text-white mx-auto bg-white rounded-lg shadow-lg">
        <header className="flex pt-4 px-6 items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Enquiry List</h1>

          {/* Filter Dropdown */}
          <div className="flex items-center">
            <label className="mr-2">Filter by Course:</label>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="border border-gray-300 rounded-md px-3 py-1"
            >
              <option value="">All</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </header>

        <MyTable
          columns={columns}
          data={filteredEnrollments}
          entryText="Total no. of enrollments: "
        />
      </div>
    </div>
  );
}
