import useIsSecondary from "@/hooks/useIsSecondary";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Calendar } from "lucide-react";

const FooterRecentPost = ({ post }) => {
  const { title, date, image, id } = post;

  return (
    <li className="mb-4 last:mb-0">
      <Link
        href={`/courses/${id}`}
        className="flex items-center gap-4 group hover:bg-gray-800/30 p-2 rounded-lg transition-all duration-300"
      >
        <div className="relative overflow-hidden rounded-md flex-shrink-0">
          <div className="w-16 h-16 relative">
            <Image
              src={image}
              alt={title}
              fill
              sizes="64px"
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAJhAPYe5T/vAAAAABJRU5ErkJggg=="
            />
            <div className="absolute inset-0 bg-green-500/0 group-hover:bg-green-500/20 transition-colors duration-300"></div>
          </div>
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center text-gray-400 mb-1.5">
            <Calendar size={12} className="mr-1.5" />
            <p className="text-xs">{date}</p>
          </div>
          
          <h6 className="text-sm font-medium text-gray-200 group-hover:text-green-400 transition-colors line-clamp-2">
            {title}
          </h6>
        </div>
      </Link>
    </li>
  );
};

export default FooterRecentPost;
