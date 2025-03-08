import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserPlus, Menu, GraduationCap, Info, MapPin, Phone, Mail, ChevronDown, ChevronUp } from "lucide-react";

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

// Accordion component for mobile navigation
const MobileAccordion = ({ title, icon, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-800 py-2">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between text-left py-2"
      >
        <div className="flex items-center gap-2">
          <span className="text-primary-400">{icon}</span>
          <Typography variant="h3" className="text-white text-sm">{title}</Typography>
        </div>
        <span className="text-gray-400">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>
      
      {isOpen && (
        <ul className="pl-6 py-2 space-y-2">
          {items.map((item, idx) => (
            <li key={idx}>
              <Link 
                href={item.path}
                className="text-gray-400 hover:text-primary-400 text-xs transition-colors duration-200 block py-1"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
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
      { icon: <MapPin size={14} />, text: "Bangalore, India" },
      { icon: <Phone size={14} />, text: "+91 XXXX XXXX XX" },
      { icon: <Mail size={14} />, text: "contact@medh.com" }
    ]
  };
  
  const lists = [
    {
      heading: "Join Us",
      icon: <UserPlus size={16} />,
      items: [
        { name: "As an Educator", path: "/join-us-as-educator" },
        { name: "As a School", path: "/join-us-as-school-institute" },
        { name: "Medh Membership", path: "/medh-membership" },
        { name: "Hire from Medh", path: "/hire-from-medh" },
        { name: "Careers", path: "/careers" },
      ],
    },
    {
      heading: "Menu",
      icon: <Menu size={16} />,
      items: [
        { name: "Corporate Training", path: "/corporate-training-courses" },
        { name: "About Us", path: "/about-us" },
        { name: "Blog", path: "/blogs" },
        { name: "Contact Us", path: "/contact-us" },
        { name: "Home", path: "/" },
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

  // Mobile-optimized view
  if (isMobile) {
    return (
      <div className="flex flex-col">
        {/* Logo and about us */}
        <div className="mb-4 flex flex-col items-center">
          {/* Logo */}
          <div className="mb-3">
            <Link href="/">
              <div className="relative h-10 w-28">
                {logoImage ? (
                  <Image 
                    src={logoImage} 
                    alt="Medh Logo" 
                    fill
                    className="object-contain"
                    sizes="112px"
                    priority
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 opacity-80 blur-sm rounded-full"></div>
                    <div className="relative h-full w-full flex items-center justify-start">
                      <span className="text-white font-bold text-lg">MEDH</span>
                    </div>
                  </>
                )}
              </div>
            </Link>
          </div>
          
          {/* Brief description */}
          <div className="text-gray-400 text-xs mb-3 text-center px-2">
            {aboutUsContent.description.split(' ').slice(0, 12).join(' ')}...
          </div>
          
          {/* Contact info in horizontal layout */}
          <div className="flex justify-center gap-4 my-1">
            {aboutUsContent.contact.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span className="text-primary-400 p-1.5 bg-gray-800/50 rounded-full">{item.icon}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Accordion navigation */}
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

  // Desktop view (unchanged)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
      {/* About Us Section with Logo */}
      <div 
        className={`transition-all duration-500 transform ${animateItems ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
        style={{ transitionDelay: '100ms' }}
      >
        {/* Logo */}
        <div className="mb-4">
          <Link href="/">
            <div className="relative h-12 w-32 md:w-40">
              {logoImage ? (
                <Image 
                  src={logoImage} 
                  alt="Medh Logo" 
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 8rem, 10rem"
                  priority
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 opacity-80 blur-sm rounded-full"></div>
                  <div className="relative h-full w-full flex items-center justify-start">
                    <span className="text-white font-bold text-xl">MEDH</span>
                  </div>
                </>
              )}
            </div>
          </Link>
        </div>
        
        <div className="text-gray-400 text-xs md:text-sm mb-4 pr-4">
          {aboutUsContent.description}
        </div>
        <ul className="space-y-2">
          {aboutUsContent.contact.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-primary-400 mt-0.5">{item.icon}</span>
              <span className="text-gray-400 text-xs">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Navigation Lists */}
      {lists.map((list, idx) => (
        <div 
          key={idx}
          className={`transition-all duration-500 transform ${animateItems ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
          style={{ transitionDelay: `${200 + (idx * 100)}ms` }}
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="text-primary-400">{list.icon}</span>
            <Typography variant="h3" className="text-white">{list.heading}</Typography>
          </div>
          <ul className="space-y-1.5">
            {list.items.map((item, idxItem) => (
              <li key={idxItem}>
                <Link 
                  href={item.path}
                  className="text-gray-400 hover:text-primary-400 text-xs md:text-sm transition-colors duration-200 block"
                >
                  {item.name}
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
