import Link from "next/link";
import { ChevronRight } from "lucide-react";

const FooterNavItem = ({ name, path }) => {
  return (
    <li className="group">
      <Link 
        href={path} 
        className="flex items-center font-body text-gray-300 hover:text-white transition-all duration-300 group-hover:translate-x-1 transform"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2.5 group-hover:bg-primary-400 transition-colors"></span>
        <span className="text-sm tracking-wide">{name}</span>
        <ChevronRight 
          size={14} 
          className="ml-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0.5 text-primary-400" 
          strokeWidth={2.5}
        />
      </Link>
    </li>
  );
};

export default FooterNavItem;
