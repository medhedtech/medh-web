import React, { useState } from 'react';
import { testCorsConfiguration, generateCorsReport, CorsTestResult } from '@/utils/corsUtils';
import { apiBaseUrl } from '@/apis';

interface CorsReportProps {
  browserInfo: Record<string, string>;
  diagnostics: string[];
  testResults: CorsTestResult;
}

/**
 * Component for testing CORS configuration in development environments
 * This should only be rendered in development mode
 */
const CorsTestPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<CorsTestResult | null>(null);
  const [diagnostics, setDiagnostics] = useState<string[]>([]);
  const [browserInfo, setBrowserInfo] = useState<Record<string, string>>({});

  const handleTestCors = async () => {
    setIsLoading(true);
    try {
      const result = await testCorsConfiguration();
      setTestResult(result);
    } catch (error) {
      console.error('Error testing CORS:', error);
      setTestResult({
        success: false,
        message: 'Error testing CORS',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFullDiagnostic = async () => {
    setIsLoading(true);
    try {
      const report = await generateCorsReport();
      setTestResult(report.testResults);
      setDiagnostics(report.diagnostics);
      setBrowserInfo(report.browserInfo);
    } catch (error) {
      console.error('Error generating CORS report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Only show the panel if we're in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 bg-gray-800 text-white p-2 rounded-md text-xs z-50"
      >
        Test CORS
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-300 rounded-md shadow-lg p-4 w-96 z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-800 font-semibold">CORS Configuration Tester</h3>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Target API: {apiBaseUrl}</p>
        <div className="flex space-x-2">
          <button
            onClick={handleTestCors}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2 rounded"
          >
            {isLoading ? 'Testing...' : 'Quick Test'}
          </button>
          
          <button
            onClick={handleFullDiagnostic}
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-600 text-white text-xs py-1 px-2 rounded"
          >
            {isLoading ? 'Testing...' : 'Full Diagnostic'}
          </button>
        </div>
      </div>
      
      {testResult && (
        <div className={`p-3 rounded-md mb-3 text-sm ${testResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <p className="font-medium">{testResult.message}</p>
          {testResult.error && <p className="mt-1 text-xs">{testResult.error}</p>}
        </div>
      )}
      
      {testResult?.details && (
        <div className="mb-3">
          <h4 className="text-xs font-medium text-gray-700 mb-1">CORS Headers</h4>
          <div className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-20">
            {Object.entries(testResult.details).map(([key, value]) => (
              <div key={key} className="mb-1">
                <span className="font-mono">{key}:</span> <span className={value ? 'text-green-600' : 'text-red-600'}>{value || 'Not present'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {diagnostics.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-medium text-gray-700 mb-1">Diagnostic Results</h4>
          <ul className="text-xs bg-yellow-50 p-2 rounded overflow-auto max-h-24">
            {diagnostics.map((issue, index) => (
              <li key={index} className="mb-1 text-yellow-800">• {issue}</li>
            ))}
          </ul>
        </div>
      )}
      
      {Object.keys(browserInfo).length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-medium text-gray-700 mb-1">Environment Info</h4>
          <div className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-20">
            {Object.entries(browserInfo).map(([key, value]) => (
              <div key={key} className="mb-1">
                <span className="font-mono">{key}:</span> {value}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-500">
        <p>This panel is only visible in development mode.</p>
      </div>
    </div>
  );
};

export default CorsTestPanel; 