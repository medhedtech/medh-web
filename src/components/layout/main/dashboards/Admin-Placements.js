"use client";
import { apiUrls } from "@/apis";
import React, { useEffect, useState } from "react";
import MyTable from "@/components/shared/common-table/page";
import useGetQuery from "@/hooks/getQuery.hook";
import Preloader from "@/components/shared/others/Preloader";
import { FaTimes } from "react-icons/fa";

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
  const [selectedMessage, setSelectedMessage] = useState(null);

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
