// pages/course-preview.js
import React from "react";

export default function CoursePreview() {
  return (
    <div className="flex items-center justify-center min-h-screen pt-9 bg-gray-100">
      <div className="w-full max-w-6xl p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
          Preview Course Details
        </h2>

        <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Full-width Category Field */}
          <div className="col-span-2">
            <label className="block mb-1 text-gray-600">Category</label>
            <input
              type="text"
              value="Live"
              readOnly
              className="w-full p-2 border rounded-lg bg-gray-50 border-gray-300"
            />
          </div>

          {/* Course Title and Category Type in the same row */}
          <div>
            <label className="block mb-1 text-gray-600">Course Title</label>
            <input
              type="text"
              value="ABC"
              readOnly
              className="w-full p-2 border rounded-lg bg-gray-50 border-gray-300"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">
              Category Type (Live/ Hybrid/ Pre-Recorded)
            </label>
            <input
              type="text"
              value="XYZ"
              readOnly
              className="w-full p-2 border rounded-lg bg-gray-50 border-gray-300"
            />
          </div>

          {/* No. of Sessions and Duration in the same row */}
          <div>
            <label className="block mb-1 text-gray-600">No. of Sessions</label>
            <input
              type="text"
              value="25"
              readOnly
              className="w-full p-2 border rounded-lg bg-gray-50 border-gray-300"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">
              Duration (In months/ weeks)
            </label>
            <input
              type="text"
              value="4 weeks"
              readOnly
              className="w-full p-2 border rounded-lg bg-gray-50 border-gray-300"
            />
          </div>

          {/* Session Duration and Course Description in the same row */}
          <div>
            <label className="block mb-1 text-gray-600">Session Duration</label>
            <input
              type="text"
              value="50 minutes"
              readOnly
              className="w-full p-2 border rounded-lg bg-gray-50 border-gray-300"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">
              Course Description
            </label>
            <input
              type="text"
              value="write description"
              readOnly
              className="w-full p-2 border rounded-lg bg-gray-50 border-gray-300"
            />
          </div>
        </form>

        <h3 className="mt-8 mb-4 text-xl font-semibold text-gray-800">
          All Videos Uploaded
        </h3>

        <div className="p-4 border rounded-lg bg-gray-50 border-gray-300">
          <div className="flex items-center gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="relative w-32 h-32 bg-gray-200 rounded-md overflow-hidden"
              >
                <img
                  src="/images/certificate.png"
                  alt="Video thumbnail"
                  className="object-cover w-full h-full"
                />
                <button className="absolute top-[-5px] right-[-2px] p-1 rounded-lg">
                  <span className="text-red-500 font-bold">×</span>
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-customGreen"
                style={{ width: "100%" }}
              ></div>
            </div>
            <span className="text-customGreen">✓</span>
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-4">
          <button className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg">
            Cancel
          </button>
          <button className="px-4 py-2 font-semibold text-white bg-customGreen rounded-lg">
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}
