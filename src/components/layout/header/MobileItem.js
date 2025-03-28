"use client";
import React from "react";
import AccordionController from "@/components/shared/accordion/AccordionController";
import MobileLink from "./MobileLink";
import Accordion from "@/components/shared/accordion/Accordion";
import AccordionContent from "@/components/shared/accordion/AccordionContent";
import { motion } from "framer-motion";
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
const MobileMenuItem = ({ item, isStudentDashboard = false }) => {
  // Destructure all properties used in NavItems.js for exact matching
  const { name, path, children, accordion, isActive, isRelative, icon } = item;

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  // Special styling for student dashboard items
  const studentDashboardClass = isStudentDashboard ? 
    'py-3 px-4 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800' : 
    'py-2';

  // Component for accordion items (with dropdowns)
  if (accordion) {
    return (
      <motion.div
        variants={menuItemVariants}
        initial="hidden"
        animate="visible"
      >
        <Accordion>
          <AccordionController type="primary">
            <div className={`flex items-center justify-between w-full group ${studentDashboardClass}
              ${isActive ? 'text-primary-600 dark:text-primary-400 font-medium' : 
                'text-gray-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400'}`}
            >
              {icon && <span className="mr-3 text-gray-500 group-hover:text-primary-600">{icon}</span>}
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
          <AccordionContent className="pl-4 border-l border-gray-200 dark:border-gray-700 ml-4 mt-2 space-y-2">
            {children}
          </AccordionContent>
        </Accordion>
      </motion.div>
    );
  }
  
  // Component for regular links (no dropdown) - exact match with desktop nav
  return (
    <motion.div
      variants={menuItemVariants}
      initial="hidden"
      animate="visible"
      className={`transition-colors duration-200 ${studentDashboardClass}
        ${isActive ? 'text-primary-600 dark:text-primary-400 font-medium' : 
          'text-gray-800 dark:text-gray-200'}`}
    >
      <div className="flex items-center">
        {icon && <span className="mr-3 text-gray-500 group-hover:text-primary-600">{icon}</span>}
        <MobileLink 
          item={{ 
            name, 
            path,
            isActive,
            isRelative 
          }} 
        />
      </div>
    </motion.div>
  );
};

export default MobileMenuItem;
