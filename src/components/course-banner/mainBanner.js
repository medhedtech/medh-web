import React from "react";
import Image from "next/image";

export default function MainBanner({
  bannerImage,
  logoImage,
  isoImage,
  heading,
  subheading,
  description,
  buttonText,
  isoText,
  slogan,
  buttonImage,
  headingColor,
  descriptionColor,
  isoTextColor,
  subheadingColor,
}) {
  return (
    <div className="bg-black h-full text-white w-full relative flex justify-center  border-black py-10 md:py-0">
      {/* Banner Image (hidden on small screens) */}
      <div className="relative w-full h-[350px] md:h-[500px] hidden lg:block">
        <Image
          src={bannerImage} // Dynamic banner image
          alt="Banner Image"
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
      </div>
      {/* <div className="absolute w-full inset-0 bg-black opacity-30 z-10" /> */}

      <div className="w-[90%] h-full flex items-center justify-between bg-black lg:bg-transparent lg:absolute lg:top-0 lg:bottom-0">
        <div className="w-full lg:w-[45%] ml-0 md:ml-12 ">
          <p
            className="border-l-4 md:text-[15px] font-Open text-[12px] border-primaryColor font-bold mb-4 md:pl-2 pl-0"
            style={{ color: subheadingColor }}
          >
            {subheading} {/* Dynamic subheading */}
          </p>
          <h1
            className="text-2xl md:text-4xl font-bold font-Poppins  mb-6"
            style={{ color: headingColor }}
          >
            {heading}
          </h1>

          <div className="flex justify-between w-full">
            <div className="flex-shrink-0 bg-gray-300">
              {/* ISO or Certification Badge */}
              <Image
                src={isoImage}
                alt="ISO Certification"
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
            <div className="md:ml-10 ml-5">
              <p
                className="md:text-[1.2rem] sm:text-[1.3rem] text-[0.9rem] lg:text-[1.1rem] tracking-wider"
                style={{ color: descriptionColor }}
              >
                {description} {/* Dynamic description */}
              </p>
              <div className="flex">
                <button className="flex items-center bg-white md:text-[15px] text-[10px] text-primaryColor font-bold px-2 py-1 md:px-4 md:py-2 mt-6">
                  <Image
                    src={buttonImage} // Dynamic button image
                    alt="Button Icon"
                    className="md:w-[28px] w-[18px] lg:h-[28px] h-[20px] lg:mr-4 mr-2"
                  />
                  {buttonText}
                </button>
                <p
                  className="border-b-2 border-gray-500 mt-10 ml-3 text-[12px] md:text-[15px]"
                  style={{ color: isoTextColor }}
                >
                  {isoText}
                </p>
              </div>
            </div>
          </div>
          <p className="mt-6 text-[20px] lg:text-[29px] font-semibold text-[#F6B335]">
            {slogan}
          </p>
        </div>

        {/* Right side image (hidden on small screens) */}
        <div className="hidden lg:block md:w-[45%]">
          <Image
            src={logoImage} // Dynamic right-side image
            alt="Logo Image"
            objectFit="cover"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
