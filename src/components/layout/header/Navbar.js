"use client";
import { usePathname } from "next/navigation";
import { Menu } from 'lucide-react';
import NavItems from "./NavItems";
import NavbarLogo from "./NavbarLogo";
import NavbarRight from "./NavbarRight";
import NavItems2 from "./NavItems2";
import useIsTrue from "@/hooks/useIsTrue";
import NavbarTop from "./NavbarTop";

const Navbar = ({ onMobileMenuOpen }) => {
  const pathname = usePathname();
  const isHome1 = useIsTrue("/");
  const isHome1Dark = useIsTrue("/home-1-dark");
  const isHome2 = useIsTrue("/home-2");
  const isHome2Dark = useIsTrue("/home-2-dark");
  const isHome4 = useIsTrue("/home-4");
  const isHome4Dark = useIsTrue("/home-4-dark");
  const isHome5 = useIsTrue("/home-5");
  const isHome5Dark = useIsTrue("/home-5-dark");

  const containerClass = isHome1 || isHome1Dark || isHome4 || isHome4Dark || isHome5 || isHome5Dark
    ? "lg:container 3xl:container2-lg"
    : isHome2 || isHome2Dark
    ? "container sm:container-fluid lg:container 3xl:container-secondary"
    : "lg:container 3xl:container-secondary-lg";

  return (
    <div className={`sticky top-0 transition-all duration-300 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-40`}>
      <nav className="relative">
        <div className={`${containerClass} mx-auto px-4 sm:px-6 lg:px-8`}>
          {/* Top Navigation for specific pages */}
          {(isHome4 || isHome4Dark || isHome5 || isHome5Dark) && <NavbarTop />}

          {/* Main Navigation */}
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left section with logo */}
            <div className="flex-shrink-0">
              <NavbarLogo />
            </div>

            {/* Center section with navigation items */}
            <div className="hidden lg:block flex-1 px-8">
              {isHome2Dark ? <NavItems2 /> : <NavItems />}
            </div>

            {/* Right section */}
            <div className="flex items-center">
              <NavbarRight />
              
              {/* Mobile menu button */}
              <button
                type="button"
                className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors duration-200"
                onClick={onMobileMenuOpen}
                aria-label="Open main menu"
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
