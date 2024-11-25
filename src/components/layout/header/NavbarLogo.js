import Image from "next/image";
import React, { useState } from "react";
import logo1 from "@/assets/images/logo/medh_logo.png";
import Link from "next/link";
import NavbarMenu from "./NavbarMenu";

const NavbarLogo = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="lg:col-start-1 lg:col-span-2">
      <div className="flex items-center gap-4">
        {/* Menu Button */}
        <NavbarMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />

        {/* Logo */}
        <Link href="/" className="w-logo-sm lg:w-logo-lg ">
          <Image
            priority={false}
            src={logo1}
            alt="logo"
            className="w-full py-2 "
          />
        </Link>
      </div>

      {/* Apply background blur when the menu is open */}
      {menuOpen && (
        <div
          className={`${
            menuOpen ? "backdrop-blur-sm bg-black bg-opacity-50" : ""
          } fixed top-0 left-0 w-full h-[100vh] z-10`}
          onClick={toggleMenu}
        ></div>
      )}
    </div>
  );
};

export default NavbarLogo;
