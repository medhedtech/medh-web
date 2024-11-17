import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

const DownloadBrochureModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-100 py-6 px-4 relative">
        <div className="flex border-b-2">
          <button
            onClick={onClose}
            className="absolute font-normal top-3 text-4xl right-3 text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
          <h2 className="text-xl font-Poppins font-semibold mb-4">
            Download Brochure
          </h2>
        </div>
        <h3 className="text-xl font-medium text-[#FFB547] my-4">
          Certificate Course in
          <br />
          <span className="font-bold text-2xl text-[#FFA63E]">
            Learning Mandarin Language
          </span>
        </h3>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Your Name*"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#FFA63E]"
            required
          />
          <input
            type="email"
            placeholder="Your Email*"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#FFA63E]"
            required
          />
          <div className="flex space-x-2">
            <select
              className="px-4 text-black py-2 border rounded w-1/3 focus:outline-none focus:border-[#FFA63E]"
              required
            >
              <option value="IN">IN (+91)</option>
              <option value="AUS">AUS (+61)</option>
              <option value="CA">CA (+1)</option>
              <option value="SGP">SGP (+65) </option>
              <option value="UAE">UAE (+971)</option>
              <option value="UK">Uk (+44) </option>
            </select>
            <input
              type="tel"
              placeholder="Your Phone*"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#FFA63E]"
              required
            />
          </div>

          <div className="flex items-start space-x-2 mb-12">
            <input
              // {...register("accept")}
              type="checkbox"
              id="accept"
              className="w-4 h-4 text-[#7ECA9D] border-gray-300 rounded mt-1 focus:ring-[#7ECA9D]"
            />
            <label
              htmlFor="accept"
              className="text-sm text-gray-700 dark:text-gray-300"
            >
              By submitting this form, I accept
              <span className="text-[#7ECA9D] ml-1">Terms of Service </span>
              & <br />
              <span className="text-[#7ECA9D]">Privacy Policy.</span>
            </label>
          </div>

          <div className="-mb-6">
            <button
              type="submit"
              className="bg-[#7ECA9D] rounded-[2px] text-white px-6 py-2 flex items-center justify-center"
            >
              <FaPaperPlane className="mr-2" /> Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DownloadBrochureModal;
