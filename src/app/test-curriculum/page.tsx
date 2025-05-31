"use client";

import React, { useState, useEffect } from 'react';
import curriculumService from '@/services/curriculum.service';
import { Play, BookOpen, Clock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

const TestCurriculumPage = () => {
  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');

  const testCurriculumService = async () => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo('Starting curriculum test...\n');
      
      // Test with the quantum computing course ID
      const courseId = "67dce45f3321e3ccc478e271";
      
      setDebugInfo(prev => prev + `Testing course ID: ${courseId}\n`);
      setDebugInfo(prev => prev + `API Base URL: ${process.env.NEXT_PUBLIC_API_URL || 'https://api.medh.co/api/v1'}\n`);
      
      const curriculumData = await curriculumService.getCurriculum({
        courseId,
        studentId: localStorage.getItem('studentId') || '',
        includeProgress: true,
        includeResources: true,
        fallbackToSample: true
      });

      setDebugInfo(prev => prev + `Curriculum fetched successfully!\n`);
      setDebugInfo(prev => prev + `Total lessons: ${curriculumData.totalLessons}\n`);
      setDebugInfo(prev => prev + `Structure type: ${curriculumData.structure_type}\n`);
      
      setCurriculum(curriculumData);
      console.log('Test curriculum data:', curriculumData);
        
    } catch (err) {
      console.error('Error fetching curriculum:', err);
      setError(err.message);
      setDebugInfo(prev => prev + `ERROR: ${err.message}\n`);
      setDebugInfo(prev => prev + `Stack: ${err.stack}\n`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testCurriculumService();
  }, []);

  const handleRetry = () => {
    setCurriculum(null);
    setError(null);
    setDebugInfo('');
    testCurriculumService();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading curriculum...</p>
          <div className="mt-4 bg-white p-4 rounded-lg shadow max-w-md text-left">
            <h3 className="font-medium text-gray-800 mb-2">Debug Info:</h3>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap">{debugInfo}</pre>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-2xl">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <div className="text-red-500 text-xl mb-4">Curriculum Service Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          
          <button
            onClick={handleRetry}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </button>
          
          <div className="mt-6 bg-gray-50 p-4 rounded-lg text-left">
            <h3 className="font-medium text-gray-800 mb-2">Debug Information:</h3>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap max-h-64 overflow-auto">{debugInfo}</pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              ✅ Curriculum Service Test - SUCCESS!
            </h1>
            <button
              onClick={handleRetry}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
          
          {curriculum && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-blue-600 text-sm font-medium">Total Lessons</div>
                  <div className="text-2xl font-bold text-blue-800">
                    {curriculum.totalLessons || 0}
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-green-600 text-sm font-medium">Total Duration</div>
                  <div className="text-2xl font-bold text-green-800">
                    {curriculum.totalDuration || 'N/A'}
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-purple-600 text-sm font-medium">Structure Type</div>
                  <div className="text-2xl font-bold text-purple-800 capitalize">
                    {curriculum.structure_type || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Curriculum Content
                </h2>
                
                {curriculum.weeks && curriculum.weeks.map((week, weekIndex) => (
                  <div key={week._id} className="mb-6 border border-gray-200 rounded-lg">
                    <div className="bg-gray-50 p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                        {week.weekTitle}
                      </h3>
                      {week.weekDescription && (
                        <p className="text-gray-600 mt-2">{week.weekDescription}</p>
                      )}
                      {week.topics && week.topics.length > 0 && (
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-2">
                            {week.topics.map((topic, index) => (
                              <span 
                                key={index}
                                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {week.sections && week.sections.map((section, sectionIndex) => (
                      <div key={section._id} className="p-4">
                        <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center">
                          <div className="w-4 h-4 bg-blue-600 rounded-full mr-2"></div>
                          {section.title}
                        </h4>
                        
                        {section.lessons && section.lessons.map((lesson, lessonIndex) => (
                          <div 
                            key={lesson._id} 
                            className="ml-6 p-3 border border-gray-100 rounded-lg mb-2 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-800 flex items-center">
                                  <Play className="w-4 h-4 mr-2 text-green-600" />
                                  {lesson.title}
                                  {lesson.isPreview && (
                                    <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                      Preview
                                    </span>
                                  )}
                                </h5>
                                
                                {lesson.description && (
                                  <p className="text-gray-600 text-sm mt-1 ml-6">
                                    {lesson.description}
                                  </p>
                                )}
                                
                                <div className="flex items-center gap-4 mt-2 ml-6 text-sm text-gray-500">
                                  {lesson.duration && (
                                    <div className="flex items-center">
                                      <Clock className="w-4 h-4 mr-1" />
                                      {lesson.duration}
                                    </div>
                                  )}
                                  
                                  <div className="flex items-center">
                                    <span className="capitalize">{lesson.lessonType}</span>
                                  </div>
                                  
                                  {lesson.meta?.difficulty && (
                                    <div className="flex items-center">
                                      <span className="capitalize">{lesson.meta.difficulty}</span>
                                    </div>
                                  )}
                                </div>
                                
                                {lesson.learning_objectives && lesson.learning_objectives.length > 0 && (
                                  <div className="ml-6 mt-2">
                                    <div className="text-xs font-medium text-gray-600 mb-1">Learning Objectives:</div>
                                    <ul className="text-xs text-gray-500 space-y-1">
                                      {lesson.learning_objectives.map((objective, index) => (
                                        <li key={index} className="flex items-start">
                                          <CheckCircle className="w-3 h-3 mr-1 mt-0.5 text-green-500 flex-shrink-0" />
                                          {objective}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                
                                {lesson.resources && lesson.resources.length > 0 && (
                                  <div className="ml-6 mt-2">
                                    <div className="text-xs font-medium text-gray-600 mb-1">Resources:</div>
                                    <div className="flex flex-wrap gap-1">
                                      {lesson.resources.map((resource, index) => (
                                        <span 
                                          key={index}
                                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                                        >
                                          {resource.title}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Debug Information
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-xs text-gray-600 whitespace-pre-wrap">{debugInfo}</pre>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Raw Data (for debugging)
          </h2>
          <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-96">
            {JSON.stringify(curriculum, null, 2)}
          </pre>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-800 font-semibold mb-2">Next Steps:</h3>
          <ol className="text-blue-700 text-sm space-y-1">
            <li>1. ✅ Curriculum Service is working!</li>
            <li>2. 🔗 Test the actual course page: <a href="/integrated-lessons/67dce45f3321e3ccc478e271/lecture/67e3e23fe1a0909288719e17/" className="underline">Click here</a></li>
            <li>3. 🔍 Check console for any errors in the actual course page</li>
            <li>4. 📱 Verify the LessonAccordion component displays correctly</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestCurriculumPage; 