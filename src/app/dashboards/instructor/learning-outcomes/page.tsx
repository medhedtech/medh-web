"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { instructorApi } from "@/apis/instructor.api"; // Assuming instructorApi.getLearningOutcomes
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buildAdvancedComponent, getResponsive, typography, buildComponent } from "@/utils/designSystem";
import {
  AlertCircle,
  Award,
  BookOpen,
  CheckCircle,
  Target,
  Users,
} from "lucide-react";
import { showToast } from "@/utils/toast";
import { Label } from "@/components/ui/label"; // Import Label
import { Button } from "@/components/ui/button"; // Import Button
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

interface LearningOutcome {
  _id: string;
  name: string;
  description: string;
  masteryPercentage: number;
  studentsMastered: number;
  totalStudents: number;
}

interface CourseLearningOutcomes {
  courseId: string;
  courseName: string;
  outcomes: LearningOutcome[];
}

const LearningOutcomesPage = () => {
  const [learningOutcomes, setLearningOutcomes] = useState<CourseLearningOutcomes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const instructorId = localStorage.getItem("userId") || "60d5f3f7a8b8c20015b0e6e0";
      if (!instructorId) throw new Error("Instructor ID not found.");

      // Assuming getCourses is available or can be mocked
      const mockCourses = [
        { _id: "course1", course_name: "Introduction to Web Dev" },
        { _id: "course2", course_name: "Advanced React" },
      ];
      setCourses(mockCourses);
      if (mockCourses.length > 0) {
        setSelectedCourseId(mockCourses[0]._id);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      showToast.error("Failed to load initial data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLearningOutcomes = useCallback(async () => {
    if (!selectedCourseId) {
      setLearningOutcomes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Assuming instructorApi.getLearningOutcomes returns relevant data
      // For now, mocking data.
      const mockData: CourseLearningOutcomes[] = [
        {
          courseId: "course1",
          courseName: "Introduction to Web Dev",
          outcomes: [
            {
              _id: "lo1",
              name: "HTML Structure",
              description: "Students can correctly structure HTML documents.",
              masteryPercentage: 90,
              studentsMastered: 45,
              totalStudents: 50,
            },
            {
              _id: "lo2",
              name: "CSS Styling",
              description: "Students can apply CSS to style web pages.",
              masteryPercentage: 85,
              studentsMastered: 42,
              totalStudents: 50,
            },
          ],
        },
        {
          courseId: "course2",
          courseName: "Advanced React",
          outcomes: [
            {
              _id: "lo3",
              name: "State Management with Redux",
              description: "Students can implement Redux for state management.",
              masteryPercentage: 70,
              studentsMastered: 21,
              totalStudents: 30,
            },
            {
              _id: "lo4",
              name: "Custom Hooks Development",
              description: "Students can create and use custom React hooks.",
              masteryPercentage: 95,
              studentsMastered: 28,
              totalStudents: 30,
            },
          ],
        },
      ];
      
      const filteredOutcomes = mockData.filter(
        (data) => data.courseId === selectedCourseId
      );
      setLearningOutcomes(filteredOutcomes);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      showToast.error("Failed to load learning outcomes.");
    } finally {
      setLoading(false);
    }
  }, [selectedCourseId]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    fetchLearningOutcomes();
  }, [fetchLearningOutcomes]);

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

  return (
    <motion.div
      className="p-4 md:p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={buildAdvancedComponent.headerCard()}>
        <h1 className={typography.h1}>Learning Outcome Analysis</h1>
        <p className={typography.lead}>
          Track student mastery of key learning objectives per course.
        </p>
      </div>

      <div className="mb-6 flex justify-center">
        <div className="w-full md:w-1/2 lg:w-1/3">
          <Label htmlFor="courseSelect">Select Course</Label>
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger id="courseSelect">
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map(course => (
                <SelectItem key={course._id} value={course._id}>
                  {course.course_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {learningOutcomes.length === 0 ? (
        <div className="text-center py-16">
            <Target className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No learning outcomes found</h3>
            <p className="mt-1 text-sm text-gray-500">Select a course to view its learning outcomes.</p>
        </div>
      ) : (
        <motion.div
          className={getResponsive.grid({ mobile: 1, tablet: 2, desktop: 3, gap: 'lg' })}
          variants={containerVariants}
        >
          {learningOutcomes.map((courseOutcomes) => (
            <React.Fragment key={courseOutcomes.courseId}>
              <div className="col-span-full">
                <h2 className={`${typography.h2} mb-4 text-center`}>
                  Outcomes for {courseOutcomes.courseName}
                </h2>
              </div>
              {courseOutcomes.outcomes.map((outcome) => (
                <motion.div key={outcome._id} variants={itemVariants}>
                  <Card className={buildComponent.card('elegant')}>
                    <CardHeader>
                      <CardTitle className={typography.h3}>{outcome.name}</CardTitle>
                      <p className="text-sm text-gray-500">{outcome.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Award className="mr-2 h-4 w-4" />
                        <span>Mastery: {outcome.masteryPercentage}%</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Users className="mr-2 h-4 w-4" />
                        <span>{outcome.studentsMastered} of {outcome.totalStudents} students mastered</span>
                      </div>
                      <div className="flex justify-end pt-4">
                        <Button size="sm" variant="outline">
                          <CheckCircle className="mr-2 h-4 w-4" /> View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </React.Fragment>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default LearningOutcomesPage;
