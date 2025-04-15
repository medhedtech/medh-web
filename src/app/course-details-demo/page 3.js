'use client';

import React from 'react';
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ThemeController from "@/components/shared/others/ThemeController";
import CourseDetailsExample from '@/components/examples/CourseDetailsExample';

export default function CourseDetailsDemoPage() {
  return (
    <PageWrapper>
      <ThemeController />
      <CourseDetailsExample />
    </PageWrapper>
  );
} 