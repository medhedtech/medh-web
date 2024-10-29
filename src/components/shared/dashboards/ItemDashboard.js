"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ItemDashboard = ({ item }) => {
  const currentPath = usePathname();

  const { name, path, icon, tag } = item;
  const isActive = currentPath === path ? true : false;
  return (
    <li
      className={`py-3 border-b border-borderColor dark:border-borderColor-dark ${
        tag ? "flex justify-between items-center " : ""
      }`}
    >
      <Link
        href={path}
        className={`${
          isActive
            ? "bg-primaryColor text-white py-4 rounded-r-5"
            : "text-contentColor dark:text-contentColor-dark "
        }   leading-1.8 flex gap-3 text-nowrap justify-start pl-10`}
      >
        {icon} {name}
      </Link>
      {tag ? (
        <span className="text-size-10 font-medium text-whiteColor px-9px bg-primaryColor leading-14px rounded-2xl">
          12
        </span>
      ) : (
        ""
      )}
    </li>
  );
};

export default ItemDashboard;
