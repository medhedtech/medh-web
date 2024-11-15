"use client";
import React, { useState, useEffect } from "react";
import { FaPlus, FaChevronDown } from "react-icons/fa";
import { useRouter } from "next/navigation";
import AddStudentForm from "./AddStudentForm";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import MyTable from "@/components/shared/common-table/page";

// Function to format the date in [DD-MM-YYYY]
const formatDate = (date) => {
  if (!date) return "";

  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  const formattedDate = new Date(date).toLocaleDateString("en-GB", options);

  // Convert the formatted date to [DD-MM-YYYY]
  const [day, month, year] = formattedDate.split("/");
  return `${day}-${month}-${year}`;
};

const UsersTable = () => {
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [students, setStudents] = useState([]);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { getQuery } = useGetQuery();

  // Fetch Students Data from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        await getQuery({
          url: apiUrls?.Students?.getAllStudents,
          onSuccess: (data) => setStudents(data),
          onFail: (err) => console.error("API error:", err),
        });
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };
    fetchStudents();
  }, []);

  // Toggle Active/Inactive Status
  const toggleStatus = (userId) => {
    setStudents((prevStudents) =>
      prevStudents.map((user) =>
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      )
    );
  };

  // Toggle Button for Status
  const StatusToggle = ({ isActive, onClick }) => (
    <div className="flex items-center">
      <button
        onClick={onClick}
        className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
          isActive ? "bg-green-500" : "bg-gray-400"
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ${
            isActive ? "translate-x-5" : "translate-x-0"
          }`}
        ></div>
      </button>
      <span
        className={`ml-2 text-sm ${
          isActive ? "text-green-700" : "text-red-700"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    </div>
  );

  // Table Columns Configuration
  const columns = [
    {
      Header: "No.",
      Cell: ({ row }) => (
        <span className="text-gray-600">{row.index + 1}</span>
      ),
      width: 100,
    },
    { Header: "Name", accessor: "full_name" },
    { Header: "Age", accessor: "age" },
    { Header: "Email ID", accessor: "email" },
    {
      Header: "Join Date",
      accessor: "createdAt",
      Cell: ({ value }) => formatDate(value),
    },
    { Header: "Course", accessor: "course_name" },
    {
      Header: "Status",
      accessor: "isActive",
      Cell: ({ row }) => (
        <StatusToggle
          isActive={row.original.isActive}
          onClick={() => toggleStatus(row.original.id)}
        />
      ),
    },
  ];

  // Search Filter Function
  const filteredStudents = students.filter(
    (student) =>
      student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.age.toString().includes(searchTerm.toLowerCase())
  );

  const handleAddStudentClick = () => setShowAddStudentForm(true);
  const handleCancelAddStudent = () => setShowAddStudentForm(false);

  // Add Student Form Toggle
  if (showAddStudentForm)
    return <AddStudentForm onCancel={handleCancelAddStudent} />;

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-6xl bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold">Student List</h1>
          <input
            type="text"
            placeholder="Search here"
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={handleAddStudentClick}
          >
            <FaPlus className="mr-2" /> Add Student
          </button>
        </div>

        {/* Table Component with Filters */}
        <MyTable
          columns={columns}
          data={filteredStudents}
          showDate={true}
          entryText="Total no. of entries:"
        />
      </div>
    </div>
  );
};

export default UsersTable;


// "use client";
// import { useRouter } from "next/navigation";
// import React, { useState, useEffect } from "react";
// import { FaPlus } from "react-icons/fa";
// import AddStudentForm from "./AddStudentForm";
// import { apiUrls } from "@/apis";
// import useGetQuery from "@/hooks/getQuery.hook";
// import MyTable from "@/components/shared/common-table/page";

// const formatDate = (date) => {
//   if (!date) return "";
//   const options = { day: "2-digit", month: "2-digit", year: "numeric" };
//   return new Date(date).toLocaleDateString("en-GB", options);
// };

// const UsersTable = () => {
//   const [showAddStudentForm, setShowAddStudentForm] = useState(false);
//   const [students, setStudents] = useState([]);
//   const router = useRouter();
//   const { getQuery } = useGetQuery();

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         await getQuery({
//           url: apiUrls?.Students?.getAllStudents,
//           onSuccess: (data) => {
//             setStudents(data);
//           },
//           onFail: (err) => {
//             console.error(
//               "API error:",
//               err instanceof Error ? err.message : err
//             );
//           },
//         });
//       } catch (error) {
//         console.error("Failed to fetch students:", error);
//       }
//     };

//     fetchStudents();
//   }, []);

//   const toggleStatus = (userId) => {
//     setStudents(
//       students.map((user) =>
//         user.id === userId ? { ...user, isActive: !user.isActive } : user
//       )
//     );
//   };

//   const StatusToggle = ({ isActive, onClick }) => (
//     <div className="flex items-center">
//       <button
//         onClick={onClick}
//         className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
//           isActive ? "bg-green-500" : "bg-gray-400"
//         }`}
//       >
//         <div
//           className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ${
//             isActive ? "translate-x-5" : "translate-x-0"
//           }`}
//         ></div>
//       </button>
//       <span
//         className={`ml-2 text-sm font-semibold ${
//           isActive ? "text-green-700" : "text-red-700"
//         }`}
//       >
//         {isActive ? "Active" : "Inactive"}
//       </span>
//     </div>
//   );

//   const columns = [
//     { Header: "No.", Cell: ({ row }) => row.index + 1 },
//     { Header: "Name", accessor: "full_name" },
//     { Header: "Age", accessor: "age" },
//     { Header: "Email ID", accessor: "email" },
//     {
//       Header: "Join Date",
//       accessor: "createdAt",
//       Cell: ({ value }) => formatDate(value),
//     },
//     { Header: "Course", accessor: "course_name" },
//     {
//       Header: "Status",
//       accessor: "isActive",
//       Cell: ({ row }) => (
//         <StatusToggle
//           isActive={row.original.isActive}
//           onClick={() => toggleStatus(row.original.id)}
//         />
//       ),
//     },
//   ];

//   const handleAddStudentClick = () => {
//     setShowAddStudentForm(true);
//   };

//   const handleCancelAddStudent = () => {
//     setShowAddStudentForm(false);
//   };

//   if (showAddStudentForm) {
//     return <AddStudentForm onCancel={handleCancelAddStudent} />;
//   }

//   return (
//     <div className="flex items-start justify-center min-h-screen bg-gray-100 p-6">
//       <div className="w-full max-w-6xl bg-white p-8 rounded-lg shadow-md">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
//           <h1 className="text-2xl font-bold">Student List</h1>
//           <button
//             className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md"
//             onClick={handleAddStudentClick}
//           >
//             <FaPlus className="mr-2" /> Add Student
//           </button>
//         </div>

//         {/* Integrating MyTable with Filters */}
//         <MyTable
//           columns={columns}
//           data={students}
//           // filterColumns={["course_name", "isActive"]}
//           showDate={true}
//           entryText="Total no. of entries:"
//         />
//       </div>
//     </div>
//   );
// };

// export default UsersTable;
