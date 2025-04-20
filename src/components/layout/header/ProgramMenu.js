import React from "react";
import { XCircle } from "lucide-react";
import Link from "next/link";

const ProgramsMenu = ({ programMenuOpen, toggleProgramMenu }) => {
  return (
    <div
      className={`fixed top-0 right-0 w-[80vw] max-w-[400px] h-[100vh] bg-white shadow-lg z-20 transition-transform duration-500 ease-out transform ${
        programMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 shadow-md">
        <h2 className="text-xl font-semibold">Programs</h2>
        <button onClick={toggleProgramMenu} aria-label="Close Menu">
          <XCircle className="text-yellow-500 w-6 h-6" />
        </button>
      </div>

      {/* Program List */}
      <div className="flex flex-col items-start justify-start space-y-6 px-6 py-8 font-medium text-lg">
        <Link
          href="/ai-and-data-science-course"
          className="focus:text-green-400 text-[#252525] font-Poppins"
        >
          AI and Data Science
        </Link>
        <Link
          href="/personality-development-course"
          className="focus:text-green-400 text-[#252525] font-Poppins"
        >
          Personality Development
        </Link>
        <Link
          href="/vedic-mathematics-course"
          className="focus:text-green-400 text-[#252525] font-Poppins"
        >
          Vedic Mathematics
        </Link>
        <Link
          href="/digital-marketing-with-data-analytics-course"
          className="focus:text-green-400 text-[#252525] font-Poppins"
        >
          Digital Marketing With Data Analytics
        </Link>

        {/* View Other Courses */}
        <Link
          href="/courses/"
          className="focus:text-green-400 text-[#252525] font-Poppins"
        >
          ~View Other Courses~
        </Link>
      </div>
    </div>
  );
};

export default ProgramsMenu;
