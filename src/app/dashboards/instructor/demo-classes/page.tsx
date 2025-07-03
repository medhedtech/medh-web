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
import { buildAdvancedComponent, getResponsive, typography, buildComponent } from "@/utils/designSystem";
import {
  AlertCircle,
  Calendar,
  Clock,
  User,
  Video,
  Check,
  X,
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

const DemoClassesPage = () => {
  const [demoClasses, setDemoClasses] = useState<DemoClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDemoClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Assuming 'instructorId' is available from auth context or local storage
      const instructorId = localStorage.getItem("userId") || "60d5f3f7a8b8c20015b0e6e0"; // Replace with actual instructor ID
      if (!instructorId) {
        throw new Error("Instructor ID not found.");
      }
      const data = await instructorApi.getAssignedDemoClasses(instructorId);
      if (Array.isArray(data)) {
        setDemoClasses(data);
      } else {
        setDemoClasses([]);
      }
    } catch (err) {
      // Fallback to mock data
      const mockDemoClasses: DemoClass[] = [
        {
          id: "demo1",
          studentName: "Alice Smith",
          courseName: "React Basics",
          scheduledDate: "2025-07-04",
          scheduledTime: "10:00 AM",
          status: "pending",
          studentEmail: "alice@example.com",
          studentPhone: "123-456-7890",
        },
        {
          id: "demo2",
          studentName: "Bob Johnson",
          courseName: "Node.js Fundamentals",
          scheduledDate: "2025-07-05",
          scheduledTime: "02:00 PM",
          status: "accepted",
          studentEmail: "bob@example.com",
          studentPhone: "987-654-3210",
        },
        {
          id: "demo3",
          studentName: "Carol Lee",
          courseName: "Intro to Web Dev",
          scheduledDate: "2025-07-06",
          scheduledTime: "04:00 PM",
          status: "completed",
          studentEmail: "carol@example.com",
          studentPhone: "555-555-5555",
        },
      ];
      setDemoClasses(mockDemoClasses);
      setError("Failed to load real data. Displaying mock data.");
      showToast.warning("Failed to load real data. Displaying mock data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDemoClasses();
  }, [fetchDemoClasses]);

  const handleStatusUpdate = async (demoId: string, status: "accepted" | "rejected") => {
    try {
      await instructorApi.updateDemoStatus(demoId, { status });
      showToast.success(`Demo class ${status}.`);
      fetchDemoClasses(); // Refresh the list
    } catch (err) {
      showToast.error(`Failed to update status.`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="default">Pending</Badge>;
      case "accepted":
        return <Badge variant="success">Accepted</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "completed":
        return <Badge variant="default">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
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

  return (
    <motion.div
      className="p-4 md:p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={buildAdvancedComponent.headerCard()}>
        <h1 className={typography.h1}>Assigned Demo Classes</h1>
        <p className={typography.lead}>
          Review and manage your scheduled demo sessions.
        </p>
      </div>

      {demoClasses.length === 0 ? (
        <div className="text-center py-16">
            <Video className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No demo classes</h3>
            <p className="mt-1 text-sm text-gray-500">You have no assigned demo classes at the moment.</p>
        </div>
      ) : (
        <motion.div
          className={getResponsive.grid({ mobile: 1, tablet: 2, desktop: 3 })}
          variants={containerVariants}
        >
          {demoClasses.map((demo) => (
            <motion.div key={demo.id} variants={itemVariants}>
              <Card className={buildComponent.card('elegant')}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className={typography.h3}>{demo.courseName}</CardTitle>
                  {getStatusBadge(demo.status)}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src="" alt={demo.studentName} />
                      <AvatarFallback>
                        {demo.studentName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{demo.studentName}</p>
                      <p className="text-sm text-gray-500">{demo.studentEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{new Date(demo.scheduledDate).toLocaleDateString()}</span>
                    <Clock className="ml-4 mr-2 h-4 w-4" />
                    <span>{demo.scheduledTime}</span>
                  </div>

                  {demo.status === 'pending' && (
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(demo.id, "rejected")}
                      >
                        <X className="mr-2 h-4 w-4" /> Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(demo.id, "accepted")}
                      >
                        <Check className="mr-2 h-4 w-4" /> Accept
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default DemoClassesPage;
