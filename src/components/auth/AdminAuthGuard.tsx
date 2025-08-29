"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Shield, AlertCircle } from "lucide-react";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

interface AdminData {
  id: string;
  full_name: string;
  email: string;
  admin_role: string;
  permissions: string[];
}

const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // API Configuration
  const API_BASE_URL = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8080/api/v1' 
    : 'https://api.medh.co/api/v1';

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        // Check for admin token in localStorage or sessionStorage
        const adminToken = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
        const storedAdminData = localStorage.getItem('admin_data') || sessionStorage.getItem('admin_data');

        if (!adminToken) {
          // No token found, redirect to admin login
          router.push('/admin-secure-login');
          return;
        }

        // Verify token with backend
        const response = await fetch(`${API_BASE_URL}/admin-auth/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          // Token is invalid or expired
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_data');
          sessionStorage.removeItem('admin_token');
          sessionStorage.removeItem('admin_data');
          
          router.push('/admin-secure-login');
          return;
        }

        const result = await response.json();
        
        if (result.success && result.data?.admin) {
          // Admin is authenticated
          setAdminData(result.data.admin);
          setIsAuthenticated(true);
          
          // Update stored admin data
          const storage = localStorage.getItem('admin_token') ? localStorage : sessionStorage;
          storage.setItem('admin_data', JSON.stringify(result.data.admin));
        } else {
          throw new Error('Invalid admin data received');
        }

      } catch (error: any) {
        console.error('Admin auth check failed:', error);
        setError(error.message || 'Authentication failed');
        
        // Clear invalid tokens
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_data');
        sessionStorage.removeItem('admin_token');
        sessionStorage.removeItem('admin_data');
        
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push('/admin-secure-login');
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAuth();
  }, [router, API_BASE_URL]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Shield className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              <Loader2 className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin absolute top-3 left-3" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Verifying Admin Access
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we authenticate your admin credentials...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Authentication Failed
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Redirecting to admin login...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Admin authentication required. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  // Authenticated - render children with admin context
  return (
    <div className="admin-authenticated">
      {/* Add admin data to global context if needed */}
      <div style={{ display: 'none' }} id="admin-data" data-admin={JSON.stringify(adminData)} />
      {children}
    </div>
  );
};

export default AdminAuthGuard;

