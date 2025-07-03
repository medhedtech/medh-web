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
  Users,
  Search,
  Mail,
  UserCheck,
} from "lucide-react";
import { showToast } from "@/utils/toast";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
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

interface Student {
  _id: string;
  full_name: string;
  email: string;
  enrollment_date: string;
  status: 'active' | 'inactive' | 'completed' | 'dropped';
  profile_picture?: string;
  progress?: {
    completion_percentage: number;
  };
}

const StudentListsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const batchId = searchParams.get("batchId");

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await instructorApi.getStudentsList({
        batch_id: batchId || undefined,
        search: searchTerm || undefined,
      });
      if (Array.isArray(data)) {
        setStudents(data);
      } else {
        setStudents([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      showToast.error("Failed to load student list.");
    } finally {
      setLoading(false);
    }
  }, [batchId, searchTerm]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'completed': return 'text-blue-500';
      case 'dropped': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <Skeleton className="h-10 w-full mb-6" />
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
        <h1 className={typography.h1}>Student Lists {batchId && `for Batch ${batchId}`}</h1>
        <p className={typography.lead}>
          View and manage students in your assigned batches.
        </p>
      </div>

      <div className="mb-6 relative">
        <Input
          type="text"
          placeholder="Search students by name or email..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-10 pr-4 py-2"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {students.length === 0 ? (
        <div className="text-center py-16">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No students found</h3>
            <p className="mt-1 text-sm text-gray-500">There are no students to display for this batch or search term.</p>
        </div>
      ) : (
        <motion.div
          className={getResponsive.grid({ mobile: 1, tablet: 2, desktop: 3 })}
          variants={containerVariants}
        >
          {students.map((student) => (
            <motion.div key={student._id} variants={itemVariants}>
              <Card className={buildComponent.card('elegant')}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Assuming profile_picture is available, otherwise use a fallback */}
                    <img src={student.profile_picture || "/avatar-placeholder.png"} alt={student.full_name} className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <CardTitle className={typography.h3}>{student.full_name}</CardTitle>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${getStatusColor(student.status)} capitalize`}>
                    {student.status}
                  </span>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <UserCheck className="mr-2 h-4 w-4" />
                    <span>Enrolled: {new Date(student.enrollment_date).toLocaleDateString()}</span>
                  </div>
                  {student.progress && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <span>Progress: {student.progress.completion_percentage}%</span>
                    </div>
                  )}
                  <div className="flex justify-end space-x-2 pt-4">
                    <Link href={`/dashboards/instructor/student-communication?studentId=${student._id}`}>
                      <Button variant="outline" size="sm">
                        <Mail className="mr-2 h-4 w-4" /> Message
                      </Button>
                    </Link>
                    <Link href={`/dashboards/instructor/student-progress?studentId=${student._id}`}>
                      <Button size="sm">
                        <Users className="mr-2 h-4 w-4" /> View Progress
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

export default StudentListsPage;
