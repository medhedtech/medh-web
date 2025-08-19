import React from 'react';

interface StudentProfilePageProps {
  studentId?: string;
}

const TestComponent: React.FC<StudentProfilePageProps> = ({ studentId }) => {
  const profile = { test: true };
  
  const { 
    test
  } = profile;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <p>Test</p>
      </div>
    </div>
  );
};

export default TestComponent;
