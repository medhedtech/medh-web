import React from 'react';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: {
    title: string;
    description: string;
    hash: string;
  }[];
  onStepClick?: (stepIndex: number) => void;
  isStepClickable?: (stepIndex: number) => boolean;
}

const StepProgress: React.FC<StepProgressProps> = ({ 
  currentStep, 
  totalSteps, 
  steps,
  onStepClick,
  isStepClickable = () => true
}) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Course Form</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      <div className="relative">
        {/* Progress Bar */}
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
          <div
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500 dark:bg-primary-400 transition-all duration-500"
          />
        </div>

        {/* Steps */}
        <div className="flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep - 1;
            const isCurrent = index === currentStep - 1;
            const isClickable = onStepClick && isStepClickable(index + 1);

            return (
              <div
                key={index}
                className={`flex flex-col items-center ${
                  index === steps.length - 1 ? 'flex-1' : 'flex-1'
                }`}
                onClick={() => isClickable && onStepClick(index + 1)}
                role={isClickable ? "button" : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onKeyPress={(e) => {
                  if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                    onStepClick(index + 1);
                  }
                }}
              >
                <div
                  style={{ paddingLeft: `${(index - 2) * 3}px` }}
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-500 ${
                    isCompleted
                      ? 'bg-primary-500 dark:bg-primary-400 text-white'
                      : isCurrent
                      ? 'bg-primary-500 dark:bg-primary-400 text-white'
                      : isClickable
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <div 
                  className={`text-center mt-2 ${isClickable ? 'cursor-pointer' : ''}`}
                >
                  <div
                    className={`text-sm font-medium ${
                      isCompleted || isCurrent 
                        ? 'text-gray-900 dark:text-gray-100' 
                        : isClickable 
                        ? 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                        : 'text-gray-500 dark:text-gray-500'
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className={`text-xs ${
                    isCompleted || isCurrent 
                      ? 'text-gray-600 dark:text-gray-400' 
                      : isClickable 
                      ? 'text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                      : 'text-gray-400 dark:text-gray-600'
                  } hidden md:block`}>
                    {step.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepProgress; 