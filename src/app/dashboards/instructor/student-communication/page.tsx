"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { instructorApi } from "@/apis/instructor.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buildAdvancedComponent, getResponsive, typography, buildComponent } from "@/utils/designSystem";
import {
  AlertCircle,
  Mail,
  Send,
  User,
  MessageSquare,
} from "lucide-react";
import { showToast } from "@/utils/toast";
import { useSearchParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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

interface StudentInfo {
  _id: string;
  full_name: string;
  email: string;
}

const StudentCommunicationPage = () => {
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const searchParams = useSearchParams();
  const studentId = searchParams.get("studentId");

  const fetchStudentInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!studentId) {
        throw new Error("Student ID is required.");
      }
      // Assuming getStudentsList can be used to fetch info for a single student
      const data = await instructorApi.getStudentsList({ search: studentId });
      if (Array.isArray(data) && data.length > 0) {
        setStudentInfo(data[0]);
      } else {
        setStudentInfo(null);
        showToast.error("Student not found.");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      showToast.error("Failed to load student information.");
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchStudentInfo();
  }, [fetchStudentInfo]);

  const handleSendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (!messageSubject || !messageContent) {
      showToast.error("Subject and message cannot be empty.");
      return;
    }
    if (!studentInfo) {
      showToast.error("Cannot send message: student information not loaded.");
      return;
    }

    showToast.info(`Sending message to ${studentInfo.full_name}: Subject - "${messageSubject}"`);
    // In a real application, you would call an API here to send the message
    // For example: await instructorApi.sendMessageToStudent(studentInfo._id, messageSubject, messageContent);
    setMessageSubject("");
    setMessageContent("");
    showToast.success("Message sent (simulated).");
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

  if (!studentInfo) {
    return (
      <div className="text-center py-16">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Student Not Found</h3>
          <p className="mt-1 text-sm text-gray-500">The student you are trying to communicate with could not be found.</p>
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
        <h1 className={typography.h1}>Communicate with {studentInfo.full_name}</h1>
        <p className={typography.lead}>
          Send a message to {studentInfo.full_name} ({studentInfo.email}).
        </p>
      </div>

      <motion.div variants={itemVariants}>
        <Card className={buildComponent.card('elegant')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5" /> Send Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="Message subject"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Your message content..."
                  rows={5}
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                />
              </div>
              <Button type="submit">
                <Send className="mr-2 h-4 w-4" /> Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default StudentCommunicationPage;
