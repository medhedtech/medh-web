"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpDown,
  Award,
  BarChart,
  BarChart2,
  Bell,
  Book,
  BookOpen,
  Briefcase,
  Building,
  Calendar,
  CalendarClock,
  CalendarDays,
  CheckCircle,
  CheckSquare,
  Clipboard,
  ClipboardList,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Filter,
  FolderOpen,
  FolderTree,
  Folders,
  Gift,
  Globe,
  GraduationCap,
  Heart,
  HelpCircle,
  History,
  Key,
  LayoutGrid,
  LineChart,
  ListChecks,
  Lock,
  LogOut,
  Mail,
  Megaphone,
  MessageCircle,
  MessageSquare,
  MonitorPlay,
  PenTool,
  Play,
  Plus,
  Repeat,
  Reply,
  School,
  Search,
  Settings,
  Share2,
  ShoppingCart,
  Star,
  Target,
  ThumbsUp,
  TrendingUp,
  Upload,
  User,
  UserCheck,
  UserCircle,
  UserCog,
  UserPlus,
  Users,
  Video,
  VideoRecorder,
  Wallet,
  Languages,
  Lightning
} from "lucide-react";
import { setCookie } from "nookies";
import { useEffect, useState } from "react";
import NavbarLogo from "@/components/layout/header/NavbarLogo";

