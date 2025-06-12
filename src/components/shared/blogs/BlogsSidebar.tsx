import React from "react";
import { motion } from "framer-motion";
import BlogAuthor from "./BlogAuthor";
import BlogCategories from "./BlogCategories";
import RecentPosts from "./RecentPosts";
import ImageGallery from "@/components/sections/sub-section/ImageGallery";
import BlogContactForm from "./BlogContactForm";
import BlogTags from "./BlogTags";
import BlogSocials from "./BlogSocials";
import BlogSearch from "./BlogSearch";
import BlogArchive from "@/components/shared/blogs/BlogArchive";
import { Camera, Sparkles } from "lucide-react";

const BlogsSidebar: React.FC = () => {
  const sidebarVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col space-y-8"
    >
      {/* Search Section */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <BlogSearch />
      </motion.div>

      {/* Archive Section */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <BlogArchive />
      </motion.div>

      {/* Tags Section */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <BlogTags />
      </motion.div>

      {/* Photo Gallery Section */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        data-aos="fade-up"
      >
        <div className="p-6">
          {/* Enhanced Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
              <Camera className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                Photo Gallery
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Visual insights & moments
              </p>
            </div>
          </div>
          
          {/* Gallery Content */}
          <div className="relative">
            <ImageGallery gallary={"mini"} />
            
            {/* Decorative overlay */}
            <div className="absolute top-2 right-2 opacity-50">
              <Sparkles className="w-4 h-4 text-yellow-500" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Posts - Hidden for now, can be uncommented if needed */}
      {/* 
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <RecentPosts />
      </motion.div>
      */}

      {/* Author Section - Hidden for now, can be uncommented if needed */}
      {/* 
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <BlogAuthor />
      </motion.div>
      */}

      {/* Categories Section - Hidden for now, can be uncommented if needed */}
      {/* 
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <BlogCategories />
      </motion.div>
      */}

      {/* Contact Form - Hidden for now, can be uncommented if needed */}
      {/* 
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <BlogContactForm />
      </motion.div>
      */}

      {/* Social Links - Hidden for now, can be uncommented if needed */}
      {/* 
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <BlogSocials />
      </motion.div>
      */}
    </motion.div>
  );
};

export default BlogsSidebar;
