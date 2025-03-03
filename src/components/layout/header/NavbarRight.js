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
            href="/signup"
            className={`group relative inline-flex items-center justify-center gap-2 px-6 py-2.5
              ${isScrolled ? 'text-sm' : 'text-base'} 
              font-medium text-white bg-gradient-to-r from-primary-500 via-purple-500 to-primary-600 
              bg-size-200 bg-pos-0 hover:bg-pos-100
              rounded-xl shadow-lg hover:shadow-xl shadow-primary-500/20 hover:shadow-primary-500/30
              transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden`}
          >
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
              translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            
            {/* Animated text container */}
            <div className="relative flex items-center">
              <span className="relative z-10 inline-flex items-center font-semibold tracking-wide">
                {isHome2Dark ? (
                  <>
                    <span className="animate-shimmer bg-clip-text text-transparent bg-[linear-gradient(110deg,#fff,45%,#7ECA9D,55%,#fff)] bg-[length:250%_100%]">
                      Start Learning
                    </span>
                    <span className="ml-1 transform transition-transform group-hover:translate-x-1">
                      <ExternalLink size={16} className="transform transition-transform group-hover:rotate-45" />
                    </span>
                  </>
                ) : isHome4 || isHome4Dark || isHome5 || isHome5Dark ? (
                  <>
                    <span className="animate-shimmer bg-clip-text text-transparent bg-[linear-gradient(110deg,#fff,45%,#7ECA9D,55%,#fff)] bg-[length:250%_100%]">
                      Get Started Here
                    </span>
                    <span className="ml-1 transform transition-transform group-hover:translate-x-1">
                      <ExternalLink size={16} className="transform transition-transform group-hover:rotate-45" />
                    </span>
                  </>
                ) : (
                  <>
                    <span className="animate-shimmer bg-clip-text text-transparent bg-[linear-gradient(110deg,#fff,45%,#7ECA9D,55%,#fff)] bg-[length:250%_100%]">
                      Start Learning
                    </span>
                    <span className="ml-1 transform transition-transform group-hover:translate-x-1">
                      <ExternalLink size={16} className="transform transition-transform group-hover:rotate-45" />
                    </span>
                  </>
                )}
              </span>
            </div>

            {/* Enhanced hover effect */}
            <div className="absolute -inset-1 rounded-xl blur-xl bg-gradient-to-r from-primary-500/30 via-purple-500/30 to-primary-600/30 
              opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </Link>

          <style jsx global>{`
            @keyframes shimmer {
              from {
                background-position: 100% 100%;
              }
              to {
                background-position: 0% 0%;
              }
            }
            .animate-shimmer {
              animation: shimmer 2.5s linear infinite;
            }
            .bg-size-200 {
              background-size: 200% 100%;
            }
            .bg-pos-0 {
              background-position: 0% 0%;
            }
            .bg-pos-100 {
              background-position: 100% 100%;
            }
          `}</style>
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
