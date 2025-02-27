"use client";
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import MobileMenu from "./MobileMenu";
import useIsTrue from "@/hooks/useIsTrue";
import Aos from "aos";
import stickyHeader from "@/libs/stickyHeader";
import smoothScroll from "@/libs/smoothScroll";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isHome2 = useIsTrue("/home-2");
  const isHome2Dark = useIsTrue("/home-2-dark");

  useEffect(() => {
    stickyHeader();
    smoothScroll();
    // AOS Scroll Animation
    Aos.init({
      offset: 1,
      duration: 1000,
      once: true,
      easing: "ease",
    });
  }, []);

  return (
    <header className="relative z-50">
      {/* Skip to content link for keyboard users */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-md"
      >
        Skip to content
      </a>
      <div className="relative">
        {/* Navbar */}
        <Navbar onMobileMenuOpen={() => setIsMobileMenuOpen(true)} />
      </div>
    </header>
  );
};

export default Header;
