"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Gift,
  Plus,
  Trash2,
  Save,
  Eye,
  Upload,
  Users,
  Star,
  Settings,
  FileText,
  CheckCircle,
  Globe,
  Heart,
  Download,
  PlayCircle
} from 'lucide-react';

interface FreeModule {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: FreeLesson[];
}

interface FreeLesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'download' | 'quiz';
  duration: string;
  isFree: boolean;
}

export default function CreateFreeCoursePage() {
  const [courseData, setCourseData] = useState({
    title: '',
    subtitle: '',
    description: '',
    thumbnail: '',
    category: '',
    level: 'beginner',
    language: 'english',
    estimatedDuration: '',
    tags: [] as string[],
    learningOutcomes: [] as string[],
    certificationType: 'completion',
    allowDownloads: true,
    enableCommunity: true,
    visibility: 'public'
  });

  const [modules, setModules] = useState<FreeModule[]>([
    {
      id: '1',
      title: 'Getting Started',
      description: 'Introduction to the course content',
      order: 1,
      lessons: [
        {
          id: '1-1',
          title: 'Welcome Video',
          type: 'video',
          duration: '10 min',
          isFree: true
        }
      ]
    }
  ]);

  const [currentStep, setCurrentStep] = useState(1);
  const [newTag, setNewTag] = useState('');
  const [newOutcome, setNewOutcome] = useState('');

  const addModule = () => {
    const newModule: FreeModule = {
      id: Date.now().toString(),
      title: '',
      description: '',
      order: modules.length + 1,
      lessons: []
    };
    setModules([...modules, newModule]);
  };

  const addLesson = (moduleId: string) => {
    setModules(modules.map(module => {
      if (module.id === moduleId) {
        const newLesson: FreeLesson = {
          id: `${moduleId}-${Date.now()}`,
          title: '',
          type: 'video',
          duration: '',
          isFree: true
        };
        return { ...module, lessons: [...module.lessons, newLesson] };
      }
      return module;
    }));
  };

  const steps = [
    { id: 1, title: 'Basic Information', icon: FileText },
    { id: 2, title: 'Content & Modules', icon: PlayCircle },
    { id: 3, title: 'Community Settings', icon: Users },
    { id: 4, title: 'Preview & Publish', icon: Eye }
  ];

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Course Details
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Course Title *
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="Enter course title"
            value={courseData.title}
            onChange={(e) => setCourseData({...courseData, title: e.target.value})}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="Describe what your free course offers"
            value={courseData.description}
            onChange={(e) => setCourseData({...courseData, description: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category *
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={courseData.category}
            onChange={(e) => setCourseData({...courseData, category: e.target.value})}
          >
            <option value="">Select category</option>
            <option value="technology">Technology</option>
            <option value="science">Science</option>
            <option value="mathematics">Mathematics</option>
            <option value="business">Business</option>
            <option value="design">Design</option>
            <option value="language">Language</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Difficulty Level
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={courseData.level}
            onChange={(e) => setCourseData({...courseData, level: e.target.value})}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Learning Outcomes */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          What will students learn?
        </label>
        <div className="space-y-2 mb-3">
          {courseData.learningOutcomes.map((outcome, index) => (
            <div key={index} className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{outcome}</span>
              <button
                onClick={() => setCourseData({...courseData, learningOutcomes: courseData.learningOutcomes.filter((_, i) => i !== index)})}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="Add learning outcome"
            value={newOutcome}
            onChange={(e) => setNewOutcome(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (newOutcome && setCourseData({...courseData, learningOutcomes: [...courseData.learningOutcomes, newOutcome]}), setNewOutcome(''))}
          />
          <button
            onClick={() => (newOutcome && setCourseData({...courseData, learningOutcomes: [...courseData.learningOutcomes, newOutcome]}), setNewOutcome(''))}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Course Content
        </h3>
        <button
          onClick={addModule}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Module
        </button>
      </div>

      <div className="space-y-4">
        {modules.map((module, moduleIndex) => (
          <div key={module.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 grid grid-cols-1 gap-4">
                <input
                  type="text"
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Module title"
                  value={module.title}
                  onChange={(e) => {
                    setModules(modules.map(m => 
                      m.id === module.id ? {...m, title: e.target.value} : m
                    ));
                  }}
                />
                <textarea
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Module description"
                  rows={2}
                  value={module.description}
                  onChange={(e) => {
                    setModules(modules.map(m => 
                      m.id === module.id ? {...m, description: e.target.value} : m
                    ));
                  }}
                />
              </div>
              <button
                onClick={() => setModules(modules.filter(m => m.id !== module.id))}
                className="ml-4 p-2 text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900 dark:text-white">Lessons</h4>
                <button
                  onClick={() => addLesson(module.id)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Lesson
                </button>
              </div>
              
              {module.lessons.map((lesson) => (
                <div key={lesson.id} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <input
                    type="text"
                    className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Lesson title"
                    value={lesson.title}
                    onChange={(e) => {
                      setModules(modules.map(m => {
                        if (m.id === module.id) {
                          const updatedLessons = m.lessons.map(l => 
                            l.id === lesson.id ? {...l, title: e.target.value} : l
                          );
                          return {...m, lessons: updatedLessons};
                        }
                        return m;
                      }));
                    }}
                  />
                  <select
                    className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    value={lesson.type}
                    onChange={(e) => {
                      setModules(modules.map(m => {
                        if (m.id === module.id) {
                          const updatedLessons = m.lessons.map(l => 
                            l.id === lesson.id ? {...l, type: e.target.value as any} : l
                          );
                          return {...m, lessons: updatedLessons};
                        }
                        return m;
                      }));
                    }}
                  >
                    <option value="video">Video</option>
                    <option value="text">Article</option>
                    <option value="download">Download</option>
                    <option value="quiz">Quiz</option>
                  </select>
                  <input
                    type="text"
                    className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Duration"
                    value={lesson.duration}
                    onChange={(e) => {
                      setModules(modules.map(m => {
                        if (m.id === module.id) {
                          const updatedLessons = m.lessons.map(l => 
                            l.id === lesson.id ? {...l, duration: e.target.value} : l
                          );
                          return {...m, lessons: updatedLessons};
                        }
                        return m;
                      }));
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Community & Settings
      </h3>
      
      <div className="space-y-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={courseData.enableCommunity}
            onChange={(e) => setCourseData({...courseData, enableCommunity: e.target.checked})}
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Enable community discussions
          </span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={courseData.allowDownloads}
            onChange={(e) => setCourseData({...courseData, allowDownloads: e.target.checked})}
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Allow resource downloads
          </span>
        </label>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Certification
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={courseData.certificationType}
            onChange={(e) => setCourseData({...courseData, certificationType: e.target.value})}
          >
            <option value="completion">Free Certificate of Completion</option>
            <option value="none">No Certificate</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Preview & Publish
      </h3>
      
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Course Summary</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-900 dark:text-white">Information</h5>
            <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>Title: {courseData.title || 'Not set'}</li>
              <li>Category: {courseData.category || 'Not set'}</li>
              <li>Level: {courseData.level}</li>
              <li>Price: Free</li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-900 dark:text-white">Content</h5>
            <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>Modules: {modules.length}</li>
              <li>Lessons: {modules.reduce((total, module) => total + module.lessons.length, 0)}</li>
              <li>Community: {courseData.enableCommunity ? 'Enabled' : 'Disabled'}</li>
              <li>Certificate: {courseData.certificationType === 'completion' ? 'Yes' : 'No'}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
          Save as Draft
        </button>
        
        <div className="space-x-3">
          <button className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            Preview Course
          </button>
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Publish Free Course
          </button>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboards/instructor/courses/create" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Course Types
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Create Free Course
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Share knowledge with the world - completely free for learners
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-green-600 dark:text-green-400">
                <Heart className="w-5 h-5 mr-2" />
                <span className="font-medium">Free for Everyone</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-green-600 text-white' :
                    isCompleted ? 'bg-green-600 text-white' :
                    'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`mt-2 text-xs ${
                    isActive ? 'text-green-600 font-medium' :
                    isCompleted ? 'text-green-600 font-medium' :
                    'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {renderCurrentStep()}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="text-sm text-gray-500">
              Step {currentStep} of {steps.length}
            </div>
            
            <button
              onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
              disabled={currentStep === steps.length}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === steps.length ? 'Complete' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 