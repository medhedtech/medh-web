import React from 'react';
import Image from 'next/image';

const CourseBanner = ({
  heading,
  headings,
  description,
  actionText,
  buttonText,
  imageUrl,
  onButtonClick,
  buttonBgColor = '#5F2DED',
  icon = null,
}) => {
  return (
    <div className="bg-white dark:bg-[#050622] w-full h-auto flex justify-center items-center">
      <div className="bg-pink-100 w-full lg:w-[80%] pt-4 px-10 max-lg:pb-4 max-lg:mx-4 rounded-[25px] flex justify-between items-center flex-col lg:flex-row my-8 max-lg:text-center">
        <div className="w-40 ">
          <Image
            src={imageUrl}
            width={140}
            height={140}
            className="object-cover"
          />
        </div>
        <div className="w-full lg:w-[50%] space-y-2 ">
          <h2 className="text-[24px] leading-7 font-bold text-[#5C6574]">
            {heading}
          </h2>
          <h2 className="text-2xl font-bold text-[#5C6574]">{headings}</h2>
          <p className="text-[#585454] text-[0.9rem]">{description}</p>
          <p className="text-[#F2277E] font-bold text-lg">{actionText}</p>
        </div>
        <div>
          <button
            onClick={onButtonClick}
            style={{ backgroundColor: buttonBgColor }} // Set dynamic background color
            className="hover:bg-[#3f2885] text-white px-6 py-3 shadow-lg font-semibold mt-4 lg:mt-0 flex items-center justify-center gap-2"
          >
            {icon && <Image src={icon} alt="button-icon" className="mr-2" />}{' '}
            {/* Display icon if passed */}
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseBanner;
