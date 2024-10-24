import React from "react";
import EducationalFeatureCard from "./educationalFeatureCard";

function AdvanceEducational() {
  return (
    <>
      <section className="py-10 bg-white dark:bg-screen-dark w-full flex justify-center items-center">
        <div className="w-[92%] lg:w-[75%]">
          <h2 className="text-3xl font-bold text-center text-[#252525] dark:text-white">
            Creating future-ready students through advanced educational
            approaches.
          </h2>
          <div className="mt-6 text-[#252525]  dark:text-gray300">
            <p className=" font-Open font-normal text-[15px] leading-7">
              Gone are the days when education was limited to the pages of a
              book and students memorised information solely to pass an
              examination. Educators are pushing the envelope and helping
              students possess skills that go beyond jobs and technology – and
              will last them a lifetime. Here are some of the reasons why
              skill-based learning has become imperative in schools/institutes:{" "}
            </p>
            <ul className=" ml-6 mt-4 font-Poppins font-medium leading-6 ">
              <li>Promotes independence</li>
              <li>Enhances creativity and encourages teamwork</li>
              <li>Develops students’ social skills</li>
              <li>Improves their communication skills</li>
              <li>Makes them fast learners</li>
              <li>Ways to prepare students for the workforce of the future.</li>
            </ul>
          </div>
        </div>
      </section>
      <EducationalFeatureCard />
    </>
  );
}

export default AdvanceEducational;
