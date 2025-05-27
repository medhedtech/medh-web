"use client";

import dynamic from 'next/dynamic';

const QuizMain = dynamic(() => import('./QuizMain'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  ),
});

export default function QuizWrapper() {
  return <QuizMain />;
} 