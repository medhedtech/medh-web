"use client";

import DropdownContainer from "@/components/shared/containers/DropdownContainer";
import React, { useState, useEffect } from "react";
import DropdownItems from "./DropdownItems";

const DropdownMore = ({ isMenuOpen, onMenuToggle }) => {
  // Use local state that syncs with parent's state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Sync with parent component's state
  useEffect(() => {
    if (isMenuOpen !== undefined) {
      setIsDropdownOpen(isMenuOpen);
    }
  }, [isMenuOpen]);
  
  // Propagate state changes to parent
  const handleToggle = (newState) => {
    setIsDropdownOpen(newState);
    if (onMenuToggle) {
      onMenuToggle(newState);
    }
  };
  
  const lists = [
    {
      items: [
        {
          name: "About Us",
          path: "/about-us",
        },
        {
          name: "Blog",
          path: "/blogs",
        },
        {
          name: "Careers @medh",
          path: "/careers",
        },
        {
          name: "Join Us as a School / Institute",
          path: "/join-us-as-school-institute",
        },
        {
          name: "Join Us as an Educator",
          path: "/join-us-as-educator",
        },
        {
          name: "News and Media",
          path: "/news-and-media",
        },
      ],
    },
  ];
  
  return (
    <div className="absolute top-full z-50 mt-1 right-0">
      <DropdownContainer 
        isOpen={isDropdownOpen} 
        onToggle={handleToggle}
        position="right"
        width="w-64"
        maxHeight="300px"
        className="py-1"
      >
        <div className="w-full">
          {lists?.map((list, idx) => (
            <DropdownItems 
              key={idx} 
              list={list} 
              onItemClick={() => handleToggle(false)}
            />
          ))}
        </div>
      </DropdownContainer>
    </div>
  );
};

export default DropdownMore;
