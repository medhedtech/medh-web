"use client";

import React, { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  Star, 
  TrendingUp, 
  Calendar, 
  FileText, 
  Settings,
  UserCheck,
  Mail,
  Phone,
  Zap,
  Activity,
  Target,
  ArrowRight,
  PlusCircle,
  Search
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

const FormSubmissionItem = ({ submission, loading }: {
  submission?: {
    _id: string;
    form_type: string;
    contact_info: {
      full_name: string;
      email: string;
      mobile_number: {
        formatted: string;
      };
      city: string;
      country: string;
    };
    professional_info?: {
      company_name?: string;
      designation?: string;
      industry?: string;
    };
    inquiry_details?: {
      inquiry_type?: string;
      urgency_level?: string;
      budget_range?: string;
      timeline?: string;
    };
    training_requirements?: {
      training_type?: string;
      participants_count?: number;
      budget_range?: string;
      timeline?: string;
    };
    status: string;
    submitted_at: string;
    application_id: string;
  };
  loading?: boolean;
}) => {
  if (loading) {
    return (
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
        <div className="flex items-center justify-between mb-3">
          <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="space-y-2">
          <div className="w-48 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="w-36 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="w-28 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!submission) return null;

  const getFormTypeDisplay = (formType: string) => {
    switch (formType) {
      case 'hire_from_medh_inquiry':
        return { label: 'Hire from MEDH', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400', icon: '👥' };
      case 'corporate_training_inquiry':
        return { label: 'Corporate Training', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', icon: '🏢' };
      case 'book_a_free_demo_session':
        return { label: 'Demo Session', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', icon: '🎯' };
      default:
        return { label: formType, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', icon: '📝' };
    }
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getBudgetDisplay = (budget?: string) => {
    if (!budget) return null;
    const budgetMap: { [key: string]: string } = {
      '10k_50k': '₹10K - ₹50K',
      '50k_1l': '₹50K - ₹1L',
      '1l_5l': '₹1L - ₹5L',
      '5l_10l': '₹5L - ₹10L',
      '10l_plus': '₹10L+',
      'under_50k': 'Under ₹50K',
      'flexible': 'Flexible'
    };
    return budgetMap[budget] || budget;
  };

  const getTimelineDisplay = (timeline?: string) => {
    if (!timeline) return null;
    const timelineMap: { [key: string]: string } = {
      'within_week': 'Within 1 week',
      'within_month': 'Within 1 month',
      'within_quarter': 'Within 3 months',
      'within_6months': 'Within 6 months',
      'flexible': 'Flexible timing'
    };
    return timelineMap[timeline] || timeline;
  };

  const formTypeInfo = getFormTypeDisplay(submission.form_type);
  const urgency = submission.inquiry_details?.urgency_level || 'medium';
  const budget = submission.inquiry_details?.budget_range || submission.training_requirements?.budget_range;
  const timeline = submission.inquiry_details?.timeline || submission.training_requirements?.timeline;

  return (
    <div className="p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{formTypeInfo.icon}</span>
          <h4 className="font-semibold text-gray-900 dark:text-white">
            #{submission.application_id}
          </h4>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${formTypeInfo.color}`}>
            {formTypeInfo.label}
          </span>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(urgency)}`}>
          {urgency.toUpperCase()}
        </span>
      </div>

      {/* Contact Info */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-gray-900 dark:text-white">{submission.contact_info.full_name}</span>
          {submission.professional_info?.company_name && (
            <>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {submission.professional_info.designation} at {submission.professional_info.company_name}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>📧 {submission.contact_info.email}</span>
          <span>📞 {submission.contact_info.mobile_number.formatted}</span>
          <span>📍 {submission.contact_info.city}, {submission.contact_info.country}</span>
        </div>
      </div>

      {/* Key Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        {submission.professional_info?.industry && (
          <div className="text-xs">
            <span className="text-gray-500">Industry:</span>
            <span className="ml-1 font-medium text-gray-700 dark:text-gray-300 capitalize">
              {submission.professional_info.industry}
            </span>
          </div>
        )}
        
        {budget && (
          <div className="text-xs">
            <span className="text-gray-500">Budget:</span>
            <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">
              {getBudgetDisplay(budget)}
            </span>
          </div>
        )}
        
        {timeline && (
          <div className="text-xs">
            <span className="text-gray-500">Timeline:</span>
            <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">
              {getTimelineDisplay(timeline)}
            </span>
          </div>
        )}

        {submission.training_requirements?.participants_count && (
          <div className="text-xs">
            <span className="text-gray-500">Participants:</span>
            <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">
              {submission.training_requirements.participants_count}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Submitted {new Date(submission.submitted_at).toLocaleDateString()}</span>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            submission.status === 'submitted' 
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
          }`}>
            {submission.status.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

const SupportDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalSubmissions: { value: 0, change: 0 },
    hireInquiries: { value: 0, change: 0 },
    corporateTraining: { value: 0, change: 0 },
    demoSessions: { value: 0, change: 0 },
    avgResponseTime: { value: 0, change: 0 },
    pendingReview: { value: 0, change: 0 }
  });

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      setLoading(true);
      
      // Mock data for demonstration based on actual form structure
      setTimeout(() => {
        setStats({
          totalSubmissions: { value: 34, change: 12 },
          hireInquiries: { value: 8, change: 3 },
          corporateTraining: { value: 12, change: 5 },
          demoSessions: { value: 14, change: 4 },
          avgResponseTime: { value: 4.2, change: -0.8 },
          pendingReview: { value: 9, change: -2 }
        });

        setSubmissions([
          {
            _id: '6880e89ebb173ad3f40379cf',
            form_type: 'hire_from_medh_inquiry',
            contact_info: {
              full_name: 'Abhishek Jha',
              email: 'abhijha903@gmail.com',
              mobile_number: { formatted: '+91 919343011613' },
              city: 'Bhopal (M Corp.)',
              country: 'IN'
            },
            professional_info: {
              company_name: 'Tech Solutions Ltd',
              designation: 'HR Manager',
              industry: 'technology'
            },
            inquiry_details: {
              inquiry_type: 'partnership_opportunities',
              urgency_level: 'high',
              budget_range: '10k_50k',
              timeline: 'within_quarter'
            },
            status: 'submitted',
            submitted_at: '2025-01-23T13:50:22.607Z',
            application_id: 'HIR786226212C2BS6'
          },
          {
            _id: '6880e5305ed87ed7ae6f8114',
            form_type: 'corporate_training_inquiry',
            contact_info: {
              full_name: 'Sarah Wilson',
              email: 'sarah.wilson@company.com',
              mobile_number: { formatted: '+91 98765 43210' },
              city: 'Mumbai',
              country: 'IN'
            },
            professional_info: {
              company_name: 'Global Finance Corp',
              designation: 'Learning & Development Head',
              industry: 'finance'
            },
            inquiry_details: {
              urgency_level: 'medium'
            },
            training_requirements: {
              training_type: 'leadership',
              participants_count: 25,
              budget_range: '1l_5l',
              timeline: 'within_6months'
            },
            status: 'submitted',
            submitted_at: '2025-01-23T13:35:44.126Z',
            application_id: 'COR77744138AFZSV8'
          },
          {
            _id: '6880de2038054eb25139d8c6',
            form_type: 'book_a_free_demo_session',
            contact_info: {
              full_name: 'Priya Sharma',
              email: 'priya.sharma@email.com',
              mobile_number: { formatted: '+91 93430 11613' },
              city: 'Delhi',
              country: 'IN'
            },
            inquiry_details: {
              urgency_level: 'low'
            },
            status: 'submitted',
            submitted_at: '2025-01-23T13:05:36.390Z',
            application_id: 'BOO7593640342S7Q9'
          },
          {
            _id: '6880bbaf0d632cc7c0013bfb',
            form_type: 'hire_from_medh_inquiry',
            contact_info: {
              full_name: 'Rajesh Kumar',
              email: 'rajesh.kumar@startup.com',
              mobile_number: { formatted: '+91 91094 96001' },
              city: 'Bangalore',
              country: 'IN'
            },
            professional_info: {
              company_name: 'InnovateTech Startup',
              designation: 'CTO',
              industry: 'technology'
            },
            inquiry_details: {
              inquiry_type: 'talent_acquisition',
              urgency_level: 'urgent',
              budget_range: '50k_1l',
              timeline: 'within_month'
            },
            status: 'submitted',
            submitted_at: '2025-01-23T10:38:39.403Z',
            application_id: 'HIR6711940747T2QD'
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Form Submissions Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage inquiries from hire requests, corporate training, and demo sessions
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <Search className="h-4 w-4 inline mr-2" />
              Search Submissions
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <PlusCircle className="h-4 w-4 inline mr-2" />
              Export Data
            </button>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <StatCard
            icon={<FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
            title="Total Submissions"
            value={loading ? "0" : stats.totalSubmissions.value.toLocaleString()}
            trend={loading ? undefined : `+${stats.totalSubmissions.change}%`}
            color="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
            subtitle="This month"
            loading={loading}
          />
          
          <StatCard
            icon={<Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
            title="Hire Inquiries"
            value={loading ? "0" : stats.hireInquiries.value.toString()}
            trend={loading ? undefined : `+${stats.hireInquiries.change}`}
            color="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
            subtitle="Talent requests"
            loading={loading}
          />

          <StatCard
            icon={<Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
            title="Corporate Training"
            value={loading ? "0" : stats.corporateTraining.value.toString()}
            trend={loading ? undefined : `+${stats.corporateTraining.change}`}
            color="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
            subtitle="Training requests"
            loading={loading}
          />

          <StatCard
            icon={<Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />}
            title="Demo Sessions"
            value={loading ? "0" : stats.demoSessions.value.toString()}
            trend={loading ? undefined : `+${stats.demoSessions.change}`}
            color="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
            subtitle="Demo bookings"
            loading={loading}
          />

          <StatCard
            icon={<Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />}
            title="Avg Response Time"
            value={loading ? "0" : `${stats.avgResponseTime.value}h`}
            trend={loading ? undefined : `${stats.avgResponseTime.change}h`}
            color="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20"
            subtitle="Last 30 days"
            loading={loading}
          />

          <StatCard
            icon={<AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />}
            title="Pending Review"
            value={loading ? "0" : stats.pendingReview.value.toString()}
            trend={loading ? undefined : `${stats.pendingReview.change}`}
            color="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20"
            subtitle="Needs attention"
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
              icon={<FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
              title="All Submissions"
              href="/admin/submissions"
              color="hover:bg-blue-50 dark:hover:bg-blue-900/20"
            />
            
            <QuickActionButton
              icon={<Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
              title="Hire Requests"
              href="/admin/submissions?type=hire"
              color="hover:bg-purple-50 dark:hover:bg-purple-900/20"
            />
            
            <QuickActionButton
              icon={<Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
              title="Corporate Training"
              href="/admin/submissions?type=corporate"
              color="hover:bg-blue-50 dark:hover:bg-blue-900/20"
            />
            
            <QuickActionButton
              icon={<Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />}
              title="Demo Sessions"
              href="/admin/submissions?type=demo"
              color="hover:bg-green-50 dark:hover:bg-green-900/20"
            />
            
            <QuickActionButton
              icon={<TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
              title="Analytics"
              href="/admin/analytics"
              color="hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            />
            
            <QuickActionButton
              icon={<Settings className="h-6 w-6 text-gray-600 dark:text-gray-400" />}
              title="Export Data"
              href="/admin/export"
              color="hover:bg-gray-50 dark:hover:bg-gray-900/20"
            />
          </div>
        </div>

        {/* Recent Submissions and Team Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Submissions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Submissions</h2>
                <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center">
                  View all
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <FormSubmissionItem key={index} loading={loading} />
                ))
              ) : (
                submissions.map((submission) => (
                  <FormSubmissionItem key={submission._id} submission={submission} />
                ))
              )}
            </div>
          </div>

          {/* Team Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Team Performance</h2>
            </div>
            
            <div className="p-6 space-y-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                      <div>
                        <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
                        <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                ))
              ) : (
                [
                  { name: 'Sarah Wilson', role: 'Senior Agent', resolved: 18, rating: 4.9 },
                  { name: 'David Kim', role: 'Support Agent', resolved: 15, rating: 4.7 },
                  { name: 'Lisa Chen', role: 'Technical Lead', resolved: 12, rating: 4.8 }
                ].map((agent, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                        {agent.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{agent.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{agent.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">{agent.resolved}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-500">{agent.rating}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Form Types Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Form Types Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <div className="p-3 bg-purple-100 dark:bg-purple-800/50 rounded-lg">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Hire from MEDH</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Talent acquisition requests</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">Partnership opportunities</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="p-3 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
                <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Corporate Training</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Custom training programs</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Enterprise solutions</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="p-3 bg-green-100 dark:bg-green-800/50 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Demo Sessions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Free course previews</p>
                <p className="text-xs text-green-600 dark:text-green-400">Student enrollment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportDashboard;