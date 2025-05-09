import React from 'react';
import Todo from '@/components/Todo';

export const metadata = {
  title: 'Task Management - Admin Dashboard | Medh',
  description: 'Manage your tasks and to-dos efficiently with Medh task management system',
};

export default function TaskManagementPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Task Management</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Keep track of your tasks and manage your to-do list efficiently
        </p>
      </div>
      
      <Todo />
    </div>
  );
} 