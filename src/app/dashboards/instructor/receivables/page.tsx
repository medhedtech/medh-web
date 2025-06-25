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
  title: "My Receivables (Receipts/Dues) | Instructor Dashboard - Medh",
  description: "My Receivables (Receipts/Dues) - Manage your my receivables (receipts/dues) efficiently",
};


const ReceivablesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Receivables (Receipts/Dues)
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your my receivables (receipts/dues) efficiently
          </p>
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LucideFileText className="w-5 h-5" />
              My Receivables (Receipts/Dues)
            </CardTitle>
            <CardDescription>
              View and manage your my receivables (receipts/dues)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Add your content here */}
            <div className="text-center py-12">
              <LucideFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                My Receivables (Receipts/Dues) Content
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                This page will contain your my receivables (receipts/dues) management interface.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReceivablesPage;