import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, Plus, Minus } from "lucide-react";

// TypeScript Interfaces
interface IFAQ {
  question: string;
  answer: string;
}

interface IModernCourseFAQProps {
  faqs: IFAQ[];
}

const ModernCourseFAQ: React.FC<IModernCourseFAQProps> = ({ faqs }) => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  if (!faqs?.length) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
          <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        Frequently Asked Questions
      </h2>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isExpanded = expandedFaq === index;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-700 transition-all"
            >
              <motion.button
                onClick={() => toggleFaq(index)}
                className="flex justify-between items-center w-full p-6 text-left focus:outline-none group"
                whileHover={{ backgroundColor: "rgba(139, 92, 246, 0.02)" }}
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white pr-8 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {faq.question}
                </h3>
                <div className={`transition-all duration-300 flex-shrink-0 ${
                  isExpanded 
                    ? 'rotate-180 text-purple-600 dark:text-purple-400' 
                    : 'text-gray-400 group-hover:text-purple-500'
                }`}>
                  {isExpanded ? (
                    <Minus className="w-5 h-5" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                </div>
              </motion.button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-700 pt-4">
                      <motion.p
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-600 dark:text-gray-300 leading-relaxed"
                      >
                        {faq.answer}
                      </motion.p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default ModernCourseFAQ; 