import React from "react";
import Navitem from "./Navitem";
import DropdownDemoes from "./DropdownDemoes";
import DropdownPages from "./DropdownPages";
import DropdownCourses from "./DropdownCourses";
import DropdownDashboard from "./DropdownDashboard";
import DropdownEcommerce from "./DropdownEcommerce";
import DropdownMore from "./DropdownMore";

const NavItems = () => {
  const navItems = [
    {
      id: 1,
      name: "Courses",
      path: "",
      dropdown: <DropdownCourses />,
      isRelative: false,
    },
    {
      id: 2,
      name: "Corporate Training",
      path: "/corporate-training-courses",
      dropdown: null,
      isRelative: false,
    },
    {
      id: 3,
      name: "Membership",
      path: "/medh-membership/",
      dropdown: null  ,
      isRelative: true,
    },
    {
      id: 4,
      name: "Blog",
      path: "/blogs",
      dropdown: null,
      isRelative: true,
    },
    {
      id: 5,
      name: "More",
      path: "",
      dropdown: <DropdownMore />,
      isRelative: true,
    }
  ];

  return (
    <div className="hidden lg:block lg:col-start-3 lg:col-span-7">
      <ul className="nav-list flex justify-end">
        {navItems.map((navItem, idx) => (
          <Navitem key={idx} idx={idx} navItem={{ ...navItem, idx: idx }}>
            {navItem.dropdown}
          </Navitem>
        ))}
      </ul>
    </div>
  );
};

export default NavItems;
