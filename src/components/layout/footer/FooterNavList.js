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

// Shared List Item component for both mobile and desktop
const ListItem = ({ item, isMobile }) => (
  <li className={`group relative ${isMobile ? 'py-1' : 'py-0.5'}`}>
    <Link 
      href={item.path}
      className={`text-gray-400 hover:text-primary-400 text-xs md:text-sm transition-all duration-200 flex items-center gap-2 rounded ${isMobile ? 'hover:translate-x-0.5' : 'px-1 hover:bg-white/5'}`}
    >
      <span className="text-primary-400/60 group-hover:text-primary-400 transition-colors">•</span>
      <span>{item.name}</span>
      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-auto" />
    </Link>
  </li>
);

// List Component with consistent styling for both mobile and desktop
const NavList = ({ title, icon, items, isMobile, className = "" }) => {
  return (
    <div className={`${className} ${isMobile ? 'py-4' : 'backdrop-blur-sm bg-black/10 p-4 rounded-lg border border-white/5 hover:bg-black/20 transition-colors duration-300'}`}>
      <div className={`flex items-center gap-2 mb-3`}>
        <span className="text-primary-400 bg-black/30 p-1.5 rounded-md">{icon}</span>
        <Typography variant="h3" className={`${isMobile ? 'text-white text-sm' : 'text-white'}`}>
          {title}
        </Typography>
      </div>
      <ul className={`space-y-2 ${isMobile ? 'pl-8' : ''}`}>
        {items.map((item, idx) => (
          <ListItem key={idx} item={item} isMobile={isMobile} />
        ))}
      </ul>
    </div>
  );
};

// Contact Item with consistent styling
const ContactItem = ({ icon, text, isPhone, isEmail }) => (
  <li className="flex items-center gap-3 group bg-black/30 p-2 rounded-lg hover:bg-black/40 transition-colors duration-300">
    <span className="text-primary-400 bg-black/40 p-1.5 rounded-md transition-colors duration-300 group-hover:bg-primary-500/20">
      {icon}
    </span>
    {isPhone ? (
      <a 
        href={`tel:${text.replace(/\s+/g, '')}`} 
        className="text-gray-300 text-xs sm:text-sm group-hover:text-white transition-colors duration-300 hover:underline"
      >
        {formatPhoneNumber(text)}
      </a>
    ) : isEmail ? (
      <a 
        href={`mailto:${text}`} 
        className="text-gray-300 text-xs sm:text-sm group-hover:text-white transition-colors duration-300 hover:underline"
      >
        {text}
      </a>
    ) : (
      <span className="text-gray-300 text-xs sm:text-sm group-hover:text-white transition-colors duration-300">
        {text}
      </span>
    )}
  </li>
);

// Format phone number for display
const formatPhoneNumber = (phoneNumber) => {
  // Remove all non-numeric characters except the plus sign
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  // Check if it's an international format starting with +
  if (cleaned.startsWith('+')) {
    // Format as +XX XXX XXX XXXX
    const countryCode = cleaned.slice(0, 3); // +91
    const firstPart = cleaned.slice(3, 6);   // 771
    const secondPart = cleaned.slice(6, 9);  // 084
    const lastPart = cleaned.slice(9);       // 0696
    
    return `${countryCode} ${firstPart} ${secondPart} ${lastPart}`;
  }
  
  return phoneNumber; // Return original if not in expected format
};

