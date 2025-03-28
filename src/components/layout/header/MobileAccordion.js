"use client";
import React from "react";
import AccordionController from "@/components/shared/accordion/AccordionController";
import Accordion from "@/components/shared/accordion/Accordion";
import AccordionContainer from "@/components/shared/containers/AccordionContainer";
import MobileLinkPrimary from "./MobileLinkPrimary";
import AccordionContent from "@/components/shared/accordion/AccordionContent";
import MobileLinkSecondary from "./MobileLinkSecondary";
import { motion, AnimatePresence } from "framer-motion";

/**
 * MobileAccordion Component
 * 
 * Enhanced mobile accordion for navigation with:
 * - Improved styling to match desktop dropdowns
 * - Better handling of status badges and indicators
 * - Smooth animations and transitions
 * - Consistent design with other navigation components
 */
const MobileAccordion = ({ items, children, isStudentDashboard = false }) => {
  const isAccordion = items[0]?.accordion;
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  // Special styling for student dashboard
  const studentDashboardClass = isStudentDashboard ? 
    'bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4' : '';
  
  if (isAccordion) {
    return (
      <motion.div 
        className={`mobile-accordion ${studentDashboardClass}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AccordionContainer>
          <AnimatePresence>
            {items.map(({ name, path, items, icon }, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                exit={{ opacity: 0, y: -20 }}
              >
                <Accordion>
                  <AccordionController type="primary">
                    <div className="flex items-center justify-between w-full py-3 px-4 group hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                      <div className="flex items-center">
                        {icon && <span className="mr-3 text-gray-500 group-hover:text-primary-600">{icon}</span>}
                        <MobileLinkPrimary item={{ name, path }} />
                      </div>
                    </div>
                  </AccordionController>
                  <AccordionContent className="pl-4 border-l border-gray-200 dark:border-gray-700 ml-4 mt-2">
                    <ul className="space-y-2 py-2">
                      {items.map((item, idx1) => (
                        <motion.li
                          key={idx1}
                          variants={itemVariants}
                          className="group"
                        >
                          <MobileLinkSecondary item={item} />
                        </motion.li>
                      ))}
                    </ul>
                  </AccordionContent>
                </Accordion>
              </motion.div>
            ))}
          </AnimatePresence>
          {children && (
            <motion.div 
              variants={itemVariants}
              className="pt-4"
            >
              {children}
            </motion.div>
          )}
        </AccordionContainer>
      </motion.div>
    );
  }
  
  // For non-accordion items (simple list)
  return (
    <motion.div
      className={studentDashboardClass}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <ul className="space-y-3 py-2">
        <AnimatePresence>
          {items.map((item, idx) => (
            <motion.li
              key={idx}
              variants={itemVariants}
              exit={{ opacity: 0, y: -20 }}
              className="group"
            >
              <div className="flex items-center py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                {item.icon && <span className="mr-3 text-gray-500 group-hover:text-primary-600">{item.icon}</span>}
                <MobileLinkPrimary item={item} />
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
        {children && (
          <motion.div 
            variants={itemVariants}
            className="pt-2"
          >
            {children}
          </motion.div>
        )}
      </ul>
    </motion.div>
  );
};

export default MobileAccordion;
