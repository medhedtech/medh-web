"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { CheckCircle } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const SwiperComponent = ({ content }) => {
  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      loop={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
        dynamicBullets: true,
      }}
      spaceBetween={12}
      slidesPerView={1}
      className="pb-10"
    >
      {content.map((item) => (
        <SwiperSlide key={item.id}>
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm h-full border border-gray-100 dark:border-gray-700/50">
            <div className="w-8 h-8 flex items-center justify-center bg-primary-50 dark:bg-primary-900/20 rounded-full mb-3">
              <CheckCircle className="text-primary-500 dark:text-primary-400" size={16} />
            </div>
            
            <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-2">
              {item.title}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {item.desc}
            </p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwiperComponent; 