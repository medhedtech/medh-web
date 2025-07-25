"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Shield, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  ArrowLeft, 
  LogOut,
  RefreshCw,
  Clock,
  MapPin,
  Globe
} from "lucide-react";
import { authUtils } from "@/apis/auth.api";
import { useTheme } from "next-themes";
import { useToast } from "@/components/shared/ui/ToastProvider";
import { useCurrentYear } from "@/utils/hydration";
import logo1 from "@/assets/images/logo/medh_logo-1.png";
import logo2 from "@/assets/images/logo/logo_2.png";

interface ActiveSession {
  id: string;
  device_type: string;
  browser: string;
  location: string;
  ip_address: string;
  last_active: string;
  is_current: boolean;
}

const LogoutAllDevicesPage: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const currentYear = useCurrentYear();

  // State management
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState<boolean>(true);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  // Check authentication on mount
  useEffect(() => {
    if (!authUtils.isAuthenticated()) {
      showToast.warning("Please log in to access this page", { duration: 4000 });
      router.push("/login");
      return;
    }
    
    // Load active sessions
    loadActiveSessions();
  }, [router, showToast]);

  // Mock function to load active sessions (replace with actual API call)
  const loadActiveSessions = async () => {
    setIsLoadingSessions(true);
    try {
      // This would be replaced with actual API call
      // const response = await authUtils.getAllSessions();
      
      // Mock data for demonstration
      const mockSessions: ActiveSession[] = [
        {
          id: "1",
          device_type: "desktop",
          browser: "Chrome 120.0",
          location: "Mumbai, India",
          ip_address: "192.168.1.1",
          last_active: "2 minutes ago",
          is_current: true
        },
        {
          id: "2", 
          device_type: "mobile",
          browser: "Safari Mobile",
          location: "Delhi, India",
          ip_address: "192.168.1.2",
          last_active: "1 hour ago",
          is_current: false
        },
        {
          id: "3",
          device_type: "tablet",
          browser: "Chrome Mobile",
          location: "Bangalore, India", 
          ip_address: "192.168.1.3",
          last_active: "3 hours ago",
          is_current: false
        }
      ];
      
      setActiveSessions(mockSessions);
    } catch (error) {
      console.error("Failed to load sessions:", error);
      showToast.error("Failed to load active sessions", { duration: 4000 });
    } finally {
      setIsLoadingSessions(false);
    }
  };

  // Handle logout from all devices
  const handleLogoutAllDevices = async () => {
    setIsLoading(true);
    const loadingToastId = showToast.loading("Logging out from all devices...", { duration: 15000 });

    try {
      const result = await authUtils.logoutAllDevices();
      
      if (result.success) {
        showToast.dismiss(loadingToastId);
        showToast.success("Successfully logged out from all devices!", { duration: 4000 });
        setIsSuccess(true);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login?message=logged-out-all-devices");
        }, 3000);
      } else {
        showToast.dismiss(loadingToastId);
        showToast.error(result.message || "Failed to logout from all devices", { duration: 6000 });
      }
    } catch (error: any) {
      showToast.dismiss(loadingToastId);
      console.error("Logout all devices error:", error);
      showToast.error("An unexpected error occurred. Please try again.", { duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  // Get device icon based on type
  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="w-5 h-5" />;
      case 'tablet':
        return <Tablet className="w-5 h-5" />;
      case 'desktop':
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Successfully Logged Out
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You have been logged out from all devices. Redirecting to login page...
            </p>
            
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Redirecting in 3 seconds...</span>
            </div>
            
            <Link 
              href="/login"
              className="inline-flex items-center justify-center gap-2 mt-6 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              Go to Login Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Font styles */}
      <style jsx global>{`
        :root {
          --font-heading: var(--font-montserrat);
          --font-body: var(--font-inter);
        }
        
        .font-heading {
          font-family: var(--font-heading);
          letter-spacing: -0.025em;
        }
        
        .font-body {
          font-family: var(--font-body);
          letter-spacing: 0;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <Image 
                src={theme === 'dark' ? logo1 : logo2} 
                alt="Medh Logo" 
                width={120} 
                height={40} 
                className="mx-auto"
                priority
              />
            </Link>
            
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Logout All Devices
              </h1>
            </div>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Secure your account by logging out from all devices and sessions. This will end all active sessions except your current one.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Active Sessions */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Active Sessions
                </h2>
                <button
                  onClick={loadActiveSessions}
                  disabled={isLoadingSessions}
                  className="ml-auto p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  title="Refresh sessions"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingSessions ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {isLoadingSessions ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-500 dark:text-gray-400">Loading sessions...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeSessions.map((session) => (
                    <div 
                      key={session.id}
                      className={`p-4 rounded-xl border ${
                        session.is_current 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                          : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          session.is_current 
                            ? 'bg-blue-100 dark:bg-blue-800/30 text-blue-600 dark:text-blue-400' 
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                        }`}>
                          {getDeviceIcon(session.device_type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900 dark:text-white capitalize">
                              {session.device_type} • {session.browser}
                            </h3>
                            {session.is_current && (
                              <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{session.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Last active: {session.last_active}</span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-500">
                              IP: {session.ip_address}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Logout Action */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Security Action
                </h2>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                        Important Notice
                      </h3>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        This action will log you out from all devices and sessions. You'll need to log in again on each device.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    This will:
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      End all active sessions on all devices
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Invalidate all authentication tokens
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Secure your account from unauthorized access
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Require fresh login on all devices
                    </li>
                  </ul>
                </div>

                {!showConfirmation ? (
                  <button
                    onClick={() => setShowConfirmation(true)}
                    className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    Logout All Devices
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      Are you sure you want to logout from all devices?
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setShowConfirmation(false)}
                        className="py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleLogoutAllDevices}
                        disabled={isLoading}
                        className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Logging out...
                          </>
                        ) : (
                          'Confirm'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="text-center mt-8">
            <Link 
              href="/dashboards"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-xs text-gray-400 dark:text-gray-500 space-y-1">
            <p>Copyright © {currentYear} MEDH. All Rights Reserved.</p>
            <p className="text-blue-600 dark:text-blue-400 font-semibold">
              LEARN. UPSKILL. ELEVATE.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoutAllDevicesPage; 