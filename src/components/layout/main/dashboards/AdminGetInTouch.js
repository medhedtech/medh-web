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

export default function GetInTouch() {
  const [courses, setCourses] = useState([]);
  const { getQuery, loading } = useGetQuery();
  const { deleteQuery } = useDeleteQuery();

  // Fetch courses from API
  useEffect(() => {
    const fetchContacts = async () => {
      await getQuery({
        url: apiUrls?.Contacts?.getAllContacts,
        onSuccess: (response) => {
          console.log("Contacts fetched successfully:", response);
          if (response?.success && Array.isArray(response.data)) {
            setCourses(response.data);
          } else {
            console.error(
              "Fetched data is not valid. Setting courses to empty array."
            );
            setCourses([]);
          }
        },
        onFail: (err) => {
          console.error("Failed to fetch contacts:", err);
          setCourses([]);
        },
      });
    };

    fetchContacts();
  }, []);

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

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="bg-gray-100 dark:bg-inherit dark:text-white font-Poppins min-h-screen pt-8 p-6">
      <div className="max-w-6xl dark:bg-inherit dark:text-white  mx-auto bg-white rounded-lg shadow-lg p-6">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Get In Touch</h1>
        </header>
        <MyTable
          columns={columns}
          data={courses} // Pass the courses data to the table
          entryText="Total no. of courses: "
        />
      </div>
    </div>
  );
}
