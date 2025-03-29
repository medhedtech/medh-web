"use client";

import React from "react";
import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css';

// Create a dynamic import of ReactQuill that's only loaded on the client
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    
    // Return a wrapper component that doesn't use findDOMNode
    return function NoSSRQuill({ forwardedRef, ...props }: any) {
      return <RQ {...props} />;
    };
  },
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-400">
        Loading editor...
      </div>
    ),
  }
);

// Export the component with the same props interface as ReactQuill
const NoSSRQuill: React.FC<any> = (props) => {
  return <ReactQuill {...props} />;
};

export default NoSSRQuill; 