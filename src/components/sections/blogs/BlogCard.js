"use client";
import Image from "next/image";
import React from "react";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";

const BlogCard = ({ 
  imageSrc, 
  title, 
  id, 
  buttonText = "Read More",
  author = "Medh Team",
  date = "Recently Published",
  readTime = "5 min read"
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col group">
      {/* Image container with overlay effect */}
      <div className="relative overflow-hidden aspect-[16/9]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 opacity-30 group-hover:opacity-60 transition-opacity"></div>
        <Image
          src={imageSrc || "/placeholder-image.jpg"}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
          priority={false}
        />
        
        {/* Category tag - could be dynamic in the future */}
        <div className="absolute top-4 right-4 z-20">
          <span className="inline-block bg-primary-500/80 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
            Blog
          </span>
        </div>
      </div>
      
      {/* Content area */}
      <div className="flex-1 flex flex-col p-5">
        {/* Meta information */}
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-xs mb-3">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{readTime}</span>
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
          {title || "Untitled Blog Post"}
        </h3>
        
        {/* Author info */}
        <div className="flex items-center mt-auto mb-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <User className="h-4 w-4 mr-1.5 text-primary-500 dark:text-primary-400" />
            <span>By {author}</span>
          </div>
        </div>
        
        {/* Button */}
        <div className="mt-auto">
          <button className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 group-hover:translate-x-1 transition-transform">
            {buttonText || "Read More"}
            <ArrowRight className="ml-1.5 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
