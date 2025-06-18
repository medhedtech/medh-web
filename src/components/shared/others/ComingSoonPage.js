"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Rocket, Calendar, Bell, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ComingSoonPage = ({ 
  title = "Coming Soon", 
  description = "We're working on something awesome!", 
  returnPath = "/dashboards/student" 
}) => {
  const [email, setEmail] = useState("");
  const [isNotified, setIsNotified] = useState(false);
  
  // Random floating elements
  const floatingElements = [
    { icon: "🚀", delay: 0, x: -20, y: -15 },
    { icon: "💫", delay: 1.4, x: 25, y: 10 },
    { icon: "⭐", delay: 0.8, x: -10, y: 20 },
    { icon: "🌟", delay: 2.2, x: 15, y: -25 },
    { icon: "🎮", delay: 3, x: -30, y: 5 },
    { icon: "🔥", delay: 1, x: 20, y: 30 },
  ];

  const handleNotifyMe = (e) => {
    e.preventDefault();
    if (email) {
      // Here you would normally send the email to your API
      console.log("Notify request for:", email);
      setIsNotified(true);
      setEmail("");
      
      // Reset notification status after 3 seconds
      setTimeout(() => {
        setIsNotified(false);
      }, 3000);
    }
  };

  return (
    <div className="relative min-h-[80vh] w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 w-40 h-40 bg-purple-200 dark:bg-purple-900/30 rounded-full filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-pink-200 dark:bg-pink-900/30 rounded-full filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-blue-200 dark:bg-blue-900/30 rounded-full filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>
      
      {/* Floating elements */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute text-4xl z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: [0.4, 0.8, 0.4], 
            y: [0, -15, 0],
            x: [0, element.x, 0] 
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            delay: element.delay,
            repeatType: "reverse" 
          }}
          style={{ 
            top: `${(index * 13 + 15) % 80 + 10}%`,
            left: `${(index * 17 + 20) % 80 + 10}%`,
          }}
        >
          {element.icon}
        </motion.div>
      ))}

      {/* Main content */}
      <motion.div 
        className="z-10 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl max-w-2xl w-full mx-4 relative overflow-hidden border border-gray-100 dark:border-gray-700"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Decorative elements */}
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-purple-100 dark:bg-purple-900/20 rounded-full"></div>
        <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-4">
            <motion.div
              className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-full"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="w-8 h-8 text-purple-500" />
            </motion.div>
          </div>
          
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            {title}
          </motion.h1>
          
          <motion.p
            className="text-center text-gray-600 dark:text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {description}
          </motion.p>
          
          {/* Features list */}
          <motion.div
            className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-full">
                <Rocket className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Interactive Learning</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Engaging quizzes designed for maximum retention</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Track Progress</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Monitor your improvement over time</p>
              </div>
            </div>
          </motion.div>
          
          {/* Notification form */}
          <motion.form
            onSubmit={handleNotifyMe}
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="relative flex-grow">
                <Bell className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white"
                  required
                />
              </div>
              <motion.button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Notify Me
              </motion.button>
            </div>
            
            {isNotified && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-center text-green-600 dark:text-green-400 text-sm"
              >
                Thanks! We'll notify you when this feature launches.
              </motion.p>
            )}
          </motion.form>
          
          {/* Return link */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link href={returnPath} className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium">
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Return to Dashboard
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ComingSoonPage; 