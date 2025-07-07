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
      description: "Self-paced learning with instructor support and live doubt sessions",
      icon: BookOpen,
      features: ["Self-paced modules", "Live doubt sessions", "Instructor assignments", "Certification"],
      pricing: "Flexible pricing",
      duration: "4-12 weeks",
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      id: "live",
      title: "Live Course",
      description: "Real-time instructor-led sessions with interactive learning",
      icon: Video,
      features: ["Scheduled live sessions", "Real-time interaction", "Recording available", "Interactive whiteboard"],
      pricing: "Premium pricing",
      duration: "Fixed schedule",
      color: "bg-orange-500",
      lightColor: "bg-orange-50",
      textColor: "text-orange-600"
    },
    {
      id: "free",
      title: "Free Course",
      description: "Open access learning materials with optional certification",
      icon: Gift,
      features: ["Free access", "Self-paced learning", "Video lessons", "Optional certification"],
      pricing: "Completely free",
      duration: "Unlimited access",
      color: "bg-green-500",
      lightColor: "bg-green-50",
      textColor: "text-green-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/dashboards/admin/courses" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors mb-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Course Management
          </Link>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create New Course
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose the type of course you want to create.
            </p>
          </div>
        </div>

        {/* Course Type Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {courseTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            
            return (
              <div
                key={type.id}
                className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                  isSelected 
                    ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setSelectedType(type.id)}
              >
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                )}

                <div className="p-4">
                  {/* Icon and Title */}
                  <div className="flex items-center mb-3">
                    <div className={`p-2 rounded-lg ${type.lightColor} mr-3`}>
                      <Icon className={`h-6 w-6 ${type.textColor}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {type.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {type.duration}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {type.description}
                  </p>

                  {/* Features */}
                  <div className="mb-3">
                    <ul className="space-y-1">
                      {type.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing Info */}
                  <div className={`p-2 rounded-lg ${type.lightColor} border border-gray-200 dark:border-gray-600`}>
                    <p className="text-xs font-medium text-gray-900 dark:text-white">
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                Ready to create your {courseTypes.find(t => t.id === selectedType)?.title}?
              </h3>
              
              <Link
                href={`/dashboards/admin/courses/create/${selectedType}`}
                className="inline-flex items-center justify-center px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm font-medium text-sm"
              >
                Continue to {courseTypes.find(t => t.id === selectedType)?.title} Form
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>

            {/* Additional Info */}
            <div className="flex justify-center space-x-6 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                Auto-save
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                Preview
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                Edit anytime
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h3 className="text-base font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Need help choosing?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Choose Blended if:</h4>
              <ul className="text-blue-700 dark:text-blue-300 space-y-0.5">
                <li>• You want flexibility for learners</li>
                <li>• You need instructor support</li>
                <li>• You have structured curriculum</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Choose Live if:</h4>
              <ul className="text-blue-700 dark:text-blue-300 space-y-0.5">
                <li>• You want real-time interaction</li>
                <li>• You have fixed schedules</li>
                <li>• You need premium pricing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Choose Free if:</h4>
              <ul className="text-blue-700 dark:text-blue-300 space-y-0.5">
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