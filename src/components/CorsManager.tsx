import React from 'react';
import CorsErrorHandler from './CorsErrorHandler';
import CorsTestPanel from './CorsTestPanel';

/**
 * Component that renders both the CORS error handler for all environments
 * and the CORS test panel only in development
 */
const CorsManager: React.FC = () => {
  return (
    <>
      <CorsErrorHandler />
      <CorsTestPanel />
    </>
  );
};

export default CorsManager; 