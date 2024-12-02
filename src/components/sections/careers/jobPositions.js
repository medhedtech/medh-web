// import React, { useState } from "react";
// import JobApply from "./jobApply";

// const JobOpening = () => {
//   const [activeJob, setActiveJob] = useState("Vedic Mathematics Instructor");

//   // Define job data
//   const jobs = {
//     "Vedic Mathematics Instructor": {
//       description: `
//   We are seeking experienced Vedic Mathematics Instructors to deliver engaging online courses tailored to learners aged 3-7, 8-12, and 13-18 years.

//   The ideal candidate shall have a passion for teaching Vedic Mathematics and a commitment to delivering age-appropriate, interactive learning experiences.
// `,
//       responsibilities: [
//         "Deliver live online classes and pre-recorded sessions in Vedic Mathematics for each specified age group.",
//         "Tailor instructional strategies to meet developmental and cognitive needs of learners within each age group.",
//         "Create a nurturing and inclusive learning environment to cater to the diverse learning needs of students.",
//         "Assess students’ progress and provide constructive feedback to encourage self-improvement and growth.",
//         "Maintain regular communication with students and their parents to provide updates on progress and address concerns.",
//       ],
//       qualifications: [
//         "Bachelor’s or Master’s degree in Mathematics, Education, or related fields.",
//         "Prior experience in teaching Vedic Mathematics to children and adolescents.",
//         "Strong understanding of child and adolescent development for the respective age groups.",
//         "Excellent communication and interpersonal skills.",
//         "Technological proficiency in online teaching platforms.",
//         "Commitment to creating a nurturing and inclusive learning environment.",
//       ],
//       mode: "Hybrid (Work-from-Office and Work-from-Home)",
//       market: "INDIA, US, UK and AUSTRALIA",
//       selectionProcess: [
//         "Telephonic Call and Screening",
//         "Online aptitude Test",
//         "Live Demo Session",
//       ],
//       officeLocation: "Andheri East, Mumbai",
//       homeRequirements: [
//         "Laptop, headset, and high-speed Internet Connection required.",
//         "Consistent availability during agreed class hours.",
//       ],
//       note: "Professional head-set can be provided if needed.",
//       note_description:
//         "This position offers the opportunity to make a meaningful impact on the mathematical development of students across different age groups. If you are passionate about empowering individuals to develop a strong foundation in mathematics using Vedic techniques, we invite you to join our team and contribute to shaping the future mathematicians of tomorrow.",
//       remuneration: `Best in the industry. The remuneration for work-from-home and office positions can vary based on factors such as location, students’ age-group, and level of relevant experience.`,
//     },
//     "Personality Development Instructor": {
//       description: `Seeking instructors to deliver online Personality Development Programs for learners aged 3-7, 8-12, 13-18, and 18+.

//       The ideal candidates must have a passion to teach and customize the learning experience to:

//       Deliver engaging and interactive learning experiences tailored to age-appropriate pedagogy.
//       Customize learning experiences to meet students’ requirements and encourage participation and discussions.`,
//       responsibilities: [
//         "Conduct live online classes and pre-recorded sessions.",
//         "Tailor instructional strategies to meet developmental needs of each age group.",
//         "Assess students’ progress in developing personality traits and soft skills.",
//         "Maintain regular communication with students and parents.",
//         "Stay updated on trends and research in personality development.",
//       ],
//       qualifications: [
//         "Bachelor’s or Master’s degree in Psychology, Education, or related fields.",
//         "Prior and relevant experience in teaching, counseling, or training in personality development, public speaking is must.",
//         "Strong understanding of child and adolescent development for respective age groups.",
//         "Good personality and excellent communication and interpersonal skills.",
//         "Technological proficiency in online teaching platforms.",
//         "Commitment to creating a nurturing and inclusive learning environment.",
//       ],
//       mode: "Hybrid (Work-from-Office and Work-from-Home)",
//       market: "INDIA, US, UK and AUSTRALIA",
//       selectionProcess: [
//         "Telephonic Call and Screening",
//         "Online aptitude Test",
//         "Live Demo Session",
//       ],
//       officeLocation: "",
//       homeRequirements: [
//         "Laptop, headset, and high-speed Internet Connection.",
//         "Consistent availability during agreed class hours.",
//       ],
//       note: "Professional head-set can be provided if needed.",
//     },
//   };

//   const job = jobs[activeJob];

