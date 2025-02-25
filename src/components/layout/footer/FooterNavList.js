import React, { useState, useEffect } from "react";
import FooterNavItems from "./FooterNavItems";
import FooterAbout from "./FooterAbout";
import FooterRecentPosts from "./FooterRecentPosts";
import { LayoutGrid } from "lucide-react";

// Typography component for consistent font styling
const Typography = ({ variant = "body", children, className = "", ...props }) => {
  const variants = {
    h1: "font-heading text-3xl md:text-4xl font-bold leading-tight",
    h2: "font-heading text-2xl md:text-3xl font-bold leading-tight",
    h3: "font-heading text-xl md:text-2xl font-semibold leading-snug",
    h4: "font-heading text-lg md:text-xl font-semibold leading-snug",
    subtitle: "font-body text-base md:text-lg font-medium leading-relaxed",
    body: "font-body text-base leading-relaxed",
    caption: "font-body text-sm leading-normal",
    small: "font-body text-xs leading-normal",
  };

  return (
    <div className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

const FooterNavList = () => {
  const [animateItems, setAnimateItems] = useState(false);
  
  useEffect(() => {
    // Staggered animation for child elements
    const timer = setTimeout(() => {
      setAnimateItems(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  
  const lists = [
    {
      heading: "Join Us",
      icon: "UserPlus",
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
      icon: "Menu",
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
      icon: "GraduationCap",
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
    <div className="relative">
      {/* Font styles - this would ideally go in a global CSS file */}
      <style jsx global>{`
        /* Font variables */
        :root {
          --font-heading: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          
          /* Font size scale with clamp for responsive sizing */
          --text-xs: clamp(0.75rem, 0.7rem + 0.15vw, 0.875rem);
          --text-sm: clamp(0.875rem, 0.8rem + 0.2vw, 1rem);
          --text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
          --text-lg: clamp(1.125rem, 1.05rem + 0.3vw, 1.25rem); 
          --text-xl: clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem);
          --text-2xl: clamp(1.5rem, 1.3rem + 0.7vw, 1.875rem);
          --text-3xl: clamp(1.875rem, 1.65rem + 0.9vw, 2.25rem);
          --text-4xl: clamp(2.25rem, 1.95rem + 1.1vw, 3rem);
          
          /* Line heights */
          --leading-none: 1;
          --leading-tight: 1.2;
          --leading-snug: 1.375;
          --leading-normal: 1.5;
          --leading-relaxed: 1.625;
          --leading-loose: 2;
          
          /* Letter spacing */
          --tracking-tighter: -0.05em;
          --tracking-tight: -0.025em;
          --tracking-normal: 0;
          --tracking-wide: 0.025em;
          --tracking-wider: 0.05em;
          --tracking-widest: 0.1em;
        }
        
        .font-heading {
          font-family: var(--font-heading);
          letter-spacing: var(--tracking-tight);
        }
        
        .font-body {
          font-family: var(--font-body);
          letter-spacing: var(--tracking-normal);
        }
      `}</style>
    
      {/* Main grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-12">
        {/* About Section - Left Column */}
        <div 
          className={`lg:col-span-4 transition-all duration-700 transform ${animateItems ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
          style={{ transitionDelay: '100ms' }}
        >
          <FooterAbout />
        </div>
        
        {/* Navigation Sections - Middle and Right Columns */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {lists.map((list, idx) => (
              <div 
                key={idx}
                className={`transition-all duration-700 transform ${animateItems ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                style={{ transitionDelay: `${200 + (idx * 100)}ms` }}
              >
                <FooterNavItems list={list} idx={idx} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Decorative divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-12 opacity-50"></div>
      
      {/* Newsletter Section - Full Width Bottom */}
      <div 
        className={`transition-all duration-700 transform ${animateItems ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        style={{ transitionDelay: '600ms' }}
      >
        <FooterRecentPosts />
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary-500/5 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-secondary-500/5 rounded-full blur-3xl"></div>
    </div>
  );
};

export default FooterNavList;
