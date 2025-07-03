"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { instructorApi, CreateAssignmentRequest } from "@/apis/instructor.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buildAdvancedComponent, typography, buildComponent } from "@/utils/designSystem";
import {
  AlertCircle,
  ClipboardCheck,
  Send,
  Plus,
} from "lucide-react";
import { showToast } from "@/utils/toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

const CreateAssessmentsPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [maxMarks, setMaxMarks] = useState<number | ''>("");
  const [instructions, setInstructions] = useState("");

  const handleCreateAssignment = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!title || !description || !courseId || !batchId || !dueDate || maxMarks === '' || !instructions) {
      showToast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const assignmentData: CreateAssignmentRequest = {
        title,
        description,
        course_id: courseId,
        batch_id: batchId,
        due_date: dueDate,
        max_marks: Number(maxMarks),
        instructions,
      };
      
      await instructorApi.createAssignment(assignmentData);
      showToast.success("Assignment created successfully!");
      // Clear form
      setTitle("");
      setDescription("");
      setCourseId("");
      setBatchId("");
      setDueDate("");
      setMaxMarks("");
      setInstructions("");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      showToast.error("Failed to create assignment.");
    } finally {
      setLoading(false);
    }
  }, [title, description, courseId, batchId, dueDate, maxMarks, instructions]);

  return (
    <motion.div
      className="p-4 md:p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={buildAdvancedComponent.headerCard()}>
        <h1 className={typography.h1}>Create New Assessment</h1>
        <p className={typography.lead}>
          Design and publish quizzes, homework, or projects for your students.
        </p>
      </div>

      <motion.div variants={itemVariants}>
        <Card className={buildComponent.card('elegant')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5" /> Assignment Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAssignment} className="space-y-6">
              <div>
                <Label htmlFor="title">Assignment Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Week 1 Quiz"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the assignment..."
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="courseId">Course ID</Label>
                  <Input
                    id="courseId"
                    type="text"
                    placeholder="e.g., CS101"
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="batchId">Batch ID</Label>
                  <Input
                    id="batchId"
                    type="text"
                    placeholder="e.g., BATCH_ALPHA"
                    value={batchId}
                    onChange={(e) => setBatchId(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="maxMarks">Max Marks</Label>
                  <Input
                    id="maxMarks"
                    type="number"
                    placeholder="e.g., 100"
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(Number(e.target.value))}
                    disabled={loading}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  placeholder="Specific instructions for students..."
                  rows={5}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : <><Plus className="mr-2 h-4 w-4" /> Create Assignment</>}
              </Button>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default CreateAssessmentsPage;
