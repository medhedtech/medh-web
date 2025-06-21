"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, ShieldCheck, Mail, Bell, User, Camera } from "lucide-react";
import MFAManagement from "@/components/shared/security/MFAManagement";

export default function ProfileSettingsPage() {
  // Mock state
  const [name, setName] = useState("Jane Smith");
  const [email, setEmail] = useState("jane.smith@example.com");
  const [profileImage, setProfileImage] = useState("https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80");
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Profile Info */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <img src={profileImage} alt={name} className="w-20 h-20 rounded-full border-2 border-white shadow object-cover" />
                <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-white hover:bg-primary/90 border-2 border-white shadow" title="Change profile photo">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1">
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <Input value={name} onChange={e => setName(e.target.value)} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input value={email} onChange={e => setEmail(e.target.value)} className="w-full" />
                </div>
              </div>
            </div>
            <Button className="mt-2" onClick={() => showToast.success("Profile updated!")}>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-semibold">Push Notifications</p>
                    <p className="text-sm text-gray-500">Receive push notifications</p>
                  </div>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-semibold">Email Updates</p>
                    <p className="text-sm text-gray-500">Receive email notifications</p>
                  </div>
                </div>
                <Switch checked={emailUpdates} onCheckedChange={setEmailUpdates} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Multi-Factor Authentication */}
        <Card>
          <CardHeader>
            <CardTitle>Account Security</CardTitle>
          </CardHeader>
          <CardContent>
            <MFAManagement 
              onStatusChange={(enabled) => {
                setMfaEnabled(enabled);
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 