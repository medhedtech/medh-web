"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { instructorApi, DemoClass } from "@/apis/instructor.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buildAdvancedComponent, getResponsive, typography, buildComponent } from "@/utils/designSystem";
import {
  AlertCircle,
  Calendar,
  Clock,
  User,
  Video,
  Presentation,
} from "lucide-react";
import { showToast } from "@/utils/toast";
import Link from "next/link";

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

const DemoPresentationsPage = () => {
  const [presentations, setPresentations] = useState<DemoClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPresentations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Assuming 'instructorId' is available from auth context or local storage
      const instructorId = localStorage.getItem("userId") || "60d5f3f7a8b8c20015b0e6e0"; // Replace with actual instructor ID
      if (!instructorId) {
        throw new Error("Instructor ID not found.");
      }
      const data = await instructorApi.getAssignedDemoClasses(instructorId);
      // Filter for accepted classes, as these are ready for presentation
      if (Array.isArray(data)) {
        const acceptedDemos = data.filter(d => d.status === 'accepted');
        setPresentations(acceptedDemos);
      } else {
        setPresentations([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      showToast.error("Failed to load demo presentations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPresentations();
  }, [fetchPresentations]);

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
        <h1 className={typography.h1}>Demo Presentations</h1>
        <p className={typography.lead}>
          View and start your upcoming demo presentations.
        </p>
      </div>

      {presentations.length === 0 ? (
        <div className="text-center py-16">
            <Presentation className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No presentations</h3>
            <p className="mt-1 text-sm text-gray-500">You have no demo presentations scheduled.</p>
        </div>
      ) : (
        <motion.div
          className={getResponsive.grid({ mobile: 1, tablet: 2, desktop: 3 })}
          variants={containerVariants}
        >
          {presentations.map((demo) => (
            <motion.div key={demo.id} variants={itemVariants}>
              <Card className={buildComponent.card('elegant')}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className={typography.h3}>{demo.courseName}</CardTitle>
                  <Badge variant="success">Accepted</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src="" alt={demo.studentName} />
                      <AvatarFallback>
                        {demo.studentName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{demo.studentName}</p>
                      <p className="text-sm text-gray-500">{demo.studentEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{new Date(demo.scheduledDate).toLocaleDateString()}</span>
                    <Clock className="ml-4 mr-2 h-4 w-4" />
                    <span>{demo.scheduledTime}</span>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Link href={`/dashboards/instructor/demo-live?sessionId=${demo.id}`}>
                      <Button size="sm">
                        <Video className="mr-2 h-4 w-4" /> Start Presentation
                      </Button>
                    </Link>
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

export default DemoPresentationsPage;
