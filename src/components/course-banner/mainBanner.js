// "use client";
// import React, { useRef } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import "@/assets/css/ovalAnimation.css";

// export default function MainBanner({
//   bannerImage,
//   logoImage,
//   isoImage,
//   heading,
//   subheading,
//   description,
//   buttonText,
//   isoText,
//   slogan,
//   buttonImage,
//   headingColor,
//   descriptionColor,
//   isoTextColor,
//   subheadingColor,
// }) {
//   const sectionRef = useRef(null);
//   const handleScrollToSection = () => {
//     if (sectionRef.current) {
//       sectionRef.current.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     }
//   };

//   const condition = true;
//   return (
//     <div className="bg-black h-full text-white w-full relative flex justify-center  border-black py-10 md:py-0">
//       {/* Banner Image (hidden on small screens) */}
//       <div className="relative w-full h-[350px] md:h-[500px] hidden lg:block">
//         <Image
//           src={bannerImage}
//           alt="Banner Image"
//           layout="fill"
//           objectFit="cover"
//           className="w-full h-full"
//         />
//       </div>
//       {/* <div className="absolute w-full inset-0 bg-black opacity-30 z-10" /> */}

//       <div className="w-[90%] h-full flex items-center justify-between bg-black lg:bg-transparent lg:absolute lg:top-0 lg:bottom-0">
//         <div className="w-full lg:w-[45%] ml-0 md:ml-12 ">
//           <p
//             className="border-l-4 md:text-[15px] font-Open text-[12px] border-primaryColor font-bold mb-4 md:pl-2 pl-0"
//             style={{ color: subheadingColor }}
//           >
//             {subheading} {/* Dynamic subheading */}
//           </p>
//           <h1
//             className="text-2xl md:text-4xl font-bold font-Poppins mb-6 tracking-wide"
//             style={{ color: headingColor }}
//           >
//             {heading}
//           </h1>

//           <div className="flex justify-between w-full mb-4 sm:mb-12">
//             <div className="flex-shrink-0 bg-gray-300">
//               {/* ISO or Certification Badge */}
//               <Image
//                 src={isoImage}
//                 alt="ISO Certification"
//                 width={100}
//                 height={100}
//                 className="object-contain"
//               />
//             </div>
//             <div className="md:ml-10 ml-5">
//               <p
//                 className="md:text-[1.2rem] w-full sm:w-[90%] sm:text-[1.3rem] text-[0.9rem] lg:text-[1.1rem] tracking-wider"
//                 style={{ color: descriptionColor }}
//               >
//                 {description} {/* Dynamic description */}
//               </p>
//               <div className="flex">
//                 <Link href="#enroll-section" passHref>
//                   <button
//                     onClick={handleScrollToSection}
//                     className="flex items-center bg-white md:text-[15px] text-[10px] text-primaryColor font-bold px-2 py-1 md:px-4 md:py-2 mt-6"
//                   >
//                     <Image
//                       src={buttonImage} // Dynamic button image
//                       alt="Button Icon"
//                       className="md:w-[28px] w-[18px] lg:h-[28px] h-[20px] lg:mr-4 mr-2"
//                     />
//                     {buttonText}
//                   </button>
//                 </Link>
//                 <Link
//                   href={
//                     condition ? "#courses-section" : "/about#certified-section"
//                   }
//                   passHref
//                 >
//                   <p
//                     className="border-b-2 border-gray-500 mt-10 ml-3 text-[12px] md:text-[15px]"
//                     style={{ color: isoTextColor }}
//                   >
//                     {isoText}
//                   </p>
//                 </Link>
//               </div>
//             </div>
//           </div>
//           <p className="mt-6 text-[24px] mumkinMedh font-Bulgathi lg:text-[35px] text-[#7ECA9D]">
//             {slogan}
//           </p>
//         </div>

