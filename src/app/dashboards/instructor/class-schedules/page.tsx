"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { instructorApi, InstructorAPI } from "@/apis/instructor.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buildAdvancedComponent, getResponsive, typography, buildComponent } from "@/utils/designSystem";
import {
  AlertCircle,
  Calendar,
  Clock,
  Plus,
  Edit,
  Users,
  Video,
} from "lucide-react";
import { showToast } from "@/utils/toast";
import { useSearchParams } from "next/navigation";

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

interface ClassSchedule {
  _id: string;
  title: string;
  description?: string;
  session_date: string;
  start_time: string;
  end_time: string;
  session_type: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  meeting_link?: string;
  batch_id: string;
  course_id: string;
}

const ClassSchedulesPage = () => {
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const batchId = searchParams.get("batchId");

  const fetchClassSchedules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Using the enhanced API method
      const data = await InstructorAPI.getClassSessions({
        batch_id: batchId || undefined,
      });
      if (Array.isArray(data)) {
        setSchedules(data);
      } else {
        setSchedules([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      showToast.error("Failed to load class schedules.");
    } finally {
      setLoading(false);
    }
  }, [batchId]);

  useEffect(() => {
    fetchClassSchedules();
  }, [fetchClassSchedules]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="warning">Scheduled</Badge>;
      case "ongoing":
        return <Badge variant="success">Ongoing</Badge>;
      case "completed":
        return <Badge variant="default">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case "live_class":
        return <Video className="h-4 w-4" />;
      case "demo":
        return <Users className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className={typography.h1}>Class Schedules</h1>
            <p className={typography.lead}>
              Manage and view your class schedules and sessions.
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Schedule
          </Button>
        </div>
      </div>

      {schedules.length === 0 ? (
        <div className="text-center py-16">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No schedules found</h3>
            <p className="mt-1 text-sm text-gray-500">You have no class schedules at the moment.</p>
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Create First Schedule
            </Button>
        </div>
      ) : (
        <motion.div
          className={getResponsive.grid({ mobile: 1, tablet: 2, desktop: 3 })}
          variants={containerVariants}
        >
          {schedules.map((schedule) => (
            <motion.div key={schedule._id} variants={itemVariants}>
              <Card className={buildComponent.card('elegant')}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className={typography.h3}>{schedule.title}</CardTitle>
                  {getStatusBadge(schedule.status)}
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {schedule.description}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{new Date(schedule.session_date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{schedule.start_time} - {schedule.end_time}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    {getSessionTypeIcon(schedule.session_type)}
                    <span className="ml-2 capitalize">{schedule.session_type.replace('_', ' ')}</span>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    {schedule.status === 'scheduled' && (
                      <Button size="sm">
                        <Video className="mr-2 h-4 w-4" /> Start
                      </Button>
                    )}
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

export default ClassSchedulesPage;
