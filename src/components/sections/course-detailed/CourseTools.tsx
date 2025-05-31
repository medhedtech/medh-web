import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Filter, X } from "lucide-react";
import Image from "next/image";

// TypeScript Interfaces
interface IToolTechnology {
  name: string;
  category: string;
  description: string;
  logo_url: string;
}

interface ICourseToolsProps {
  tools: IToolTechnology[];
}

const CourseTools: React.FC<ICourseToolsProps> = ({ tools }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    if (!tools?.length) return [];
    return Array.from(new Set(tools.map(tool => tool.category)));
  }, [tools]);

  // Filter tools by category
  const filteredTools = useMemo(() => {
    if (!tools?.length) return [];
    if (!selectedCategory) return tools;
    return tools.filter(tool => tool.category === selectedCategory);
  }, [tools, selectedCategory]);

  const getSafeImageUrl = (url: string | undefined): string => {
    if (!url) return '';
    
    // Handle relative URLs
    if (url.startsWith('/')) {
      return url;
    }
    
    // Handle full URLs
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Assume it's a relative path and make it absolute
    return `/${url}`;
  };

  if (!tools?.length) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
            <Code2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          Tools & Technologies
        </h2>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Active Filter Badge */}
      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2"
        >
          <span className="text-sm text-gray-600 dark:text-gray-400">Filtered by:</span>
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
            {selectedCategory}
            <button
              onClick={() => setSelectedCategory(null)}
              className="hover:bg-purple-200 dark:hover:bg-purple-800/50 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredTools.map((tool, index) => (
            <motion.div
              key={`${tool.name}-${tool.category}`}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-700 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                {/* Tool Logo */}
                <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {tool.logo_url && getSafeImageUrl(tool.logo_url) ? (
                    <Image 
                      src={getSafeImageUrl(tool.logo_url)} 
                      alt={tool.name} 
                      width={40} 
                      height={40} 
                      className="object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center ${tool.logo_url ? 'hidden' : ''}`}>
                    <Code2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>

                {/* Tool Info */}
                <div className="flex-1 min-w-0">
                  <div className="mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {tool.name}
                    </h3>
                    <span className="inline-block mt-1 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-600 dark:text-gray-300">
                      {tool.category}
                    </span>
                  </div>
                  {tool.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                      {tool.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredTools.length === 0 && selectedCategory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <Code2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No tools found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No tools found in the "{selectedCategory}" category.
          </p>
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
          >
            View all tools
          </button>
        </motion.div>
      )}
    </motion.section>
  );
};

export default CourseTools; 