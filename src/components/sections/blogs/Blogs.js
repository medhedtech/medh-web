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

const EyeIcon = () => {
  return (
    <svg
      width="22"
      height="16"
      viewBox="0 0 22 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.165 8.10205C12.5954 8.10205 12.1071 7.8986 11.7002 7.4917C11.2933 7.0848 11.0898 6.59652 11.0898 6.02686C11.0898 5.84782 11.1143 5.67285 11.1631 5.50195C11.2119 5.33105 11.277 5.16423 11.3584 5.00146C11.3258 5.00146 11.2852 4.9974 11.2363 4.98926C11.1875 4.98112 11.1387 4.97705 11.0898 4.97705C10.2272 4.99333 9.49072 5.30257 8.88037 5.90479C8.27002 6.507 7.96484 7.23942 7.96484 8.10205C7.96484 8.96468 8.27002 9.70117 8.88037 10.3115C9.49072 10.9219 10.2272 11.2271 11.0898 11.2271C11.9525 11.2271 12.689 10.9219 13.2993 10.3115C13.9097 9.70117 14.2148 8.96468 14.2148 8.10205C14.2148 8.05322 14.2108 8.00846 14.2026 7.96777C14.1945 7.92708 14.1904 7.88232 14.1904 7.8335C14.0439 7.91488 13.8853 7.97998 13.7144 8.02881C13.5435 8.07764 13.3604 8.10205 13.165 8.10205ZM11.0898 0.82666C9.10417 0.82666 7.44401 1.18473 6.10938 1.90088C4.79102 2.61702 3.73307 3.40641 2.93555 4.26904C2.13802 5.13167 1.56836 5.9292 1.22656 6.66162C0.901042 7.39404 0.738281 7.76839 0.738281 7.78467L0.616211 8.10205L0.738281 8.44385C0.738281 8.46012 0.901042 8.82633 1.22656 9.54248C1.56836 10.2749 2.13802 11.0765 2.93555 11.9473C3.73307 12.818 4.79102 13.6115 6.10938 14.3276C7.44401 15.0438 9.10417 15.4019 11.0898 15.4019C13.0755 15.4019 14.7357 15.0438 16.0703 14.3276C17.3887 13.6115 18.4466 12.818 19.2441 11.9473C20.0417 11.0765 20.6113 10.2749 20.9531 9.54248C21.2786 8.82633 21.4414 8.46012 21.4414 8.44385L21.5635 8.10205L21.4414 7.78467C21.4414 7.76839 21.2786 7.39404 20.9531 6.66162C20.6113 5.9292 20.0417 5.13167 19.2441 4.26904C18.4466 3.40641 17.3887 2.61702 16.0703 1.90088C14.7357 1.18473 13.0755 0.82666 11.0898 0.82666ZM11.0898 13.3267C9.6901 13.3267 8.50195 13.1069 7.52539 12.6675C6.53255 12.2443 5.71061 11.7438 5.05957 11.166C4.40853 10.5882 3.91211 10.0063 3.57031 9.42041C3.21224 8.85075 2.9681 8.4113 2.83789 8.10205C2.9681 7.80908 3.21224 7.36963 3.57031 6.78369C3.91211 6.19775 4.40853 5.61995 5.05957 5.05029C5.71061 4.48063 6.53255 3.97607 7.52539 3.53662C8.50195 3.11344 9.6901 2.90186 11.0898 2.90186C12.4896 2.90186 13.6777 3.11344 14.6543 3.53662C15.6471 3.97607 16.4691 4.48063 17.1201 5.05029C17.7712 5.61995 18.2676 6.19775 18.6094 6.78369C18.9674 7.36963 19.2116 7.80908 19.3418 8.10205C19.2116 8.4113 18.9674 8.85075 18.6094 9.42041C18.2676 10.0063 17.7712 10.5882 17.1201 11.166C16.4691 11.7438 15.6471 12.2443 14.6543 12.6675C13.6777 13.1069 12.4896 13.3267 11.0898 13.3267Z"
        fill="white"
      />
    </svg>
  );
};

const Blogs = () => {
  const router = useRouter();
  const { getQuery, loading } = useGetQuery();
  const [blogs, setBlogs] = useState([]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
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
    return <Preloader />;
  }

  return (
    <div className="container py-100px font-Poppins">
      <div className="flex flex-col px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div>
            <span className="text-[#7ECA9D] font-Poppins font-medium text-[15px] leading-[22px]">
              EXPLORE NEWS
            </span>
            <h1 className="text-[#5C6574] font-bold text-[38px] leading-[55px] dark:text-gray-200">
              Latest from Medh Blogs
            </h1>
          </div>
          <div
            className="flex items-center gap-3 bg-[#7ECA9D] text-white px-3.5 py-2 rounded-md cursor-pointer"
            onClick={() => router.push("/blogs")}
          >
            <div>
              <EyeIcon />
            </div>
            <button className="text-sm">Read All</button>
          </div>
        </div>
        <div className="bg-transparent">
          <Slider {...settings}>
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                href={blog?.blog_link || "#"}
                className="no-underline"
                scroll={false}
              >
                <BlogCard
                  id={blog._id}
                  imageSrc={blog.upload_image || ""}
                  title={blog.title}
                  buttonText={blog.buttonText}
                />
              </Link>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
