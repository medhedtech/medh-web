"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  BookOpen,
  Plus,
  Trash2,
  Save,
  Eye,
  Upload,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Star,
  Settings,
  Video,
  FileText,
  CheckCircle,
  Globe,
  Lock
} from 'lucide-react';

interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  estimatedDuration: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  duration: string;
  isRequired: boolean;
}

interface DoubtSession {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  maxStudents: number;
}

export default function CreateBlendedCoursePage() {
  const [courseData, setCourseData] = useState({
    title: '',
    subtitle: '',
    description: '',
    thumbnail: '',
    category: '',
    level: 'beginner',
    language: 'english',
    estimatedDuration: '',
    maxStudents: '',
    price: '',
    discountPrice: '',
    tags: [] as string[],
    learningOutcomes: [] as string[],
    prerequisites: [] as string[],
    certificationType: 'completion',
    hasLiveSupport: true,
    allowDownloads: true,
    visibility: 'public'
  });

  const [modules, setModules] = useState<Module[]>([
    {
      id: '1',
      title: 'Introduction Module',
      description: 'Course overview and foundational concepts',
      order: 1,
      estimatedDuration: '2 hours',
      lessons: [
        {
          id: '1-1',
          title: 'Welcome & Course Overview',
          type: 'video',
          duration: '15 min',
          isRequired: true
        }
      ]
    }
  ]);

  const [doubtSessions, setDoubtSessions] = useState<DoubtSession[]>([
    {
      id: '1',
      title: 'Weekly Q&A Session',
      description: 'Ask questions and clarify doubts',
      date: '',
      time: '',
      duration: '1 hour',
      maxStudents: 30
    }
  ]);

  const [currentStep, setCurrentStep] = useState(1);
  const [newTag, setNewTag] = useState('');
  const [newOutcome, setNewOutcome] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');

  const addModule = () => {
    const newModule: Module = {
      id: Date.now().toString(),
      title: '',
      description: '',
      order: modules.length + 1,
      estimatedDuration: '',
      lessons: []
    };
    setModules([...modules, newModule]);
  };

  const removeModule = (moduleId: string) => {
    setModules(modules.filter(m => m.id !== moduleId));
  };

  const addLesson = (moduleId: string) => {
    setModules(modules.map(module => {
      if (module.id === moduleId) {
        const newLesson: Lesson = {
          id: `${moduleId}-${Date.now()}`,
          title: '',
          type: 'video',
          duration: '',
          isRequired: true
        };
        return { ...module, lessons: [...module.lessons, newLesson] };
      }
      return module;
    }));
  };

  const addDoubtSession = () => {
    const newSession: DoubtSession = {
      id: Date.now().toString(),
      title: '',
      description: '',
      date: '',
      time: '',
      duration: '1 hour',
      maxStudents: 30
    };
    setDoubtSessions([...doubtSessions, newSession]);
  };

  const addTag = () => {
    if (newTag && !courseData.tags.includes(newTag)) {
      setCourseData({
        ...courseData,
        tags: [...courseData.tags, newTag]
      });
      setNewTag('');
    }
  };

  const addLearningOutcome = () => {
    if (newOutcome && !courseData.learningOutcomes.includes(newOutcome)) {
      setCourseData({
        ...courseData,
        learningOutcomes: [...courseData.learningOutcomes, newOutcome]
      });
      setNewOutcome('');
    }
  };

  const addPrerequisite = () => {
    if (newPrerequisite && !courseData.prerequisites.includes(newPrerequisite)) {
      setCourseData({
        ...courseData,
        prerequisites: [...courseData.prerequisites, newPrerequisite]
      });
      setNewPrerequisite('');
    }
  };

  const steps = [
    { id: 1, title: 'Basic Information', icon: BookOpen },
    { id: 2, title: 'Curriculum & Modules', icon: FileText },
    { id: 3, title: 'Live Support', icon: Video },
    { id: 4, title: 'Pricing & Settings', icon: Settings },
    { id: 5, title: 'Preview & Publish', icon: Eye }
  ];

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
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
              Subtitle
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Brief course subtitle"
              value={courseData.subtitle}
              onChange={(e) => setCourseData({...courseData, subtitle: e.target.value})}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Detailed course description"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              value={courseData.language}
              onChange={(e) => setCourseData({...courseData, language: e.target.value})}
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estimated Duration
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="e.g., 6 weeks, 40 hours"
              value={courseData.estimatedDuration}
              onChange={(e) => setCourseData({...courseData, estimatedDuration: e.target.value})}
            />
          </div>
        </div>

        {/* Course Thumbnail */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Course Thumbnail
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload course thumbnail (16:9 ratio recommended)
              </p>
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                Choose File
              </button>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {courseData.tags.map((tag, index) => (
              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {tag}
                <button
                  onClick={() => setCourseData({...courseData, tags: courseData.tags.filter((_, i) => i !== index)})}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Add a tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
            />
            <button
              onClick={addTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Course Curriculum
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
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Module title"
                  value={module.title}
                  onChange={(e) => {
                    const updatedModules = modules.map(m => 
                      m.id === module.id ? {...m, title: e.target.value} : m
                    );
                    setModules(updatedModules);
                  }}
                />
                <input
                  type="text"
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Estimated duration"
                  value={module.estimatedDuration}
                  onChange={(e) => {
                    const updatedModules = modules.map(m => 
                      m.id === module.id ? {...m, estimatedDuration: e.target.value} : m
                    );
                    setModules(updatedModules);
                  }}
                />
              </div>
              <button
                onClick={() => removeModule(module.id)}
                className="ml-4 p-2 text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-4"
              placeholder="Module description"
              rows={2}
              value={module.description}
              onChange={(e) => {
                const updatedModules = modules.map(m => 
                  m.id === module.id ? {...m, description: e.target.value} : m
                );
                setModules(updatedModules);
              }}
            />

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
              
              {module.lessons.map((lesson, lessonIndex) => (
                <div key={lesson.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <input
                    type="text"
                    className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Lesson title"
                    value={lesson.title}
                    onChange={(e) => {
                      const updatedModules = modules.map(m => {
                        if (m.id === module.id) {
                          const updatedLessons = m.lessons.map(l => 
                            l.id === lesson.id ? {...l, title: e.target.value} : l
                          );
                          return {...m, lessons: updatedLessons};
                        }
                        return m;
                      });
                      setModules(updatedModules);
                    }}
                  />
                  <select
                    className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    value={lesson.type}
                    onChange={(e) => {
                      const updatedModules = modules.map(m => {
                        if (m.id === module.id) {
                          const updatedLessons = m.lessons.map(l => 
                            l.id === lesson.id ? {...l, type: e.target.value as any} : l
                          );
                          return {...m, lessons: updatedLessons};
                        }
                        return m;
                      });
                      setModules(updatedModules);
                    }}
                  >
                    <option value="video">Video</option>
                    <option value="text">Text/Article</option>
                    <option value="quiz">Quiz</option>
                    <option value="assignment">Assignment</option>
                  </select>
                  <input
                    type="text"
                    className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Duration"
                    value={lesson.duration}
                    onChange={(e) => {
                      const updatedModules = modules.map(m => {
                        if (m.id === module.id) {
                          const updatedLessons = m.lessons.map(l => 
                            l.id === lesson.id ? {...l, duration: e.target.value} : l
                          );
                          return {...m, lessons: updatedLessons};
                        }
                        return m;
                      });
                      setModules(updatedModules);
                    }}
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        className="mr-1"
                        checked={lesson.isRequired}
                        onChange={(e) => {
                          const updatedModules = modules.map(m => {
                            if (m.id === module.id) {
                              const updatedLessons = m.lessons.map(l => 
                                l.id === lesson.id ? {...l, isRequired: e.target.checked} : l
                              );
                              return {...m, lessons: updatedLessons};
                            }
                            return m;
                          });
                          setModules(updatedModules);
                        }}
                      />
                      Required
                    </label>
                    <button
                      onClick={() => {
                        const updatedModules = modules.map(m => {
                          if (m.id === module.id) {
                            return {...m, lessons: m.lessons.filter(l => l.id !== lesson.id)};
                          }
                          return m;
                        });
                        setModules(updatedModules);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Live Support & Doubt Sessions
        </h3>
        <button
          onClick={addDoubtSession}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Session
        </button>
      </div>

      <div className="space-y-4">
        {doubtSessions.map((session, index) => (
          <div key={session.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Session title"
                value={session.title}
                onChange={(e) => {
                  const updatedSessions = doubtSessions.map(s => 
                    s.id === session.id ? {...s, title: e.target.value} : s
                  );
                  setDoubtSessions(updatedSessions);
                }}
              />
              <input
                type="number"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Max students"
                value={session.maxStudents}
                onChange={(e) => {
                  const updatedSessions = doubtSessions.map(s => 
                    s.id === session.id ? {...s, maxStudents: parseInt(e.target.value)} : s
                  );
                  setDoubtSessions(updatedSessions);
                }}
              />
              <input
                type="date"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={session.date}
                onChange={(e) => {
                  const updatedSessions = doubtSessions.map(s => 
                    s.id === session.id ? {...s, date: e.target.value} : s
                  );
                  setDoubtSessions(updatedSessions);
                }}
              />
              <input
                type="time"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={session.time}
                onChange={(e) => {
                  const updatedSessions = doubtSessions.map(s => 
                    s.id === session.id ? {...s, time: e.target.value} : s
                  );
                  setDoubtSessions(updatedSessions);
                }}
              />
            </div>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Session description"
              rows={2}
              value={session.description}
              onChange={(e) => {
                const updatedSessions = doubtSessions.map(s => 
                  s.id === session.id ? {...s, description: e.target.value} : s
                );
                setDoubtSessions(updatedSessions);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Pricing & Course Settings
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Course Price ($)
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="0.00"
            value={courseData.price}
            onChange={(e) => setCourseData({...courseData, price: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Discount Price ($)
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="0.00"
            value={courseData.discountPrice}
            onChange={(e) => setCourseData({...courseData, discountPrice: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Max Students
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="Unlimited"
            value={courseData.maxStudents}
            onChange={(e) => setCourseData({...courseData, maxStudents: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Certification Type
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={courseData.certificationType}
            onChange={(e) => setCourseData({...courseData, certificationType: e.target.value})}
          >
            <option value="completion">Certificate of Completion</option>
            <option value="achievement">Certificate of Achievement</option>
            <option value="none">No Certificate</option>
          </select>
        </div>
      </div>

      {/* Course Settings */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white">Course Settings</h4>
        
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={courseData.hasLiveSupport}
              onChange={(e) => setCourseData({...courseData, hasLiveSupport: e.target.checked})}
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Enable live instructor support
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
              Allow students to download resources
            </span>
          </label>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Course Visibility
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              value={courseData.visibility}
              onChange={(e) => setCourseData({...courseData, visibility: e.target.value})}
            >
              <option value="public">Public - Anyone can find and enroll</option>
              <option value="unlisted">Unlisted - Only those with link can access</option>
              <option value="private">Private - Invite only</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Preview & Publish
      </h3>
      
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Course Summary</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-900 dark:text-white">Basic Information</h5>
            <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>Title: {courseData.title || 'Not set'}</li>
              <li>Category: {courseData.category || 'Not set'}</li>
              <li>Level: {courseData.level}</li>
              <li>Duration: {courseData.estimatedDuration || 'Not set'}</li>
              <li>Price: ${courseData.price || '0'}</li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-900 dark:text-white">Course Content</h5>
            <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>Modules: {modules.length}</li>
              <li>Total Lessons: {modules.reduce((total, module) => total + module.lessons.length, 0)}</li>
              <li>Doubt Sessions: {doubtSessions.length}</li>
              <li>Certification: {courseData.certificationType}</li>
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
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Publish Course
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
      case 5: return renderStep5();
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
                Create Blended Course
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Combine self-paced learning with live instructor support
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <Save className="w-4 h-4 mr-2 inline" />
                Save Draft
              </button>
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
                    isActive ? 'bg-blue-600 text-white' :
                    isCompleted ? 'bg-green-600 text-white' :
                    'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`mt-2 text-xs ${
                    isActive ? 'text-blue-600 font-medium' :
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
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === steps.length ? 'Complete' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 