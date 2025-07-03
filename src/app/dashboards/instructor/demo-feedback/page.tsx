"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { instructorApi, DemoFeedbackStats } from "@/apis/instructor.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buildAdvancedComponent, getResponsive, typography, buildComponent } from "@/utils/designSystem";
import { BarChart, Star, MessageSquare, AlertCircle } from "lucide-react";
import { showToast } from "@/utils/toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

const DemoFeedbackPage = () => {
  const [feedbackStats, setFeedbackStats] = useState<DemoFeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbackStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const instructorId = localStorage.getItem("userId") || "60d5f3f7a8b8c20015b0e6e0"; // Replace with actual instructor ID
      if (!instructorId) {
        throw new Error("Instructor ID not found.");
      }
      const data = await instructorApi.getDemoFeedbackStats(instructorId);
      setFeedbackStats(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      showToast.error("Failed to load feedback statistics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbackStats();
  }, [fetchFeedbackStats]);

  const handleFeedbackSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    showToast.info("Feedback submission is not yet implemented.");
  };

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
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
        <h1 className={typography.h1}>Demo Feedback</h1>
        <p className={typography.lead}>
          View feedback statistics and submit feedback for your demo classes.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
            <Card className={buildComponent.card('elegant')}>
                <CardHeader>
                    <CardTitle className="flex items-center">
                    <BarChart className="mr-2" /> Feedback Statistics
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {feedbackStats ? (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                        <span>Total Feedbacks:</span>
                        <span className="font-bold">{feedbackStats.totalFeedbacks}</span>
                        </div>
                        <div className="flex justify-between items-center">
                        <span>Average Rating:</span>
                        <span className="font-bold flex items-center">
                            {feedbackStats.averageRating.toFixed(1)} <Star className="h-4 w-4 ml-1 text-yellow-400" />
                        </span>
                        </div>
                        <div>
                        <h4 className="font-semibold mb-2">Rating Distribution:</h4>
                        {Object.entries(feedbackStats.ratingDistribution).map(([rating, count]) => (
                            <div key={rating} className="flex items-center">
                            <span className="w-12">{rating} Stars</span>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{
                                    width: `${(count / feedbackStats.totalFeedbacks) * 100}%`,
                                }}
                                ></div>
                            </div>
                            <span className="w-8 text-right">{count}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                    ) : (
                    <p>No feedback statistics available.</p>
                    )}
                </CardContent>
            </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
            <Card className={buildComponent.card('elegant')}>
                <CardHeader>
                    <CardTitle className="flex items-center">
                    <MessageSquare className="mr-2" /> Submit Feedback
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="session">Demo Session</Label>
                            <Select>
                                <SelectTrigger id="session">
                                    <SelectValue placeholder="Select a session" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="session1">Demo with John Doe</SelectItem>
                                    <SelectItem value="session2">Demo with Jane Smith</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="rating">Rating</Label>
                            <Select>
                                <SelectTrigger id="rating">
                                    <SelectValue placeholder="Select a rating" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5 Stars</SelectItem>
                                    <SelectItem value="4">4 Stars</SelectItem>
                                    <SelectItem value="3">3 Stars</SelectItem>
                                    <SelectItem value="2">2 Stars</SelectItem>
                                    <SelectItem value="1">1 Star</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="feedback">Feedback</Label>
                            <Textarea id="feedback" placeholder="Your feedback..." />
                        </div>
                        <Button type="submit">Submit Feedback</Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DemoFeedbackPage;
