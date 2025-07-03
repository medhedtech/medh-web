"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { instructorApi } from "@/apis/instructor.api"; // Assuming instructorApi will have getResourceVisibility
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buildAdvancedComponent, getResponsive, typography, buildComponent } from "@/utils/designSystem";
import {
  AlertCircle,
  Eye,
  EyeOff,
  BookOpen,
  FileText,
  Video,
} from "lucide-react";
import { showToast } from "@/utils/toast";
import { Switch } from "@/components/ui/switch"; // Assuming shadcn switch component
import { Label } from "@/components/ui/label";

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

interface CourseResource {
  _id: string;
  courseId: string;
  title: string;
  type: 'document' | 'video' | 'presentation' | 'other';
  isVisible: boolean;
}

const ResourceVisibilityPage = () => {
  const [resources, setResources] = useState<CourseResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Assuming instructorApi.getResourceVisibility returns a list of resources
      // Since it's not in the provided API, I'll mock some data.
      // In a real scenario: const data = await instructorApi.getResourceVisibility(instructorId);
      const mockData: CourseResource[] = [
        {
          _id: "res1",
          courseId: "js101",
          title: "JavaScript Basics Slides",
          type: "presentation",
          isVisible: true,
        },
        {
          _id: "res2",
          courseId: "js101",
          title: "DOM Manipulation Guide",
          type: "document",
          isVisible: false,
        },
        {
          _id: "res3",
          courseId: "react201",
          title: "React Hooks Deep Dive Video",
          type: "video",
          isVisible: true,
        },
        {
          _id: "res4",
          courseId: "react201",
          title: "Redux Toolkit Example Code",
          type: "other",
          isVisible: false,
        },
      ];
      setResources(mockData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      showToast.error("Failed to load resources.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleVisibilityChange = (resourceId: string, newVisibility: boolean) => {
    setResources(prevResources =>
      prevResources.map(res =>
        res._id === resourceId ? { ...res, isVisible: newVisibility } : res
      )
    );
    showToast.success(`Resource visibility updated (simulated).`);
    // In a real app: await instructorApi.updateResourceVisibility(resourceId, newVisibility);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-4 w-4 text-gray-500" />;
      case "video":
        return <Video className="h-4 w-4 text-gray-500" />;
      case "presentation":
        return <BookOpen className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <Skeleton className="h-48 w-full mb-6" />
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
        <h1 className={typography.h1}>Resource Visibility</h1>
        <p className={typography.lead}>
          Manage the visibility of course materials for your students.
        </p>
      </div>

      {resources.length === 0 ? (
        <div className="text-center py-16">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No resources found</h3>
            <p className="mt-1 text-sm text-gray-500">No course resources have been uploaded yet.</p>
        </div>
      ) : (
        <motion.div
          className={getResponsive.grid({ mobile: 1, tablet: 2, desktop: 3 })}
          variants={containerVariants}
        >
          {resources.map((resource) => (
            <motion.div key={resource._id} variants={itemVariants}>
              <Card className={buildComponent.card('elegant')}>
                <CardHeader>
                  <CardTitle className={typography.h3}>{resource.title}</CardTitle>
                  <p className="text-sm text-gray-500">Course ID: {resource.courseId}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    {getTypeIcon(resource.type)}
                    <span className="ml-2 capitalize">{resource.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`visibility-switch-${resource._id}`} className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      {resource.isVisible ? (
                        <Eye className="mr-2 h-4 w-4 text-green-500" />
                      ) : (
                        <EyeOff className="mr-2 h-4 w-4 text-red-500" />
                      )}
                      {resource.isVisible ? "Visible" : "Hidden"}
                    </Label>
                    <Switch
                      id={`visibility-switch-${resource._id}`}
                      checked={resource.isVisible}
                      onCheckedChange={(checked) => handleVisibilityChange(resource._id, checked)}
                    />
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

export default ResourceVisibilityPage;
