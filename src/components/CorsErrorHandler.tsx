import React from 'react';

interface ICorsErrorProps {
  error: Error;
  endpoint?: string;
  origin?: string;
}

export default function CorsErrorHandler({ error, endpoint, origin }: ICorsErrorProps) {
  return (
    <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-white text-2xl">⚠️</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-red-700 dark:text-red-300 mb-2">
            CORS Error Detected
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-red-600 dark:text-red-400 font-medium">Error Message:</p>
              <p className="text-red-700 dark:text-red-300 text-sm mt-1 bg-red-100 dark:bg-red-900/30 p-2 rounded">
                {error.message}
              </p>
            </div>
            
            {endpoint && (
              <div>
                <p className="text-red-600 dark:text-red-400 font-medium">API Endpoint:</p>
                <code className="text-red-700 dark:text-red-300 text-sm mt-1 bg-red-100 dark:bg-red-900/30 p-2 rounded block font-mono">
                  {endpoint}
                </code>
              </div>
            )}
            
            {origin && (
              <div>
                <p className="text-red-600 dark:text-red-400 font-medium">Origin:</p>
                <code className="text-red-700 dark:text-red-300 text-sm mt-1 bg-red-100 dark:bg-red-900/30 p-2 rounded block font-mono">
                  {origin}
                </code>
              </div>
            )}
            
            <div>
              <p className="text-red-600 dark:text-red-400 font-medium">Troubleshooting Steps:</p>
              <ul className="list-disc list-inside text-red-700 dark:text-red-300 text-sm mt-2 space-y-2">
                <li>Check if the server has CORS enabled for your origin</li>
                <li>Verify that the server accepts the HTTP methods you're using</li>
                <li>Ensure authentication headers are being sent correctly</li>
                <li>Check if the server allows credentials if you're using them</li>
                <li>Verify the API endpoint URL is correct</li>
              </ul>
            </div>
            
            <div>
              <p className="text-red-600 dark:text-red-400 font-medium">Server Configuration Example:</p>
              <pre className="text-red-700 dark:text-red-300 text-sm mt-1 bg-red-100 dark:bg-red-900/30 p-3 rounded overflow-x-auto">
                <code>{`
// Node.js/Express Example
app.use(cors({
  origin: '${origin || 'your-frontend-origin'}',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
                `.trim()}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 