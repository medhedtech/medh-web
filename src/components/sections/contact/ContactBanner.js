"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import HeadingLg from "@/components/shared/headings/HeadingLg";
import HreoName from "@/components/shared/section-names/HreoName";
import stemImg from "@/assets/images/herobanner/Background.png";
import family from "@/assets/Header-Images/Contact/contact.jpg";
import bgImage from "@/assets/Header-Images/Contact/Contact_Banner.jpg";
import "@/assets/css/ovalAnimation.css";
import { ArrowRight, ChevronRight } from "lucide-react";

const ContactBanner = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 overflow-hidden">
      {/* Background Image - Large Screens */}
      <div className="absolute inset-0 hidden lg:block">
        <Image
          src={bgImage}
          alt="Banner Background"
          layout="fill"
          objectFit="cover"
          className="opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-10">
          {/* Left Content */}
          <div className={`space-y-8 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* Subheading Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500/10 to-primary-500/0 rounded-full p-1 pl-2 pr-4 backdrop-blur-sm border-l-4 border-primaryColor">
              <span className="text-primary-300 text-sm font-bold">
                EMPOWERMENT THROUGH ENGAGEMENT.
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7ECA9D] to-primary-400">
                Connect with Medh for Personalized Support
              </span>
            </h1>

            {/* Description Section */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* STEM Badge */}
              <div className="flex-shrink-0 p-2 rounded-lg bg-white/5 backdrop-blur-sm">
                <Image
                  src={stemImg}
                  alt="STEM Accredited"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>

              <div className="space-y-6">
                <p className="text-lg text-gray-300 leading-relaxed">
                  With expert guidance, unlock a pathway to limitless learning opportunities and endless personal and professional growth.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-6">
                  <Link href="#courses-section" passHref>
                    <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#7ECA9D] to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-lg transition-all transform hover:-translate-y-0.5 shadow-lg shadow-primary-500/25">
                      Let&#39;s Connect
                      <ArrowRight size={18} className="ml-2" />
                    </button>
                  </Link>
                  <Link href="#certified-section" passHref>
                    <span className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors cursor-pointer border-b-2 border-primary-500/50">
                      ISO CERTIFIED
                      <ChevronRight size={18} className="ml-1" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Slogan */}
            <p className="mumkinMedh text-3xl md:text-4xl lg:text-5xl font-Bulgathi text-[#7ECA9D] mt-8">
              Medh Hain Toh Mumkin Hai!
            </p>
          </div>

          {/* Right Content - Logo/Image */}
          <div className={`relative transition-all duration-1000 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative w-full aspect-square max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-[#7ECA9D] to-primary-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="wavy-oval overflow-hidden rounded-3xl border border-white/10 backdrop-blur-sm">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src={family}
                    alt="Featured Image"
                    fill
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactBanner;
