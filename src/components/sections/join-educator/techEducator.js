import React from "react";

const TechEducator = () => {
  const criteriaData = [
    {
      title: "Enthusiastic Educators",
      description: "with a strong passion for teaching and helping students succeed."
    },
    {
      title: "Subject Matter Experts",
      description: "who can teach a wide range of professional courses in specialized skills."
    },
    {
      title: "Committed to",
      description: "creating a positive and supportive learning environment worldwide."
    },
    {
      title: "Excellent Skills",
      description: "to engage and connect with students globally in Online Learning Environments."
    }
  ];

  return (
    <section className="py-10 w-full bg-white flex justify-center items-center ">
      <div className="lg:w-[80%] w-[92%] text-center">
        <div className="lg:px-30 px-2 ">
          <h2 className="text-[26px] leading-9 font-bold text-[#252525] ">
            Empower minds and ignite change by joining MEDH as an influential educator / instructor. Experience the freedom to innovate and teach with passion, while receiving rewarding compensation.
          </h2>
          <p className="mt-2 font-semibold text-base text-[#5C6574] lg:px-[16rem]">
            Become a part of MEDH's innovative learning community. We are looking for:
          </p>
        </div>

        <div className="mt-10 w-full flex flex-wrap justify-center gap-6">
          {criteriaData.map((item, index) => (
            <div
              key={index}
              className="w-full sm:w-[90%] md:w-[45%] lg:w-[23%] p-6 bg-white shadow-box-custom rounded-2xl border border-[#0000004D] mb-6 hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {item.title}
              </h3>
              <p className="text-gray-700">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechEducator;
