import React, { createContext, useContext, useState, ReactNode } from 'react';
import { OverlayLoading } from '@/components/ui/loading';

interface LoadingContextType {
  isLoading: boolean;
  loadingText?: string;
  showLoading: (text?: string) => void;
  hideLoading: () => void;
  setLoadingText: (text: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingTextState] = useState<string | undefined>();

  const showLoading = (text?: string) => {
    setLoadingTextState(text);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
    setLoadingTextState(undefined);
  };

  const setLoadingText = (text: string) => {
    setLoadingTextState(text);
  };

  const value: LoadingContextType = {
    isLoading,
    loadingText,
    showLoading,
    hideLoading,
    setLoadingText,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {isLoading && (
        <OverlayLoading 
          text={loadingText || 'Loading...'} 
          size="lg" 
        />
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

// Hook for API calls with automatic loading states
export const useApiLoading = () => {
  const { showLoading, hideLoading, setLoadingText } = useLoading();

  const withLoading = async <T,>(
    apiCall: () => Promise<T>,
    loadingText?: string
  ): Promise<T> => {
    try {
      showLoading(loadingText);
      const result = await apiCall();
      return result;
    } finally {
      hideLoading();
    }
  };

  return {
    withLoading,
    showLoading,
    hideLoading,
    setLoadingText,
  };
};

export default LoadingContext; 