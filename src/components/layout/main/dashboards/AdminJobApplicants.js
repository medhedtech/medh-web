"use client";
import { apiUrls } from "@/apis";
import React, { useEffect, useState } from "react";
import MyTable from "@/components/shared/common-table/page";
import useGetQuery from "@/hooks/getQuery.hook";
import Preloader from "@/components/shared/others/Preloader";
import useDeleteQuery from "@/hooks/deleteQuery.hook";
import { toast } from "react-toastify";
import { FaEye, FaPlus } from "react-icons/fa";
import AddJobPost from "./AddjobPost";

const formatDate = (date) => {
  if (!date) return "";
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  const formattedDate = new Date(date).toLocaleDateString("en-GB", options);
  const [day, month, year] = formattedDate.split("/");
  return `${day}-${month}-${year}`;
};

export default function AdminJobApplicants() {
  const [enrollments, setEnrollments] = useState([]);
  const [newPosts, setNewPosts] = useState([]);
  const { getQuery, loading } = useGetQuery();
  const { deleteQuery } = useDeleteQuery();
  const [showAddPostForm, setShowAddPostForm] = useState(false);

  // Fetch data from API (generic fetch function)
  const fetchData = async (url, setState) => {
    await getQuery({
      url,
      onSuccess: (response) => {
        if (response?.success && Array.isArray(response.data)) {
          setState(response.data);
        } else {
          toast.error("Failed to fetch data.");
          setState([]);
        }
      },
      onFail: () => {
        toast.error("Failed to fetch data.");
        setState([]);
      },
    });
  };

  // Fetch job applicants and posted jobs
  useEffect(() => {
    fetchData(apiUrls?.jobForm?.getAllJobPosts, setEnrollments);
    fetchData(apiUrls?.jobForm?.getAllNewJobs, setNewPosts);
  }, []);

  const handleDelete = async (url, id, fetchUrl, setState) => {
    await deleteQuery({
      url: `${url}/${id}`,
      onSuccess: (res) => {
        toast.success(res?.message || "Deleted successfully.");
        fetchData(fetchUrl, setState);
      },
      onFail: (err) => {
        console.error("Delete failed", err);
        toast.error("Failed to delete.");
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
          <button
            onClick={() => window.open(row?.resume_image, "_blank")}
            className="text-[#7ECA9D] px-2 py-1 hover:bg-blue-500 rounded-md transition-all duration-200"
          >
            <FaEye className="h-4 w-4 text-inherit" />
          </button>
          <button
            onClick={() =>
              handleDelete(
                apiUrls?.jobForm?.deleteJobPost,
                row?._id,
                apiUrls?.jobForm?.getAllJobPosts,
                setEnrollments
              )
            }
            className="text-[#7ECA9D] border border-[#7ECA9D] rounded-md px-[10px] py-1"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const columns2 = [
    { Header: "Title", accessor: "title" },
    { Header: "Description", accessor: "description" },
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
            onClick={() =>
              handleDelete(
                apiUrls?.jobForm?.deleteNewJobPost,
                row?._id,
                apiUrls?.jobForm?.getAllNewJobs,
                setNewPosts
              )
            }
            className="text-[#7ECA9D] border border-[#7ECA9D] rounded-md px-[10px] py-1"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (showAddPostForm)
    return <AddJobPost onCancel={() => setShowAddPostForm(false)} />;

  if (loading) return <Preloader />;

  const handleAddPostClick = () => {
    setShowAddPostForm(true);
  };

  return (
    <div className="bg-gray-100 dark:bg-inherit dark:text-white font-Poppins min-h-screen pt-8 p-6">
      {/* Job Posts Section */}
      <div className="max-w-6xl dark:bg-inherit dark:text-white mx-auto bg-white rounded-lg shadow-lg p-6">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Job Posts</h1>
          <div className="flex items-center space-x-2">
            <button
              className="bg-customGreen text-white px-4 py-2 rounded-lg flex items-center"
              onClick={handleAddPostClick}
            >
              <FaPlus className="mr-2" /> Add Job Post
            </button>
          </div>
        </header>
        <MyTable
          columns={columns2}
          data={newPosts}
          entryText="Total no. of job posts: "
        />
      </div>

      {/* Applicants List Section */}
      <div className="max-w-6xl mt-20 dark:bg-inherit dark:text-white mx-auto bg-white rounded-lg shadow-lg p-6">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Applicants List</h1>
        </header>
        <MyTable
          columns={columns}
          data={enrollments}
          entryText="Total no. of applicants: "
        />
      </div>
    </div>
  );
}
