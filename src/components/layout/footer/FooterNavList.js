import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserPlus, Menu, GraduationCap, Info, MapPin, Phone, Mail, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

// Typography component for consistent font styling
const Typography = ({ variant = "body", children, className = "", ...props }) => {
  const variants = {
    h3: "font-heading text-base font-semibold leading-snug",
    body: "font-body text-sm leading-relaxed",
  };

  return (
    <div className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

// Enhanced Accordion component for mobile navigation
const MobileAccordion = ({ title, icon, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-white/10 py-2">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between text-left py-2 transition-all duration-300 group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <span className="text-primary-400 group-hover:text-primary-300 transition-colors duration-300 bg-white/5 p-1.5 rounded-md">{icon}</span>
          <Typography variant="h3" className="text-white text-sm">{title}</Typography>
        </div>
        <span className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <ChevronDown size={16} />
        </span>
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <ul className="pl-9 py-2 space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-px bg-primary-500/30"></div>
              <Link 
                href={item.path}
                className="text-gray-400 hover:text-primary-400 text-xs transition-colors duration-200 block py-1 hover:translate-x-0.5 transition-transform flex items-center gap-2"
              >
                <span className="text-primary-400 flex-shrink-0">•</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const FooterNavList = ({ logoImage, isMobile }) => {
  const [animateItems, setAnimateItems] = useState(false);
  
  useEffect(() => {
    // Staggered animation for child elements
    const timer = setTimeout(() => {
      setAnimateItems(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // About Us content
  const aboutUsContent = {
    title: "About Medh",
    description: "Medh is an innovative ed-tech platform that empowers learners with industry-ready skills through expert-led courses, personalized learning paths, and guaranteed job placements.",
    contact: [
      // { icon: <MapPin size={14} />, text: "Mumbai, India" },
      { icon: <Phone size={14} />, text: "+91 77108 40696" },
      { icon: <Mail size={14} />, text: "care@medh.co" }
    ]
  };
  
  const lists = [
    {
      heading: "Join Us",
      icon: <UserPlus size={16} />,
      items: [
        { name: "As an Educator", path: "/join-us-as-educator" },
        { name: "As a School", path: "/join-us-as-school-institute" },
        { name: "Career@Medh", path: "/careers" },
        { name: "Hire from Medh", path: "/hire-from-medh" },
        { name: "Medh Membership", path: "/medh-membership" },
        
      ],
    },
    {
      heading: "Quick Menu",
      icon: <Menu size={16} />,
      items: [
        { name: "About Us", path: "/about-us" },
        { name: "Blog", path: "/blogs" },
        { name: "Corporate Training", path: "/corporate-training-courses" }, 
        { name: "News and Media", path: "/news-and-media" },
        { name: "Contact Us", path: "/contact-us" },
        // { name: "Home", path: "/" },
      ],
    },
    {
      heading: "Courses",
      icon: <GraduationCap size={16} />,
      items: [
        { name: "AI & Data Science", path: "/ai-and-data-science-course" },
        { name: "Digital Marketing", path: "/digital-marketing-with-data-analytics-course" },
        { name: "Personality Development", path: "/personality-development-course" },
        { name: "Vedic Mathematics", path: "/vedic-mathematics-course" },
        { name: "View All Courses", path: "/skill-development-courses" },
      ],
    },
  ];

  // Enhanced mobile-optimized view
  if (isMobile) {
    return (
      <div className="flex flex-col">
        {/* Enhanced Logo and about us */}
        <div className="mb-5 flex flex-col items-center">
          {/* Enhanced Logo with glow effect */}
          <div className="mb-4 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-primary-400/20 rounded-full blur-md"></div>
            <Link href="/" className="relative block">
              <div className="relative h-12 w-32 p-0.5 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-black to-gray-900"></div>
                <div className="relative z-10 h-full w-full flex items-center justify-center">
                  {logoImage ? (
                    <Image 
                      src={logoImage} 
                      alt="Medh Logo" 
                      width={100}
                      height={30}
                      className="object-contain"
                      priority
                    />
                  ) : (
                    <span className="text-white font-bold text-lg">MEDH</span>
                  )}
                </div>
              </div>
            </Link>
          </div>
          
          {/* Brief description with improved styling */}
          <div className="text-gray-400 text-xs mb-4 text-center px-4 max-w-xs leading-relaxed ">
            {aboutUsContent.description.split(' ').slice(0, 14).join(' ')}...
          </div>
          
          {/* Contact info with improved styling and alignment */}
          <div className="flex flex-col items-center gap-4 w-full px-4 py-3 bg-black/20 rounded-lg backdrop-blur-sm border border-white/5">
            <h3 className="text-white text-sm font-medium">Contact Us</h3>
            <div className="grid grid-cols-1 gap-2 w-full">
              {aboutUsContent.contact.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 group bg-black/30 p-2 rounded-lg">
                  <span className="text-primary-400 bg-black/40 p-1.5 rounded-md">
                    {item.icon}
                  </span>
                  <span className="text-gray-300 text-xs">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Enhanced Accordion navigation */}
        <div className="mt-2">
          {lists.map((list, idx) => (
            <MobileAccordion 
              key={idx}
              title={list.heading}
              icon={list.icon}
              items={list.items}
            />
          ))}
        </div>
      </div>
    );
  }

  // Enhanced Desktop view - optimized for full width layout
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 xl:gap-12">
      {/* About Us Section with Enhanced Logo - spans 2 columns on extra large screens */}
      <div 
        className={`transition-all duration-500 transform ${animateItems ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'} xl:col-span-2`}
        style={{ transitionDelay: '100ms' }}
      >
        {/* Enhanced Logo with glow effect */}
        <div className="mb-6 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-primary-400/20 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
          <Link href="/" className="relative block">
            <div className="relative h-14 w-40 p-0.5 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="absolute inset-0.5 rounded-lg bg-gradient-to-br from-black to-gray-900 backdrop-blur-sm"></div>
              <div className="relative z-10 h-full w-full flex items-center justify-center px-2">
                {logoImage ? (
                  <Image 
                    src={logoImage} 
                    alt="Medh Logo" 
                    width={120}
                    height={40}
                    className="object-contain"
                    priority
                  />
                ) : (
                  <span className="text-white font-bold text-xl">MEDH</span>
                )}
              </div>
            </div>
          </Link>
        </div>
        
        {/* Enhanced description - wider on larger screens */}
        <div className="text-gray-400 text-xs md:text-sm mb-5 pr-4 leading-relaxed backdrop-blur-sm bg-black/20 p-3 rounded-lg border border-white/5 max-w-xl">
          {aboutUsContent.description}
        </div>
        
        {/* Enhanced contact list with better alignment and styling */}
        <div className="backdrop-blur-sm bg-black/20 p-4 rounded-lg border border-white/5 max-w-xl">
          {/* <h3 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
            <div className="w-4 h-4 bg-primary-500/30 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
            </div>
            Contact Information
          </h3> */}
          <ul className="space-y-3">
            {aboutUsContent.contact.map((item, idx) => (
              <li key={idx} className="flex items-center  gap-3 group bg-black/30 p-2 rounded-lg hover:bg-black/40 transition-colors duration-300 ">
                <span className="text-primary-400 bg-black/40 p-1.5 rounded-md transition-colors duration-300 group-hover:bg-primary-500/20 ">
                  {item.icon}
                </span>
                <span className="text-gray-300 text-sm group-hover:text-white transition-colors duration-300">
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Enhanced Navigation Lists - one column each on extra large screens */}
      {lists.map((list, idx) => (
        <div 
          key={idx}
          className={`transition-all duration-500 transform ${animateItems ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'} backdrop-blur-sm bg-black/10 p-4 rounded-lg border border-white/5 hover:bg-black/20 transition-colors duration-300`}
          style={{ transitionDelay: `${200 + (idx * 100)}ms` }}
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="text-primary-400 bg-black/30 p-1.5 rounded-md">{list.icon}</span>
            <Typography variant="h3" className="text-white">{list.heading}</Typography>
          </div>
          <ul className="space-y-2">
            {list.items.map((item, idxItem) => (
              <li key={idxItem} className="group">
                <Link 
                  href={item.path}
                  className="text-gray-400 hover:text-primary-400 text-xs md:text-sm transition-all duration-200 flex items-center gap-2 py-0.5 px-1 rounded hover:bg-white/5"
                >
                  <span className="text-primary-400 flex-shrink-0">•</span>
                  <span>{item.name}</span>
                  <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default FooterNavList;
