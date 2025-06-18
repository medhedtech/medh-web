"use client";
import { apiUrls } from "@/apis";
import React, { useEffect, useState } from "react";
import MyTable from "@/components/shared/common-table/page";
import useGetQuery from "@/hooks/getQuery.hook";
import Preloader from "@/components/shared/others/Preloader";
import useDeleteQuery from "@/hooks/deleteQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import { FaTimes } from "react-icons/fa";

// Function to format the date
const formatDate = (date) => {
  if (!date) return "";
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  const formattedDate = new Date(date).toLocaleDateString("en-GB", options);
  const [day, month, year] = formattedDate.split("/");
  return `${day}-${month}-${year}`;
};

const CoorporateFeedbackAndSupport = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [editComplaint, setEditComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const { getQuery, loading } = useGetQuery();
  const { deleteQuery } = useDeleteQuery();
  const { postQuery } = usePostQuery();
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Fetch data from API
  const fetchData = async (url, setState) => {
    await getQuery({
      url,
      onSuccess: (response) => {
        if (Array.isArray(response)) {
          setState(response);
        } else {
          showToast.error("Failed to fetch data.");
        }
      },
      onFail: () => showToast.error("Failed to fetch data."),
    });
  };

  useEffect(() => {
    fetchData(apiUrls.feedbacks.getAllCoorporateEmployeesFeedbacks, setFeedbacks);
    fetchData(apiUrls.feedbacks.getAllEmployeeComplaints, setComplaints);
  }, []);

  // Handle delete action
  const handleDelete = async (url, id, fetchUrl, setState) => {
    await deleteQuery({
      url: `${url}/${id}`,
      onSuccess: (res) => {
        showToast.success(res?.message || "Deleted successfully.");
        fetchData(fetchUrl, setState);
      },
      onFail: (err) => {
        console.error("Delete failed", err);
        showToast.error("Failed to delete.");
      },
    });
  };

  // Handle edit action (open edit modal)
  const handleEdit = (complaint) => {
    setEditComplaint(complaint);
    setNewStatus(complaint?.status || "");
  };

  // Handle form submission for status update
  const handleUpdateStatus = async () => {
    if (!newStatus) {
      showToast.error("Please select a valid status.");
      return;
    }

    try {
      await postQuery({
        url: `${apiUrls.feedbacks.updateComplaintStatus}/${editComplaint}`,
        postData: { status: newStatus },
        onSuccess: () => {
          showToast.success("Complaint status updated successfully.");
          fetchData(apiUrls.feedbacks.getAllEmployeeComplaints, setComplaints);
          setEditComplaint(null);
        },
        onFail: () => {
          showToast.error("Failed to update complaint status.");
        },
      });
    } catch (error) {
      console.error("Error updating status:", error);
      showToast.error("Unexpected error occurred.");
    }
  };

  // Columns configuration for feedbacks
  const feedbackColumns = [
    { Header: "Title", accessor: "feedback_title" },
    // { Header: "Feedback", accessor: "feedback_text" },
    {
      Header: "Feedback",
      accessor: "feedback_text",
      render: (row) => {
        const feedback_text = row?.feedback_text || "";
        const messagePreview =
          feedback_text.split(" ").slice(0, 6).join(" ") +
          (feedback_text.split(" ").length > 6 ? "..." : "");

        return (
          <div className="flex items-center">
            <span className="mr-2">{messagePreview}</span>
            {feedback_text.split(" ").length > 6 && (
              <button
                onClick={() => setSelectedMessage(feedback_text)}
                className="ml-2 text-green-500 rounded-md px-4 py-2 hover:text-green-700 transition-all duration-200 text-sm flex items-center space-x-0"
              >
                <span className="ml-[-1.5rem]">Read More...</span>
              </button>
            )}
          </div>
        );
      },
    },
    { Header: "Type", accessor: "feedback_for" },
    {
      Header: "Date",
      accessor: "createdAt",
      render: (row) => formatDate(row?.createdAt),
    },
    {
      Header: "Action",
      accessor: "actions",
      render: (row) => (
        <button
          onClick={() =>
            handleDelete(
              `${apiUrls.feedbacks?.deleteCoorporateFeedback}`,
              row._id,
              apiUrls.feedbacks?.getAllCoorporateEmployeesFeedbacks,
              setFeedbacks
            )
          }
          className="text-[#7ECA9D] border border-[#7ECA9D] rounded-md px-[10px] py-1"
        >
          Delete
        </button>
      ),
    },
  ];

  // Columns configuration for complaints
  const complaintColumns = [
    { Header: "Title", accessor: "name" },
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
      accessor: "dateFiled",
      render: (row) => formatDate(row?.dateFiled),
    },
    // { Header: "Status", accessor: "status" },
    {
      Header: "Status",
      accessor: "status",
      render: (row) => {
        const status = row.status;
        const statusFormatted =
          status.charAt(0).toUpperCase() + status.slice(1);

        // Define styles based on status
        const getStatusStyles = (status) => {
          switch (status.toLowerCase()) {
            case "resolved":
              return { bgColor: "bg-green-500", textColor: "text-white" };
            case "in-progress":
              return { bgColor: "bg-yellow", textColor: "text-white" };
            case "open":
              return { bgColor: "bg-gray-500", textColor: "text-white" };
            default:
              return { bgColor: "bg-gray-300", textColor: "text-black" };
          }
        };

        const { bgColor, textColor } = getStatusStyles(status);

        return (
          <span
            className={`px-2 py-1 rounded-md font-semibold ${bgColor} ${textColor}`}
          >
            {statusFormatted}
          </span>
        );
      },
    },
    {
      Header: "Action",
      accessor: "actions",
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => handleEdit(row._id)}
            className="text-[#FFA500] border border-[#FFA500] rounded-md px-[10px] py-1"
          >
            Edit
          </button>
          <button
            onClick={() =>
              handleDelete(
                `${apiUrls.feedbacks.deleteComplaint}`,
                row._id,
                apiUrls.feedbacks.getAllComplaints,
                setComplaints
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

  // Render edit modal
  const renderEditModal = () => {
    if (!editComplaint) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className=" text-[20px] font-lighter mb-4">
            Update Complaint Status
          </h2>
          <div className="mb-4">
            <label className="block mb-2  font-lighter">New Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In-Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleUpdateStatus}
              className="bg-[#FFA500] text-white px-4 py-2 rounded-md"
            >
              Update
            </button>
            <button
              onClick={() => setEditComplaint(null)}
              className="bg-gray-400 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <Preloader />;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Feedback Section */}
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Student/Employee Feedbacks</h1>
        <MyTable
          columns={feedbackColumns}
          data={feedbacks}
          entryText="Feedbacks"
        />
      </div>

      {/* Complaints Section */}
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
        <h1 className="text-2xl font-bold mb-4">Student/Employee Complaints</h1>
        <MyTable
          columns={complaintColumns}
          data={complaints}
          entryText="Complaints"
        />
      </div>
      {/* Edit Modal */}
      {renderEditModal()}
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

export default CoorporateFeedbackAndSupport;
