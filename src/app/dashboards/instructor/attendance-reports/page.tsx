"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { instructorApi, AttendanceAnalytics } from "@/apis/instructor.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buildAdvancedComponent, getResponsive, typography, buildComponent } from "@/utils/designSystem";
import {
  AlertCircle,
  BarChart,
  Users,
  Calendar,
  Download,
  Activity,
} from "lucide-react";
import { showToast } from "@/utils/toast";
import { format } from "date-fns";
import { Label } from "@/components/ui/label"; // Import Label
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

const AttendanceReportsPage = () => {
  const [reportData, setReportData] = useState<AttendanceAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "quarter">("month");
  const [batches, setBatches] = useState<any[]>([]);

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const instructorId = localStorage.getItem("userId") || "60d5f3f7a8b8c20015b0e6e0";
      if (!instructorId) throw new Error("Instructor ID not found.");

      const batchesData = await instructorApi.getInstructorBatches(instructorId);
      if (Array.isArray(batchesData)) {
        setBatches(batchesData);
        if (batchesData.length > 0) {
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
  }, []);

  const fetchAttendanceReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await instructorApi.getAttendanceAnalytics({
        batch_id: selectedBatchId || undefined,
        period: selectedPeriod,
      });
      setReportData(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      showToast.error("Failed to load attendance report.");
    } finally {
      setLoading(false);
    }
  }, [selectedBatchId, selectedPeriod]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    fetchAttendanceReports();
  }, [fetchAttendanceReports]);

  const handleExportReport = async (formatType: 'csv' | 'excel' | 'pdf') => {
    try {
      showToast.info(`Exporting report as ${formatType}...`);
      const blob = await instructorApi.exportAttendanceReport({
        format: formatType,
        batch_id: selectedBatchId || undefined,
      });
      instructorApi.downloadFile(blob, `attendance_report.${formatType}`);
      showToast.success("Report exported successfully!");
    } catch (err) {
      showToast.error("Failed to export report.");
    }
  };

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
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No attendance data</h3>
          <p className="mt-1 text-sm text-gray-500">No attendance report data available at the moment.</p>
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
        <h1 className={typography.h1}>Attendance Reports</h1>
        <p className={typography.lead}>
          Analyze attendance trends and student participation.
        </p>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="batchFilter">Filter by Batch</Label>
          <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
            <SelectTrigger id="batchFilter">
              <SelectValue placeholder="All Batches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Batches</SelectItem>
              {batches.map(batch => (
                <SelectItem key={batch._id} value={batch._id}>
                  {batch.batch_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label htmlFor="periodFilter">Filter by Period</Label>
          <Select value={selectedPeriod} onValueChange={(value: "week" | "month" | "quarter") => setSelectedPeriod(value)}>
            <SelectTrigger id="periodFilter">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="quarter">Quarterly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:self-end">
          <Button onClick={() => handleExportReport('pdf')} variant="outline" className="mr-2">
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
          <Button onClick={() => handleExportReport('csv')} variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <motion.div
        className={getResponsive.grid({ mobile: 1, tablet: 2, desktop: 3, gap: 'lg' })}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <Calendar className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.overall_stats.total_sessions}</div>
              <p className="text-xs text-gray-500">In selected period</p>
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
              <div className="text-2xl font-bold">{reportData.overall_stats.average_attendance.toFixed(1)}%</div>
              <p className="text-xs text-gray-500">Across all sessions</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Active Batch</CardTitle>
              <Activity className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{reportData.overall_stats.most_active_batch || 'N/A'}</div>
              <p className="text-xs text-gray-500">Highest attendance rate</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-8">
        <Card className={buildComponent.card('elegant')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 h-5 w-5" /> Attendance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reportData.trends.length === 0 ? (
              <p className="text-gray-500 text-center">No trend data available for the selected period.</p>
            ) : (
              <div className="space-y-4">
                {reportData.trends.map((trend, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <span className="w-24 text-sm text-gray-600">{format(new Date(trend.date), 'MMM dd')}</span>
                    <div className="flex-1 bg-blue-100 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${trend.attendance_percentage}%` }}
                      ></div>
                    </div>
                    <span className="w-12 text-right text-sm font-semibold">{trend.attendance_percentage.toFixed(1)}%</span>
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
              <Users className="mr-2 h-5 w-5" /> Student Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reportData.student_performance.length === 0 ? (
              <p className="text-gray-500 text-center">No student performance data available.</p>
            ) : (
              <div className="space-y-4">
                {reportData.student_performance.map((student, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <span className="flex-1 font-medium">{student.student_name}</span>
                    <div className="flex-1 bg-green-100 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${student.attendance_percentage}%` }}
                      ></div>
                    </div>
                    <span className="w-12 text-right text-sm font-semibold">{student.attendance_percentage.toFixed(1)}%</span>
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

export default AttendanceReportsPage;
