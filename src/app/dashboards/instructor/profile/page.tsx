"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { instructorApi, InstructorProfile, InstructorStatistics } from "@/apis/instructor.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buildAdvancedComponent, getResponsive, typography, buildComponent } from "@/utils/designSystem";
import {
  AlertCircle,
  User,
  Mail,
  Phone,
  Briefcase,
  Star,
  Users,
  Award,
  BookOpen, // Added BookOpen import
} from "lucide-react";
import { showToast } from "@/utils/toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

const ProfilePage = () => {
  const [profile, setProfile] = useState<InstructorProfile | null>(null);
  const [statistics, setStatistics] = useState<InstructorStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await instructorApi.getInstructorProfile();
      setProfile(data.profile);
      setStatistics(data.statistics);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      showToast.error("Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

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

  if (!profile) {
    return (
      <div className="text-center py-16">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Profile Not Found</h3>
          <p className="mt-1 text-sm text-gray-500">Instructor profile could not be loaded.</p>
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
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <Avatar className="h-24 w-24 md:h-32 md:w-32">
            <AvatarImage src={profile.profile_picture || "/avatar-placeholder.png"} alt={profile.full_name} />
            <AvatarFallback className="text-4xl md:text-5xl">
              {profile.full_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <h1 className={typography.h1}>{profile.full_name}</h1>
            <p className={typography.lead}>{profile.domain}</p>
            <div className="flex items-center justify-center md:justify-start text-sm text-gray-600 dark:text-gray-400 mt-2">
              <Mail className="mr-2 h-4 w-4" /> {profile.email}
            </div>
            {profile.phone_number && (
              <div className="flex items-center justify-center md:justify-start text-sm text-gray-600 dark:text-gray-400 mt-1">
                <Phone className="mr-2 h-4 w-4" /> {profile.phone_number}
              </div>
            )}
          </div>
        </div>
      </div>

      {statistics && (
        <motion.div
          className={getResponsive.grid({ mobile: 1, tablet: 2, desktop: 3, gap: 'lg' })}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Card className={buildComponent.card('elegant')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
                <BookOpen className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.totalBatches}</div>
                <p className="text-xs text-gray-500">Managed by you</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className={buildComponent.card('elegant')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.totalStudents}</div>
                <p className="text-xs text-gray-500">Taught by you</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className={buildComponent.card('elegant')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Demos</CardTitle>
                <Award className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.totalDemos}</div>
                <p className="text-xs text-gray-500">Conducted by you</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className={buildComponent.card('elegant')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center">
                  {statistics.averageRating.toFixed(1)} <Star className="h-5 w-5 ml-1 text-yellow-400" />
                </div>
                <p className="text-xs text-gray-500">From student reviews</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className={buildComponent.card('elegant')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Experience</CardTitle>
                <Briefcase className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.experience}</div>
                <p className="text-xs text-gray-500">Years in teaching</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProfilePage;
