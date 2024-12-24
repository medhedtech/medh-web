import Image from "next/image";
import React, { useState } from "react";
import logo1 from "@/assets/images/logo/medh_logo-1.png";
import Link from "next/link";
import NavbarMenu from "./NavbarMenu";
import { Button } from "@mui/material";
import ProgramsMenu from "./ProgramMenu";
import { FaTimes } from "react-icons/fa";

const NavbarLogo = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [programMenuOpen, setProgramMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleProgramMenu = () => {
    setProgramMenuOpen(!programMenuOpen);
  };

  return (
    <div className="lg:col-start-1 lg:col-span-2">
      <div className="flex items-center justify-center px-2">
        <div className="flex items-center gap-6">
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

          {/* Programs Button */}
          <button
            onClick={toggleProgramMenu}
            className="flex items-center bg-[#7ECA9D] border border-[#7ECA9D] text-[#FFFFFF] px-4 py-[4px] rounded-md transition duration-300"
          >
            Programs
          </button>
        </div>
      </div>

      {/* Apply background blur when the menu is open */}
      {(menuOpen || programMenuOpen) && (
        <div
          className="backdrop-blur-sm bg-black bg-opacity-50 fixed top-0 left-0 w-full h-[100vh] z-10"
          onClick={() => {
            setMenuOpen(false);
            setProgramMenuOpen(false);
          }}
        ></div>
      )}
      {/* Programs Menu */}
      <ProgramsMenu
        programMenuOpen={programMenuOpen}
        toggleProgramMenu={toggleProgramMenu}
      />
    </div>
  );
};

export default NavbarLogo;
