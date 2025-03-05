"use client";
import React from "react";
import AccordionController from "@/components/shared/accordion/AccordionController";
import Accordion from "@/components/shared/accordion/Accordion";
import AccordionContainer from "@/components/shared/containers/AccordionContainer";
import MobileLinkPrimary from "./MobileLinkPrimary";
import AccordionContent from "@/components/shared/accordion/AccordionContent";
import MobileLinkSecondary from "./MobileLinkSecondary";
import { ChevronRight } from "lucide-react";

/**
 * MobileAccordion Component
 * 
 * Enhanced mobile accordion for navigation with:
 * - Improved styling to match desktop dropdowns
 * - Better handling of status badges and indicators
 * - Smooth animations and transitions
 * - Consistent design with other navigation components
 */
const MobileAccordion = ({ items, children }) => {
  const isAccordion = items[0]?.accordion;
  
  if (isAccordion) {
    return (
      <div className="mobile-accordion">
        <AccordionContainer>
          {items.map(({ name, path, items }, idx) => (
            <Accordion key={idx}>
              <AccordionController type="primary">
                <div className="flex items-center justify-between w-full py-2 group">
                  <MobileLinkPrimary item={{ name, path }} />
                  <ChevronRight className="w-4 h-4 transform transition-transform duration-300 group-aria-expanded:rotate-90 text-gray-500 dark:text-gray-400" />
                </div>
              </AccordionController>
              <AccordionContent className="pl-3 border-l border-gray-200 dark:border-gray-700 ml-2">
                <ul className="space-y-1 py-1">
                  {items.map((item, idx1) => (
                    <li key={idx1} className="group">
                      <MobileLinkSecondary item={item} />
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </Accordion>
          ))}
          {children && (
            <div className="pt-2">
              {children}
            </div>
          )}
        </AccordionContainer>
      </div>
    );
  }
  
  // For non-accordion items (simple list)
  return (
    <ul className="space-y-2 py-2">
      {items.map((item, idx) => (
        <li key={idx} className="group">
          <MobileLinkPrimary item={item} />
        </li>
      ))}
      {children && children}
    </ul>
  );
};

export default MobileAccordion;
