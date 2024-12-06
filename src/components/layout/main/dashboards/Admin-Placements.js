"use client";
import { apiUrls } from "@/apis";
import React, { useEffect, useState } from "react";
import MyTable from "@/components/shared/common-table/page";
import useGetQuery from "@/hooks/getQuery.hook";
import Preloader from "@/components/shared/others/Preloader";

const formatDate = (date) => {
  if (!date) return "";
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  const formattedDate = new Date(date).toLocaleDateString("en-GB", options);
  const [day, month, year] = formattedDate.split("/");
  return `${day}-${month}-${year}`;
};

export default function StudentPlacements() {
  const [placements, setPlacements] = useState([]);
  const { getQuery, loading } = useGetQuery();

  // Fetch placements from API
  const fetchEnrollments = async () => {
    await getQuery({
      url: apiUrls?.placements?.getPlacements,
      onSuccess: (response) => {
        if (response) {
          setPlacements(response);
          const userfullname = response?.studentId?.full_name;
        } else {
          console.log(
            "Fetched data is not valid. Setting placements to empty array."
          );
          setPlacements([]);
        }
      },
      onFail: () => {
        console.log("Failed to fetch placements data:");
        setPlacements([]);
      },
    });
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const columns = [
    { Header: "Name", accessor: "full_name" },
    { Header: "Email", accessor: "email" },
    { Header: "City", accessor: "city" },
    { Header: "Phone", accessor: "phone_number" },
    { Header: "Course Name", accessor: "completed_course" },
    { Header: "Year", accessor: "course_completed_year" },
    { Header: "Area Interested", accessor: "area_of_interest" },
    { Header: "Message", accessor: "message" },
    {
      Header: "Applied On",
      accessor: "createdAt",
      width: 150,
      render: (row) => formatDate(row?.createdAt),
    },
  ];

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="bg-gray-100 dark:bg-inherit dark:text-white font-Poppins min-h-screen">
      <div className="max-w-6xl dark:bg-inherit dark:text-white mx-auto bg-white rounded-lg shadow-lg">
        <header className="flex pt-4 px-6 items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Placement List</h1>
        </header>
        <MyTable
          columns={columns}
          data={placements}
          entryText="Total no. of placements: "
        />
      </div>
    </div>
  );
}
