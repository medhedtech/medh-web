import BlogsPrimary from "@/components/sections/blogs/BlogsPrimary";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import React from "react";

const BlogsMain = ({ initialBlogs = [], totalBlogs = 0, initialFilters = {} }) => {
  // Prepare title based on filters
  let heroTitle = "LEARN GROW INSPIRE CONTINUOUSLY";
  let heroDescription = "Explore our latest educational insights, tips, and industry trends";
  
  if (initialFilters.category) {
    heroTitle = `${initialFilters.category} Articles`;
    heroDescription = `Explore our educational insights about ${initialFilters.category}`;
  } else if (initialFilters.tag) {
    heroTitle = `${initialFilters.tag} Articles`;
    heroDescription = `Explore our educational content related to ${initialFilters.tag}`;
  } else if (initialFilters.featured) {
    heroTitle = "Featured Articles";
    heroDescription = "Our selection of must-read educational content";
  }
  
  return (
    <>
      <HeroPrimary 
        title={heroTitle} 
        path="Blogs" 
        description={heroDescription}
        className="bg-gradient-to-r from-primary-50 via-white to-secondary-50 dark:from-primary-900/10 dark:via-gray-900 dark:to-secondary-900/10"
      />
      <BlogsPrimary 
        initialBlogs={initialBlogs} 
        totalBlogs={totalBlogs}
        initialFilters={initialFilters}
      />
    </>
  );
};

export default BlogsMain;
