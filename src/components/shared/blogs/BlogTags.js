import Link from "next/link";
import React from "react";

const BlogTags = () => {
  const tags = [
    { title: "Abacus" },
    { title: "AI" },
    { title: "Artificial Intelligence" },
    { title: "Aryabhatta" },
    { title: "Business Analytics" },
    { title: "Career Development" },
    { title: "C Language" },
    { title: "Cloud Computing" },
    { title: "Communication Skills" },
    { title: "Corporate Training" },
    { title: "Data Visualization" },
    { title: "Diet" },
    { title: "Finance" },
    { title: "Financial Accounting" },
    { title: "Health" },
    { title: "Languages" },
    { title: "Leadership" },
    { title: "Mathematics" },
    { title: "Medh" },
    { title: "Mental Health" },
    { title: "Online Courses" },
    { title: "Personality Development" },
    { title: "Programming Language" },
    { title: "Programming Languages" },
    { title: "Python" },
    { title: "Skill Development" },
    { title: "Soft Skills" },
    { title: "Technical Skills" },
    { title: "Upskill" },
    { title: "Vedic Mathematics" },
    { title: "Vedic Maths" },
    { title: "Vedic Maths Formulas" },
    { title: "Vedic Maths Tricks" },
    { title: "Wellness" },
    { title: "Yoga" }
];


  return (
    <div
      className="p-5 md:p-30px lg:p-5 2xl:p-30px mb-30px border border-borderColor2 dark:border-gray-600"
      data-aos="fade-up"
    >
      <h4 className="text-size-22 text-blackColor dark:text-blackColor-dark font-bold pl-2 before:w-0.5 relative before:h-[21px] before:bg-[#F2277E] before:absolute before:bottom-[5px] before:left-0 leading-30px mb-25px">
        Tags
      </h4>
      <ul className="flex flex-wrap gap-x-3px">
        {tags.map(({ title }, idx) => (
          <li key={idx}>
            <Link
              href={`/courses?category=${title.toLowerCase()}`} // Using title in the URL, converted to lowercase
              className="m-5px px-19px py-3px text-[#252525] text-[13px] font-semibold font-Poppins border border-borderColor2 hover:text-whiteColor hover:bg-[#F2277E] hover:border-[#F2277E] leading-30px dark:text-gray-200 dark:border-gray-400 dark:hover:text-whiteColor dark:hover:bg-[#F2277E] dark:hover:border-[#F2277E]"
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogTags;
