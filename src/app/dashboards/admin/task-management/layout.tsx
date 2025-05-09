import React from 'react';

export default function TaskManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="task-management-layout">
      {children}
    </div>
  );
} 