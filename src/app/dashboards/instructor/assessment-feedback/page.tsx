import React from 'react';
import { Metadata } from 'next';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LucideFileText } from 'lucide-react';

export const metadata: Metadata = {
  title: "Provide/Reply Feedback | Instructor Dashboard - Medh",
  description: "Provide/Reply Feedback - Manage your provide/reply feedback efficiently",
};


const ProvideReplyFeedbackPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Provide/Reply Feedback
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your provide/reply feedback efficiently
          </p>
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LucideFileText className="w-5 h-5" />
              Provide/Reply Feedback
            </CardTitle>
            <CardDescription>
              View and manage your provide/reply feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Add your content here */}
            <div className="text-center py-12">
              <LucideFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Provide/Reply Feedback Content
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                This page will contain your provide/reply feedback management interface.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProvideReplyFeedbackPage;