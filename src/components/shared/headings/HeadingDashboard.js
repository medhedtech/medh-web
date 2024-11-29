// "use client";
// import {
//   BellIcon,
//   GreenSearch,
//   SearchIcon,
//   SettingIcon,
// } from "@/assets/images/icon/SearchIcon";
// import Link from "next/link";
// import { useState } from "react";
// import teacherImage1 from "@/assets/images/teacher/teacher__1.png";
// import Image from "next/image";

// const HeadingDashboard = ({ userName = "Manik", setIsFocused }) => {
//   const [searchTerm, setSearchTerm] = useState("");

//   const handleFocus = () => setIsFocused(true);
//   const handleBlur = () => {
//     if (!searchTerm) setIsFocused(false);
//   };

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);
//     setIsFocused(value.length > 0);
//   };

//   return (
//     <div className="flex font-Open items-center justify-between p-8 w-full">
//       {!searchTerm && (
//         <div className="flex flex-col">
//           <h2 className="text-lg font-semibold text-blackColor dark:text-white">
//             Good Morning, {userName}
//           </h2>
//           <h4 className="text-sm text-gray-500">
//             What do you want to learn today?
//           </h4>
//         </div>
//       )}

//       <div
//         className={`flex items-center gap-4 ${
//           searchTerm ? "w-full" : "w-[80%]"
//         }`}
//       >
//         <div
//           className={`relative flex-grow ${searchTerm ? "w-full" : "w-auto"}`}
//         >
//           <SearchIcon
//             className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${
//               searchTerm ? "hidden" : "block"
//             }`}
//           />
//           <input
//             type="text"
//             className={`pl-10 pr-10 py-2 rounded-full w-full shadow-md border ${
//               searchTerm
//                 ? "border-green-500 text-black font-semibold"
//                 : "border-gray-200 text-gray-500"
//             } dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none`}
//             placeholder="Search anything"
//             value={searchTerm}
//             onChange={handleSearchChange}
//             onFocus={handleFocus}
//             onBlur={handleBlur}
//           />
//           <GreenSearch
//             className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
//               searchTerm ? "text-green-500" : "text-gray-400"
//             } cursor-pointer`}
//           />
//         </div>

//         {!searchTerm && (
//           <>
//             <BellIcon className="text-gray-500 hover:text-blackColor dark:text-gray-300 dark:hover:text-white cursor-pointer" />
//             <SettingIcon className="text-gray-500 hover:text-blackColor dark:text-gray-300 dark:hover:text-white cursor-pointer" />
//             <Link href="/dashboards/student-profile">
//               <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden cursor-pointer">
//                 <Image
//                   src={teacherImage1}
//                   alt="User Profile"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             </Link>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HeadingDashboard;

// "use client";
// import { BellIcon, SearchIcon } from "@/assets/images/icon/SearchIcon";
// import Image from "next/image";
// import { useState } from "react";
// import teacherImage1 from "@/assets/images/teacher/teacher__1.png";
// import Link from "next/link";

// const HeadingDashboard = () => {
//   const [searchTerm, setSearchTerm] = useState("");

//   return (
//     <div
//       className="flex mt-4 mb-12 justify-between dark:shadow:white items-center bg-white px-8 py-2 rounded-md dark:bg-gray-800"
//       style={{
//         boxShadow: "0px 1px 2px 0px #00000026",
//       }}
//     >
//       {/* Search Bar */}
//       <div className="relative flex-grow max-w-[75%]">
//         <SearchIcon className="ml-2 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-200 dark:text-white" />
//         <input
//           type="text"
//           placeholder="Search..........."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-1/2 ml-2 pl-10 py-2 dark:rounded-lg sm:rounded-xs focus:rounded-lg focus:border-r-0 focus:ring-2 focus:ring-gray-300 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
//         />
//       </div>

//       {/* Notification and User Section */}
//       <div className="flex items-center gap-6">
//         {/* <BellIcon className="text-gray-500 hover:text-black cursor-pointer dark:text-gray-300 dark:hover:text-white transition duration-150 ease-in-out" /> */}
//         <div className="border-l-2 border-gray-300 h-12 mx-2" />
//         <div className="flex items-center gap-2">
//           <Link href="/dashboards/student-profile">
//             <Image
//               src={teacherImage1}
//               alt="User Avatar"
//               className="w-8 h-8 rounded-full object-cover"
//             />
//           </Link>
//           <select className="bg-transparent text-gray-700 font-medium dark:text-white border-none cursor-pointer focus:outline-none">
//             <option value="ram">Ram</option>
//             <option value="john">John</option>
//             <option value="doe">Doe</option>
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HeadingDashboard;

"use client";
import { BellIcon, SearchIcon } from "@/assets/images/icon/SearchIcon";
import Image from "next/image";
import { useState } from "react";
import teacherImage1 from "@/assets/images/teacher/teacher__1.png";
import Link from "next/link";

const HeadingDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div
      className="flex  my-6 justify-between items-center p-4 bg-white rounded-lg shadow-xl dark:bg-gray-800 dark:shadow-gray-700"
      style={{
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Search Bar */}
      <div className="relative flex-grow max-w-[70%]">
        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white transition-all duration-200" />
        <input
          type="text"
          placeholder="Search..........."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 py-3 text-sm rounded-lg focus:outline-none bg-[#F7F7F7] dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:ring-2 focus:ring-primaryColor focus:border-transparent transition duration-300"
        />
      </div>

      {/* Notification and User Section */}
      <div className="flex items-center gap-6">
        {/* Bell Icon (if needed) */}
        {/* <BellIcon className="text-gray-500 hover:text-black cursor-pointer dark:text-gray-300 dark:hover:text-white transition duration-150 ease-in-out" /> */}

        <div className="border-l-2 border-gray-300 h-10 mx-4 dark:border-gray-600" />

        {/* User Avatar & Dropdown */}
        <div className="flex items-center gap-3">
          <Link href="/dashboards/student-profile">
            <Image
              src={teacherImage1}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primaryColor transition-all duration-300 hover:ring-4"
            />
          </Link>

          <select className="bg-transparent text-gray-700 font-medium dark:text-white border-none cursor-pointer focus:outline-none dark:bg-gray-800 dark:focus:ring-primaryColor focus:ring-2 focus:ring-primaryColor transition duration-300">
            <option value="ram">Ram</option>
            <option value="john">John</option>
            <option value="doe">Doe</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default HeadingDashboard;
