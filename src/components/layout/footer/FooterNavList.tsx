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
      ribbonBg: 'bg-gray-300',
      ribbonBorder: 'border-gray-400',
      titleText: 'text-gray-900',
      bodyText: 'text-gray-700',
      linkText: 'text-gray-600 hover:text-gray-900',
      contactText: 'text-gray-600 hover:text-gray-900',
      qrShadow: 'shadow-lg',
      navBorder: 'border-gray-400',
      learningBg: 'bg-gray-200',
      learningBorder: 'border-gray-300',
    },
    dark: {
      container: 'text-white',
      ribbonBg: 'bg-slate-800',
      ribbonBorder: 'border-slate-700',
      titleText: 'text-white',
      bodyText: 'text-gray-300',
      linkText: 'text-gray-400 hover:text-white',
      contactText: 'text-gray-300 hover:text-white',
      qrShadow: 'shadow-xl shadow-black/20',
      navBorder: 'border-slate-700',
      learningBg: 'bg-slate-800',
      learningBorder: 'border-slate-700',
    }
  };

  const currentTheme = themeStyles[theme];

  if (!isClient) {
    return <div className={currentTheme.container}>Loading...</div>;
  }

  return (
    <div className={`${currentTheme.container} ${theme === 'light' ? 'bg-gray-200' : 'bg-slate-900'}`}>
      {/* Navigation Sections - 3 Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {navigationSections.map((section, index) => {
            // Skip Learning section in main grid - it will be rendered separately
            if (section.title === "Learning") return null;
            
                          return (
                <div key={index} className="space-y-6">
                  <h3 className={`text-xl font-bold ${currentTheme.titleText} border-b ${currentTheme.navBorder} pb-3`}>
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <Link 
                          href={item.path}
                          className={`${currentTheme.linkText} transition-colors text-base flex items-center gap-2 py-1`}
                        >
                          {item.name}
                          <ExternalLink className="w-3 h-3 opacity-0 hover:opacity-100 transition-opacity" />
                        </Link>
                        
                        {item.children && (
                          <ul className="ml-4 mt-3 space-y-2">
                            {item.children.map((child, childIndex) => (
                              <li key={childIndex}>
                                <Link 
                                  href={child.path}
                                  className={`${theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-gray-500 hover:text-gray-300'} transition-colors text-sm flex items-center gap-2 py-1`}
                                >
                                  <span className={`w-1.5 h-1.5 ${theme === 'light' ? 'bg-gray-400' : 'bg-gray-600'} rounded-full`}></span>
                                  {child.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
          })}
        </div>
      </div>

      {/* Learning Section - Full Width */}
      {navigationSections.find(section => section.title === "Learning") && (
        <div className="mt-16">
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

      {/* Company Info Section - Just above bottom section */}
      <div className="mt-16">
        <div className={`border-t ${currentTheme.navBorder}`}></div>
        <div className={`${currentTheme.ribbonBg} border-b ${currentTheme.ribbonBorder} py-12 mt-0`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              
              {/* Logo & Description Section */}
              <div className="space-y-6">
                <Link href="/" className="inline-block">
                  <div className="relative w-[160px] h-[50px]">
                    {/* Dark mode logo (LogoDark) */}
                    <Image 
                      src={LogoDark} 
                      alt="Medh Logo Dark" 
                      width={160}
                      height={50}
                      className={`object-contain transition-all duration-500 ease-in-out ${
                        theme === 'dark' ? 'opacity-100 visible' : 'opacity-0 invisible'
                      }`}
                      priority
                    />
                    
                    {/* Light mode logo (LogoLight) */}
                    <Image 
                      src={LogoLight} 
                      alt="Medh Logo Light" 
                      width={160}
                      height={50}
                      className={`object-contain transition-all duration-500 ease-in-out absolute top-0 left-0 ${
                        theme === 'light' ? 'opacity-100 visible' : 'opacity-0 invisible'
                      }`}
                      priority
                    />
                  </div>
                </Link>
                <p className={`${currentTheme.bodyText} text-base leading-relaxed`}>
                  Medh is an innovative ed-tech platform that empowers learners with industry-ready skills 
                  through expert-led courses, personalized learning paths, and guaranteed job placements.
                </p>
                
                {/* Contact Info - Single Line */}
                <div className="space-y-3">
                  <h3 className={`text-xl font-semibold ${currentTheme.titleText}`}>Contact Us</h3>
                  <div className={`flex flex-col sm:flex-row gap-4 sm:gap-8 ${currentTheme.bodyText}`}>
                    <a 
                      href="tel:+917710840696"
                      className={`${currentTheme.contactText} transition-colors text-base font-medium`}
                    >
                      +917710840696
                    </a>
                    <a 
                      href="mailto:care@medh.co"
                      className={`${currentTheme.contactText} transition-colors text-base font-medium`}
                    >
                      care@medh.co
                    </a>
                    <span className="text-base font-medium">
                      India
                    </span>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className={`w-32 h-32 bg-white rounded-2xl p-3 ${currentTheme.qrShadow}`}>
                  <Image 
                    src={QRCode} 
                    alt="Medh QR Code" 
                    width={128}
                    height={128}
                    className="object-contain w-full h-full"
                  />
                </div>
                <div className="text-center space-y-1">
                  <p className={`text-lg font-semibold ${currentTheme.titleText}`}>Medh QR Code</p>
                  <p className={`text-base ${currentTheme.bodyText}`}>Scan to visit</p>
                  <p className={`text-base ${currentTheme.bodyText}`}>Our website</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-12">
        <div className={`border-t ${currentTheme.navBorder}`}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Policy Links */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              {policyLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.path}
                  className={`${currentTheme.linkText} transition-colors text-sm`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-4">
              <span className={`text-sm ${currentTheme.bodyText}`}>Follow us:</span>
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
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${theme === 'light' ? 'bg-gray-400 hover:bg-primary-600 text-gray-700 hover:text-white' : 'bg-slate-700 hover:bg-primary-600 text-gray-300 hover:text-white'} transition-colors`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6">
            <div className={`border-t ${currentTheme.navBorder}`}></div>
            <div className="text-center pt-6">
              <p className={`${currentTheme.bodyText} text-sm`}>
                Copyright © {currentYear} MEDH. All Rights Reserved.
              </p>
              <p className="text-primary-400 text-sm font-medium mt-2">
                LEARN. UPSKILL. ELEVATE.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterNavList;
