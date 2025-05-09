import React from 'react';

export default function HomeEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="home-editor-layout">
      {children}
    </div>
  );
} 