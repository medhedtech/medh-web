"use client";

import React from "react";
import dynamic from 'next/dynamic';
import Link from "next/link";
import { FaArrowLeft, FaChartLine } from "react-icons/fa";

const OnlineClass = dynamic(
  () => import('@/components/layout/main/dashboards/OnlineClass'),
  { ssr: false }
);

export default function DemoDigitalMarketingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboards/admin/online-class/Demo"
              className="w-12 h-12 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl flex items-center justify-center transition-colors duration-200 group"
            >
              <FaArrowLeft className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200" />
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 p-0.5">
                <div className="w-full h-full bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                  <FaChartLine className="text-2xl text-gray-700 dark:text-gray-300" />
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Demo Classes - Digital Marketing
                  </h1>
                  <span className="text-2xl">📈</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  free trial sessions for digital marketing courses
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <OnlineClass 
        categoryFilter="Digital Marketing with Data Analytics" 
        sessionTypeFilter="demo"
        pageTitle="Demo Classes - Digital Marketing"
      />
    </div>
  );
} 