//         {/* Right side image (hidden on small screens) */}
//         {/* <div className="hidden lg:block md:w-[45%] rounded-[50%]">
//           <Image
//             src={logoImage}
//             alt="Logo Image"
//             objectFit="cover"
//             className="w-full rounded-[50%]"
//           />
//         </div> */}
//         {/* Banner Right */}
//           <div className="inset-0 flex items-center justify-center">
//             <div className="relative w-[500px] h-[300px]">
//               <div className="wavy-oval overflow-hidden">
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <Image
//                     src={logoImage}
//                     alt="Family Image"
//                     className="w-[540px] h-[400px] object-contain object-center relative z-10"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//       </div>
//     </div>
//   );
// }

// "use client";
// import React, { useRef } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import "@/assets/css/ovalAnimation.css";

// export default function MainBanner({
//   bannerImage,
//   logoImage,
//   isoImage,
//   heading,
//   subheading,
//   description,
//   buttonText,
//   isoText,
//   slogan,
//   buttonImage,
//   headingColor,
//   descriptionColor,
//   isoTextColor,
//   subheadingColor,
// }) {
//   const sectionRef = useRef(null);
//   const handleScrollToSection = () => {
//     if (sectionRef.current) {
//       sectionRef.current.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     }
//   };

//   const condition = true;
//   return (
//     <div className="bg-black h-full text-white w-full relative flex flex-col lg:flex-row justify-center border-black py-10 md:py-0">
//       {/* Banner Image (hidden on small screens) */}
//       <div className="relative w-full h-[350px] md:h-[500px] hidden lg:block">
//         <Image
//           src={bannerImage}
//           alt="Banner Image"
//           layout="fill"
//           objectFit="cover"
//           className="w-full h-full"
//         />
//       </div>

//       <div className="w-[90%] h-full flex flex-col lg:flex-row items-center lg:items-center justify-between bg-black lg:bg-transparent lg:absolute lg:top-0 lg:bottom-0">
//         {/* Left Content */}
//         <div className="w-full lg:w-[45%] ml-0 md:ml-12 text-center lg:text-left">
//           <p
//             // className="border-l-4 text-[12px] md:text-[15px] font-Open font-bold mb-4 md:pl-2 pl-0"
//             className="border-l-4 dark:text-white text-white font-Open font-bold px-2 text-sm sm:text-base mb-2"
//             style={{ color: subheadingColor }}
//           >
//             {subheading}
//           </p>
//           <h1
//             // className="text-2xl text-[#7ECA9D] sm:text-4xl lg:text-[40px] font-bold leading-tight mt-4 "
//             className="text-[#7ECA9D] text-[2.9rem] font-bold leading-tight tracking-normal w-full mb-4"
//             style={{ color: headingColor }}
//           >
//             {heading}
//           </h1>

//           <div className="flex flex-col sm:flex-row sm:items-start justify-center lg:justify-start w-full gap-4 mb-4 sm:mb-12">
//             {/* ISO Badge */}
//             <div className="flex-shrink-0 bg-gray-300 self-center sm:self-auto">
//               <Image
//                 src={isoImage}
//                 alt="ISO Certification"
//                 width={100}
//                 height={100}
//                 className="object-contain"
//               />
//             </div>
//             <div className="sm:ml-4">
//               <p
//                 className="text-[0.9rem] sm:text-[1.2rem] md:text-[1.3rem] lg:text-[1.1rem] tracking-wider"
//                 style={{ color: descriptionColor }}
//               >
//                 {description}
//               </p>
//               <div className="flex flex-col sm:flex-row items-center lg:items-start mt-6 gap-4">
//                 <Link href="#enroll-section" passHref>
//                   <button
//                     onClick={handleScrollToSection}
//                     className="flex items-center bg-white text-[10px] md:text-[15px] text-primaryColor font-bold px-2 py-1 md:px-4 md:py-2"
//                   >
//                     <Image
//                       src={buttonImage}
//                       alt="Button Icon"
//                       className="w-[18px] md:w-[28px] h-[20px] md:h-[28px] mr-2"
//                     />
//                     {buttonText}
//                   </button>
//                 </Link>
//                 <Link
//                   href={
//                     condition ? "#courses-section" : "/about#certified-section"
//                   }
//                   passHref
//                 >
//                   <p
//                     className="border-b-2 border-gray-500 text-[12px] md:text-[15px]"
//                     style={{ color: isoTextColor }}
//                   >
//                     {isoText}
//                   </p>
//                 </Link>
//               </div>
//             </div>
//           </div>
//           <p className="mt-[-2rem] text-[2.4rem] lg:text-[3rem] font-Bulgathi text-[#7ECA9D]">
//             {slogan}
//           </p>
//         </div>

