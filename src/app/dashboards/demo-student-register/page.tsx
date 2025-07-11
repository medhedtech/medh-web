"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { buildAdvancedComponent } from "@/utils/designSystem";
import { showToast } from "@/utils/toast";
import { createDemoStudent } from "@/apis/demo-student.api";
import { User, Mail, Phone, Loader2, UserPlus } from "lucide-react";

// Simple form data interface matching the request body
interface SimpleFormData {
  full_name: string;
  email: string;
  username?: string;
  phone_numbers?: Array<{
    country: string;
    number: string;
  }>;
  gender?: "male" | "female" | "non-binary" | "prefer-not-to-say" | "other";
  referral_source?: string;
}

const DemoStudentRegisterPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SimpleFormData>({
    full_name: "",
    email: "",
    username: "",
    phone_numbers: [{ country: "+91", number: "" }],
    gender: undefined,
    referral_source: "demo"
  });

  const handleInputChange = (field: keyof SimpleFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhoneChange = (field: 'country' | 'number', value: string) => {
    setFormData(prev => ({
      ...prev,
      phone_numbers: [{
        ...prev.phone_numbers![0],
        [field]: value
      }]
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.full_name.trim()) {
      showToast("Please enter your full name", "error");
      return false;
    }
    
    if (!formData.email.trim()) {
      showToast("Please enter your email address", "error");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast("Please enter a valid email address", "error");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Clean up the data before sending
      const submitData: any = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        referral_source: formData.referral_source || "demo"
      };

      // Add optional fields only if they have values
      if (formData.username?.trim()) {
        submitData.username = formData.username.trim();
      }

      if (formData.gender) {
        submitData.gender = formData.gender;
      }

      if (formData.phone_numbers?.[0]?.number?.trim()) {
        submitData.phone_numbers = [{
          country: formData.phone_numbers[0].country,
          number: formData.phone_numbers[0].number.trim()
        }];
      }

      const response = await createDemoStudent(submitData);
      
      if (response.success) {
        showToast("Demo student registered successfully!", "success");
        
        // Redirect to success page with the student ID
        const studentId = response.data?._id || 'success';
        router.push(`/dashboards/demo-student-success?id=${studentId}`);
      } else {
        showToast(response.message || "Registration failed", "error");
      }
    } catch (error) {
      console.error("Registration error:", error);
      showToast("Failed to register. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className={buildAdvancedComponent.glassCard({ variant: 'hero' })}>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Demo Student Registration
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Quick registration for demo class access
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="mt-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-sm font-medium">
                  Full Name *
                </Label>
                <Input
                  id="full_name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              {/* Username (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username <span className="text-slate-500">(Optional)</span>
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Phone Number (Optional) */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Phone Number <span className="text-slate-500">(Optional)</span>
                </Label>
                <div className="flex gap-2">
                  <Select
                    value={formData.phone_numbers?.[0]?.country || "+91"}
                    onValueChange={(value) => handlePhoneChange('country', value)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+91">🇮🇳 +91</SelectItem>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                      <SelectItem value="+44">🇬🇧 +44</SelectItem>
                      <SelectItem value="+61">🇦🇺 +61</SelectItem>
                      <SelectItem value="+971">🇦🇪 +971</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phone_numbers?.[0]?.number || ""}
                    onChange={(e) => handlePhoneChange('number', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Gender (Optional) */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Gender <span className="text-slate-500">(Optional)</span>
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange('gender', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Referral Source */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  How did you hear about us? <span className="text-slate-500">(Optional)</span>
                </Label>
                <Select
                  value={formData.referral_source}
                  onValueChange={(value) => handleInputChange('referral_source', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select referral source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="demo">Demo Request</SelectItem>
                    <SelectItem value="google">Google Search</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="friend">Friend/Family</SelectItem>
                    <SelectItem value="advertisement">Advertisement</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 mr-2" />
                      Register for Demo
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            * Required fields. We'll contact you within 24 hours to schedule your demo session.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DemoStudentRegisterPage; 