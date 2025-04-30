import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of our settings
export interface CourseCardSettings {
  selectedLiveCourseIds: string[];
  selectedBlendedCourseIds: string[];
  cardConfig: Record<string, any>;
  textCustomization: Record<string, any>;
  previewConfig: Record<string, any>;
}

// Default settings loaded initially
const defaultSettings: CourseCardSettings = {
  selectedLiveCourseIds: [],
  selectedBlendedCourseIds: [],
  cardConfig: {},
  textCustomization: {},
  previewConfig: {}
};

interface SettingsContextValue {
  settings: CourseCardSettings;
  setSettings: (s: CourseCardSettings) => void;
  saveSettings: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: defaultSettings,
  setSettings: () => {},
  saveSettings: async () => {},
  loading: false,
  error: null
});

export const CourseCardSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<CourseCardSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings on mount
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/course-card-settings');
        const json = await res.json();
        if (json.settings) {
          setSettings(json.settings);
        }
      } catch (err: any) {
        console.error('Failed to load course card settings:', err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Save current settings to API
  const saveSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/course-card-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });
      if (!res.ok) throw new Error('Save failed');
    } catch (err: any) {
      console.error('Failed to save course card settings:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, setSettings, saveSettings, loading, error }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useCourseCardSettings = () => useContext(SettingsContext); 