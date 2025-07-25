import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Logout All Devices - Medh',
  description: 'Secure your account by logging out from all devices and sessions. End all active sessions for enhanced security.',
  keywords: [
    'logout all devices',
    'security',
    'session management',
    'account security',
    'medh security',
    'logout sessions',
    'device management'
  ],
  openGraph: {
    title: 'Logout All Devices - Medh',
    description: 'Secure your account by logging out from all devices and sessions. End all active sessions for enhanced security.',
    type: 'website',
    url: 'https://medh.co/logout-all-devices',
  },
  twitter: {
    card: 'summary',
    title: 'Logout All Devices - Medh',
    description: 'Secure your account by logging out from all devices and sessions. End all active sessions for enhanced security.',
  },
  robots: {
    index: false, // Don't index this security page
    follow: false,
  },
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function LogoutAllDevicesLayout({ children }: LayoutProps) {
  return children;
} 