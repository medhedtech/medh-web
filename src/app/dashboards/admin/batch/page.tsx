"use client";

import React, { useState, useMemo, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, Filter, Download, RefreshCw } from "lucide-react";
import { useIsClient } from "@/utils/hydration";

// Define type for batch data
interface BatchDataItem {
  name: string;
  value: number;
  color: string;
}

// Diverse color palette for batch groups
const INITIAL_DATA: BatchDataItem[] = [
  { name: "Batch A", value: 120, color: "#38B2AC" },   // Teal
  { name: "Batch B", value: 210, color: "#3182CE" },   // Blue
  { name: "Batch C", value: 180, color: "#805AD5" },   // Purple
  { name: "Batch D", value: 140, color: "#D53F8C" },   // Pink
  { name: "Batch E", value: 90, color: "#E53E3E" },    // Red
  { name: "Batch F", value: 40, color: "#ED8936" },    // Orange
  { name: "Batch G", value: 20, color: "#38A169" },    // Green
];

interface CustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}

const BatchAnalyticsPage = () => {
  const [batchData, setBatchData] = useState<BatchDataItem[]>(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [viewType, setViewType] = useState<"bar" | "pie">("bar");
  const [timeRange, setTimeRange] = useState<string>("last-30-days");
  const [changeValues, setChangeValues] = useState<number[]>([]);
  const isClient = useIsClient();

  // Generate random change values on mount and when batchData changes length
  useEffect(() => {
    if (!isClient) return;
    
    setChangeValues(
      batchData.map(() => Math.abs(Math.floor(Math.random() * 8) + 1))
    );
  }, [batchData.length, isClient]);

  // Simulate data refresh
  const refreshData = () => {
    if (!isClient) return;
    
    setIsLoading(true);
    setTimeout(() => {
      // Randomize data slightly for effect
      const newData = batchData.map(item => ({
        ...item,
        value: item.value + Math.floor(Math.random() * 20) - 10
      }));
      setBatchData(newData);
      // Regenerate change values on refresh
      setChangeValues(
        newData.map(() => Math.abs(Math.floor(Math.random() * 8) + 1))
      );
      setIsLoading(false);
    }, 800);
  };

  // Calculate total students
  const totalStudents = batchData.reduce((sum, item) => sum + item.value, 0);

  // Find largest and smallest batch group
  const largestGroup = useMemo(() => {
    return batchData.reduce((max, item) => max.value > item.value ? max : item, batchData[0]);
  }, [batchData]);
  const smallestGroup = useMemo(() => {
    return batchData.reduce((min, item) => min.value < item.value ? min : item, batchData[0]);
  }, [batchData]);

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: CustomLabelProps) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return percent > 0.05 ? (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
            Batch Analytics
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Distribution of students across different batches
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={refreshData}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 transition-colors"
            disabled={isLoading}
          >
            <RefreshCw size={16} className={`${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none px-4 py-2 pr-8 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-purple-400"
            >
              <option value="last-7-days">Last 7 days</option>
              <option value="last-30-days">Last 30 days</option>
              <option value="last-90-days">Last quarter</option>
              <option value="last-year">Last year</option>
              <option value="all-time">All time</option>
            </select>
            <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
              <h2 className="text-3xl font-bold mt-1">{totalStudents.toLocaleString()}</h2>
            </div>
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Users size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600 dark:text-green-400">
            +1.7% from previous period
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Largest Group</p>
              <h2 className="text-3xl font-bold mt-1">{largestGroup.name}</h2>
            </div>
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Users size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-2 text-sm">
            <span className="text-purple-600 dark:text-purple-400">
              {Math.round((largestGroup.value / totalStudents) * 100)}% of total students
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Smallest Group</p>
              <h2 className="text-3xl font-bold mt-1">{smallestGroup.name}</h2>
            </div>
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Users size={20} className="text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-2 text-sm">
            <span className="text-amber-600 dark:text-amber-400">
              {Math.round((smallestGroup.value / totalStudents) * 100)}% of total students
            </span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Batch Distribution</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden p-1">
              <button 
                onClick={() => setViewType("bar")} 
                className={`px-4 py-1 text-sm rounded-md transition-colors ${viewType === 'bar' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
              >
                Bar
              </button>
              <button 
                onClick={() => setViewType("pie")} 
                className={`px-4 py-1 text-sm rounded-md transition-colors ${viewType === 'pie' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
              >
                Pie
              </button>
            </div>
            <button className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              <Download size={14} />
              <span>Export</span>
            </button>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {viewType === 'bar' ? (
              <BarChart data={batchData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    borderRadius: '8px',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    border: 'none'
                  }} 
                  labelStyle={{ fontWeight: 'bold' }}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[4, 4, 0, 0]}
                >
                  {batchData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={batchData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {batchData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    borderRadius: '8px',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    border: 'none'
                  }}
                />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
        {/* Legend */}
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {batchData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Batch Group Table */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Batch Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Batch</th>
                <th className="text-right py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Students</th>
                <th className="text-right py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Percentage</th>
                <th className="text-right py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {batchData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-right font-medium">{item.value.toLocaleString()}</td>
                  <td className="py-3 px-6 text-right">
                    {((item.value / totalStudents) * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 px-6 text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${index % 3 === 0 ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' : index % 3 === 1 ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400' : 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400'}`}>
                      {index % 3 === 0 ? '↑' : index % 3 === 1 ? '↓' : '→'} {changeValues[index] ?? 0}%
                    </span>
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

export default BatchAnalyticsPage; 