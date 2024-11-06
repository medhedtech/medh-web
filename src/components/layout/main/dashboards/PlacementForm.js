import React from "react";

const PlacementForm = () => {
  return (
    <div className="w-4/5 p-6">
      <h1 className="text-size-32 mb-7">Apply For Placement</h1>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xl mb-6 font-semibold text-[#434343]">
            Name
          </label>
          <input
            type="text"
            placeholder="John"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryColor"
          />
        </div>

        <div>
          <label className="block text-xl mb-6 font-semibold text-[#434343]">
            Email Id
          </label>
          <input
            type="email"
            placeholder="John"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryColor"
          />
        </div>

        <div>
          <label className="block text-xl mb-6 font-semibold text-[#434343]">
            Mobile Number
          </label>
          <input
            type="tel"
            placeholder="+91 987654292"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryColor"
          />
        </div>

        <div>
          <label className="block text-xl mb-6 font-semibold text-[#434343]">
            City
          </label>
          <select className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryColor">
            <option></option>
            <option>Select</option>
          </select>
        </div>

        <div>
          <label className="block text-xl mb-6 font-semibold text-[#434343]">
            Completed Course
          </label>
          <select className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryColor">
            <option></option>
            <option>Select</option>
          </select>
        </div>

        <div>
          <label className="block text-xl mb-6 font-semibold text-[#434343]">
            Course Completed Year
          </label>
          <select className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryColor">
            <option></option>
            <option>Select</option>
          </select>
        </div>

        <div>
          <label className="block text-xl mb-6 font-semibold text-[#434343]">
            Area of Interest
          </label>
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryColor"
          />
        </div>

        <div>
          <label className="block text-xl mb-6 font-semibold text-[#434343]">
            Apply for Role
          </label>
          <select className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryColor">
            <option></option>
            <option>Select</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xl mb-6 font-semibold text-[#434343]">
            Message
          </label>
          <textarea
            rows="4"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryColor"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-52 py-2 px-4 bg-primaryColor text-white font-semibold rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-primaryColor"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlacementForm;
