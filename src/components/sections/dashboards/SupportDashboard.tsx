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

const TicketItem = ({ ticket, loading }: {
  ticket?: {
    id: string;
    subject: string;
    customer: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'open' | 'pending' | 'resolved' | 'closed';
    created_at: string;
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

  if (!ticket) return null;

  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    urgent: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  };

  const statusColors = {
    open: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    resolved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  };

  return (
    <div className="p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900 dark:text-white truncate">#{ticket.id}</h4>
        <div className="flex gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[ticket.priority]}`}>
            {ticket.priority.toUpperCase()}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[ticket.status]}`}>
            {ticket.status.toUpperCase()}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">{ticket.subject}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>by {ticket.customer}</span>
        <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

const SupportDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalTickets: { value: 0, change: 0 },
    openTickets: { value: 0, change: 0 },
    avgResponseTime: { value: 0, change: 0 },
    customerSatisfaction: { value: 0, change: 0 },
    resolvedToday: { value: 0, change: 0 },
    pendingTickets: { value: 0, change: 0 }
  });

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      setLoading(true);
      
      // Mock data for demonstration
      setTimeout(() => {
        setStats({
          totalTickets: { value: 2847, change: 12 },
          openTickets: { value: 156, change: -8 },
          avgResponseTime: { value: 2.4, change: -0.3 },
          customerSatisfaction: { value: 4.8, change: 0.2 },
          resolvedToday: { value: 24, change: 6 },
          pendingTickets: { value: 43, change: -2 }
        });

        setTickets([
          {
            id: 'SUP-2024-001',
            subject: 'Unable to access course materials',
            customer: 'Sarah Johnson',
            priority: 'high' as const,
            status: 'open' as const,
            created_at: '2024-01-15T10:30:00Z'
          },
          {
            id: 'SUP-2024-002', 
            subject: 'Payment not reflecting in account',
            customer: 'Mike Chen',
            priority: 'urgent' as const,
            status: 'pending' as const,
            created_at: '2024-01-15T09:15:00Z'
          },
          {
            id: 'SUP-2024-003',
            subject: 'Video quality issues in live session',
            customer: 'Emma Davis',
            priority: 'medium' as const,
            status: 'open' as const,
            created_at: '2024-01-14T16:45:00Z'
          },
          {
            id: 'SUP-2024-004',
            subject: 'Certificate not generated after completion',
            customer: 'Alex Thompson',
            priority: 'low' as const,
            status: 'resolved' as const,
            created_at: '2024-01-14T14:20:00Z'
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Support Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage customer support tickets and monitor team performance
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <Search className="h-4 w-4 inline mr-2" />
              Search Tickets
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <PlusCircle className="h-4 w-4 inline mr-2" />
              New Ticket
            </button>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <StatCard
            icon={<MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
            title="Total Tickets"
            value={loading ? "0" : stats.totalTickets.value.toLocaleString()}
            trend={loading ? undefined : `+${stats.totalTickets.change}%`}
            color="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
            subtitle="All time"
            loading={loading}
          />
          
          <StatCard
            icon={<AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />}
            title="Open Tickets"
            value={loading ? "0" : stats.openTickets.value.toString()}
            trend={loading ? undefined : `${stats.openTickets.change}%`}
            color="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20"
            subtitle="Needs attention"
            loading={loading}
          />

          <StatCard
            icon={<Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
            title="Avg Response Time"
            value={loading ? "0" : `${stats.avgResponseTime.value}h`}
            trend={loading ? undefined : `${stats.avgResponseTime.change}h`}
            color="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
            subtitle="Last 30 days"
            loading={loading}
          />

          <StatCard
            icon={<Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />}
            title="Customer Satisfaction"
            value={loading ? "0" : `${stats.customerSatisfaction.value}/5`}
            trend={loading ? undefined : `+${stats.customerSatisfaction.change}`}
            color="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20"
            subtitle="Average rating"
            loading={loading}
          />

          <StatCard
            icon={<CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />}
            title="Resolved Today"
            value={loading ? "0" : stats.resolvedToday.value.toString()}
            trend={loading ? undefined : `+${stats.resolvedToday.change}`}
            color="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
            subtitle="Great work!"
            loading={loading}
          />

          <StatCard
            icon={<Activity className="h-6 w-6 text-red-600 dark:text-red-400" />}
            title="Pending Tickets"
            value={loading ? "0" : stats.pendingTickets.value.toString()}
            trend={loading ? undefined : `${stats.pendingTickets.change}`}
            color="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20"
            subtitle="Awaiting response"
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
              icon={<MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
              title="All Tickets"
              href="/support/tickets"
              color="hover:bg-blue-50 dark:hover:bg-blue-900/20"
            />
            
            <QuickActionButton
              icon={<PlusCircle className="h-6 w-6 text-green-600 dark:text-green-400" />}
              title="Create Ticket"
              href="/support/tickets/new"
              color="hover:bg-green-50 dark:hover:bg-green-900/20"
            />
            
            <QuickActionButton
              icon={<Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
              title="Customers"
              href="/support/customers"
              color="hover:bg-purple-50 dark:hover:bg-purple-900/20"
            />
            
            <QuickActionButton
              icon={<FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />}
              title="Knowledge Base"
              href="/support/knowledge-base"
              color="hover:bg-orange-50 dark:hover:bg-orange-900/20"
            />
            
            <QuickActionButton
              icon={<TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
              title="Analytics"
              href="/support/analytics"
              color="hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            />
            
            <QuickActionButton
              icon={<Settings className="h-6 w-6 text-gray-600 dark:text-gray-400" />}
              title="Settings"
              href="/support/settings"
              color="hover:bg-gray-50 dark:hover:bg-gray-900/20"
            />
          </div>
        </div>

        {/* Recent Tickets and Team Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Tickets */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Tickets</h2>
                <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center">
                  View all
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <TicketItem key={index} loading={loading} />
                ))
              ) : (
                tickets.map((ticket) => (
                  <TicketItem key={ticket.id} ticket={ticket} />
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

        {/* Contact Channels */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Support Channels</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="p-3 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
                <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Email Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">support@medh.com</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">24/7 Available</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="p-3 bg-green-100 dark:bg-green-800/50 rounded-lg">
                <Phone className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Phone Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
                <p className="text-xs text-green-600 dark:text-green-400">9 AM - 6 PM EST</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <div className="p-3 bg-purple-100 dark:bg-purple-800/50 rounded-lg">
                <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Live Chat</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Instant messaging</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">Average: 2 min response</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportDashboard;