import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  UserPlus, 
  Menu, 
  GraduationCap, 
  Info, 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Youtube,
  ExternalLink
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useIsClient, useCurrentYear } from "@/utils/hydration";
import { courseTypesAPI } from "@/apis/courses";
import LogoDark from "@/assets/images/logo/medh_logo-1.png";
import LogoLight from "@/assets/images/logo/medh_logo-2.png";
import QRCode from "@/assets/images/footer/qr.png";

// Allowed categories for blended courses
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
];

// TypeScript interfaces
interface INavItem {
  name: string;
  path: string;
  children?: INavItem[];
  isBlendedColumn?: boolean;
}

interface INavSection {
  title: string;
  items: INavItem[];
}

interface IContactInfo {
  phone: string;
  email: string;
  address: string;
}

interface FooterNavListProps {
  theme?: 'light' | 'dark';
}

const FooterNavList: React.FC<FooterNavListProps> = ({ theme = 'dark' }) => {
  const router = useRouter();
  const isClient = useIsClient();
  const currentYear = useCurrentYear();
  
  // State for courses
  const [blendedCourses, setBlendedCourses] = useState<INavItem[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState<boolean>(false);

  // Fetch blended courses from API
  useEffect(() => {
    const fetchBlendedCourses = async () => {
      try {
        setIsLoadingCourses(true);
        
        const response = await courseTypesAPI.getCoursesByCategory({
          status: 'Published',
          limit: 100
        });

        const apiData = response?.data;
        const coursesData = apiData?.data;
        
        if (response && apiData?.success && coursesData?.coursesByCategory) {
          const treeItems: INavItem[] = [];
          
          // Create items for all allowed categories, whether they have courses or not
          allowedCategories.forEach((categoryKey) => {
            const coursesArray = coursesData.coursesByCategory[categoryKey] || [];
            const courses = coursesArray as any[];
            
            const categoryItem: INavItem = {
              name: categoryKey,
              path: `/courses?category=${encodeURIComponent(categoryKey)}`,
              children: Array.isArray(courses) && courses.length > 0 
                ? courses.slice(0, 6).map((course: any) => ({
                    name: course.course_title || 'Untitled Course',
                    path: `/course-details/${course._id}`
                  }))
                : [] // Empty array for categories without courses
            };
            
            treeItems.push(categoryItem);
          });

          setBlendedCourses(treeItems);
        } else {
          // Fallback data - show all allowed categories
          const fallbackItems = allowedCategories.map(category => ({
            name: category,
            path: `/courses?category=${encodeURIComponent(category)}`,
            children: [] // Empty children for fallback
          }));
          setBlendedCourses(fallbackItems);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        // Use fallback data on error - show all allowed categories
        const fallbackItems = allowedCategories.map((category: string) => ({
          name: category,
          path: `/courses?category=${encodeURIComponent(category)}`,
          children: [] // Empty children for fallback
        }));
        setBlendedCourses(fallbackItems);
      } finally {
        setIsLoadingCourses(false);
      }
    };

    if (isClient) {
      fetchBlendedCourses();
    }
  }, [isClient]);

  // Contact information
  const contactInfo: IContactInfo = {
    phone: "+917710840696",
    email: "care@medh.co",
    address: "India"
  };

  // Navigation sections - Site Map Structure
  const navigationSections: INavSection[] = [
    {
      title: "Company",
      items: [
        { name: "About Us", path: "/about-us" },
        { name: "News and Media", path: "/news-and-media" },
        { name: "Blog", path: "/blogs" },
        { name: "Contact Us", path: "/contact-us" },
      ]
    },
    {
      title: "Join Us",
      items: [
        { name: "As an Educator", path: "/join-us-as-educator" },
        { name: "As a School/Institute", path: "/join-us-as-school-institute" },
        { name: "Careers at Medh", path: "/careers" },
      ]
    },
    {
      title: "Services",
      items: [
        { name: "Corporate Training", path: "/corporate-training-courses" },
        { name: "Medh Membership", path: "/medh-membership" },
        { name: "Hire from Medh", path: "/hire-from-medh" },
      ]
    },
    {
      title: "Learning",
      items: [
        { 
          name: "Live Courses", 
          path: "/courses",
          children: [
            { name: "AI & Data Science", path: "/courses/?category=ai-data-science" },
            { name: "Digital Marketing", path: "/courses/?category=digital-marketing" },
            { name: "Personality Development", path: "/courses/?category=personality-development" },
            { name: "Vedic Mathematics", path: "/courses/?category=vedic-mathematics" },
          ]
        },
        { 
          name: "Blended Courses (Self-paced with Live Q&A sessions)", 
          path: "/courses",
          children: isLoadingCourses 
            ? [{ name: "Loading...", path: "#" }] 
            : (() => {
                // Sort blended courses by course count in ascending order
                const sortedCourses = [...blendedCourses].sort((a, b) => 
                  (a.children?.length || 0) - (b.children?.length || 0)
                );
                
                // Split into 4 columns
                const itemsPerColumn = Math.ceil(sortedCourses.length / 4);
                const columns = [];
                
                for (let i = 0; i < 4; i++) {
                  const start = i * itemsPerColumn;
                  const end = start + itemsPerColumn;
                  const columnItems = sortedCourses.slice(start, end);
                  
                  if (columnItems.length > 0) {
                    columns.push({
                      name: `Column ${i + 1}`,
                      path: "#",
                      children: columnItems,
                      isBlendedColumn: true
                    });
                  }
                }
                
                return columns;
              })()
        }
      ]
    }
  ];

  // Social media links
  const socialLinks = [
    { name: "Facebook", url: "https://www.facebook.com/medhupskill/", icon: Facebook },
    { name: "LinkedIn", url: "https://www.linkedin.com/company/101210304/admin/feed/posts/", icon: Linkedin },
    { name: "Instagram", url: "https://www.instagram.com/medhupskill/", icon: Instagram },
    { name: "YouTube", url: "https://www.youtube.com/channel/UC4EMmw69w-877_fxJExZWyw", icon: Youtube }
  ];

  // Policy links
  const policyLinks = [
    { name: "Terms of Use", path: "/terms-and-services" },
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Cookie Policy", path: "/cookie-policy" },
    { name: "Refund Policy", path: "/cancellation-and-refund-policy" }
  ];

  // Theme-aware styling - Improved dark mode colors
  const themeStyles = {
    light: {
      container: 'text-gray-900',
      titleText: 'text-gray-900',
      bodyText: 'text-gray-700',
      linkText: 'text-gray-600 hover:text-gray-900',
      contactText: 'text-gray-600 hover:text-gray-900',
      navBorder: 'border-gray-400',
      learningBg: 'bg-gray-200',
      learningBorder: 'border-gray-300',
    },
    dark: {
      container: 'text-white',
      titleText: 'text-white',
      bodyText: 'text-gray-300',
      linkText: 'text-gray-400 hover:text-white',
      contactText: 'text-gray-300 hover:text-white',
      navBorder: 'border-slate-700',
      learningBg: 'bg-slate-800',
      learningBorder: 'border-slate-700',
    }
  };

  const currentTheme = themeStyles[theme];

  if (!isClient) {
    return (
      <div className="relative bg-white/10 dark:bg-slate-800/10 backdrop-blur-md rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-white/20 dark:bg-slate-700/20 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-6 bg-white/20 dark:bg-slate-700/20 rounded w-3/4"></div>
                <div className="space-y-2">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-4 bg-white/15 dark:bg-slate-700/15 rounded w-full"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${currentTheme.container} prevent-shift`}>
      {/* Additional floating elements specific to footer */}
      <div className="absolute -top-16 left-1/4 w-20 h-20 bg-gradient-radial from-blue-300/20 via-indigo-400/10 to-transparent rounded-full blur-xl animate-pulse delay-100 gpu-accelerated"></div>
      <div className="absolute -bottom-8 right-1/3 w-24 h-24 bg-gradient-radial from-violet-300/18 via-purple-400/9 to-transparent rounded-full blur-xl animate-pulse delay-900 gpu-accelerated"></div>
      
      {/* Navigation Sections - Original 3 Column Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 prevent-shift">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 grid-no-shift">
          {navigationSections.map((section, index) => {
            if (section.title === "Learning") return null;
            
            return (
              <div key={index} className="flex-no-shift">
                <h2 className={`text-xl font-bold ${currentTheme.titleText} mb-6`}>{section.title}</h2>
                <ul className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex-no-shift">
                      <Link 
                        href={item.path}
                        className={`text-base ${currentTheme.bodyText} ${currentTheme.contactText} transition-colors flex items-center gap-3`}
                      >
                        {item.name}
                        <ExternalLink className="w-4 h-4 opacity-0 hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Learning Section - Original Full Width Design */}
      {navigationSections.find(section => section.title === "Learning") && (
        <div className="relative z-10 mt-16">
          <div className={`border-t ${currentTheme.navBorder}`}></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <h2 className={`text-2xl font-bold ${currentTheme.titleText} mb-8 text-center`}>Learning</h2>
            
            <div className="space-y-12">
              {navigationSections.find(section => section.title === "Learning")?.items.map((item, itemIndex) => (
                <div key={itemIndex}>
                  {/* Section Header */}
                  <div className="mb-6">
                    <Link 
                      href={item.path}
                      className={`text-xl font-semibold ${currentTheme.bodyText} ${currentTheme.contactText} transition-colors flex items-center gap-3 mb-2`}
                    >
                      {item.name}
                      <ExternalLink className="w-4 h-4 opacity-0 hover:opacity-100 transition-opacity" />
                    </Link>
                  </div>
                  
                  {/* Blended Courses 4-Column Layout */}
                  {item.name.includes("Blended Courses") && item.children && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
                      {item.children.map((column, columnIndex) => (
                        column.isBlendedColumn && (
                          <div key={columnIndex} className="space-y-5">
                            {column.children?.map((category, categoryIndex) => (
                              <div key={categoryIndex} className="space-y-3">
                                <Link 
                                  href={category.path}
                                  className={`${currentTheme.bodyText} ${currentTheme.contactText} transition-colors text-sm font-semibold block py-2 leading-tight border-b ${currentTheme.learningBorder} pb-1`}
                                >
                                  {category.name}
                                </Link>
                                {category.children && category.children.length > 0 && (
                                  <ul className="space-y-2 pl-0">
                                    {category.children.map((course, courseIndex) => (
                                      <li key={courseIndex}>
                                        <Link 
                                          href={course.path}
                                          className={`${theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-gray-500 hover:text-gray-300'} transition-colors text-xs flex items-start gap-2 py-1 leading-relaxed`}
                                        >
                                          <span className={`w-1 h-1 ${theme === 'light' ? 'bg-gray-400' : 'bg-gray-500'} rounded-full flex-shrink-0 mt-2`}></span>
                                          <span className="break-words hyphens-auto">{course.name}</span>
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        )
                      ))}
                    </div>
                  )}
                  
                  {/* Regular Live Courses Layout */}
                  {!item.name.includes("Blended Courses") && item.children && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {item.children.map((child, childIndex) => (
                        <Link 
                          key={childIndex}
                          href={child.path}
                          className={`${currentTheme.linkText} transition-colors text-sm flex items-center gap-3 py-2 px-4 ${currentTheme.learningBg} rounded-lg hover:${theme === 'light' ? 'bg-gray-400' : 'bg-slate-700'}`}
                        >
                          <span className="w-2 h-2 bg-primary-400 rounded-full flex-shrink-0"></span>
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Company Info Section - Enhanced Glassmorphic Design */}
      <div className="relative z-10 mt-16">
        <div className={`border-t ${currentTheme.navBorder}`}></div>
        <div className="relative bg-gradient-to-r from-white/15 via-white/20 to-white/15 dark:from-slate-800/15 dark:via-slate-800/20 dark:to-slate-800/15 backdrop-blur-xl border-b border-white/25 dark:border-slate-600/25 py-12 mt-0">
          
          {/* Additional atmospheric elements */}
          <div className="absolute top-4 left-4 w-16 h-16 bg-gradient-radial from-blue-400/20 via-transparent to-transparent rounded-full blur-lg"></div>
          <div className="absolute bottom-4 right-4 w-20 h-20 bg-gradient-radial from-violet-400/15 via-transparent to-transparent rounded-full blur-xl"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              
              {/* Logo & Description Section - Enhanced */}
              <div className="relative bg-white/20 dark:bg-slate-800/20 backdrop-blur-lg rounded-2xl border border-white/25 dark:border-slate-600/25 p-6 lg:p-8 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-indigo-500/10 rounded-2xl"></div>
                
                <div className="relative z-10 space-y-6">
                  <Link href="/" className="inline-block group">
                    <div className="relative w-[160px] h-[50px] group-hover:scale-105 transition-transform duration-200">
                      <Image 
                        src={LogoDark} 
                        alt="Medh Logo Dark" 
                        width={160}
                        height={50}
                        className={`object-contain transition-all duration-500 ease-in-out ${
                          theme === 'dark' ? 'opacity-100 visible' : 'opacity-0 invisible'
                        }`}
                        style={{ width: 'auto' }}
                        priority
                      />
                      <Image 
                        src={LogoLight} 
                        alt="Medh Logo Light" 
                        width={160}
                        height={50}
                        className={`object-contain transition-all duration-500 ease-in-out absolute top-0 left-0 ${
                          theme === 'light' ? 'opacity-100 visible' : 'opacity-0 invisible'
                        }`}
                        style={{ width: 'auto' }}
                        priority
                      />
                    </div>
                  </Link>
                  
                  <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                    Medh is an innovative ed-tech platform that empowers learners with industry-ready skills 
                    through expert-led courses, personalized learning paths, and guaranteed job placements.
                  </p>
                  
                  {/* Contact Info - Enhanced */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      Contact Us
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                      <a 
                        href="tel:+917710840696"
                        className="group flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-base font-medium"
                      >
                        <Phone className="w-4 h-4" />
                        +917710840696
                      </a>
                      <a 
                        href="mailto:care@medh.co"
                        className="group flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-base font-medium"
                      >
                        <Mail className="w-4 h-4" />
                        care@medh.co
                      </a>
                      <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-base font-medium">
                        <MapPin className="w-4 h-4" />
                        India
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code Section - Enhanced */}
              <div className="relative bg-white/20 dark:bg-slate-800/20 backdrop-blur-lg rounded-2xl border border-white/25 dark:border-slate-600/25 p-6 lg:p-8 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10 rounded-2xl"></div>
                
                <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
                  <div className="relative bg-white rounded-2xl p-4 shadow-xl shadow-slate-900/20 dark:shadow-black/30 hover:shadow-2xl hover:shadow-slate-900/30 dark:hover:shadow-black/40 transition-all duration-300 hover:scale-105">
                    <Image 
                      src={QRCode} 
                      alt="Medh QR Code" 
                      width={128}
                      height={128}
                      className="object-contain w-32 h-32"
                    />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">Medh QR Code</p>
                    <p className="text-base text-slate-600 dark:text-slate-400">Scan to visit our website</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Enhanced */}
      <div className="relative z-10 mt-12">
        <div className={`border-t ${currentTheme.navBorder}`}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Policy Links - Enhanced */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              {policyLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.path}
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium px-3 py-1 rounded-lg hover:bg-white/20 dark:hover:bg-slate-700/20"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Social Media - Enhanced */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Follow us:</span>
              <div className="flex gap-3">
                {socialLinks.map((link, index) => {
                  const IconComponent = link.icon;
                  return (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit our ${link.name} page`}
                      className="group w-10 h-10 flex items-center justify-center rounded-xl bg-white/20 dark:bg-slate-700/20 hover:bg-blue-500/80 dark:hover:bg-blue-500/80 text-slate-600 dark:text-slate-400 hover:text-white transition-all duration-200 hover:scale-110 hover:-translate-y-1 backdrop-blur-sm border border-white/20 dark:border-slate-600/20"
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Copyright - Enhanced */}
          <div className="mt-8">
            <div className={`border-t ${currentTheme.navBorder}`}></div>
            <div className="relative bg-white/10 dark:bg-slate-800/10 backdrop-blur-sm rounded-xl border border-white/15 dark:border-slate-600/15 mt-6 p-6 text-center">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent dark:via-slate-700/5 rounded-xl"></div>
              
              <div className="relative z-10 space-y-3">
                <p className={`${currentTheme.bodyText} text-sm`}>
                  Copyright © {currentYear} MEDH. All Rights Reserved.
                </p>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold">
                  LEARN. UPSKILL. ELEVATE.
                </p>
                <p className={`${currentTheme.bodyText} text-xs`}>
                  All trademarks and logos appearing on this website are the property of their respective owners.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterNavList;
