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
          path: "/join-as-educator",
        },
        {
          name: "As a School or Institute",
          path: "/join-as-school",
        },
        {
          name: "Medh Membership",
          path: "/membership",
        },
        {
          name: "Hire from Medh (Recruit@Medh)",
          path: "/hire-from-medh",
        },
        {
          name: "Careers at medh",
          path: "/careers",
        },
      ],
    },
    {
      heading: "Menu",
      items: [
        {
          name: "Corporate Traning",
          path: "/corporate-training",
        },
        {
          name: "About Us",
          path: "/about",
        },
        {
          name: "Blog",
          path: "/blogs",
        },
        {
          name: "Contact Us",
          path: "/contact",
        },
        {
          name: "Home",
          path: "/",
        },
      ],
    },
    {
      heading: "Our Course",
      items: [
        {
          name: "AI and Data Science",
          path: "/ai-data-science",
        },
        {
          name: "Degital Marketing with Data Analytics",
          path: "/digital-marketing-data-science",
        },
        {
          name: "Personality Development",
          path: "/personality-development",
        },
        {
          name: "Vedic Mathematics",
          path: "/vedic-mathematics",
        },
        {
          name: "View Other Courses",
          path: "/view-all-courses",
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
