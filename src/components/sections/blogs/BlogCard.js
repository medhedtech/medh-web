import Image from "next/image";
import React from "react";

const BlogCard = ({ imageSrc, title, buttonText }) => {
  return (
    <div className="max-w-sm overflow-hidden dark:bg-black dark:shadow-gray-800 dark:border-whitegrey border  flex flex-col justify-between shadow-lg ">
      <Image
        src={imageSrc}
        alt={title}
        width={353}
        height={300}
        className="w-full h-[300px] object-cover"
      />
      <div className="px-6  py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
      </div>
      <div className="px-6 pt-4 pb-2">
        <button className="bg-blue-500 hover:bg-blue-700 text-blkack font-bold py-2 px-4 rounded">
          {buttonText} <span> &rarr;</span>
        </button>
      </div>
    </div>
  );
};

export default BlogCard;
