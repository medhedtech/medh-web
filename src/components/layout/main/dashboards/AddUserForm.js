import React from "react";

const AddUserForm = ({ formType = "Student", onSubmit, onCancel }) => {
  return (
    <div className="w-[95%] mx-auto p-6 bg-white rounded-lg shadow-md font-Poppins">
      <h2 className="text-2xl font-semibold mb-6">Add {formType}</h2>
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="text-xs px-2 text-[#808080] font-medium mb-1"
          >
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="name"
              placeholder={`${formType} Name`}
              className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_259_4315)">
                    <path
                      d="M12 5.9C13.16 5.9 14.1 6.84 14.1 8C14.1 9.16 13.16 10.1 12 10.1C10.84 10.1 9.9 9.16 9.9 8C9.9 6.84 10.84 5.9 12 5.9ZM12 14.9C14.97 14.9 18.1 16.36 18.1 17V18.1H5.9V17C5.9 16.36 9.03 14.9 12 14.9ZM12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4ZM12 13C9.33 13 4 14.34 4 17V20H20V17C20 14.34 14.67 13 12 13Z"
                      fill="#808080"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_259_4315">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="age"
            className="text-xs px-2 text-[#808080] font-medium mb-1"
          >
            Age
          </label>
          <input
            type="text"
            id="age"
            placeholder="27 years"
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="text-xs px-2 text-[#808080] font-medium mb-1"
          >
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              placeholder="example@gmail.com"
              className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z"
                    fill="#808080"
                  />
                </svg>
              </span>
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="course"
            className="text-xs px-2 text-[#808080] font-medium mb-1"
          >
            {formType === "Student" ? "Course" : "Department"}
          </label>
          <input
            type="text"
            id="course"
            placeholder={
              formType === "Student" ? "Course name" : "Department name"
            }
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="other"
            className="text-xs px-2 text-[#808080] font-medium mb-1"
          >
            Other
          </label>
          <div className="relative">
            <input
              type="text"
              id="other"
              placeholder="Other"
              className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z"
                    fill="#808080"
                  />
                </svg>
              </span>
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="other"
            className="text-xs px-2 text-[#808080] font-medium mb-1"
          >
            Other
          </label>
          <div className="relative">
            <input
              type="text"
              id="other"
              placeholder="Other"
              className="w-full border border-gray-300 rounded-md py-2 px-4 pr-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        <div className="flex justify-end items-center space-x-4 sm:col-span-2 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-200 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-green-500 focus:outline-none"
          >
            Add {formType}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserForm;
