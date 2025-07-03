"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { instructorApi, DemoClass } from "@/apis/instructor.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InstructorLayout from "@/components/dashboards/instructor/components/InstructorLayout";
import PageHeader from "@/components/dashboards/instructor/components/PageHeader";
import StatsCard from "@/components/dashboards/instructor/components/StatsCard";
import { buildAdvancedComponent, getResponsive, typography, buildComponent } from "@/utils/designSystem";
import {
  AlertCircle,
  Calendar,
  Clock,
  User,
  Video,
  Check,
  X,
  Search,
  Filter,
  Users,
  CheckCircle,
  XCircle,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Star,
  BookOpen,
  Zap,
  Eye,
  MoreHorizontal,
  ChevronRight,
  Timer,
  TrendingUp
} from "lucide-react";
import { showToast } from "@/utils/toast";

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

interface DemoRequestStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  completed: number;
}

const DemoRequestsPage = () => {
  const [demoRequests, setDemoRequests] = useState<DemoClass[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<DemoClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [stats, setStats] = useState<DemoRequestStats>({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
    completed: 0
  });

  const fetchDemoRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const instructorId = localStorage.getItem("userId") || "60d5f3f7a8b8c20015b0e6e0";
      if (!instructorId) {
        throw new Error("Instructor ID not found.");
      }
      
      const data = await instructorApi.getAssignedDemoClasses(instructorId);
      
      if (Array.isArray(data)) {
        setDemoRequests(data);
        
        // Calculate stats
        const newStats = {
          total: data.length,
          pending: data.filter(d => d.status === 'pending').length,
          accepted: data.filter(d => d.status === 'accepted').length,
          rejected: data.filter(d => d.status === 'rejected').length,
          completed: data.filter(d => d.status === 'completed').length,
        };
        setStats(newStats);
      } else {
        setDemoRequests([]);
      }
    } catch (err) {
      // Fallback to mock data for demo purposes
      const mockData: DemoClass[] = [
        {
          id: "demo1",
          courseName: "React Fundamentals",
          studentName: "Alice Johnson",
          studentEmail: "alice.johnson@email.com",
          scheduledDate: "2025-01-15",
          scheduledTime: "10:00 AM",
          status: "pending",
          studentAvatar: "/avatars/student1.jpg",
          courseType: "Frontend Development",
          duration: "60 minutes",
          studentPhone: "+1 (555) 123-4567",
          studentLocation: "New York, NY",
          requestedTopics: ["Components", "Hooks", "State Management"],
          studentExperience: "Beginner",
          notes: "Looking to understand React basics for a career transition"
        },
        {
          id: "demo2",
          courseName: "Node.js Backend",
          studentName: "Bob Smith",
          studentEmail: "bob.smith@email.com",
          scheduledDate: "2025-01-16",
          scheduledTime: "2:00 PM",
          status: "pending",
          studentAvatar: "/avatars/student2.jpg",
          courseType: "Backend Development",
          duration: "45 minutes",
          studentPhone: "+1 (555) 987-6543",
          studentLocation: "San Francisco, CA",
          requestedTopics: ["Express.js", "APIs", "Database Integration"],
          studentExperience: "Intermediate",
          notes: "Has some JavaScript experience, wants to learn backend"
        },
        {
          id: "demo3",
          courseName: "Python Data Science",
          studentName: "Carol Davis",
          studentEmail: "carol.davis@email.com",
          scheduledDate: "2025-01-14",
          scheduledTime: "4:00 PM",
          status: "accepted",
          studentAvatar: "/avatars/student3.jpg",
          courseType: "Data Science",
          duration: "90 minutes",
          studentPhone: "+1 (555) 456-7890",
          studentLocation: "Austin, TX",
          requestedTopics: ["Pandas", "NumPy", "Machine Learning"],
          studentExperience: "Advanced",
          notes: "PhD student looking to enhance data analysis skills"
        }
      ];
      
      setDemoRequests(mockData);
      setStats({
        total: mockData.length,
        pending: mockData.filter(d => d.status === 'pending').length,
        accepted: mockData.filter(d => d.status === 'accepted').length,
        rejected: mockData.filter(d => d.status === 'rejected').length,
        completed: mockData.filter(d => d.status === 'completed').length,
      });
      
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError("Using demo data. " + errorMessage);
      showToast.warning("Using demo data for preview.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDemoRequests();
  }, [fetchDemoRequests]);

  // Filter and sort requests
  useEffect(() => {
    let filtered = demoRequests;

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter(request => request.status === activeTab);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime();
        case "oldest":
          return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
        case "name":
          return a.studentName.localeCompare(b.studentName);
        case "course":
          return a.courseName.localeCompare(b.courseName);
        default:
          return 0;
      }
    });

    setFilteredRequests(filtered);
  }, [demoRequests, activeTab, searchTerm, sortBy]);

  const handleStatusUpdate = async (demoId: string, status: "accepted" | "rejected") => {
    try {
      await instructorApi.updateDemoStatus(demoId, { status });
      showToast.success(`Demo request ${status} successfully!`);
      fetchDemoRequests();
    } catch (err) {
      // For demo purposes, update local state
      setDemoRequests(prev => 
        prev.map(demo => 
          demo.id === demoId ? { ...demo, status } : demo
        )
      );
      showToast.success(`Demo request ${status} successfully! (Demo mode)`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning" className="flex items-center gap-1"><Timer className="h-3 w-3" />Pending</Badge>;
      case "accepted":
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" />Accepted</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" />Rejected</Badge>;
      case "completed":
        return <Badge variant="default" className="flex items-center gap-1"><Check className="h-3 w-3" />Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getExperienceColor = (experience: string) => {
    switch (experience?.toLowerCase()) {
      case "beginner":
        return "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20";
      case "intermediate":
        return "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20";
      case "advanced":
        return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20";
      default:
        return "text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-900/20";
    }
  };

  if (loading) {
    return (
      <InstructorLayout title="Demo Requests" subtitle="Manage incoming demo class requests">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-64" />
        </div>
      </InstructorLayout>
    );
  }

  if (error && demoRequests.length === 0) {
    return (
      <InstructorLayout title="Demo Requests" subtitle="Manage incoming demo class requests">
        <div className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </InstructorLayout>
    );
  }

  return (
    <InstructorLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Demo Requests"
          subtitle="Review and manage incoming demo class requests from prospective students"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboards/instructor" },
            { label: "Demo Requests" }
          ]}
          stats={[
            { label: "Total Requests", value: stats.total, icon: Users },
            { label: "Pending", value: stats.pending, icon: Timer },
            { label: "Accepted", value: stats.accepted, icon: CheckCircle },
            { label: "This Month", value: stats.total, icon: TrendingUp, trend: { value: 12, direction: "up" } }
          ]}
        />

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <StatsCard
            title="Total Requests"
            value={stats.total}
            icon={Users}
            iconColor="text-blue-500"
            change={{ value: 12, type: "increase", period: "this month" }}
            variant="glass"
          />
          <StatsCard
            title="Pending Review"
            value={stats.pending}
            icon={Timer}
            iconColor="text-orange-500"
            badge={{ label: "Action Required", variant: "warning" }}
            onClick={() => setActiveTab("pending")}
          />
          <StatsCard
            title="Accepted"
            value={stats.accepted}
            icon={CheckCircle}
            iconColor="text-green-500"
            change={{ value: 8, type: "increase", period: "this week" }}
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            icon={Check}
            iconColor="text-purple-500"
            description="Successfully conducted"
          />
        </motion.div>

        {/* Filters and Search */}
        <Card className={buildComponent.card('elegant')}>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-1 gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search students, courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="name">Student Name</SelectItem>
                    <SelectItem value="course">Course Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
            <TabsTrigger value="accepted">Accepted ({stats.accepted})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredRequests.length === 0 ? (
              <Card className={buildComponent.card('elegant')}>
                <CardContent className="p-12 text-center">
                  <Video className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    No demo requests found
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {activeTab === "pending" 
                      ? "No pending demo requests at the moment."
                      : `No ${activeTab} demo requests found.`
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredRequests.map((demo) => (
                  <motion.div key={demo.id} variants={itemVariants}>
                    <Card className={buildComponent.card('premium') + " hover:shadow-xl transition-all duration-300"}>
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={demo.studentAvatar} alt={demo.studentName} />
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                {demo.studentName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-slate-900 dark:text-white">
                                {demo.studentName}
                              </h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {demo.studentEmail}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(demo.status)}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Course Info */}
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-blue-500" />
                          <span className="font-medium text-slate-900 dark:text-white">
                            {demo.courseName}
                          </span>
                        </div>

                        {/* Schedule */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-slate-500" />
                            <span>{new Date(demo.scheduledDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-slate-500" />
                            <span>{demo.scheduledTime}</span>
                          </div>
                        </div>

                        {/* Experience Level */}
                        {demo.studentExperience && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Experience:</span>
                            <Badge 
                              variant="outline" 
                              className={getExperienceColor(demo.studentExperience)}
                            >
                              {demo.studentExperience}
                            </Badge>
                          </div>
                        )}

                        {/* Requested Topics */}
                        {demo.requestedTopics && demo.requestedTopics.length > 0 && (
                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Topics of Interest:</p>
                            <div className="flex flex-wrap gap-1">
                              {demo.requestedTopics.slice(0, 3).map((topic, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {topic}
                                </Badge>
                              ))}
                              {demo.requestedTopics.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{demo.requestedTopics.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        {demo.notes && (
                          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Student Notes:</p>
                            <p className="text-sm text-slate-800 dark:text-slate-200 line-clamp-2">
                              {demo.notes}
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                          {demo.status === "pending" ? (
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusUpdate(demo.id, "rejected")}
                                className="flex-1"
                              >
                                <X className="mr-2 h-4 w-4" /> Decline
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleStatusUpdate(demo.id, "accepted")}
                                className="flex-1"
                              >
                                <Check className="mr-2 h-4 w-4" /> Accept
                              </Button>
                            </div>
                          ) : (
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="flex-1">
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </Button>
                              {demo.status === "accepted" && (
                                <Button size="sm" className="flex-1">
                                  <Video className="mr-2 h-4 w-4" /> Start Demo
                                </Button>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Contact Info (for accepted/completed) */}
                        {(demo.status === "accepted" || demo.status === "completed") && (
                          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex justify-between text-xs text-slate-500">
                              {demo.studentPhone && (
                                <div className="flex items-center space-x-1">
                                  <Phone className="h-3 w-3" />
                                  <span>{demo.studentPhone}</span>
                                </div>
                              )}
                              {demo.studentLocation && (
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{demo.studentLocation}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </InstructorLayout>
  );
};

export default DemoRequestsPage;
