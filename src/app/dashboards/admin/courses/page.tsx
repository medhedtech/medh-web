"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm py-6 px-8">
        <h1 className="text-3xl font-bold text-indigo-800">Course Admin Panel</h1>
        <p className="text-gray-600 mt-2">Manage your courses and content</p>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-10">
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-5">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              href="/dashboards/admin/courses/create" 
              className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Create New Course</h3>
              </div>
              <p className="text-gray-600">Add a new course to the platform</p>
            </Link>
            
            <Link 
              href="/dashboards/admin/courses/manage" 
              className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Manage Courses</h3>
              </div>
              <p className="text-gray-600">View and edit existing courses</p>
            </Link>
            
            <Link 
              href="/dashboards/admin/settings" 
              className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Settings</h3>
              </div>
              <p className="text-gray-600">Configure admin settings</p>
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-5">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Courses</h3>
              <p className="text-3xl font-bold text-indigo-700 mt-1">0</p>
              <div className="mt-2 text-green-600 text-sm">Ready to add your first course</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Active Courses</h3>
              <p className="text-3xl font-bold text-indigo-700 mt-1">0</p>
              <div className="mt-2 text-gray-600 text-sm">No active courses yet</div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Draft Courses</h3>
              <p className="text-3xl font-bold text-indigo-700 mt-1">0</p>
              <div className="mt-2 text-gray-600 text-sm">No draft courses yet</div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Students</h3>
              <p className="text-3xl font-bold text-indigo-700 mt-1">0</p>
              <div className="mt-2 text-gray-600 text-sm">No students enrolled yet</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 