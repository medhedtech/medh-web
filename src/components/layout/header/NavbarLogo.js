import Image from "next/image";
import React, { useState } from "react";
import logo1 from "@/assets/images/logo/medh_logo-1.png";
import Link from "next/link";
import NavbarMenu from "./NavbarMenu";
import ProgramsMenu from "./ProgramMenu";
import { LogIn } from "lucide-react";

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
      <div className="bg-[#7ECA9D] cursor-pointer lg:hidden w-full absolute top-0 left-0 z-20">
        <Link
          href="/login"
          className="flex text-[12px] items-center justify-center w-full h-full font-normal text-[#FFFFFF] px-0 py-0"
        >
          <LogIn className="w-3 h-3 text-[#FFFFFF] mr-1" /> LOGIN
        </Link>
      </div>
      <div className="flex items-center mt-4 justify-center px-2">
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
            className="flex items-center cursor-pointer lg:hidden bg-[#7ECA9D] border border-[#7ECA9D] text-[#FFFFFF] px-4 py-[4px] rounded-md transition duration-300"
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
