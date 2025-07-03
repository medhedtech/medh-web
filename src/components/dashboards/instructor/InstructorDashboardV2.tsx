"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { instructorApi, InstructorDashboardData, InstructorProfile, InstructorStatistics, QuickAction, UpcomingClass, RecentSubmission } from "@/apis/instructor.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { buildAdvancedComponent, getResponsive, typography, buildComponent } from "@/utils/designSystem";
import {
  AlertCircle,
  BookOpen,
  Users,
  Award,
  Star,
  Briefcase,
  Mail,
  Phone,
  Search,
  Bell,
  CalendarDays,
  CheckCircle,
  MessageSquare,
  DollarSign,
  TrendingUp,
  GraduationCap,
  ClipboardCheck,
  UserCheck,
  Zap,
  Clock,
  MessageSquareText,
  DollarSignIcon,
  Activity,
  UserRoundCheck,
  UserRoundX
} from "lucide-react";
import { showToast } from "@/utils/toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const InstructorDashboardV2 = () => {
  const [dashboardData, setDashboardData] = useState<InstructorDashboardData | null>(null);
  const [profile, setProfile] = useState<InstructorProfile | null>(null);
  const [statistics, setStatistics] = useState<InstructorStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await instructorApi.getDashboardData();
      const profileData = await instructorApi.getInstructorProfile();
      setDashboardData(data);
      setProfile(profileData.profile);
      setStatistics(profileData.statistics);
    } catch (err) {
      console.error("Failed to fetch real data, using mock data:", err);
      // Fallback to mock data
      const mockProfile: InstructorProfile = {
        _id: "mock_instructor_id",
        full_name: "Mock Instructor",
        email: "mock.instructor@example.com",
        phone_number: "123-456-7890",
        profile_picture: "/avatar-placeholder.png",
        domain: "Software Engineering",
        status: "active",
      };

      const mockStatistics: InstructorStatistics = {
        totalBatches: 5,
        totalStudents: 120,
        totalDemos: 15,
        averageRating: 4.8,
        experience: "5 years",
      };

      const mockDashboardData: InstructorDashboardData = {
        overview: {
          activeBatches: 3,
          totalStudents: 85,
          pendingDemos: 2,
          completedAssignments: 45,
          pendingAssignments: 3,
        },
        upcomingClasses: [
          { batchName: "React Mastery", courseTitle: "Advanced Hooks", date: "Jul 4, 2025", time: "10:00 AM", studentCount: 25, type: "live_class" },
          { batchName: "Node.js Basics", courseTitle: "API Design", date: "Jul 5, 2025", time: "02:00 PM", studentCount: 18, type: "workshop" },
          { batchName: "Demo Session", courseTitle: "Intro to Web Dev", date: "Jul 6, 2025", time: "04:00 PM", studentCount: 1, type: "demo" },
        ],
        recentSubmissions: [
          { assignmentTitle: "Redux Saga Project", courseName: "React Mastery", studentName: "Alice Smith", studentEmail: "alice@example.com", submittedAt: "2025-07-02T14:30:00Z", status: "submitted", grade: null },
          { assignmentTitle: "Database Normalization", courseName: "Database Fundamentals", studentName: "Bob Johnson", studentEmail: "bob@example.com", submittedAt: "2025-07-01T10:00:00Z", status: "graded", grade: 92 },
        ],
        monthlyStats: {
          demosCompleted: 5,
          assignmentsCreated: 10,
          newStudents: 8,
          month: "July",
        },
        quickActions: [
          { action: "announcement", label: "New Announcement", count: 0 },
          { action: "schedule", label: "Schedule Class", count: 0 },
          { action: "upload", label: "Upload Content", count: 0 },
        ],
      };
      setDashboardData(mockDashboardData);
      setProfile(mockProfile);
      setStatistics(mockStatistics);
      setError("Failed to load real data. Displaying mock data.");
      showToast.warning("Failed to load real data. Displaying mock data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <Skeleton className="h-48 w-full mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (error && !dashboardData) { // Only show error if no data (even mock) is available
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!dashboardData || !profile) {
    // This case should ideally not be reached with mock data fallback, but good for robustness
    return (
      <div className="text-center py-16">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Dashboard Data Not Found</h3>
          <p className="mt-1 text-sm text-gray-500">Could not load instructor dashboard information.</p>
      </div>
    );
  }

  // AI-Suggested Focus (mock logic for now)
  const suggestedFocus = () => {
    if (dashboardData.overview.pendingAssignments > 0) {
      return `Grade the ${dashboardData.overview.pendingAssignments} pending assignments.`;
    }
    if (dashboardData.overview.pendingDemos > 0) {
      return `Review the ${dashboardData.overview.pendingDemos} demo requests.`;
    }
    if (dashboardData.upcomingClasses.length > 0) {
      const nextClass = dashboardData.upcomingClasses[0];
      return `Prepare for your upcoming ${nextClass.type} on ${nextClass.date} at ${nextClass.time}.`;
    }
    return "You're all caught up! Consider exploring new lesson plans.";
  };

  // Prioritized "Needs Attention" (mock logic for now)
  const getNeedsAttention = (): QuickAction[] => {
    const attentionItems: QuickAction[] = [];
    if (dashboardData.overview.pendingDemos > 0) {
      attentionItems.push({ action: 'demo-requests', label: `Review ${dashboardData.overview.pendingDemos} Demo Requests`, count: dashboardData.overview.pendingDemos });
    }
    if (dashboardData.overview.pendingAssignments > 0) {
      attentionItems.push({ action: 'submitted-work', label: `Grade ${dashboardData.overview.pendingAssignments} Pending Assignments`, count: dashboardData.overview.pendingAssignments });
    }
    // Assuming messages/announcements would have a count in dashboardData or profile
    // For now, using a mock count for messages, or based on actual data if available
    const unreadMessages = 2; // Example mock: replace with actual data if API provides
    if (unreadMessages > 0) {
        attentionItems.push({ action: 'message', label: `Reply to ${unreadMessages} Unread Messages`, count: unreadMessages });
    }
    return attentionItems;
  };

  const needsAttention = getNeedsAttention();

  return (
    <motion.div
      className="p-4 md:p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header: Welcome & AI-Suggested Focus */}
      <motion.div variants={itemVariants} className={buildAdvancedComponent.glassCard({ variant: 'hero', padding: 'desktop' }) + " text-center"}>
        <h1 className={typography.h1 + " mb-2"}>Welcome back, {profile.full_name.split(' ')[0]}!</h1>
        <p className={typography.lead}>
          Your suggested focus for today: <span className="font-semibold text-blue-600 dark:text-blue-400">{suggestedFocus()}</span>
        </p>
      </motion.div>

      {/* Top Row: Command & Control */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Command K Bar */}
        <Card className={buildComponent.card('elegant', 'desktop') + " md:col-span-2"}>
          <CardContent className="flex items-center space-x-3 p-4 md:p-6">
            <Search className="h-5 w-5 text-gray-500 flex-shrink-0" />
            <Input
              placeholder="Search for students, courses, or actions (Cmd+K)..."
              className="flex-grow border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-2"
            />
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 flex-shrink-0">
              <span className="text-xs">⌘</span>K
            </kbd>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className={buildComponent.card('elegant', 'desktop')}>
          <CardHeader className="pb-3">
            <CardTitle className={typography.h3}>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <Button className={buildComponent.button('primary', 'sm')}>New Announcement</Button>
            <Button className={buildComponent.button('secondary', 'sm')}>Schedule Class</Button>
            <Button className={buildComponent.button('secondary', 'sm')}>Upload Content</Button>
            <Button className={buildComponent.button('minimal', 'sm')}>View All Actions</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Middle Row: Actionable Insights */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prioritized "Needs Attention" */}
        <Card className={buildComponent.card('premium', 'desktop')}>
          <CardHeader className="pb-3">
            <CardTitle className={typography.h3}>Needs Attention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {needsAttention.length > 0 ? (
              needsAttention.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    {item.action === 'demo-requests' && <Users className="h-5 w-5 text-blue-500 flex-shrink-0" />}
                    {item.action === 'submitted-work' && <ClipboardCheck className="h-5 w-5 text-emerald-500 flex-shrink-0" />}
                    {item.action === 'message' && <MessageSquareText className="h-5 w-5 text-purple-500 flex-shrink-0" />}
                    <p className={typography.body}>{item.label}</p>
                  </div>
                  <Button variant="outline" size="sm" className="flex-shrink-0">View</Button>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                <CheckCircle className="mx-auto h-8 w-8 text-green-500 mb-2" />
                <p>All caught up! No pending tasks.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Schedule */}
        <Card className={buildComponent.card('premium', 'desktop')}>
          <CardHeader className="pb-3">
            <CardTitle className={typography.h3}>Upcoming Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboardData.upcomingClasses.length > 0 ? (
              dashboardData.upcomingClasses.slice(0, 3).map((event, index) => (
                <div key={index} className="flex items-center space-x-3 py-2">
                  <div className="flex-shrink-0">
                    {event.type === 'live_class' && <Activity className="h-5 w-5 text-indigo-500" />}
                    {event.type === 'demo' && <Zap className="h-5 w-5 text-orange-500" />}
                    {event.type === 'workshop' && <BookOpen className="h-5 w-5 text-cyan-500" />}
                  </div>
                  <div>
                    <p className={typography.body + " font-medium"}>{event.courseTitle} - {event.batchName}</p>
                    <p className={typography.caption}>{event.date} at {event.time} ({event.studentCount} students)</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                <CalendarDays className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p>No upcoming classes or events.</p>
              </div>
            )}
            <Button variant="link" className="w-full mt-2">View Full Schedule</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Row: Performance & Engagement */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Snapshot - Mock Data */}
        <Card className={buildComponent.card('elegant', 'desktop')}>
          <CardHeader className="pb-3">
            <CardTitle className={typography.h3}>Performance Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <p className={typography.body}>Overall Student Progress:</p>
              <span className={typography.h2 + " text-blue-600"}>75%</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <p className={typography.body}>Average Attendance Rate:</p>
              <span className={typography.h2 + " text-emerald-600"}>88%</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <p className={typography.body}>Monthly Revenue:</p>
              <span className={typography.h2 + " text-purple-600"}>$1,250</span>
            </div>
            <Button variant="link" className="w-full mt-2">View Detailed Reports</Button>
          </CardContent>
        </Card>

        {/* Student Spotlight - Mock Data */}
        <Card className={buildComponent.card('elegant', 'desktop')}>
          <CardHeader className="pb-3">
            <CardTitle className={typography.h3}>Student Spotlight</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <UserRoundX className="h-5 w-5 text-red-500 flex-shrink-0" />
                <div>
                  <p className={typography.body + " font-medium"}>Struggling: John D.</p>
                  <p className={typography.caption}>Progress: 25%, Attendance: 40%</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="flex-shrink-0">Send Check-in</Button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <UserRoundCheck className="h-5 w-5 text-green-500 flex-shrink-0" />
                <div>
                  <p className={typography.body + " font-medium"}>Excelling: Sarah K.</p>
                  <p className={typography.caption}>Progress: 95%, Top Quiz Scores</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="flex-shrink-0">Send Kudos</Button>
            </div>
            <Button variant="link" className="w-full mt-2">View All Students</Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default InstructorDashboardV2;
