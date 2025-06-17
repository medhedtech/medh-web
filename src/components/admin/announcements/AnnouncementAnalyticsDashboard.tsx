import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Users, Eye, MessageSquare, TrendingUp, Target, Clock, 
  CheckCircle, AlertCircle, UserCheck, Mail, Bell
} from 'lucide-react';
import {
  getAnnouncementAnalytics,
  getAnnouncementReadStatus,
  getAnnouncementTargeting,
  getAllAnnouncements,
  IAnnouncementAnalytics,
  IAnnouncement,
  getTargetingDescription,
  formatStudentList
} from '@/apis/announcements';

const AnnouncementAnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<IAnnouncementAnalytics | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<IAnnouncement | null>(null);
  const [readStatus, setReadStatus] = useState<any>(null);
  const [targeting, setTargeting] = useState<any>(null);
  const [recentAnnouncements, setRecentAnnouncements] = useState<IAnnouncement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (selectedAnnouncement) {
      loadAnnouncementDetails(selectedAnnouncement._id);
    }
  }, [selectedAnnouncement]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [analyticsRes, announcementsRes] = await Promise.all([
        getAnnouncementAnalytics(),
        getAllAnnouncements({ limit: 10, sortBy: 'createdAt', sortOrder: 'desc' })
      ]);

      if (analyticsRes.status === 'success') {
        setAnalytics(analyticsRes.data);
      }

      if (announcementsRes.status === 'success') {
        setRecentAnnouncements(announcementsRes.data.announcements);
        if (announcementsRes.data.announcements.length > 0) {
          setSelectedAnnouncement(announcementsRes.data.announcements[0]);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAnnouncementDetails = async (announcementId: string) => {
    try {
      const [readStatusRes, targetingRes] = await Promise.all([
        getAnnouncementReadStatus(announcementId),
        getAnnouncementTargeting(announcementId)
      ]);

      if (readStatusRes.status === 'success') {
        setReadStatus(readStatusRes.data);
      }

      if (targetingRes.status === 'success') {
        setTargeting(targetingRes.data);
      }
    } catch (error) {
      console.error('Error loading announcement details:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Failed to load analytics data</p>
      </div>
    );
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Announcement Analytics Dashboard</h1>
        <p className="text-gray-600">
          Comprehensive insights into announcement performance, targeting, and user engagement
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Announcements</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalAnnouncements}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalViews.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reads</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalReads.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Read Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.averageReadRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Announcements by Type */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Announcements by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.byType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, count }) => `${type}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {analytics.byType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Announcements by Priority */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Announcements by Priority</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.byPriority}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="priority" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics.recentActivity}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="created" stroke="#3B82F6" name="Created" />
            <Line type="monotone" dataKey="published" stroke="#10B981" name="Published" />
            <Line type="monotone" dataKey="views" stroke="#F59E0B" name="Views" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Announcements */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Announcements</h3>
          <div className="space-y-3">
            {recentAnnouncements.map((announcement) => (
              <div
                key={announcement._id}
                onClick={() => setSelectedAnnouncement(announcement)}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedAnnouncement?._id === announcement._id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{announcement.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {getTargetingDescription(announcement)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        announcement.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        announcement.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        announcement.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {announcement.priority}
                      </span>
                      <span className="text-xs text-gray-500">
                        {announcement.viewCount} views
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Announcement Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedAnnouncement && (
            <>
              {/* Announcement Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedAnnouncement.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Created by {selectedAnnouncement.author.full_name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      selectedAnnouncement.status === 'published' ? 'bg-green-100 text-green-800' :
                      selectedAnnouncement.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      selectedAnnouncement.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedAnnouncement.status}
                    </span>
                    {selectedAnnouncement.isSticky && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                        Sticky
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{selectedAnnouncement.content}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Type:</span>
                    <span className="ml-2 text-gray-900">{selectedAnnouncement.type}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Priority:</span>
                    <span className="ml-2 text-gray-900">{selectedAnnouncement.priority}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Views:</span>
                    <span className="ml-2 text-gray-900">{selectedAnnouncement.viewCount}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Reads:</span>
                    <span className="ml-2 text-gray-900">{selectedAnnouncement.readCount || 0}</span>
                  </div>
                </div>
              </div>

              {/* Targeting Details */}
              {targeting && (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Targeting Details</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">General Audience</h4>
                      <div className="space-y-1">
                        {targeting.generalAudience.map((audience: string) => (
                          <span key={audience} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm mr-2">
                            {audience}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Specific Students</h4>
                      {targeting.specificStudents.length > 0 ? (
                        <div className="text-sm text-gray-600">
                          <p className="mb-2">{targeting.specificStudents.length} students targeted:</p>
                          <p>{formatStudentList(targeting.specificStudents, 5)}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No specific students targeted</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Estimated Reach:</span>
                      <span className="text-lg font-bold text-blue-600">
                        {targeting.estimatedReach.toLocaleString()} users
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Read Status */}
              {readStatus && (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Read Status</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {readStatus.summary.totalTargeted}
                      </div>
                      <div className="text-sm text-gray-600">Total Targeted</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {readStatus.summary.totalRead}
                      </div>
                      <div className="text-sm text-gray-600">Read</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {readStatus.summary.totalUnread}
                      </div>
                      <div className="text-sm text-gray-600">Unread</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {readStatus.summary.readPercentage.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Read Rate</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${readStatus.summary.readPercentage}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Top Performing Announcements */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Announcements</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reads
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Read Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Targeting
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.topPerforming.map((announcement) => (
                <tr key={announcement._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{announcement.title}</div>
                    <div className="text-sm text-gray-500">{announcement.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {announcement.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {announcement.viewCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {announcement.readCount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {announcement.viewCount > 0 
                      ? ((announcement.readCount || 0) / announcement.viewCount * 100).toFixed(1)
                      : 0
                    }%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getTargetingDescription(announcement)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementAnalyticsDashboard; 