import React from "react";

function JobApply() {
  return (
    <div className="w-full bg-white dark:bg-inherit rounded-md ">
      <h2 className="text-[#5F2DED] text-3xl text-center font-Poppins font-bold mb-4">
        Apply Now
      </h2>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Your Name*"
          className="w-full border dark:bg-inherit border-gray-300 p-2 rounded-md focus:outline-none"
          required
        />
        <input
          type="email"
          placeholder="Your Email*"
          className="w-full border dark:bg-inherit border-gray-300 p-2 rounded-md focus:outline-none "
          required
        />
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <select
            className="lg:w-[60%] w-full text-gray-400 border dark:bg-inherit border-gray-300 p-2 rounded-md focus:outline-none "
            required
          >
            <option value="">Select Country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="IN">India</option>
            <option value="AU">Australia</option>
            {/* Add more countries as needed */}
          </select>
          <input
            type="text"
            placeholder="Phone Number"
            className="w-full border border-gray-300 p-2 dark:bg-inherit rounded-md focus:outline-none "
            required
          />
        </div>
        <textarea
          placeholder="Write your cover letter"
          className="w-full border dark:bg-inherit border-gray-300 p-2 rounded-md focus:outline-none "
          rows="5"
        />
        <h2 className=" text-[1rem] font-bold font-Poppins text-[#000000D9]  dark:text-white">
          Upload Your Resume*
        </h2>
        <div>
          <input
            type="file"
            className="w-full dark:text-white p-2  rounded-lg"
            required
          />
        </div>
        <div className="flex ">
          <input type="checkbox" required className="mb-5" />
          <p className="text-sm text-gray-600 px-3 font-semibold">
            By submitting this form, I accept{" "}
            <a href="#" className="text-[#1f1aaf] ">
              Terms of Service
            </a>{" "}
            &{" "}
            <a href="#" className="text-[#1f1aaf]">
              Privacy Policy
            </a>
            .
          </p>
        </div>
        <div className="my-2">
          <input type="checkbox" required />
          <span className="ml-2 text-sm text-gray-800 dark:text-whitegrey">
            I'm not a robot
          </span>
        </div>
        <button
          type="submit"
          className="bg-[#5F2DED] text-white px-4 py-2 rounded-md hover:bg-[#5F2DED] transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default JobApply;
