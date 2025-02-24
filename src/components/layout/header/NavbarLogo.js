import Image from "next/image";
import React, { useState, useEffect } from "react";
import logo1 from "@/assets/images/logo/medh_logo-1.png";
import Link from "next/link";
import NavbarMenu from "./NavbarMenu";
import { LogIn } from "lucide-react";

const NavbarLogo = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className={`lg:col-start-1 lg:col-span-2 transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      {/* Login Strip */}
      <div className="bg-[#7ECA9D] cursor-pointer lg:hidden w-full absolute top-0 left-0 z-20 transition-all duration-300 hover:bg-[#6bb589]">
        <Link
          href="/login"
          className="flex text-[12px] items-center justify-center w-full h-full font-normal text-[#FFFFFF] px-4 py-2 hover:scale-105 transition-transform duration-200"
        >
          <LogIn className="w-3.5 h-3.5 text-[#FFFFFF] mr-2" /> LOGIN
        </Link>
      </div>

      {/* Main Navigation Container */}
      <div className={`flex items-center justify-center transition-all duration-300 px-4 sm:px-6 lg:px-8 ${isScrolled ? 'mt-3 py-2' : 'mt-5 py-3'}`}>
        <div className="flex items-center justify-between relative w-full max-w-7xl">
          {/* Left Section */}
          <div className="flex items-center w-20">
            <NavbarMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
          </div>

          {/* Center Logo */}
          <div className="flex justify-center items-center flex-1 px-4">
            <Link 
              href="/" 
              className="relative block transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#7ECA9D] focus:ring-opacity-50"
            >
              <div className="w-[120px] h-[40px] sm:w-[150px] sm:h-[50px] md:w-[180px] md:h-[60px] lg:w-[200px] lg:h-[65px] relative">
                <Image
                  priority={true}
                  src={logo1}
                  alt="Medh Logo"
                  fill
                  sizes="(max-width: 640px) 120px, (max-width: 768px) 150px, (max-width: 1024px) 180px, 200px"
                  className="object-contain transition-all duration-300"
                  quality={95}
                />
              </div>
            </Link>
          </div>

          {/* Right Section - Placeholder for balance */}
          <div className="w-20 lg:hidden"></div>
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div
          className="backdrop-blur-sm bg-black/50 fixed top-0 left-0 w-full h-[100vh] z-10 transition-opacity duration-300"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default NavbarLogo;
