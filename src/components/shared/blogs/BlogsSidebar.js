import React from "react";
import BlogAuthor from "./BlogAuthor";
import BlogCategories from "./BlogCategories";
import RecentPosts from "./RecentPosts";
import ImageGallery from "@/components/sections/sub-section/ImageGallery";
import BlogContactForm from "./BlogContactForm";
import BlogTags from "./BlogTags";
import BlogSocials from "./BlogSocials";
import BlogSearch from "./BlogSearch";
import BlogArchive from "@/components/shared/blogs/BlogArchive";

const BlogsSidebar = () => {
  return (
    <div className="flex flex-col">
      {/* author details */}
      {/* <BlogAuthor /> */}
      {/* search input */}
      <BlogSearch />
      {/* categories */}
      {/* <BlogCategories /> */}
      <BlogArchive />
      {/* recent posts */}
      {/* <RecentPosts /> */}
      <BlogTags />
      {/* photo gallary */}
      <div
        className="p-5 md:p-30px lg:p-5 2xl:p-30px mb-30px border border-borderColor2 dark:border-gray-600"
        data-aos="fade-up"
        style={{ boxShadow: "0px 10px 30px 0px #00000012" }}
      >
        <h4 className="text-size-22 text-blackColor dark:text-blackColor-dark font-bold pl-2 before:w-0.5 relative before:h-[21px] before:bg-[#F6B335] before:absolute before:bottom-[5px] before:left-0 leading-30px mb-25px">
          Photo
        </h4>
        <ImageGallery gallary={"mini"} />
      </div>
      {/* contact form */}
      {/* <BlogContactForm /> */}
      {/* tags */}
      {/* social area */}
      {/* <BlogSocials /> */}
    </div>
  );
};

export default BlogsSidebar;
