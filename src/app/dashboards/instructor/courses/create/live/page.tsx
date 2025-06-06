"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Video,
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
  Mic,
  Monitor,
  FileText,
  CheckCircle,
  Globe,
  Lock,
  Camera,
  MessageSquare,
  Share2
} from 'lucide-react';

interface LiveSession {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  maxStudents: number;
  hasRecording: boolean;
  hasBreakoutRooms: boolean;
  hasWhiteboard: boolean;
  hasScreenShare: boolean;
}

interface RecurrencePattern {
  type: 'none' | 'daily' | 'weekly' | 'monthly';
  interval: number;
  endDate: string;
  occurrences: number;
}

export default function CreateLiveCoursePage() {
  const [courseData, setCourseData] = useState({
    title: '',
    subtitle: '',
    description: '',
    thumbnail: '',
    category: '',
    level: 'beginner',
    language: 'english',
    totalSessions: '',
    maxStudents: '',
    price: '',
    discountPrice: '',
    tags: [] as string[],
    learningOutcomes: [] as string[],
    prerequisites: [] as string[],
    certificationType: 'completion',
    allowRecordings: true,
    enableChat: true,
    enableQA: true,
    requireCamera: false,
    requireMic: false,
    visibility: 'public'
  });

  const [sessions, setSessions] = useState<LiveSession[]>([
    {
      id: '1',
      title: 'Course Introduction & Overview',
      description: 'Welcome session covering course objectives and expectations',
      date: '',
      time: '',
      duration: '1.5 hours',
      maxStudents: 30,
      hasRecording: true,
      hasBreakoutRooms: false,
      hasWhiteboard: true,
      hasScreenShare: true
    }
  ]);

  const [recurrence, setRecurrence] = useState<RecurrencePattern>({
    type: 'weekly',
    interval: 1,
    endDate: '',
    occurrences: 10
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [newTag, setNewTag] = useState('');
  const [newOutcome, setNewOutcome] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');

  const addSession = () => {
    const newSession: LiveSession = {
      id: Date.now().toString(),
      title: '',
      description: '',
      date: '',
      time: '',
      duration: '1 hour',
      maxStudents: 30,
      hasRecording: true,
      hasBreakoutRooms: false,
      hasWhiteboard: false,
      hasScreenShare: true
    };
    setSessions([...sessions, newSession]);
  };

  const removeSession = (sessionId: string) => {
    setSessions(sessions.filter(s => s.id !== sessionId));
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
    { id: 1, title: 'Basic Information', icon: FileText },
    { id: 2, title: 'Live Sessions', icon: Video },
    { id: 3, title: 'Interactive Features', icon: MessageSquare },
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
              Total Sessions
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="e.g., 10"
              value={courseData.totalSessions}
              onChange={(e) => setCourseData({...courseData, totalSessions: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Max Students per Session
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="e.g., 25"
              value={courseData.maxStudents}
              onChange={(e) => setCourseData({...courseData, maxStudents: e.target.value})}
            />
          </div>
        </div>

        {/* Learning Outcomes */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Learning Outcomes
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
              placeholder="What will students learn?"
              value={newOutcome}
              onChange={(e) => setNewOutcome(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addLearningOutcome()}
            />
            <button
              onClick={addLearningOutcome}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add
            </button>
          </div>
        </div>

        {/* Prerequisites */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Prerequisites
          </label>
          <div className="space-y-2 mb-3">
            {courseData.prerequisites.map((prereq, index) => (
              <div key={index} className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <Star className="w-4 h-4 text-yellow-500 mr-2" />
                <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{prereq}</span>
                <button
                  onClick={() => setCourseData({...courseData, prerequisites: courseData.prerequisites.filter((_, i) => i !== index)})}
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
              placeholder="What should students know beforehand?"
              value={newPrerequisite}
              onChange={(e) => setNewPrerequisite(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPrerequisite()}
            />
            <button
              onClick={addPrerequisite}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
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
          Live Sessions Schedule
        </h3>
        <button
          onClick={addSession}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Session
        </button>
      </div>

      {/* Recurrence Pattern */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Session Recurrence</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Repeat Pattern
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              value={recurrence.type}
              onChange={(e) => setRecurrence({...recurrence, type: e.target.value as any})}
            >
              <option value="none">No Repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          
          {recurrence.type !== 'none' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Interval
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  value={recurrence.interval}
                  onChange={(e) => setRecurrence({...recurrence, interval: parseInt(e.target.value)})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Total Occurrences
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  value={recurrence.occurrences}
                  onChange={(e) => setRecurrence({...recurrence, occurrences: parseInt(e.target.value)})}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {sessions.map((session, index) => (
          <div key={session.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Session {index + 1}</h4>
              <button
                onClick={() => removeSession(session.id)}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Session title"
                value={session.title}
                onChange={(e) => {
                  const updatedSessions = sessions.map(s => 
                    s.id === session.id ? {...s, title: e.target.value} : s
                  );
                  setSessions(updatedSessions);
                }}
              />
              
              <input
                type="number"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Max students"
                value={session.maxStudents}
                onChange={(e) => {
                  const updatedSessions = sessions.map(s => 
                    s.id === session.id ? {...s, maxStudents: parseInt(e.target.value)} : s
                  );
                  setSessions(updatedSessions);
                }}
              />

              <input
                type="date"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={session.date}
                onChange={(e) => {
                  const updatedSessions = sessions.map(s => 
                    s.id === session.id ? {...s, date: e.target.value} : s
                  );
                  setSessions(updatedSessions);
                }}
              />

              <input
                type="time"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={session.time}
                onChange={(e) => {
                  const updatedSessions = sessions.map(s => 
                    s.id === session.id ? {...s, time: e.target.value} : s
                  );
                  setSessions(updatedSessions);
                }}
              />

              <select
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={session.duration}
                onChange={(e) => {
                  const updatedSessions = sessions.map(s => 
                    s.id === session.id ? {...s, duration: e.target.value} : s
                  );
                  setSessions(updatedSessions);
                }}
              >
                <option value="30 minutes">30 minutes</option>
                <option value="1 hour">1 hour</option>
                <option value="1.5 hours">1.5 hours</option>
                <option value="2 hours">2 hours</option>
                <option value="3 hours">3 hours</option>
              </select>
            </div>

            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-4"
              placeholder="Session description"
              rows={2}
              value={session.description}
              onChange={(e) => {
                const updatedSessions = sessions.map(s => 
                  s.id === session.id ? {...s, description: e.target.value} : s
                );
                setSessions(updatedSessions);
              }}
            />

            {/* Session Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={session.hasRecording}
                  onChange={(e) => {
                    const updatedSessions = sessions.map(s => 
                      s.id === session.id ? {...s, hasRecording: e.target.checked} : s
                    );
                    setSessions(updatedSessions);
                  }}
                />
                Recording
              </label>
              
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={session.hasBreakoutRooms}
                  onChange={(e) => {
                    const updatedSessions = sessions.map(s => 
                      s.id === session.id ? {...s, hasBreakoutRooms: e.target.checked} : s
                    );
                    setSessions(updatedSessions);
                  }}
                />
                Breakout Rooms
              </label>
              
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={session.hasWhiteboard}
                  onChange={(e) => {
                    const updatedSessions = sessions.map(s => 
                      s.id === session.id ? {...s, hasWhiteboard: e.target.checked} : s
                    );
                    setSessions(updatedSessions);
                  }}
                />
                Whiteboard
              </label>
              
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={session.hasScreenShare}
                  onChange={(e) => {
                    const updatedSessions = sessions.map(s => 
                      s.id === session.id ? {...s, hasScreenShare: e.target.checked} : s
                    );
                    setSessions(updatedSessions);
                  }}
                />
                Screen Share
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Interactive Features & Requirements
      </h3>
      
      {/* Communication Features */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Communication Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
              checked={courseData.enableChat}
              onChange={(e) => setCourseData({...courseData, enableChat: e.target.checked})}
            />
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Live Chat</span>
              <p className="text-xs text-gray-500">Allow students to chat during sessions</p>
            </div>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
              checked={courseData.enableQA}
              onChange={(e) => setCourseData({...courseData, enableQA: e.target.checked})}
            />
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Q&A System</span>
              <p className="text-xs text-gray-500">Enable question raising and moderation</p>
            </div>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
              checked={courseData.allowRecordings}
              onChange={(e) => setCourseData({...courseData, allowRecordings: e.target.checked})}
            />
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Session Recordings</span>
              <p className="text-xs text-gray-500">Make recordings available to students</p>
            </div>
          </label>
        </div>
      </div>

      {/* Student Requirements */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Student Requirements</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
              checked={courseData.requireCamera}
              onChange={(e) => setCourseData({...courseData, requireCamera: e.target.checked})}
            />
            <div className="flex items-center">
              <Camera className="w-4 h-4 mr-2 text-gray-600" />
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Camera Required</span>
                <p className="text-xs text-gray-500">Students must have camera on</p>
              </div>
            </div>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
              checked={courseData.requireMic}
              onChange={(e) => setCourseData({...courseData, requireMic: e.target.checked})}
            />
            <div className="flex items-center">
              <Mic className="w-4 h-4 mr-2 text-gray-600" />
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Microphone Required</span>
                <p className="text-xs text-gray-500">Students must have working microphone</p>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Technical Requirements */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3">
          Recommended Technical Requirements
        </h4>
        <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <div className="flex items-center">
            <Monitor className="w-4 h-4 mr-2" />
            <span>Stable internet connection (minimum 5 Mbps upload/download)</span>
          </div>
          <div className="flex items-center">
            <Camera className="w-4 h-4 mr-2" />
            <span>HD webcam (720p or higher recommended)</span>
          </div>
          <div className="flex items-center">
            <Mic className="w-4 h-4 mr-2" />
            <span>Clear audio device (headphones recommended to avoid echo)</span>
          </div>
          <div className="flex items-center">
            <Globe className="w-4 h-4 mr-2" />
            <span>Modern web browser (Chrome, Firefox, Safari, Edge)</span>
          </div>
        </div>
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
          <p className="text-xs text-gray-500 mt-1">Premium pricing recommended for live instruction</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Early Bird Price ($)
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
            Certification Type
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={courseData.certificationType}
            onChange={(e) => setCourseData({...courseData, certificationType: e.target.value})}
          >
            <option value="completion">Certificate of Completion</option>
            <option value="achievement">Certificate of Achievement</option>
            <option value="attendance">Attendance Certificate</option>
            <option value="none">No Certificate</option>
          </select>
        </div>

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

      {/* Tags */}
      <div>
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
              <li>Sessions: {sessions.length}</li>
              <li>Price: ${courseData.price || '0'}</li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-900 dark:text-white">Features</h5>
            <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>Live Chat: {courseData.enableChat ? 'Enabled' : 'Disabled'}</li>
              <li>Q&A System: {courseData.enableQA ? 'Enabled' : 'Disabled'}</li>
              <li>Recordings: {courseData.allowRecordings ? 'Available' : 'Not available'}</li>
              <li>Camera: {courseData.requireCamera ? 'Required' : 'Optional'}</li>
              <li>Microphone: {courseData.requireMic ? 'Required' : 'Optional'}</li>
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <h5 className="font-medium text-gray-900 dark:text-white mb-2">Learning Outcomes</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {courseData.learningOutcomes.map((outcome, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                {outcome}
              </div>
            ))}
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
                Create Live Course
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Real-time instructor-led sessions with interactive learning
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