//         {/* Right Content */}
//         <div className="w-full lg:w-[45%] flex justify-center lg:justify-end mt-8 lg:mt-0">
//           <div className="relative w-[280px] sm:w-[350px] lg:w-[500px] h-[250px] sm:h-[300px] lg:h-[300px]">
//             <div className="wavy-oval overflow-hidden">
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <Image
//                   src={logoImage}
//                   alt="Family Image"
//                   className="object-contain object-center"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";
// import React, { useRef } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import "@/assets/css/ovalAnimation.css";

// export default function MainBanner({
//   bannerImage,
//   logoImage,
//   isoImage,
//   heading,
//   subheading,
//   description,
//   buttonText,
//   isoText,
//   slogan,
//   buttonImage,
//   headingColor,
//   descriptionColor,
//   isoTextColor,
//   subheadingColor,
// }) {
//   const sectionRef = useRef(null);
//   const handleScrollToSection = () => {
//     if (sectionRef.current) {
//       sectionRef.current.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     }
//   };

//   const condition = true;

//   return (
//     <div className="bg-black h-full text-white w-full relative flex flex-col lg:flex-row justify-center border-black py-10 md:py-0">
//       {/* Banner Image (hidden on small screens) */}
//       <div className="relative w-full h-[350px] md:h-[500px] hidden lg:block">
//         <Image
//           src={bannerImage}
//           alt="Banner Image"
//           layout="fill"
//           objectFit="cover"
//           className="w-full h-full"
//         />
//       </div>

//       <div className="w-[100%] px-4 sm:px-0 sm:w-[90%] h-full flex flex-col lg:flex-row items-center justify-between bg-black lg:bg-transparent lg:absolute lg:top-0 lg:bottom-0">
//         {/* Left Content */}
//         <div className="w-full lg:w-[45%] ml-0 md:ml-12 text-center lg:text-left">
//           <p
//             className="border-l-4 dark:text-white text-white font-Open font-bold px-2 text-[.8rem] sm:text-base mb-2"
//             style={{ color: subheadingColor }}
//           >
//             {subheading}
//           </p>
//           <h1
//             className="text-[#7ECA9D] text-[1.5rem] md:text-[2.9rem] font-bold leading-tight tracking-normal w-full mb-4"
//             style={{ color: headingColor }}
//           >
//             {heading}
//           </h1>

