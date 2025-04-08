'use client';

import React, { useEffect, useState } from 'react';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';
import { useSearchParams, useRouter } from 'next/navigation';

export default function CourseDetailed() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get('id');
  
  useEffect(() => {
    if (courseId) {
      router.push(`/course-details/${courseId}`);
    } else {
      router.push('/courses'); // Redirect to courses page if no ID
    }
  }, [courseId, router]);
  
  return (
    <PageWrapper>
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse">Loading course details...</div>
      </div>
    </PageWrapper>
  );
} 