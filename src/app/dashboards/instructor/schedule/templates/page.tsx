"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Plus,
  LayoutTemplate,
  Edit,
  Trash2,
  Copy,
  Eye,
  Calendar,
  Clock,
  Users,
  Video,
  Search,
  Filter,
  Star,
  BookOpen,
  Settings,
  MoreVertical,
  CheckCircle
} from 'lucide-react';

interface ClassTemplate {
  id: string;
  name: string;
  description: string;
  course: string;
  duration: string;
  maxStudents: number;
  meetingPlatform: string;
  hasRecording: boolean;
  hasBreakoutRooms: boolean;
  hasWhiteboard: boolean;
  requireCamera: boolean;
  requireMic: boolean;
  category: 'lecture' | 'lab' | 'seminar' | 'workshop' | 'office-hours';
  isDefault: boolean;
  usageCount: number;
  lastUsed: string;
  createdAt: string;
  tags: string[];
}

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const templates: ClassTemplate[] = [
    {
      id: '1',
      name: 'Standard Lecture',
      description: 'Basic lecture template with recording and Q&A features',
      course: 'General',
      duration: '1 hour',
      maxStudents: 50,
      meetingPlatform: 'zoom',
      hasRecording: true,
      hasBreakoutRooms: false,
      hasWhiteboard: true,
      requireCamera: false,
      requireMic: false,
      category: 'lecture',
      isDefault: true,
      usageCount: 24,
      lastUsed: '2024-01-25',
      createdAt: '2024-01-01',
      tags: ['recording', 'whiteboard', 'standard']
    },
    {
      id: '2',
      name: 'Interactive Lab Session',
      description: 'Hands-on lab with breakout rooms and student collaboration',
      course: 'Quantum Computing Fundamentals',
      duration: '2 hours',
      maxStudents: 25,
      meetingPlatform: 'teams',
      hasRecording: true,
      hasBreakoutRooms: true,
      hasWhiteboard: true,
      requireCamera: true,
      requireMic: true,
      category: 'lab',
      isDefault: false,
      usageCount: 12,
      lastUsed: '2024-01-24',
      createdAt: '2024-01-10',
      tags: ['interactive', 'collaboration', 'hands-on']
    },
    {
      id: '3',
      name: 'Small Group Seminar',
      description: 'Discussion-based seminar with presentation features',
      course: 'Advanced Physics',
      duration: '1.5 hours',
      maxStudents: 15,
      meetingPlatform: 'meet',
      hasRecording: true,
      hasBreakoutRooms: false,
      hasWhiteboard: false,
      requireCamera: true,
      requireMic: true,
      category: 'seminar',
      isDefault: false,
      usageCount: 8,
      lastUsed: '2024-01-20',
      createdAt: '2024-01-05',
      tags: ['discussion', 'presentation', 'small-group']
    },
    {
      id: '4',
      name: 'Practical Workshop',
      description: 'Workshop template for skill-building sessions',
      course: 'Data Science Introduction',
      duration: '3 hours',
      maxStudents: 20,
      meetingPlatform: 'zoom',
      hasRecording: true,
      hasBreakoutRooms: true,
      hasWhiteboard: true,
      requireCamera: false,
      requireMic: false,
      category: 'workshop',
      isDefault: false,
      usageCount: 15,
      lastUsed: '2024-01-22',
      createdAt: '2024-01-08',
      tags: ['workshop', 'skill-building', 'practical']
    },
    {
      id: '5',
      name: 'Office Hours',
      description: 'One-on-one or small group office hours',
      course: 'General',
      duration: '30 minutes',
      maxStudents: 5,
      meetingPlatform: 'zoom',
      hasRecording: false,
      hasBreakoutRooms: false,
      hasWhiteboard: true,
      requireCamera: false,
      requireMic: false,
      category: 'office-hours',
      isDefault: true,
      usageCount: 32,
      lastUsed: '2024-01-26',
      createdAt: '2024-01-01',
      tags: ['office-hours', 'one-on-one', 'help']
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'lecture':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'lab':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'seminar':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'workshop':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'office-hours':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'lecture':
        return BookOpen;
      case 'lab':
        return Settings;
      case 'seminar':
        return Users;
      case 'workshop':
        return LayoutTemplate;
      case 'office-hours':
        return Clock;
      default:
        return BookOpen;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'lecture', label: 'Lectures' },
    { value: 'lab', label: 'Labs' },
    { value: 'seminar', label: 'Seminars' },
    { value: 'workshop', label: 'Workshops' },
    { value: 'office-hours', label: 'Office Hours' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboards/instructor/schedule" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Schedule
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Class Templates
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Create and manage reusable class templates for quick scheduling
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <LayoutTemplate className="h-5 w-5 mr-2" />
                Import Template
              </button>
              <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-5 w-5 mr-2" />
                Create Template
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <LayoutTemplate className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Templates</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{templates.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Star className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Default Templates</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {templates.filter(t => t.isDefault).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Most Used</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.max(...templates.map(t => t.usageCount))}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Usage</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {templates.reduce((sum, t) => sum + t.usageCount, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const CategoryIcon = getCategoryIcon(template.category);
            
            return (
              <div key={template.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <CategoryIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      {template.isDefault && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    
                    <div className="relative">
                      <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Title and Category */}
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {template.name}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(template.category)}`}>
                      {template.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {template.description}
                  </p>
                  
                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{template.duration}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Max {template.maxStudents} students</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Video className="h-4 w-4 mr-2" />
                      <span className="capitalize">{template.meetingPlatform}</span>
                    </div>
                  </div>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.hasRecording && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 rounded">
                        Recording
                      </span>
                    )}
                    {template.hasBreakoutRooms && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 rounded">
                        Breakouts
                      </span>
                    )}
                    {template.hasWhiteboard && (
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 rounded">
                        Whiteboard
                      </span>
                    )}
                  </div>
                  
                  {/* Usage Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span>Used {template.usageCount} times</span>
                    <span>Last used {formatDate(template.lastUsed)}</span>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                      Use Template
                    </button>
                    
                    <button className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Copy className="h-4 w-4" />
                    </button>
                    
                    <button className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    
                    <button className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <LayoutTemplate className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No templates found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first template to get started'}
            </p>
            <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Template
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 