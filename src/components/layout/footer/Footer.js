"use client";
import FooterNavList from "./FooterNavList";
import CopyRight from "./CopyRight";
import FooterTop from "./FooterTop";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  return (
    <footer className="bg-gradient-to-b from-[#0C0E2B] to-[#070818] relative">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
      
      <div className="max-w-6xl mx-auto px-4 pt-16 pb-0">
        {/* Footer main content */}
        <FooterNavList />

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-8"></div>
        
        {/* Copyright section */}
        <CopyRight />
      </div>
    </footer>
  );
};

export default Footer;
