import React from "react";
import { ArrowLeftIcon, LogIn, Menu, ChevronRight } from "lucide-react";
import Image from "next/image";
import logo1 from "@/assets/images/logo/medh_logo.png";
import Link from "next/link";

const NavbarMenu = ({ menuOpen, toggleMenu }) => {
  const menuItems = [
    { href: "/corporate-training-courses", label: "Corporate Training" },
    { href: "/hire-from-medh", label: "Hire From Medh" },
    { href: "/about-us", label: "About Us" },
    { href: "/news-and-media", label: "News & Media" },
    { href: "/medh-membership", label: "Medh Membership" },
    { href: "/medh-team", label: "Medh Team" },
    { href: "/join-us-as-educator", label: "Join Us as an Educator" },
    { href: "/join-us-as-school-institute", label: "Join Us as a School / Institute" },
    { href: "/careers-at-medh", label: "Careers @medh" },
    { href: "/contact-us", label: "Contact Us" },
    { href: "/blogs", label: "Blogs" },
  ];

  return (
    <>
      {/* Menu Button */}
      <div 
        className="cursor-pointer lg:hidden group transition-transform duration-200 hover:scale-110 p-2"
        onClick={toggleMenu}
      >
        <Menu className="transition-colors duration-200 group-hover:text-[#7ECA9D] w-6 h-6" />
      </div>

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 w-[80vw] sm:w-[60vw] md:w-[50vw] h-[100vh] bg-white shadow-xl z-20 transition-transform duration-500 ease-out transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 relative h-20">
          <button 
            onClick={toggleMenu} 
            className="text-xl p-2.5 rounded-full transition-all duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#7ECA9D]"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          
          {/* Centered Logo */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Link href="/" className="w-logo-sm lg:w-logo-lg transition-transform duration-200 hover:scale-105 block">
              <Image
                priority={true}
                src={logo1}
                alt="Medh Logo"
                className="w-full contain"
                quality={90}
              />
            </Link>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col py-6 font-normal overflow-y-auto max-h-[calc(100vh-90px)] bg-gray-50">
          <div className="px-4 mb-4">
            <h2 className="text-sm font-semibold text-gray-500 px-4">MENU</h2>
          </div>
          <div className="space-y-1 px-4">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="group flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 hover:bg-white text-gray-600 hover:text-[#7eca9d] focus:outline-none focus:ring-2 focus:ring-[#7ECA9D] focus:ring-opacity-50"
              >
                <span className="font-medium">{item.label}</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-200" />
              </Link>
            ))}
          </div>
          <div className="mt-auto px-8 py-6 border-t border-gray-200">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full bg-[#7ECA9D] text-white py-3 px-4 rounded-lg hover:bg-[#6bb589] transition-all duration-200 font-medium"
            >
              <LogIn className="w-4 h-4" />
              Login to Medh
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarMenu;