const studentItems = [
  {
    title: "WELCOME, STUDENT",
    items: [
      {
        name: "Dashboard",
        path: "/dashboards/student-dashboard",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        ),
        subItems: [
          {
            name: "Upcoming Classes",
            path: "/dashboards/student-upcoming-classes",
            icon: <Clock className="w-4 h-4" />
          },
          {
            name: "Recent Announcements",
            path: "/dashboards/student-announcements",
            icon: <Bell className="w-4 h-4" />
          },
          {
            name: "Progress Overview",
            path: "/dashboards/student-progress-overview",
            icon: <TrendingUp className="w-4 h-4" />
          },
          {
            name: "Free Courses",
            path: "/dashboards/student-free-courses",
            icon: <Gift className="w-4 h-4" />
          }
        ]
      },
      {
        name: "My Demo Classes",
        path: "/dashboards/student-demo-classes",
        icon: <MonitorPlay className="w-5 h-5" />,
        subItems: [
          {
            name: "Demo Scheduled Details",
            path: "/dashboards/student-demo-schedule",
            icon: <CalendarDays className="w-4 h-4" />
          },
          {
            name: "Demo Attend Details",
            path: "/dashboards/student-demo-attendance",
            icon: <CheckSquare className="w-4 h-4" />
          },
          {
            name: "Demo Attend Certificate",
            path: "/dashboards/student-demo-certificate",
            icon: <Award className="w-4 h-4" />
          },
          {
            name: "Demo Feedback/Summary",
            path: "/dashboards/student-demo-feedback",
            icon: <MessageSquare className="w-4 h-4" />
          }
        ]
      },
      {
        name: "My Courses",
        icon: <Folders className="w-5 h-5" />,
        subItems: [
          {
            name: "Course Catalog",
            path: "/dashboards/student-course-catalog",
            icon: <LayoutGrid className="w-4 h-4" />
          },
          {
            name: "Enrolled Courses",
            path: "/dashboards/student-enrolled-courses",
            icon: <BookOpen className="w-4 h-4" />
          },
          {
            name: "My Wishlist",
            path: "/dashboards/student-wishlist",
            icon: <Heart className="w-4 h-4" />
          },
          {
            name: "My Free Courses",
            path: "/dashboards/student-free-courses",
            icon: <Gift className="w-4 h-4" />
          }
        ]
      },
      {
        name: "My Membership",
        icon: <UserCircle className="w-5 h-5" />,
        subItems: [
          {
            name: "Enrolled Membership",
            path: "/dashboards/student-enrolled-membership",
            icon: <CreditCard className="w-4 h-4" />
          },
          {
            name: "Upgrade/Downgrade",
            path: "/dashboards/student-membership-upgrade",
            icon: <ArrowUpDown className="w-4 h-4" />
          },
          {
            name: "Pay Subscription",
            path: "/dashboards/student-membership-payment",
            icon: <Wallet className="w-4 h-4" />
          }
        ]
      },
      {
        name: "My Live Classes",
        icon: <Video className="w-5 h-5" />,
        subItems: [
          {
            name: "Join Live Class",
            path: "/dashboards/student-join-live",
            icon: <Play className="w-4 h-4" />
          },
          {
            name: "Scheduled Classes",
            path: "/dashboards/student-scheduled-classes",
            icon: <CalendarDays className="w-4 h-4" />
          },
          {
            name: "Recorded Sessions",
            path: "/dashboards/student-recorded-sessions",
            icon: <VideoRecorder className="w-4 h-4" />
          }
        ]
      },
      {
        name: "My Progress",
        icon: <LineChart className="w-5 h-5" />,
        subItems: [
          {
            name: "Course Completion",
            path: "/dashboards/student-course-completion",
            icon: <CheckCircle className="w-4 h-4" />
          },
          {
            name: "Performance Analytics",
            path: "/dashboards/student-performance",
            icon: <BarChart className="w-4 h-4" />
          },
          {
            name: "Skill Development",
            path: "/dashboards/student-skills",
            icon: <Target className="w-4 h-4" />
          }
        ]
      },
      {
        name: "Resources",
        icon: <FolderOpen className="w-5 h-5" />,
        subItems: [
          {
            name: "Course Materials",
            path: "/dashboards/student-course-materials",
            icon: <FileText className="w-4 h-4" />
          },
          {
            name: "E-Books",
            path: "/dashboards/student-ebooks",
            icon: <Book className="w-4 h-4" />
          }
        ]
      },
      {
        name: "Assignments & Quizzes",
        icon: <ClipboardList className="w-5 h-5" />,
        subItems: [
          {
            name: "Pending Assignments",
            path: "/dashboards/student-pending-assignments",
            icon: <Clock className="w-4 h-4" />
          },
          {
            name: "Submit Assignment",
            path: "/dashboards/student-submit-assignment",
            icon: <Upload className="w-4 h-4" />
          },
          {
            name: "Take Quiz",
            path: "/dashboards/student-take-quiz",
            icon: <PenTool className="w-4 h-4" />
          },
          {
            name: "Completed Work",
            path: "/dashboards/student-completed-work",
            icon: <CheckSquare className="w-4 h-4" />
          },
          {
            name: "Grades & Feedback",
            path: "/dashboards/student-grades",
            icon: <Star className="w-4 h-4" />
          }
        ]
      },
      {
        name: "Feedback & Support",
        icon: <MessageCircle className="w-5 h-5" />,
        subItems: [
          {
            name: "Submit Feedback",
            path: "/dashboards/student-submit-feedback",
            icon: <ThumbsUp className="w-4 h-4" />
          },
          {
            name: "Raise Grievance",
            path: "/dashboards/student-grievance",
            icon: <AlertTriangle className="w-4 h-4" />
          },
          {
            name: "Contact Support",
            path: "/dashboards/student-support",
            icon: <HelpCircle className="w-4 h-4" />
          }
        ]
      },
      {
        name: "Certificates",
        path: "/dashboards/student-certificates",
        icon: <Award className="w-5 h-5" />
      },
      {
        name: "Payments",
        icon: <CreditCard className="w-5 h-5" />,
        subItems: [
          {
            name: "Payment History",
            path: "/dashboards/student-payment-history",
            icon: <History className="w-4 h-4" />
          },
          {
            name: "Download Receipts",
            path: "/dashboards/student-receipts",
            icon: <Download className="w-4 h-4" />
          },
          {
            name: "Make Payment",
            path: "/dashboards/student-make-payment",
            icon: <DollarSign className="w-4 h-4" />
          }
        ]
      },
      {
        name: "Apply for Placement",
        icon: <Briefcase className="w-5 h-5" />,
        subItems: [
          {
            name: "View Jobs",
            path: "/dashboards/student-view-jobs",
            icon: <Search className="w-4 h-4" />
          },
          {
            name: "My Applications",
            path: "/dashboards/student-job-applications",
            icon: <FileText className="w-4 h-4" />
          }
        ]
      },
      {
        name: "Logout",
        onClick: handleLogout,
        icon: <LogOut className="w-5 h-5" />
      }
    ].filter(Boolean)
  }
];

