import DropdownContainer from "@/components/shared/containers/DropdownContainer";
import React from "react";
import DropdownItems from "./DropdownItems";

const DropdownMore = () => {
  const lists = [
    {
      items: [
        {
          name: "About Us",
          path: "/about",
        },
        {
          name: "News and Media",
          path: "/news-media",
        },
        {
          name: "Membership",
          path: "/membership",
        },
        {
          name: "Team",
          path: "/team",
        },
        {
          name: "Join Us as an Educator",
          path: "/join-as-educator",
        },
        {
          name: "Join Us as a School / Institute",
          path: "/join-as-school",
        },
        {
          name: "Careers @medh",
          path: "/careers",
        },
        {
          name: "Contact Us",
          path: "/contact",
        },
      ],
    },
  ];
  return (
    <div>
      <DropdownContainer> 
        <div className="w-fit ">
          {lists?.map((list, idx) => (
            <DropdownItems key={idx} list={list} />
          ))}
        </div>
      </DropdownContainer>
    </div>
  );
};

export default DropdownMore;
