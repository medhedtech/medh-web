"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { instructorApi, AssignmentSubmission } from "@/apis/instructor.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buildAdvancedComponent, typography, buildComponent } from "@/utils/designSystem";
import {
  AlertCircle,
  ClipboardCheck,
  User,
  Download,
  GraduationCap,
  MessageSquare,
} from "lucide-react";
import { showToast } from "@/utils/toast";
import { useSearchParams } from "next/navigation";
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

const AssessmentFeedbackPage = () => {
  const [submission, setSubmission] = useState<AssignmentSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [grade, setGrade] = useState<number | ''>('');
  const [feedback, setFeedback] = useState('');
  const searchParams = useSearchParams();
  const submissionId = searchParams.get("submissionId");

  const fetchSubmissionDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!submissionId) {
        throw new Error("Submission ID is required.");
      }
      // Assuming instructorApi.getAssignmentSubmissions can fetch a single submission by ID
      // or we need a new API call for getAssessmentFeedback
      // For now, mocking data, in real scenario, it would be:
      // const data = await instructorApi.getAssessmentFeedback(submissionId);
      const mockData: AssignmentSubmission = {
        _id: submissionId,
        assignment_id: "assign1",
        student_id: "student1",
        submitted_at: new Date().toISOString(),
        content: "This is the student's submitted work content for Assignment 1.",
        attachments: ["/path/to/student_work.pdf", "/path/to/another_file.docx"],
        status: "submitted",
        // These fields would be present if already graded
        // marks: 75,
        // feedback: "Some initial feedback.",
      };
      setSubmission(mockData);
      setGrade(mockData.marks !== undefined ? mockData.marks : '');
      setFeedback(mockData.feedback || '');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      showToast.error("Failed to load submission details.");
    } finally {
      setLoading(false);
    }
  }, [submissionId]);

  useEffect(() => {
    fetchSubmissionDetails();
  }, [fetchSubmissionDetails]);

  const handleSubmitFeedback = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!submission) return;
    if (grade === '' || feedback.trim() === '') {
      showToast.error("Please provide a grade and feedback.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await instructorApi.gradeSubmission(submission._id, {
        marks: Number(grade),
        feedback: feedback,
        status: 'graded',
      });
      showToast.success("Feedback and grade submitted successfully!");
      fetchSubmissionDetails(); // Refresh data
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      showToast.error("Failed to submit feedback.");
    } finally {
      setLoading(false);
    }
  }, [submission, grade, feedback, fetchSubmissionDetails]);

  const handleDownload = (attachmentUrl: string) => {
    showToast.info(`Downloading ${attachmentUrl} (simulated).`);
    // In a real app: instructorApi.downloadFile(attachmentBlob, filename);
  };

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <Skeleton className="h-64 w-full mb-6" />
        <Skeleton className="h-48 w-full" />
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

  if (!submission) {
    return (
      <div className="text-center py-16">
          <ClipboardCheck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Submission Not Found</h3>
          <p className="mt-1 text-sm text-gray-500">The requested submission could not be found.</p>
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
        <h1 className={typography.h1}>Assessment Feedback</h1>
        <p className={typography.lead}>
          Provide feedback and grade for submission ID: {submission._id}
        </p>
      </div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className={buildComponent.card('elegant')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5" /> Submitted Work
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Assignment ID:</h4>
              <p className="text-lg font-medium">{submission.assignment_id}</p>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <User className="mr-2 h-4 w-4" />
              <span>Student ID: {submission.student_id}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span>Submitted at: {new Date(submission.submitted_at).toLocaleDateString()}</span>
            </div>
            {submission.content && (
              <div className="text-sm text-gray-600 dark:text-gray-400 max-h-48 overflow-hidden overflow-y-auto border p-2 rounded-md">
                <h4 className="font-semibold mb-1">Content:</h4>
                <p>{submission.content}</p>
              </div>
            )}
            {submission.attachments && submission.attachments.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1">Attachments:</h4>
                {submission.attachments.map((attachmentUrl, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-between mt-1"
                    onClick={() => handleDownload(attachmentUrl)}
                  >
                    {attachmentUrl.split('/').pop()} <Download className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            )}
            {submission.marks !== undefined && (
              <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Current Grade:</span>
                <span className="font-bold text-blue-600">{submission.marks}</span>
              </div>
            )}
            {submission.feedback && (
              <div className="text-sm text-gray-600 dark:text-gray-400 border p-2 rounded-md">
                <h4 className="font-semibold mb-1">Current Feedback:</h4>
                <p>{submission.feedback}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={buildComponent.card('elegant')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="mr-2 h-5 w-5" /> Provide Grade & Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div>
                <Label htmlFor="grade">Grade (Marks)</Label>
                <Input
                  id="grade"
                  type="number"
                  placeholder="e.g., 85"
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <Label htmlFor="feedback">Feedback Comments</Label>
                <Textarea
                  id="feedback"
                  placeholder="Provide detailed feedback here..."
                  rows={6}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : <><MessageSquare className="mr-2 h-4 w-4" /> Submit Feedback</>}
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

export default AssessmentFeedbackPage;
