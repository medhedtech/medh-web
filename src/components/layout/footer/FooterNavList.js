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
          name: "Corporate Training",
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
      heading: "Our Courses",
      items: [
        {
          name: "AI and Data Science",
          path: "/ai-and-data-science-course",
        },
        {
          name: "Digital Marketing with Data Analytics",
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
          name: "View All Courses",
          path: "/skill-development-courses",
        },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      {/* About Section - Left Column */}
      <div className="md:col-span-4">
        <FooterAbout />
      </div>
      
      {/* Navigation Sections - Middle and Right Columns */}
      <div className="md:col-span-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {lists.map((list, idx) => (
            <FooterNavItems key={idx} list={list} idx={idx} />
          ))}
        </div>
      </div>
      
      {/* Recent Posts - Full Width Bottom Section */}
      <div className="md:col-span-12 mt-8">
        <FooterRecentPosts />
      </div>
    </div>
  );
};

export default FooterNavList;
