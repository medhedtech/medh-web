"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Slider from "react-slick";
import { Trophy } from "lucide-react";

// Import your certification images
import iso27001 from "@/assets/images/iso/iso27001.png";
// ... rest of your imports

const Certified = () => {
  const [isHovered, setIsHovered] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  const certifications = [
    { image: iso27001, alt: "ISO 27001", title: "ISO 27001" },
    // ... rest of your certifications
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    centerMode: true,
    centerPadding: "0",
    cssEase: "cubic-bezier(0.87, 0, 0.13, 1)",
    afterChange: (current) => setCurrentSlide(current % certifications.length),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="w-8 h-8 text-[#7ECA9D]" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Our Certifications
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Swipe to explore our achievements ✨
          </p>
        </motion.div>

        {/* Slider Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <Slider ref={sliderRef} {...settings}>
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="p-4"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="relative h-[140px] w-[100px] mx-auto">
                    <Image
                      src={cert.image}
                      alt={cert.alt}
                      width={100}
                      height={140}
                      className="w-full h-full object-contain transition-transform duration-300 hover:rotate-3"
                    />
                  </div>
                  <p className="text-center mt-4 font-medium text-gray-900 dark:text-white">
                    {cert.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </Slider>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {certifications.map((_, index) => (
              <button
                key={index}
                onClick={() => sliderRef.current?.slickGoTo(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "w-6 bg-[#7ECA9D]"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Certified; 