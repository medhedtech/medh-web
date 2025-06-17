"use client";

import React, { useState, useEffect } from 'react';
import { useGetQuery } from '@/hooks';
import { apiUrls } from '@/apis';
import { showToast } from '@/utils/toastManager';

interface Instructor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  hourlyRate?: number;
  totalSessions?: number;
  totalPayouts?: number;
  pendingAmount?: number;
  lastPayout?: {
    amount: number;
    date: string;
  };
}

interface Payment {
  _id: string;
  instructorId: string;
  instructorName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  paymentDate: string;
  description: string;
  referenceNumber?: string;
  createdAt: string;
  updatedAt: string;
}

const InstructorPayouts: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedInstructor, setSelectedInstructor] = useState<string>('all');
  const [paymentStatus, setPaymentStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  
  const { getQuery } = useGetQuery();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would fetch from your API
        // This is a placeholder to simulate data
        await Promise.all([
          fetchInstructors(),
          fetchPayments()
        ]);
      } catch (error) {
        toast.error('Failed to load data');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchInstructors = async () => {
    try {
      const response = await getQuery({ url: apiUrls?.instructors?.getInstructors });
      if (response?.data?.instructors) {
        setInstructors(response.data.instructors);
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
      // Mock data for development
      setInstructors([
        {
          _id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          image: 'https://via.placeholder.com/50',
          hourlyRate: 50,
          totalSessions: 24,
          totalPayouts: 1200,
          pendingAmount: 300
        },
        {
          _id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+0987654321',
          image: 'https://via.placeholder.com/50',
          hourlyRate: 45,
          totalSessions: 18,
          totalPayouts: 810,
          pendingAmount: 225
        }
      ]);
    }
  };

  const fetchPayments = async () => {
    try {
      // In a real implementation, this would fetch from your payment API
      // This is just mock data
      setPayments([
        {
          _id: 'p1',
          instructorId: '1',
          instructorName: 'John Doe',
          amount: 250,
          currency: 'USD',
          status: 'completed',
          paymentMethod: 'Bank Transfer',
          paymentDate: '2023-04-15',
          description: 'Payment for March 2023 sessions',
          referenceNumber: 'TRX123456',
          createdAt: '2023-04-14',
          updatedAt: '2023-04-15'
        },
        {
          _id: 'p2',
          instructorId: '1',
          instructorName: 'John Doe',
          amount: 300,
          currency: 'USD',
          status: 'pending',
          paymentMethod: 'Bank Transfer',
          paymentDate: '2023-05-01',
          description: 'Payment for April 2023 sessions',
          createdAt: '2023-04-30',
          updatedAt: '2023-04-30'
        },
        {
          _id: 'p3',
          instructorId: '2',
          instructorName: 'Jane Smith',
          amount: 225,
          currency: 'USD',
          status: 'completed',
          paymentMethod: 'PayPal',
          paymentDate: '2023-04-10',
          description: 'Payment for March 2023 sessions',
          referenceNumber: 'PP987654',
          createdAt: '2023-04-09',
          updatedAt: '2023-04-10'
        }
      ]);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesInstructor = selectedInstructor === 'all' || payment.instructorId === selectedInstructor;
    const matchesStatus = paymentStatus === 'all' || payment.status === paymentStatus;
    const paymentDate = new Date(payment.paymentDate);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59); // Include the entire end day
    
    const matchesDate = (!dateRange.start || paymentDate >= startDate) && 
                        (!dateRange.end || paymentDate <= endDate);
    
    return matchesInstructor && matchesStatus && matchesDate;
  });

  const handleCreateNewPayout = () => {
    toast.info('Create new payout functionality will be implemented here');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Instructor Payouts Management</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and track all payments to instructors</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button 
            onClick={handleCreateNewPayout}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Payout
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instructor</label>
          <select
            value={selectedInstructor}
            onChange={(e) => setSelectedInstructor(e.target.value)}
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Instructors</option>
            {instructors.map(instructor => (
              <option key={instructor._id} value={instructor._id}>{instructor.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Status</label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From Date</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To Date</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Instructor</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Method</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reference</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {payment.instructorId && instructors.find(i => i._id === payment.instructorId)?.image ? (
                          <img className="h-10 w-10 rounded-full" src={instructors.find(i => i._id === payment.instructorId)?.image} alt="" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">{payment.instructorName.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{payment.instructorName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {instructors.find(i => i._id === payment.instructorId)?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">${payment.amount}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{payment.currency}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {payment.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {payment.referenceNumber || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900 mr-3">View</button>
                    {payment.status === 'pending' && (
                      <>
                        <button className="text-green-600 hover:text-green-900 mr-3">Approve</button>
                        <button className="text-red-600 hover:text-red-900">Decline</button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                  No payment records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Payments</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            ${payments.reduce((sum, payment) => sum + payment.amount, 0)}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Completed Payments</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
            ${payments.filter(p => p.status === 'completed').reduce((sum, payment) => sum + payment.amount, 0)}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Pending Payments</h3>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
            ${payments.filter(p => p.status === 'pending').reduce((sum, payment) => sum + payment.amount, 0)}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Active Instructors</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {instructors.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstructorPayouts; 