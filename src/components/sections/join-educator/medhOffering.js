import React from "react";
import Image from "next/image";
import Girl from "@/assets/images/join-educator/baby-girl.svg";

const offerings = [
  {
    title: "Impact lives",
    description: "Inspire and empower students to reach their full potential.",
  },
  {
    title: "Flexibility",
    description:
      "Work from the comfort of your own home and set your own schedule.",
  },
  {
    title: "Cutting-edge technology",
    description:
      "Utilize our advanced online teaching platform for an immersive and interactive teaching experience.",
  },
  {
    title: "Professional growth",
    description:
      "Access to ongoing training and development opportunities to enhance your teaching skills.",
  },
  {
    title: "Competitive compensation",
    description: "Be rewarded for your expertise and dedication to education.",
  },
];

const Offerings = () => {
  return (
    <section className="w-full bg-[#FFE5F0] flex justify-center dark:bg-inherit items-center">
      <div className="w-[90%] lg:w-[80%] flex flex-wrap justify-between  ">
        <div className="text-left lg:w-[54%] w-full py-12  text-[#5C6574]  ">
          <h2 className="text-3xl font-bold  mb-6 font-sans dark:text-white">
            Medh Offerings
          </h2>
          <ul className="text-gray-700  space-y-2">
            {offerings.map((offering, index) => (
              <li
                key={index}
                className="flex flex-col sm:flex-row gap-x-2  sm:gap-4"
              >
                <strong className="font-bold lg:text-lg text-base dark:text-white">
                  {offering.title}:{" "}
                  <span className="font-normal px-1 dark:text-gray-300">
                    {offering.description}
                  </span>
                </strong>
              </li>
            ))}
          </ul>
        </div>
        {/* right  */}
        <div className="lg:w-[42%] w-full flx justify-center">
          <Image src={Girl} className="w-full h-[435px]" />
        </div>
      </div>
    </section>
  );
};

export default Offerings;
