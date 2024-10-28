import Link from "next/link";
import React from "react";

const FooterNavItem = ({ name, path }) => {
  return (
    <li className="flex items-center">
      <span className="w-2 h-2 bg-[#7ECA9D] mr-2"></span>
      <Link href={path} className="text-white">
        {name}
      </Link>
    </li>
  );
};

export default FooterNavItem;
