"use client";
import React from "react";
import AccordionController from "@/components/shared/accordion/AccordionController";
import MobileLink from "./MobileLink";
import Accordion from "@/components/shared/accordion/Accordion";
import AccordionContent from "@/components/shared/accordion/AccordionContent";
/**
 * MobileMenuItem Component
 * 
 * Enhanced mobile menu item that supports:
 * - Exact match with desktop navigation structure and behavior
 * - Support for isRelative property from NavItems.js
 * - Active state styling
 * - Improved visual design matching desktop navigation
 * - Accessibility improvements
 */
const MobileMenuItem = ({ item }) => {
  // Destructure all properties used in NavItems.js for exact matching
  const { name, path, children, accordion, isActive, isRelative } = item;

  // Component for accordion items (with dropdowns)
  if (accordion) {
    return (
      <Accordion>
        <AccordionController type="primary">
          <div className={`flex items-center justify-between w-full py-2 group
            ${isActive ? 'text-primary-600 dark:text-primary-400 font-medium' : 
              'text-gray-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400'}`}
          >
            <MobileLink 
              item={{ 
                name, 
                path,
                isActive,
                isRelative 
              }} 
            />
          </div>
        </AccordionController>
        <AccordionContent className="pl-3 border-l border-gray-200 dark:border-gray-700 ml-3 mt-1">
          {children}
        </AccordionContent>
      </Accordion>
    );
  }
  
  // Component for regular links (no dropdown) - exact match with desktop nav
  return (
    <div className={`py-2 transition-colors duration-200
      ${isActive ? 'text-primary-600 dark:text-primary-400 font-medium' : 
        'text-gray-800 dark:text-gray-200'}`}
    >
      <MobileLink 
        item={{ 
          name, 
          path,
          isActive,
          isRelative 
        }} 
      />
    </div>
  );
};

export default MobileMenuItem;
