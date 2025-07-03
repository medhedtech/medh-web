"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { instructorApi, InstructorStatistics } from "@/apis/instructor.api"; // Assuming InstructorStatistics is relevant
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buildAdvancedComponent, getResponsive, typography, buildComponent } from "@/utils/designSystem";
import {
  AlertCircle,
  BarChart,
  Users,
  BookOpen,
  Star,
  ArrowUpRight,
  ArrowDownRight,
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

interface PerformanceReportData {
  totalBatches: number;
  totalStudents: number;
  averageRating: number;
  courseCompletionRate: number;
  averageAttendanceRate: number;
  newEnrollmentsThisMonth: number;
}

const PerformanceReportsPage = () => {
  const [reportData, setReportData] = useState<PerformanceReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPerformanceReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Assuming instructorApi.getPerformanceReports returns relevant data
      // Since it's not in the provided API, I'll mock some data.
      // In a real scenario: const data = await instructorApi.getPerformanceReports(instructorId);
      const mockData: PerformanceReportData = {
        totalBatches: 5,
        totalStudents: 120,
        averageRating: 4.8,
        courseCompletionRate: 85,
        averageAttendanceRate: 92,
        newEnrollmentsThisMonth: 15,
      };
      setReportData(mockData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      showToast.error("Failed to load performance reports.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPerformanceReports();
  }, [fetchPerformanceReports]);

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

  if (!reportData) {
    return (
      <div className="text-center py-16">
          <BarChart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No performance data</h3>
          <p className="mt-1 text-sm text-gray-500">No performance report data available at the moment.</p>
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
        <h1 className={typography.h1}>Performance Reports</h1>
        <p className={typography.lead}>
          Overview of your teaching performance and student engagement.
        </p>
      </div>

      <motion.div
        className={getResponsive.grid({ mobile: 1, tablet: 2, desktop: 3, gap: 'lg' })}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
              <BookOpen className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.totalBatches}</div>
              <p className="text-xs text-gray-500">Currently assigned</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.totalStudents}</div>
              <p className="text-xs text-gray-500">Across all batches</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center">
                {reportData.averageRating.toFixed(1)} <Star className="h-5 w-5 ml-1 text-yellow-400" />
              </div>
              <p className="text-xs text-gray-500">From student feedback</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Course Completion Rate</CardTitle>
              <BarChart className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.courseCompletionRate}%</div>
              <p className="text-xs text-gray-500">Average across courses</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Attendance Rate</CardTitle>
                <Users className="h-4 w-4 text-gray-500" />
              </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.averageAttendanceRate}%</div>
              <p className="text-xs text-gray-500">Across all sessions</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Enrollments (Month)</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.newEnrollmentsThisMonth}</div>
              <p className="text-xs text-gray-500">This month</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PerformanceReportsPage;
