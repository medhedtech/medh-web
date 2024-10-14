import React from "react";
import Navitem from "./Navitem";
import DropdownDemoes from "./DropdownDemoes";
import DropdownPages from "./DropdownPages";
import DropdownCourses from "./DropdownCourses";
import DropdownWrapper from "@/components/shared/wrappers/DropdownWrapper";
import DropdownDashboard from "./DropdownDashboard";
import DropdownEcommerce from "./DropdownEcommerce";

const NavItems = () => {
  const navItems = [
    {
      id: 1,
      name: "Courses",
      path: "/courses",
      dropdown: <DropdownCourses />,
      isRelative: false,
    },
    {
      id: 2,
      name: "Corporate Training",
      path: "/courses",
      // dropdown: <DropdownCourses />,
      isRelative: false,
    },
    {
      id: 3,
      name: "Hire From Medh",
      path: "",
      dropdown: <DropdownDashboard />,
      isRelative: true,
    },
    {
      id: 4,
      name: "more",
      path: "",
      dropdown: <DropdownDashboard />,
      isRelative: true,
    },
    {
      id: 5,
      name: "Blogs",
      path: "/blogs",
      // dropdown: <DropdownEcommerce />,
      isRelative: true,
    },
  ];

  return (
    <div className="hidden lg:block lg:col-start-3 lg:col-span-7">
      <ul className="nav-list flex justify-end">
        {navItems.map((navItem, idx) => (
          <Navitem key={idx} idx={idx} navItem={{ ...navItem, idx: idx }}>
            <DropdownWrapper>{navItem.dropdown}</DropdownWrapper>
          </Navitem>
        ))}
      </ul>
    </div>
  );
};

export default NavItems;
