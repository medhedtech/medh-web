"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { instructorApi, MarkAttendanceRequest, AttendanceRecord } from "@/apis/instructor.api";
import { ClassSession } from "@/types/instructor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buildAdvancedComponent, typography, buildComponent } from "@/utils/designSystem";
import {
  AlertCircle,
  Calendar,
  Clock,
  CheckCircle,
  UserCheck,
  UserX,
  UserMinus,
  UserPlus,
  ArrowRight,
  User, // Keep User import for the student avatar
} from "lucide-react";
import { showToast } from "@/utils/toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox"; // Assuming shadcn checkbox component
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


interface Student {
  _id: string;
  full_name: string;
}

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

const MarkAttendancePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [batches, setBatches] = useState<any[]>([]); // To select batch
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [sessions, setSessions] = useState<ClassSession[]>([]); // To select session
  const [selectedSession, setSelectedSession] = useState<ClassSession | null>(null);
  const [students, setStudents] = useState<Student[]>([]); // Students in selected batch
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late' | 'excused'>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const instructorId = localStorage.getItem("userId") || "60d5f3f7a8b8c20015b0e6e0";
      if (!instructorId) throw new Error("Instructor ID not found.");

      // Fetch instructor's batches
      const batchesData = await instructorApi.getInstructorBatches(instructorId);
      if (Array.isArray(batchesData)) {
        setBatches(batchesData);
        if (batchesData.length > 0) {
          setSelectedBatchId(batchesData[0]._id);
        }
      } else {
        setBatches([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      showToast.error("Failed to load initial data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSessionAndStudents = useCallback(async () => {
    if (!selectedBatchId) {
      setSessions([]);
      setStudents([]);
      setSelectedSession(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Fetch sessions for the selected batch
        const sessionsData = await InstructorAPI.getClassSessions({ batch_id: selectedBatchId });
      if (Array.isArray(sessionsData)) {
        setSessions(sessionsData);
        if (sessionsData.length > 0) {
          setSelectedSession(sessionsData[0]);
        } else {
          setSelectedSession(null);
        }
      } else {
        setSessions([]);
        setSelectedSession(null);
      }

      // Fetch students for the selected batch
      const studentsData = await instructorApi.getBatchStudents(selectedBatchId);
      if (Array.isArray(studentsData)) {
        setStudents(studentsData.map(s => ({ _id: s.student._id, full_name: s.student.full_name })));
        const initialAttendance: Record<string, 'present' | 'absent' | 'late' | 'excused'> = {};
        studentsData.forEach(s => {
          initialAttendance[s.student._id] = 'present'; // Default to present
        });
        setAttendance(initialAttendance);
      } else {
        setStudents([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      showToast.error("Failed to load sessions and students.");
    } finally {
      setLoading(false);
    }
  }, [selectedBatchId]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    fetchSessionAndStudents();
  }, [fetchSessionAndStudents]);

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setNotes(prev => ({ ...prev, [studentId]: note }));
  };

  const handleSubmitAttendance = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedBatchId || !selectedSession) {
      showToast.error("Please select a batch and session.");
      return;
    }

    setLoading(true);
    setError(null);

    const attendanceRecords: AttendanceRecord[] = students.map(student => ({
      student_id: student._id,
      status: attendance[student._id] || 'absent',
      notes: notes[student._id] || undefined,
    }));

    const attendanceData: MarkAttendanceRequest = {
      batch_id: selectedBatchId,
      session_date: format(new Date(selectedSession.session_date), 'yyyy-MM-dd'),
      session_time: selectedSession.start_time,
      session_duration: 60, // Assuming a default duration, or fetch from session details
      session_topic: selectedSession.title,
      attendance_records: attendanceRecords,
    };

    try {
      await instructorApi.markAttendance(attendanceData);
      showToast.success("Attendance marked successfully!");
      // Optionally reset form or navigate
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      showToast.error("Failed to mark attendance.");
    } finally {
      setLoading(false);
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
        <h1 className={typography.h1}>Mark Class Attendance</h1>
        <p className={typography.lead}>
          Record attendance for your scheduled class sessions.
        </p>
      </div>

      <motion.div variants={itemVariants}>
        <Card className={buildComponent.card('elegant')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="mr-2 h-5 w-5" /> Attendance Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitAttendance} className="space-y-6">
              <div>
                <Label htmlFor="batchSelect">Select Batch</Label>
                <Select value={selectedBatchId} onValueChange={setSelectedBatchId} disabled={loading}>
                  <SelectTrigger id="batchSelect">
                    <SelectValue placeholder="Select a batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map(batch => (
                      <SelectItem key={batch._id} value={batch._id}>
                        {batch.batch_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedBatchId && (
                <div>
                  <Label htmlFor="sessionSelect">Select Session</Label>
                  <Select value={selectedSession?._id || ""} onValueChange={(sessionId) => setSelectedSession(sessions.find(s => s._id === sessionId) || null)} disabled={loading}>
                    <SelectTrigger id="sessionSelect">
                      <SelectValue placeholder="Select a session" />
                    </SelectTrigger>
                    <SelectContent>
                      {sessions.map(session => (
                        <SelectItem key={session._id} value={session._id}>
                          {session.title} - {format(new Date(session.session_date), 'MMM dd, yyyy')} {session.start_time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedSession && (
                <>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Students in Session:</h4>
                    {students.length === 0 ? (
                      <p className="text-gray-500">No students found for this batch.</p>
                    ) : (
                      students.map(student => (
                        <div key={student._id} className="flex items-center space-x-4 p-2 border rounded-md">
                          <User className="h-5 w-5 text-gray-600" />
                          <span className="flex-1 font-medium">{student.full_name}</span>
                          <Select value={attendance[student._id] || 'present'} onValueChange={(status) => handleAttendanceChange(student._id, status as any)} disabled={loading}>
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="present">
                                <div className="flex items-center"><UserCheck className="mr-2 h-4 w-4 text-green-500" /> Present</div>
                              </SelectItem>
                              <SelectItem value="absent">
                                <div className="flex items-center"><UserX className="mr-2 h-4 w-4 text-red-500" /> Absent</div>
                              </SelectItem>
                              <SelectItem value="late">
                                <div className="flex items-center"><UserMinus className="mr-2 h-4 w-4 text-yellow-500" /> Late</div>
                              </SelectItem>
                              <SelectItem value="excused">
                                <div className="flex items-center"><UserPlus className="mr-2 h-4 w-4 text-blue-500" /> Excused</div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Notes (optional)"
                            value={notes[student._id] || ''}
                            onChange={(e) => handleNoteChange(student._id, e.target.value)}
                            className="flex-1"
                            disabled={loading}
                          />
                        </div>
                      ))
                    )}
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Marking..." : <><CheckCircle className="mr-2 h-4 w-4" /> Mark Attendance</>}
                  </Button>
                </>
              )}

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

export default MarkAttendancePage;
