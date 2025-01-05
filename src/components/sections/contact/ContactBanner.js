// import React from "react";
// import Image from "next/image";
// import cuate from "@/assets/images/icon/cuate.svg";
// import HreoName from "@/components/shared/section-names/HreoName";
// import HeadingLg from "@/components/shared/headings/HeadingLg";
// import stemImg from "@/assets/images/herobanner/Background.png";
// import Link from "next/link";

// const ContactBanner = () => {
//   return (
//     <section data-aos="fade-up" className="py-10 dark:bg-screen-dark">
//       {/* Banner section */}
//       <div className="container2-xl px-2 gap-10 sm:px-6 mt-5 lg:px-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Banner Left */}
//           <div data-aos="fade-up">
//             <HreoName>
//               {" "}
//               <span className="font-extrabold text-[#7ECA9D]">|</span>
//               EMPOWERMENT THROUGH ENGAGEMENT.
//             </HreoName>
//             <HeadingLg
//               color={"#7ECA9D"}
//               className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
//             >
//               Connect with Medh for
//               <br /> Personalized Support
//             </HeadingLg>
//             <div className="flex flex-col md:flex-row mt-6 mb-9 gap-8">
//               <div className="flex-shrink-0">
//                 {/* STEM Badge */}
//                 <Image
//                   src={stemImg}
//                   alt="STEM Accredited"
//                   width={90}
//                   height={150}
//                 />
//               </div>
//               <div className="flex flex-col justify-center">
//                 <p className="text-base sm:text-lg dark:text-white">
//                   With expert guidance, unlock a pathway to limitless learning
//                   opportunities and endless personal and professional growth.
//                 </p>
//                 {/* CTA Button */}
//                 <div className="flex flex-col sm:flex-row gap-4 mt-4">
//                   <Link
//                     href="/courses"
//                     className="bg-[#7ECA9D] text-white border border-[#7ECA9D] w-fit font-bold text-base px-4 py-2 inline-block"
//                   >
//                     Let&#39;s Connect
//                   </Link>
//                   <span className="mt-2 text-base font-semibold underline dark:text-white underline-offset-8">
//                     ISO CERTIFIED
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <span className="text-[#7ECA9D] mumkinMedh text-2xl sm:text-3xl font-medium">
//               Medh Hain Toh Mumkin Hain!
//             </span>
//           </div>
//           {/* Banner Right */}
//           <div data-aos="fade-up" className="lg:flex hidden justify-end ">
//             <Image
//               src={cuate}
//               width={650}
//               height={340}
//               alt="Group Image"
//               className="max-w-full h-auto"
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ContactBanner;

"use client";
import HeadingLg from "@/components/shared/headings/HeadingLg";
import HreoName from "@/components/shared/section-names/HreoName";
import Image from "next/image";
import React from "react";
import stemImg from "@/assets/images/herobanner/Background.png";
import family from "@/assets/Header-Images/Contact/contact.jpg";
import bgImage from "@/assets/Header-Images/Contact/Contact_Banner.jpg";
import "@/assets/css/ovalAnimation.css";

