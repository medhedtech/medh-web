import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";

// Import images
import Certified1 from "../../../assets/images/hireformmedh/certified1.png";
import Certified2 from "../../../assets/images/hireformmedh/certified2.png";
import Certified3 from "../../../assets/images/hireformmedh/certified3.png";
import Certified4 from "../../../assets/images/hireformmedh/certified4.png";
import Certified5 from "../../../assets/images/hireformmedh/certified5.png";

const CertificationsCarousel = () => {
  const certifications = [
    { src: Certified1 },
    { src: Certified2 },
    { src: Certified3 },
    { src: Certified4 },
    { src: Certified5 },
    { src: Certified5 },
    { src: Certified5 },
    { src: Certified5 },
    { src: Certified5 },
    { src: Certified5 },
    { src: Certified5 },
    { src: Certified5 },
  ];

  return (
    <div className="py-10 bg-white dark:bg-screen-dark">
      <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-800 mb-8 dark:text-white">
        Certified & Recognised By
      </h2>

      <Swiper
        spaceBetween={30}
        slidesPerView={5}
        loop={true}
        pagination={{ clickable: true }}
        navigation={true}
        className="w-[95%] mx-auto" // Slightly increase width for small screens
        breakpoints={{
          // for small screens
          640: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          // for medium screens
          768: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
          // for large screens
          1024: {
            slidesPerView: 5,
            spaceBetween: 40,
          },
        }}
      >
        {certifications.map((cert, index) => (
          <SwiperSlide key={index} className="flex justify-center">
            <div className="flex flex-col items-center p-2 rounded-lg">
              <Image
                src={cert.src}
                alt={`Certification ${index + 1}`}
                className="object-contain w-full h-auto max-w-[100px] max-h-[162px] mb-4" // Make the images responsive
                layout="intrinsic" // Ensures the images maintain their aspect ratio
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CertificationsCarousel;
