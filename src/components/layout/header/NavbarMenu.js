import React, { useEffect, useRef } from "react";
import { LogIn, Menu, MenuIcon } from "lucide-react";
import Image from "next/image";
import logo1 from "@/assets/images/logo/medh_logo.png";
import Link from "next/link";
import { MoveLeft } from "lucide-react";

const NavbarMenu = ({ menuOpen, toggleMenu }) => {
  return (
    <>
      {/* Menu Button */}
      <div className="cursor-pointer lg:hidden" onClick={toggleMenu}>
        <Menu />
      </div>

      {/* Sidebar Menu */}
      {menuOpen && (
        <div className="fixed top-0 left-0 w-[80vw] h-[100vh] bg-white shadow-lg transition-transform duration-300 ease-in-out transform translate-x-0 lg:hidden z-20">
          <div className="flex items-center p-4 gap-4">
            <button onClick={toggleMenu} className="text-xl font-bold">
              <MoveLeft />
            </button>
            <Link href="/" className="w-logo-sm lg:w-logo-lg ">
              <Image
                priority={false}
                src={logo1}
                alt="logo"
                className="w-full py-2 "
              />
            </Link>

            <Link
              href="/login"
              className="flex gap-1 items-center justify-end ps-4 font-semibold text-green-500"
            >
              <LogIn />
              LOGIN
            </Link>
          </div>
          <div className="flex flex-col items-start justify-center space-y-4 px-4 font-semibold text-lg">
            {/* Menu Links */}
            <Link
              href="/corporate-training-courses"
              className="focus:text-green-400"
            >
              Corporate Training
            </Link>
            <Link href="/hire-from-medh" className="focus:text-green-400">
              Hire From Medh
            </Link>
            <Link href="/courses" className="focus:text-green-400">
              Courses
            </Link>
            <Link href="/about-us" className="focus:text-green-400">
              About Us
            </Link>
            <Link href="/news-and-media" className="focus:text-green-400">
              News & Media
            </Link>
            <Link href="/medh-membership" className="focus:text-green-400">
              Medh Membership
            </Link>
            <Link href="/medh-team" className="focus:text-green-400">
              Medh Team
            </Link>
            <Link href="/join-us-as-educator" className="focus:text-green-400">
              Join Us as an Educator
            </Link>
            <Link
              href="/join-us-as-school-institute"
              className="focus:text-green-400"
            >
              Join Us as a School / Institute
            </Link>
            <Link href="/careers-at-medh" className="focus:text-green-400">
              Careers @medh
            </Link>
            <Link href="/contact-us" className="focus:text-green-400">
              Contact Us
            </Link>
            <Link href="/blogs" className="focus:text-green-400">
              Blogs
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default NavbarMenu;
