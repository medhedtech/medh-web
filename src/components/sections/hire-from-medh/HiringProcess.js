import Image from "next/image";
import HiringProcessImg from "../../../assets/images/hireformmedh/hiringprocessimg.jpeg";
import { Check } from "lucide-react";

const HiringProcess = () => {
  const steps = [
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
  ];

  return (
    <section className="bg-white dark:bg-gray-900 py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
          <div className="w-full md:w-1/2 space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-[#7ECA9D]">
                Process for hiring IT professionals
              </h2>
              <h2 className="text-3xl md:text-4xl font-bold text-[#5C6574] dark:text-white">
                through Recruit@Medh?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-4">
                Our hiring process is completely managed by our Support Team and a
                Dedicated Relationship Manager assigned for you and typically
                involves the following steps:
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className="flex items-start space-x-4 group hover:transform hover:translate-x-2 transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#7ECA9D] flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-[#5C6574] dark:text-white group-hover:text-[#7ECA9D] transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Section */}
          <div className="w-full md:w-[45%]">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#7ECA9D]/20 via-[#7ECA9D]/10 to-transparent"></div>
              <Image
                src={HiringProcessImg}
                alt="Hiring process"
                className="w-full h-auto object-cover rounded-2xl transform hover:scale-105 transition-duration-500"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HiringProcess;
