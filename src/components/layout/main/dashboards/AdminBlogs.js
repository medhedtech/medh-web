"use client";
import { apiUrls } from "@/apis";
import React, { useEffect, useState } from "react";
import MyTable from "@/components/shared/common-table/page";
import useGetQuery from "@/hooks/getQuery.hook";
import Preloader from "@/components/shared/others/Preloader";

export default function AdminBlogs() {
  const [courses, setCourses] = useState([]);
  const { getQuery, loading } = useGetQuery();

  useEffect(() => {
    const fetchCourses = async () => {
      await getQuery({
        url: apiUrls?.Contacts?.getAllContacts,
        onSuccess: (response) => {
          console.log("Contacts fetched successfully:", response);

          if (response?.success && Array.isArray(response.data)) {
            setCourses(response.data);
          } else {
            console.error("Fetched data is not valid. Setting courses to empty array.");
            setCourses([]);
          }
        },
        onFail: (err) => {
          console.error("Failed to fetch contacts:", err);
          setCourses([]);
        },
      });
    };

    fetchCourses();
  }, []);

  const columns = [
    { Header: "Name", accessor: "full_name" },
    { Header: "Email", accessor: "email" },
    { Header: "Country", accessor: "country" },
    { Header: "Phone", accessor: "phone_number" },
    { Header: "Message", accessor: "message" },
  ];

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="bg-gray-100 font-Poppins min-h-screen pt-8 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Get In Touch</h1>
        </header>
        <MyTable
          columns={columns}
          data={courses}
          entryText="Total no. of courses: "
        />
      </div>
    </div>
  );
}