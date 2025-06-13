'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

// ===== TYPES =====

interface ILoadingState {
  id: string;
  type: 'data' | 'upload' | 'processing' | 'mutation';
  message: string;
  progress?: number;
  details?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
}

interface IServerLoadingContextType {
  loadingStates: ILoadingState[];
  startLoading: (config: Omit<ILoadingState, 'id' | 'timestamp'>) => string;
  updateLoading: (id: string, updates: Partial<ILoadingState>) => void;
  stopLoading: (id: string) => void;
  clearAllLoading: () => void;
  isLoading: boolean;
  hasCriticalLoading: boolean;
  showGlobalProgress: boolean;
  globalProgress: number;
}

// ===== CONTEXT =====

const ServerLoadingContext = createContext<IServerLoadingContextType | null>(null);

export const useServerLoading = (): IServerLoadingContextType => {
  const context = useContext(ServerLoadingContext);
  if (!context) {
    throw new Error('useServerLoading must be used within ServerLoadingProvider');
  }
  return context;
};

// ===== PROVIDER COMPONENT =====

interface IServerLoadingProviderProps {
  children: ReactNode;
  showGlobalIndicator?: boolean;
  maxDisplayedStates?: number;
  autoHideDelay?: number;
}

export const ServerLoadingProvider: React.FC<IServerLoadingProviderProps> = ({
  children,
  showGlobalIndicator = true,
  maxDisplayedStates = 3,
  autoHideDelay = 5000
}) => {
  const [loadingStates, setLoadingStates] = useState<ILoadingState[]>([]);
  const [showGlobalProgress, setShowGlobalProgress] = useState(false);

  // Generate unique IDs for loading states
  const generateId = useCallback(() => {
    return `loading_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Start a new loading state
  const startLoading = useCallback((config: Omit<ILoadingState, 'id' | 'timestamp'>) => {
    const id = generateId();
    const newState: ILoadingState = {
      ...config,
      id,
      timestamp: Date.now()
    };

    setLoadingStates(prev => [...prev, newState]);
    
    // Show global progress for critical operations
    if (config.priority === 'critical') {
      setShowGlobalProgress(true);
    }

    return id;
  }, [generateId]);

  // Update an existing loading state
  const updateLoading = useCallback((id: string, updates: Partial<ILoadingState>) => {
    setLoadingStates(prev => 
      prev.map(state => 
        state.id === id 
          ? { ...state, ...updates, timestamp: Date.now() }
          : state
      )
    );
  }, []);

  // Stop a loading state
  const stopLoading = useCallback((id: string) => {
    setLoadingStates(prev => prev.filter(state => state.id !== id));
  }, []);

  // Clear all loading states
  const clearAllLoading = useCallback(() => {
    setLoadingStates([]);
    setShowGlobalProgress(false);
  }, []);

  // Auto-hide completed or stale loading states
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setLoadingStates(prev => 
        prev.filter(state => now - state.timestamp < autoHideDelay)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [autoHideDelay]);

  // Hide global progress when no critical operations
  useEffect(() => {
    const hasCritical = loadingStates.some(state => state.priority === 'critical');
    if (!hasCritical) {
      setShowGlobalProgress(false);
    }
  }, [loadingStates]);

  // Computed values
  const isLoading = loadingStates.length > 0;
  const hasCriticalLoading = loadingStates.some(state => state.priority === 'critical');
  const globalProgress = loadingStates.length > 0 
    ? loadingStates.reduce((sum, state) => sum + (state.progress || 0), 0) / loadingStates.length
    : 0;

  const contextValue: IServerLoadingContextType = {
    loadingStates,
    startLoading,
    updateLoading,
    stopLoading,
    clearAllLoading,
    isLoading,
    hasCriticalLoading,
    showGlobalProgress,
    globalProgress
  };

  return (
    <ServerLoadingContext.Provider value={contextValue}>
      {children}
      
      {/* Global Loading Indicators */}
      {showGlobalIndicator && (
        <>
          <GlobalProgressIndicator />
          <LoadingNotifications maxDisplay={maxDisplayedStates} />
        </>
      )}
    </ServerLoadingContext.Provider>
  );
};

// ===== LOADING COMPONENTS =====

/**
 * Global progress indicator for critical operations
 */
const GlobalProgressIndicator: React.FC = () => {
  const { showGlobalProgress, globalProgress, hasCriticalLoading } = useServerLoading();

  return (
    <AnimatePresence>
      {(showGlobalProgress || hasCriticalLoading) && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700"
        >
          <div className="h-1 bg-gray-200 dark:bg-gray-700">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
              initial={{ width: 0 }}
              animate={{ width: `${globalProgress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
          
          <div className="px-6 py-3 flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin text-primary-500 mr-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Processing server operations...
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Loading notification toasts
 */
interface ILoadingNotificationsProps {
  maxDisplay: number;
}

const LoadingNotifications: React.FC<ILoadingNotificationsProps> = ({ maxDisplay }) => {
  const { loadingStates } = useServerLoading();

  // Show only high priority or recent loading states
  const displayedStates = loadingStates
    .filter(state => state.priority === 'high' || state.priority === 'critical')
    .slice(0, maxDisplay);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {displayedStates.map(state => (
          <LoadingNotification key={state.id} state={state} />
        ))}
      </AnimatePresence>
    </div>
  );
};

/**
 * Individual loading notification
 */
interface ILoadingNotificationProps {
  state: ILoadingState;
}

const LoadingNotification: React.FC<ILoadingNotificationProps> = ({ state }) => {
  const getIcon = () => {
    switch (state.type) {
      case 'upload':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin text-purple-500" />;
      case 'mutation':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return <Loader2 className="w-4 h-4 animate-spin text-primary-500" />;
    }
  };

  const getBorderColor = () => {
    switch (state.priority) {
      case 'critical':
        return 'border-red-200 dark:border-red-800';
      case 'high':
        return 'border-orange-200 dark:border-orange-800';
      case 'medium':
        return 'border-blue-200 dark:border-blue-800';
      default:
        return 'border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      className={`
        max-w-sm bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-lg border shadow-lg
        ${getBorderColor()}
      `}
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {state.message}
            </p>
            {state.details && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {state.details}
              </p>
            )}
            
            {state.progress !== undefined && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(state.progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <motion.div
                    className="bg-primary-500 h-1.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${state.progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ===== UTILITY HOOKS =====

/**
 * Hook for managing server loading states with automatic cleanup
 */
export const useServerLoadingState = () => {
  const { startLoading, updateLoading, stopLoading } = useServerLoading();

  const createLoadingState = useCallback((
    type: ILoadingState['type'],
    message: string,
    priority: ILoadingState['priority'] = 'medium',
    details?: string
  ) => {
    const id = startLoading({ type, message, priority, details });
    
    return {
      id,
      update: (updates: Partial<ILoadingState>) => updateLoading(id, updates),
      complete: () => stopLoading(id),
      setProgress: (progress: number) => updateLoading(id, { progress }),
      setMessage: (message: string) => updateLoading(id, { message }),
      setDetails: (details: string) => updateLoading(id, { details })
    };
  }, [startLoading, updateLoading, stopLoading]);

  return createLoadingState;
};

/**
 * Hook for tracking multiple operations with unified progress
 */
export const useServerOperationGroup = (groupName: string) => {
  const createLoadingState = useServerLoadingState();
  const [operations, setOperations] = useState<Map<string, any>>(new Map());

  const addOperation = useCallback((operationId: string, message: string) => {
    const loadingState = createLoadingState('processing', message, 'medium', `${groupName}: ${operationId}`);
    setOperations(prev => new Map(prev).set(operationId, loadingState));
    return loadingState;
  }, [createLoadingState, groupName]);

  const completeOperation = useCallback((operationId: string) => {
    const operation = operations.get(operationId);
    if (operation) {
      operation.complete();
      setOperations(prev => {
        const newMap = new Map(prev);
        newMap.delete(operationId);
        return newMap;
      });
    }
  }, [operations]);

  const completeAllOperations = useCallback(() => {
    operations.forEach(operation => operation.complete());
    setOperations(new Map());
  }, [operations]);

  return {
    addOperation,
    completeOperation,
    completeAllOperations,
    activeOperations: operations.size
  };
}; 