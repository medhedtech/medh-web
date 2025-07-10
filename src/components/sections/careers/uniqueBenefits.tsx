"use client";

import React, { useState, useEffect, memo } from "react";
import WelcomeCareers from "./welcomeCareers";

const UniqueBenefits: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full py-12 flex items-center justify-center">
        <div className="animate-pulse space-y-8 w-full max-w-7xl">
          <div className="text-center space-y-4">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-full w-48 mx-auto" />
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-2xl w-96 mx-auto" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-80 mx-auto" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-slate-700/50">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
                    <div className="flex-1 space-y-2">
                      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <WelcomeCareers />;
};

export default memo(UniqueBenefits);
