"use client";
import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import MyTable from "@/components/shared/common-table/page";
import AddBlog from "./AddBlogs";
import Image from "next/image";
import Edit from "@/assets/bxs_edit.svg";
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
  }, []);

  const deleteGetInTouch = (id) => {
    deleteQuery({
      url: `${apiUrls?.Blogs?.deleteBlog}/${id}`,
      onSuccess: (res) => {
        toast.success(res?.message);
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
          {/* <button
            className="text-primary px-[15px] py-1 flex justify-center items-center"
            onClick={() => {
              getBlogDetailsById(row?._id);
            }}
          >
            <Image
              src={Edit}
              width={25}
              height={20}
              alt="Edit Icon"
              className="pr-1 text-primary"
            />
          </button> */}
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

  const handleAddBlogClick = () => setShowAddBlogForm(true);
  const handleCancelAddBlog = () => setShowAddBlogForm(false);

  // Add Blog Form Toggle
  if (showAddBlogForm) return <AddBlog onCancel={handleCancelAddBlog} />;

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="flex items-start dark:bg-inherit dark:text-white justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-6xl  dark:bg-inherit dark:text-white  bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold">Blogs List</h1>
          <input
            type="text"
            placeholder="Search here"
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={handleAddBlogClick}
          >
            <FaPlus className="mr-2" /> Add Blog
          </button>
        </div>

        {/* Table Component with Filters */}
        {filteredBlogs.length > 0 ? (
          <MyTable
            columns={columns}
            data={filteredBlogs}
            entryText={`Total no. of entries: ${filteredBlogs.length}`}
          />
        ) : (
          <div className="text-center text-gray-500 py-4">
            No blogs available.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBlogs;
