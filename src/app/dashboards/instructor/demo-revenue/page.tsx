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

interface DemoRevenueData {
  totalDemos: number;
  completedDemos: number;
  conversionRate: number;
  averageRevenuePerDemo: number;
  totalRevenue: number;
}

const DemoRevenuePage = () => {
  const [revenueData, setRevenueData] = useState<DemoRevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDemoRevenue = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Assuming instructorApi.getDemoRevenueMetrics returns DemoRevenueData
      const data = await instructorApi.getDemoRevenueMetrics();
      setRevenueData(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      showToast.error("Failed to load demo revenue data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDemoRevenue();
  }, [fetchDemoRevenue]);

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
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No demo revenue data</h3>
          <p className="mt-1 text-sm text-gray-500">No demo class revenue data available at the moment.</p>
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
        <h1 className={typography.h1}>Demo Classes Revenue</h1>
        <p className={typography.lead}>
          Overview of revenue generated from demo classes.
        </p>
      </div>

      <motion.div
        className={getResponsive.grid({ mobile: 1, tablet: 2, desktop: 3, gap: 'lg' })}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Demo Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${revenueData.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-gray-500">All time from demos</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Demos</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{revenueData.completedDemos}</div>
              <p className="text-xs text-gray-500">Total sessions completed</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{revenueData.conversionRate.toFixed(2)}%</div>
              <p className="text-xs text-gray-500">Demos to enrollment</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Revenue per Demo</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${revenueData.averageRevenuePerDemo.toFixed(2)}</div>
              <p className="text-xs text-gray-500">Per completed demo</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default DemoRevenuePage;
