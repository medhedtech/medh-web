import React from "react";
import {
  FaHourglass,
  FaIndustry,
  FaBriefcase,
  FaUserTie,
  FaHandsHelping,
} from "react-icons/fa";

// Earning Potential Data
const earningPotentialData = [
  {
    icon: <FaHourglass className="text-[#7ECA9D] text-6xl mb-4" />,
    title: "Job Assurance",
    description:
      "Providing learners with the confidence that their investment in skill development will yield tangible results in the form of employment opportunities.",
  },
  {
    icon: <FaIndustry className="text-[#7ECA9D] text-6xl mb-4" />,
    title: "Industry-Relevant Skills",
    description:
      "The curriculum is designed to align with industry standards, ensuring that graduates possess the skills and knowledge sought after by employers.",
  },
  {
    icon: <FaBriefcase className="text-[#7ECA9D] text-6xl mb-4" />,
    title: "Professional Development",
    description:
      "In addition to technical skills, our programs focus on soft skills development, enhancing communication, teamwork, and leadership abilities.",
  },
  {
    icon: <FaUserTie className="text-[#7ECA9D] text-6xl mb-4" />,
    title: "Career Support",
    description:
      "Our career services team provides guidance, mentorship, and placement assistance to ensure that learners transition seamlessly into the workforce.",
  },
];

const PlacementBenefits = () => {
  return (
    <section
      id="explore"
      className="py-16 w-full bg-white dark:bg-screen-dark flex justify-center items-center"
    >
      <div className="w-[92%] lg:w-[80%]">
        {/* Benefits Section */}
        <div className="text-center px-3 lg:px-15">
          <h2 className="text-3xl font-bold text-gray-500">
            Why Choose Medh-Placement-Assurance-Programs?
          </h2>
          <p className="mt-4 text-gray-600 text-[15px] leading-7 dark:text-gray300">
            Embark on an exhilarating journey of knowledge sharing, empowerment,
            and personal growth as an educator with Medh EdTech. Our platform
            offers a gratifying and fulfilling career choice for various
            compelling reasons:
          </p>
        </div>

        {/* Earning Potential Section */}
        <div className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
            {earningPotentialData.map((item, index) => (
              <div
                key={index}
                className="w-full px-4 py-8 bg-white dark:bg-inherit shadow-card-custom rounded-2xl border dark:border-gray600 border-[#0000004D] flex flex-col items-center text-center transition-transform duration-300 ease-in-out hover:shadow-lg hover:scale-105"
              >
                {/* Icon */}
                {item.icon}
                {/* Title */}
                <h3 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[22px] leading-6 md:leading-7 lg:leading-8 font-bold text-gray-500 dark:text-gray50 mb-3 md:mb-4">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-[#727695] text-[14px] sm:text-[14.5px] md:text-[15px] lg:text-[15.5px] xl:text-[16px] dark:text-gray300 leading-5 sm:leading-6 md:leading-7 lg:leading-7 font-light pt-1 flex-grow">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
              <div className="w-full px-4 py-8 bg-white dark:bg-inherit shadow-card-custom rounded-2xl border dark:border-gray600 border-[#0000004D] flex flex-col items-center text-center transition-transform duration-300 ease-in-out hover:shadow-lg hover:scale-105">
                {/* Image */}
                <FaHandsHelping className="text-[#7ECA9D] text-6xl mb-4" />
                {/* Title */}
                <h3 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[22px] leading-6 md:leading-7 lg:leading-8 font-bold text-gray-500 dark:text-gray50 mb-3 md:mb-4">
                  Practical Experience Through Corporate Internships
                </h3>
                {/* Description */}
                <p className="text-[#727695] text-[14px] sm:text-[14.5px] md:text-[15px] lg:text-[15.5px] xl:text-[16px] dark:text-gray300 leading-5 sm:leading-6 md:leading-7 lg:leading-7 font-light pt-1 flex-grow">
                  By engaging in hands-on projects, industry simulations, and
                  corporate internships, learners acquire practical experience,
                  ensuring they are well-prepared for full-time corporate
                  employment upon program completion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlacementBenefits;
