"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { instructorApi, InstructorRevenue } from "@/apis/instructor.api"; // Assuming InstructorRevenue for receivables
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buildAdvancedComponent, getResponsive, typography, buildComponent } from "@/utils/designSystem";
import {
  AlertCircle,
  DollarSign,
  Calendar,
  Receipt,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Users, // Added Users import
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

const ReceivablesPage = () => {
  const [revenueData, setRevenueData] = useState<InstructorRevenue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReceivables = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Assuming instructorApi.getReceivables returns InstructorRevenue structure
      // In a real scenario: const data = await instructorApi.getReceivables(instructorId);
      const data = await instructorApi.getRevenueOverview(); // Using existing API for similar data
      setRevenueData(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      showToast.error("Failed to load receivables data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReceivables();
  }, [fetchReceivables]);

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
          <Wallet className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No receivables data</h3>
          <p className="mt-1 text-sm text-gray-500">No financial data available at the moment.</p>
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
        <h1 className={typography.h1}>My Receivables</h1>
        <p className={typography.lead}>
          Overview of your earnings, receipts, and pending dues.
        </p>
      </div>

      <motion.div
        className={getResponsive.grid({ mobile: 1, tablet: 2, desktop: 3, gap: 'lg' })}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${revenueData.summary.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-gray-500">All time earnings</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <Calendar className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${revenueData.summary.monthlyRevenue.toFixed(2)}</div>
              <p className="text-xs text-gray-500">This month</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <Receipt className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">${revenueData.summary.pendingAmount.toFixed(2)}</div>
              <p className="text-xs text-gray-500">Total outstanding</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className={buildComponent.card('elegant')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average per Student</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${revenueData.summary.averageRevenuePerStudent.toFixed(2)}</div>
              <p className="text-xs text-gray-500">Average revenue per student</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-8">
        <Card className={buildComponent.card('elegant')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 h-5 w-5" /> Revenue Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {revenueData.breakdown.length === 0 ? (
              <p className="text-gray-500 text-center">No revenue breakdown data available.</p>
            ) : (
              <div className="space-y-4">
                {revenueData.breakdown.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <span className="w-32 text-sm text-gray-600">{item.period}</span>
                    <div className="flex-1 bg-blue-100 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${(item.revenue / revenueData.summary.totalRevenue) * 100}%` }}
                      ></div>
                    </div>
                    <span className="w-20 text-right text-sm font-semibold">${item.revenue.toFixed(2)}</span>
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
              <Calendar className="mr-2 h-5 w-5" /> Monthly Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            {revenueData.monthlyTrends.length === 0 ? (
              <p className="text-gray-500 text-center">No monthly trend data available.</p>
            ) : (
              <div className="space-y-4">
                {revenueData.monthlyTrends.map((trend, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <span className="w-32 text-sm text-gray-600">{trend.monthName} {trend.year}</span>
                    <div className="flex-1 bg-green-100 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${(trend.revenue / Math.max(...revenueData.monthlyTrends.map(t => t.revenue))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="w-20 text-right text-sm font-semibold">${trend.revenue.toFixed(2)}</span>
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

export default ReceivablesPage;
