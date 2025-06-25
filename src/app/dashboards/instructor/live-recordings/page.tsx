import React from 'react';
import { Metadata } from 'next';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  LucideBook,
  LucideUsers,
  LucideCalendar,
  LucideBarChart,
  LucideSettings,
  LucideFileText,
  LucideVideo,
  LucideClipboardList,
  LucideGraduationCap,
  LucideDollarSign,
  LucideMessageSquare,
  LucideUpload,
  LucideDownload,
  LucideEye,
  LucideEdit,
  LucidePlus,
  LucideRefreshCw,
  LucideFilter,
  LucideSearch
} from 'lucide-react';

export const metadata: Metadata = {
  title: "Recorded Live Sessions | Instructor Dashboard - Medh",
  description: "Recorded Live Sessions - Manage your recorded live sessions efficiently",
};


const recordedLiveSessionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Recorded Live Sessions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your recorded live sessions efficiently
          </p>
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LucideFileText className="w-5 h-5" />
              Recorded Live Sessions
            </CardTitle>
            <CardDescription>
              View and manage your recorded live sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Add your content here */}
            <div className="text-center py-12">
              <LucideFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Recorded Live Sessions Content
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                This page will contain your recorded live sessions management interface.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default recordedLiveSessionsPage;