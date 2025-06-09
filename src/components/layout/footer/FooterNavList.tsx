import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserPlus, Menu, GraduationCap, Info, MapPin, Phone, Mail, ChevronDown, ChevronUp, ExternalLink, Facebook, Instagram, Linkedin, Youtube, QrCode, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useIsClient, useCurrentYear, getHydrationSafeProps } from "@/utils/hydration";
import { courseTypesAPI, TNewCourse, IBlendedCourse } from "@/apis/courses";

// TypeScript interfaces
interface INavItem {
  name: string;
  path: string;
  count?: number;
  children?: INavItem[];
}

interface IContactItem {
  icon: React.ReactElement;
  text: string;
  isPhone?: boolean;
  isEmail?: boolean;
}

interface IAboutUsContent {
  title: string;
  description: string;
  contact: IContactItem[];
}

interface INavList {
  heading: string;
  icon: React.ReactElement;
  items: INavItem[];
}

interface IFooterNavListProps {
  logoImage?: string;
  isMobile: boolean;
  qrCodeImage?: string;
}

interface ITypographyProps {
  variant?: "h3" | "body" | "small";
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

interface IListItemProps {
  item: INavItem;
  isMobile: boolean;
  isFullWidth?: boolean;
  level?: number;
}

interface INavListProps {
  title: string;
  icon: React.ReactElement;
  items: INavItem[];
  isMobile: boolean;
  isFullWidth?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

interface IContactItemProps {
  icon: React.ReactElement;
  text: string;
  isPhone?: boolean;
  isEmail?: boolean;
}

interface IAboutSectionProps {
  logoImage?: string;
  description: string;
  contact: IContactItem[];
  isMobile: boolean;
  qrCodeImage?: string;
}

// Enhanced Typography component with smaller, more appropriate font sizes
const Typography: React.FC<ITypographyProps> = ({ variant = "body", children, className = "", ...props }) => {
  const variants = {
    h3: "font-heading text-base md:text-lg font-semibold leading-relaxed tracking-wide text-white",
    body: "font-body text-sm md:text-base leading-loose tracking-normal text-gray-300",
    small: "font-body text-xs md:text-sm leading-relaxed tracking-normal text-gray-400",
  };

  return (
    <div className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

// Enhanced List Item component with tree support
const ListItem: React.FC<IListItemProps> = ({ item, isMobile, isFullWidth = false, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const hasChildren = item.children && item.children.length > 0;
  
  // Use proper Tailwind classes for indentation
  const getIndentClass = (level: number) => {
    switch (level) {
      case 1: return 'ml-4';
      case 2: return 'ml-8';
      case 3: return 'ml-12';
      default: return '';
    }
  };
  
  const indentClass = getIndentClass(level);

  const toggleExpanded = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <li className={`group relative ${isMobile ? 'py-1' : isFullWidth ? '' : 'py-1'}`}>
      <div 
        className={`text-gray-300 hover:text-white text-xs md:text-sm leading-relaxed tracking-normal transition-all duration-200 flex items-center gap-2 rounded-lg ${
          isMobile 
            ? 'hover:translate-x-1 px-2 py-1' 
            : isFullWidth 
              ? 'px-2 py-1.5 hover:bg-white/15 border border-transparent hover:border-primary-500/20' 
              : 'px-2 py-1 hover:bg-white/10'
        } hover:shadow-sm ${indentClass} ${hasChildren ? 'cursor-pointer' : ''}`}
        onClick={hasChildren ? toggleExpanded : undefined}
      >
        {hasChildren ? (
          <>
            <span className="text-primary-400/80 group-hover:text-primary-300 transition-colors text-sm leading-none">
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </span>
            <span className={`flex-1 font-medium tracking-wide ${isFullWidth ? 'text-center' : ''}`}>
              {item.name}
              {item.count && (
                <span className="ml-2 text-xs text-primary-400/60">({item.count})</span>
              )}
            </span>
          </>
        ) : (
          <Link href={item.path} className="flex items-center gap-2 w-full">
            <span className="text-primary-400/80 group-hover:text-primary-300 transition-colors text-base leading-none">•</span>
            <span className={`flex-1 font-medium tracking-wide ${isFullWidth ? 'text-center' : ''}`}>{item.name}</span>
            {!isFullWidth && (
                              <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary-400" />
            )}
          </Link>
        )}
      </div>
      
      {/* Render children if expanded */}
      {hasChildren && isExpanded && (
        <ul className="mt-1 space-y-1">
          {item.children!.map((child, idx) => (
            <ListItem 
              key={idx} 
              item={child} 
              isMobile={isMobile} 
              isFullWidth={isFullWidth} 
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

// Enhanced List Component with improved visual design and tree support
const NavList: React.FC<INavListProps> = ({ title, icon, items, isMobile, isFullWidth = false, className = "", style }) => {
  return (
    <div className={`${className} ${isMobile ? 'py-5 px-2' : 'group relative backdrop-blur-sm bg-gradient-to-br from-black/30 to-black/20 p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300'}`} style={style}>
      {/* Header */}
      <div className={`flex items-center gap-3 ${isMobile ? 'mb-4' : 'mb-6'}`}>
        <div className="text-primary-400/80 group-hover:text-primary-300 transition-colors">
          {icon}
        </div>
        <Typography variant="h3" className={`text-white font-semibold tracking-wide ${isMobile ? 'text-base' : 'text-lg'}`}>
          {title}
        </Typography>
      </div>

      {/* Tree Structure List */}
      <ul className={`space-y-1 ${isMobile ? 'text-sm' : 'text-sm'}`}>
        {items.map((item, index) => (
          <li key={index} className="group/item">
            {/* Category Header */}
            <div className="text-gray-300 hover:text-white text-sm font-medium py-2 transition-colors duration-200">
              • {item.name}
            </div>
            
            {/* Child Courses */}
            {item.children && item.children.length > 0 && (
              <div className="ml-6 mb-3">
                <ul className={`space-y-1 ${item.children.length > 8 ? 'max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary-500/50 scrollbar-track-gray-800' : ''}`}>
                  {item.children.map((child, childIndex) => (
                    <li key={childIndex}>
                      <Link
                        href={child.path}
                        className="group/child flex items-center gap-2 text-gray-400 hover:text-white text-xs py-1 transition-all duration-200 hover:translate-x-1"
                      >
                        <span className="text-primary-400/60">→</span>
                        <span className="flex-1">{child.name}</span>
                        <ArrowUpRight className="w-2 h-2 opacity-0 group-hover/child:opacity-100 transition-all transform group-hover/child:translate-x-0.5 group-hover/child:-translate-y-0.5 duration-300 text-primary-400" />
                      </Link>
                    </li>
                  ))}
                </ul>
                {item.children.length > 8 && (
                  <div className="text-xs text-gray-500 mt-2 text-center">
                    {item.children.length} courses available
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Enhanced Contact Item with smaller font sizes
const ContactItem: React.FC<IContactItemProps> = ({ icon, text, isPhone, isEmail }) => (
  <li className="flex items-center gap-4 group bg-black/40 p-3 rounded-xl hover:bg-black/60 transition-all duration-300 border border-white/5 hover:border-white/10">
    <span className="text-primary-400 bg-primary-500/20 p-2 rounded-lg transition-colors duration-300 group-hover:bg-primary-500/30 border border-primary-500/30">
      <span className="w-3.5 h-3.5 flex items-center justify-center">{icon}</span>
    </span>
    {isPhone ? (
      <a 
        href={`tel:${text.replace(/\s+/g, '')}`} 
        className="text-gray-200 text-xs md:text-sm leading-relaxed tracking-wide group-hover:text-white transition-colors duration-300 hover:underline font-medium"
      >
        {formatPhoneNumber(text)}
      </a>
    ) : isEmail ? (
      <a 
        href={`mailto:${text}`} 
        className="text-gray-200 text-xs md:text-sm leading-relaxed tracking-normal group-hover:text-white transition-colors duration-300 hover:underline font-medium"
      >
        {text}
      </a>
    ) : (
      <span className="text-gray-200 text-xs md:text-sm leading-relaxed tracking-normal group-hover:text-white transition-colors duration-300 font-medium">
        {text}
      </span>
    )}
  </li>
);

// Format phone number for display
const formatPhoneNumber = (phoneNumber: string): string => {
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

// Enhanced About Section with QR Code and Copyright
const AboutSection: React.FC<IAboutSectionProps> = ({ logoImage, description, contact, isMobile, qrCodeImage }) => {
  const router = useRouter();
  const isClient = useIsClient();
  const currentYear = useCurrentYear();
  
  const handleNavigation = (path: string) => {
    router.push(path);
  };
  
  const socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/medhupskill/",
      icon: <Facebook className={isMobile ? "w-4 h-4" : "w-4.5 h-4.5"} />
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/101210304/admin/feed/posts/",
      icon: <Linkedin className={isMobile ? "w-4 h-4" : "w-4.5 h-4.5"} />
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/medhupskill/",
      icon: <Instagram className={isMobile ? "w-4 h-4" : "w-4.5 h-4.5"} />
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/channel/UC4EMmw69w-877_fxJExZWyw",
      icon: <Youtube className={isMobile ? "w-4 h-4" : "w-4.5 h-4.5"} />
    }
  ];
  
  const policyLinks = [
    { name: "Terms of Use", path: "/terms-and-services" },
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Cookie Policy", path: "/cookie-policy" },
    { name: "Refund Policy", path: "/cancellation-and-refund-policy" }
  ];

  return (
    <div className={`${isMobile ? 'mb-8' : 'space-y-8'}`}>
      {/* Enhanced Logo with appropriate sizing */}
      <div className={`relative ${isMobile ? 'flex justify-center mb-6' : 'mb-8 relative group'}`}>
        <div className={`absolute ${isMobile ? '-inset-2 bg-gradient-to-r from-primary-500/30 to-primary-400/30 rounded-2xl blur-lg' : '-inset-2 bg-gradient-to-r from-primary-500/30 to-primary-400/30 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-500'}`}></div>
        <Link href="/" className="relative block">
          <div className={`relative ${isMobile ? 'h-14 w-36 p-1.5 rounded-2xl' : 'h-16 w-42 p-1.5 rounded-xl'} bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center shadow-xl`}>
            <div className={`absolute ${isMobile ? 'inset-1.5 rounded-xl' : 'inset-1.5 rounded-lg'} bg-gradient-to-br from-black to-gray-900 ${!isMobile && 'backdrop-blur-sm'}`}></div>
            <div className="relative z-10 h-full w-full flex items-center justify-center px-3">
              {logoImage ? (
                <Image 
                  src={logoImage} 
                  alt="Medh Logo" 
                  width={isMobile ? 120 : 135}
                  height={isMobile ? 36 : 42}
                  className="object-contain"
                  priority
                />
              ) : (
                <span className={`text-white font-bold tracking-wider ${isMobile ? 'text-lg' : 'text-xl'}`}>MEDH</span>
              )}
            </div>
          </div>
        </Link>
      </div>
      
      {/* Enhanced Description with smaller, readable text */}
      <div className={`text-gray-300 ${isMobile ? 'mx-3 mb-6 text-sm leading-loose tracking-normal bg-black/30 p-5 rounded-2xl border border-white/10 backdrop-blur-sm' : 'text-xs md:text-sm mb-6 backdrop-blur-sm bg-black/30 p-4 rounded-xl border border-white/10 leading-loose tracking-normal'}`}>
        {description}
      </div>
      
      {/* Enhanced Contact info with QR Code - Centered Layout */}
      <div className={`${isMobile ? 'mx-3 p-5' : 'p-6'} bg-black/30 rounded-2xl backdrop-blur-sm border border-white/10`}>
        {isMobile && (
          <div className="mb-4 flex items-center gap-3">
            <span className="text-primary-400 bg-primary-500/20 p-2 rounded-lg border border-primary-500/30">
              <Info size={14} />
            </span>
            <Typography variant="h3" className="text-white text-sm tracking-wide">
              Contact Us
            </Typography>
          </div>
        )}
        
        <div className={`${isMobile ? 'grid grid-cols-1 gap-4' : 'flex items-center justify-center gap-6'}`}>
          {/* Contact Information - Vertically Aligned */}
          <div className="flex flex-col items-start space-y-1.5">
            {contact.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 group">
                <span className="text-primary-400 bg-primary-500/20 p-1.5 rounded-lg transition-colors duration-300 group-hover:bg-primary-500/30 border border-primary-500/30">
                  <span className="w-3 h-3 flex items-center justify-center">{item.icon}</span>
                </span>
                {item.isPhone ? (
                  <a 
                    href={`tel:${item.text.replace(/\s+/g, '')}`} 
                    className="text-gray-200 text-xs leading-relaxed tracking-wide group-hover:text-white transition-colors duration-300 hover:underline font-medium"
                  >
                    {formatPhoneNumber(item.text)}
                  </a>
                ) : item.isEmail ? (
                  <a 
                    href={`mailto:${item.text}`} 
                    className="text-gray-200 text-xs leading-relaxed tracking-normal group-hover:text-white transition-colors duration-300 hover:underline font-medium"
                  >
                    {item.text}
                  </a>
                ) : (
                  <span className="text-gray-200 text-xs md:text-sm leading-relaxed tracking-normal group-hover:text-white transition-colors duration-300 font-medium">
                    {item.text}
                  </span>
                )}
              </div>
            ))}
          </div>
          
          {/* QR Code Section - Vertically centered with contact */}
          {!isMobile && (
            <div className="flex flex-col items-center justify-center">
              <div className="group relative w-[85px] h-[85px] bg-gradient-to-br from-primary-500/25 to-primary-600/15 p-2 rounded-xl shadow-xl backdrop-blur-sm border border-white/25 transition-all duration-300 hover:border-primary-500/40 hover:shadow-primary-500/25">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/15 to-primary-400/15 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 bg-white rounded-lg overflow-hidden w-full h-full shadow-inner">
                  {qrCodeImage ? (
                    <Image 
                      src={qrCodeImage} 
                      alt="Medh QR Code" 
                      fill
                      className="object-contain p-1"
                      sizes="85px"
                      priority
                    />
                  ) : (
                    <div className="bg-gray-100 w-full h-full flex items-center justify-center">
                      <QrCode className="text-gray-600" size={35} />
                    </div>
                  )}
                </div>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Enhanced Policy Links - Aligned with Contact Layout */}
      {!isMobile && (
        <div className="bg-black/20 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
          <div className="flex items-start justify-center gap-6">
            {/* Left Column - Aligned with Contact Info */}
            <div className="flex flex-col items-start space-y-1.5">
              <button
                onClick={() => handleNavigation(policyLinks[0].path)}
                className="text-gray-300 hover:text-white transition-all duration-300 group flex items-center gap-2.5 py-1.5 px-2.5 rounded-lg hover:bg-white/15 font-medium text-xs leading-relaxed tracking-wide border border-transparent hover:border-primary-500/30"
                {...getHydrationSafeProps()}
              >
                <span className="text-primary-400/80 group-hover:text-primary-300 transition-colors text-sm leading-none">•</span>
                <span>{policyLinks[0].name}</span>
                <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-300 text-primary-400" />
              </button>
              <button
                onClick={() => handleNavigation(policyLinks[2].path)}
                className="text-gray-300 hover:text-white transition-all duration-300 group flex items-center gap-2.5 py-1.5 px-2.5 rounded-lg hover:bg-white/15 font-medium text-xs leading-relaxed tracking-wide border border-transparent hover:border-primary-500/30"
                {...getHydrationSafeProps()}
              >
                <span className="text-primary-400/80 group-hover:text-primary-300 transition-colors text-sm leading-none">•</span>
                <span>{policyLinks[2].name}</span>
                <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-300 text-primary-400" />
              </button>
            </div>
            
            {/* Right Column - Aligned with QR Code */}
            <div className="flex flex-col items-start space-y-1.5">
              <button
                onClick={() => handleNavigation(policyLinks[1].path)}
                className="text-gray-300 hover:text-white transition-all duration-300 group flex items-center gap-2.5 py-1.5 px-2.5 rounded-lg hover:bg-white/15 font-medium text-xs leading-relaxed tracking-wide border border-transparent hover:border-primary-500/30"
                {...getHydrationSafeProps()}
              >
                <span className="text-primary-400/80 group-hover:text-primary-300 transition-colors text-sm leading-none">•</span>
                <span>{policyLinks[1].name}</span>
                <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-300 text-primary-400" />
              </button>
              <button
                onClick={() => handleNavigation(policyLinks[3].path)}
                className="text-gray-300 hover:text-white transition-all duration-300 group flex items-center gap-2.5 py-1.5 px-2.5 rounded-lg hover:bg-white/15 font-medium text-xs leading-relaxed tracking-wide border border-transparent hover:border-primary-500/30"
                {...getHydrationSafeProps()}
              >
                <span className="text-primary-400/80 group-hover:text-primary-300 transition-colors text-sm leading-none">•</span>
                <span>{policyLinks[3].name}</span>
                <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-300 text-primary-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Social Media and Copyright Section */}
      {!isMobile && (
        <div className="bg-black/20 rounded-xl p-6 border border-white/10 backdrop-blur-sm space-y-6">
          {/* Social Media Links with better alignment */}
          <div className="flex justify-center gap-4">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit our ${link.name} page`}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-black hover:from-primary-600 hover:to-primary-700 text-gray-300 hover:text-white transition-all duration-300 shadow-lg hover:shadow-primary-500/40 border border-white/15 hover:border-primary-500/40 hover:scale-110"
                {...getHydrationSafeProps()}
              >
                {link.icon}
              </a>
            ))}
          </div>
          
          {/* Enhanced Copyright and Tagline with better alignment */}
          <div className="text-center space-y-4">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-500/50 to-transparent"></div>
            <p className="text-gray-300 text-xs leading-relaxed tracking-wide font-medium" {...getHydrationSafeProps()}>
              Copyright © {currentYear} MEDH.<br />All Rights Reserved.
            </p>
            <div className="relative">
              <p className="bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500 bg-clip-text text-transparent text-base font-bold tracking-widest animate-gradient leading-relaxed">
                LEARN. UPSKILL. ELEVATE.
              </p>
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-primary-400/20 to-primary-500/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FooterNavList: React.FC<IFooterNavListProps> = ({ logoImage, isMobile, qrCodeImage }) => {
  const router = useRouter();
  const isClient = useIsClient();
  const currentYear = useCurrentYear();
  
  // State management
  const [animateItems, setAnimateItems] = useState<boolean>(false);
  const [blendedCourses, setBlendedCourses] = useState<INavItem[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState<boolean>(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateItems(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Fetch blended courses from API
  useEffect(() => {
    const fetchBlendedCourses = async () => {
      try {
        setIsLoadingCourses(true);
        
        // Define the categories that should be shown in the footer (excluding categories already shown in Live Courses)
        const allowedCategories = [
          "AI For Professionals",
          "Business And Management", 
          "Career Development",
          "Communication And Soft Skills",
          "Data & Analytics",
          "Finance & Accounts",
          "Health & Wellness",
          "Industry-Specific Skills",
          "Language & Linguistic",
          "Legal & Compliance Skills",
          "Personal Well-Being",
          "Sales & Marketing",
          "Technical Skills",
          "Environmental and Sustainability Skills",
           // From API data
           // From API data (different from "Digital Marketing")
          // Removed: "AI and Data Science", "Personality Development", "Vedic Mathematics" 
          // as they are already shown in Live Courses section
        ];
        
        // Fetch courses using the new category API
        const response = await courseTypesAPI.getCoursesByCategory({
          status: 'Published',
          limit: 100 // Get more courses to ensure we have enough data
        });

        // The API response structure is: { status: 'success', data: { success: true, data: { coursesByCategory: {...} } } }
        const apiData = response?.data; // This contains the actual API response
        const coursesData = apiData?.data; // This contains the courses data
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Footer API Response - Courses by Category:', coursesData?.coursesByCategory ? Object.keys(coursesData.coursesByCategory) : 'N/A');
        }
        
        if (response && apiData?.success && coursesData?.coursesByCategory) {
          // Process the grouped API response
          const treeItems: INavItem[] = [];
          
          // Iterate through the coursesByCategory object
          Object.entries(coursesData.coursesByCategory).forEach(([categoryKey, coursesArray]) => {
            // Skip categories with IDs (like "6747fd4b8b344ccfe018fed2") and only process named categories
            if (categoryKey.length > 50 || !allowedCategories.includes(categoryKey)) {
              return;
            }
            
            const courses = coursesArray as any[];
            if (Array.isArray(courses) && courses.length > 0) {
              // Create tree structure for this category
              const categoryItem: INavItem = {
                name: `${categoryKey}`,
                path: `/courses?category=${encodeURIComponent(categoryKey)}`,
                count: courses.length,
                children: courses.map((course: any) => ({
                  name: course.course_title || 'Untitled Course',
                  path: `/course/${course._id}`,
                  count: 0
                }))
              };
              
              treeItems.push(categoryItem);
            }
          });

          // Sort categories alphabetically
          treeItems.sort((a, b) => a.name.localeCompare(b.name));
          
          setBlendedCourses(treeItems);
          
          // Debug log to verify data structure in development
          if (process.env.NODE_ENV === 'development') {
            console.log('Blended courses loaded:', treeItems.length, 'categories');
            treeItems.forEach(cat => {
              if (cat.children && cat.children.length > 0) {
                console.log(`${cat.name}: ${cat.children.length} courses`, cat.children.slice(0, 2).map(c => c.name));
              }
            });
          }
        } else {
          console.warn('No courses data received from new API');
          // Use fallback data
          setBlendedCourses([
            { name: "AI For Professionals", path: "/courses/?category=AI For Professionals", children: [] },
            { name: "Business And Management", path: "/courses/?category=Business And Management", children: [] },
            { name: "Career Development", path: "/courses/?category=Career Development", children: [] },
            { name: "Communication And Soft Skills", path: "/courses/?category=Communication And Soft Skills", children: [] },
            { name: "Data & Analytics", path: "/courses/?category=Data & Analytics", children: [] },
            { name: "Finance & Accounts", path: "/courses/?category=Finance & Accounts", children: [] },
            { name: "Health & Wellness", path: "/courses/?category=Health & Wellness", children: [] },
            { name: "Industry-Specific Skills", path: "/courses/?category=Industry-Specific Skills", children: [] },
            { name: "Language & Linguistic", path: "/courses/?category=Language & Linguistic", children: [] },
            { name: "Legal & Compliance Skills", path: "/courses/?category=Legal & Compliance Skills", children: [] },
            { name: "Personal Well-Being", path: "/courses/?category=Personal Well-Being", children: [] },
            { name: "Sales & Marketing", path: "/courses/?category=Sales & Marketing", children: [] },
            { name: "Technical Skills", path: "/courses/?category=Technical Skills", children: [] },
            { name: "Environmental and Sustainability Skills", path: "/courses/?category=Environmental and Sustainability Skills", children: [] },
          ]);
        }
      } catch (error) {
        console.error('Error fetching courses by category:', error);
        console.error('Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : 'No stack trace',
          error
        });
        // Use fallback data on error
        setBlendedCourses([
          { name: "AI For Professionals", path: "/courses/?category=AI For Professionals", children: [] },
          { name: "Business And Management", path: "/courses/?category=Business And Management", children: [] },
          { name: "Career Development", path: "/courses/?category=Career Development", children: [] },
          { name: "Communication And Soft Skills", path: "/courses/?category=Communication And Soft Skills", children: [] },
          { name: "Data & Analytics", path: "/courses/?category=Data & Analytics", children: [] },
          { name: "Finance & Accounts", path: "/courses/?category=Finance & Accounts", children: [] },
          { name: "Health & Wellness", path: "/courses/?category=Health & Wellness", children: [] },
          { name: "Industry-Specific Skills", path: "/courses/?category=Industry-Specific Skills", children: [] },
          { name: "Language & Linguistic", path: "/courses/?category=Language & Linguistic", children: [] },
          { name: "Legal & Compliance Skills", path: "/courses/?category=Legal & Compliance Skills", children: [] },
          { name: "Personal Well-Being", path: "/courses/?category=Personal Well-Being", children: [] },
          { name: "Sales & Marketing", path: "/courses/?category=Sales & Marketing", children: [] },
          { name: "Technical Skills", path: "/courses/?category=Technical Skills", children: [] },
          { name: "Environmental and Sustainability Skills", path: "/courses/?category=Environmental and Sustainability Skills", children: [] },
        ]);
      } finally {
        setIsLoadingCourses(false);
      }
    };

    if (isClient) {
      fetchBlendedCourses();
    }
  }, [isClient]);

  // About Us content
  const aboutUsContent: IAboutUsContent = {
    title: "About Medh",
    description: "Medh is an innovative ed-tech platform that empowers learners with industry-ready skills through expert-led courses, personalized learning paths, and guaranteed job placements.",
    contact: [
      { icon: <Phone className="w-3.5 h-3.5" />, text: "+917710840696", isPhone: true },
      { icon: <Mail className="w-3.5 h-3.5" />, text: "care@medh.co", isEmail: true }
    ]
  };
  
  const lists: INavList[] = [
    {
      heading: "Join Us",
              icon: <UserPlus className="w-4 h-4" />,
      items: [
        { name: "As an Educator", path: "/join-us-as-educator" },
        { name: "As a School / Institute", path: "/join-us-as-school-institute" },
        { name: "Career@Medh", path: "/careers" },
        { name: "Hire from Medh", path: "/hire-from-medh" },
        { name: "Medh Membership", path: "/medh-membership" },
      ],
    },
    {
      heading: "Quick Menu",
              icon: <Menu className="w-4 h-4" />,
      items: [
        { name: "About Us", path: "/about-us" },
        { name: "Blog", path: "/blogs" },
        { name: "Corporate Training", path: "/corporate-training-courses" }, 
        { name: "News and Media", path: "/news-and-media" },
        { name: "Contact Us", path: "/contact-us" },
      ],
    },
    {
      heading: "Live Courses",
              icon: <GraduationCap className="w-4 h-4" />,
      items: [
        { name: "AI & Data Science", path: "/courses/?category=ai-data-science" },
        { name: "Digital Marketing", path: "/courses/?category=digital-marketing" },
        { name: "Personality Development", path: "/courses/?category=personality-development" },
        { name: "Vedic Mathematics", path: "/courses/?category=vedic-mathematics" },
      ],
    },
    {
      heading: "Blended Courses (Self-Paced with Live Q&A Sessions)",
      icon: <Info className="w-3.5 h-3.5" />,
      items: isLoadingCourses ? [{ name: "Loading courses...", path: "#" }] : blendedCourses,
    },
  ];

  // Enhanced mobile view with smaller typography
  if (isMobile) {
    return (
      <div className="flex flex-col px-3">
        {/* About section */}
        <AboutSection 
          logoImage={logoImage} 
          description={aboutUsContent.description}
          contact={aboutUsContent.contact}
          qrCodeImage={qrCodeImage}
          isMobile={true}
        />
        
        {/* Navigation lists with smaller spacing */}
        <div className="mt-5 space-y-2 divide-y divide-white/10">
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

  // Enhanced desktop view with optimized left-right layout
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
      {/* Left Section - About, QR Code, and Copyright (Smaller) */}
      <div className="lg:col-span-4 space-y-5">
        {/* About Section */}
        <AboutSection 
          logoImage={logoImage} 
          description={aboutUsContent.description}
          contact={aboutUsContent.contact}
          qrCodeImage={qrCodeImage}
          isMobile={false}
        />
      </div>

      {/* Right Section - Navigation Lists (Larger for more courses) */}
      <div className="lg:col-span-8 space-y-6">
        {/* First 3 sections in 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {lists.slice(0, 3).map((list, idx) => (
            <NavList 
              key={idx}
              title={list.heading}
              icon={list.icon}
              items={list.items}
              isMobile={false}
              className={`transition-all duration-500 transform ${animateItems ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
              style={{ transitionDelay: `${200 + (idx * 150)}ms` }}
            />
          ))}
        </div>
        
        {/* Blended section with tree structure to show course titles */}
        {lists.slice(3).map((list, idx) => (
          <div key={idx + 3} className={`transition-all duration-500 transform ${animateItems ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: `${200 + ((idx + 3) * 150)}ms` }}>
            <div className="group relative backdrop-blur-sm bg-gradient-to-br from-black/30 to-black/20 p-5 rounded-2xl border border-white/10 hover:border-primary-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary-500/10 hover:scale-[1.01]">
              {/* Enhanced background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Enhanced header with better styling */}
              <div className="relative z-10 flex items-center gap-2.5 mb-4 pb-2.5 border-b border-white/10 group-hover:border-primary-500/20 transition-colors duration-300">
                <div className="relative">
                  <span className="text-primary-400 bg-gradient-to-br from-primary-500/25 to-primary-600/20 p-2 rounded-xl border border-primary-500/30 shadow-lg group-hover:shadow-primary-500/30 transition-all duration-300 group-hover:scale-110">
                    <span className="w-4 h-4 flex items-center justify-center">{list.icon}</span>
                  </span>
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-primary-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <Typography variant="h3" className="text-white text-sm font-semibold tracking-wide group-hover:text-primary-100 transition-colors duration-300">
                  {list.heading}
                </Typography>
                {isLoadingCourses && (
                  <div className="ml-auto">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-400"></div>
                  </div>
                )}
              </div>
              
                            {/* Enhanced Tree Structure with Improved Readability */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
                {list.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="group/category bg-gradient-to-br from-black/25 to-black/15 rounded-xl p-4 border border-white/10 hover:border-primary-500/30 transition-all duration-300 hover:bg-gradient-to-br hover:from-black/35 hover:to-black/25 hover:shadow-lg">
                      {/* Enhanced Category Header */}
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/15">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary-400 rounded-full opacity-80"></div>
                          <h4 className="text-white text-sm font-semibold leading-tight">
                            {item.name}
                          </h4>
                        </div>
                        {item.count && (
                          <span className="text-xs text-primary-300 bg-primary-500/15 px-2 py-1 rounded-full border border-primary-500/25 font-medium">
                            {item.count}
                          </span>
                        )}
                      </div>
                      
                      {/* Course List with Better Spacing */}
                      {item.children && item.children.length > 0 ? (
                        <div className="space-y-1">
                          <ul className={`space-y-1 ${item.children.length > 6 ? 'max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary-500/50 scrollbar-track-gray-800/30' : ''}`}>
                            {item.children.map((child, childIndex) => (
                              <li key={childIndex}>
                                <Link
                                  href={child.path}
                                  className="group/child flex items-start gap-2.5 text-gray-300 hover:text-white text-xs py-1.5 px-2 rounded-lg transition-all duration-200 hover:bg-white/5 hover:translate-x-1"
                                >
                                  <span className="text-primary-400/70 text-sm mt-0.5 flex-shrink-0">•</span>
                                  <span className="flex-1 leading-relaxed" style={{ 
                                     display: '-webkit-box',
                                     WebkitLineClamp: 3,
                                     WebkitBoxOrient: 'vertical',
                                     overflow: 'hidden'
                                   }}>{child.name}</span>
                                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/child:opacity-100 transition-all transform group-hover/child:translate-x-0.5 group-hover/child:-translate-y-0.5 duration-300 text-primary-400 flex-shrink-0 mt-1" />
                                </Link>
                              </li>
                            ))}
                          </ul>
                          {item.children.length > 6 && (
                            <div className="text-xs text-gray-400 mt-3 pt-2 border-t border-white/10 text-center bg-black/20 rounded-lg py-2">
                              <span className="text-primary-400">+{item.children.length - 6}</span> more courses available
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-xs italic bg-black/20 rounded-lg p-3 text-center">
                          No courses available
                        </div>
                      )}
                    </div>
                  ))}
              </div>
              
              {/* Decorative corner accent */}
              <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FooterNavList;
