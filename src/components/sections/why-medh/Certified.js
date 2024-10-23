'use client';
import Image from 'next/image';
import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import iso27001 from '@/assets/images/iso/iso27001.png';
import iso10002 from '@/assets/images/iso/iso10002.png';
import iso20000 from '@/assets/images/iso/iso20000.png';
import iso22301 from '@/assets/images/iso/iso22301.png';
import iso9001 from '@/assets/images/iso/iso9001.png';
import iso270001 from '@/assets/images/iso/iso27001.png';

const Certified = () => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: 5, // Show 5 slides
    slidesToScroll: 1,
    centerMode: true, // Center the cards
    centerPadding: '0',
    // Remove extra padding around the center slide
    responsive: [
      {
        breakpoint: 1024, // Tablets
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          centerMode: true, // Keep the cards centered on tablets
        },
      },
      {
        breakpoint: 768, // Mobile devices
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: true, // Center the cards on mobile
        },
      },
      {
        breakpoint: 480, // Smaller mobile devices
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true, // Center the card on small screens
        },
      },
    ],
  };

  return (
    <div className="py-12 w-full flex justify-center items-center">
      <div className="w-[80%] ">
        <h3 className="text-center text-[#5C6574] dark:text-gray-200 text-size-32 leading-34px font-bold mb-8">
          Certified & Recognized By
        </h3>
        <Slider {...settings}>
          <div className="pb-5 text-center  ">
            <Image
              src={iso10002}
              width={100}
              height={162}
              alt="ISO 10002 Certification"
              className="mx-auto"
            />
          </div>
          <div className="text-center">
            <Image
              src={iso27001}
              width={100}
              height={162}
              alt="ISO 27001 Certification"
              className="mx-auto"
            />
          </div>
          <div className="text-center">
            <Image
              src={iso20000}
              width={100}
              height={162}
              alt="ISO 20000 Certification"
              className="mx-auto"
            />
          </div>
          <div className="text-center">
            <Image
              src={iso22301}
              width={100}
              height={162}
              alt="ISO 22301 Certification"
              className="mx-auto"
            />
          </div>
          <div className="text-center">
            <Image
              src={iso9001}
              width={100}
              height={162}
              alt="ISO 9001 Certification"
              className="mx-auto"
            />
          </div>
          <div className="text-center">
            <Image
              src={iso270001}
              width={100}
              height={162}
              alt="ISO 9001 Certification"
              className="mx-auto"
            />
          </div>
        </Slider>
      </div>
    </div>
  );
};

export default Certified;
