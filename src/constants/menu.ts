// Menu configuration for mobile and desktop navigation
import { LucideIcon } from 'lucide-react';
import { 
  Home, Book, Bell, Settings, Info, HelpCircle, Award, Bookmark, 
  Heart, Share2, Calendar, Sun, Moon, Users, GraduationCap, Briefcase, 
  FileText, ExternalLink, Mail, Phone, MapPin, DollarSign, Globe, BarChart, 
  User, HardDrive, Database, Monitor, Server, Cpu, Stethoscope, BookOpen,
  TrendingUp, ShoppingBag, Camera, Crown, Newspaper, UserPlus, School
} from 'lucide-react';

/**
 * Interface for menu item configuration
 */
interface IMenuItem {
  icon: LucideIcon;
  label: string;
  path: string;
  color: string;
  bg: string;
}

/**
 * Interface for submenu item configuration
 */
interface ISubmenuItem {
  name: string;
  path: string;
  icon: LucideIcon;
  color: string;
}

/**
 * Interface for navigation section with optional dropdown
 */
interface INavSection {
  icon: LucideIcon;
  label: string;
  path: string;
  color: string;
  bg: string;
  isRelative: boolean;
  dropdown?: boolean;
  submenu?: ISubmenuItem[];
}

/**
 * Interface for quick actions configuration
 */
interface IQuickActions {
  guest: IMenuItem[];
  authenticated: IMenuItem[];
}

/**
 * Interface for suggestion types mapping
 */
interface ISuggestionTypes {
  course: LucideIcon;
  blog: LucideIcon;
  instructor: LucideIcon;
  default: LucideIcon;
}

/**
 * Main menu configuration interface
 */
interface IMenuConfig {
  quickActions: IQuickActions;
  navSections: INavSection[];
  industries: IMenuItem[];
  suggestionTypes: ISuggestionTypes;
}

/**
 * Centralized configuration for navigation menus across the application
 * Used by MobileMenu and potentially other navigation components
 */
export const MENU_CONFIG: IMenuConfig = {
  // Quick actions configuration
  quickActions: {
    guest: [
      { icon: Home, label: "Home", path: "/", color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' },
      { icon: Book, label: "Courses", path: "/courses", color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' },
    ],
    authenticated: [
      { icon: Home, label: "Home", path: "/", color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' },
      { icon: Book, label: "Courses", path: "/courses", color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' },
      { icon: Bell, label: "Notifications", path: "/notifications", color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/20' },
      { icon: Bookmark, label: "Saved", path: "/saved", color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/20' }
    ]
  },
  
  // Primary navigation sections
  navSections: [
    { icon: Info, label: 'About', path: '/about-us', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20', isRelative: false },
    { icon: FileText, label: 'Blog', path: '/blogs', color: 'text-pink-500', bg: 'bg-pink-100 dark:bg-pink-900/20', isRelative: false },
    { 
      icon: GraduationCap, 
      label: 'Courses', 
      path: '/courses', 
      color: 'text-blue-500', 
      bg: 'bg-blue-100 dark:bg-blue-900/20', 
      isRelative: true, 
      dropdown: true,
      submenu: [
        { 
          name: "AI and Data Science", 
          path: "/ai-and-data-science-course",
          icon: Cpu,
          color: 'text-indigo-500'
        },
        { 
          name: "Personality Development", 
          path: "/personality-development-course",
          icon: User,
          color: 'text-teal-500'
        },
        { 
          name: "Vedic Mathematics", 
          path: "/vedic-mathematics-course",
          icon: BookOpen,
          color: 'text-amber-500'
        },
        { 
          name: "Digital Marketing", 
          path: "/digital-marketing-with-data-analytics-course",
          icon: TrendingUp,
          color: 'text-purple-500'
        },
        { 
          name: "All Courses", 
          path: "/all-courses",
          icon: Book,
          color: 'text-blue-500'
        }
      ]
    },
    { icon: Mail, label: 'Contact', path: '/contact-us', color: 'text-cyan-500', bg: 'bg-cyan-100 dark:bg-cyan-900/20', isRelative: false },
    { icon: Briefcase, label: 'Corporate', path: '/corporate-training-courses', color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/20', isRelative: false },
    { icon: Users, label: 'Hire', path: '/hire-from-medh', color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/20', isRelative: false },
    { icon: Bell, label: 'Updates', path: '/notifications', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/20', isRelative: false },
    { icon: Crown, label: 'Membership', path: '/medh-membership', color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/20', isRelative: false },
    { icon: Newspaper, label: 'News', path: '/news-and-media', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20', isRelative: false },
    { icon: UserPlus, label: 'Educator', path: '/join-us-as-educator', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20', isRelative: false },
    { icon: School, label: 'School/\nInstitution', path: '/join-us-as-school-institute', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/20', isRelative: false },
    { icon: Briefcase, label: 'Career', path: '/careers', color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/20', isRelative: false }
  ],
  
  // Industries section with course categories
  industries: [
    { icon: Cpu, label: "AI & Data Science", path: "/ai-and-data-science-course", color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/20' },
    { icon: User, label: "Personality Development", path: "/personality-development-course", color: 'text-teal-500', bg: 'bg-teal-100 dark:bg-teal-900/20' },
    { icon: BookOpen, label: "Vedic Mathematics", path: "/vedic-mathematics-course", color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/20' },
    { icon: TrendingUp, label: "Digital Marketing", path: "/digital-marketing-with-data-analytics-course", color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/20' },
  ],
  
  // Search suggestion types and their corresponding icons
  suggestionTypes: {
    course: Book,
    blog: FileText,
    instructor: User,
    default: Book
  }
};

// Export individual interfaces for use in other components
export type { IMenuItem, ISubmenuItem, INavSection, IQuickActions, ISuggestionTypes, IMenuConfig };

export default MENU_CONFIG; 