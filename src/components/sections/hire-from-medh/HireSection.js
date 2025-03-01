import Image from "next/image";
import HireSectionImg from "../../../assets/images/hireformmedh/hiresectionimg.png";

const HireSection = () => {
  return (
    <div>
      <div className="text-center  px-4 sm:px-0 py-2">
        <h1 className="text-[#5C6574] font-Poppins font-bold text-size-32 leading-tight my-1">
          Start your hiring process now with Recruit @ Medh.
        </h1>
        <span className="text-[#727695] font-Open text-size-15 leading-27px">
          Providing access to top talent in the IT domain. Our platform offers a
          seamless experience for
          <br /> effortlessly recruiting industry-trained IT Professionals who
          are job-ready.
        </span>
      </div>
      <section className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12 px-4 py-8 md:px-16 md:py-16 bg-white dark:bg-screen-dark ">
        <div className="relative w-full md:w-[40%] flex justify-center">
          <Image src={HireSectionImg} className="object-cover w-full h-full" />
        </div>

        {/* Text Section */}
        <div className="w-full md:w-1/2">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#5C6574] dark:text-white">
              Why Hire from
            </h2>
            <h2 className="text-3xl md:text-4xl font-bold text-[#7ECA9D]">
              Recruit@Medh?
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                title: "Job Ready Candidates",
                description:
                  "Our intense courses are led by industry experts, ensuring that our candidates are job-ready upon completion, equipped with practical experience from relevant projects.",
              },
              {
                title: "Diverse Talent Pool",
                description:
                  "Our platform boasts a diverse talent pool, allowing you to choose the perfect fit for your projects based on their skills and experience.",
              },
              {
                title: "Dedicated Support",
                description:
                  "Count on our dedicated relationship managers who are well-versed in understanding your specific needs, providing unwavering support throughout the hiring process.",
              },
              {
                title: "Strong Technical Skills",
                description:
                  "We prioritize strong technical skills through a rigorous selection process, ensuring candidates possess the necessary competencies for success.",
              },
              {
                title: "Networking Opportunities",
                description:
                  "Emphasizing the power of networking, we encourage potential collaborations and partnerships for joint projects and expanded access to talent.",
              },
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="text-white bg-[#7ECA9D] p-[2px] mt-[6px] rounded-full text-center">
                  <svg
                    className="w-4 h-4"
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
                </div>
                <div>
                  <strong className="text-lg font-bold text-[#5C6574] dark:text-whiteColor">
                    {item.title}:
                  </strong>
                  <span className="text-gray-700 dark:text-gray300">
                    {" "}
                    {item.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HireSection;
