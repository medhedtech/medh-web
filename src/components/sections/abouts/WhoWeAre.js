import Image from "next/image";
import React from "react";
import Explain from "@/assets/images/about/explain.png";

const WhoWeAre = () => {
  return (
    <div className="bg-[#F3F6FB] px-4 md:px-16 lg:px-40 my-16 flex gap-8 flex-col lg:flex-row py-16">
      <div className="w-full lg:w-1/2 flex justify-center">
        <Image
          src={Explain}
          width={465}
          height={671}
          alt="Explain"
          className="max-w-full h-auto"
        />
      </div>
      <div className="w-full lg:w-1/2 my-auto flex flex-col gap-8">
        <div>
          <h1 className="text-[#5C6574] font-semibold text-xl md:text-2xl pb-3">
            Who We Are?
          </h1>
          <p className="text-[#727695] text-base text-left">
            We are a dedicated team of technologists, entrepreneurs and
            visionaries who believe that education through technology is the key
            to shaping a brighter future. Our diverse and talented team brings
            together expertise from various domains to create a dynamic learning
            ecosystem that caters to learners of all ages and backgrounds.
          </p>
        </div>
        <div>
          <h1 className="text-[#5C6574] font-semibold text-xl md:text-2xl pb-3">
            Our Commitment to Quality
          </h1>
          <p className="text-[#727695] text-base text-left">
            Quality is at the core of everything we do. We are committed to
            delivering content that is precise, current, and aligned with the
            evolving trends and needs of the educational landscape. Our team of
            subject matter experts ensure that the learning materials are
            engaging, effective, and aligned with the latest industry standards.
          </p>
        </div>
        <div>
          <h1 className="text-[#5C6574] font-semibold text-xl md:text-2xl pb-3">
            Empowering Lifelong Learning
          </h1>
          <p className="text-[#727695] text-base text-left">
            At Medh, we believe that learning should not be limited to a
            specific stage of life. We are dedicated to nurturing a culture of
            lifelong learning, enabling individuals to continuously upskill and
            reskill to adapt to the ever-evolving demands of the modern world.
            Whether you are a student, a professional, a homemaker or someone
            eager to pursue your passions, our platform offers a diverse range
            of courses tailored to help you achieve your aspirations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhoWeAre;
