"use client";

import React, { useEffect } from "react";
import { ArrowLeftIcon, LogIn, Menu, ChevronRight } from "lucide-react";
import Image from "next/image";
import logo1 from "@/assets/images/logo/medh_logo.png";
import Link from "next/link";

const NavbarMenu = ({ menuOpen, toggleMenu }) => {
  const menuItems = [
    { href: "/corporate-training-courses", label: "Corporate Training" },
    { href: "/medh-membership", label: "Medh Membership" },
    { href: "/hire-from-medh", label: "Hire From Us" },
    { href: "/about-us", label: "About Us" },
    { href: "/news-and-media", label: "News & Media" },
  
    { href: "/medh-team", label: "Medh Team" },
    { href: "/join-us-as-educator", label: "Join Us as an Educator" },
    { href: "/join-us-as-school-institute", label: "Join Us as a School / Institute" },
    { href: "/careers", label: "Careers @medh" },
    { href: "/contact-us", label: "Contact Us" },
    { href: "/blogs", label: "Blogs" },
  ];
  
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      {/* Menu Button - Only rendered when used outside NavbarLogo */}
      {toggleMenu && (
        <div 
          className="cursor-pointer lg:hidden group transition-transform duration-200 hover:scale-110 p-2"
          onClick={toggleMenu}
          aria-label="Open menu"
          role="button"
          tabIndex={0}
        >
          <Menu className="transition-colors duration-200 group-hover:text-primary-500 w-6 h-6" />
        </div>
      )}

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 w-[85vw] sm:w-[60vw] md:w-[50vw] h-full bg-white dark:bg-gray-900 shadow-xl z-50 transition-transform duration-300 ease-out transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 relative h-20">
          <button 
            onClick={toggleMenu} 
            className="text-xl p-2.5 rounded-full transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Close menu"
          >
            <ArrowLeftIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          
          {/* Centered Logo */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Link 
              href="/" 
              className="transition-transform duration-200 hover:scale-105 block"
              onClick={toggleMenu}
            >
              <Image
                src={logo1}
                alt="Medh Logo"
                priority
                width={150}
                height={50}
                className="h-12 w-auto object-contain aspect-[3/1]"
                sizes="(max-width: 768px) 120px, 150px"
              />
            </Link>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col py-6 font-normal overflow-y-auto max-h-[calc(100vh-90px)] bg-gray-50 dark:bg-gray-800/50 h-full">
          <div className="px-4 mb-4">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 px-4">MENU</h2>
          </div>
          <div className="space-y-1 px-4 pb-6">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={toggleMenu}
                className="group flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
              >
                <span className="font-medium">{item.label}</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-200" />
              </Link>
            ))}
          </div>
          <div className="mt-auto px-8 py-6 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/login"
              onClick={toggleMenu}
              className="flex items-center justify-center gap-2 w-full bg-primary-500 text-white py-3 px-4 rounded-lg hover:bg-primary-600 transition-all duration-200 font-medium"
            >
              <LogIn className="w-4 h-4" />
              Login to Medh
            </Link>
          </div>
        </div>
      </div>

      {/* Backdrop - close menu when clicking outside */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default NavbarMenu;
