"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { instructorApi, StudentProgress } from "@/apis/instructor.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress"; // Assuming shadcn progress component
import { buildAdvancedComponent, getResponsive, typography, buildComponent } from "@/utils/designSystem";
import {
  AlertCircle,
  User,
  BookOpen,
  CheckCircle,
  Award,
  Users,
  MessageSquare,
  HelpCircle,
  Star,
  Activity,
} from "lucide-react";
import { showToast } from "@/utils/toast";
import { useSearchParams } from "next/navigation";
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

const StudentProgressPage = () => {
  const [studentProgress, setStudentProgress] = useState<StudentProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const studentId = searchParams.get("studentId");
  const batchId = searchParams.get("batchId"); // Assuming batchId might be needed for getStudentProgress

  const fetchStudentProgress = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!studentId) {
        throw new Error("Student ID is required.");
      }
      // Assuming getEnhancedStudentAnalytics is the correct API for detailed progress
      const data = await instructorApi.getEnhancedStudentAnalytics(studentId);
      setStudentProgress(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      showToast.error("Failed to load student progress.");
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchStudentProgress();
  }, [fetchStudentProgress]);

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <Skeleton className="h-48 w-full mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
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

  if (!studentProgress) {
    return (
      <div className="text-center py-16">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No student data</h3>
          <p className="mt-1 text-sm text-gray-500">No progress data available for this student.</p>
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
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="" alt={studentProgress.studentId} />
            <AvatarFallback className="text-2xl">
              {studentProgress.studentId.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className={typography.h1}>Student Progress</h1>
            <p className={typography.lead}>
              Tracking progress for Student ID: {studentProgress.studentId}
            </p>
          </div>
        </div>
      </div>

      <motion.div
        className={getResponsive.grid({ mobile: 1, tablet: 2, desktop: 3 })}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" /> Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-5xl font-bold text-blue-600">
                  {studentProgress.overallProgress}%
                </p>
                <Progress value={studentProgress.overallProgress} className="mt-4" />
                <p className="text-sm text-gray-500 mt-2">Overall course completion</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" /> Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Quiz Average:</span>
                <span className="font-semibold">{studentProgress.performanceMetrics.quiz_average}%</span>
              </div>
              <div className="flex justify-between">
                <span>Assignment Average:</span>
                <span className="font-semibold">{studentProgress.performanceMetrics.assignment_average}%</span>
              </div>
              <div className="flex justify-between">
                <span>Attendance Rate:</span>
                <span className="font-semibold">{studentProgress.performanceMetrics.attendance_rate}%</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" /> Engagement Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Forum Posts:</span>
                <span className="font-semibold">{studentProgress.engagementMetrics.forum_posts}</span>
              </div>
              <div className="flex justify-between">
                <span>Questions Asked:</span>
                <span className="font-semibold">{studentProgress.engagementMetrics.questions_asked}</span>
              </div>
              <div className="flex justify-between">
                <span>Peer Interactions:</span>
                <span className="font-semibold">{studentProgress.engagementMetrics.peer_interactions}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default StudentProgressPage;