// About Section with responsive layout
const AboutSection = ({ logoImage, description, contact, isMobile }) => (
  <div className={`${isMobile ? 'mb-6' : 'xl:col-span-2 transition-all duration-500 transform translate-y-0 opacity-100'}`}>
    {/* Logo with consistent styling */}
    <div className={`relative ${isMobile ? 'flex justify-center mb-5' : 'mb-6 relative group'}`}>
      <div className={`absolute ${isMobile ? '-inset-1 bg-gradient-to-r from-primary-500/20 to-primary-400/20 rounded-full blur-md' : '-inset-1 bg-gradient-to-r from-primary-500/20 to-primary-400/20 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-500'}`}></div>
      <Link href="/" className="relative block">
        <div className={`relative ${isMobile ? 'h-12 w-32 p-0.5 rounded-full' : 'h-14 w-40 p-0.5 rounded-lg'} bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center`}>
          <div className={`absolute ${isMobile ? 'inset-0.5 rounded-full' : 'inset-0.5 rounded-lg'} bg-gradient-to-br from-black to-gray-900 ${!isMobile && 'backdrop-blur-sm'}`}></div>
          <div className="relative z-10 h-full w-full flex items-center justify-center px-2">
            {logoImage ? (
              <Image 
                src={logoImage} 
                alt="Medh Logo" 
                width={isMobile ? 100 : 120}
                height={isMobile ? 30 : 40}
                className="object-contain"
                priority
              />
            ) : (
              <span className={`text-white font-bold ${isMobile ? 'text-lg' : 'text-xl'}`}>MEDH</span>
            )}
          </div>
        </div>
      </Link>
    </div>
    
    {/* Description with consistent styling */}
    <div className={`text-gray-400 ${isMobile ? 'mx-4 mb-5 text-sm leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5 backdrop-blur-sm' : 'text-xs md:text-sm mb-5 pr-4 backdrop-blur-sm bg-black/20 p-3 rounded-lg border border-white/5 max-w-xl'}`}>
      {isMobile ? description : description}
    </div>
    
    {/* Contact info with consistent styling */}
    <div className={`${isMobile ? 'mx-4 p-4' : 'p-4'} bg-black/20 rounded-xl backdrop-blur-sm border border-white/5 ${!isMobile && 'max-w-xl'}`}>
      {isMobile && (
        <div className="mb-3 flex items-center gap-2">
          <span className="text-primary-400 bg-black/30 p-1.5 rounded-md">
            <Info size={14} />
          </span>
          <Typography variant="h3" className="text-white text-sm">
            Contact Us
          </Typography>
        </div>
      )}
      
      <div className={`${isMobile ? 'grid grid-cols-1 gap-3' : ''}`}>
        <ul className={`${!isMobile && 'space-y-3'}`}>
          {contact.map((item, idx) => (
            <ContactItem key={idx} icon={item.icon} text={item.text} isPhone={item.isPhone} isEmail={item.isEmail} />
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const FooterNavList = ({ logoImage, isMobile }) => {
  const [animateItems, setAnimateItems] = useState(false);
  
  useEffect(() => {
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
      { icon: <Phone size={14} />, text: "+917710840696", isPhone: true },
      { icon: <Mail size={14} />, text: "care@medh.co", isEmail: true }
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
        { name: "View All Courses", path: "//courses/" },
      ],
    },
  ];

  // Enhanced mobile view with consistent styling
  if (isMobile) {
    return (
      <div className="flex flex-col">
        {/* About section */}
        <AboutSection 
          logoImage={logoImage} 
          description={aboutUsContent.description}
          contact={aboutUsContent.contact}
          isMobile={true}
        />
        
        {/* Navigation lists */}
        <div className="mt-2 space-y-1 divide-y divide-white/5">
          {lists.map((list, idx) => (
            <NavList 
              key={idx}
              title={list.heading}
              icon={list.icon}
              items={list.items}
              isMobile={true}
            />
          ))}
        </div>
      </div>
    );
  }

  // Desktop view with consistent styling
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 xl:gap-12">
      {/* About Us Section */}
      <AboutSection 
        logoImage={logoImage} 
        description={aboutUsContent.description}
        contact={aboutUsContent.contact}
        isMobile={false}
      />

      {/* Navigation Lists */}
      {lists.map((list, idx) => (
        <NavList 
          key={idx}
          title={list.heading}
          icon={list.icon}
          items={list.items}
          isMobile={false}
          className={`transition-all duration-500 transform ${animateItems ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
          style={{ transitionDelay: `${200 + (idx * 100)}ms` }}
        />
      ))}
    </div>
  );
};

export default FooterNavList;
