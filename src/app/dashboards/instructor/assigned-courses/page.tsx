"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { instructorApi, Batch } from "@/apis/instructor.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buildAdvancedComponent, getResponsive, typography, buildComponent } from "@/utils/designSystem";
import {
  AlertCircle,
  BookOpen,
  Users,
  Calendar,
  Clock,
  BarChart3,
} from "lucide-react";
import { showToast } from "@/utils/toast";
import Link from "next/link";

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

const AssignedCoursesPage = () => {
  const [courses, setCourses] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignedCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const instructorId = localStorage.getItem("userId") || "60d5f3f7a8b8c20015b0e6e0";
      if (!instructorId) {
        throw new Error("Instructor ID not found.");
      }
      const data = await instructorApi.getInstructorBatches(instructorId);
      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        setCourses([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      showToast.error("Failed to load assigned courses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignedCourses();
  }, [fetchAssignedCourses]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "completed":
        return <Badge variant="default">Completed</Badge>;
      case "upcoming":
        return <Badge variant="warning">Upcoming</Badge>;
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
        <h1 className={typography.h1}>Assigned Courses</h1>
        <p className={typography.lead}>
          View and manage your assigned courses and batches.
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No courses assigned</h3>
            <p className="mt-1 text-sm text-gray-500">You have no assigned courses at the moment.</p>
        </div>
      ) : (
        <motion.div
          className={getResponsive.grid({ mobile: 1, tablet: 2, desktop: 3 })}
          variants={containerVariants}
        >
          {courses.map((course) => (
            <motion.div key={course._id} variants={itemVariants}>
              <Card className={buildComponent.card('elegant')}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className={typography.h3}>{course.batch_name}</CardTitle>
                  {getStatusBadge(course.status)}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Batch ID</h4>
                    <p className="text-lg font-medium">{course._id}</p>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="mr-2 h-4 w-4" />
                    <span>{course.current_students}/{course.max_students} Students</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{new Date(course.start_date).toLocaleDateString()} - {new Date(course.end_date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{course.schedule.days.join(', ')} at {course.schedule.time}</span>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Link href={`/dashboards/instructor/student-lists?batchId=${course._id}`}>
                      <Button variant="outline" size="sm">
                        <Users className="mr-2 h-4 w-4" /> Students
                      </Button>
                    </Link>
                    <Link href={`/dashboards/instructor/class-schedules?batchId=${course._id}`}>
                      <Button size="sm">
                        <BarChart3 className="mr-2 h-4 w-4" /> Manage
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AssignedCoursesPage;
