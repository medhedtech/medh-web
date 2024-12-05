import DropdownContainer from "@/components/shared/containers/DropdownContainer";
import React from "react";
import DropdownItems from "./DropdownItems";

const DropdownMore = () => {
  const lists = [
    {
      items: [
        {
          name: "About Us",
          path: "/about-us",
        },
        {
          name: "News and Media",
          path: "/news-and-media",
        },
        {
          name: "Membership",
          path: "/medh-membership",
        },
        {
          name: "Team",
          path: "/medh-team",
        },
        {
          name: "Join Us as an Educator",
          path: "/join-us-as-educator",
        },
        {
          name: "Join Us as a School / Institute",
          path: "/join-us-as-school-institute",
        },
        {
          name: "Careers @medh",
          path: "/careers-at-medh",
        },
        {
          name: "Contact Us",
          path: "/contact-us",
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
