"use client";

import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useRouter } from "next/navigation";
import BlogCard from "./BlogCard";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import Preloader from "@/components/shared/others/Preloader";
import Link from "next/link";
import { Eye, ChevronRight, BookOpen, Loader2 } from "lucide-react";

const Blogs = () => {
  const router = useRouter();
  const { getQuery, loading } = useGetQuery();
  const [blogs, setBlogs] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Add entrance animation effect
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    arrows: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    centerMode: true,
    centerPadding: "0",
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: true,
          arrows: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          arrows: false,
          dots: true,
        },
      },
    ],
  };

  // Fetch Blogs Data from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        await getQuery({
          url: apiUrls?.Blogs?.getAllBlogs,
          onSuccess: (response) => {
            if (response.success) {
              setBlogs(response.data);
            } else {
              console.error("Failed to fetch blogs: ", response.message);
              setBlogs([]);
            }
          },
          onFail: (err) => {
            console.error("API error:", err);
            setBlogs([]);
          },
        });
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
        setBlogs([]);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-5">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
            Latest Articles & Insights
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-2xl">
            Stay updated with the latest trends, tips, and educational insights
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link 
            href="/blogs"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg group"
          >
            <span>View All Articles</span>
            <ChevronRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8 md:p-6 bg-white dark:bg-gray-800/10 rounded-xl">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
            <span className="text-gray-700 dark:text-gray-300">Loading articles...</span>
          </div>
        </div>
      ) : blogs.length > 0 ? (
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-900/30 dark:via-gray-900 dark:to-gray-900/30 p-5 md:p-4 shadow-sm">
          <Slider {...settings}>
            {blogs.map((blog) => (
              <div key={blog._id} className="p-2 md:p-1.5">
                <BlogCard blog={blog} />
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 md:p-5 text-center bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl">
          <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-200/50 dark:bg-gray-700/50">
            <BookOpen className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
            No Articles Available
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            We're working on new insightful articles. Check back soon!
          </p>
          <Link href="/contact-us" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-lg transition-all duration-300">
            Suggest a Topic
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Blogs;
