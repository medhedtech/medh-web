'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Construction, 
  ArrowLeft, 
  RefreshCw, 
  Home,
  Search,
  MapPin,
  Sparkles
} from 'lucide-react';

const Error1 = () => {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);

  // Mouse parallax effect
  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e) => {
      if (!mounted || typeof window === 'undefined') return;
      const { clientX, clientY } = e;
      const moveX = (clientX - window.innerWidth / 2) * 0.02;
      const moveY = (clientY - window.innerHeight / 2) * 0.02;
      setMousePosition({ x: moveX, y: moveY });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [mounted]);

  // Generate decorative particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 20 }, (_, index) => ({
        id: `particle_${index}`,
        x: (index * 17 + 13) % 100,
        y: (index * 23 + 19) % 100,
        size: (index % 6) + 2,
        duration: (index % 10) + 10,
        delay: (index % 5)
      }));
      setParticles(newParticles);
    };

    generateParticles();

    // Regenerate particles occasionally
    const interval = setInterval(generateParticles, 10000);
    return () => clearInterval(interval);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const floatVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center overflow-hidden relative px-4">
      {/* Decorative particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-emerald-400/20 to-blue-400/20 dark:from-emerald-400/10 dark:to-blue-400/10 blur-sm"
          style={{ 
            left: `${particle.x}%`, 
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`
          }}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.5, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            repeatDelay: (particle.delay || 0) * 1.6
          }}
        />
      ))}

      <motion.div 
        className="relative z-10 max-w-3xl mx-auto text-center"
        style={{ 
          x: mousePosition.x, 
          y: mousePosition.y 
        }}
        transition={{ type: "spring", stiffness: 100 }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 404 text */}
        <motion.div 
          className="text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 mb-2 md:mb-6 relative"
          variants={itemVariants}
        >
          404
          <motion.div 
            className="absolute -right-8 -top-6 text-emerald-500 dark:text-emerald-400"
            variants={floatVariants}
            animate="animate"
          >
            <Sparkles className="h-12 w-12 opacity-70" />
          </motion.div>
        </motion.div>

        {/* Page description */}
        <motion.h1 
          className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-gray-800 dark:text-white"
          variants={itemVariants}
        >
          Page Not Found
        </motion.h1>

        <motion.div 
          className="mb-8 text-gray-600 dark:text-gray-300 max-w-xl mx-auto text-lg"
          variants={itemVariants}
        >
          <p className="mb-2">This page is either under construction or you've taken a wrong turn.</p>
          <p>We're working hard to bring more features to life.</p>
        </motion.div>

        {/* Construction icon */}
        <motion.div 
          className="flex justify-center mb-10"
          variants={itemVariants}
        >
          <motion.div 
            className="bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 p-6 rounded-full shadow-inner"
            variants={pulseVariants}
            animate="animate"
          >
            <Construction className="h-14 w-14 text-amber-500 dark:text-amber-400" />
          </motion.div>
        </motion.div>

        {/* Action buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
          variants={itemVariants}
        >
          <Link href="/" className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-full font-medium shadow-lg shadow-emerald-500/20 transition-all">
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          
          <Link href="/enrollment" className="flex items-center gap-2 bg-white dark:bg-gray-800 px-6 py-3 rounded-full font-medium text-gray-800 dark:text-gray-100 shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700">
            <Search className="h-4 w-4" />
            <span>Explore Courses</span>
          </Link>
        </motion.div>

        {/* Back button */}
        <motion.div 
          className="mt-10"
          variants={itemVariants}
        >
          <button 
            onClick={() => window.history.back()} 
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Go Back</span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Error1;
