import React from "react";
import Image from "next/image";
import Logo1 from "@/assets/images/join-as-school/logo-1.svg";
import Logo2 from "@/assets/images/join-as-school/logo-2.svg";
import Logo3 from "@/assets/images/join-as-school/logo-3.svg";
import Logo4 from "@/assets/images/join-as-school/logo-4.svg";
import Logo5 from "@/assets/images/join-as-school/logo-5.svg";
import Logo6 from "@/assets/images/join-as-school/logo-6.svg";
import Logo7 from "@/assets/images/join-as-school/logo-7.svg";
import Logo8 from "@/assets/images/join-as-school/logo-8.svg";
import Logo9 from "@/assets/images/join-as-school/logo-9.svg";
import Logo10 from "@/assets/images/join-as-school/logo-10.svg";
import Logo11 from "@/assets/images/join-as-school/logo-11.svg";


const advantagesData = [
  {
    id:1,
    icon: Logo1,
    title: "Diversification of Skill Sets",
    description:
      "Introducing skill development program allows to diversify the skill sets of the students. This diversification prepares students for a rapidly evolving job market and equips them with a broader range of competencies.",
  },
  {
    id:2,
    icon: Logo2,
    title: "Data-Driven Insights for Educators",
    description:
      "We provide data analytics and insights to educators, enabling them to track students’ progress, identify areas for improvement, and personalize instruction based on individual learning patterns.",
  },
  {
    id:3,
    icon: Logo3,
    title: "Access to Specialized Expertise",
    description:
      "Our subject matter experts design and deliver specialized courses: Collaboration will allow to tap into this expertise, ensuring students receive high-quality education tailored to specific skills and industries.",
  },
  {
    id:4,
    icon: Logo4,
    title: "Empowerment of Teachers",
    description:
      "Skill development collaboration empowers teachers by providing them with training and resources to implement modern teaching methodologies: This boosts their confidence and teaching abilities, ultimately benefiting the students.",
  },
  {
    id:5,
    icon: Logo5,
    title: "Cost-Effective Solutions",
    description:
      "Collaborating will provide cost-effective alternatives compared to developing in-house skill development courses and offer a broader range of skill development opportunities without straining the budgets.",
  },
  {
    id:6,
    icon: Logo6,
    title: "Scalability and Flexibility",
    description:
      "Solutions are scalable, making it easier to accommodate a larger number of students without compromising the quality of education: Additionally, these courses can be tailored to suit various academic schedules.",
  },
  {
    id:7,
    icon: Logo7,
    title: "Preparation for Future Careers",
    description:
      "Prepare students for future careers by aligning the curriculum with industry demands. This ensures that students are equipped with the necessary skills and knowledge required to excel in their chosen professions.",
  },
  {
    id:8,
    icon: Logo8,
    title: "Making Students Future-ready",
    description:
      "Collaboration empowers with modern, cost- effective, and engaging skill development solutions, enhancing student learning, diversifying skill sets, and preparing them for the future job market.",
  },
  {
    id:9,
    icon: Logo9,
    title: "Integration of Technology",
    description:
      "Collaborate to integrate our state-of-the-art tools, platforms, and applications into their teaching methods, enhancing students’ digital literacy and technological proficiency.",
  },
];

// Earning Potential Data
const advantagesPotentialData = [
  {
    id:1,
    icon: Logo10,
    title: "Increased Student Engagement and Motivation",
    description:
      "Gamified learning, interactive quizzes, and real-time progress tracking make the learning process more enjoyable and encourage active participation and motivation.",
  },
  {
    id:2,
    icon: Logo11,
    title: "Enhanced Curriculum and Learning Experience",
    description:
      "Enrich the existing curriculum by integrating cutting-edge technologies and innovative teaching methods to make learning more engaging, interactive, and effective for students.",
  },
];

const KeyAdvantages = () => {
  return (
    <section className="py-16 w-full bg-white flex justify-center items-center">
      <div className="w-[92%] lg:w-[80%]">
        {/* Benefits Section */}
        <div className="text-center px-3 lg:px-50 ">
          <h2 className="text-3xl font-bold text-[#252525]">Collaborate with Medh and Empower your Students with
          cutting-edge skills.</h2>
          <p className="mt-4 lg:px-16 px-2 text-[#5C6574] text-[17px] font-normal leading-6 font-sans ">
          Equip your students for the future: upskill for confidence, job-readiness, and success. Let's
          work together to bring innovative and effective education solutions to your institution.
          </p>
        </div>
        <div className="text-[#252525] text-3xl text-center font-bold lg:pt-16 pt-10">
          <h2>Key advantages to Schools/Institutes</h2>
        </div>

        {/* Render the General Benefits */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-5 lg:gap-y-8 gap-y-5 ">
          {advantagesData.map((advantages, index) => (
            <div
              key={index}
              className=" px-2 py-1 text-center bg-white rounded-3xl border border-[#0000004D] shadow-card-custom w-full transition-transform duration-300 ease-in-out hover:shadow-lg hover:scale-105 "
            >
              <Image src={advantages.icon} alt="img" className="mx-auto h-16   mb-1" />
              <h3 className="text-[15px] leading-7 font-bold text-[#252525]  font-Open mb-1">
                {advantages.title}
              </h3>
              <p className="text-[#252525] text-[15px] leading-7 font-normal font-Open ">
                {advantages.description}
              </p>
            </div>
          ))}
        </div>

        {/* Earning Potential Section */}
        <div className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
            {advantagesPotentialData.map((item, index) => (
              <div
                key={index}
                className="w-full px-2 py-1 text-center  bg-white shadow-card-custom rounded-2xl border border-[#0000004D] flex flex-col transition-transform duration-300 ease-in-out hover:shadow-lg hover:scale-105"
                
              >
                <Image src={item.icon} alt="img" className="mx-auto h-16 mb-1" />
                <h3 className="text-[15px] leading-7 font-bold text-[#252525] font-Open mb-1">
                  {item.title}
                </h3>
                <p className="text-[#252525] text-[15px] leading-7 font-normal font-Open flex-grow">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KeyAdvantages;