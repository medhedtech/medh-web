import React from "react";
import Image from "next/image";
import Link from "next/link";

const CourseBanner = ({
  heading,
  headings,
  description,
  actionText,
  buttonText,
  imageUrl,
  // onButtonClick,
  buttonBgColor = "#7ECA9D",
  icon = null,
}) => {
  return (
    <div className="bg-white dark:bg-screen-dark w-full h-auto flex justify-center items-center">
      <div
        className="bg-[#4EB67870] w-full lg:w-[80%] pt-4 px-10 max-lg:pb-4 max-lg:mx-4 rounded-[2.5rem] flex justify-between items-center flex-col lg:flex-row my-8 max-lg:text-center"
        style={{ boxShadow: "0px 0px 10px 0px #59AA7980" }}
      >
        <div className="w-40 ">
          <Image
            src={imageUrl}
            width={140}
            height={140}
            className="object-cover"
          />
        </div>
        <div className="w-full lg:w-[60%] space-y-2 ">
          <h2 className="text-3xl leading-7 font-semibold text-[#5C6574]">
            {heading}
          </h2>
          <h2 className="text-3xl font-semibold text-[#5C6574]">{headings}</h2>
          <p className="text-[#585454] text-[0.9rem] font-light md:text-base sm:text-sm">
            {description}
          </p>
          <p className="text-[#FCA400] font-bold text-lg">{actionText}</p>
        </div>
        <div>
          <Link href="#enroll-section">
            <button
              // onClick={onButtonClick}
              style={{ backgroundColor: buttonBgColor }} // Set dynamic background color
              className="hover:bg-[#3f2885] text-white px-6 py-3 shadow-lg font-semibold mt-4 lg:mt-0 flex items-center justify-center gap-2"
            >
              {icon && <Image src={icon} alt="button-icon" className="mr-2" />}{" "}
              {/* Display icon if passed */}
              {buttonText}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseBanner;
