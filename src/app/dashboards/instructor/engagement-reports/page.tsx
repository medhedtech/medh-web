"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { instructorApi } from "@/apis/instructor.api"; // Assuming instructorApi.getEngagementReports
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buildAdvancedComponent, getResponsive, typography, buildComponent } from "@/utils/designSystem";
import {
  AlertCircle,
  BarChart,
  Users,
  MessageSquare,
  BookOpen,
  Hourglass,
  ThumbsUp,
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

interface EngagementReportData {
  totalStudentsEngaged: number;
  averageForumPosts: number;
  averageQuestionsAsked: number;
  averageSessionDuration: number; // in minutes
  topEngagedStudents: { name: string; engagementScore: number }[];
  engagementTrends: { month: string; score: number }[];
}

const EngagementReportsPage = () => {
  const [reportData, setReportData] = useState<EngagementReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEngagementReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Assuming instructorApi.getEngagementReports returns relevant data
      // Since it's not in the provided API, I'll mock some data.
      // In a real scenario: const data = await instructorApi.getEngagementReports(instructorId);
      const mockData: EngagementReportData = {
        totalStudentsEngaged: 105,
        averageForumPosts: 3.2,
        averageQuestionsAsked: 1.8,
        averageSessionDuration: 45,
        topEngagedStudents: [
          { name: "Student X", engagementScore: 98 },
          { name: "Student Y", engagementScore: 95 },
          { name: "Student Z", engagementScore: 92 },
        ],
        engagementTrends: [
          { month: "Jan", score: 70 },
          { month: "Feb", score: 75 },
          { month: "Mar", score: 80 },
          { month: "Apr", score: 82 },
        ],
      };
      setReportData(mockData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      showToast.error("Failed to load engagement reports.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEngagementReports();
  }, [fetchEngagementReports]);

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
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No engagement data</h3>
          <p className="mt-1 text-sm text-gray-500">No student engagement report data available at the moment.</p>
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
        <h1 className={typography.h1}>Student Engagement Reports</h1>
        <p className={typography.lead}>
          Analyze student interaction and participation across your courses.
        </p>
      </div>

      <motion.div
        className={getResponsive.grid({ mobile: 1, tablet: 2, desktop: 3, gap: 'lg' })}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Engaged Students</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.totalStudentsEngaged}</div>
              <p className="text-xs text-gray-500">Actively participating</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Forum Posts</CardTitle>
              <MessageSquare className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.averageForumPosts.toFixed(1)}</div>
              <p className="text-xs text-gray-500">Per student</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Questions Asked</CardTitle>
              <BookOpen className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.averageQuestionsAsked.toFixed(1)}</div>
              <p className="text-xs text-gray-500">Per student</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Session Duration</CardTitle>
              <Hourglass className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.averageSessionDuration} min</div>
              <p className="text-xs text-gray-500">Per live session</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-8">
        <Card className={buildComponent.card('elegant')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ThumbsUp className="mr-2 h-5 w-5" /> Top Engaged Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reportData.topEngagedStudents.length === 0 ? (
              <p className="text-gray-500 text-center">No top engaged students data available.</p>
            ) : (
              <div className="space-y-4">
                {reportData.topEngagedStudents.map((student, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <span className="flex-1 font-medium">{student.name}</span>
                    <div className="flex-1 bg-blue-100 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${student.engagementScore}%` }}
                      ></div>
                    </div>
                    <span className="w-12 text-right text-sm font-semibold">{student.engagementScore}%</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-8">
        <Card className={buildComponent.card('elegant')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 h-5 w-5" /> Engagement Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reportData.engagementTrends.length === 0 ? (
              <p className="text-gray-500 text-center">No engagement trend data available.</p>
            ) : (
              <div className="space-y-4">
                {reportData.engagementTrends.map((trend, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <span className="w-24 text-sm text-gray-600">{trend.month}</span>
                    <div className="flex-1 bg-green-100 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${trend.score}%` }}
                      ></div>
                    </div>
                    <span className="w-12 text-right text-sm font-semibold">{trend.score}%</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default EngagementReportsPage;