const adminItems = [
  {
    title: "WELCOME, ADMIN",
    items: [
      {
        name: "Dashboard",
        path: "/dashboards/admin-dashboard",
        icon: <LayoutGrid className="w-5 h-5" />,
        subItems: [
          {
            name: "Overview",
            path: "/dashboards/admin-dashboard",
            icon: <BarChart2 className="w-4 h-4" />
          },
          {
            name: "Quick Access",
            path: "/dashboards/admin-quick-access",
            icon: <Lightning className="w-4 h-4" />
          }
        ]
      },
      {
        name: "General Masters",
        icon: <Settings className="w-5 h-5" />,
        subItems: [
          {
            name: "Country/Geography",
            path: "/dashboards/admin-geography",
            icon: <Globe className="w-4 h-4" />
          },
          {
            name: "Currency Master",
            path: "/dashboards/admin-currency",
            icon: <Currency className="w-4 h-4" />
          },
          {
            name: "Certificate Type",
            path: "/dashboards/admin-certificate-types",
            icon: <Award className="w-4 h-4" />
          },
          {
            name: "Time Zone",
            path: "/dashboards/admin-timezone",
            icon: <TimeZone className="w-4 h-4" />
          },
          {
            name: "Language",
            path: "/dashboards/admin-language",
            icon: <Languages className="w-4 h-4" />
          },
          {
            name: "Age Group",
            path: "/dashboards/admin-age-group",
            icon: <AgeGroup className="w-4 h-4" />
          },
          {
            name: "Duration",
            path: "/dashboards/admin-duration",
            icon: <Calendar className="w-4 h-4" />
          },
          {
            name: "Grade Group",
            path: "/dashboards/admin-grade-group",
            icon: <GraduationCap className="w-4 h-4" />
          },
          {
            name: "Batch",
            path: "/dashboards/admin-batch",
            icon: <Users className="w-4 h-4" />
          },
          {
            name: "Status",
            path: "/dashboards/admin-status",
            icon: <ListChecks className="w-4 h-4" />
          }
        ]
      },
      {
        name: "Education",
        icon: <Education className="w-5 h-5" />,
        subItems: [
          {
            name: "Education Level",
            path: "/dashboards/admin-education-level",
            icon: <BarChart className="w-4 h-4" />
          },
          {
            name: "Education Type",
            path: "/dashboards/admin-education-type",
            icon: <BookOpen className="w-4 h-4" />
          },
          {
            name: "Education Title",
            path: "/dashboards/admin-education-title",
            icon: <FileText className="w-4 h-4" />
          }
        ]
      },
      {
        name: "Filtration Criteria",
        icon: <Filter className="w-5 h-5" />,
        subItems: [
          {
            name: "Age Wise",
            path: "/dashboards/admin-filter-age",
            icon: <Users className="w-4 h-4" />
          },
          {
            name: "Duration Wise",
            path: "/dashboards/admin-filter-duration",
            icon: <Clock className="w-4 h-4" />
          },
          {
            name: "Grade Wise",
            path: "/dashboards/admin-filter-grade",
            icon: <GraduationCap className="w-4 h-4" />
          }
        ]
      },
      {
        name: "Course Management",
        icon: <FolderTree className="w-5 h-5" />,
        subItems: [
          {
            name: "Course Categories",
            path: "/dashboards/admin-course-categories",
            icon: <FolderOpen className="w-4 h-4" />
          },
          {
            name: "Create New Course",
            path: "/dashboards/admin-create-course",
            icon: <FileText className="w-4 h-4" />
          },
          {
            name: "Manage Courses",
            path: "/dashboards/admin-manage-courses",
            icon: <Settings className="w-4 h-4" />
          }
        ]
      },
      {
        name: "Student Management",
        icon: <Users className="w-5 h-5" />,
        subItems: [
          {
            name: "View Students",
            path: "/dashboards/admin-view-students",
            icon: <Users className="w-4 h-4" />
          },
          {
            name: "Add New Student",
            path: "/dashboards/admin-add-student",
            icon: <UserPlus className="w-4 h-4" />
          },
          {
            name: "Manage Students",
            path: "/dashboards/admin-manage-students",
            icon: <Settings className="w-4 h-4" />
          }
        ]
      },
      {
        name: "Instructor Management",
        icon: <School className="w-5 h-5" />,
        subItems: [
          {
            name: "View Instructors",
            path: "/dashboards/admin-view-instructors",
            icon: <Users className="w-4 h-4" />
          },
          {
            name: "Add Instructor",
            path: "/dashboards/admin-add-instructor",
            icon: <UserPlus className="w-4 h-4" />
          },
          {
            name: "Manage Instructors",
            path: "/dashboards/admin-manage-instructors",
            icon: <Settings className="w-4 h-4" />
          }
        ]
      },
      {
        name: "Timetable Management",
        icon: <CalendarClock className="w-5 h-5" />,
        subItems: [
          {
            name: "Create Timetable",
            path: "/dashboards/admin-create-timetable",
            icon: <Calendar className="w-4 h-4" />
          },
          {
            name: "Assign Instructor",
            path: "/dashboards/admin-assign-instructor",
            icon: <UserPlus className="w-4 h-4" />
          },
          {
            name: "Manage Classes",
            path: "/dashboards/admin-manage-classes",
            icon: <Settings className="w-4 h-4" />
          }
        ]
      },
      {
        name: "Logout",
        onClick: handleLogout,
        icon: <LogOut className="w-5 h-5" />
      }
    ].filter(Boolean)
  },
  {
    name: "Certificate Management",
    icon: <Certificate className="w-5 h-5" />,
    subItems: [
      {
        name: "Upload Designs",
        path: "/dashboards/admin-certificate-designs",
        icon: <Upload className="w-4 h-4" />
      },
      {
        name: "Issue Certificate",
        path: "/dashboards/admin-issue-certificate",
        icon: <Award className="w-4 h-4" />
      }
    ]
  },
  {
    name: "User Management",
    icon: <UserCog className="w-5 h-5" />,
    subItems: [
      {
        name: "Create Users",
        path: "/dashboards/admin-create-users",
        icon: <UserPlus className="w-4 h-4" />
      },
      {
        name: "Manage Access",
        path: "/dashboards/admin-manage-access",
        icon: <Lock className="w-4 h-4" />
      },
      {
        name: "View Users",
        path: "/dashboards/admin-view-users",
        icon: <Users className="w-4 h-4" />
      }
    ]
  },
  {
    name: "Membership Management",
    icon: <Users className="w-5 h-5" />,
    subItems: [
      {
        name: "Create Membership",
        path: "/dashboards/admin-create-membership",
        icon: <Plus className="w-4 h-4" />
      },
      {
        name: "Order Management",
        path: "/dashboards/admin-order-management",
        icon: <ShoppingCart className="w-4 h-4" />
      },
      {
        name: "Enrolled Members",
        path: "/dashboards/admin-enrolled-members",
        icon: <Users className="w-4 h-4" />
      },
      {
        name: "Subscriptions",
        path: "/dashboards/admin-subscriptions",
        icon: <Repeat className="w-4 h-4" />
      }
    ]
  },
  {
    name: "Attendance Management",
    icon: <FileCheck className="w-5 h-5" />,
    subItems: [
      {
        name: "View Reports",
        path: "/dashboards/admin-attendance-reports",
        icon: <FileText className="w-4 h-4" />
      },
      {
        name: "Mark Attendance",
        path: "/dashboards/admin-mark-attendance",
        icon: <CheckSquare className="w-4 h-4" />
      }
    ]
  },
  {
    name: "Fees Management",
    icon: <DollarSign className="w-5 h-5" />,
    subItems: [
      {
        name: "Payment Status",
        path: "/dashboards/admin-payment-status",
        icon: <AlertCircle className="w-4 h-4" />
      },
      {
        name: "Send Reminders",
        path: "/dashboards/admin-payment-reminders",
        icon: <Bell className="w-4 h-4" />
      },
      {
        name: "Generate Invoices",
        path: "/dashboards/admin-generate-invoices",
        icon: <FileText className="w-4 h-4" />
      }
    ]
  },
  {
    name: "Marketing/Notice Board",
    icon: <Megaphone className="w-5 h-5" />,
    subItems: [
      {
        name: "Recommendations",
        path: "/dashboards/admin-recommendations",
        icon: <ThumbsUp className="w-4 h-4" />
      },
      {
        name: "Send Notifications",
        path: "/dashboards/admin-send-notifications",
        icon: <Bell className="w-4 h-4" />
      },
      {
        name: "Notice Board",
        path: "/dashboards/admin-notice-board",
        icon: <Clipboard className="w-4 h-4" />
      }
    ]
  },
  {
    name: "Resources Management",
    icon: <FolderOpen className="w-5 h-5" />,
    subItems: [
      {
        name: "Organize Resources",
        path: "/dashboards/admin-organize-resources",
        icon: <FolderTree className="w-4 h-4" />
      },
      {
        name: "Upload Materials",
        path: "/dashboards/admin-upload-materials",
        icon: <Upload className="w-4 h-4" />
      },
      {
        name: "Manage Access",
        path: "/dashboards/admin-resource-access",
        icon: <Lock className="w-4 h-4" />
      }
    ]
  },
  {
    name: "Feedback & Grievances",
    icon: <MessageCircle className="w-5 h-5" />,
    subItems: [
      {
        name: "View Feedback",
        path: "/dashboards/admin-view-feedback",
        icon: <MessageSquare className="w-4 h-4" />
      },
      {
        name: "Respond",
        path: "/dashboards/admin-respond-feedback",
        icon: <Reply className="w-4 h-4" />
      },
      {
        name: "Reports",
        path: "/dashboards/admin-feedback-reports",
        icon: <FileText className="w-4 h-4" />
      }
    ]
  },
  {
    name: "Corporate Management",
    icon: <Building className="w-5 h-5" />,
    subItems: [
      {
        name: "Manage Accounts",
        path: "/dashboards/admin-corporate-accounts",
        icon: <Users className="w-4 h-4" />
      },
      {
        name: "Manage Students",
        path: "/dashboards/admin-corporate-students",
        icon: <UserPlus className="w-4 h-4" />
      },
      {
        name: "Track Progress",
        path: "/dashboards/admin-corporate-progress",
        icon: <TrendingUp className="w-4 h-4" />
      }
    ]
  },
  {
    name: "School/Institute Management",
    icon: <School2 className="w-5 h-5" />,
    subItems: [
      {
        name: "Manage Accounts",
        path: "/dashboards/admin-school-accounts",
        icon: <Users className="w-4 h-4" />
      },
      {
        name: "Manage Students",
        path: "/dashboards/admin-school-students",
        icon: <UserPlus className="w-4 h-4" />
      },
      {
        name: "Track Progress",
        path: "/dashboards/admin-school-progress",
        icon: <TrendingUp className="w-4 h-4" />
      }
    ]
  },
  {
    name: "Join Medh (Career@Medh)",
    icon: <Career className="w-5 h-5" />,
    subItems: [
      {
        name: "Post Jobs",
        path: "/dashboards/admin-post-jobs",
        icon: <Plus className="w-4 h-4" />
      },
      {
        name: "Review Applications",
        path: "/dashboards/admin-review-applications",
        icon: <FileText className="w-4 h-4" />
      },
      {
        name: "Manage Hiring",
        path: "/dashboards/admin-manage-hiring",
        icon: <UserCheck className="w-4 h-4" />
      }
    ]
  },
  {
    name: "Query Forms Management",
    icon: <Query className="w-5 h-5" />,
    subItems: [
      {
        name: "Contact Forms",
        path: "/dashboards/admin-contact-forms",
        icon: <Mail className="w-4 h-4" />
      },
      {
        name: "Brochure Requests",
        path: "/dashboards/admin-brochure-requests",
        icon: <Download className="w-4 h-4" />
      },
      {
        name: "Demo Requests",
        path: "/dashboards/admin-demo-requests",
        icon: <Play className="w-4 h-4" />
      },
      {
        name: "Corporate Enquiries",
        path: "/dashboards/admin-corporate-enquiries",
        icon: <Building className="w-4 h-4" />
      },
      {
        name: "Course Enquiries",
        path: "/dashboards/admin-course-enquiries",
        icon: <HelpCircle className="w-4 h-4" />
      }
    ]
  },
  {
    name: "Blogs Management",
    icon: <Blog className="w-5 h-5" />,
    subItems: [
      {
        name: "Blog Categories",
        path: "/dashboards/admin-blog-categories",
        icon: <FolderTree className="w-4 h-4" />
      },
      {
        name: "Add Blog",
        path: "/dashboards/admin-add-blog",
        icon: <Plus className="w-4 h-4" />
      },
      {
        name: "Manage Blogs",
        path: "/dashboards/admin-manage-blogs",
        icon: <Settings className="w-4 h-4" />
      }
    ]
  },
  {
    name: "Reports & Analytics",
    icon: <BarChart2 className="w-5 h-5" />,
    subItems: [
      {
        name: "System Reports",
        path: "/dashboards/admin-system-reports",
        icon: <FileSpreadsheetIcon className="w-4 h-4" />
      },
      {
        name: "User Engagement",
        path: "/dashboards/admin-user-engagement",
        icon: <Users className="w-4 h-4" />
      },
      {
        name: "Growth Metrics",
        path: "/dashboards/admin-growth-metrics",
        icon: <TrendingUp className="w-4 h-4" />
      }
    ]
  },
  {
    name: "Settings",
    icon: <Settings className="w-5 h-5" />,
    subItems: [
      {
        name: "My Profile",
        path: "/dashboards/admin-profile",
        icon: <UserIcon className="w-4 h-4" />
      },
      {
        name: "Change Password",
        path: "/dashboards/admin-change-password",
        icon: <Key className="w-4 h-4" />
      },
      {
        name: "Add Social Icon",
        path: "/dashboards/admin-social-icons",
        icon: <Share2 className="w-4 h-4" />
      }
    ]
  },
  {
    name: "Logout",
    onClick: handleLogout,
    icon: <LogOut className="w-5 h-5" />
  }
];

