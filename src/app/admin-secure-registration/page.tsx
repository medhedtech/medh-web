"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Link from "next/link";
import { 
  Eye, EyeOff, User, Mail, Phone, Lock, AlertCircle, 
  Loader2, UserCircle, ArrowRight, CheckCircle, 
  Shield, Building, Briefcase, Key
} from "lucide-react";

// Assets
import logo1 from "@/assets/images/logo/medh_logo-1.png";
import logo2 from "@/assets/images/logo/logo_2.png";

// Components & Hooks
import { useCurrentYear } from "@/utils/hydration";
import { useToast } from "@/components/shared/ui/ToastProvider";

// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8080/api/v1' 
  : 'https://api.medh.co/api/v1';

// Types
interface AdminRegisterData {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  admin_role: string;
  phone?: string;
  department?: string;
  designation?: string;
  secret_key: string;
}

// Enhanced Zod Schema for Admin Registration
const adminRegisterSchema = z.object({
  full_name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  
  email: z.string()
    .email("Please enter a valid email address")
    .min(5, "Email is too short")
    .max(100, "Email is too long")
    .transform(email => email.toLowerCase().trim()),
  
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .refine(password => /[a-z]/.test(password), "Password must contain at least one lowercase letter")
    .refine(password => /[A-Z]/.test(password), "Password must contain at least one uppercase letter")
    .refine(password => /\d/.test(password), "Password must contain at least one number")
    .refine(password => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(password), "Password must contain at least one special character"),
  
  confirm_password: z.string(),
  
  admin_role: z.string().min(1, "Please select an admin role"),
  
  phone: z.string().optional(),
  
  department: z.string().optional(),
  
  designation: z.string().optional(),
  
  secret_key: z.string().min(1, "Secret key is required for admin registration")

}).refine(data => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"]
});

type AdminRegisterFormData = z.infer<typeof adminRegisterSchema>;

// Password strength calculator
const calculatePasswordStrength = (password: string): { score: number; message: string; color: string; suggestions: string[] } => {
  if (!password) return { score: 0, message: "", color: "gray", suggestions: [] };
  
  let score = 0;
  const suggestions: string[] = [];

  if (password.length >= 8) score += 1;
  else suggestions.push("Use at least 8 characters");
  
  if (password.length >= 12) score += 1;
  else if (password.length >= 8) suggestions.push("Consider using 12+ characters");

  if (/[a-z]/.test(password)) score += 1;
  else suggestions.push("Add lowercase letters");
  
  if (/[A-Z]/.test(password)) score += 1;
  else suggestions.push("Add uppercase letters");
  
  if (/\d/.test(password)) score += 1;
  else suggestions.push("Add numbers");
  
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(password)) score += 1;
  else suggestions.push("Add special characters");

  let message = "";
  let color = "gray";
  
  if (score < 3) {
    message = "Weak";
    color = "red";
  } else if (score < 5) {
    message = "Fair";
    color = "yellow";
  } else if (score < 6) {
    message = "Good";
    color = "blue";
  } else {
    message = "Strong";
    color = "green";
  }

  return { score, message, color, suggestions: suggestions.slice(0, 2) };
};