//           <div className="flex sm:flex-col sm:flex-row sm:items-start justify-center lg:justify-start w-full gap-4 mb-4 sm:mb-12">
//             {/* ISO Badge */}
//             <div className="flex-shrink-0 bg-gray-300 self-center sm:self-auto">
//               <Image
//                 src={isoImage}
//                 alt="ISO Certification"
//                 width={92}
//                 height={92}
//                 className="object-contain"
//               />
//             </div>
//             <div className="sm:ml-4 flex-col text-left">
//               <p
//                 className="text-[.8rem] sm:text-[1rem] md:text-[1.1rem] lg:text-[1.1rem] tracking-wider"
//                 style={{ color: descriptionColor }}
//               >
//                 {description}
//               </p>
//               <div className="flex flex-col sm:flex-row items-start lg:items-start mt-4 gap-4">
//                 <Link href="#enroll-section" passHref>
//                   <button
//                     onClick={handleScrollToSection}
//                     className="flex items-center bg-white text-[10px] md:text-[12px] lg:text-[15px] text-primaryColor font-bold px-2 py-1 md:px-4 md:py-2"
//                   >
//                     <Image
//                       src={buttonImage}
//                       alt="Button Icon"
//                       className="w-[15px] md:w-[20px] h-[15px] md:h-[20px] mr-2"
//                     />
//                     {buttonText}
//                   </button>
//                 </Link>
//                 <Link
//                   href={
//                     condition ? "#courses-section" : "/about#certified-section"
//                   }
//                   passHref
//                 >
//                   <p
//                     className="border-b-2 border-white mt-0 sm:mt-4 text-end text-[10px] md:text-[12px] lg:text-[15px]"
//                     style={{ color: isoTextColor }}
//                   >
//                     {isoText}
//                   </p>
//                 </Link>
//               </div>
//             </div>
//           </div>
//           <p className="mt-0 sm:mt-[-1.5rem] sm text-[2rem] md:text-[2.4rem] lg:text-[3rem] font-Bulgathi text-[#7ECA9D]">
//             {slogan}
//           </p>
//         </div>