const instructorItems = [
  {
    title: "WELCOME, INSTRUCTOR",
    items: [
      {
        name: "Dashboard",
        path: "/dashboards/instructor-dashboard",
        icon: <LayoutGrid className="w-5 h-5" />,
        subItems: [
          {
            name: "Upcoming Classes",
            path: "/dashboards/instructor-upcoming-classes",
            icon: <Calendar className="w-4 h-4" />
          },
          {
            name: "Recent Submissions",
            path: "/dashboards/instructor-recent-submissions",
            icon: <FileText className="w-4 h-4" />
          }
        ]
      },
      {
        name: "My Demo Classes",
        icon: <MonitorPlay className="w-5 h-5" />,
        subItems: [
          {
            name: "Assigned Classes",
            path: "/dashboards/instructor-assigned-demos",
            icon: <Calendar className="w-4 h-4" />
          },
          {
            name: "Accept/Reject",
            path: "/dashboards/instructor-demo-requests",
            icon: <CheckSquare className="w-4 h-4" />
          },
          {
            name: "View Presentations",
            path: "/dashboards/instructor-demo-presentations",
            icon: <FileText className="w-4 h-4" />
          },
          {
            name: "Join Live Demo",
            path: "/dashboards/instructor-join-demo",
            icon: <Play className="w-4 h-4" />
          },
          {
            name: "Submit Feedback",
            path: "/dashboards/instructor-demo-feedback",
            icon: <MessageSquare className="w-4 h-4" />
          }
        ]
      },
      {
        name: "My Main Classes",
        icon: <Video className="w-5 h-5" />,
        subItems: [
          {
            name: "Assigned Courses",
            path: "/dashboards/instructor-assigned-courses",
            icon: <BookOpen className="w-4 h-4" />
          },
          {
            name: "Class Schedule",
            path: "/dashboards/instructor-schedule",
            icon: <Calendar className="w-4 h-4" />
          },
          {
            name: "Presentations",
            path: "/dashboards/instructor-presentations",
            icon: <FileText className="w-4 h-4" />
          },
          {
            name: "Join Live Class",
            path: "/dashboards/instructor-join-class",
            icon: <Play className="w-4 h-4" />
          }
        ]
      },
      {
        name: "Student Management",
        icon: <Users className="w-5 h-5" />,
        subItems: [
          {
            name: "Student Lists",
            path: "/dashboards/instructor-student-lists",
            icon: <Users className="w-4 h-4" />
          },
          {
            name: "Track Progress",
            path: "/dashboards/instructor-track-progress",
            icon: <TrendingUp className="w-4 h-4" />
          },
          {
            name: "Communication",
            path: "/dashboards/instructor-communication",
            icon: <MessageCircle className="w-4 h-4" />
          }
        ]
      },
      {
        name: "Assessments",
        icon: <ClipboardList className="w-5 h-5" />,
        subItems: [
          {
            name: "Create Quiz",
            path: "/dashboards/instructor-create-quiz",
            icon: <Plus className="w-4 h-4" />
          },
          {
            name: "Grade Work",
            path: "/dashboards/instructor-grade-work",
            icon: <CheckSquare className="w-4 h-4" />
          },
          {
            name: "Provide Feedback",
            path: "/dashboards/instructor-feedback",
            icon: <MessageSquare className="w-4 h-4" />
          },
          {
            name: "Performance Reports",
            path: "/dashboards/instructor-performance",
            icon: <BarChart className="w-4 h-4" />
          }
        ]
      },
      {
        name: "Attendance",
        icon: <CheckSquare className="w-5 h-5" />,
        subItems: [
          {
            name: "Mark Attendance",
            path: "/dashboards/instructor-mark-attendance",
            icon: <CheckSquare className="w-4 h-4" />
          },
          {
            name: "View Reports",
            path: "/dashboards/instructor-attendance-reports",
            icon: <FileText className="w-4 h-4" />
          }
        ]
      },
      {
        name: "My Revenue",
        icon: <DollarSign className="w-5 h-5" />,
        subItems: [
          {
            name: "Receivables",
            path: "/dashboards/instructor-receivables",
            icon: <CreditCard className="w-4 h-4" />
          },
          {
            name: "Demo Classes",
            path: "/dashboards/instructor-demo-revenue",
            icon: <MonitorPlay className="w-4 h-4" />
          },
          {
            name: "Live Classes",
            path: "/dashboards/instructor-live-revenue",
            icon: <Video className="w-4 h-4" />
          }
        ]
      },
      {
        name: "Reports",
        icon: <FileText className="w-5 h-5" />,
        subItems: [
          {
            name: "Class Performance",
            path: "/dashboards/instructor-class-performance",
            icon: <BarChart className="w-4 h-4" />
          },
          {
            name: "Student Engagement",
            path: "/dashboards/instructor-student-engagement",
            icon: <Users className="w-4 h-4" />
          },
          {
            name: "Learning Outcomes",
            path: "/dashboards/instructor-learning-outcomes",
            icon: <Target className="w-4 h-4" />
          }
        ]
      },
      {
        name: "Settings",
        icon: <Settings className="w-5 h-5" />,
        subItems: [
          {
            name: "My Profile",
            path: "/dashboards/instructor-profile",
            icon: <User className="w-4 h-4" />
          },
          {
            name: "Add Social Icon",
            path: "/dashboards/instructor-social",
            icon: <Share2 className="w-4 h-4" />
          },
          {
            name: "Change Password",
            path: "/dashboards/instructor-password",
            icon: <Key className="w-4 h-4" />
          }
        ]
      },
      {
        name: "Logout",
        onClick: handleLogout,
        icon: <LogOut className="w-5 h-5" />
      }
    ].filter(Boolean)
  }
];

