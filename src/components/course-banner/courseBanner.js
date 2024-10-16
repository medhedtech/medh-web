import React from "react";
import Image from "next/image";

const CourseBanner = ({
  heading,
  headings,
  description,
  actionText,
  buttonText,
  imageUrl,
  onButtonClick,
}) => {
  return (
    <div className="bg-white w-full h-auto flex justify-center items-center">
      <div className="bg-pink-100 w-full lg:w-[80%]  pt-4 px-6 max-lg:pb-4 max-lg:mx-4 rounded-[25px] flex justify-between items-center flex-col lg:flex-row my-8 max-lg:text-center">
        <div className="w-40 h-40">
          <Image
            src={imageUrl}
            width={140}
            height={140}
            className="object-cover"
          />
        </div>
        <div className="w-full lg:w-[50%] space-y-2 ">
          <h2 className="text-2xl font-bold text-gray-800">{heading}</h2>
          <h2 className="text-2xl font-bold text-gray-800">{headings}</h2>
          <p className="text-gray-700 text-[0.9rem]">{description}</p>
          <p className="text-[#F2277E] font-bold text-lg">{actionText}</p>
        </div>
        <div>
          <button
            onClick={onButtonClick}
            className="bg-[#5F2DED] hover:bg-[#3f2885] text-white px-6 py-2 rounded-lg shadow-lg font-semibold mt-4 lg:mt-0"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseBanner;
