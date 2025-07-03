"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { instructorApi, AssignmentSubmission } from "@/apis/instructor.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buildAdvancedComponent, getResponsive, typography, buildComponent } from "@/utils/designSystem";
import {
  AlertCircle,
  ClipboardCheck,
  User,
  Download,
  Check,
  X,
  Edit,
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

const SubmittedWorkPage = () => {
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Assuming instructorApi.getSubmittedWork fetches all submissions for the instructor's assignments
      // Since it's not in the provided API, I'll mock some data.
      // In a real scenario: const data = await instructorApi.getSubmittedWork(instructorId);
      const mockData: AssignmentSubmission[] = [
        {
          _id: "sub1",
          assignment_id: "assign1",
          student_id: "student1",
          submitted_at: new Date().toISOString(),
          content: "Lorem ipsum dolor sit amet...",
          attachments: [],
          status: "submitted",
        },
        {
          _id: "sub2",
          assignment_id: "assign2",
          student_id: "student2",
          submitted_at: new Date().toISOString(),
          content: "Another submission content...",
          attachments: ["/path/to/report.pdf"],
          status: "graded",
          marks: 85,
          feedback: "Good work!",
        },
      ];
      setSubmissions(mockData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      showToast.error("Failed to load submitted work.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return <Badge variant="warning">Submitted</Badge>;
      case "graded":
        return <Badge variant="success">Graded</Badge>;
      case "returned":
        return <Badge variant="default">Returned</Badge>;
      case "late":
        return <Badge variant="destructive">Late</Badge>;
      case "missing":
        return <Badge variant="destructive">Missing</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleDownload = (attachmentUrl: string) => {
    showToast.info(`Downloading ${attachmentUrl} (simulated).`);
    // In a real app: instructorApi.downloadFile(attachmentBlob, filename);
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
        <h1 className={typography.h1}>Submitted Work</h1>
        <p className={typography.lead}>
          Review and grade assignments submitted by your students.
        </p>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-16">
            <ClipboardCheck className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No submitted work</h3>
            <p className="mt-1 text-sm text-gray-500">There is no submitted work to review at the moment.</p>
        </div>
      ) : (
        <motion.div
          className={getResponsive.grid({ mobile: 1, tablet: 2, desktop: 3 })}
          variants={containerVariants}
        >
          {submissions.map((submission) => (
            <motion.div key={submission._id} variants={itemVariants}>
              <Card className={buildComponent.card('elegant')}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className={typography.h3}>Submission ID: {submission._id}</CardTitle>
                  {getStatusBadge(submission.status)}
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
                    <div className="text-sm text-gray-600 dark:text-gray-400 max-h-24 overflow-hidden overflow-y-auto">
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
                  {submission.status === 'graded' && submission.marks !== undefined && (
                    <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Marks:</span>
                      <span className="font-bold text-green-600">{submission.marks}</span>
                    </div>
                  )}
                  {submission.status === 'graded' && submission.feedback && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <h4 className="font-semibold mb-1">Feedback:</h4>
                      <p>{submission.feedback}</p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2 pt-4">
                    {submission.status !== 'graded' && (
                      <Link href={`/dashboards/instructor/assessment-feedback?submissionId=${submission._id}`}>
                        <Button size="sm">
                          <Edit className="mr-2 h-4 w-4" /> Grade
                        </Button>
                      </Link>
                    )}
                    {submission.status === 'graded' && (
                       <Button size="sm" variant="outline">
                          <Edit className="mr-2 h-4 w-4" /> Edit Grade
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

export default SubmittedWorkPage;