const ContactBanner = () => {
  return (
    <section
      data-aos="fade-up"
      className="relative bg-black bg-opacity-50 dark:bg-screen-dark"
    >
      {/* Background Image */}
      <div className="absolute hidden lg:block inset-0 -z-10">
        <Image
          src={bgImage}
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
      </div>

      {/* Banner section */}
      <div className="container2-xl hidden lg:block sm:px-4 lg:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div data-aos="fade-up" className="flex flex-col justify-center">
            {/* Hero Section Name */}
            <HreoName>
              <div className="flex items-center">
                <span className="font-black text-[#7ECA9D] text-lg sm:text-xl">
                  |
                </span>
                <p className="dark:text-white text-white px-2 text-sm sm:text-base">
                  EMPOWERMENT THROUGH ENGAGEMENT.
                </p>
              </div>
            </HreoName>

            {/* Heading */}
            <HeadingLg
              color={"#7ECA9D"}
              className="text-2xl sm:text-4xl lg:text-[40px] font-bold leading-tight mt-4"
            >
              Connect with Medh for Personalized Support
            </HeadingLg>

            {/* Content & CTA */}
            <div className="flex flex-col sm:flex-row items-start mt-6 gap-6">
              {/* STEM Badge */}
              <div className="flex-shrink-0">
                <Image
                  src={stemImg}
                  alt="STEM Accredited"
                  width={90}
                  height={150}
                  className="h-auto"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center sm:pl-4">
                <p className="text-lg font-Poppins font-light sm:text-xl text-white dark:text-gray-200 leading-relaxed">
                  With expert guidance, unlock a pathway <br />
                  to limitless learning opportunities and <br /> endless
                  personal and professional growth.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4 mt-4">
                  <a
                    href="#courses-section"
                    className="bg-[#7ECA9D] text-white border border-[#7ECA9D] font-bold text-sm sm:text-base px-4 py-2 hover:bg-[#66b588] transition duration-300"
                  >
                    Let&#39;s Connect
                  </a>
                  <a
                    href="#certified-section"
                    className="mt-4 text-white text-sm sm:text-base font-light underline underline-offset-4 transition duration-300"
                  >
                    ISO CERTIFIED
                  </a>
                </div>
              </div>
            </div>

            {/* Slogan */}
            <span className="text-[#7ECA9D] text-2xl sm:text-3xl mumkinMedh font-medium mt-8 block">
              Medh Hain Toh Mumkin Hain!
            </span>
          </div>

          {/* Banner Right */}
          <div className="lg:flex hidden relative w-full h-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[500px] h-[300px]">
                <div className="wavy-oval overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src={family}
                      alt="Family Image"
                      className="w-[540px] h-[400px] object-contain object-center relative z-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Image for Mobile */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={bgImage}
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
      </div>

      {/* Mobile View (Hidden on Desktop) */}
      <div className="lg:hidden bg-black text-white px-6 py-4 space-y-1">
        {/* Subheading */}
        <p className="text-[#FFFFFF] font-semibold text-center border-l-2 border-[#7eca9d] uppercase text-[0.8rem] tracking-wider">
          EMPOWERMENT THROUGH ENGAGEMENT.
        </p>

        {/* Heading */}
        <h1
          className="text-[#A1F1B5] text-[1.5rem] font-bold text-center leading-snug mt-[-8px]"
          style={{ color: "#7ECA9D" }}
        >
          Connect with Medh for Personalized Support
        </h1>

        {/* Oval Image */}
        <div className="w-full flex justify-center mt-6">
          <div className="relative w-[300px] h-[210px]">
            <div className="wavy-oval overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={family}
                  alt="Family Image"
                  className="object-contain object-center"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ISO Certification Section */}
        <div className="flex mt-6">
          <div className="flex sm:flex-col items-start">
            <div className="w-[14rem] h-[100px] mr-4">
              <Image
                src={stemImg}
                alt="ISO Certification"
                width={150}
                height={100}
                className="object-contain"
              />
            </div>

            {/* Description Section */}
            <div className="flex-col">
              <p
                className="text-[.88rem] text-left font-Poppins leading-normal"
                style={{ color: "#EAEAEA" }}
              >
                With expert guidance, unlock a pathway to limitless learning
                opportunities and endless personal and professional growth.
              </p>

              {/* ISO Text */}
              <p
                className="inline text-[0.9rem] text-left border-b-2 border-[#7eca9d] mt-4"
                style={{ color: "#EAEAEA" }}
              >
                ISO CERTIFIED
              </p>

              {/* Button Section */}
              <div className="flex justify-start mt-2">
                <a
                  href="#courses-section"
                  className="bg-[#7ECA9D] text-white font-bold text-sm sm:text-base px-4 py-2 hover:bg-[#66b588] transition duration-300"
                >
                  Let&#39;s Connect
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Slogan */}
        <p
          // className="text-[#7ECA9D] text-[2.5rem] font-Bulgathi font-normal text-center mt-[5px]"
          className="text-[#7ECA9D] w-full text-[2.4rem] font-Bulgathi font-normal text-center mt-[5px]"
          style={{ color: "#7ECA9D" }}
        >
          Medh Hain Toh Mumkin Hain!
        </p>
      </div>
    </section>
  );
};

export default ContactBanner;
