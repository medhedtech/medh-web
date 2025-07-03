"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { instructorApi } from "@/apis/instructor.api"; // Assuming instructorApi will have getLessonPlans
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buildAdvancedComponent, getResponsive, typography, buildComponent } from "@/utils/designSystem";
import {
  AlertCircle,
  ClipboardList,
  Plus,
  Edit,
  Trash2,
  BookOpen,
} from "lucide-react";
import { showToast } from "@/utils/toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

interface LessonPlan {
  _id: string;
  title: string;
  courseId: string;
  description: string;
  objectives: string[];
  materials: string[];
  durationMinutes: number;
  createdAt: string;
  updatedAt: string;
}

const LessonPlansPage = () => {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<LessonPlan | null>(null);

  const fetchLessonPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Assuming instructorApi.getLessonPlans returns a list of lesson plans
      // Since it's not in the provided API, I'll mock some data.
      // In a real scenario: const data = await instructorApi.getLessonPlans(instructorId);
      const mockData: LessonPlan[] = [
        {
          _id: "lp1",
          title: "Introduction to JavaScript",
          courseId: "js101",
          description: "Basic concepts of JavaScript programming.",
          objectives: ["Understand variables", "Learn data types"],
          materials: ["slides_js_intro.pdf", "code_examples.zip"],
          durationMinutes: 60,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "lp2",
          title: "Advanced React Hooks",
          courseId: "react201",
          description: "Deep dive into useContext and useReducer.",
          objectives: ["Master custom hooks", "State management"],
          materials: ["react_hooks_guide.pdf"],
          durationMinutes: 90,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setLessonPlans(mockData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      showToast.error("Failed to load lesson plans.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLessonPlans();
  }, [fetchLessonPlans]);

  const handleEdit = (plan: LessonPlan) => {
    setCurrentPlan(plan);
    setIsFormOpen(true);
  };

  const handleDelete = (planId: string) => {
    showToast.info(`Deleting lesson plan ${planId} (simulated).`);
    // In a real app: await instructorApi.deleteLessonPlan(planId);
    setLessonPlans(prev => prev.filter(p => p._id !== planId));
    showToast.success("Lesson plan deleted.");
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    showToast.info("Saving lesson plan (simulated).");
    // In a real app: await instructorApi.saveLessonPlan(currentPlan);
    setIsFormOpen(false);
    setCurrentPlan(null);
    fetchLessonPlans(); // Refresh list after save
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className={typography.h1}>Lesson Plans</h1>
            <p className={typography.lead}>
              Create, edit, and manage your course lesson plans.
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create New Plan
          </Button>
        </div>
      </div>

      {isFormOpen && (
        <motion.div variants={itemVariants} className="mb-6">
          <Card className={buildComponent.card('elegant')}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Edit className="mr-2 h-5 w-5" /> {currentPlan ? "Edit Lesson Plan" : "Create New Lesson Plan"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    type="text"
                    value={currentPlan?.title || ""}
                    onChange={(e) => setCurrentPlan(prev => ({ ...prev!, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="courseId">Course ID</Label>
                  <Input
                    id="courseId"
                    type="text"
                    value={currentPlan?.courseId || ""}
                    onChange={(e) => setCurrentPlan(prev => ({ ...prev!, courseId: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={currentPlan?.description || ""}
                    onChange={(e) => setCurrentPlan(prev => ({ ...prev!, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="objectives">Objectives (comma-separated)</Label>
                  <Input
                    id="objectives"
                    type="text"
                    value={currentPlan?.objectives.join(", ") || ""}
                    onChange={(e) => setCurrentPlan(prev => ({ ...prev!, objectives: e.target.value.split(",").map(s => s.trim()) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="materials">Materials (comma-separated)</Label>
                  <Input
                    id="materials"
                    type="text"
                    value={currentPlan?.materials.join(", ") || ""}
                    onChange={(e) => setCurrentPlan(prev => ({ ...prev!, materials: e.target.value.split(",").map(s => s.trim()) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={currentPlan?.durationMinutes || ""}
                    onChange={(e) => setCurrentPlan(prev => ({ ...prev!, durationMinutes: parseInt(e.target.value) }))}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Plan</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {lessonPlans.length === 0 ? (
        <div className="text-center py-16">
            <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No lesson plans found</h3>
            <p className="mt-1 text-sm text-gray-500">Create your first lesson plan to get started.</p>
        </div>
      ) : (
        <motion.div
          className={getResponsive.grid({ mobile: 1, tablet: 2, desktop: 3 })}
          variants={containerVariants}
        >
          {lessonPlans.map((plan) => (
            <motion.div key={plan._id} variants={itemVariants}>
              <Card className={buildComponent.card('elegant')}>
                <CardHeader>
                  <CardTitle className={typography.h3}>{plan.title}</CardTitle>
                  <p className="text-sm text-gray-500">Course ID: {plan.courseId}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <ClipboardList className="mr-2 h-4 w-4" />
                    <span>{plan.objectives.length} Objectives</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>{plan.materials.length} Materials</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    <span>{plan.durationMinutes} minutes</span>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(plan)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(plan._id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
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

export default LessonPlansPage;
