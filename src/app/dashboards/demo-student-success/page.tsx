"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { buildAdvancedComponent, typography } from "@/utils/designSystem";
import { getDemoStudentById, IDemoStudent } from "@/apis/demo-student.api";
import {
  CheckCircle,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Video,
  Star,
  ArrowRight,
  Download,
  Share2,
  Home,
  MessageCircle,
  Bell,
  Loader2,
  AlertCircle
} from "lucide-react";

const DemoStudentSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const demoStudentId = searchParams.get('id');
  
  const [demoStudent, setDemoStudent] = useState<IDemoStudent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch demo student details
  useEffect(() => {
    const fetchDemoStudent = async () => {
      if (!demoStudentId) {
        setError("No demo student ID provided");
        setLoading(false);
        return;
      }

      try {
        const response = await getDemoStudentById(demoStudentId);
        if (response.data?.success && response.data.data?.demo_student) {
          setDemoStudent(response.data.data.demo_student);
        } else {
          setError("Demo student not found");
        }
      } catch (err: any) {
        console.error("Error fetching demo student:", err);
        setError(err.message || "Failed to load demo student details");
      } finally {
        setLoading(false);
      }
    };

    fetchDemoStudent();
  }, [demoStudentId]);

  // Format date and time
  const formatDateTime = (date: string, time: string) => {
    const datetime = new Date(`${date}T${time}`);
    return datetime.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle sharing
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Demo Session Scheduled - MEDH',
          text: `I've scheduled a demo session with MEDH for ${demoStudent?.demo_sessions?.[0]?.course_category}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <motion.div
        className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600 dark:text-gray-400">Loading your registration details...</p>
        </div>
      </motion.div>
    );
  }

  if (error || !demoStudent) {
    return (
      <motion.div
        className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Registration Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error || "We couldn't find your demo student registration."}
            </p>
            <Button onClick={() => router.push('/dashboards/demo-student-register')}>
              Register Again
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const nextSession = demoStudent.demo_sessions?.[0];

  return (
    <motion.div
      className="min-h-screen bg-slate-50 dark:bg-slate-950 py-6 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={buildAdvancedComponent.glassCard({ variant: 'hero', padding: 'desktop' }) + " text-center mb-8"}
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h1 className={typography.h1 + " mb-2 text-green-700 dark:text-green-400"}>
            Registration Successful!
          </h1>
          <p className={typography.lead}>
            Your demo session has been scheduled. We're excited to help you start your learning journey!
          </p>
          <div className="flex justify-center items-center space-x-2 mt-4">
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Demo Student ID: {demoStudent.demo_student_id}
            </Badge>
          </div>
        </motion.div>

        {/* Registration Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Your Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{demoStudent.personal_info.full_name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{demoStudent.personal_info.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>
                    {demoStudent.personal_info.phone_numbers[0]?.country} {demoStudent.personal_info.phone_numbers[0]?.number}
                  </span>
                </div>
                {demoStudent.personal_info.location?.city && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>
                      {demoStudent.personal_info.location.city}, {demoStudent.personal_info.location.country}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Demo Session Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Video className="w-5 h-5" />
                  <span>Demo Session Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {nextSession ? (
                  <>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">
                        {formatDateTime(nextSession.session_date, nextSession.session_time)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{nextSession.duration_minutes} minutes</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-4 h-4 text-gray-500" />
                      <span>{nextSession.course_category}</span>
                    </div>
                    {nextSession.course_title && (
                      <div className="flex items-center space-x-3">
                        <Star className="w-4 h-4 text-gray-500" />
                        <span>{nextSession.course_title}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <Video className="w-4 h-4 text-gray-500" />
                      <Badge variant="outline" className="capitalize">
                        {nextSession.session_type} Session
                      </Badge>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 italic">
                    Demo session will be scheduled shortly. You'll receive confirmation via email.
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Instructor Information */}
        {demoStudent.assigned_instructor && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Your Instructor</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {demoStudent.assigned_instructor.full_name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold">{demoStudent.assigned_instructor.full_name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{demoStudent.assigned_instructor.email}</p>
                    {demoStudent.assigned_instructor.phone_number && (
                      <p className="text-gray-600 dark:text-gray-400">{demoStudent.assigned_instructor.phone_number}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Learning Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Your Learning Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {demoStudent.preferences?.preferred_course_categories && (
                <div>
                  <h4 className="font-medium mb-2">Interested Course Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {demoStudent.preferences.preferred_course_categories.map(category => (
                      <Badge key={category} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {demoStudent.preferences?.learning_goals && (
                <div>
                  <h4 className="font-medium mb-2">Learning Goals</h4>
                  <div className="flex flex-wrap gap-2">
                    {demoStudent.preferences.learning_goals.map(goal => (
                      <Badge key={goal} variant="outline">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ArrowRight className="w-5 h-5" />
                <span>What Happens Next?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Email Confirmation</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      You'll receive a confirmation email with session details and joining instructions.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Calendar Invite</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      A calendar invite will be sent with the meeting link and agenda.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Reminder Notifications</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      We'll send you reminders 24 hours and 1 hour before your session.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 text-sm font-medium">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium">Attend Your Demo</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Join the session and explore our teaching methodology and course content.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            variant="outline"
            onClick={() => router.push('/dashboards')}
            className="flex items-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={handleShare}
            className="flex items-center space-x-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </Button>
          
          <Button
            onClick={() => window.open('/courses', '_blank')}
            className="flex items-center space-x-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explore Courses</span>
          </Button>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <Card className="bg-gray-50 dark:bg-gray-900/50">
            <CardContent className="py-6">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                If you have any questions or need to reschedule, please contact us:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="w-4 h-4" />
                  <span>support@medh.in</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="w-4 h-4" />
                  <span>+91 1234567890</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MessageCircle className="w-4 h-4" />
                  <span>Live Chat Available</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DemoStudentSuccessPage; 