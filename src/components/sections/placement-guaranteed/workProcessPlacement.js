import React from "react";
import {
  FaBookOpen,
  FaLaptopCode,
  FaHandsHelping,
  FaBriefcase,
  FaCheckCircle,
} from "react-icons/fa";

const HiringProcessPlacement = () => {
  const processSteps = [
    {
      title: "Enroll in a Course",
      description:
        "Select from our extensive array of job-oriented courses tailored to match your career goals and aspirations.",
      icon: <FaBookOpen className="text-5xl" />,
      arrow: true,
    },
    {
      title: "Complete the Program",
      description:
        "Participate in dynamic lessons, hands-on projects, and thorough assessments designed to build and refine your skills.",
      icon: <FaLaptopCode className="text-5xl" />,
      arrow: true,
    },
    {
      title: "Receive Career Support",
      description:
        "Leverage our dedicated career services team for assistance with job applications, interview preparation, and more.",
      icon: <FaHandsHelping className="text-5xl" />,
      arrow: false,
    },
    {
      title: "Corporate Internships",
      description:
        "Ensuring you are well-prepared for full-time employment upon completing the program.",
      icon: <FaBriefcase className="text-5xl" />,
      arrow: true,
    },
    {
      title: "Secure Your Job",
      description:
        "Successfully complete the course and benefit from our guarantee of job placement in a relevant role.",
      icon: <FaCheckCircle className="text-5xl" />,
      arrow: false,
    },
  ];

  return (
    <div className="w-full px-4 py-12 bg-[#7ECA9D] flex justify-center items-center">
      <div className="lg:w-[80%] w-[96%]">
        <h1 className="text-center font-Poppins text-4xl font-bold mb-12 text-[#020101]">
          How It Works?
        </h1>

        {/* Main Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {processSteps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center text-center"
            >
              {/* Icon */}
              <div className="mb-4 border border-dashed border-white p-4 rounded-full transition-transform transform hover:scale-100 group hover:bg-white">
                <span className="text-white group-hover:text-[#7ECA9D]">
                  {step.icon}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-[22px] font-Poppins font-semibold mb-2 text-[#020101]">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-[#020101] font-Poppins text-[15px] leading-7">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HiringProcessPlacement;
