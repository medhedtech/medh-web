"use client";
import { apiUrls } from "@/apis";
import React, { useEffect, useState } from "react";
import MyTable from "@/components/shared/common-table/page";
import useGetQuery from "@/hooks/getQuery.hook";
import Preloader from "@/components/shared/others/Preloader";
import useDeleteQuery from "@/hooks/deleteQuery.hook";
import { toast } from "react-toastify";
import { FaEye } from "react-icons/fa";

const formatDate = (date) => {
  if (!date) return "";
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  const formattedDate = new Date(date).toLocaleDateString("en-GB", options);
  const [day, month, year] = formattedDate.split("/");
  return `${day}-${month}-${year}`;
};

export default function GetInTouch() {
  const [courses, setCourses] = useState([]);
  const [corporates, setCorporates] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const { getQuery, loading } = useGetQuery();
  const { deleteQuery } = useDeleteQuery();

  const pageTitleOptions = [
    { value: "", label: "All Pages" },
    { value: "home_page", label: "Home Page" },
    { value: "join_as_school", label: "Join as School" },
    { value: "hire_from_medh", label: "Hire From Medh" },
    { value: "join_as_educator", label: "Educator" },
    { value: "join_as_school", label: "School" },
    { value: "contact_us", label: "Contact" },
  ];

  // Fetch courses from API
  const fetchContacts = async () => {
    await getQuery({
      url: apiUrls?.Contacts?.getAllContacts,
      onSuccess: (response) => {
        if (response?.success && Array.isArray(response.data)) {
          setCourses(response.data);
          setFilteredCourses(response.data); // Initially show all courses
        } else {
          setCourses([]);
          setFilteredCourses([]);
        }
      },
      onFail: () => {
        setCourses([]);
        setFilteredCourses([]);
      },
    });
  };

  // Fetch corporates from API
  const fetchCorporatesData = async () => {
    await getQuery({
      url: apiUrls?.Corporate?.getAllCorporate,
      onSuccess: (response) => {
        if (response?.success && Array.isArray(response.data)) {
          setCorporates(response.data);
        } else {
          setCorporates([]);
        }
      },
      onFail: () => {
        setCorporates([]);
      },
    });
  };

  useEffect(() => {
    fetchContacts();
    fetchCorporatesData();
  }, []);

  // Handle filter change
  const handleFilterChange = (value) => {
    setSelectedFilter(value);
    if (value === "") {
      setFilteredCourses(courses); // Show all courses
    } else {
      const filteredData = courses.filter(
        (course) => course.page_title === value
      );
      setFilteredCourses(filteredData);
    }
  };

  const deleteGetInTouch = (id) => {
    deleteQuery({
      url: `${apiUrls?.Contacts?.deleteContact}/${id}`,
      onSuccess: (res) => {
        toast.success(res?.message);
        fetchContacts();
      },
      onFail: (res) => {
        console.log(res, "FAILED");
      },
    });
  };

  const deleteCorporate = (id) => {
    deleteQuery({
      url: `${apiUrls?.Corporate?.deleteCorporate}/${id}`,
      onSuccess: (res) => {
        toast.success(res?.message);
        fetchCorporatesData();
      },
      onFail: (res) => {
        console.log(res, "FAILED");
      },
    });
  };

  const columns = [
    { Header: "Name", accessor: "full_name" },
    { Header: "Email", accessor: "email" },
    { Header: "Country", accessor: "country" },
    { Header: "Phone", accessor: "phone_number" },
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
          {row?.resume_image ? (
            <button
              onClick={() => window.open(row?.resume_image, "_blank")}
              className="text-[#7ECA9D] px-2 py-1 hover:bg-blue-500 rounded-md transition-all duration-200"
            >
              <FaEye className="h-4 w-4 text-inherit" />
            </button>
          ) : (
            <span className="h-4 w-4 mr-2 ml-2 text-inherit">--</span>
          )}

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

  const columns2 = [
    { Header: "Name", accessor: "full_name" },
    { Header: "Email", accessor: "email" },
    { Header: "Country", accessor: "country" },
    { Header: "Phone", accessor: "phone_number" },
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
              deleteCorporate(row?._id);
            }}
            className="text-[#7ECA9D] border border-[#7ECA9D] rounded-md px-[10px] py-1"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className=" dark:bg-inherit dark:text-white font-Poppins min-h-screen pt-8">
      <div className="max-w-6xl dark:bg-inherit dark:text-white mx-auto bg-white">
        {/* Table 1 with filter */}
        <header className="flex items-center pt-4 px-8 justify-between mb-4">
          <h1 className="text-xl font-semibold">Get In Touch</h1>
          {/* Dropdown Filter */}
          <select
            value={selectedFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="border border-gray-300 bg-white text-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {pageTitleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </header>
        <MyTable
          columns={columns}
          data={filteredCourses}
          entryText="Total no. of contacts: "
        />

        {/* Table 2 without filter */}
        <header className="flex items-center pt-4 px-8 justify-between mb-4">
          <h1 className="text-xl font-semibold">Corporates List</h1>
        </header>
        <MyTable
          columns={columns2}
          data={corporates}
          entryText="Total no. of corporates: "
        />
      </div>
    </div>
  );
}
