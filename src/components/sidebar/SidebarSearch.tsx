"use client";

import React, { useState } from 'react';
import { Search } from "lucide-react";
import { motion } from "framer-motion";

interface SidebarSearchProps {
  onSearch?: (term: string) => void;
}

const SidebarSearch: React.FC<SidebarSearchProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (onSearch) {
      onSearch(value);
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };
  
  return (
    <motion.div 
      className="px-4 mb-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="relative">
        <input
          type="text"
          placeholder="Search menu..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-3 py-1.5 pl-8 text-sm bg-gray-100 dark:bg-gray-700/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 transition-all duration-200"
          aria-label="Search menu"
        />
        <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" />
      </div>
    </motion.div>
  );
};

export default SidebarSearch; 