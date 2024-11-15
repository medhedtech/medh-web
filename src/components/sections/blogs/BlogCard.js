"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { FaArrowRight } from "react-icons/fa";

const BlogCard = ({ imageSrc, title, id }) => {
  const router = useRouter();
  return (
    <div className="max-w-sm overflow-hidden dark:bg-screen-dark mx-0 md:mx-2 dark:shadow-gray-800 dark:border-whitegrey border space-x-6 flex flex-col justify-between shadow-lg ">
      <Image
        src={imageSrc}
        alt={title}
        width={353}
        height={300}
        className="w-full h-[300px] object-cover dark:border-b dark:border-gray600"
      />
      <div className="px-1 py-4">
        <div
          onClick={() => router.push(`/blogs`)}
          // onClick={() => router.push(`/blog/${id}`)}
          className="text-lg font-[600] text-[#252525 text-xl mb-2 line-clamp-2 overflow-hidden cursor-pointer hover:text-[#7ECA9D] transition-colors duration-200"
        >
          {title}
        </div>
      </div>
      <div className="px-2 pt-4 pb-2">
        <button
          onClick={() => router.push(`/blogs`)}
          // onClick={() => router.push(`/blog/${id}`)}
          className="bg-blue-500 hover:bg-blue-700 text-[#252525] font-[400] py-2 rounded hover:text-[#7ECA9D] hover:underline transition-colors duration-200"
        >
          Read More{" "}
          <FaArrowRight className="inline-block text-[#252525] text-[12px]" />
        </button>
      </div>
    </div>
  );
};

export default BlogCard;
