"use client";

import React, { forwardRef } from "react";
import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css';

// Create a dynamic import of ReactQuill that's only loaded on the client
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    return RQ;
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

// Create a forwarded ref wrapper component
const NoSSRQuill = forwardRef((props: any, ref) => {
  return <ReactQuill ref={ref} {...props} />;
});

NoSSRQuill.displayName = 'NoSSRQuill';

export default NoSSRQuill; 