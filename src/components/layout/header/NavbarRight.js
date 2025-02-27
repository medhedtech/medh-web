"use client";
import React from "react";
import DropdownCart from "./DropdownCart";
import Link from "next/link";
import MobileMenuOpen from "@/components/shared/buttons/MobileMenuOpen";
import useIsTrue from "@/hooks/useIsTrue";
import LoginButton from "./LoginButton";
import { ShoppingBag, ExternalLink } from "lucide-react";

const NavbarRight = ({ isScrolled }) => {
  const isHome4 = useIsTrue("/home-4");
  const isHome4Dark = useIsTrue("/home-4-dark");
  const isHome5 = useIsTrue("/home-5");
  const isHome5Dark = useIsTrue("/home-5-dark");
  const isHome2Dark = useIsTrue("/home-2-dark");

  return (
    <div className="flex items-center space-x-2 md:space-x-4">
      <ul className="flex items-center space-x-1 md:space-x-3">
        {/* Login Button */}
        {!(isHome4 || isHome4Dark || isHome5 || isHome5Dark) && (
          <li className="hidden lg:block">
            <LoginButton isScrolled={isScrolled} />
          </li>
        )}
        
        {/* Get Started Button */}
        <li className="hidden lg:block">
          <Link
            href="/courses"
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 
              ${isScrolled ? 'text-sm' : 'text-sm md:text-base'} 
              font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 
              hover:from-primary-600 hover:to-primary-700 rounded-full shadow-sm hover:shadow-md 
              transform hover:-translate-y-0.5 transition-all duration-200
              dark:from-primary-600 dark:to-primary-700 dark:hover:from-primary-500 dark:hover:to-primary-600`}
          >
            {isHome2Dark ? (
              <>Get Started Free<ExternalLink size={16} className="ml-1" /></>
            ) : isHome4 || isHome4Dark || isHome5 || isHome5Dark ? (
              <>Get Started Here<ExternalLink size={16} className="ml-1" /></>
            ) : (
              <>Get Started<ExternalLink size={16} className="ml-1" /></>
            )}
          </Link>
        </li>
        
        {/* Mobile Menu Button (showing in mobile view only) */}
        <li className="block lg:hidden">
          <MobileMenuOpen />
        </li>
      </ul>
    </div>
  );
};

export default NavbarRight;
