import React from 'react';

const BlogSearch = () => {
  return (
    <div
      className="p-5 md:p-30px lg:p-5 2xl:p-30px mb-30px border border-borderColor2 dark:border-gray600"
      data-aos="fade-up"
    >
      <form className="w-full px-4 py-2 rounded-md text-sm text-contentColor bg-lightGrey10 dark:bg-lightGrey10-dark dark:text-contentColor-dark flex justify-center items-center leading-26px dark:border dark:border-gray-400">
        <input
          type="text"
          placeholder="Search"
          className="placeholder:text-placeholder bg-transparent focus:outline-none placeholder:opacity-80 w-full dark:text-gray-400 "
        />
        <button
          type="submit"
          className="bg-[#F6B335] py-[5px] px-[10px] rounded-md "
        >
          <i className="icofont-search-1 text-base text-white"></i>
        </button>
      </form>
    </div>
  );
};

export default BlogSearch;
