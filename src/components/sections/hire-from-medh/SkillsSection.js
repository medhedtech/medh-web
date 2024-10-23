import Image from "next/image";
import SkillSectionImg from "../../../assets/images/hireformmedh/skillsectionimg.jpeg";

const SkillsSection = () => {
  return (
    <section className="flex justify-center items-center w-full h-auto bg-[#FFE5F0] dark:bg-black py-14">
      <div className="w-[85%] h-full flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-[40%]  overflow-hidden">
          <Image
            src={SkillSectionImg}
            alt="Classroom with students"
            className="w-full h-auto rounded-tl-[60px] rounded-br-[60px] object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 mt-8 md:mt-0 md:ml-16 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-[#F2277E]">
            Get-Job-Ready Candidates
          </h2>
          <p className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white">
            with following IT skills
          </p>

          <ul className="mt-6 space-y-4 text-left">
            {[
              "Artificial Intelligence (AI)",
              "Data Science & Analytics",
              "Cloud Computing",
              "Mobile App Development",
              "Big Data",
              "Web Development",
              "Cyber Security",
              "Digital Marketing ... and many more.",
            ].map((skill, index) => (
              <li key={index} className="flex items-start space-x-2">
                <svg
                  className="w-5 h-5 p-[2.2px] mt-1 text-white  bg-[#F2277E] rounded-full"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-lg font-medium text-gray-700 dark:text-white">
                  {skill}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
