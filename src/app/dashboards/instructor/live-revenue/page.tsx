"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { instructorApi } from "@/apis/instructor.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buildAdvancedComponent, getResponsive, typography, buildComponent } from "@/utils/designSystem";
import {
  AlertCircle,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart, // Added BarChart import
} from "lucide-react";
import { showToast } from "@/utils/toast";
import { format } from "date-fns";

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

interface LiveRevenueData {
  totalEnrollments: number;
  activeBatches: number;
  averageRevenuePerBatch: number;
  totalRevenue: number;
  batchDetails: any[]; // Assuming this contains details for breakdown
}

const LiveRevenuePage = () => {
  const [revenueData, setRevenueData] = useState<LiveRevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLiveRevenue = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Assuming instructorApi.getBatchRevenueMetrics returns LiveRevenueData
      const data = await instructorApi.getBatchRevenueMetrics();
      setRevenueData(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      showToast.error("Failed to load live revenue data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveRevenue();
  }, [fetchLiveRevenue]);

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

  if (!revenueData) {
    return (
      <div className="text-center py-16">
          <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No live revenue data</h3>
          <p className="mt-1 text-sm text-gray-500">No live class revenue data available at the moment.</p>
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
        <h1 className={typography.h1}>Live Classes Revenue</h1>
        <p className={typography.lead}>
          Overview of revenue generated from live classes and batches.
        </p>
      </div>

      <motion.div
        className={getResponsive.grid({ mobile: 1, tablet: 2, desktop: 3, gap: 'lg' })}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Live Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${revenueData.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-gray-500">All time from live classes</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{revenueData.totalEnrollments}</div>
              <p className="text-xs text-gray-500">Across all live batches</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
              <Calendar className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{revenueData.activeBatches}</div>
              <p className="text-xs text-gray-500">Currently running</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Revenue per Batch</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${revenueData.averageRevenuePerBatch.toFixed(2)}</div>
              <p className="text-xs text-gray-500">Per active batch</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-8">
        <Card className={buildComponent.card('elegant')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 h-5 w-5" /> Batch Revenue Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {revenueData.batchDetails.length === 0 ? (
              <p className="text-gray-500 text-center">No batch revenue data available.</p>
            ) : (
              <div className="space-y-4">
                {revenueData.batchDetails.map((batch, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <span className="w-32 text-sm text-gray-600">{batch.batch_name}</span>
                    <div className="flex-1 bg-blue-100 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${(batch.revenue / revenueData.totalRevenue) * 100}%` }}
                      ></div>
                    </div>
                    <span className="w-20 text-right text-sm font-semibold">${batch.revenue.toFixed(2)}</span>
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

export default LiveRevenuePage;
