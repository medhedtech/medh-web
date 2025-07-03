"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { instructorApi, BatchAnalytics } from "@/apis/instructor.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buildAdvancedComponent, getResponsive, typography, buildComponent } from "@/utils/designSystem";
import {
  AlertCircle,
  BarChart,
  Users,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  BookOpen,
} from "lucide-react";
import { showToast } from "@/utils/toast";
import { useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface ClassReportData {
  batchName: string;
  enrollmentStats: {
    total: number;
    active: number;
    completed: number;
    dropped: number;
  };
  progressStats: {
    averageProgress: number;
    completionRate: number;
  };
  attendanceStats: {
    averageAttendance: number;
  };
  topStudents: { name: string; score: number }[];
  areasForImprovement: string[];
}

const ClassReportsPage = () => {
  const [reportData, setReportData] = useState<ClassReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [batches, setBatches] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const initialBatchId = searchParams.get("batchId");
  const [selectedBatchId, setSelectedBatchId] = useState(initialBatchId || "");

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const instructorId = localStorage.getItem("userId") || "60d5f3f7a8b8c20015b0e6e0";
      if (!instructorId) throw new Error("Instructor ID not found.");

      const batchesData = await instructorApi.getInstructorBatches(instructorId);
      if (Array.isArray(batchesData)) {
        setBatches(batchesData);
        if (!initialBatchId && batchesData.length > 0) {
          setSelectedBatchId(batchesData[0]._id);
        }
      } else {
        setBatches([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      showToast.error("Failed to load initial data.");
    } finally {
      setLoading(false);
    }
  }, [initialBatchId]);

  const fetchClassReport = useCallback(async () => {
    if (!selectedBatchId) {
      setReportData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Using instructorApi.getBatchAnalytics for core data, supplementing with mock data
      const batchAnalytics: BatchAnalytics = await instructorApi.getBatchAnalytics(selectedBatchId);
      
      const mockClassReport: ClassReportData = {
        batchName: batches.find(b => b._id === selectedBatchId)?.batch_name || `Batch ${selectedBatchId}`,
        enrollmentStats: batchAnalytics.enrollmentStats,
        progressStats: batchAnalytics.progressStats,
        attendanceStats: batchAnalytics.attendanceStats,
        topStudents: [
          { name: "Student A", score: 95 },
          { name: "Student B", score: 92 },
        ],
        areasForImprovement: ["Module 3 Understanding", "Assignment Submission Timeliness"],
      };
      setReportData(mockClassReport);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      showToast.error("Failed to load class report.");
    } finally {
      setLoading(false);
    }
  }, [selectedBatchId, batches]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    fetchClassReport();
  }, [fetchClassReport]);

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
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No class report data</h3>
          <p className="mt-1 text-sm text-gray-500">Select a batch to view its performance report.</p>
          <div className="flex justify-center mt-4">
            <div className="w-1/2">
                <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
                    <SelectTrigger id="batchSelect" className="w-full">
                    <SelectValue placeholder="Select a batch" />
                    </SelectTrigger>
                    <SelectContent>
                    {batches.map(batch => (
                        <SelectItem key={batch._id} value={batch._id}>
                        {batch.batch_name}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
            </div>
          </div>
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
        <h1 className={typography.h1}>Class Performance Report</h1>
        <p className={typography.lead}>
          Detailed performance analysis for {reportData.batchName}.
        </p>
        <div className="flex justify-center mt-4">
            <div className="w-1/3">
                <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
                    <SelectTrigger id="batchSelect" className="w-full">
                    <SelectValue placeholder="Select a batch" />
                    </SelectTrigger>
                    <SelectContent>
                    {batches.map(batch => (
                        <SelectItem key={batch._id} value={batch._id}>
                        {batch.batch_name}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
            </div>
          </div>
      </div>

      <motion.div
        className={getResponsive.grid({ mobile: 1, tablet: 2, desktop: 3, gap: 'lg' })}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.enrollmentStats.total}</div>
              <p className="text-xs text-gray-500">Total students in batch</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.enrollmentStats.active}</div>
              <p className="text-xs text-gray-500">Currently active</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.progressStats.completionRate}%</div>
              <p className="text-xs text-gray-500">Average course completion</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.progressStats.averageProgress}%</div>
              <p className="text-xs text-gray-500">Overall student progress</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.attendanceStats.averageAttendance}%</div>
              <p className="text-xs text-gray-500">Per session</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-8">
        <Card className={buildComponent.card('elegant')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 h-5 w-5" /> Top Performing Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reportData.topStudents.length === 0 ? (
              <p className="text-gray-500 text-center">No top students data available.</p>
            ) : (
              <div className="space-y-4">
                {reportData.topStudents.map((student, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <span className="flex-1 font-medium">{student.name}</span>
                    <div className="flex-1 bg-blue-100 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${student.score}%` }}
                      ></div>
                    </div>
                    <span className="w-12 text-right text-sm font-semibold">{student.score}%</span>
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
              <TrendingDown className="mr-2 h-5 w-5" /> Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reportData.areasForImprovement.length === 0 ? (
              <p className="text-gray-500 text-center">No specific areas for improvement identified.</p>
            ) : (
              <ul className="list-disc list-inside space-y-2">
                {reportData.areasForImprovement.map((area, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400">{area}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ClassReportsPage;
