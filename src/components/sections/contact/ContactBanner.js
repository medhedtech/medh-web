import React from "react";
import Image from "next/image";
import MainBanner from "@/components/course-banner/mainBanner"; // Import your MainBanner component
import Banner from "@/assets/images/hireformmedh/background.png";
import cuate from "@/assets/images/icon/cuate.svg";
import Iso from "@/assets/images/courseai/iso.png";
import LetsConnect from "@/assets/images/news-media/btn-vertical.svg";
import HreoName from "@/components/shared/section-names/HreoName";
import HeadingLg from "@/components/shared/headings/HeadingLg";
import stemImg from "@/assets/images/herobanner/Background.png";
import Link from "next/link";

const ContactBanner = () => {
  return (
    <section data-aos="fade-up">
      {/* Banner section */}
      <div className="container2-xl px-4 gap-10 sm:px-6 mt-5 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Banner Left */}
          <div data-aos="fade-up">
            <HreoName>
              {" "}
              <span className="font-extrabold text-[#5F2DED]">|</span>
              EMPOWERMENT THROUGH ENGAGEMENT.
            </HreoName>
            <HeadingLg
              color={"#5F2DED"}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
            >
              Connect with Medh for
              <br /> Personalized Support
            </HeadingLg>
            <div className="flex flex-col md:flex-row mt-6 mb-9 gap-8">
              <div className="flex-shrink-0">
                {/* STEM Badge */}
                <Image
                  src={stemImg}
                  alt="STEM Accredited"
                  width={90}
                  height={150}
                />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-base sm:text-lg dark:text-white">
                  With expert guidance, unlock a pathway to limitless learning
                  opportunities and endless personal and professional growth.
                </p>
                {/* CTA Button */}
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <Link
                    href="/courses"
                    className="bg-[#5F2DED] text-white border border-[#5F2DED] w-fit font-bold text-base px-4 py-2 inline-block"
                  >
                    Let's Connect
                  </Link>
                  <span className="mt-2 text-base font-semibold underline dark:text-white underline-offset-8">
                    ISO CERTIFIED
                  </span>
                </div>
              </div>
            </div>
            <span className="text-[#FD474F] text-2xl sm:text-3xl font-medium">
              Medh Hain Toh Mumkin Hain!
            </span>
          </div>
          {/* Banner Right */}
          <div data-aos="fade-up" className="lg:flex hidden justify-end ">
            <Image
              src={cuate}
              width={650}
              height={340}
              alt="Group Image"
              className="max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactBanner;
