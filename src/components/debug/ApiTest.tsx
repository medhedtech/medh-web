"use client";

import React, { useState } from 'react';
import { apiUrls } from '@/apis';
import { showToast } from '@/utils/toastManager';

const ApiTest: React.FC = () => {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const url = apiUrls.adminDashboard.getDashboardCount;
      const authToken = localStorage.getItem('token');
      setToken(authToken);
      
      console.log('Testing API URL:', url);
      console.log('Auth Token:', authToken ? 'Present' : 'Missing');
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'x-access-token': authToken || '',
        },
      });

      const data = await response.json();
      console.log('Raw API Response:', data);
      console.log('Response Status:', response.status);
      console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
      
      setResponse({
        status: response.status,
        statusText: response.statusText,
        data: data,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (response.ok) {
        showToast.success('API call successful');
      } else {
        showToast.error(`API call failed: ${response.status}`);
        setError(`HTTP ${response.status}: ${data.message || 'Unknown error'}`);
      }
    } catch (err: any) {
      console.error('API Test Error:', err);
      setError(err.message || 'Network error');
      showToast.error('API test failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">API Debug Test</h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          <strong>Token Status:</strong> {token ? 'Present' : 'Missing'}
        </p>
        <p className="text-sm text-gray-600">
          <strong>API URL:</strong> {apiUrls.adminDashboard.getDashboardCount}
        </p>
      </div>
      
      <button
        onClick={testApi}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Dashboard API'}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">API Response:</h4>
          <div className="mb-2">
            <p><strong>Status:</strong> {response.status} {response.statusText}</p>
          </div>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-96">
            {JSON.stringify(response.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiTest;
