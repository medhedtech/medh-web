"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";

const Gamma = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    email: "",
    phoneNumber: "",
    role: "Student",
    department: "Student",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="flex items-start font-Poppins justify-center min-h-screen pt-9 bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-6xl w-full p-6 md:p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Create a new user
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600">
              Full Name
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faUser}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Karan Singh"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Age
            </label>
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="27 years"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="enteremail@gmail.com"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-600">
              Phone number
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faPhone}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="8317074259"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600">
              Select Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Student">Student</option>
              <option value="Instructor">Instructor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600">
              Assign Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Student">Student</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-4">
          <button
            type="button"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-customGreen text-white px-4 py-2 rounded-md"
          >
            Create User
          </button>
        </div>
      </form>
    </div>
  );
};

export default Gamma;
