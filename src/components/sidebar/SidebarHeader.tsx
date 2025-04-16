"use client";

import React from 'react';
import Image from "next/image";
import { Bell, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface SidebarHeaderProps {
  logo: any;
  userName: string;
  userRole: string;
  userNotifications: number;
  isMobileDevice: boolean;
  welcomeMessage?: string;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  logo,
  userName,
  userRole,
  userNotifications,
  isMobileDevice,
  welcomeMessage: customWelcomeMessage
}) => {
  const router = useRouter();
  
  // Create personalized welcome message if not provided
  const welcomeMessage = customWelcomeMessage || (userName 
    ? `Hello, ${userName.split(' ')[0]}` 
    : `Hello, ${(userRole || 'User').charAt(0).toUpperCase() + (userRole || 'User').slice(1)}`);

  // Animation variants
  const logoVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } }
  };

  const profileVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3, delay: 0.1 } }
  };

  const notificationVariants = {
    initial: { scale: 0 },
    animate: { scale: 1, transition: { type: "spring", stiffness: 500, damping: 30, delay: 0.2 } }
  };
  
  return (
    <div className="p-4 sm:p-6 flex flex-col space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <motion.div
          variants={logoVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
        >
          <Image 
            src={logo} 
            alt="Medh Logo" 
            width={isMobileDevice ? 80 : 100} 
            height={isMobileDevice ? 80 : 100} 
            className="cursor-pointer" 
            onClick={() => router.push("/")}
            priority
          />
        </motion.div>
        
        <div className="flex items-center gap-2">
          <motion.button 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            {userNotifications > 0 && (
              <motion.span 
                className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 ring-1 ring-white dark:ring-gray-800"
                variants={notificationVariants}
                initial="initial"
                animate="animate"
              />
            )}
          </motion.button>
          
          <motion.button 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </motion.button>
        </div>
      </div>
      
      {/* User welcome card */}
      <motion.div 
        className="flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-primary-50 to-white dark:from-primary-900/10 dark:to-gray-800 rounded-xl border border-primary-100/50 dark:border-primary-800/20 shadow-sm"
        variants={profileVariants}
        initial="initial"
        animate="animate"
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
      >
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold shadow-sm">
          {userName ? userName.charAt(0).toUpperCase() : (userRole || 'U').charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-primary-700 dark:text-primary-400">
            {welcomeMessage}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {(userRole || 'User').charAt(0).toUpperCase() + (userRole || 'User').slice(1)} Account
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SidebarHeader; 