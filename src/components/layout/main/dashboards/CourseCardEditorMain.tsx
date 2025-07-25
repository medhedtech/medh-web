"use client";

import React from "react";

/**
 * Temporary placeholder for the admin Course Card Editor.
 * This prevents build-time module-not-found errors after recent refactors
 * removed the original implementation.
 *
 * TODO: Re-implement full course-card editor or replace usages.
 */
const CourseCardEditorMain: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Course Card Editor
      </h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-md text-center">
        This feature is currently under construction. Please check back later.
      </p>
    </div>
  );
};

export default CourseCardEditorMain; 