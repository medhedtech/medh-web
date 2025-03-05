"use client";
import React from "react";
import MobileAccordion from "./MobileAccordion";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

/**
 * AccordionMore Component
 * 
 * Mobile version of the "More" dropdown menu, with consistent styling and structure
 * as the desktop dropdown, optimized for mobile navigation.
 */
const AccordionMore = () => {
  // Using the same items as in DropdownMore.js
  const items = [
    {
      name: "About Medh",
      path: "#",
      accordion: true,
      items: [
        {
          name: "About Us",
          path: "/about-us",
        },
        {
          name: "News and Media",
          path: "/news-and-media",
        },
        {
          name: "Membership",
          path: "/medh-membership",
        },
        {
          name: "Team",
          path: "/medh-team",
        },
      ],
    },
    {
      name: "Join Medh",
      path: "#",
      accordion: true,
      items: [
        {
          name: "Join Us as an Educator",
          path: "/join-us-as-educator",
          status: "Popular",
        },
        {
          name: "Join Us as a School / Institute",
          path: "/join-us-as-school-institute",
        },
        {
          name: "Careers @medh",
          path: "/careers-at-medh",
          badge: "Hiring",
        },
      ],
    },
  ];

  return (
    <div className="space-y-2">
      {/* Main accordion navigation */}
      <MobileAccordion items={items} />
      
      {/* Direct contact link highlighted separately */}
      <div className="mt-3 px-2">
        <Link 
          href="/contact-us"
          className="flex items-center justify-between w-full py-2.5 px-3 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-900/30 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors duration-200"
        >
          <span>Contact Us</span>
          <ExternalLink size={16} className="ml-2 text-primary-500 dark:text-primary-400" />
        </Link>
      </div>
    </div>
  );
};

export default AccordionMore; 