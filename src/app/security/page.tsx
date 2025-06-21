import React from 'react';
import { Metadata } from 'next';
import SecuritySettings from '@/components/sections/security/SecuritySettings';
import { layoutPatterns } from '@/utils/designSystem';

export const metadata: Metadata = {
  title: 'Security & Privacy Settings | Medh',
  description: 'Manage your account security, privacy settings, and device sessions. Secure your learning journey with Medh.',
  keywords: 'security, privacy, account settings, device management, logout all devices, medh security',
  openGraph: {
    title: 'Security & Privacy Settings | Medh',
    description: 'Manage your account security, privacy settings, and device sessions.',
    url: 'https://www.medh.co/security',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Security & Privacy Settings | Medh',
    description: 'Manage your account security, privacy settings, and device sessions.',
  },
};

export default function SecurityPage() {
  return (
    <div className={layoutPatterns.sectionWrapper}>
      <div className={layoutPatterns.containerWrapper}>
        <SecuritySettings />
      </div>
    </div>
  );
} 