"use client";

import { motion } from 'framer-motion';
import { Loader2, FileText, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

const BlogsLoading: React.FC = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isDark = mounted ? theme === 'dark' : true;
  
  return (
    <div className={`min-h-screen flex items-center justify-center transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`text-center p-8 backdrop-blur-xl rounded-2xl border shadow-2xl max-w-md ${
          isDark 
            ? 'bg-white/5 border-white/10 text-white' 
            : 'bg-white/80 border-gray-200/50 text-gray-900'
        }`}
      >
        {/* Animated Icons */}
        <div className="relative mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${
              isDark ? 'bg-primary-500/20' : 'bg-primary-500/10'
            }`}
          >
            <FileText className={`w-8 h-8 ${
              isDark ? 'text-primary-400' : 'text-primary-600'
            }`} />
          </motion.div>
          
          {/* Sparkles animation */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className={`w-4 h-4 ${
              isDark ? 'text-yellow-400' : 'text-yellow-500'
            }`} />
          </motion.div>
        </div>

        {/* Loading spinner */}
        <Loader2 className={`w-8 h-8 mx-auto mb-4 animate-spin ${
          isDark ? 'text-primary-400' : 'text-primary-600'
        }`} />
        
        {/* Loading text */}
        <h2 className="text-xl font-bold mb-2">Preparing Blog Editor</h2>
        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Setting up your creative workspace...
        </p>
        
        {/* Progress dots */}
        <div className="flex justify-center space-x-2 mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ 
                duration: 0.8, 
                repeat: Infinity, 
                delay: i * 0.2 
              }}
              className={`w-2 h-2 rounded-full ${
                isDark ? 'bg-primary-400' : 'bg-primary-600'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default BlogsLoading; 