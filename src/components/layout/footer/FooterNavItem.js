import Link from "next/link";
import { ChevronRight } from "lucide-react";

const FooterNavItem = ({ name, path }) => {
  return (
    <li className="mb-2.5 group">
      <Link 
        href={path} 
        className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 group-hover:translate-x-1 transform transition-transform"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2.5 group-hover:bg-green-400 transition-colors"></span>
        <span className="text-sm">{name}</span>
        <ChevronRight size={14} className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-green-500" />
      </Link>
    </li>
  );
};

export default FooterNavItem;
