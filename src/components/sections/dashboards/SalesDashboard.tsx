"use client";

import React, { useState, useEffect } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target, 
  Phone, 
  Mail, 
  Calendar, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Star, 
  Activity,
  BarChart3,
  UserPlus,
  ArrowRight,
  PlusCircle,
  Search,
  Filter,
  Download,
  Eye,
  Edit
} from "lucide-react";
import { motion } from "framer-motion";

const StatCard = ({ icon, title, value, trend, color, subtitle, loading }: { 
  icon: React.ReactNode;
  title: string;
  value: string;
  trend?: string;
  color: string;
  subtitle?: string;
  loading?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`${color} rounded-2xl p-6 border border-gray-100 dark:border-gray-700`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        {icon}
      </div>
      {trend && !loading && (
        <span className={`text-sm font-semibold ${trend.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {trend}
        </span>
      )}
      {loading && (
        <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      )}
    </div>
    <div className="space-y-2">
      {loading ? (
        <>
          <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </>
      ) : (
        <>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{title}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-500">{subtitle}</p>
          )}
        </>
      )}
    </div>
  </motion.div>
);

const QuickActionButton = ({ icon, title, href, color, badge }: {
  icon: React.ReactNode;
  title: string;
  href: string;
  color: string;
  badge?: string;
}) => (
  <div 
    className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] h-full relative ${color}`}
    onClick={() => window.open(href, '_blank')}
  >
    {badge && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
        {badge}
      </span>
    )}
    <div className="mb-3">
      {icon}
    </div>
    <p className="text-sm font-semibold text-center text-gray-900 dark:text-white">{title}</p>
  </div>
);

const LeadItem = ({ lead, loading }: {
  lead?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    course_interest: string;
    status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    created_at: string;
    last_contact?: string;
  };
  loading?: boolean;
}) => {
  if (loading) {
    return (
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
        <div className="flex items-center justify-between mb-2">
          <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
        <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!lead) return null;

  const statusColors = {
    new: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    contacted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    qualified: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    converted: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    lost: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    urgent: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  };

  return (
    <div className="p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900 dark:text-white">{lead.name}</h4>
        <div className="flex gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[lead.priority]}`}>
            {lead.priority.toUpperCase()}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[lead.status]}`}>
            {lead.status.toUpperCase()}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{lead.course_interest}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{lead.email}</span>
        <span>{new Date(lead.created_at).toLocaleDateString()}</span>
      </div>
      <div className="flex gap-2 mt-2">
        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
          <Phone className="h-3 w-3" />
        </button>
        <button className="p-1 text-green-600 hover:bg-green-50 rounded">
          <Mail className="h-3 w-3" />
        </button>
        <button className="p-1 text-purple-600 hover:bg-purple-50 rounded">
          <Eye className="h-3 w-3" />
        </button>
        <button className="p-1 text-orange-600 hover:bg-orange-50 rounded">
          <Edit className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

const SalesDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalLeads: { value: 0, change: 0 },
    qualifiedLeads: { value: 0, change: 0 },
    conversions: { value: 0, change: 0 },
    revenue: { value: 0, change: 0 },
    monthlyTarget: { value: 0, change: 0 },
    callsToday: { value: 0, change: 0 }
  });

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      setLoading(true);
      
      // Mock data for demonstration
      setTimeout(() => {
        setStats({
          totalLeads: { value: 847, change: 23 },
          qualifiedLeads: { value: 186, change: 15 },
          conversions: { value: 42, change: 8 },
          revenue: { value: 125000, change: 18 },
          monthlyTarget: { value: 85, change: 5 },
          callsToday: { value: 28, change: 12 }
        });

        setLeads([
          {
            id: 'LEAD-2024-001',
            name: 'Sarah Mitchell',
            email: 'sarah.mitchell@example.com',
            phone: '+1 (555) 123-4567',
            course_interest: 'Advanced JavaScript Development',
            status: 'new' as const,
            priority: 'high' as const,
            created_at: '2024-01-15T10:30:00Z',
            last_contact: ''
          },
          {
            id: 'LEAD-2024-002',
            name: 'David Chen',
            email: 'david.chen@company.com',
            phone: '+1 (555) 234-5678',
            course_interest: 'Data Science Bootcamp',
            status: 'contacted' as const,
            priority: 'urgent' as const,
            created_at: '2024-01-14T16:45:00Z',
            last_contact: '2024-01-15T09:15:00Z'
          },
          {
            id: 'LEAD-2024-003',
            name: 'Emily Rodriguez',
            email: 'emily.r@startup.com',
            phone: '+1 (555) 345-6789',
            course_interest: 'UX/UI Design Masterclass',
            status: 'qualified' as const,
            priority: 'medium' as const,
            created_at: '2024-01-13T14:20:00Z',
            last_contact: '2024-01-14T11:30:00Z'
          },
          {
            id: 'LEAD-2024-004',
            name: 'Michael Brown',
            email: 'mike.brown@tech.com',
            phone: '+1 (555) 456-7890',
            course_interest: 'Cloud Computing Certification',
            status: 'converted' as const,
            priority: 'low' as const,
            created_at: '2024-01-12T09:10:00Z',
            last_contact: '2024-01-13T15:45:00Z'
          }
        ]);

        setLoading(false);
      }, 1500);
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sales Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track leads, manage pipeline, and achieve your sales targets
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <Filter className="h-4 w-4 inline mr-2" />
              Filter
            </button>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              <PlusCircle className="h-4 w-4 inline mr-2" />
              Add Lead
            </button>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <StatCard
            icon={<Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
            title="Total Leads"
            value={loading ? "0" : stats.totalLeads.value.toLocaleString()}
            trend={loading ? undefined : `+${stats.totalLeads.change}%`}
            color="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
            subtitle="This month"
            loading={loading}
          />
          
          <StatCard
            icon={<UserPlus className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
            title="Qualified Leads"
            value={loading ? "0" : stats.qualifiedLeads.value.toString()}
            trend={loading ? undefined : `+${stats.qualifiedLeads.change}%`}
            color="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
            subtitle="Ready to convert"
            loading={loading}
          />

          <StatCard
            icon={<CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />}
            title="Conversions"
            value={loading ? "0" : stats.conversions.value.toString()}
            trend={loading ? undefined : `+${stats.conversions.change}%`}
            color="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
            subtitle="This month"
            loading={loading}
          />

          <StatCard
            icon={<DollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />}
            title="Revenue"
            value={loading ? "$0" : `$${(stats.revenue.value / 1000).toFixed(0)}K`}
            trend={loading ? undefined : `+${stats.revenue.change}%`}
            color="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20"
            subtitle="This month"
            loading={loading}
          />

          <StatCard
            icon={<Target className="h-6 w-6 text-orange-600 dark:text-orange-400" />}
            title="Target Achievement"
            value={loading ? "0%" : `${stats.monthlyTarget.value}%`}
            trend={loading ? undefined : `+${stats.monthlyTarget.change}%`}
            color="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20"
            subtitle="Monthly goal"
            loading={loading}
          />

          <StatCard
            icon={<Phone className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
            title="Calls Today"
            value={loading ? "0" : stats.callsToday.value.toString()}
            trend={loading ? undefined : `+${stats.callsToday.change}`}
            color="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20"
            subtitle="Great work!"
            loading={loading}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <QuickActionButton
              icon={<PlusCircle className="h-6 w-6 text-green-600 dark:text-green-400" />}
              title="Add Lead"
              href="/sales/leads/new"
              color="hover:bg-green-50 dark:hover:bg-green-900/20"
            />
            
            <QuickActionButton
              icon={<Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
              title="All Leads"
              href="/sales/leads"
              color="hover:bg-blue-50 dark:hover:bg-blue-900/20"
            />
            
            <QuickActionButton
              icon={<BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
              title="Pipeline"
              href="/sales/pipeline"
              color="hover:bg-purple-50 dark:hover:bg-purple-900/20"
            />
            
            <QuickActionButton
              icon={<TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />}
              title="Analytics"
              href="/sales/analytics"
              color="hover:bg-orange-50 dark:hover:bg-orange-900/20"
            />
            
            <QuickActionButton
              icon={<Calendar className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
              title="Schedule"
              href="/sales/calendar"
              color="hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            />
            
            <QuickActionButton
              icon={<Download className="h-6 w-6 text-gray-600 dark:text-gray-400" />}
              title="Reports"
              href="/sales/reports"
              color="hover:bg-gray-50 dark:hover:bg-gray-900/20"
            />
          </div>
        </div>

        {/* Recent Leads and Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Leads */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Leads</h2>
                <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center">
                  View all
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <LeadItem key={index} loading={loading} />
                ))
              ) : (
                leads.map((lead) => (
                  <LeadItem key={lead.id} lead={lead} />
                ))
              )}
            </div>
          </div>

          {/* Sales Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sales Performance</h2>
            </div>
            
            <div className="p-6 space-y-4">
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                ))
              ) : (
                [
                  { label: 'Conversion Rate', value: '15.2%', color: 'text-green-600' },
                  { label: 'Avg. Deal Value', value: '$2,980', color: 'text-blue-600' },
                  { label: 'Pipeline Value', value: '$485K', color: 'text-purple-600' },
                  { label: 'Win Rate', value: '68%', color: 'text-orange-600' }
                ].map((metric, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{metric.label}</span>
                    <span className={`font-semibold ${metric.color}`}>{metric.value}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Course Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Top Performing Courses</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                  <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
                  <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))
            ) : (
              [
                { name: 'Full Stack Development', leads: 156, conversions: 28, rate: '18%' },
                { name: 'Data Science Bootcamp', leads: 134, conversions: 22, rate: '16%' },
                { name: 'UX/UI Design', leads: 98, conversions: 14, rate: '14%' }
              ].map((course, index) => (
                <div key={index} className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{course.name}</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Leads:</span>
                      <span className="font-medium">{course.leads}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Conversions:</span>
                      <span className="font-medium text-green-600">{course.conversions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Rate:</span>
                      <span className="font-semibold text-blue-600">{course.rate}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;