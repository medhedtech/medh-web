"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { buildAdvancedComponent, getResponsive, typography, buildComponent } from "@/utils/designSystem";
import { logoutUser } from "@/utils/auth";
import {
  BookOpen,
  Users,
  Calendar,
  BarChart3,
  Settings,
  MessageSquare,
  ClipboardCheck,
  GraduationCap,
  Video,
  FileText,
  DollarSign,
  Bell,
  Search,
  Menu,
  X,
  Home,
  ChevronDown,
  LogOut,
  User,
  HelpCircle,
} from "lucide-react";

interface InstructorLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  actions?: React.ReactNode;
}

const navigationItems = [
  {
    title: "Overview",
    href: "/dashboards/instructor",
    icon: Home,
    description: "Dashboard overview"
  },
  {
    title: "Courses & Classes",
    icon: BookOpen,
    items: [
      { title: "Assigned Courses", href: "/dashboards/instructor/assigned-courses", description: "View assigned batches" },
      { title: "Class Schedules", href: "/dashboards/instructor/class-schedules", description: "Manage schedules" },
      { title: "Live Classes", href: "/dashboards/instructor/live-classes", description: "Join live sessions" },
      { title: "Lesson Plans", href: "/dashboards/instructor/lesson-plans", description: "Create lesson plans" },
    ]
  },
  {
    title: "Demo Classes",
    icon: Video,
    items: [
      { title: "Demo Requests", href: "/dashboards/instructor/demo-requests", description: "Accept/reject requests" },
      { title: "Demo Classes", href: "/dashboards/instructor/demo-classes", description: "Assigned demos" },
      { title: "Demo Presentations", href: "/dashboards/instructor/demo-presentations", description: "Present demos" },
      { title: "Demo Recordings", href: "/dashboards/instructor/demo-recordings", description: "View recordings" },
    ]
  },
  {
    title: "Students",
    icon: Users,
    items: [
      { title: "Student Lists", href: "/dashboards/instructor/student-lists", description: "View all students" },
      { title: "Student Progress", href: "/dashboards/instructor/student-progress", description: "Track progress" },
      { title: "Communication", href: "/dashboards/instructor/student-communication", description: "Message students" },
      { title: "Attendance", href: "/dashboards/instructor/mark-attendance", description: "Mark attendance" },
    ]
  },
  {
    title: "Assignments",
    icon: ClipboardCheck,
    items: [
      { title: "Create Assessments", href: "/dashboards/instructor/create-assessments", description: "Create assignments" },
      { title: "Submitted Work", href: "/dashboards/instructor/submitted-work", description: "View submissions" },
      { title: "Assessment Feedback", href: "/dashboards/instructor/assessment-feedback", description: "Provide feedback" },
      { title: "Grading", href: "/dashboards/instructor/grading", description: "Grade assignments" },
    ]
  },
  {
    title: "Analytics",
    icon: BarChart3,
    items: [
      { title: "Performance Reports", href: "/dashboards/instructor/performance-reports", description: "View performance" },
      { title: "Attendance Reports", href: "/dashboards/instructor/attendance-reports", description: "Attendance analytics" },
      { title: "Class Reports", href: "/dashboards/instructor/class-reports", description: "Class performance" },
      { title: "Engagement Reports", href: "/dashboards/instructor/engagement-reports", description: "Student engagement" },
      { title: "Learning Outcomes", href: "/dashboards/instructor/learning-outcomes", description: "Learning analytics" },
    ]
  },
  {
    title: "Revenue",
    icon: DollarSign,
    items: [
      { title: "Demo Revenue", href: "/dashboards/instructor/demo-revenue", description: "Demo earnings" },
      { title: "Live Revenue", href: "/dashboards/instructor/live-revenue", description: "Live class earnings" },
      { title: "Receivables", href: "/dashboards/instructor/receivables", description: "Payment history" },
    ]
  },
];

const InstructorLayout: React.FC<InstructorLayoutProps> = ({
  children,
  title,
  subtitle,
  showSearch = true,
  actions
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [profile, setProfile] = useState({
    name: "John Instructor",
    email: "john@medh.com",
    avatar: "/avatars/instructor-placeholder.png",
    notifications: 3
  });
  
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Load instructor profile
    const loadProfile = () => {
      const storedName = localStorage.getItem("userName") || localStorage.getItem("fullName") || "Instructor";
      const storedEmail = localStorage.getItem("userEmail") || "instructor@medh.com";
      
      setProfile(prev => ({
        ...prev,
        name: storedName,
        email: storedEmail
      }));
    };

    loadProfile();
  }, []);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActiveRoute = (href: string) => {
    return pathname === href;
  };

  const isActiveSection = (items: any[]) => {
    return items?.some(item => pathname === item.href);
  };

  const handleLogout = async () => {
    try {
      // Call the backend logout API to set quick login expiration
      await logoutUser(true); // Keep remember me settings
      
      // Redirect to login
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      // If API call fails, still clear local data and redirect
      try {
        localStorage.clear();
      } catch (localError) {
        console.error("Error during local logout cleanup:", localError);
      }
      
      // Redirect to login
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-full flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
          {/* Sidebar Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
            <Link href="/dashboards/instructor" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-slate-900 dark:text-white">Instructor</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-3">
              {navigationItems.map((item) => (
                <div key={item.title}>
                  {item.items ? (
                    <div>
                      <Button
                        variant="ghost"
                        className={`w-full justify-between ${
                          isActiveSection(item.items) 
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                            : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                        }`}
                        onClick={() => toggleExpanded(item.title)}
                      >
                        <div className="flex items-center">
                          <item.icon className="mr-3 h-5 w-5" />
                          {item.title}
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform ${
                          expandedItems.includes(item.title) ? 'rotate-180' : ''
                        }`} />
                      </Button>
                      {expandedItems.includes(item.title) && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.items.map((subItem) => (
                            <Link key={subItem.href} href={subItem.href}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`w-full justify-start ${
                                  isActiveRoute(subItem.href)
                                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                }`}
                              >
                                {subItem.title}
                              </Button>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link href={item.href}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${
                          isActiveRoute(item.href)
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                        }`}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.title}
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {profile.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {profile.email}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Link href="/dashboards/instructor/profile" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              {title && (
                <div>
                  <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {subtitle}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {showSearch && (
                <div className="hidden md:flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search..."
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              )}
              
              {actions}
              
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {profile.notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {profile.notifications}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default InstructorLayout; 