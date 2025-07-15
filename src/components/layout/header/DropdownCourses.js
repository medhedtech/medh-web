"use client";

import DropdownContainer from "@/components/shared/containers/DropdownContainer";
import React, { useState, useEffect } from "react";
import DropdownItems from "./DropdownItems";
import Image from "next/image";
import megaMenu1 from "@/assets/images/mega/mega_menu_1.png";

const DropdownCourses = ({ isMenuOpen, onMenuToggle }) => {
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
    // {
    //   title: "Get Started 1",
    //   items: [
    //     {
    //       name: "Grid",
    //       status: "All Coures",
    //       path: "/courses",
    //     },
    //     {
    //       name: "Coures Grid (Dark)",
    //       status: null,
    //       path: "/courses-dark",
    //     },
    //     {
    //       name: "Coures Grid",
    //       status: null,
    //       path: "/course-grid",
    //     },
    //     {
    //       name: "Coures Grid (Dark)",
    //       status: null,
    //       path: "/course-grid-dark",
    //     },
    //     {
    //       name: "Coures List",
    //       status: null,
    //       path: "/course-list",
    //     },
    //     {
    //       name: "Coures List (Dark)",
    //       status: null,
    //       path: "/course-list-dark",
    //     },
    //   ],
    // },
    // {
    //   title: "Get Started 2",
    //   items: [
    //     {
    //       name: "Course Details",
    //       status: null,
    //       path: "/courses/1",
    //     },
    //     {
    //       name: "Course Details (Dark)",
    //       status: null,
    //       path: "/courses-dark/1",
    //     },
    //     {
    //       name: "Course Details 2",
    //       status: null,
    //       path: "/course-details-2",
    //     },
    //     {
    //       name: "Details 2 (Dark)",
    //       status: null,
    //       path: "/course-details-2-dark",
    //     },
    //     {
    //       name: "Course Details 3",
    //       status: null,
    //       path: "/course-details-3",
    //     },
    //     {
    //       name: "Details 3 (Dark)",
    //       status: null,
    //       path: "/course-details-3-dark",
    //     },
    //   ],
    // },
    // {
    //   title: "Get Started 3",
    //   items: [
    //     {
    //       name: "Become An Instructor",
    //       status: null,
    //       path: "/dashboards/become-an-instructor",
    //     },
    //     {
    //       name: "Create Coure",
    //       status: "Career",
    //       path: "/dashboards/create-course",
    //     },
    //     {
    //       name: "Instructor",
    //       status: null,
    //       path: "/instructors",
    //     },
    //     {
    //       name: "Instructor (Dark)",
    //       status: null,
    //       path: "/instructors-dark",
    //     },
    //     {
    //       name: "Instructor Details",
    //       status: null,
    //       path: "/instructors/1",
    //     },
    //     {
    //       name: "Course Lesson",
    //       status: "New",
    //       path: "/lessons/1",
    //     },
    //   ],
    // },
    {
      items: (() => {
        const courseItems = [
          {
            name: "AI and Data science",
            path: "/ai-and-data-science-course",
          },
          {
            name: "Personality development",
            path: "/personality-development-course",
          },
          {
            name: "Vedic Mathematics",
            path: "/vedic-mathematics-course",
          },
          {
            name: "Digital Marketing with Data Analytics",
            path: "/digital-marketing-with-data-analytics-course",
          },
        ];
        // Sort alphabetically by name
        courseItems.sort((a, b) => a.name.localeCompare(b.name));
        // Add the View All Courses item at the end
        courseItems.push({
          name: "~View All Courses~",
          path: "/courses",
        });
        return courseItems;
      })(),
    },
  ];
  
  return (
    <div className="absolute top-full z-50 mt-1 left-0">
      <DropdownContainer 
        isOpen={isDropdownOpen} 
        onToggle={handleToggle}
        position="left"
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

export default DropdownCourses;
