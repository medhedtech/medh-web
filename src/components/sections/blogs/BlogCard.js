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
          loading="lazy"
          quality={75}
        />
        
        {/* Category tag - could be dynamic in the future */}
        <div className="absolute top-4 right-4 z-20">
          <span className="inline-block bg-primary-500/80 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
            Blog
          </span>
        </div>
      </div>
      
      {/* Content area */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Meta information */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{readTime}</span>
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 flex-grow">
          {title}
        </h3>
        
        {/* Read More Button */}
        <button className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors">
          {buttonText}
          <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default BlogCard;
