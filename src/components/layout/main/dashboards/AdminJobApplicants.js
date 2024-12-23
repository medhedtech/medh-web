"use client";
import { apiUrls } from "@/apis";
import React, { useEffect, useState } from "react";
import MyTable from "@/components/shared/common-table/page";
import useGetQuery from "@/hooks/getQuery.hook";
import Preloader from "@/components/shared/others/Preloader";
import useDeleteQuery from "@/hooks/deleteQuery.hook";
import { toast } from "react-toastify";
import { FaEye, FaPlus, FaTimes } from "react-icons/fa";
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
  const [selectedMessage, setSelectedMessage] = useState(null);

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
    { Header: "Post Applied", accessor: "designation" },
    // { Header: "Message", accessor: "message" },
    {
      Header: "Message",
      accessor: "message",
      render: (row) => {
        const message = row?.message || "";
        const messagePreview =
          message.split(" ").slice(0, 6).join(" ") +
          (message.split(" ").length > 6 ? "..." : "");

        return (
          <div className="flex items-center">
            <span className="mr-2">{messagePreview}</span>
            {message.split(" ").length > 6 && (
              <button
                onClick={() => setSelectedMessage(message)}
                className="ml-2 text-green-500 rounded-md px-4 py-2 hover:text-green-700 transition-all duration-200 text-sm flex items-center space-x-0"
              >
                <span className="ml-[-1.5rem]">Read More...</span>
              </button>
            )}
          </div>
        );
      },
    },
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
    // { Header: "Description", accessor: "description" },
    {
      Header: "Description",
      accessor: "description",
      render: (row) => {
        const description = row?.description || "";
        const messagePreview =
          description.split(" ").slice(0, 6).join(" ") +
          (description.split(" ").length > 6 ? "..." : "");

        return (
          <div className="flex items-center">
            <span className="mr-2">{messagePreview}</span>
            {description.split(" ").length > 6 && (
              <button
                onClick={() => setSelectedMessage(description)}
                className="ml-2 text-green-500 rounded-md px-4 py-2 hover:text-green-700 transition-all duration-200 text-sm flex items-center space-x-0"
              >
                <span className="ml-[-1.5rem]">Read More...</span>
              </button>
            )}
          </div>
        );
      },
    },
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
    <div className="bg-gray-100 dark:bg-inherit dark:text-white font-Poppins min-h-screen">
      {/* Job Posts Section */}
      <div className="max-w-6xl dark:bg-inherit dark:text-white mx-auto bg-white rounded-lg shadow-lg">
        <header className="flex px-6 items-center justify-between mb-4">
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
      <div className="max-w-6xl mt-20 dark:bg-inherit dark:text-white mx-auto bg-white rounded-lg shadow-lg">
        <header className="flex px-6 items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Applicants List</h1>
        </header>
        <MyTable
          columns={columns}
          data={enrollments}
          entryText="Total no. of applicants: "
        />
      </div>
      {/* Modal for full message */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-md p-6 max-w-[50%] w-full relative  max-h-[500px] overflow-y-auto">
            {/* Close Button at top-right corner */}
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>

            <h2 className="text-xl font-semibold mb-4">Full Message</h2>
            <p className="mb-4">{selectedMessage}</p>
            <button
              onClick={() => setSelectedMessage(null)}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
