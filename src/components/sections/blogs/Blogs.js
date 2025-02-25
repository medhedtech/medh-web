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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={40} className="text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <section className={`py-16 sm:py-20 bg-gray-50 dark:bg-gray-900 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-secondary-100/50 dark:bg-secondary-900/10 rounded-full blur-3xl opacity-50 transform -translate-x-1/3 translate-y-1/4"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <span className="inline-block px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full mb-2">
              EXPLORE NEWS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Latest from Medh Blogs
            </h2>
          </div>
          
          <button
            onClick={() => window.open("/blogs", "_blank")}
            className="inline-flex items-center px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Read all blogs"
          >
            <Eye className="mr-2 h-5 w-5" />
            <span>Read All</span>
          </button>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <BookOpen className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No blogs found</h3>
            <p className="text-gray-600 dark:text-gray-400">Check back later for new content</p>
          </div>
        ) : (
          <div className="relative">
            {/* Blog slider with custom styles */}
            <div className="relative -mx-4 px-4 py-6">
              <Slider {...settings} className="blogs-slider">
                {blogs.map((blog) => (
                  <div key={blog._id} className="px-3 pb-2">
                    <Link
                      href={blog?.blog_link || "#"}
                      className="no-underline block h-full transform transition-transform duration-300 hover:-translate-y-1"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Read blog: ${blog.title}`}
                    >
                      <BlogCard
                        id={blog._id}
                        imageSrc={blog.upload_image || ""}
                        title={blog.title}
                        buttonText={blog.buttonText}
                      />
                    </Link>
                  </div>
                ))}
              </Slider>
            </div>
            
            {/* View all link (mobile-friendly) */}
            <div className="text-center mt-8">
              <Link 
                href="/blogs"
                className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                View all blog posts
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Add custom styles for the slick slider to match our design system */}
        <style jsx global>{`
          .blogs-slider .slick-dots li button:before {
            color: var(--primary-500);
            opacity: 0.3;
            font-size: 10px;
          }
          .blogs-slider .slick-dots li.slick-active button:before {
            color: var(--primary-500);
            opacity: 1;
          }
          .blogs-slider .slick-prev,
          .blogs-slider .slick-next {
            width: 40px;
            height: 40px;
            background-color: white;
            border-radius: 50%;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            z-index: 10;
            transition: all 0.2s;
          }
          .blogs-slider .slick-prev:hover,
          .blogs-slider .slick-next:hover {
            background-color: var(--primary-50);
            transform: scale(1.05);
          }
          .blogs-slider .slick-prev {
            left: -5px;
          }
          .blogs-slider .slick-next {
            right: -5px;
          }
          .blogs-slider .slick-prev:before,
          .blogs-slider .slick-next:before {
            color: var(--primary-500);
            font-size: 20px;
          }
          
          @media (max-width: 640px) {
            .blogs-slider .slick-prev,
            .blogs-slider .slick-next {
              display: none !important;
            }
          }
          
          /* Dark mode adjustments */
          .dark .blogs-slider .slick-prev,
          .dark .blogs-slider .slick-next {
            background-color: var(--gray-800);
          }
          .dark .blogs-slider .slick-prev:hover,
          .dark .blogs-slider .slick-next:hover {
            background-color: var(--gray-700);
          }
          .dark .blogs-slider .slick-prev:before,
          .dark .blogs-slider .slick-next:before {
            color: var(--primary-400);
          }
        `}</style>
      </div>
    </section>
  );
};

export default Blogs;
