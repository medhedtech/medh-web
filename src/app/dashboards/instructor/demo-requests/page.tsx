"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInstructorApi } from '@/apis/instructor.api';
import { showToast } from '@/utils/toast';
import Preloader from '@/components/shared/others/Preloader';
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
  LucideSearch,
  MonitorPlay,
  CalendarPlus,
  X,
  Loader2
} from 'lucide-react';




interface AcceptRejectDemoClassData {
  // Define your data interface here based on API response
}

const AcceptRejectDemoClassPage: React.FC = () => {
  const [data, setData] = useState<AcceptRejectDemoClassData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // demoId currently being processed
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);
  const [newDemo, setNewDemo] = useState<{studentEmail:string; courseName:string; date:string; time:string}>({studentEmail:'',courseName:'',date:'',time:''});

  // Access demo request APIs
  const { getPendingDemos } = useInstructorApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getPendingDemos();
        const items = Array.isArray(response?.data ?? response) ? (response?.data ?? response) : [];
        setData(items);
        setSearchTerm("");
        setError(null);
      } catch (err: any) {
        console.error('Error fetching accept/reject demo class:', err);
        setError(err?.message || 'Failed to load accept/reject demo class');
        showToast.error('Failed to load accept/reject demo class');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle accept/reject demo
  const handleDemoAction = async (demoId: string, action: 'accepted' | 'rejected') => {
    try {
      setActionLoading(demoId + action);
      await instructorApi.updateDemoStatus(demoId, { status: action });
      showToast.success(`Demo ${action === 'accepted' ? 'accepted' : 'rejected'} successfully`);
      // Refresh list
      const refreshed = await getPendingDemos();
      const items = Array.isArray(refreshed?.data ?? refreshed) ? (refreshed?.data ?? refreshed) : [];
      setData(items);
    } catch (err: any) {
      console.error('Error updating demo status:', err);
      showToast.error(err?.message || 'Something went wrong');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredData = data.filter((d: any) => {
    const term = searchTerm.toLowerCase();
    return (
      d.studentName?.toLowerCase().includes(term) ||
      d.courseName?.toLowerCase().includes(term)
    );
  });

  if (loading) return <Preloader />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 md:p-8"
    >
      <div className="max-w-7xl mx-auto">
        <Card className="p-4 sm:p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col items-center gap-2 text-center mb-4">
              <h1 className="inline-flex items-center justify-center gap-2 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white whitespace-nowrap sm:whitespace-normal">
                <MonitorPlay className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                Demo Class Requests
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Review, accept or reject incoming demo class requests
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto mb-4">
              <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2" onClick={()=>setShowModal(true)}>
                <LucidePlus className="w-4 h-4" />
                Add New
              </button>
              <button className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2" onClick={()=>window.location.reload()}>
                <LucideRefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LucideFileText className="w-5 h-5" />
                    Accept/Reject Demo Class List
                  </CardTitle>
                  <CardDescription>
                    View and manage your demo class requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* List */}
                  <div className="space-y-4">
                    {Array.isArray(filteredData) && filteredData.length > 0 ? (
                      filteredData.map((demo: any) => (
                        <div key={demo.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-100 mb-1">{demo.courseName}</p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">{demo.studentName} • {demo.studentEmail}</p>
                            <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">{demo.scheduledDate} @ {demo.scheduledTime}</p>
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <button
                              className="flex-1 sm:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm flex items-center justify-center gap-1 disabled:opacity-50"
                              disabled={actionLoading===demo.id+'accepted'}
                              onClick={()=>handleDemoAction(demo.id,'accepted')}
                            >
                              {actionLoading===demo.id+'accepted' ? 'Accepting...' : 'Accept'}
                            </button>
                            <button
                              className="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm flex items-center justify-center gap-1 disabled:opacity-50"
                              disabled={actionLoading===demo.id+'rejected'}
                              onClick={()=>handleDemoAction(demo.id,'rejected')}
                            >
                              {actionLoading===demo.id+'rejected' ? 'Rejecting...' : 'Reject'}
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <LucideFileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                          No demo class requests found
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Filters first */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LucideFilter className="w-5 h-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="relative">
                      <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search student or course..."
                        value={searchTerm}
                        onChange={(e)=>setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats second */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LucideBarChart className="w-5 h-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Total</span>
                      <span className="font-semibold">{filteredData.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Card>
      </div>

      {/* Create Demo Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md p-6 relative">
            <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={()=>setShowModal(false)}><X className="w-5 h-5"/></button>
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-4"><CalendarPlus className="w-5 h-5 text-blue-600"/>Schedule Demo Class</h2>
            <div className="space-y-4">
              <input type="email" placeholder="Student Email" className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800" value={newDemo.studentEmail} onChange={e=>setNewDemo({...newDemo,studentEmail:e.target.value})}/>
              <input type="text" placeholder="Course Name" className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800" value={newDemo.courseName} onChange={e=>setNewDemo({...newDemo,courseName:e.target.value})}/>
              <input type="date" className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800" value={newDemo.date} onChange={e=>setNewDemo({...newDemo,date:e.target.value})}/>
              <input type="time" className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800" value={newDemo.time} onChange={e=>setNewDemo({...newDemo,time:e.target.value})}/>
            </div>
            <button disabled={creating} onClick={async()=>{
              if(!newDemo.studentEmail || !newDemo.courseName || !newDemo.date || !newDemo.time){showToast.error('Please fill all fields');return;}
              try{
                setCreating(true);
                await instructorApi.createDemoBooking?.(newDemo as any);
                showToast.success('Demo scheduled');
                setShowModal(false);
                const refreshed=await getPendingDemos();
                setData(Array.isArray(refreshed?.data??refreshed)?(refreshed?.data??refreshed):[]);
              }catch(err:any){
                console.error(err);
                showToast.error(err?.message||'Failed');
              }finally{setCreating(false);} 
            }} className="mt-6 w-full px-4 py-3 rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2">
              {creating && <Loader2 className="w-4 h-4 animate-spin"/>}
              Save
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AcceptRejectDemoClassPage;