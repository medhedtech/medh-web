import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Autoplay } from "swiper/modules";
import ArrowIcon from "@/assets/images/icon/ArrowIcon";
import InfoIcon from "@/assets/images/icon/InfoIcon";
import placement from "@/assets/images/iso/pllacement-logo.png";
import hire from "@/assets/images/hire/placement.png";
import bgImg from "@/assets/images/herobanner/bg-img.jpeg";
import Certified from "./Certified";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

const WhyMedh = () => {
  const router = useRouter();

  // Custom navigation refs
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  const content = [
    {
      id: 1,
      title: "Quality of Content and Curriculum",
      desc: "We assess content quality, effectiveness, and engagement, ensuring up-to-date, well-structured materials that drive learning outcomes.",
    },
    {
      id: 2,
      title: "Comprehensive Learning Resources",
      desc: "Our platform provides diverse, inclusive materials tailored to learners of all backgrounds and skill levels.",
    },
    {
      id: 3,
      title: "Expert Mentorship",
      desc: "Learn from highly qualified instructors dedicated to your success through practical projects and assignments.",
    },
    {
      id: 4,
      title: "Personalized Learning",
      desc: "Customize your learning path with flexible modules and tailored recommendations to fit your goals.",
    },
  ];

  useEffect(() => {
    if (swiperRef.current) {
      // Attach custom navigation refs to Swiper instance
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;

      // Manually update navigation since refs might not be set during initialization
      swiperRef.current.navigation.update();
    }
  }, []);

  return (
    <div>
      {/* Job Guarantee Section */}
      <div className="flex flex-col md:flex-row items-center px-4 md:px-8 lg:px-20 py-7 gap-6">
        <div className="text-center align-center md:w-1/2 px-4 md:px-6 flex flex-col gap-3">
          <Image
            src={placement}
            width={300}
            height={161}
            className="mx-auto"
            alt="100% Job-guaranteed"
          />
          <p className="font-bold text-2xl md:text-3xl w-full px-2 sm:px-8 text-center leading-8 text-[#5C6574] dark:text-white">
            100% Job-guaranteed Courses from Medh.
          </p>

          <button
            onClick={() => router.push("/skill-development-courses")}
            className="cursor-pointer bg-[#7ECA9D] rounded-[2px] px-4 py-3 w-fit mx-auto font-semibold text-white flex gap-4"
          >
            <span>
              <ArrowIcon />
            </span>
            Explore Courses
          </button>
        </div>
        <div className="md:w-1/2">
          <Image
            src={hire}
            width={530}
            height={454}
            className="w-full h-auto"
            alt="Hiring"
          />
        </div>
      </div>

      {/* Why Medh Section */}
      <div
        className="bg-cover bg-center h-auto max-lg:py-10 max-sm:px-10 dark:bg-screen-dark md:h-[600px] flex items-center justify-start px-14"
        style={{ backgroundImage: `url(${bgImg.src})` }}
      >
        <div className="bg-white h-auto md:h-auto py-6 px-6 md:px-10 lg:px-16 relative shadow-lg w-full max-w-[630px] dark:bg-screen-dark">
          <h2 className="text-[#7ECA9D] font-bold text-3xl md:text-4xl">
            WHY MEDH?
          </h2>
          <p className="text-gray-600 mt-4 dark:text-gray300">
            Empowering learners with the freedom to explore, we go beyond
            fundamental concepts, fostering brainstorming, critical thinking,
            and beyond. We aim to provide learners with the canvas to visualize
            and pursue their aspirations.
          </p>

          <Swiper
            modules={[Navigation, Autoplay]}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper; // Assign swiper instance to the ref
            }}
            spaceBetween={10}
            slidesPerView={1}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            className="mt-6"
          >
            {content.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="cursor-grab">
                  <h3 className="text-[#252525] mt-7 font-semibold text-lg dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mt-4 dark:text-gray300">
                    {item.desc}
                  </p>
                  <button
                    onClick={() => router.push("/about-us")}
                    className="bg-[#7ECA9D] text-white mt-6 px-4.5 py-2 flex items-center justify-center gap-6"
                  >
                    <span>
                      <InfoIcon />
                    </span>
                    More info..
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div
            ref={prevRef}
            className="absolute -left-6 top-[75%] transform -translate-y-1/2"
          >
            <button
              className="bg-white font-bold shadow-lg focus:bg-green-500 focus:text-white dark:bg-black dark:text-white text-black rounded-full w-10 h-10 flex items-center justify-center"
              aria-label="Previous Slide"
            >
              <ArrowLeft />
            </button>
          </div>
          <div
            ref={nextRef}
            className="absolute -right-6 top-[75%] transform -translate-y-1/2"
          >
            <button
              className="bg-white font-bold shadow-lg focus:bg-green-500 focus:text-white dark:bg-black dark:text-white text-black rounded-full w-10 h-10 flex items-center justify-center"
              aria-label="Next Slide"
            >
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>

      {/* Certified & Recognized By Section */}
      <Certified />
    </div>
  );
};

export default WhyMedh;