const parentItems = [
  {
    title: "WELCOME, PARENT",
    items: [
      {
        name: "Dashboard",
        path: "/dashboards/parent-dashboard",
        icon: <LayoutGrid className="w-5 h-5" />,
        subItems: [
          {
            name: "Upcoming Classes",
            path: "/dashboards/parent-upcoming-classes",
            icon: <Calendar className="w-4 h-4" />
          },
          {
            name: "Performance Updates",
            path: "/dashboards/parent-performance",
            icon: <TrendingUp className="w-4 h-4" />
          }
        ]
      },
      {
        name: "Class Schedule",
        icon: <Calendar className="w-5 h-5" />,
        subItems: [
          {
            name: "View Timetable",
            path: "/dashboards/parent-timetable",
            icon: <Calendar className="w-4 h-4" />
          },
          {
            name: "View Attendance",
            path: "/dashboards/parent-attendance",
            icon: <CheckSquare className="w-4 h-4" />
          },
          {
            name: "Upcoming Classes",
            path: "/dashboards/parent-upcoming",
            icon: <Clock className="w-4 h-4" />
          },
          {
            name: "Recorded Sessions",
            path: "/dashboards/parent-recordings",
            icon: <Video className="w-4 h-4" />
          },
          {
            name: "Track Performance",
            path: "/dashboards/parent-track",
            icon: <TrendingUp className="w-4 h-4" />
          }
        ]
      },
      {
        name: "Assignments & Grades",
        icon: <ClipboardList className="w-5 h-5" />,
        subItems: [
          {
            name: "Pending Work",
            path: "/dashboards/parent-pending-work",
            icon: <Clock className="w-4 h-4" />
          },
          {
            name: "View Grades",
            path: "/dashboards/parent-grades",
            icon: <Star className="w-4 h-4" />
          }
        ]
      },
      {
        name: "Communication",
        icon: <MessageCircle className="w-5 h-5" />,
        subItems: [
          {
            name: "Message Instructors",
            path: "/dashboards/parent-message",
            icon: <MessageSquare className="w-4 h-4" />
          },
          {
            name: "Announcements",
            path: "/dashboards/parent-announcements",
            icon: <Bell className="w-4 h-4" />
          },
          {
            name: "Schedule Meeting",
            path: "/dashboards/parent-schedule-meeting",
            icon: <Calendar className="w-4 h-4" />
          }
        ]
      },
      {
        name: "Payments",
        icon: <CreditCard className="w-5 h-5" />,
        subItems: [
          {
            name: "Fee Structure",
            path: "/dashboards/parent-fee-structure",
            icon: <FileText className="w-4 h-4" />
          },
          {
            name: "Make Payment",
            path: "/dashboards/parent-make-payment",
            icon: <CreditCard className="w-4 h-4" />
          },
          {
            name: "Download Receipts",
            path: "/dashboards/parent-receipts",
            icon: <Download className="w-4 h-4" />
          }
        ]
      },
      {
        name: "Feedback & Concerns",
        icon: <MessageCircle className="w-5 h-5" />,
        subItems: [
          {
            name: "Submit Feedback",
            path: "/dashboards/parent-submit-feedback",
            icon: <MessageSquare className="w-4 h-4" />
          },
          {
            name: "Raise Concern",
            path: "/dashboards/parent-raise-concern",
            icon: <AlertTriangle className="w-4 h-4" />
          },
          {
            name: "Track Status",
            path: "/dashboards/parent-track-status",
            icon: <Clock className="w-4 h-4" />
          }
        ]
      },
      {
        name: "Settings",
        icon: <Settings className="w-5 h-5" />,
        subItems: [
          {
            name: "My Profile",
            path: "/dashboards/parent-profile",
            icon: <User className="w-4 h-4" />
          },
          {
            name: "Add Social Icon",
            path: "/dashboards/parent-social",
            icon: <Share2 className="w-4 h-4" />
          },
          {
            name: "Change Password",
            path: "/dashboards/parent-password",
            icon: <Key className="w-4 h-4" />
          }
        ]
      },
      {
        name: "Logout",
        onClick: handleLogout,
        icon: <LogOut className="w-5 h-5" />
      }
    ].filter(Boolean)
  }
];

// Update the role selection logic
var items = studentItems;
if (isAdmin) {
  items = adminItems;
} else if (isInstructor) {
  items = instructorItems;
} else if (isCorporate) {
  items = corporateItems;
} else if (isCorporateEmp) {
  items = corporateEmpItems;
} else if (role === "parent") {
  items = parentItems;
} else {
  items = studentItems;
} 

export default SidebarDashboard;