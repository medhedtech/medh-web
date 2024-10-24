// pages/job-opening.js
import React, { useState } from "react";
import JobApply from "./jobApply";

const JobOpening = () => {
  const [activeJob, setActiveJob] = useState("Vedic Mathematics Instructor");
  return (
    <div className="w-full flex justify-center items-center p-4 bg-white dark:bg-screen-dark">
      <div className="lg:w-[80%] w-[95%]">
        <h2 className="text-[#5C6574] text-center text-3xl dark:text-gray50 font-Poppins font-bold pb-6">
          Job Positions / Openings
        </h2>
        {/* Left Section - Job Title Navigation */}
        <div className="w-full  flex flex-col lg:flex-row ">
          <div className="w-full lg:w-[15%]">
            <div className="flex flex-col">
              <button
                className={`${
                  activeJob === "Vedic Mathematics Instructor"
                    ? "bg-[#5F2DED] text-white"
                    : "bg-gray-200 "
                } p-2`}
                onClick={() => setActiveJob("Vedic Mathematics Instructor")}
              >
                Vedic Mathematics Instructor
              </button>

              <button
                className={`${
                  activeJob === "Personality Development Instructor"
                    ? "bg-[#5F2DED] text-white"
                    : "bg-gray-200"
                } p-2`}
                onClick={() =>
                  setActiveJob("Personality Development Instructor")
                }
              >
                Personality Development Instructor
              </button>
            </div>
          </div>

          {/* Middle Section - Job Description */}
          <div className="w-full lg:w-[42%] p-6 text-[#727695] text-[15px] list-none border-2 dark:text-gray300 dark:border-gray600 border-[#D5D8DC]">
            <div className="mb-3 font-Open">
              <h2 className="mb-2 leading-[27px] font-bold dark:text-white">
                Job Description:
              </h2>
              <div className="mb-3 font-Open dark:text-gray300">
                <p className="leading-[27px] font-normal ">
                  We are seeking experienced Vedic Mathematics Instructors to
                  deliver engaging online courses tailored to learners aged 3-7,
                  8-12, and 13-18 years.
                </p>
                <p className="pt-2 leading-[27px] font-normal">
                  The ideal candidate shall have a passion for teaching Vedic
                  Mathematics and a commitment to delivering age-appropriate,
                  interactive learning experiences.
                </p>
              </div>
            </div>

            <div className="mb-3">
              <h3 className="mb-2 leading-[27px] font-bold font-Open dark:text-white">
                Key Responsibilities:
              </h3>
              <ul className="  mt-2 leading-[22.5px] font-normal font-Poppins pl-8 dark:text-gray300" >
                <li>
                  Deliver live online classes and pre-recorded sessions in Vedic
                  Mathematics for each specified age group.
                </li>
                <li>
                  Tailor instructional strategies to meet developmental and
                  cognitive needs of learners within each age group.
                </li>
                <li>
                  Create a nurturing and inclusive learning environment to cater
                  to the diverse learning needs of students.
                </li>
                <li>
                  Assess students’ progress and provide constructive feedback to
                  encourage self- improvement and growth.
                </li>
                <li>
                  Maintain regular communication with students and their parents
                  to provide updates on progress and address concerns.
                </li>
              </ul>
            </div>

            <div className="mb-3">
              <h3 className=" mb-2 leading-[27px] font-bold font-Open dark:text-white">
                Qualifications and Requirements:
              </h3>
              <ul className="mt-2 leading-[22.5px] font-normal font-Poppins pl-8 ">
                <li>
                  Bachelor’s or Master’s degree in Mathematics, Education, or
                  related fields.
                </li>
                <li>
                  Prior experience in teaching Vedic Mathematics to children and
                  adolescents.
                </li>
                <li>
                  Strong understanding of child and adolescent development for
                  the respective age groups.
                </li>
                <li>Excellent communication and interpersonal skills.</li>
                <li>Technological proficiency in online teaching platforms.</li>
                <li>
                  Commitment to creating a nurturing and inclusive learning
                  environment.
                </li>
              </ul>
            </div>

            <h3 className="mb-2 leading-[27px] font-bold font-Open dark:text-white">
              Mode: Hybrid (Work-from-Office and Work-from- Home)
            </h3>

            <h3 className="mb-2 leading-[27px] font-bold font-Open dark:text-white">
              Market: INDIA, US, UK and AUSTRALIA
            </h3>

            <div className="mb-3">
              <h3 className="mb-2 leading-[27px] font-bold font-Open dark:text-white">
                Process of Selection:
              </h3>
              <ul className=" mt-2 leading-[22.5px] font-normal font-Poppins pl-8 ">
                <li>Telephonic Call and Screening</li>
                <li>Online aptitude Test</li>
                <li>Live Demo Session</li>
              </ul>
            </div>

            <h3 className="mb-2 leading-[27px] font-bold font-Open dark:text-white">
              Work from Office Location: Andheri East, Mumbai
            </h3>

            <div className="mb-3">
              <h3 className="mb-2 leading-[27px] font-bold font-Open dark:text-white">
                For Work-from-Home (pre-requisites):
              </h3>
              <ul>
                <li>
                  Laptop, headset, and high-speed Internet Connection required.
                </li>
                <li>Consistent availability during agreed class hours.</li>
              </ul>
            </div>

            <div className="mb-3 ">
              <h3 className="mb-2 leading-[27px] font-bold font-Open dark:text-white">
                Note: Professional head-set can be provided if needed.
              </h3>
              <p>
                This position offers the opportunity to make a meaningful impact
                on the mathematical development of students across different age
                groups. If you are passionate about empowering individuals to
                develop a strong foundation in mathematics using Vedic
                techniques, we invite you to join our team and contribute to
                shaping the future mathematicians of tomorrow.
              </p>
            </div>

            <div className="mt-3 ">
              <h3 className="mb-2 leading-[27px] font-bold font-Open dark:text-white">
                Remuneration:
              </h3>
              <p className=" mt-2 leading-[22.5px] font-normal font-Poppins pl-8">
                Best in the industry. The remuneration for work-from-home and
                office positions can vary based on factors such as location,
                students’ age-group, and level of relevant experience.
              </p>
            </div>
          </div>

          {/* Right Section - Apply Form */}
          <div className=" lg:w-[43%] w-full py-6 lg:pl-8 bg-white dark:bg-inherit">
            <JobApply />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobOpening;
