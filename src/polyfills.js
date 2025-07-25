// React Server Environment Polyfills

// Handle 'self' not defined in Node.js environment
if (typeof self === 'undefined') {
  global.self = global;
}

// Polyfill for ReactCurrentDispatcher
if (typeof window === 'undefined') {
  // Only run on the server - use dynamic import for React
  import('react').then(React => {
    if (!React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
      React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {};
    }
    
    if (!React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher) {
      React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher = {
        current: {
          readContext: () => {},
          useContext: () => {},
          useMemo: () => {},
          useReducer: () => {},
          useRef: () => {},
          useState: () => {},
          useEffect: () => {},
          useLayoutEffect: () => {},
          useCallback: () => {},
          useImperativeHandle: () => {},
          useDebugValue: () => {}
        }
      };
    }
  }).catch(() => {
    // Silently handle React import errors in polyfill context
  });
}

// Export empty module to allow importing
export {}; 