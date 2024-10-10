import React from "react";
import FooterNavItems from "./FooterNavItems";
import FooterAbout from "./FooterAbout";
import FooterRecentPosts from "./FooterRecentPosts";

const FooterNavList = () => {
  const lists = [
    {
      heading: "Join Us",
      items: [
        {
          name: "As an Educator",
          path: "/about",
        },
        {
          name: "As a School or Institute",
          path: "/instructors",
        },
        {
          name: "Medh Membership",
          path: "#",
        },
        {
          name: "Hire from Medh (Recruit@Medh)",
          path: "#",
        },
        {
          name: "Careers at medh",
          path: "#",
        },
      ],
    },
    {
      heading: "Menu",
      items: [
        {
          name: "Corporate Traning",
          path: "#",
        },
        {
          name: "About Us",
          path: "#",
        },
        {
          name: "Blog",
          path: "#",
        },
        {
          name: "Contact Us",
          path: "#",
        },
        {
          name: "Home",
          path: "#",
        },
      ],
    },
    {
      heading: "Our Course",
      items: [
        {
          name: "AI and Data Science",
          path: "#",
        },
        {
          name: "Degital Marketing with Data Analytics",
          path: "#",
        },
        {
          name: "Personality Development",
          path: "#",
        },
        {
          name: "Vedic Mathematics",
          path: "#",
        },
        {
          name: "View Other Courses",
          path: "#",
        },
      ],
    },
  ];

  return (
    <section>
      <div className="flex justify-between flex-col md:flex-row gap-8 lg:gap-2">
        {/* left */}
        {/* <FooterAbout /> */}

        {/* nav area */}
        {lists.map((list, idx) => (
          <FooterNavItems key={idx} list={list} idx={idx} />
        ))}

        {/* right */}
        <FooterRecentPosts />
      </div>
    </section>
  );
};

export default FooterNavList;
