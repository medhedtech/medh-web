"use client";
import React, { useState, useEffect } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import MyTable from "@/components/shared/common-table/page";
import AddBlog from "./AddBlogs";
import useDeleteQuery from "@/hooks/deleteQuery.hook";
import { toast } from "react-toastify";
import Preloader from "@/components/shared/others/Preloader";

const formatDate = (date) => {
  if (!date) return "";
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  const formattedDate = new Date(date).toLocaleDateString("en-GB", options);
  const [day, month, year] = formattedDate.split("/");
  return `${day}-${month}-${year}`;
};

const AdminBlogs = () => {
  const [showAddBlogForm, setShowAddBlogForm] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { getQuery } = useGetQuery();
  const { deleteQuery, loading } = useDeleteQuery();
  const [deletedBlogs, setDeletedBlogs] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Fetch Blogs Data from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        await getQuery({
          url: apiUrls?.Blogs?.getAllBlogs,
          onSuccess: (response) => {
            if (response.success) {
              setBlogs(response.data);
            } else {
              console.error("Failed to fetch blogs: ", response.message);
              setBlogs([]);
            }
          },
          onFail: (err) => {
            console.error("API error:", err);
            setBlogs([]);
          },
        });
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
        setBlogs([]);
      }
    };
    fetchBlogs();
  }, [deletedBlogs]);

  const deleteGetInTouch = (id) => {
    deleteQuery({
      url: `${apiUrls?.Blogs?.deleteBlog}/${id}`,
      onSuccess: (res) => {
        toast.success(res?.message);
        setDeletedBlogs(id);
      },
      onFail: (res) => {
        console.log(res, "FAILED");
      },
    });
  };

  // Filter blogs by search term
  const filteredBlogs = blogs.filter((blog) => {
    return (
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const columns = [
    {
      Header: "Image",
      accessor: "upload_image",
      render: (row) => (
        <div>
          <img src={row?.upload_image} className="h-10 w-10 rounded-full" />
        </div>
      ),
    },
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
            onClick={() => {
              deleteGetInTouch(row?._id);
            }}
            className="text-white bg-red-600 border border-red-600 rounded-md px-[10px] py-1"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleAddBlogClick = () => {
    setShowAddBlogForm(true);
  };

  if (showAddBlogForm)
    return <AddBlog onCancel={() => setShowAddBlogForm(false)} />;

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className=" bg-white dark:bg-darkblack font-Poppins min-h-screen">
      <div className="max-w-6xl mx-auto dark:bg-inherit dark:text-whitegrey3 dark:border bg-white ">
        <header className="flex px-6 items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Blogs List</h1>
          <div className="flex items-center space-x-2">
            <button
              className="bg-customGreen text-white px-4 py-2 rounded-lg flex items-center"
              onClick={handleAddBlogClick}
            >
              <FaPlus className="mr-2" /> Add Blog
            </button>
          </div>
        </header>

        <MyTable
          columns={columns}
          data={filteredBlogs}
          entryText={`Total no. of entries: ${filteredBlogs.length}`}
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
};

export default AdminBlogs;