//   return (
//     <div className="w-full flex justify-center items-center p-4 bg-white dark:bg-screen-dark">
//       <div className="lg:w-[80%] w-[95%]">
//         <h2 className="text-[#5C6574] text-center text-3xl dark:text-gray50 font-Poppins font-bold pb-6">
//           Job Positions / Openings
//         </h2>
//         {/* Left Section - Job Title Navigation */}
//         <div className="w-full flex flex-col lg:flex-row">
//           <div className="w-full lg:w-[15%]">
//             <div className="flex flex-col">
//               {Object.keys(jobs).map((jobTitle) => (
//                 <button
//                   key={jobTitle}
//                   className={`${
//                     activeJob === jobTitle
//                       ? "bg-[#7ECA9D] text-white"
//                       : "bg-gray-200"
//                   } p-2`}
//                   onClick={() => setActiveJob(jobTitle)}
//                 >
//                   {jobTitle}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Middle Section - Job Description */}
//           <div className="w-full lg:w-[42%] p-6 text-[#727695] text-[15px] list-none border-2 dark:text-gray300 dark:border-gray600 border-[#D5D8DC]">
//             <h2 className="mb-3 font-bold text-lg dark:text-white">
//               Job Description:
//             </h2>
//             <p className="mb-3">{job.description}</p>

//             <h3 className="mb-2 font-bold dark:text-white">
//               Key Responsibilities:
//             </h3>
//             <ul className="mb-3 list-disc pl-5">
//               {job.responsibilities.map((item, index) => (
//                 <li key={index}>{item}</li>
//               ))}
//             </ul>

//             <h3 className="mb-2 font-bold dark:text-white">
//               Qualifications and Requirements:
//             </h3>
//             <ul className="mb-3 list-disc pl-5">
//               {job.qualifications.map((item, index) => (
//                 <li key={index}>{item}</li>
//               ))}
//             </ul>

//             <h3 className="mb-2 font-bold dark:text-white">Mode:</h3>
//             <p className="mb-3">{job.mode}</p>

//             <h3 className="mb-2 font-bold dark:text-white">Market:</h3>
//             <p className="mb-3">{job.market}</p>

//             <h3 className="mb-2 font-bold dark:text-white">
//               Process of Selection:
//             </h3>
//             <ul className="mb-3 list-disc pl-5">
//               {job.selectionProcess.map((item, index) => (
//                 <li key={index}>{item}</li>
//               ))}
//             </ul>

//             <h3 className="mb-2 font-bold dark:text-white">
//               Work from Office Location: Andheri East, Mumbai
//             </h3>
//             <p className="mb-3">{job.officeLocation}</p>

//             <h3 className="mb-2 font-bold dark:text-white">
//               For Work-from-Home, must have the following pre-requisites:
//             </h3>
//             <ul className="mb-3 list-disc pl-5">
//               {job.homeRequirements.map((item, index) => (
//                 <li key={index}>{item}</li>
//               ))}
//             </ul>

//             {job.note && (
//               <>
//                 <h3 className="mb-2 font-bold dark:text-white">Note:</h3>
//                 <p className="mb-3 font-semibold">{job.note}</p>
//                 <p className="mb-3">{job.note_description}</p>
//               </>
//             )}

//             {job.remuneration && (
//               <>
//                 <h3 className="mb-2 font-bold dark:text-white">
//                   Remuneration:
//                 </h3>
//                 <p className="mb-3">{job.remuneration}</p>
//               </>
//             )}
//           </div>

//           {/* Right Section - Apply Form */}
//           <div className=" lg:w-[43%] w-full py-6 lg:pl-8 bg-white dark:bg-inherit">
//             <JobApply />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JobOpening;

"use client";
import React, { useEffect, useState } from "react";
import JobApply from "./jobApply";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import { toast } from "react-toastify";
import Preloader from "@/components/shared/others/Preloader";

