import Image from "next/image";
import HiringProcessImg from "../../../assets/images/hireformmedh/hiringprocessimg.jpeg";

const HiringProcess = () => {
  return (
    <section className="w-full flex justify-center items-center bg-white py-10 sm:py-20">
      <div className="w-[90%] sm:w-[85%] h-auto flex flex-col md:flex-row items-start md:items-center space-y-8 md:space-y-0 md:space-x-8 lg:space-x-16">
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#5F2DED] leading-snug">
            Process for hiring IT professionals <br />
            through 
          </h2>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#263238]">
            Recruit@Medh?
          </h2>
          <p className="text-base sm:text-lg mt-4 text-gray-600">
            Our hiring process is completely managed by our Support Team and a
            Dedicated Relationship Manager assigned for you and typically
            involves the following steps:
          </p>

          <ul className="mt-6 space-y-4">
            {[
              {
                title: "Company Registration",
                description:
                  "Companies interested in hiring through our placement cell need to register with us and provide details about their organization and job openings.",
              },
              {
                title: "Job Description",
                description:
                  "After registration, companies can share their job descriptions and requirements with us.",
              },
              {
                title: "Candidate Shortlisting",
                description:
                  "We shortlist candidates from our pool who match the job requirements.",
              },
              {
                title: "Pre-screening",
                description:
                  "The shortlisted candidates may go through technical tests, interviews, and other evaluations.",
              },
              {
                title: "Final Selection",
                description:
                  "Based on the results of the pre-screening process, companies can select candidates for further interviews or make job offers.",
              },
            ].map((step, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="mt-[-5px] bg-[#5F2DED] rounded-full text-white p-[2px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-check"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{step.title}</p>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full md:w-1/2 overflow-hidden">
          <Image
            src={HiringProcessImg}
            alt="Hiring process"
            className="w-full h-auto rounded-tl-[40px] rounded-br-[40px] object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default HiringProcess;
