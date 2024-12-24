import React from "react";
import { ArrowLeftIcon, LogIn, Menu } from "lucide-react";
import Image from "next/image";
import logo1 from "@/assets/images/logo/medh_logo.png";
import Link from "next/link";

const NavbarMenu = ({ menuOpen, toggleMenu }) => {
  return (
    <>
      {/* Menu Button */}
      <div className="cursor-pointer lg:hidden" onClick={toggleMenu}>
        <Menu />
      </div>

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 w-[80vw] h-[100vh] bg-white shadow-lg z-20 transition-transform duration-500 ease-out transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center p-4 gap-4">
          <button onClick={toggleMenu} className="text-xl font-bold">
            <ArrowLeftIcon />
          </button>
          <Link href="/" className="w-logo-sm lg:w-logo-lg ">
            <Image
              priority={false}
              src={logo1}
              alt="logo"
              className="w-full py-0 contain"
            />
          </Link>

          <Link
            href="/login"
            className="flex text-[14px] gap-1 items-center justify-end ps-0 font-normal text-[#7eca9d]"
          >
            <LogIn className="w-3 h-3 text-[#7eca9d]" /> LOGIN
          </Link>
        </div>
        <div className="flex flex-col items-start justify-center space-y-2 px-4 font-normal text-[1rem]">
          {/* Menu Links */}
          <Link
            href="/corporate-training-courses"
            className="focus:text-green-400 text-[#252525] font-Poppins"
          >
            Corporate Training
          </Link>
          <Link
            href="/hire-from-medh"
            className="focus:text-green-400 text-[#252525] font-Poppins"
          >
            Hire From Medh
          </Link>
          <Link
            href="/about-us"
            className="focus:text-green-400 text-[#252525] font-Poppins"
          >
            About Us
          </Link>
          <Link
            href="/news-and-media"
            className="focus:text-green-400 text-[#252525] font-Poppins"
          >
            News & Media
          </Link>
          <Link
            href="/medh-membership"
            className="focus:text-green-400 text-[#252525] font-Poppins"
          >
            Medh Membership
          </Link>
          <Link
            href="/medh-team"
            className="focus:text-green-400 text-[#252525] font-Poppins"
          >
            Medh Team
          </Link>
          <Link
            href="/join-us-as-educator"
            className="focus:text-green-400 text-[#252525] font-Poppins"
          >
            Join Us as an Educator
          </Link>
          <Link
            href="/join-us-as-school-institute"
            className="focus:text-green-400 text-[#252525] font-Poppins"
          >
            Join Us as a School / Institute
          </Link>
          <Link
            href="/careers-at-medh"
            className="focus:text-green-400 text-[#252525] font-Poppins"
          >
            Careers @medh
          </Link>
          <Link
            href="/contact-us"
            className="focus:text-green-400 text-[#252525] font-Poppins"
          >
            Contact Us
          </Link>
          <Link
            href="/blogs"
            className="focus:text-green-400 text-[#252525] font-Poppins"
          >
            Blogs
          </Link>
        </div>
      </div>
    </>
  );
};

export default NavbarMenu;
