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
import { toast } from "react-toastify";
import { Loader } from "lucide-react";

const CertificatePage = () => {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completionDate, setCompletionDate] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      await getQuery({
        url: apiUrls?.certificate?.getAllCertificate,
        onSuccess: (data) => {
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
          setUsers([]);
          console.error("Failed to fetch enrolled courses:", error);
          showToast.error("Failed to fetch certificates");
        },
      });
    } catch (error) {
      console.error("Error fetching certificates:", error);
      showToast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCertificate?.date) {
      const parsedDate = new Date(selectedCertificate.date);
      setCompletionDate(isNaN(parsedDate.getTime()) ? null : parsedDate);
    } else {
      setCompletionDate(null);
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
            showToast.success("Certificate created successfully");
            closeModal();
            fetchCertificates(); // Refresh the list
          },
          onFail: (error) => {
            showToast.error("Failed to create certificate");
            console.error("Failed to create certificate:", error);
          },
        });
      } catch (error) {
        showToast.error("Error generating certificate");
        console.error("Error generating certificate:", error);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCertificate(null);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    setIsSortDropdownOpen(false);
  };

  // Filter and sort users
  const filteredAndSortedUsers = users
    .filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.course.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.date) - new Date(a.date);
      } else {
        return new Date(a.date) - new Date(b.date);
      }
    });

  return (
    <div className="bg-gray-50 dark:bg-darkblack min-h-screen p-6 space-y-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-inherit dark:text-whitegrey3 dark:border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Certificate Management</h1>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search Bar */}
                <div className="relative flex-grow max-w-md">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or course..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                    className="flex items-center px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <FaSort className="mr-2" />
                    {sortOrder === "newest" ? "Newest First" : "Oldest First"}
                  </button>
                  {isSortDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-20">
                      <button
                        onClick={() => handleSortChange("newest")}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                      >
                        Newest First
                      </button>
                      <button
                        onClick={() => handleSortChange("oldest")}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                      >
                        Oldest First
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Certificate List */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader className="animate-spin h-8 w-8 text-blue-600" />
              </div>
            ) : filteredAndSortedUsers.length > 0 ? (
              <div className="space-y-4">
                {filteredAndSortedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={user.profileImage}
                          alt={`${user.name} profile`}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {user.name}
                        </h3>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-medium text-blue-600 dark:text-blue-400">
                            {user.course}
                          </span>
                          <span className="mx-2">•</span>
                          <span>Completed on {user.date}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleGenerateCertificate(user)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Generate Certificate
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <FiUsers className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Certificates Found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  No students have completed their courses yet. Certificates will appear here once students complete their courses.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Certificate Generation Modal */}
      {isModalOpen && selectedCertificate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md m-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Generate Certificate
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  value={selectedCertificate.course}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  value={selectedCertificate.name}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Completion Date
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                  <DatePicker
                    selected={completionDate}
                    onChange={(date) => setCompletionDate(date)}
                    dateFormat="MM/dd/yyyy"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleCreateCertificate}
                className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                Generate Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatePage;
