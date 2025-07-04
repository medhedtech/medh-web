"use client";

import React, { useState, useEffect } from "react";
import CourseCard from "@/components/sections/courses/CourseCard";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowUpRight, 
  Loader2, 
  Save, 
  Undo, 
  Download, 
  Clock, 
  Users, 
  Play,
  Layers,
  Check
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { CourseCardSettingsProvider, useCourseCardSettings } from '@/contexts/CourseCardSettingsContext';
import HomeCourseSection from '@/components/sections/courses/HomeCourseSection';
import { courseAPI, ICourse } from '@/apis';

interface ICourseCardEditorProps {}

const CourseCardEditorMain: React.FC<ICourseCardEditorProps> = () => (
  <CourseCardSettingsProvider>
    <EditorContent />
  </CourseCardSettingsProvider>
);

const EditorContent: React.FC = () => {
  const { settings, setSettings, saveSettings, loading } = useCourseCardSettings();
  const [activeTab, setActiveTab] = useState("content");
  const [isSaving, setIsSaving] = useState(false);

  // Add course fetching state and handlers
  const [allCourses, setAllCourses] = useState<ICourse[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const formatCourseGrade = (grade: string): string => {
    if (grade === "UG - Graduate - Professionals") {
      return "Professional Grad Diploma";
    }
    return grade;
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseAPI.getAllCourses();
        if (res.data?.courses) {
          setAllCourses(res.data.courses);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const toggleCourseSelection = (type: 'live' | 'blended', courseId: string, selected: boolean) => {
    if (type === 'live') {
      const updated = selected
        ? [...settings.selectedLiveCourseIds, courseId]
        : settings.selectedLiveCourseIds.filter(id => id !== courseId);
      setSettings({ ...settings, selectedLiveCourseIds: updated });
    } else {
      const updated = selected
        ? [...settings.selectedBlendedCourseIds, courseId]
        : settings.selectedBlendedCourseIds.filter(id => id !== courseId);
      setSettings({ ...settings, selectedBlendedCourseIds: updated });
    }
  };

  const updateCardConfig = (field: string, value: any) => {
    setSettings({
      ...settings,
      cardConfig: { ...settings.cardConfig, [field]: value }
    });
  };

  const updateTextCustomization = (field: string, value: any) => {
    setSettings({
      ...settings,
      textCustomization: { ...settings.textCustomization, [field]: value }
    });
  };

  const updatePreviewConfig = (field: string, value: any) => {
    setSettings({
      ...settings,
      previewConfig: { ...settings.previewConfig, [field]: value }
    });
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    await saveSettings();
    toast({ title: 'Settings saved', description: 'Saved to backend.', variant: 'default' });
    setIsSaving(false);
  };

  const handleResetChanges = () => {
    // reset to defaults loaded from context provider
    // optionally you can re-fetch defaults
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Course Card Admin Panel</h1>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="content">Course Selection</TabsTrigger>
          <TabsTrigger value="design">Design Settings</TabsTrigger>
          <TabsTrigger value="text">Text Labels</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="content">
          {coursesLoading ? (
            <div>Loading courses...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Live Courses</h3>
                <ul className="space-y-2 max-h-64 overflow-y-auto">
                  {allCourses.filter(c => c.class_type === 'Live').map(c => (
                    <li key={c._id} className="flex items-center space-x-2">
                      <Switch
                        id={`live-${c._id}`}
                        checked={settings.selectedLiveCourseIds.includes(c._id)}
                        onCheckedChange={checked => toggleCourseSelection('live', c._id, Boolean(checked))}
                      />
                      <Label htmlFor={`live-${c._id}`}>{c.title}</Label>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Blended Courses</h3>
                <ul className="space-y-2 max-h-64 overflow-y-auto">
                  {allCourses.filter(c => c.class_type === 'Blended').map(c => (
                    <li key={c._id} className="flex items-center space-x-2">
                      <Switch
                        id={`blended-${c._id}`}
                        checked={settings.selectedBlendedCourseIds.includes(c._id)}
                        onCheckedChange={checked => toggleCourseSelection('blended', c._id, Boolean(checked))}
                      />
                      <Label htmlFor={`blended-${c._id}`}>{c.title}</Label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="design">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Design Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bgColor">Background Color</Label>
                <Input
                  type="color"
                  id="bgColor"
                  value={settings.cardConfig.bgColor || '#ffffff'}
                  onChange={e => updateCardConfig('bgColor', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="borderRadius">Border Radius (px)</Label>
                <Input
                  type="number"
                  id="borderRadius"
                  min={0}
                  value={settings.cardConfig.borderRadius ?? 0}
                  onChange={e => updateCardConfig('borderRadius', parseInt(e.target.value, 10))}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="boxShadow">Box Shadow</Label>
                <Input
                  id="boxShadow"
                  placeholder="e.g. 0 4px 6px rgba(0,0,0,0.1)"
                  value={settings.cardConfig.boxShadow || ''}
                  onChange={e => updateCardConfig('boxShadow', e.target.value)}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Visibility Toggles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showImage"
                    checked={settings.cardConfig.showImage ?? true}
                    onCheckedChange={val => updateCardConfig('showImage', Boolean(val))}
                  />
                  <Label htmlFor="showImage">Show Image</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showCategoryBadge"
                    checked={settings.cardConfig.showCategoryBadge ?? true}
                    onCheckedChange={val => updateCardConfig('showCategoryBadge', Boolean(val))}
                  />
                  <Label htmlFor="showCategoryBadge">Show Category Badge</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showTitle"
                    checked={settings.cardConfig.showTitle ?? true}
                    onCheckedChange={val => updateCardConfig('showTitle', Boolean(val))}
                  />
                  <Label htmlFor="showTitle">Show Title</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showDescription"
                    checked={settings.cardConfig.showDescription ?? true}
                    onCheckedChange={val => updateCardConfig('showDescription', Boolean(val))}
                  />
                  <Label htmlFor="showDescription">Show Description</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showSessionCount"
                    checked={settings.cardConfig.showSessionCount ?? true}
                    onCheckedChange={val => updateCardConfig('showSessionCount', Boolean(val))}
                  />
                  <Label htmlFor="showSessionCount">Show Session Count</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showDuration"
                    checked={settings.cardConfig.showDuration ?? true}
                    onCheckedChange={val => updateCardConfig('showDuration', Boolean(val))}
                  />
                  <Label htmlFor="showDuration">Show Duration</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showPrice"
                    checked={settings.cardConfig.showPrice ?? true}
                    onCheckedChange={val => updateCardConfig('showPrice', Boolean(val))}
                  />
                  <Label htmlFor="showPrice">Show Price</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showFeatures"
                    checked={settings.cardConfig.showFeatures ?? true}
                    onCheckedChange={val => updateCardConfig('showFeatures', Boolean(val))}
                  />
                  <Label htmlFor="showFeatures">Show Features</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showBrochureButton"
                    checked={settings.cardConfig.showBrochureButton ?? true}
                    onCheckedChange={val => updateCardConfig('showBrochureButton', Boolean(val))}
                  />
                  <Label htmlFor="showBrochureButton">Show Brochure Button</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showExploreButton"
                    checked={settings.cardConfig.showExploreButton ?? true}
                    onCheckedChange={val => updateCardConfig('showExploreButton', Boolean(val))}
                  />
                  <Label htmlFor="showExploreButton">Show Explore Button</Label>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="text">
          {/* reuse text label inputs, binding to settings.textCustomization */}
        </TabsContent>
        <TabsContent value="preview">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Live Preview</h2>
            <HomeCourseSection showOnlyLive={true} />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Blended Preview</h2>
            <HomeCourseSection showOnlyLive={false} />
          </div>
        </TabsContent>
      </Tabs>
      {/* Real-Time Preview */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Real-Time Preview</h2>
        {(() => {
          const previewId = settings.selectedLiveCourseIds[0] ?? settings.selectedBlendedCourseIds[0];
          const previewCourse = allCourses.find(c => c._id === previewId);
          if (!previewCourse) return <div className="text-gray-500">Select a course to preview</div>;
          return (
            <div
              className="max-w-sm mx-auto bg-white"
              style={{
                backgroundColor: settings.cardConfig.bgColor ?? '#ffffff',
                borderRadius: `${settings.cardConfig.borderRadius ?? 0}px`,
                boxShadow: settings.cardConfig.boxShadow ?? 'none'
              }}
            >
              {(settings.cardConfig.showImage ?? true) && previewCourse.course_image && (
                <img
                  src={previewCourse.course_image}
                  alt={previewCourse.title}
                  className="w-full h-40 object-cover rounded-t-md"
                />
              )}
              <div className="p-4">
                {(settings.cardConfig.showCategoryBadge ?? true) && previewCourse.course_grade && (
                  <span className="text-xs font-medium uppercase text-gray-600">
                    {formatCourseGrade(previewCourse.course_grade)}
                  </span>
                )}
                {(settings.cardConfig.showTitle ?? true) && (
                  <h3 className="text-lg font-bold mt-1">{previewCourse.title}</h3>
                )}
                {(settings.cardConfig.showDescription ?? true) && previewCourse.description && (
                  <p className="text-sm text-gray-700 mt-2">{previewCourse.description}</p>
                )}
                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  {(settings.cardConfig.showSessionCount ?? true) && previewCourse.no_of_sessions != null && (
                    <div>Sessions: {previewCourse.no_of_sessions}</div>
                  )}
                  {(settings.cardConfig.showDuration ?? true) && previewCourse.course_duration != null && (
                    <div>Duration: {previewCourse.course_duration}</div>
                  )}
                  {(settings.cardConfig.showPrice ?? true) && previewCourse.course_fee != null && (
                    <div className="text-base font-semibold">{previewCourse.course_fee}</div>
                  )}
                </div>
                {((settings.cardConfig.showFeatures ?? true) && previewCourse.features?.length) ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {previewCourse.features.map((feat: string, idx: number) => (
                      <li key={idx} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                        {feat}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="mt-4 flex space-x-2">
                  {(settings.cardConfig.showBrochureButton ?? true) && (
                    <button className="px-3 py-1 border text-sm rounded">Brochure</button>
                  )}
                  {(settings.cardConfig.showExploreButton ?? true) && (
                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded">Explore</button>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </div>
      <div className="flex justify-end mt-4 space-x-2">
        <Button variant="outline" onClick={handleResetChanges}>Reset</Button>
        <Button onClick={handleSaveChanges} disabled={isSaving || loading}>
          {isSaving ? <Loader2 className="animate-spin" /> : 'Save'}
        </Button>
      </div>
    </div>
  );
};

export default CourseCardEditorMain; 