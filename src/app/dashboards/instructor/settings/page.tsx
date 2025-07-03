"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { instructorApi } from "@/apis/instructor.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buildAdvancedComponent, typography, buildComponent } from "@/utils/designSystem";
import {
  AlertCircle,
  Settings as SettingsIcon,
  Palette,
  Globe,
  Bell,
  Save,
  Lock,
  User,
} from "lucide-react";
import { showToast } from "@/utils/toast";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface InstructorSettings {
  theme: 'light' | 'dark';
  language: 'en' | 'es' | 'fr';
  notifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  profileVisibility: 'public' | 'private';
}

const SettingsPage = () => {
  const [settings, setSettings] = useState<InstructorSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Assuming instructorApi.getInstructorSettings returns InstructorSettings
      // For now, mocking data.
      const mockData: InstructorSettings = {
        theme: 'light',
        language: 'en',
        notifications: true,
        emailNotifications: true,
        smsNotifications: false,
        profileVisibility: 'public',
      };
      setSettings(mockData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      showToast.error("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSettingChange = (key: keyof InstructorSettings, value: any) => {
    setSettings(prev => prev ? { ...prev, [key]: value } : null);
  };

  const handleSaveChanges = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!settings) return;

    setIsSaving(true);
    setError(null);
    try {
      // Assuming instructorApi.updateInstructorSettings exists
      // await instructorApi.updateInstructorSettings(settings);
      showToast.success("Settings saved successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      showToast.error("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  }, [settings]);

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <Skeleton className="h-48 w-full mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-16">
          <SettingsIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No settings found</h3>
          <p className="mt-1 text-sm text-gray-500">Could not load instructor settings.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="p-4 md:p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={buildAdvancedComponent.headerCard()}>
        <h1 className={typography.h1}>Instructor Settings</h1>
        <p className={typography.lead}>
          Manage your personal preferences and account settings.
        </p>
      </div>

      <motion.div variants={itemVariants}>
        <Card className={buildComponent.card('elegant')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="mr-2 h-5 w-5" /> General Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveChanges} className="space-y-6">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={settings.theme}
                  onValueChange={(value: 'light' | 'dark') => handleSettingChange('theme', value)}
                  disabled={isSaving}
                >
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center">
                        <Palette className="mr-2 h-4 w-4" /> Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center">
                        <Palette className="mr-2 h-4 w-4" /> Dark
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="language">Language</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value: 'en' | 'es' | 'fr') => handleSettingChange('language', value)}
                  disabled={isSaving}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">
                      <div className="flex items-center">
                        <Globe className="mr-2 h-4 w-4" /> English
                      </div>
                    </SelectItem>
                    <SelectItem value="es">
                      <div className="flex items-center">
                        <Globe className="mr-2 h-4 w-4" /> Spanish
                      </div>
                    </SelectItem>
                    <SelectItem value="fr">
                      <div className="flex items-center">
                        <Globe className="mr-2 h-4 w-4" /> French
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="flex items-center">
                  <Bell className="mr-2 h-4 w-4" /> Enable Notifications
                </Label>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                  disabled={isSaving}
                />
              </div>

              <div className="flex items-center justify-between ml-6">
                <Label htmlFor="emailNotifications" className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  Email Notifications
                </Label>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  disabled={isSaving || !settings.notifications}
                />
              </div>

              <div className="flex items-center justify-between ml-6">
                <Label htmlFor="smsNotifications" className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  SMS Notifications
                </Label>
                <Switch
                  id="smsNotifications"
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                  disabled={isSaving || !settings.notifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="profileVisibility" className="flex items-center">
                  <User className="mr-2 h-4 w-4" /> Profile Visibility
                </Label>
                <Select
                  value={settings.profileVisibility}
                  onValueChange={(value: 'public' | 'private') => handleSettingChange('profileVisibility', value)}
                  disabled={isSaving}
                >
                  <SelectTrigger id="profileVisibility" className="w-[120px]">
                    <SelectValue placeholder="Visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
              </Button>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default SettingsPage;
