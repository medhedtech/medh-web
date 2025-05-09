import Image from "next/image";
import flagImage1 from "@/assets/images/icon/flag1.webp";
import flagImage2 from "@/assets/images/icon/flag2.webp";
import flagImage3 from "@/assets/images/icon/flag3.webp";
import DropdownCart from "./DropdownCart";
import LoginButton from "./LoginButton";
import DropdownWrapper from "@/components/shared/wrappers/DropdownWrapper";
import { Search } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const NavbarTop = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Handle theme mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="hidden lg:grid grid-cols-12 py-4 pl-15px items-center gap-30px border-b border-borderColor dark:border-borderColor-dark -mx-15px bg-white/80 dark:bg-zinc-900/95 backdrop-blur-sm transition-colors duration-300">
      <div className="col-start-1 col-span-3">
        <ul className="flex items-center nav-list">
          <li className="relative group">
            <button 
              className="text-contentColor dark:text-contentColor-dark pr-10px flex items-center gap-1.5 text-sm hover:text-[#7ECA9D] dark:hover:text-[#7ECA9D] transition-colors duration-200"
              aria-label="Select language"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <Image
                src={flagImage1}
                alt="English"
                className="w-5 h-5 rounded-md"
                width={20}
                height={20}
              />
              <span>ENG</span>
              <i className="icofont-rounded-down text-xs"></i>
            </button>

            {/* Language dropdown menu */}
            <DropdownWrapper>
              <div className="shadow-lg rounded-md bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 overflow-hidden min-w-[120px]">
                <ul>
                  <li>
                    <a
                      href="#"
                      className="flex items-center text-sm p-2.5 transition duration-200 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300"
                    >
                      <Image
                        src={flagImage2}
                        alt="French"
                        className="w-5 h-5 rounded-md mr-2"
                        width={20}
                        height={20}
                      />
                      <span>French</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center text-sm p-2.5 transition duration-200 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300"
                    >
                      <Image
                        src={flagImage3}
                        alt="German"
                        className="w-5 h-5 rounded-md mr-2"
                        width={20}
                        height={20}
                      />
                      <span>German</span>
                    </a>
                  </li>
                </ul>
              </div>
            </DropdownWrapper>
          </li>
          <li className="relative group ml-6">
            <button 
              className="text-contentColor dark:text-contentColor-dark flex items-center gap-1.5 text-sm hover:text-[#7ECA9D] dark:hover:text-[#7ECA9D] transition-colors duration-200"
              aria-label="Select currency"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span>USD</span>
              <i className="icofont-rounded-down text-xs"></i>
            </button>
            
            {/* Currency dropdown menu */}
            <DropdownWrapper>
              <div className="shadow-lg rounded-md bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 overflow-hidden min-w-[120px]">
                <ul>
                  <li>
                    <a
                      href="#"
                      className="block w-full text-sm p-2.5 transition duration-200 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300"
                    >
                      EUR
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block w-full text-sm p-2.5 transition duration-200 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300"
                    >
                      GBP
                    </a>
                  </li>
                </ul>
              </div>
            </DropdownWrapper>
          </li>
        </ul>
      </div>
      
      {/* Search Bar */}
      <div className="col-start-4 col-span-6">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className={`relative flex items-center transition-all duration-300 ${
            searchFocused 
              ? 'shadow-md dark:shadow-zinc-800/30 ring-2 ring-[#7ECA9D] dark:ring-opacity-70' 
              : 'border border-gray-200 dark:border-zinc-700 hover:border-[#7ECA9D] dark:hover:border-[#7ECA9D]'
          } rounded-full bg-white dark:bg-zinc-800`}>
            <input
              type="text"
              placeholder="Search..."
              className="w-full py-2.5 pl-5 pr-12 focus:outline-none bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-800 dark:text-gray-200"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              aria-label="Search courses"
            />
            <button
              type="submit"
              className="absolute right-4 p-1.5 text-gray-500 dark:text-gray-400 hover:text-[#7ECA9D] dark:hover:text-[#7ECA9D] transition-colors duration-200"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
      
      {/* Right actions area */}
      <div className="col-start-10 col-span-3">
        <ul className="relative nav-list flex justify-end items-center gap-4">
          <li className="group">
            <DropdownCart isHeaderTop={true} />
          </li>
          <li className="hidden lg:block">
            {mounted && <LoginButton />}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavbarTop;
