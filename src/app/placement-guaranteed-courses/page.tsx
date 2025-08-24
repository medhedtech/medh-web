"use client";

import PlacementGauranteedBanner from "@/components/sections/placement-guaranteed/placement-banner";
import Registration from "@/components/sections/registrations/Registration";
import Certified from "@/components/sections/why-medh/Certified";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import React from "react";
import { HireSectionPlacement } from '@/components/sections/placement-guaranteed/HireSection';
import { WorkProcessPlacement } from '@/components/sections/placement-guaranteed/workProcessPlacement';
import { PlacementBenefits } from '@/components/sections/placement-guaranteed/placementBenefits';
import PlacementFAQ from '@/components/sections/placement-guaranteed/PlacementFAQ';

import PlacementCourseBanner from "@/components/sections/placement-guaranteed/PlacementCourseBanner";
import PlacementCourseDetails from "@/components/sections/placement-guaranteed/placement-course-details";

const PlacementGauranty: React.FC = () => {
  return (
    <PageWrapper>
      <PlacementGauranteedBanner />
      
      {/* MEDH's Triple Advantage - Very Compact Section */}
      <div className="relative z-10 py-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/20 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-20 right-20 w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-6 h-6 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full opacity-20 animate-pulse delay-2000"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="relative bg-gradient-to-r from-white/90 via-blue-50/90 to-indigo-50/90 dark:from-gray-800/90 dark:via-blue-900/30 dark:to-indigo-900/30 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/50 shadow-md p-4 lg:p-6 hover:shadow-lg transition-all duration-500 hover:scale-[1.01]">
            
            {/* Main content */}
            <div className="relative z-10 text-center space-y-4">
              {/* Header with icon */}
              <div className="flex items-center justify-center mb-3">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full shadow-md mb-3">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                    <path d="M19 15L19.74 17.74L22.5 18.5L19.74 19.26L19 22L18.26 19.26L15.5 18.5L18.26 17.74L19 15Z"/>
                    <path d="M5 6L5.74 8.74L8.5 9.5L5.74 10.26L5 13L4.26 10.26L1.5 9.5L4.26 8.74L5 6Z"/>
                  </svg>
                </div>
              </div>
              
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-3">
                MEDH's Triple Advantage
              </h2>
              
              {/* Three advantages */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-3 border border-blue-200/50 dark:border-blue-600/50 hover:shadow-md transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                      <path d="M2 17L12 22L22 17"/>
                      <path d="M2 12L12 17L22 12"/>
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Expert Training</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Industry-leading curriculum with hands-on projects</p>
                </div>
                
                <div className="group bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-3 border border-indigo-200/50 dark:border-indigo-600/50 hover:shadow-md transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 7L10 17L5 12L6.41 10.59L10 14.17L18.59 5.58L20 7Z"/>
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Real-World Internship</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">3-month mandatory internship with industry partners</p>
                </div>
                
                <div className="group bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-3 border border-purple-200/50 dark:border-purple-600/50 hover:shadow-md transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20Z"/>
                      <path d="M12 6C8.69 6 6 8.69 6 12S8.69 18 12 18 18 15.31 18 12 15.31 6 12 6ZM12 16C9.79 16 8 14.21 8 12S9.79 8 12 8 16 9.79 16 12 14.21 16 12 16Z"/>
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Job Guarantee</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">100% placement guarantee or money back</p>
                </div>
              </div>
              
              {/* Main tagline */}
              <div className="space-y-3">
                <p className="text-base md:text-lg lg:text-xl font-bold text-gray-800 dark:text-gray-200 leading-tight">
                  Expert Training, Real-World Internship, and Job Guarantee
                </p>
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full shadow-md">
                  <span className="text-sm md:text-base font-bold">or Get Your Money Back</span>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                  </svg>
                </div>
              </div>
              
              {/* Quote section */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-purple-500/20 backdrop-blur-sm rounded-lg border border-blue-200/40 dark:border-blue-600/40 shadow-md">
                <div className="flex items-center justify-center mb-2">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                </div>
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 italic font-medium text-center leading-relaxed">
                  "Our commitment to your success is backed by our Money Guarantee –
                  we invest in you because we believe in you."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <PlacementCourseDetails />
      <HireSectionPlacement/>
      <WorkProcessPlacement/>
      <PlacementBenefits/>
      <PlacementFAQ />
      <PlacementCourseBanner />
      {/* <SkillsSection /> */}
      {/* <HiringProcess />
      <Registration showUploadField={true} pageTitle="hire_from_medh" />
      <div className="bg-white py-6">
        <Certified />
      </div>
    //   <HireFromMedhFaq />
      <HireFromMedhCourseBanner /> */}
      
    </PageWrapper>
  );
};

export default PlacementGauranty;