//         {/* Right Content */}
//         <div className="w-full lg:w-[45%] flex justify-center lg:justify-end mt-8 lg:mt-0">
//           {/* <div className="relative w-[220px] sm:w-[350px] lg:w-[500] h-[180px] sm:h-[250px] lg:h-[300px]"> */}
//           <div className="relative w-[280px] sm:w-[350px] lg:w-[500px] h-[250px] sm:h-[300px] lg:h-[300px]">
//             <div className="wavy-oval overflow-hidden">
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <Image
//                   src={logoImage}
//                   alt="Family Image"
//                   className="object-contain object-center"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import "@/assets/css/ovalAnimation.css";

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
  const sectionRef = useRef(null);

  const handleScrollToSection = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const condition = true;

  return (
    <div>
      {/* Web View (Hidden on Mobile) */}
      <div className="hidden lg:flex bg-black h-full text-white w-full relative flex-col lg:flex-row justify-center border-black py-10 md:py-0">
        <div className="relative w-full h-[350px] md:h-[500px] hidden lg:block">
          <Image
            src={bannerImage}
            alt="Banner Image"
            layout="fill"
            objectFit="cover"
            className="w-full h-full"
          />
        </div>

        <div className="w-[100%] px-4 sm:px-0 sm:w-[90%] h-full flex flex-col lg:flex-row items-center justify-between bg-black lg:bg-transparent lg:absolute lg:top-0 lg:bottom-0">
          {/* Web Content (Left Side) */}
          <div className="w-full lg:w-[45%] ml-0 md:ml-12 text-center lg:text-left">
            <p
              className="border-l-4 dark:text-white text-white font-Open font-bold px-2 text-[.8rem] sm:text-base mb-2"
              style={{ color: subheadingColor }}
            >
              {subheading}
            </p>
            <h1
              className="text-[#7ECA9D] text-[2rem] md:text-[2.9rem] font-bold leading-tight tracking-normal w-full mb-4"
              style={{ color: headingColor }}
            >
              {heading}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-start justify-center lg:justify-start w-full gap-4 mb-4 sm:mb-12">
              <div className="flex-shrink-0 bg-gray-300 self-center sm:self-auto">
                <Image
                  src={isoImage}
                  alt="ISO Certification"
                  width={92}
                  height={92}
                  className="object-contain"
                />
              </div>
              <div className="sm:ml-4">
                <p
                  className="text-[1rem] sm:text-[1rem] md:text-[1.1rem] lg:text-[1.1rem] tracking-wider"
                  style={{ color: descriptionColor }}
                >
                  {description}
                </p>
                <div className="flex flex-col sm:flex-row items-center lg:items-start mt-4 gap-4">
                  <Link href="#enroll-section" passHref>
                    <button
                      onClick={handleScrollToSection}
                      className="flex items-center bg-white text-[10px] md:text-[12px] lg:text-[15px] text-primaryColor font-bold px-2 py-1 md:px-4 md:py-2"
                    >
                      <Image
                        src={buttonImage}
                        alt="Button Icon"
                        className="w-[15px] md:w-[20px] h-[15px] md:h-[20px] mr-2"
                      />
                      {buttonText}
                    </button>
                  </Link>
                  <Link
                    href={
                      condition
                        ? "#courses-section"
                        : "/about#certified-section"
                    }
                    passHref
                  >
                    <p
                      className="border-b-2 border-white mt-0 sm:mt-4 text-end text-[10px] md:text-[12px] lg:text-[15px]"
                      style={{ color: isoTextColor }}
                    >
                      {isoText}
                    </p>
                  </Link>
                </div>
              </div>
            </div>
            <p className="mt-0 sm:mt-[-1.5rem] sm text-[2rem] md:text-[2.4rem] lg:text-[3rem] font-Bulgathi text-[#7ECA9D]">
              {slogan}
            </p>
          </div>

          {/* Web Content (Right Side) */}
          <div className="w-full lg:w-[45%] flex justify-center lg:justify-end mt-8 lg:mt-0">
            <div className="relative w-[280px] sm:w-[350px] lg:w-[500px] h-[250px] sm:h-[300px] lg:h-[300px]">
              <div className="wavy-oval overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src={logoImage}
                    alt="Family Image"
                    className="object-contain object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile View (Hidden on Web) */}
      <div className="lg:hidden bg-black text-white px-6 py-4 space-y-1">
        {/* Subheading */}
        <p
          className="text-[#FFFFFF] font-semibold text-center border-l-2 border-[#7eca9d] uppercase text-[0.8rem] tracking-wider"
          style={{ color: subheadingColor }}
        >
          {subheading}
        </p>

        {/* Heading */}
        <h1
          className="text-[#A1F1B5] text-[1.5rem] font-bold text-center leading-snug mt-[-8px]"
          style={{ color: headingColor }}
        >
          {heading}
        </h1>

        {/* Oval Image */}
        <div className="w-full flex justify-center">
          <div className="relative w-[300px] h-[210px]">
            <div className="wavy-oval overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={logoImage}
                  alt="Family Image"
                  className="object-contain object-center"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ISO Certification Section */}
        <div className="flex">
          <div className="flex sm:flex-col items-start">
            <div className="w-[12rem] h-auto mr-4">
              <Image
                src={isoImage}
                alt="ISO Certification"
                width={150}
                height={100}
                className="object-contain"
              />
            </div>

            {/* Description Section */}
            <div className="flex-col w-[100%] ">
              <p
                className="text-[.95rem] text-left font-Poppins leading-normal"
                style={{ color: descriptionColor }}
              >
                {description}
              </p>
              <div className="flex-col items-start justify-start mt-[5px]">
                <p
                  className="inline text-[0.9rem] text-left border-b-2 border-[#7eca9d]"
                  style={{ color: isoTextColor }}
                >
                  {isoText}
                </p>

                {/* Button Section */}
                <div className="flex justify-start mt-[5px]">
                  <button
                    onClick={handleScrollToSection}
                    className="bg-[#7ECA9D] text-white font-bold text-sm sm:text-base px-4 py-2 hover:bg-[#66b588] transition duration-300"
                  >
                    {buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slogan */}
        <p
          className="text-[#A1F1B5] text-[2.5rem] font-Bulgathi font-normal text-center mt-[5px]"
          style={{ color: headingColor }}
        >
          {slogan}
        </p>
      </div>
    </div>
  );
}
