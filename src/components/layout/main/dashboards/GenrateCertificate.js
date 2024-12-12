"use client";
import React, { useEffect, useState } from "react";
import img1 from "@/assets/images/certificate/img1.png";
import { FaFilter, FaSort, FaSearch, FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import { FiUsers } from "react-icons/fi";

const CertificatePage = () => {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completionDate, setCompletionDate] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();

  useEffect(() => {
    getQuery({
      url: apiUrls?.certificate?.getAllCertificate,
      onSuccess: (data) => {
        console.log(data, "Real Course Data");
        const formattedData = data.map((item) => ({
          id: item._id,
          student_id: item.student_id._id,
          name: item.student_id.full_name,
          course_id: item.course_id._id,
          course: item.course_id.course_title,
          date: new Date(item.completed_on).toLocaleDateString(),
          profileImage: img1,
        }));
        setUsers(formattedData);
      },
      onFail: (error) => {
        console.error("Failed to fetch enrolled courses:", error);
      },
    });
  }, []);

  useEffect(() => {
    if (selectedCertificate && selectedCertificate.date) {
      setCompletionDate(new Date(selectedCertificate.date));
    }
  }, [selectedCertificate]);

  const handleGenerateCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setIsModalOpen(true);
  };

  const handleCreateCertificate = async () => {
    if (selectedCertificate && completionDate) {
      const payload = {
        student_id: selectedCertificate.student_id,
        course_id: selectedCertificate.course_id,
        completion_date: completionDate,
        student_name: selectedCertificate.name,
        course_name: selectedCertificate.course,
      };

      try {
        await postQuery({
          url: apiUrls?.certificate?.addCertificate,
          postData: payload,
          onSuccess: (data) => {
            console.log("Certificate created successfully:", data);
            closeModal();
          },
          onFail: (error) => {
            console.error("Failed to create certificate:", error);
          },
        });
      } catch (error) {
        console.error("Error generating certificate:", error);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCertificate(null);
  };

  return (
    <div className="flex min-h-screen pt-9 dark:bg-inherit dark:text-white bg-gray-100 p-6">
      <div className="w-full max-w-6xl dark:bg-inherit dark:border bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Certificate</h2>
        </div>

        <h3 className="text-xl font-semibold mb-4">Issue Certificate</h3>

        <div className="flex items-center mb-6 space-x-4 ">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search..."
              className="w-full py-2 pl-10 pr-4 border dark:bg-inherit border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          </div>

          <button
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            className="px-6 py-2 border-gray-400 border text-gray-700 rounded-full hover:bg-gray-300 flex items-center"
          >
            <FaFilter className="mr-2" />
            Filter
          </button>

          <button
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className="px-6 py-2 border-gray-400 border text-gray-700 rounded-full hover:bg-gray-300 flex items-center"
          >
            <FaSort className="mr-2" />
            Sort
          </button>
        </div>

        <div className="space-y-9">
          {users.length > 0 ? (
            users.map((user) => (
              <div key={user.id} className="flex justify-between items-center">
                <div className="flex items-center">
                  <Image
                    src={user.profileImage}
                    alt={`${user.name} profile`}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      Completed{" "}
                      <span className="text-customGreen underline cursor-pointer">
                        {user.course}
                      </span>{" "}
                      on {user.date}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleGenerateCertificate(user)}
                  className="text-customGreen font-normal hover:underline"
                >
                  Generate Certificate
                </button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
              <FiUsers
                className="text-gray-400 dark:text-gray-500 mb-4"
                size={80}
              />
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                No Users Found
              </p>
              <p className="text-sm text-gray-500 pb-4 dark:text-gray-400 mt-2 text-center">
                It looks like there are no users to display right now. Once
                users complete a course, they&#39;ll show up here.
              </p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && selectedCertificate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-black dark:text-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 font-Poppins text-[#434343]">
              Generate Certificate
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700">Course Name</label>
                <input
                  type="text"
                  value={selectedCertificate.course}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700">Student Name</label>
                <input
                  type="text"
                  value={selectedCertificate.name}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-gray-700">Completion Date</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                  <DatePicker
                    selected={completionDate}
                    onChange={(date) => setCompletionDate(date)}
                    dateFormat="MM-dd-yyyy"
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleCreateCertificate}
                className="w-full py-2 bg-green-600 text-white font-semibold rounded-full"
              >
                Generate Certificate
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatePage;
