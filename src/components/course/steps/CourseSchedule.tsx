import React from 'react';
import { UseFormRegister, UseFormSetValue, FormState } from 'react-hook-form';
import { ICourseFormData } from '@/types/course.types';
import { Clock, Calendar } from 'lucide-react';

interface CourseScheduleProps {
  register: UseFormRegister<ICourseFormData>;
  setValue: UseFormSetValue<ICourseFormData>;
  formState: {
    errors: FormState<ICourseFormData>['errors'];
  };
}

const CourseSchedule: React.FC<CourseScheduleProps> = ({
  register,
  setValue,
  formState: { errors }
}) => {
  const [courseDuration, setCourseDuration] = React.useState({ months: '', weeks: '' });
  const [sessionDuration, setSessionDuration] = React.useState({ hours: '', minutes: '' });

  const handleCourseDurationChange = (field: 'months' | 'weeks', value: string) => {
    const newDuration = { ...courseDuration, [field]: value };
    setCourseDuration(newDuration);
    
    if (newDuration.months || newDuration.weeks) {
      const formattedDuration = `${newDuration.months || '0'} months ${newDuration.weeks || '0'} weeks`;
      setValue('course_duration', formattedDuration);
    }
  };

  const handleSessionDurationChange = (field: 'hours' | 'minutes', value: string) => {
    const newDuration = { ...sessionDuration, [field]: value };
    setSessionDuration(newDuration);
    
    if (newDuration.hours || newDuration.minutes) {
      const formattedDuration = `${newDuration.hours || '0'} hours ${newDuration.minutes || '0'} minutes`;
      setValue('session_duration', formattedDuration);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Course Schedule</h2>

      {/* Number of Sessions */}
      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            Number of Sessions
            <span className="text-red-500 ml-1">*</span>
          </span>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              {...register('no_of_Sessions')}
              className={`block w-full pl-10 rounded-md shadow-sm focus:ring-customGreen focus:border-customGreen
                ${errors.no_of_Sessions ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
              placeholder="Enter number of sessions"
              min="1"
            />
          </div>
          {errors.no_of_Sessions && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.no_of_Sessions.message}</p>
          )}
        </label>
      </div>

      {/* Course Duration */}
      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            Course Duration
            <span className="text-red-500 ml-1">*</span>
          </span>
          <div className="mt-1 grid grid-cols-2 gap-4">
            <div className="relative rounded-md shadow-sm">
              <input
                type="number"
                value={courseDuration.months}
                onChange={(e) => handleCourseDurationChange('months', e.target.value)}
                className={`block w-full rounded-md shadow-sm focus:ring-customGreen focus:border-customGreen
                  ${errors.course_duration ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                placeholder="Months"
                min="0"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">months</span>
              </div>
            </div>
            <div className="relative rounded-md shadow-sm">
              <input
                type="number"
                value={courseDuration.weeks}
                onChange={(e) => handleCourseDurationChange('weeks', e.target.value)}
                className={`block w-full rounded-md shadow-sm focus:ring-customGreen focus:border-customGreen
                  ${errors.course_duration ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                placeholder="Weeks"
                min="0"
                max="3"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">weeks</span>
              </div>
            </div>
          </div>
          {errors.course_duration && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.course_duration.message}</p>
          )}
        </label>
      </div>

      {/* Session Duration */}
      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            Session Duration
            <span className="text-red-500 ml-1">*</span>
          </span>
          <div className="mt-1 grid grid-cols-2 gap-4">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                value={sessionDuration.hours}
                onChange={(e) => handleSessionDurationChange('hours', e.target.value)}
                className={`block w-full pl-10 rounded-md shadow-sm focus:ring-customGreen focus:border-customGreen
                  ${errors.session_duration ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                placeholder="Hours"
                min="0"
                max="8"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">hours</span>
              </div>
            </div>
            <div className="relative rounded-md shadow-sm">
              <input
                type="number"
                value={sessionDuration.minutes}
                onChange={(e) => handleSessionDurationChange('minutes', e.target.value)}
                className={`block w-full rounded-md shadow-sm focus:ring-customGreen focus:border-customGreen
                  ${errors.session_duration ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                placeholder="Minutes"
                min="0"
                max="59"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">mins</span>
              </div>
            </div>
          </div>
          {errors.session_duration && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.session_duration.message}</p>
          )}
        </label>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-500 p-4 mt-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400 dark:text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              The total duration should align with the number of sessions and session duration.
              Make sure to plan your course schedule accordingly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSchedule; 