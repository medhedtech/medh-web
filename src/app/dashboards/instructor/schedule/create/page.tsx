"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar,
  Clock,
  Video,
  Users,
  Plus,
  Trash2,
  Save,
  Eye,
  Settings,
  Mic,
  Camera,
  MessageSquare,
  Share2,
  CheckCircle,
  AlertCircle,
  Copy,
  Link2
} from 'lucide-react';

interface ClassSession {
  id: string;
  title: string;
  description: string;
  course: string;
  date: string;
  time: string;
  duration: string;
  maxStudents: number;
  meetingPlatform: string;
  hasRecording: boolean;
  hasBreakoutRooms: boolean;
  hasWhiteboard: boolean;
  requireCamera: boolean;
  requireMic: boolean;
}

interface RecurrenceSettings {
  enabled: boolean;
  pattern: 'daily' | 'weekly' | 'monthly';
  interval: number;
  endDate: string;
  occurrences: number;
}

export default function CreateSchedulePage() {
  const [classData, setClassData] = useState<ClassSession>({
    id: '',
    title: '',
    description: '',
    course: '',
    date: '',
    time: '',
    duration: '1 hour',
    maxStudents: 25,
    meetingPlatform: 'zoom',
    hasRecording: true,
    hasBreakoutRooms: false,
    hasWhiteboard: true,
    requireCamera: false,
    requireMic: false
  });

  const [recurrence, setRecurrence] = useState<RecurrenceSettings>({
    enabled: false,
    pattern: 'weekly',
    interval: 1,
    endDate: '',
    occurrences: 10
  });

  const [currentStep, setCurrentStep] = useState(1);

  const courses = [
    'Quantum Computing Fundamentals',
    'Advanced Physics',
    'Mathematics Review',
    'Computer Science Basics',
    'Data Science Introduction'
  ];

  const steps = [
    { id: 1, title: 'Basic Information', icon: Calendar },
    { id: 2, title: 'Session Settings', icon: Video },
    { id: 3, title: 'Recurrence & Review', icon: Clock }
  ];

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Class Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Class Title *
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="Enter class title"
            value={classData.title}
            onChange={(e) => setClassData({...classData, title: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Associated Course *
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={classData.course}
            onChange={(e) => setClassData({...classData, course: e.target.value})}
          >
            <option value="">Select course</option>
            {courses.map((course) => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Max Students
          </label>
          <input
            type="number"
            min="1"
            max="100"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={classData.maxStudents}
            onChange={(e) => setClassData({...classData, maxStudents: parseInt(e.target.value)})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date *
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={classData.date}
            onChange={(e) => setClassData({...classData, date: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Time *
          </label>
          <input
            type="time"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={classData.time}
            onChange={(e) => setClassData({...classData, time: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Duration
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={classData.duration}
            onChange={(e) => setClassData({...classData, duration: e.target.value})}
          >
            <option value="30 minutes">30 minutes</option>
            <option value="1 hour">1 hour</option>
            <option value="1.5 hours">1.5 hours</option>
            <option value="2 hours">2 hours</option>
            <option value="3 hours">3 hours</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="Class description and agenda"
            value={classData.description}
            onChange={(e) => setClassData({...classData, description: e.target.value})}
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Session Configuration
      </h3>
      
      {/* Meeting Platform */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Meeting Platform
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          value={classData.meetingPlatform}
          onChange={(e) => setClassData({...classData, meetingPlatform: e.target.value})}
        >
          <option value="zoom">Zoom</option>
          <option value="teams">Microsoft Teams</option>
          <option value="meet">Google Meet</option>
          <option value="webex">Cisco Webex</option>
          <option value="custom">Custom Platform</option>
        </select>
      </div>

      {/* Interactive Features */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Interactive Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
              checked={classData.hasRecording}
              onChange={(e) => setClassData({...classData, hasRecording: e.target.checked})}
            />
            <div className="flex items-center">
              <Video className="w-4 h-4 mr-2 text-gray-600" />
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Recording</span>
                <p className="text-xs text-gray-500">Automatically record session</p>
              </div>
            </div>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
              checked={classData.hasBreakoutRooms}
              onChange={(e) => setClassData({...classData, hasBreakoutRooms: e.target.checked})}
            />
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-gray-600" />
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Breakout Rooms</span>
                <p className="text-xs text-gray-500">Enable small group discussions</p>
              </div>
            </div>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
              checked={classData.hasWhiteboard}
              onChange={(e) => setClassData({...classData, hasWhiteboard: e.target.checked})}
            />
            <div className="flex items-center">
              <Share2 className="w-4 h-4 mr-2 text-gray-600" />
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Whiteboard</span>
                <p className="text-xs text-gray-500">Interactive whiteboard access</p>
              </div>
            </div>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
              checked={classData.requireCamera}
              onChange={(e) => setClassData({...classData, requireCamera: e.target.checked})}
            />
            <div className="flex items-center">
              <Camera className="w-4 h-4 mr-2 text-gray-600" />
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Camera Required</span>
                <p className="text-xs text-gray-500">Students must turn on camera</p>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Student Requirements */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3">
          Student Requirements
        </h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
              checked={classData.requireMic}
              onChange={(e) => setClassData({...classData, requireMic: e.target.checked})}
            />
            <div className="flex items-center">
              <Mic className="w-4 h-4 mr-2 text-blue-600" />
              <span className="text-sm text-blue-800 dark:text-blue-200">Microphone Required</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Recurrence & Final Review
      </h3>
      
      {/* Recurrence Settings */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900 dark:text-white">Recurring Class</h4>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
              checked={recurrence.enabled}
              onChange={(e) => setRecurrence({...recurrence, enabled: e.target.checked})}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Enable recurrence</span>
          </label>
        </div>
        
        {recurrence.enabled && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Repeat Pattern
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={recurrence.pattern}
                onChange={(e) => setRecurrence({...recurrence, pattern: e.target.value as any})}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Every
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
                Occurrences
              </label>
              <input
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={recurrence.occurrences}
                onChange={(e) => setRecurrence({...recurrence, occurrences: parseInt(e.target.value)})}
              />
            </div>
          </div>
        )}
      </div>

      {/* Class Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Class Summary</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-900 dark:text-white">Basic Information</h5>
            <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>Title: {classData.title || 'Not set'}</li>
              <li>Course: {classData.course || 'Not set'}</li>
              <li>Date: {classData.date || 'Not set'}</li>
              <li>Time: {classData.time || 'Not set'}</li>
              <li>Duration: {classData.duration}</li>
              <li>Max Students: {classData.maxStudents}</li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-900 dark:text-white">Features</h5>
            <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>Platform: {classData.meetingPlatform}</li>
              <li>Recording: {classData.hasRecording ? 'Enabled' : 'Disabled'}</li>
              <li>Breakout Rooms: {classData.hasBreakoutRooms ? 'Enabled' : 'Disabled'}</li>
              <li>Whiteboard: {classData.hasWhiteboard ? 'Enabled' : 'Disabled'}</li>
              <li>Camera Required: {classData.requireCamera ? 'Yes' : 'No'}</li>
              <li>Microphone Required: {classData.requireMic ? 'Yes' : 'No'}</li>
            </ul>
          </div>
        </div>

        {recurrence.enabled && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h6 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Recurrence</h6>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Repeats {recurrence.pattern} for {recurrence.occurrences} occurrences
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
          Save as Template
        </button>
        
        <div className="space-x-3">
          <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            Save as Draft
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Schedule Class
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
      default: return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboards/instructor/schedule" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Schedule
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Schedule New Class
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Create a new live class session for your students
              </p>
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