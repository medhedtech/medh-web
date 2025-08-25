'use client';

import React from 'react';
import { useParams } from 'next/navigation';

// Core components
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ThemeController from "@/components/shared/others/ThemeController";
import CourseDetailsPage from '@/components/page-components/CourseDetailsPage';
import { Toaster } from 'react-hot-toast';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params?.courseId;

  return (
    <PageWrapper>
      <ThemeController />
      <Toaster position="top-right" />
      
      <main className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900">
        <CourseDetailsPage courseId={courseId} />
      </main>
    </PageWrapper>
  );
} 