const AdminRegisterForm: React.FC = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const currentYear = useCurrentYear();
  const { showToast } = useToast();

  // Form state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Form setup with Zod
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<AdminRegisterFormData>({
    resolver: zodResolver(adminRegisterSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirm_password: "",
      admin_role: "admin",
      phone: "",
      department: "",
      designation: "",
      secret_key: ""
    }
  });

  // Watch form values
  const watchPassword = watch("password");

  // Password strength calculation
  const passwordStrength = useMemo(() => 
    calculatePasswordStrength(watchPassword || ""), 
    [watchPassword]
  );

  // Initialize theme
  useEffect(() => {
    if (!theme) setTheme('light');
  }, [theme, setTheme]);

  // Handle form submission
  const onSubmit: SubmitHandler<AdminRegisterFormData> = async (data) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/admin-auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          full_name: data.full_name,
          email: data.email,
          password: data.password,
          admin_role: data.admin_role,
          phone: data.phone,
          department: data.department,
          designation: data.designation,
          secret_key: data.secret_key
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      showToast.success("Admin registration successful! You can now login.", { duration: 4000 });
      
      setTimeout(() => {
        router.push("/admin-secure-login");
      }, 2000);

    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.message || 'Registration failed. Please try again.';
      setApiError(errorMessage);
      showToast.error(errorMessage, { duration: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3">
      <div className="w-full max-w-4xl relative">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-16 h-16 bg-primary-300/30 dark:bg-primary-600/20 rounded-full blur-lg hidden sm:block"></div>
        <div className="absolute -bottom-10 -right-10 w-16 h-16 bg-indigo-300/30 dark:bg-indigo-600/20 rounded-full blur-lg hidden sm:block"></div>

        {/* Card container */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          <div className="p-4 md:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <Link href="/" className="inline-block mb-3">
                <Image 
                  src={theme === 'dark' ? logo1 : logo2} 
                  alt="Medh Logo" 
                  width={90} 
                  height={30} 
                  className="mx-auto"
                  priority
                />
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                Admin Registration
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Create your secure admin account to access the dashboard
              </p>
            </div>

            {/* API Error Display */}
            {apiError && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-sm text-red-700 dark:text-red-400">{apiError}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <Controller
                  name="full_name"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <div className="relative">
                        <input
                          {...field}
                          type="text"
                          placeholder="Enter your full name"
                          className={`w-full h-12 px-4 pl-10 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border ${
                            errors.full_name 
                              ? 'border-red-300 dark:border-red-800 ring-red-400/30' 
                              : 'border-gray-200 dark:border-gray-600'
                          } focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all duration-200 outline-none text-sm`}
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.full_name && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.full_name.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* Email */}
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <div className="relative">
                        <input
                          {...field}
                          type="email"
                          placeholder="Enter your admin email"
                          className={`w-full h-12 px-4 pl-10 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border ${
                            errors.email 
                              ? 'border-red-300 dark:border-red-800 ring-red-400/30' 
                              : 'border-gray-200 dark:border-gray-600'
                          } focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all duration-200 outline-none text-sm`}
                        />
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Admin Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Admin Role */}
                <Controller
                  name="admin_role"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <div className="relative">
                        <select
                          {...field}
                          className={`w-full h-12 px-4 pl-10 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border ${
                            errors.admin_role 
                              ? 'border-red-300 dark:border-red-800 ring-red-400/30' 
                              : 'border-gray-200 dark:border-gray-600'
                          } focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all duration-200 outline-none appearance-none text-sm ${
                            !field.value ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          <option value="" disabled>Select admin role</option>
                          <option value="super-admin">Super Admin</option>
                          <option value="admin">Admin</option>
                          <option value="moderator">Moderator</option>
                          <option value="content_manager" disabled>Content Manager</option>
                        </select>
                        <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.admin_role && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.admin_role.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* Phone */}
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <div className="relative">
                        <input
                          {...field}
                          type="tel"
                          placeholder="Enter your phone number (optional)"
                          className="w-full h-12 px-4 pl-10 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all duration-200 outline-none text-sm"
                        />
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  )}
                />
              </div>

              {/* Optional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Department */}
                <Controller
                  name="department"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <div className="relative">
                        <input
                          {...field}
                          type="text"
                          placeholder="Department (optional)"
                          className="w-full h-12 px-4 pl-10 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all duration-200 outline-none text-sm"
                        />
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  )}
                />

                {/* Designation */}
                <Controller
                  name="designation"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <div className="relative">
                        <input
                          {...field}
                          type="text"
                          placeholder="Designation (optional)"
                          className="w-full h-12 px-4 pl-10 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all duration-200 outline-none text-sm"
                        />
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  )}
                />
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password */}
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <div className="relative">
                        <input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          className="w-full h-12 px-4 pl-10 pr-10 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all duration-200 outline-none text-sm"
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                      
                      {/* Password Strength Indicator */}
                      {watchPassword && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600 dark:text-gray-400">Strength:</span>
                            <span className={`text-xs font-medium ${
                              passwordStrength.color === "red" ? 'text-red-500' : 
                              passwordStrength.color === "yellow" ? 'text-yellow-500' : 
                              passwordStrength.color === "blue" ? 'text-blue-500' :
                              passwordStrength.color === "green" ? 'text-green-500' : 'text-gray-400'
                            }`}>
                              {passwordStrength.message}
                            </span>
                          </div>
                          <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                passwordStrength.color === "red" ? 'bg-red-500' : 
                                passwordStrength.color === "yellow" ? 'bg-yellow-500' : 
                                passwordStrength.color === "blue" ? 'bg-blue-500' :
                                passwordStrength.color === "green" ? 'bg-green-500' : 'bg-gray-400'
                              }`} 
                              style={{ width: `${Math.min(100, (passwordStrength.score / 6) * 100)}%` }}
                            />
                          </div>
                          {passwordStrength.suggestions.length > 0 && (
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              Tip: {passwordStrength.suggestions[0]}
                            </p>
                          )}
                        </div>
                      )}
                      
                      {errors.password && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* Confirm Password */}
                <Controller
                  name="confirm_password"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <div className="relative">
                        <input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="w-full h-12 px-4 pl-10 pr-10 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all duration-200 outline-none text-sm"
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                      {errors.confirm_password && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.confirm_password.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Secret Key */}
              <Controller
                name="secret_key"
                control={control}
                render={({ field }) => (
                  <div>
                    <div className="relative">
                      <input
                        {...field}
                        type="password"
                        placeholder="Enter admin secret key"
                        className={`w-full h-12 px-4 pl-10 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border ${
                          errors.secret_key 
                            ? 'border-red-300 dark:border-red-800 ring-red-400/30' 
                            : 'border-gray-200 dark:border-gray-600'
                        } focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all duration-200 outline-none text-sm`}
                      />
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    {errors.secret_key && (
                      <p className="mt-1 text-xs text-red-500 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.secret_key.message}
                      </p>
                    )}
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex items-start">
                        <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-xs text-blue-700 dark:text-blue-400 font-medium mb-1">
                            🔐 What is the Secret Key?
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-300 leading-relaxed">
                            The secret key is a special security code that ensures only authorized personnel can create admin accounts. This key is provided by the system administrator and helps protect against unauthorized admin registrations.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              />

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:max-w-xs md:mx-auto md:block py-3 px-6 bg-gradient-to-r from-primary-500 to-indigo-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Admin Account...
                      </>
                    ) : (
                      <>
                        Create Admin Account
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </button>
              </div>

              {/* Login Link */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an admin account?{" "}
                  <Link
                    href="/admin-secure-login"
                    className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-4 text-xs text-gray-400 dark:text-gray-500 space-y-1">
          <p>Copyright © {currentYear} MEDH Foundation. All Rights Reserved.</p>
          <p className="text-blue-600 dark:text-blue-400 font-semibold">
            SECURE ADMIN PORTAL
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegisterForm;