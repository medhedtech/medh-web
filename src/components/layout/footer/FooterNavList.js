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
          path: "/join-us-as-educator",
        },
        {
          name: "As a School or Institute",
          path: "/join-us-as-school-institute",
        },
        {
          name: "Medh Membership",
          path: "/medh-membership",
        },
        {
          name: "Hire from Medh (Recruit@Medh)",
          path: "/hire-from-medh",
        },
        {
          name: "Careers at medh",
          path: "/careers-at-medh",
        },
      ],
    },
    {
      heading: "Menu",
      items: [
        {
          name: "Corporate Traning",
          path: "/corporate-training-courses",
        },
        {
          name: "About Us",
          path: "/about-us",
        },
        {
          name: "Blog",
          path: "/blogs",
        },
        {
          name: "Contact Us",
          path: "/contact-us",
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
          path: "/ai-and-data-science-course",
        },
        {
          name: "Degital Marketing with Data Analytics",
          path: "/digital-marketing-with-data-analytics-course",
        },
        {
          name: "Personality Development",
          path: "/personality-development-course",
        },
        {
          name: "Vedic Mathematics",
          path: "/vedic-mathematics-course",
        },
        {
          name: "View Other Courses",
          path: "/skill-development-courses",
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
