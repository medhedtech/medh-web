"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Users, Video, Gift, ArrowRight, CheckCircle } from "lucide-react";

export default function CreateCoursePage() {
  const [selectedType, setSelectedType] = useState<string>("");

  const courseTypes = [
    {
      id: "blended",
      title: "Blended Course",
      description: "Combine self-paced learning with instructor support and live doubt sessions",
      icon: BookOpen,
      features: [
        "Self-paced curriculum modules",
        "Scheduled doubt sessions",
        "Instructor assignments",
        "Certification options",
        "Resource downloads",
        "Progress tracking"
      ],
      pricing: "Flexible pricing with individual and batch rates",
      duration: "Typically 4-12 weeks",
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      id: "live",
      title: "Live Course",
      description: "Real-time instructor-led sessions with interactive learning experiences",
      icon: Video,
      features: [
        "Scheduled live sessions",
        "Real-time interaction",
        "Recording availability",
        "Interactive whiteboard",
        "Breakout rooms",
        "Attendance tracking"
      ],
      pricing: "Premium pricing for live instruction",
      duration: "Fixed schedule with specific dates",
      color: "bg-orange-500",
      lightColor: "bg-orange-50",
      textColor: "text-orange-600"
    },
    {
      id: "free",
      title: "Free Course",
      description: "Open access learning materials with optional certification",
      icon: Gift,
      features: [
        "Free access to content",
        "Self-paced learning",
        "Video lessons",
        "Downloadable resources",
        "Optional certification",
        "Community access"
      ],
      pricing: "Completely free for learners",
      duration: "Unlimited access",
      color: "bg-green-500",
      lightColor: "bg-green-50",
      textColor: "text-green-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboards/admin/courses" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Course Management
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Create New Course
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Choose the type of course you want to create. Each type is optimized for different learning experiences and business models.
            </p>
          </div>
        </div>

        {/* Course Type Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {courseTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            
            return (
              <div
                key={type.id}
                className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                  isSelected 
                    ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setSelectedType(type.id)}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                )}

                <div className="p-6">
                  {/* Icon and Title */}
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg ${type.lightColor} mr-4`}>
                      <Icon className={`h-8 w-8 ${type.textColor}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {type.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {type.duration}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {type.description}
                  </p>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Key Features:
                    </h4>
                    <ul className="space-y-2">
                      {type.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing Info */}
                  <div className={`p-3 rounded-lg ${type.lightColor} border border-gray-200 dark:border-gray-600`}>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      Pricing Model:
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {type.pricing}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Button */}
        {selectedType && (
          <div className="text-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Ready to create your {courseTypes.find(t => t.id === selectedType)?.title}?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You'll be taken to a specialized form designed for {selectedType} courses with all the necessary fields and options.
              </p>
              
              <Link
                href={`/dashboards/admin/courses/create/${selectedType}`}
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm font-medium"
              >
                Continue to {courseTypes.find(t => t.id === selectedType)?.title} Form
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Auto-save as you type
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Preview before publishing
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Edit anytime after creation
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Need help choosing?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Choose Blended if:</h4>
              <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                <li>• You want flexibility for learners</li>
                <li>• You need instructor support</li>
                <li>• You have structured curriculum</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Choose Live if:</h4>
              <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                <li>• You want real-time interaction</li>
                <li>• You have fixed schedules</li>
                <li>• You need premium pricing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Choose Free if:</h4>
              <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                <li>• You want to attract new learners</li>
                <li>• You're building a community</li>
                <li>• You have introductory content</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 