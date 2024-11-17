"use client";
import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
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

  if (showAddBlogForm)
    return <AddBlog onCancel={() => setShowAddBlogForm(false)} />;

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="bg-gray-100 dark:bg-darkblack font-Poppins min-h-screen pt-8 p-6">
      <div className="max-w-6xl mx-auto dark:bg-inherit dark:text-whitegrey3 dark:border bg-white rounded-lg shadow-lg p-6">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Blogs List</h1>
          <div className="flex items-center space-x-2">
            <button
              className="bg-customGreen text-white px-4 py-2 rounded-lg flex items-center"
              onClick={() => setShowAddBlogForm(true)}
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
    </div>
  );
};

export default AdminBlogs;
