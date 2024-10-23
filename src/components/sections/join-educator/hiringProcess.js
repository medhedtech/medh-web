import React from "react";
import Image from "next/image";
import Arrow from "@/assets/images/join-educator/arrow1.png";
import Logo1 from "@/assets/images/join-educator/logo-1.svg";
import Logo2 from "@/assets/images/join-educator/logo-2.svg";
import Logo3 from "@/assets/images/join-educator/logo-3.svg";
import Logo4 from "@/assets/images/join-educator/logo-4.svg";
import Logo5 from "@/assets/images/join-educator/logo-5.svg";
import Logo6 from "@/assets/images/join-educator/logo-6.svg";
import Logo7 from "@/assets/images/join-educator/logo-7.svg";

const HiringProcess = () => {
  const processSteps = [
    {
      title: "Application Screening",
      description:
        "We review the applications received from potential tutors/educators based on their qualifications, experience, teaching philosophy, and alignment with the company’s mission and values.",
      icon: Logo1,
      arrow: true,
    },
    {
      title: "Interview Process",
      description:
        "Shortlisted candidates are invited for interviews, which could be conducted in person, over the phone, or via video conferencing to evaluate the tutor’s teaching approach, communication skills, ability to handle different types of learners, and subject knowledge.",
      icon: Logo2,
      arrow: true,
    },
    {
      title: "Subject Proficiency Test",
      description:
        "Depending on the subject they will be teaching, tutors may be required to take a subject proficiency test to assess their knowledge and understanding.",
      icon: Logo3,
      arrow: false,
    },
    {
      title: "Demo Session",
      description:
        "Request the shortlisted candidates to conduct a demo tutoring session through a virtual platform to assess their teaching style and ability to engage with students effectively.",
      icon: Logo4,
      arrow: true,
    },
    {
      title: "Training and Onboarding",
      description:
        "Once selected, the tutor may undergo training to familiarize themselves with the company’s teaching methodologies, platform, and policies.",
      icon: Logo5,
      arrow: true,
    },
    {
      title: "Contract and Compensation",
      description:
        "An employment contract is drawn up, outlining the terms of employment, compensation, working hours, and other relevant details. Upon acceptance, sign an employment contract.",
      icon: Logo6,
      arrow: false,
    },
    {
      title: "Performance Evaluation",
      description:
        "We may periodically evaluate the performance of tutors based on student feedback, teaching effectiveness, and adherence to the company’s standards.",
      icon: Logo7,
      arrow: true,
    },
  ];

  return (
    <div className="w-full px-4 py-12 bg-white dark:bg-screen-dark  flex justify-center items-center">
      <div className="lg:w-[80%] w-[96%]">
        <h1 className="text-center text-4xl font-bold mb-12 dark:text-gray50">
          Process of Hiring an Educator at Medh!
        </h1>

        {/* Main Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 dark:bg-inherit lg:grid-cols-3 gap-8 ">
          {processSteps.map((step, index) => (
            <div
              key={index}
              className="border-2 dark:border-gray600 p-2 rounded-lg shadow-lg flex flex-col justify-between text-center relative dark:bg-screen-dark bg-white self-start transition-transform transform hover:scale-105 hover:shadow-xl "
            >
              <Image src={step.icon} alt="img" className="mx-auto h-16 mb-4" />
              <h3 className="text-[22px] leading-6 font-bold mb-2 dark: text-[#020101] dark:text-gray50 mt-2">
                {step.title}
              </h3>
              <p className="text-[#020101] text-[15px] dark:text-gray300 leading-7 ">
                {step.description}
              </p>
              {step.arrow && (
                <Image
                  src={Arrow}
                  alt="Arrow"
                  className="absolute right-0 top-1/4 transform translate-x-full -translate-y-1/4 h-20 w-20 dark:hidden bg-gray-100 hidden lg:block"
                />
              )}
            </div>
          ))}

          {/* Summary box */}
          <div className="lg:px-20 text-center col-span-1 lg:col-span-2 relative  flex justify-center items-center flex-col">
            <p className="text-[#000000] dark:text-gray300 text-[16px] leading-7 font-medium">
              Tutors are periodically evaluated based on student feedback and
              adherence to standards. Becoming an educator with MEDH enables you
              to leverage technology, reach a global audience, and transform
              education while enjoying flexibility and ongoing professional
              growth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiringProcess;