const JobOpening = () => {
  const [activeJob, setActiveJob] = useState(null);
  const { getQuery, loading } = useGetQuery();
  const [arriveData, setArrivedData] = useState([]);

  // Default job fields
  const defaultJobFields = {
    responsibilities: [
      "Deliver live online classes...",
      "Tailor instructional strategies...",
    ],
    qualifications: [
      "Bachelor's or Master's degree...",
      "Prior experience in teaching...",
    ],
    mode: "Hybrid",
    market: "INDIA, US, UK, and AUSTRALIA",
    selectionProcess: ["Telephonic Call...", "Online aptitude Test..."],
    officeLocation: "Andheri East, Mumbai",
    homeRequirements: ["Laptop, headset...", "Consistent availability..."],
    note: "Professional head-set can be provided if needed.",
    note_description: "This position offers the opportunity...",
    remuneration: "Best in the industry...",
  };

  // Fetch data from API (generic fetch function)
  const fetchData = async (url) => {
    await getQuery({
      url,
      onSuccess: (response) => {
        if (response?.success && Array.isArray(response.data)) {
          setArrivedData(response.data);
          // Set the first job as active if available
          if (response.data.length > 0) {
            setActiveJob(response.data[0].title);
          }
        } else {
          toast.error("Failed to fetch data.");
          setArrivedData([]);
        }
      },
      onFail: () => {
        toast.error("Failed to fetch data.");
        setArrivedData([]);
      },
    });
  };

  // Fetch job openings data
  useEffect(() => {
    fetchData(apiUrls?.jobForm?.getAllNewJobs);
  }, []);

  // Find the active job based on the selected title
  const job = arriveData.find((jobItem) => jobItem.title === activeJob);

  if (loading) {
    return <Preloader />;
  }

  return (
    <div
      id="enroll-section"
      className="w-full flex justify-center items-center p-4 bg-white dark:bg-screen-dark"
    >
      <div className="lg:w-[80%] w-[95%]">
        <h2 className="text-[#5C6574] text-center text-3xl dark:text-gray50 font-Poppins font-bold pb-6">
          Job Positions / Openings
        </h2>
        <div className="w-full flex flex-col lg:flex-row">
          {/* Left Section - Job Title Navigation */}
          <div className="w-full lg:w-[15%]">
            <div className="flex flex-col">
              {arriveData.map((jobItem) => (
                <button
                  key={jobItem.title}
                  className={`${
                    activeJob === jobItem.title
                      ? "bg-[#7ECA9D] text-white"
                      : "bg-gray-200"
                  } p-2`}
                  onClick={() => setActiveJob(jobItem.title)}
                >
                  {jobItem.title}
                </button>
              ))}
            </div>
          </div>

          {/* Middle Section - Job Description */}
          <div className="w-full lg:w-[42%] p-6 text-[#727695] text-[15px] list-none border-2 dark:text-gray300 dark:border-gray600 border-[#D5D8DC]">
            {job && (
              <>
                {/* Dynamic Job Description */}
                <h2 className="mb-3 font-bold text-lg dark:text-white">
                  Job Description:
                </h2>
                <p className="mb-3">{job.description}</p>

                {/* Default Job Fields */}
                <h3 className="mb-2 font-bold dark:text-white">
                  Key Responsibilities:
                </h3>
                <ul className="mb-3 list-disc pl-5">
                  {defaultJobFields.responsibilities.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <h3 className="mb-2 font-bold dark:text-white">
                  Qualifications:
                </h3>
                <ul className="mb-3 list-disc pl-5">
                  {defaultJobFields.qualifications.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <h3 className="mb-2 font-bold dark:text-white">Mode:</h3>
                <p className="mb-3">{defaultJobFields.mode}</p>

                <h3 className="mb-2 font-bold dark:text-white">Market:</h3>
                <p className="mb-3">{defaultJobFields.market}</p>

                <h3 className="mb-2 font-bold dark:text-white">
                  Selection Process:
                </h3>
                <ul className="mb-3 list-disc pl-5">
                  {defaultJobFields.selectionProcess.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <h3 className="mb-2 font-bold dark:text-white">
                  Office Location:
                </h3>
                <p className="mb-3">{defaultJobFields.officeLocation}</p>

                <h3 className="mb-2 font-bold dark:text-white">
                  Work-from-Home Requirements:
                </h3>
                <ul className="mb-3 list-disc pl-5">
                  {defaultJobFields.homeRequirements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                {defaultJobFields.note && (
                  <>
                    <h3 className="mb-2 font-bold dark:text-white">Note:</h3>
                    <p className="mb-3 font-semibold">
                      {defaultJobFields.note}
                    </p>
                    <p className="mb-3">{defaultJobFields.note_description}</p>
                  </>
                )}

                {defaultJobFields.remuneration && (
                  <>
                    <h3 className="mb-2 font-bold dark:text-white">
                      Remuneration:
                    </h3>
                    <p className="mb-3">{defaultJobFields.remuneration}</p>
                  </>
                )}
              </>
            )}
          </div>

          {/* Right Section - Apply Form */}
          <div className="lg:w-[43%] w-full py-6 lg:pl-8 bg-white dark:bg-inherit">
            <JobApply />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobOpening;
