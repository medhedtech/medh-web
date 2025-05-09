"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Loader2, 
  Save, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  LayoutGrid, 
  Eye, 
  EyeOff, 
  Palette, 
  Type, 
  Settings,
  Info,
  CheckCircle,
  Video,
  AlertCircle,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { courseAPI } from '@/apis';
import { CourseCardSettingsProvider, useCourseCardSettings } from '@/contexts/CourseCardSettingsContext';
import HomeCourseSection from '@/components/sections/courses/HomeCourseSection';

// Interface for Course data
interface ICourse {
  _id: string;
  course_title: string;
  course_description?: string;
  course_image?: string;
  course_category?: string;
  classType?: string;
  class_type?: string;
  show_in_home?: boolean;
}

// Main component that wraps the editor with the CourseCardSettingsProvider
export default function HomeEditorPage() {
  return (
    <CourseCardSettingsProvider>
      <HomeEditorContent />
    </CourseCardSettingsProvider>
  );
}

// The actual editor content component
function HomeEditorContent() {
  const { settings, setSettings, saveSettings, loading } = useCourseCardSettings();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [homeCourses, setHomeCourses] = useState<ICourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("live");
  const [showPreview, setShowPreview] = useState(true);
  const [activeSettingsTab, setActiveSettingsTab] = useState("content");
  const [previewType, setPreviewType] = useState("all");

  // Fetch all courses and home courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all courses
        const allCoursesResponse = await courseAPI.getAllCourses();
        
        // Fetch home courses
        const homeCoursesResponse = await fetch(courseAPI.getHomeCourses());
        const homeCoursesData = await homeCoursesResponse.json();
        
        if (allCoursesResponse.data?.courses) {
          // Cast the API response to our ICourse interface
          const mappedCourses = allCoursesResponse.data.courses.map((course: any) => ({
            _id: course._id || '',
            course_title: course.course_title || course.title || '',
            course_description: course.course_description || course.description,
            course_image: course.course_image || course.thumbnail,
            course_category: course.course_category || course.category,
            classType: course.classType || course.class_type,
            class_type: course.class_type,
            show_in_home: homeCoursesData.courses.some((homeCourse: any) => homeCourse._id === course._id)
          }));
          setCourses(mappedCourses);
          setHomeCourses(homeCoursesData.courses);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast({
          title: "Error",
          description: "Failed to load courses. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses by type (live or blended)
  const liveCourses = courses.filter(course => 
    (course.classType === 'live' || course.class_type === 'live')
  );
  
  const blendedCourses = courses.filter(course => 
    (course.classType === 'blended' || course.class_type === 'blended')
  );

  // Handle toggling course visibility on home page
  const handleToggleHomeVisibility = async (courseId: string) => {
    try {
      setIsSaving(true);
      
      // Call the toggle API
      const response = await fetch(courseAPI.toggleShowInHome(courseId), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to toggle course visibility');

      // Update local state
      setCourses(prevCourses => prevCourses.map(course => 
        course._id === courseId 
          ? { ...course, show_in_home: !course.show_in_home }
          : course
      ));

      toast({
        title: "Success",
        description: "Course visibility updated successfully!",
        variant: "default"
      });
    } catch (error) {
      console.error("Error toggling course visibility:", error);
      toast({
        title: "Error",
        description: "Failed to update course visibility. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle course selection change
  const handleCourseSelection = async (type: 'live' | 'blended', index: number, courseId: string) => {
    if (courseId === 'none') {
      removeCourse(type, index);
      return;
    }

    try {
      // Toggle the course's home visibility
      await handleToggleHomeVisibility(courseId);
      
      // Update the selection in settings
      if (type === 'live') {
        const newSelection = [...settings.selectedLiveCourseIds];
        newSelection[index] = courseId;
        setSettings({
          ...settings,
          selectedLiveCourseIds: newSelection
        });
      } else {
        const newSelection = [...settings.selectedBlendedCourseIds];
        newSelection[index] = courseId;
        setSettings({
          ...settings,
          selectedBlendedCourseIds: newSelection
        });
      }
    } catch (error) {
      console.error("Error selecting course:", error);
      toast({
        title: "Error",
        description: "Failed to update course selection. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle saving the selected courses
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSettings();
      toast({
        title: "Success",
        description: "Home page course selections saved successfully!",
        variant: "default"
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Move course up in the order
  const moveCourseUp = (type: 'live' | 'blended', index: number) => {
    if (index <= 0) return;
    
    if (type === 'live') {
      const newSelection = [...settings.selectedLiveCourseIds];
      [newSelection[index], newSelection[index - 1]] = [newSelection[index - 1], newSelection[index]];
      setSettings({
        ...settings,
        selectedLiveCourseIds: newSelection
      });
    } else {
      const newSelection = [...settings.selectedBlendedCourseIds];
      [newSelection[index], newSelection[index - 1]] = [newSelection[index - 1], newSelection[index]];
      setSettings({
        ...settings,
        selectedBlendedCourseIds: newSelection
      });
    }
  };

  // Move course down in the order
  const moveCourseDown = (type: 'live' | 'blended', index: number, maxIndex: number) => {
    if (index >= maxIndex - 1) return;
    
    if (type === 'live') {
      const newSelection = [...settings.selectedLiveCourseIds];
      [newSelection[index], newSelection[index + 1]] = [newSelection[index + 1], newSelection[index]];
      setSettings({
        ...settings,
        selectedLiveCourseIds: newSelection
      });
    } else {
      const newSelection = [...settings.selectedBlendedCourseIds];
      [newSelection[index], newSelection[index + 1]] = [newSelection[index + 1], newSelection[index]];
      setSettings({
        ...settings,
        selectedBlendedCourseIds: newSelection
      });
    }
  };

  // Remove course from selection
  const removeCourse = (type: 'live' | 'blended', index: number) => {
    if (type === 'live') {
      const newSelection = [...settings.selectedLiveCourseIds];
      newSelection[index] = '';
      setSettings({
        ...settings,
        selectedLiveCourseIds: newSelection
      });
    } else {
      const newSelection = [...settings.selectedBlendedCourseIds];
      newSelection[index] = '';
      setSettings({
        ...settings,
        selectedBlendedCourseIds: newSelection
      });
    }
  };

  // Update card display settings
  const updateCardConfig = (field: string, value: any) => {
    setSettings({
      ...settings,
      cardConfig: { ...settings.cardConfig, [field]: value }
    });
  };

  // Update text customization
  const updateTextCustomization = (field: string, value: any) => {
    setSettings({
      ...settings,
      textCustomization: { ...settings.textCustomization, [field]: value }
    });
  };

  // Create arrays of selection slots
  const liveSelectionSlots = Array(4).fill(null).map((_, i) => 
    settings.selectedLiveCourseIds[i] || 'none'
  );
  
  const blendedSelectionSlots = Array(8).fill(null).map((_, i) => 
    settings.selectedBlendedCourseIds[i] || 'none'
  );

  // Find course details by ID
  const getCourseById = (id: string): ICourse | undefined => {
    return courses.find(course => course._id === id);
  };

  // Update the course selection UI to show home status
  const renderCourseOption = (course: ICourse) => (
    <SelectItem key={course._id} value={course._id} className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span>{course.course_title}</span>
        {course.show_in_home && (
          <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
            On Home
          </span>
        )}
      </div>
    </SelectItem>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 rounded-xl shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center">
            <LayoutGrid className="h-7 w-7 mr-3 text-primary" />
            Home Page Editor
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-lg">
            Customize which courses appear on the home page and how they're displayed to visitors
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
            <Switch
              id="preview-toggle"
              checked={showPreview}
              onCheckedChange={setShowPreview}
              className="data-[state=checked]:bg-primary"
            />
            <Label htmlFor="preview-toggle" className="cursor-pointer">
              {showPreview ? (
                <span className="flex items-center gap-1 text-primary font-medium">
                  <Eye className="h-4 w-4" /> Preview Enabled
                </span>
              ) : (
                <span className="flex items-center gap-1 text-gray-500">
                  <EyeOff className="h-4 w-4" /> Preview Disabled
                </span>
              )}
            </Label>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || loading}
            className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-6 py-2 rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading courses...</span>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-center max-w-md">
            Please wait while we fetch the latest courses for customization
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
                <CardTitle className="flex items-center text-xl">
                  <LayoutGrid className="h-5 w-5 mr-2 text-primary" />
                  Course Selection
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Choose which courses to display in each section of the home page
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="px-6 pt-6">
                    <TabsList className="mb-6 grid grid-cols-2 w-full bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                      <TabsTrigger 
                        value="live" 
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md transition-all"
                      >
                        Live Courses (4)
                      </TabsTrigger>
                      <TabsTrigger 
                        value="blended" 
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md transition-all"
                      >
                        Blended Courses (8)
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="live" className="p-6 pt-0">
                    <div className="space-y-6">
                      {liveSelectionSlots.map((selectedId, index) => {
                        const selectedCourse = getCourseById(selectedId);
                        
                        return (
                          <div key={`live-${index}`} className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="font-medium text-gray-800 dark:text-white flex items-center">
                                <span className="bg-primary/10 text-primary w-7 h-7 rounded-full flex items-center justify-center mr-2 font-semibold">{index + 1}</span>
                                Live Course Slot {index + 1}
                              </h3>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-lg border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary transition-colors"
                                  onClick={() => moveCourseUp('live', index)}
                                  disabled={index === 0}
                                >
                                  <MoveUp className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-lg border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary transition-colors"
                                  onClick={() => moveCourseDown('live', index, liveSelectionSlots.length)}
                                  disabled={index === liveSelectionSlots.length - 1}
                                >
                                  <MoveDown className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-lg border-gray-200 dark:border-gray-700 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                  onClick={() => removeCourse('live', index)}
                                  disabled={!selectedId || selectedId === 'none'}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <Select
                              value={selectedId}
                              onValueChange={(value) => handleCourseSelection('live', index, value)}
                            >
                              <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg">
                                <SelectValue placeholder="Select a course" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[300px]">
                                <SelectItem value="none" className="text-gray-500">-- Select a course --</SelectItem>
                                {liveCourses.map(renderCourseOption)}
                              </SelectContent>
                            </Select>
                            
                            {selectedCourse && (
                              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                                <p className="font-medium text-gray-800 dark:text-white">{selectedCourse.course_title}</p>
                                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm line-clamp-2">
                                  {selectedCourse.course_description || "No description available"}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>

                  <TabsContent value="blended" className="p-6 pt-0">
                    <div className="space-y-6">
                      {blendedSelectionSlots.map((selectedId, index) => {
                        const selectedCourse = getCourseById(selectedId);
                        
                        return (
                          <div key={`blended-${index}`} className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="font-medium text-gray-800 dark:text-white flex items-center">
                                <span className="bg-primary/10 text-primary w-7 h-7 rounded-full flex items-center justify-center mr-2 font-semibold">{index + 1}</span>
                                Blended Course Slot {index + 1}
                              </h3>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-lg border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary transition-colors"
                                  onClick={() => moveCourseUp('blended', index)}
                                  disabled={index === 0}
                                >
                                  <MoveUp className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-lg border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary transition-colors"
                                  onClick={() => moveCourseDown('blended', index, blendedSelectionSlots.length)}
                                  disabled={index === blendedSelectionSlots.length - 1}
                                >
                                  <MoveDown className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-lg border-gray-200 dark:border-gray-700 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                  onClick={() => removeCourse('blended', index)}
                                  disabled={!selectedId || selectedId === 'none'}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <Select
                              value={selectedId}
                              onValueChange={(value) => handleCourseSelection('blended', index, value)}
                            >
                              <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg">
                                <SelectValue placeholder="Select a course" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[300px]">
                                <SelectItem value="none" className="text-gray-500">-- Select a course --</SelectItem>
                                {blendedCourses.map(renderCourseOption)}
                              </SelectContent>
                            </Select>
                            
                            {selectedCourse && (
                              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                                <p className="font-medium text-gray-800 dark:text-white">{selectedCourse.course_title}</p>
                                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm line-clamp-2">
                                  {selectedCourse.course_description || "No description available"}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
                <CardTitle className="flex items-center text-xl">
                  <Settings className="h-5 w-5 mr-2 text-primary" />
                  Card Display Settings
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Customize how course cards are displayed on the home page
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue={activeSettingsTab} onValueChange={setActiveSettingsTab} className="w-full">
                  <div className="px-6 pt-6">
                    <TabsList className="mb-6 grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                      <TabsTrigger 
                        value="content" 
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md transition-all"
                      >
                        Content
                      </TabsTrigger>
                      <TabsTrigger 
                        value="style" 
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md transition-all"
                      >
                        Style
                      </TabsTrigger>
                      <TabsTrigger 
                        value="text" 
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md transition-all"
                      >
                        Text
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="content" className="p-6 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
                        <h3 className="font-medium text-gray-800 dark:text-white mb-3">Card Content</h3>
                        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                          <Label htmlFor="showDuration" className="flex-grow font-medium">Show Duration</Label>
                          <Switch
                            id="showDuration"
                            checked={settings.cardConfig.showDuration ?? true}
                            onCheckedChange={(val) => updateCardConfig('showDuration', val)}
                            className="data-[state=checked]:bg-primary"
                          />
                        </div>

                        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                          <Label htmlFor="hidePrice" className="flex-grow font-medium">Hide Price</Label>
                          <Switch
                            id="hidePrice"
                            checked={settings.cardConfig.hidePrice ?? false}
                            onCheckedChange={(val) => updateCardConfig('hidePrice', val)}
                            className="data-[state=checked]:bg-primary"
                          />
                        </div>

                        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                          <Label htmlFor="hideDescription" className="flex-grow font-medium">Hide Description</Label>
                          <Switch
                            id="hideDescription"
                            checked={settings.cardConfig.hideDescription ?? false}
                            onCheckedChange={(val) => updateCardConfig('hideDescription', val)}
                            className="data-[state=checked]:bg-primary"
                          />
                        </div>
                      </div>

                      <div className="space-y-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
                        <h3 className="font-medium text-gray-800 dark:text-white mb-3">Card Buttons</h3>
                        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                          <Label htmlFor="showBrochureButton" className="flex-grow font-medium">Show Brochure Button</Label>
                          <Switch
                            id="showBrochureButton"
                            checked={settings.cardConfig.showBrochureButton ?? true}
                            onCheckedChange={(val) => updateCardConfig('showBrochureButton', val)}
                            className="data-[state=checked]:bg-primary"
                          />
                        </div>

                        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                          <Label htmlFor="showExploreButton" className="flex-grow font-medium">Show Explore Button</Label>
                          <Switch
                            id="showExploreButton"
                            checked={settings.cardConfig.showExploreButton ?? true}
                            onCheckedChange={(val) => updateCardConfig('showExploreButton', val)}
                            className="data-[state=checked]:bg-primary"
                          />
                        </div>

                        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                          <Label htmlFor="showCategoryTag" className="flex-grow font-medium">Show Category Tag</Label>
                          <Switch
                            id="showCategoryTag"
                            checked={settings.cardConfig.showCategoryTag ?? true}
                            onCheckedChange={(val) => updateCardConfig('showCategoryTag', val)}
                            className="data-[state=checked]:bg-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="style" className="p-6 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-5 bg-gray-50 dark:bg-gray-900 p-5 rounded-xl">
                        <h3 className="font-medium text-gray-800 dark:text-white mb-3">Card Appearance</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardBorderRadius" className="font-medium flex items-center justify-between">
                              <span>Border Radius</span>
                              <span className="text-sm text-primary font-bold">{settings.cardConfig.borderRadius ?? 8}px</span>
                            </Label>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                              <Input
                                id="cardBorderRadius"
                                type="range"
                                min="0"
                                max="20"
                                value={settings.cardConfig.borderRadius ?? 8}
                                onChange={(e) => updateCardConfig('borderRadius', parseInt(e.target.value))}
                                className="accent-primary w-full"
                              />
                              <div className="flex justify-between mt-1 text-xs text-gray-500">
                                <span>0px</span>
                                <span>10px</span>
                                <span>20px</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="cardShadow" className="font-medium flex items-center justify-between">
                              <span>Shadow Intensity</span>
                              <span className="text-sm text-primary font-bold">{settings.cardConfig.shadowIntensity ?? 1}</span>
                            </Label>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                              <Input
                                id="cardShadow"
                                type="range"
                                min="0"
                                max="3"
                                step="1"
                                value={settings.cardConfig.shadowIntensity ?? 1}
                                onChange={(e) => updateCardConfig('shadowIntensity', parseInt(e.target.value))}
                                className="accent-primary w-full"
                              />
                              <div className="flex justify-between mt-1 text-xs text-gray-500">
                                <span>None</span>
                                <span>Light</span>
                                <span>Medium</span>
                                <span>Heavy</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-5 bg-gray-50 dark:bg-gray-900 p-5 rounded-xl">
                        <h3 className="font-medium text-gray-800 dark:text-white mb-3">Card Layout</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardImageHeight" className="font-medium flex items-center justify-between">
                              <span>Image Height</span>
                              <span className="text-sm text-primary font-bold">{settings.cardConfig.imageHeight ?? 180}px</span>
                            </Label>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                              <Input
                                id="cardImageHeight"
                                type="range"
                                min="120"
                                max="240"
                                step="10"
                                value={settings.cardConfig.imageHeight ?? 180}
                                onChange={(e) => updateCardConfig('imageHeight', parseInt(e.target.value))}
                                className="accent-primary w-full"
                              />
                              <div className="flex justify-between mt-1 text-xs text-gray-500">
                                <span>120px</span>
                                <span>180px</span>
                                <span>240px</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="cardLayout" className="font-medium">Card Layout Style</Label>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                              <Select
                                value={settings.cardConfig.layout ?? "standard"}
                                onValueChange={(value) => updateCardConfig('layout', value)}
                              >
                                <SelectTrigger id="cardLayout" className="w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                                  <SelectValue placeholder="Select layout" />
                                </SelectTrigger>
                                <SelectContent>
                                  <div className="p-2">
                                    <SelectItem value="standard" className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                                      <div className="flex items-center">
                                        <div className="w-6 h-6 bg-primary/20 rounded-md mr-2 flex items-center justify-center">
                                          <LayoutGrid className="h-4 w-4 text-primary" />
                                        </div>
                                        <span>Standard</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="compact" className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                                      <div className="flex items-center">
                                        <div className="w-6 h-6 bg-primary/20 rounded-md mr-2 flex items-center justify-center">
                                          <LayoutGrid className="h-4 w-4 text-primary" />
                                        </div>
                                        <span>Compact</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="featured" className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                                      <div className="flex items-center">
                                        <div className="w-6 h-6 bg-primary/20 rounded-md mr-2 flex items-center justify-center">
                                          <Sparkles className="h-4 w-4 text-primary" />
                                        </div>
                                        <span>Featured</span>
                                      </div>
                                    </SelectItem>
                                  </div>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="text" className="p-6 pt-0">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-5 bg-gray-50 dark:bg-gray-900 p-5 rounded-xl">
                        <h3 className="font-medium text-gray-800 dark:text-white mb-3">Section Text</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="sectionTitle" className="font-medium">Section Title</Label>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                              <Input
                                id="sectionTitle"
                                value={settings.textCustomization?.sectionTitle ?? "Featured Courses"}
                                onChange={(e) => updateTextCustomization('sectionTitle', e.target.value)}
                                placeholder="Featured Courses"
                                className="border-gray-200 dark:border-gray-700 focus:ring-primary"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="sectionDescription" className="font-medium">Section Description</Label>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                              <Input
                                id="sectionDescription"
                                value={settings.textCustomization?.sectionDescription ?? "Explore our curated selection of blended and live learning experiences"}
                                onChange={(e) => updateTextCustomization('sectionDescription', e.target.value)}
                                placeholder="Explore our curated selection of courses"
                                className="border-gray-200 dark:border-gray-700 focus:ring-primary"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="liveCoursesTitle" className="font-medium">Live Courses Title</Label>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                              <Input
                                id="liveCoursesTitle"
                                value={settings.textCustomization?.liveCoursesTitle ?? "Live Interactive Courses"}
                                onChange={(e) => updateTextCustomization('liveCoursesTitle', e.target.value)}
                                placeholder="Live Interactive Courses"
                                className="border-gray-200 dark:border-gray-700 focus:ring-primary"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="blendedCoursesTitle" className="font-medium">Blended Courses Title</Label>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                              <Input
                                id="blendedCoursesTitle"
                                value={settings.textCustomization?.blendedCoursesTitle ?? "Blended Self Paced Certification Courses"}
                                onChange={(e) => updateTextCustomization('blendedCoursesTitle', e.target.value)}
                                placeholder="Blended Self Paced Certification Courses"
                                className="border-gray-200 dark:border-gray-700 focus:ring-primary"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {showPreview && (
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-4">
                <Card className="border-0 shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700 pb-2">
                    <CardTitle className="flex items-center">
                      <Eye className="h-5 w-5 mr-2 text-primary" />
                      Live Preview {previewType !== "all" && (
                        <span className="ml-1 text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          {previewType === "live" ? "Live Courses Only" : "Blended Courses Only"}
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Real-time preview of your changes
                    </CardDescription>
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                      <Tabs 
                        defaultValue={previewType} 
                        onValueChange={setPreviewType}
                        className="w-full"
                      >
                        <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                          <TabsTrigger 
                            value="all"
                            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md transition-all"
                          >
                            All Courses
                          </TabsTrigger>
                          <TabsTrigger 
                            value="live"
                            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md transition-all"
                          >
                            Live Only
                          </TabsTrigger>
                          <TabsTrigger 
                            value="blended"
                            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md transition-all"
                          >
                            Blended Only
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                      <div className="flex items-center space-x-2 mt-2 w-full bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                        <Label htmlFor="preview-scale" className="text-xs font-medium">Preview Scale:</Label>
                        <select 
                          id="preview-scale"
                          className="text-xs border rounded-md px-2 py-1 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 flex-grow"
                          defaultValue="0.5"
                          onChange={(e) => {
                            const previewEl = document.getElementById('preview-container');
                            if (previewEl) {
                              previewEl.style.transform = `scale(${e.target.value})`;
                            }
                          }}
                        >
                          <option value="0.35">35%</option>
                          <option value="0.4">40%</option>
                          <option value="0.5">50%</option>
                          <option value="0.6">60%</option>
                        </select>
                      </div>
                    </div>
                  </CardHeader>
                  <Separator />
                  <CardContent className="p-0">
                    <div className="max-h-[600px] overflow-auto bg-gray-50 dark:bg-gray-900">
                      <div 
                        id="preview-container"
                        className="origin-top-left transform scale-50 min-h-[1200px] w-[200%]"
                        style={{ transformOrigin: 'top left' }}
                      >
                        <div className="p-4 bg-white dark:bg-gray-800">
                          <HomeCourseSection 
                            CustomText={settings.textCustomization?.sectionTitle ?? "Featured Courses"}
                            CustomDescription={settings.textCustomization?.sectionDescription ?? "Preview of your selected courses"}
                            showOnlyLive={previewType === "live"}
                            hideGradeFilter={previewType === "blended"}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Info className="h-4 w-4 mr-2 text-primary" />
                      Preview Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs space-y-2 p-4">
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-2 rounded-md">
                      <span className="font-medium">Live Courses:</span> 
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                        {settings.selectedLiveCourseIds.filter(id => id && id !== 'none').length} selected
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-2 rounded-md">
                      <span className="font-medium">Blended Courses:</span> 
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                        {settings.selectedBlendedCourseIds.filter(id => id && id !== 'none').length} selected
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-2 rounded-md">
                      <span className="font-medium">Section Title:</span> 
                      <span className="text-gray-600 dark:text-gray-400 truncate max-w-[150px]">
                        {settings.textCustomization?.sectionTitle || "Featured Courses"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-100 dark:border-blue-900/30">
                      <div className="flex items-start">
                        <Info className="h-4 w-4 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p>Scroll inside the preview to see all courses</p>
                          <p className="mt-1">Tip: Adjust the scale to see more courses at once</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                      Selected Courses
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-[200px] overflow-y-auto p-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-semibold mb-2 flex items-center">
                          <Video className="h-3.5 w-3.5 mr-1.5 text-primary" />
                          Live Courses
                        </h4>
                        <ul className="text-xs space-y-1.5">
                          {settings.selectedLiveCourseIds
                            .filter(id => id && id !== 'none')
                            .map((id, index) => {
                              const course = getCourseById(id);
                              return course ? (
                                <li key={`live-${index}`} className="flex items-center bg-gray-50 dark:bg-gray-900 p-2 rounded-md">
                                  <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs font-semibold">{index + 1}</span>
                                  <span className="truncate">{course.course_title}</span>
                                </li>
                              ) : (
                                <li key={`live-${index}`} className="flex items-center bg-gray-50 dark:bg-gray-900 p-2 rounded-md text-gray-500">
                                  <span className="bg-gray-200 dark:bg-gray-700 w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs">?</span>
                                  Unknown course
                                </li>
                              );
                            })}
                          {settings.selectedLiveCourseIds.filter(id => id && id !== 'none').length === 0 && (
                            <li className="text-gray-500 bg-gray-50 dark:bg-gray-900 p-2 rounded-md italic flex items-center">
                              <AlertCircle className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                              No live courses selected
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-semibold mb-2 flex items-center">
                          <BookOpen className="h-3.5 w-3.5 mr-1.5 text-primary" />
                          Blended Courses
                        </h4>
                        <ul className="text-xs space-y-1.5">
                          {settings.selectedBlendedCourseIds
                            .filter(id => id && id !== 'none')
                            .map((id, index) => {
                              const course = getCourseById(id);
                              return course ? (
                                <li key={`blended-${index}`} className="flex items-center bg-gray-50 dark:bg-gray-900 p-2 rounded-md">
                                  <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs font-semibold">{index + 1}</span>
                                  <span className="truncate">{course.course_title}</span>
                                </li>
                              ) : (
                                <li key={`blended-${index}`} className="flex items-center bg-gray-50 dark:bg-gray-900 p-2 rounded-md text-gray-500">
                                  <span className="bg-gray-200 dark:bg-gray-700 w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs">?</span>
                                  Unknown course
                                </li>
                              );
                            })}
                          {settings.selectedBlendedCourseIds.filter(id => id && id !== 'none').length === 0 && (
                            <li className="text-gray-500 bg-gray-50 dark:bg-gray-900 p-2 rounded-md italic flex items-center">
                              <AlertCircle className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                              No blended courses selected
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 