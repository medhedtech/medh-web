import React, { useEffect, useState } from 'react';

interface CorsErrorState {
  isVisible: boolean;
  message: string;
  url: string | null;
}

/**
 * Component that listens for CORS errors and displays a user-friendly message
 */
const CorsErrorHandler: React.FC = () => {
  const [errorState, setErrorState] = useState<CorsErrorState>({
    isVisible: false,
    message: '',
    url: null
  });

  useEffect(() => {
    // Listen for CORS error events
    const handleCorsError = (event: CustomEvent<{ url: string; message: string }>) => {
      setErrorState({
        isVisible: true,
        message: event.detail.message,
        url: event.detail.url
      });

      // Auto-hide the error after 10 seconds
      setTimeout(() => {
        setErrorState((prev) => ({ ...prev, isVisible: false }));
      }, 10000);
    };

    // Add event listener
    window.addEventListener('api:cors-error', handleCorsError as EventListener);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('api:cors-error', handleCorsError as EventListener);
    };
  }, []);

  // If no error or error is hidden, don't render anything
  if (!errorState.isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-red-50 border-l-4 border-red-500 p-4 shadow-md rounded-md z-50">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">API Connection Error</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{errorState.message}</p>
            {errorState.url && (
              <p className="mt-1 text-xs text-red-500">
                Failed endpoint: {errorState.url}
              </p>
            )}
          </div>
          <div className="mt-3">
            <div className="-mx-2 -my-1.5 flex">
              <button
                type="button"
                className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100"
                onClick={() => setErrorState((prev) => ({ ...prev, isVisible: false }))}
              >
                Dismiss
              </button>
              <button
                type="button"
                className="ml-3 rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorsErrorHandler; 