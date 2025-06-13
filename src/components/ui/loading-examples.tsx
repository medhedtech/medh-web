/**
 * Loading Component Usage Examples
 * 
 * This file demonstrates how to use the loading components throughout your website.
 * Copy these examples and adapt them to your specific use cases.
 */

import React, { useState } from 'react';
import { 
  Loading, 
  PageLoading, 
  OverlayLoading, 
  InlineLoading, 
  ButtonLoading 
} from './loading';
import { useLoading, useApiLoading } from '@/contexts/LoadingContext';

// Example 1: Page-level loading (full screen with min-height)
export const PageLoadingExample = () => {
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return <PageLoading text="Loading page content..." size="lg" />;
  }

  return (
    <div className="p-8">
      <h1>Page Content</h1>
      <button 
        onClick={() => setIsLoading(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Show Page Loading
      </button>
    </div>
  );
};

// Example 2: Global overlay loading using context
export const GlobalLoadingExample = () => {
  const { showLoading, hideLoading } = useLoading();

  const handleGlobalLoading = () => {
    showLoading('Processing your request...');
    setTimeout(() => hideLoading(), 3000);
  };

  return (
    <button 
      onClick={handleGlobalLoading}
      className="px-4 py-2 bg-green-500 text-white rounded"
    >
      Show Global Loading
    </button>
  );
};

// Example 3: API call with automatic loading
export const ApiLoadingExample = () => {
  const { withLoading } = useApiLoading();
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const result = await withLoading(
      async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        return { message: 'Data loaded successfully!' };
      },
      'Fetching data from server...'
    );
    setData(result);
  };

  return (
    <div>
      <button 
        onClick={fetchData}
        className="px-4 py-2 bg-purple-500 text-white rounded"
      >
        Fetch Data with Loading
      </button>
      {data && <p className="mt-2">Result: {data.message}</p>}
    </div>
  );
};

// Example 4: Inline loading for components
export const InlineLoadingExample = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-4 border rounded">
      <h3>Component Section</h3>
      {loading ? (
        <InlineLoading text="Loading content..." size="md" />
      ) : (
        <div>
          <p>Content loaded!</p>
          <button 
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 2000);
            }}
            className="px-3 py-1 bg-orange-500 text-white rounded text-sm"
          >
            Reload
          </button>
        </div>
      )}
    </div>
  );
};

// Example 5: Button loading states
export const ButtonLoadingExample = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
  };

  return (
    <button 
      onClick={handleSubmit}
      disabled={isSubmitting}
      className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 flex items-center gap-2"
    >
      {isSubmitting && <ButtonLoading size="sm" />}
      {isSubmitting ? 'Submitting...' : 'Submit Form'}
    </button>
  );
};

// Example 6: Different loading variants
export const LoadingVariantsExample = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      <div className="text-center">
        <h4 className="mb-2">Spinner</h4>
        <Loading variant="spinner" size="lg" />
      </div>
      <div className="text-center">
        <h4 className="mb-2">Dots</h4>
        <Loading variant="dots" size="lg" />
      </div>
      <div className="text-center">
        <h4 className="mb-2">Pulse</h4>
        <Loading variant="pulse" size="lg" />
      </div>
      <div className="text-center">
        <h4 className="mb-2">Bars</h4>
        <Loading variant="bars" size="lg" />
      </div>
    </div>
  );
};

// Example 7: Different sizes
export const LoadingSizesExample = () => {
  return (
    <div className="flex items-center gap-8 p-4">
      <div className="text-center">
        <p className="mb-2">Small</p>
        <Loading size="sm" />
      </div>
      <div className="text-center">
        <p className="mb-2">Medium</p>
        <Loading size="md" />
      </div>
      <div className="text-center">
        <p className="mb-2">Large</p>
        <Loading size="lg" />
      </div>
      <div className="text-center">
        <p className="mb-2">Extra Large</p>
        <Loading size="xl" />
      </div>
    </div>
  );
};

// Example 8: Different colors
export const LoadingColorsExample = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      <div className="text-center">
        <h4 className="mb-2">Primary</h4>
        <Loading color="primary" size="lg" />
      </div>
      <div className="text-center">
        <h4 className="mb-2">Secondary</h4>
        <Loading color="secondary" size="lg" />
      </div>
      <div className="text-center bg-gray-800 p-2 rounded">
        <h4 className="mb-2 text-white">White</h4>
        <Loading color="white" size="lg" />
      </div>
      <div className="text-center">
        <h4 className="mb-2">Gray</h4>
        <Loading color="gray" size="lg" />
      </div>
    </div>
  );
};

// Example 9: Card loading state
export const CardLoadingExample = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {loading ? (
        <div className="space-y-4">
          <div className="flex justify-center">
            <Loading text="Loading card content..." size="md" />
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold mb-2">Card Title</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This is some card content that was loaded.
          </p>
          <button 
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 1500);
            }}
            className="px-4 py-2 bg-indigo-500 text-white rounded"
          >
            Refresh Card
          </button>
        </div>
      )}
    </div>
  );
};

// Example 10: Table loading state
export const TableLoadingExample = () => {
  const [loading, setLoading] = useState(false);
  const [data] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Users Table</h3>
        <button 
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 2000);
          }}
          className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
        >
          Refresh
        </button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={2} className="px-4 py-8">
                  <div className="flex justify-center">
                    <Loading text="Loading table data..." size="md" />
                  </div>
                </td>
              </tr>
            ) : (
              data.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * USAGE INSTRUCTIONS:
 * 
 * 1. Import the loading components you need:
 *    import { Loading, PageLoading, ButtonLoading } from '@/components/ui/loading';
 *    import { useLoading, useApiLoading } from '@/contexts/LoadingContext';
 * 
 * 2. For page-level loading:
 *    if (loading) return <PageLoading text="Loading..." size="lg" />;
 * 
 * 3. For global overlay loading:
 *    const { showLoading, hideLoading } = useLoading();
 *    showLoading('Processing...');
 * 
 * 4. For API calls with automatic loading:
 *    const { withLoading } = useApiLoading();
 *    const result = await withLoading(apiCall, 'Loading data...');
 * 
 * 5. For inline component loading:
 *    {loading ? <Loading size="md" /> : <YourContent />}
 * 
 * 6. For button loading states:
 *    <button disabled={loading}>
 *      {loading && <ButtonLoading />}
 *      {loading ? 'Loading...' : 'Click me'}
 *    </button>
 */ 